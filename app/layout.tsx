import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "یزد افشین | تولیدکننده روفرشی و نساجی",
  description:
    "نساجی یزد افشین، تولیدکننده انواع روفرشی، پتوفرش و زیرسفره‌ای با نیم قرن تجربه و طراحی ماندگار.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
