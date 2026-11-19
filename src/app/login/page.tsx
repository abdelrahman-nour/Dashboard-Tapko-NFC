import type { Metadata } from "next";
import LoginScreen from "./login-screen";

export const metadata: Metadata = {
  title: "تسجيل الدخول | Tapko",
  robots: {
    index: false,
    follow: false,
  },
};

type Props = {
  searchParams: Promise<{
    error?: string | string[];
  }>;
};

const messages: Record<string, string> = {
  missing: "اكتب الإيميل وكلمة المرور.",
  invalid: "بيانات الدخول غير صحيحة أو الحساب غير مؤكّد.",
  forbidden: "الحساب ده مش مضاف ضمن إدارة Tapko.",
  connection: "تعذّر التحقق من صلاحية الإدارة. حاول مرة أخرى.",
};

export default async function LoginPage({ searchParams }: Props) {
  const params = await searchParams;
  const code = typeof params.error === "string" ? params.error : "";

  return <LoginScreen errorMessage={messages[code]} />;
}
