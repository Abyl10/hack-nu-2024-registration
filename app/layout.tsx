import { IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import { Button, buttonVariants } from "@/components/ui/button";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import type { Metadata } from "next";
import Image from "next/image";

import Link from "next/link";
import "./globals.css";
import { cn } from "@/lib/utils";
import Icons from "@/components/icons";

export const metadata: Metadata = {
  title: "Hack NU 2024 | Registration",
  description: "Create. Explore. Divide. Conquer",
};

const IBMPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: "600",
});

const IBMPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: "600",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <header className="container py-8 flex justify-between">
            <Link href="/">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="56"
                height="40"
                viewBox="0 0 56 40"
                fill="none"
              >
                <path
                  d="M48.2144 19.4478C47.5564 15.514 41.6851 -4.33056 44.4851 0.859671C57.1249 24.2889 63.7277 39.1514 40.7817 39.1514C40.7817 39.1514 43.3678 36.7926 44.8561 33.5215C46.3475 30.2437 46.3268 26.9286 46.3268 26.9286C50.25 26.3288 48.8043 22.9751 48.2144 19.4478Z"
                  fill="#58E191"
                />
                <path
                  d="M7.78562 19.4478C8.44355 15.514 14.3149 -4.33056 11.5149 0.859671C-1.1249 24.2889 -7.72767 39.1514 15.2183 39.1514C15.2183 39.1514 12.6322 36.7926 11.1439 33.5215C9.65252 30.2437 9.67325 26.9286 9.67325 26.9286C5.74999 26.3288 7.19567 22.9751 7.78562 19.4478Z"
                  fill="#58E191"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M28 14.5793C21.5774 14.5793 16.4469 19.7475 16.4469 26.0278C16.4469 32.3081 21.5774 37.4762 28 37.4762C34.4226 37.4762 39.5531 32.3081 39.5531 26.0278C39.5531 19.7475 34.4226 14.5793 28 14.5793ZM14 26.0278C14 18.2687 20.31 12.0557 28 12.0557C35.69 12.0557 42 18.2687 42 26.0278C42 33.7869 35.69 39.9999 28 39.9999C20.31 39.9999 14 33.7869 14 26.0278Z"
                  fill="#58E191"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M33.7225 24.2226C33.105 24.9441 32.1867 25.4015 31.1613 25.4015C29.3017 25.4015 27.7942 23.897 27.7942 22.0411C27.7942 21.2985 28.0356 20.6122 28.4442 20.056C28.2976 20.0452 28.1494 20.0398 28 20.0398C24.6863 20.0398 22 22.7207 22 26.0278C22 29.3349 24.6863 32.0159 28 32.0159C31.3137 32.0159 34 29.3349 34 26.0278C34 25.3987 33.9028 24.7923 33.7225 24.2226Z"
                  fill="#58E191"
                />
              </svg>
            </Link>
            <div className="flex gap-4">
              {/* <Link
                href="/list"
                className={buttonVariants({ variant: "outline" })}
              >
                <span className="font-bold">Participants</span>
              </Link> */}
              <Link href="https://hack.nuacm.kz/">
                <Button
                  variant={"hacknu"}
                  size={"xlg"}
                  className={cn(
                    "relative font-semibold",
                    IBMPlexMono.className
                  )}
                >
                  <Icons.barCode className="absolute top-1 left-1" />
                  HOME
                  <span className="uppercase pb-0 text-white text-opacity-30 text-[10px] absolute bottom-[1px] mix-blend-difference right-1 font-normal">
                    0x800f081f
                  </span>
                </Button>
              </Link>
            </div>
          </header>

          <main className="flex justify-center px-4 lg:px-0">{children}</main>

          <footer className="w-full container flex justify-center py-8 text-muted-foreground text-sm">
            hacknu 2024 by ACM SC
          </footer>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
