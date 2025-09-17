import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import "./globals.css";
import { Provider } from "@/components/ui/provider";
import { CartProvider } from "@/contexts/cart-context";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Frozen Haven - Fresh & Affordable Frozen Foods",
    template: "%s | Frozen Haven"
  },
  description: "Quality frozen products delivered to your doorstep. Shop from our wide selection of fresh meats, seafood, and more in Ghana.",
  keywords: ["frozen foods", "meat", "seafood", "poultry", "Ghana", "delivery", "fresh", "affordable"],
  authors: [{ name: "Frozen Haven" }],
  creator: "Frozen Haven",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://frozenhaven.com",
    siteName: "Frozen Haven",
    title: "Frozen Haven - Fresh & Affordable Frozen Foods",
    description: "Quality frozen products delivered to your doorstep. Shop from our wide selection of fresh meats, seafood, and more.",
    images: [
      {
        url: "/og-image.png", // You'll need to add this image
        width: 1200,
        height: 630,
        alt: "Frozen Haven - Fresh Frozen Foods",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Frozen Haven - Fresh & Affordable Frozen Foods",
    description: "Quality frozen products delivered to your doorstep.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${archivo.variable}`}>
        <Provider>
          <CartProvider>
            {children}
          </CartProvider>
        </Provider>
      </body>
    </html>
  );
}
