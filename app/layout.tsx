import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { DevAlignmentGuide } from "./components/DevAlignmentGuide";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Painel Financeiro | Finnance App",
    template: "%s | Finnance App",
  },
  description:
    "Painel financeiro com visão geral de receitas, despesas, metas e indicadores em layout responsivo.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Painel Financeiro | Finnance App",
    description:
      "Acompanhe receitas, despesas, metas e desempenho em um painel claro e responsivo.",
    url: "/",
    siteName: "Finnance App",
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Painel Financeiro | Finnance App",
    description:
      "Acompanhe receitas, despesas, metas e desempenho em um painel claro e responsivo.",
  },
};

type RootLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="pt-BR" className={outfit.variable}>
      <body>
        {children}
        {process.env.NODE_ENV === "development" ? <DevAlignmentGuide /> : null}
      </body>
    </html>
  );
}
