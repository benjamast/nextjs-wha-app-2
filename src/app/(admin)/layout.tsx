import type { Metadata } from "next";
import { Prompt, Roboto, Lora } from "next/font/google";
import { cn } from "@/lib/utils";
import { Toaster } from "sonner";
import { Sidebar } from "@/components/admin/sidebar";
import "../globals.css";

const loraHeading = Lora({ subsets: ['latin'], variable: '--font-heading' });
const roboto = Roboto({ subsets: ['latin'], variable: '--font-sans' });
const promptFont = Prompt({
  weight: ['400', '500', '700'],
  subsets: ['thai'],
  display: 'swap'
});

export const metadata: Metadata = {
  title: "Admin Dashboard — ShopVibe",
  description: "ระบบจัดการร้านค้า",
};

export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="th" className={cn(promptFont.className, "font-sans", roboto.variable, loraHeading.variable)}>
      <body>
        <div className="flex min-h-screen bg-background">
          <Sidebar />
          <main className="flex-1 overflow-auto">
            <div className="mx-auto max-w-7xl p-6 lg:p-8">
              {children}
            </div>
          </main>
        </div>
        <Toaster richColors />
      </body>
    </html>
  );
}
