---
name: docker-deploy
description: >
  Use this skill when building and deploying the Next.js app via Docker.
  Triggers on: "docker build", "docker deploy", "deploy to docker",
  "build container", "docker run", "stop container", "docker push",
  "rebuild docker", or any Docker workflow request. Covers the full
  build-stop-rm-run chain, port mapping, env injection, Prisma setup,
  and project-specific gotchas (standalone output, non-root user,
  MariaDB driver adapter).
---

# Docker Deploy Guide

## Prerequisites

- Docker installed (`docker --version`)
- `.env` file ใน project root (มี `DATABASE_URL` สำหรับ MariaDB + env อื่นๆ)
- Port `4000` ไม่ถูกใช้งานบน host (หรือเปลี่ยน `-p` ตามต้องการ)

---

## Quick Start (Full Chain)

คำสั่ง build → replace container → run:

```bash
docker build -t nextgentwha:latest . \
  && docker stop nextgentwha-container \
  && docker rm nextgentwha-container \
  && docker run -d \
    -p 4000:3000 \
    --name nextgentwha-container \
    --env-file .env \
    nextgentwha:latest
```

รอ build แล้วเข้า `http://localhost:4000`

---

## Step-by-Step

### 1. Build Image

```bash
docker build -t nextgentwha:latest .
```

**Multi-stage build ใน Dockerfile:**
| Stage | Base | หน้าที่ |
|-------|------|--------|
| `deps` | `node:24-alpine` | ติดตั้ง dependencies (npm ci) |
| `builder` | `node:24-alpine` | Prisma generate + Next.js build |
| `runner` | `node:24-alpine` | รัน `server.js` ด้วย non-root user `nextjs` |

**หมายเหตุ:** Dockerfile ใช้ `output: "standalone"` — คัดลอกเฉพาะ `.next/standalone`, `.next/static`, `generated/`, `prisma/` เข้า runner stage เพื่อลดขนาด image

### 2. Stop & Remove Container เก่า

```bash
docker stop nextgentwha-container
docker rm nextgentwha-container
```

ใช้ `&&` เพื่อให้ chain หยุดถ้า container ไม่มีอยู่ (Optional: ใช้ `|| true` ถ้าต้องการไม่ให้ error หยุด chain)

### 3. Run Container

```bash
docker run -d \
  -p 4000:3000 \
  --name nextgentwha-container \
  --env-file .env \
  nextgentwha:latest
```

| Flag | ความหมาย |
|------|-----------|
| `-d` | Detached mode (background) |
| `-p 4000:3000` | Map host port 4000 → container port 3000 |
| `--name` | ชื่อ container (ใช้อ้างอิงตอน stop/rm/logs) |
| `--env-file .env` | Inject env variables จากไฟล์ `.env` |

---

## Verification

```bash
# ตรวจสอบ container รันอยู่
docker ps --filter name=nextgentwha-container

# ดู logs
docker logs nextgentwha-container

# ดู logs แบบ real-time
docker logs -f nextgentwha-container

# ทดสอบ HTTP
curl -s -o /dev/null -w "%{http_code}" http://localhost:4000

# เข้า shell ใน container
docker exec -it nextgentwha-container sh
```

---

## Project-Specific Gotchas

- **Standalone output** — `next.config.ts` มี `output: 'standalone'` อยู่แล้ว ตรวจสอบให้แน่ใจว่าถ้า deploy บนแพลตฟอร์มอื่น (Vercel) ต้องลบ หรือใช้ env override
- **Prisma MariaDB (driver adapter)** — Container ต้องเชื่อมต่อ MariaDB ที่ host หรือ container อื่น ใช้ `DATABASE_URL` ใน `.env` ที่ inject ผ่าน `--env-file`
- **DATABASE_URL สำหรับ build stage** — Dockerfile ใช้ `ARG DATABASE_URL=mysql://build:build@localhost:3306/build` dummy value แค่ให้ `prisma generate` ผ่าน แล้ว env จริงจะ inject ตอน `docker run`
- **Non-root user** — Container รันด้วย user `nextjs` (UID 1001) ถ้าต้องการเขียนไฟล์ใน container ต้อง mount volume ด้วย `--user` หรือปรับ permission
- **Port 4000** — ใช้ `-p 4000:3000` (ไม่ใช่ 3000 ตรง) เพื่อป้องกัน conflict กับ dev server
- **Image size** — `node:24-alpine` เบา (~120MB) แต่ Prisma generate + Next.js build อาจกิน RAM ในขั้นตอน build

---

## Troubleshooting

| ปัญหา | สาเหตุ / วิธีแก้ |
|-------|-----------------|
| Build error `prisma generate` ล้มเหลว | เช็คว่า `prisma/` และ `prisma.config.ts` ถูกต้อง |
| Container crash ทันที | `docker logs nextgentwha-container` ดู error — มักเป็น `DATABASE_URL` ไม่ถูกต้อง |
| Connection refused ไป MariaDB | MariaDB host ใน `.env` ต้องใช้ `host.docker.internal` (Mac/Windows) หรือ IP bridge network |
| 404 หรือ routing ผิด | Next.js standalone ต้องใช้ `HOSTNAME="0.0.0.0"` — มีแล้วใน Dockerfile |
| Permission denied ตอน write file | Container รันเป็น `nextjs` — ใช้ Docker volume ที่ `chown` ให้ UID 1001 |

---

## Cleanup

```bash
# หยุดและลบ container
docker stop nextgentwha-container && docker rm nextgentwha-container

# ลบ image
docker rmi nextgentwha:latest

# ลบ unused images/containers/cache
docker system prune -f
```
