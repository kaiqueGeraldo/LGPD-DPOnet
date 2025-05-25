import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Questionário LGPD",
  description:
    "Projeto acadêmico desenvolvido com o objetivo de avaliar o nível de defasagem de conhecimento dos usuários em relação à Lei Geral de Proteção de Dados (LGPD). Através de um questionário dividido em níveis de dificuldade, o sistema identifica o grau de familiaridade do usuário com os princípios e práticas da LGPD.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
