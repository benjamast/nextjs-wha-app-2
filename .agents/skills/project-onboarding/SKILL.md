---
name: project-onboarding
description: Use when a new developer joins the project and needs to get up to speed with the codebase, architecture, and development practices.Trigger on "โปรเจกต์ใหม่ทำงานอย่างไร?" or any similar question about project onboarding.
compatibility:  User Node.js 22+
licence: MIT
metadata:
  author: Benjamast
  version: 1.0.0
---

##First-Time Setup 

```bash
# 1. Install dependencies
npm install     
# 2. Copy env
cp .env.example .env
# 3. Pull DB Schema(Prisma Orm)
npx prisma db pull
# 4. Generate Prisma Client
npx prisma generate
# 5. check lint
npm run lint

```
## Gotchas  
-ต้องติดตั้ง และปิด Docker Desktop ไว้
-ให้อธิบายการรัยโปรเจกต์ ใช้คำสั่ง npm run dev

## Output
-ถ้าถามการ setup ให้ตอบเป็นรูปแบบของตารางและอ่านง่าย

