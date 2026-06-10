import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../generated/prisma/client";
import { hashPassword } from "@better-auth/utils/password";

const adapter = new PrismaMariaDb(process.env.DATABASE_URL!);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  // ── 0. Clean existing data (order matters for FK constraints) ──
  await prisma.order_items.deleteMany();
  await prisma.orders.deleteMany();
  await prisma.product_images.deleteMany();
  await prisma.products.deleteMany();
  await prisma.customers.deleteMany();
  await prisma.categories.deleteMany();
  await prisma.account.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();
  await prisma.verification.deleteMany();

  await prisma.$executeRawUnsafe("ALTER TABLE categories AUTO_INCREMENT = 1");
  await prisma.$executeRawUnsafe("ALTER TABLE customers AUTO_INCREMENT = 1");
  await prisma.$executeRawUnsafe("ALTER TABLE orders AUTO_INCREMENT = 1");
  await prisma.$executeRawUnsafe("ALTER TABLE order_items AUTO_INCREMENT = 1");
  await prisma.$executeRawUnsafe("ALTER TABLE products AUTO_INCREMENT = 1");
  await prisma.$executeRawUnsafe("ALTER TABLE product_images AUTO_INCREMENT = 1");
  console.log("🧹 Cleared existing data");

  // ── 1. Admin User (for better-auth login) ──
  const adminEmail = "benjamast@wha-digital.com";
  const adminPassword = "Admin1234!";
  const hashed = await hashPassword(adminPassword);
  const adminId = crypto.randomUUID();

  await prisma.user.create({
    data: {
      id: adminId,
      name: "Admin",
      email: adminEmail,
      emailVerified: true,
      role: "admin",
    },
  });

  await prisma.account.create({
    data: {
      id: crypto.randomUUID(),
      accountId: adminEmail,
      providerId: "credential",
      userId: adminId,
      password: hashed,
    },
  });

  console.log(`✅ Created admin user: ${adminEmail} / ${adminPassword}`);

  // ── 2. Categories ──
  const categoryData = [
    { name: "สมาร์ทโฟน" },
    { name: "แล็ปท็อป" },
    { name: "หูฟัง" },
    { name: "แท็บเล็ต" },
    { name: "อุปกรณ์เสริม" },
  ];

  await prisma.categories.createMany({ data: categoryData });
  console.log(`✅ Created ${categoryData.length} categories`);

  // ── 3. Products ──
  const productData = [
    { name: "iPhone 16 Pro", description: "สมาร์ทโฟน Apple จอ 6.3 นิ้ว ชิป A18 Pro", price: 45900.0, category_id: 1 },
    { name: "Samsung Galaxy S25", description: "สมาร์ทโฟน Samsung จอ 6.2 นิ้ว ชิป Snapdragon 8 Elite", price: 32900.0, category_id: 1 },
    { name: "MacBook Air M3", description: "แล็ปท็อป Apple จอ 15 นิ้ว RAM 16GB SSD 512GB", price: 44900.0, category_id: 2 },
    { name: "AirPods Pro 2", description: "หูฟังไร้สาย Apple ตัดเสียงรบกวน USB-C", price: 8990.0, category_id: 3 },
    { name: "iPad Air M2", description: "แท็บเล็ต Apple จอ 13 นิ้ว ชิป M2", price: 33900.0, category_id: 4 },
  ];

  await prisma.products.createMany({ data: productData });
  console.log(`✅ Created ${productData.length} products`);

  // ── 4. Product Images ──
  const productImageData = [
    { product_id: 1, image_name: "iphone16pro-front.jpg" },
    { product_id: 1, image_name: "iphone16pro-back.jpg" },
    { product_id: 2, image_name: "galaxy-s25-front.jpg" },
    { product_id: 3, image_name: "macbook-air-m3-silver.jpg" },
    { product_id: 4, image_name: "airpods-pro2-case.jpg" },
  ];

  await prisma.product_images.createMany({ data: productImageData });
  console.log(`✅ Created ${productImageData.length} product images`);

  // ── 5. Customers ──
  const customerData = [
    { name: "สมชาย ใจดี", address: "123 ถ.สุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพฯ 10110", phone: "081-234-5678" },
    { name: "สมหญิง รักเรียน", address: "456 ถ.เชียงใหม่-ลำปาง ต.ช้างเผือก อ.เมือง เชียงใหม่ 50300", phone: "089-876-5432" },
    { name: "วิชัย โค้ดเก่ง", address: "789 ถ.มิตรภาพ ต.ในเมือง อ.เมือง นครราชสีมา 30000", phone: "092-345-6789" },
    { name: "นภา สุขสันต์", address: "321 ถ.อุปราช ต.ในเมือง อ.เมือง อุบลราชธานี 34000", phone: "063-456-7890" },
    { name: "พิมพ์ใจ ดีไซน์", address: "654 ถ.ราชดำเนิน ต.ประตูชัย อ.พระนครศรีอยุธยา 13000", phone: "095-567-8901" },
  ];

  await prisma.customers.createMany({ data: customerData });
  console.log(`✅ Created ${customerData.length} customers`);

  // ── 6. Orders ──
  const orderData = [
    { date: new Date("2026-06-01T09:30:00"), customer_id: 1, status: "delivered" as const, total_amount: 100790.0 },
    { date: new Date("2026-06-01T14:15:00"), customer_id: 2, status: "delivered" as const, total_amount: 53890.0 },
    { date: new Date("2026-06-02T10:00:00"), customer_id: 3, status: "processing" as const, total_amount: 41890.0 },
    { date: new Date("2026-06-02T16:45:00"), customer_id: 4, status: "received" as const, total_amount: 78800.0 },
    { date: new Date("2026-06-03T08:20:00"), customer_id: 5, status: "processing" as const, total_amount: 79800.0 },
  ];

  await prisma.orders.createMany({ data: orderData });
  console.log(`✅ Created ${orderData.length} orders`);

  // ── 7. Order Items ──
  const orderItemData = [
    // Order #1: สมชาย → iPhone 16 Pro x2 + AirPods Pro 2 x1 = 100,790
    { order_id: 1, product_id: 1, quantity: 2, price: 45900.0 },
    { order_id: 1, product_id: 4, quantity: 1, price: 8990.0 },
    // Order #2: สมหญิง → MacBook Air M3 x1 + AirPods Pro 2 x1 = 53,890
    { order_id: 2, product_id: 3, quantity: 1, price: 44900.0 },
    { order_id: 2, product_id: 4, quantity: 1, price: 8990.0 },
    // Order #3: วิชัย → Galaxy S25 x1 + AirPods Pro 2 x1 = 41,890
    { order_id: 3, product_id: 2, quantity: 1, price: 32900.0 },
    { order_id: 3, product_id: 4, quantity: 1, price: 8990.0 },
    // Order #4: นภา → MacBook Air M3 x1 + iPad Air M2 x1 = 78,800
    { order_id: 4, product_id: 3, quantity: 1, price: 44900.0 },
    { order_id: 4, product_id: 5, quantity: 1, price: 33900.0 },
    // Order #5: พิมพ์ใจ → iPhone 16 Pro x1 + iPad Air M2 x1 = 88,790
    { order_id: 5, product_id: 1, quantity: 1, price: 45900.0 },
    { order_id: 5, product_id: 5, quantity: 1, price: 33900.0 },
  ];

  await prisma.order_items.createMany({ data: orderItemData });
  console.log(`✅ Created ${orderItemData.length} order items`);

  console.log("🎉 Seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
