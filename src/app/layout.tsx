import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import "./globals.css";
import RootProviders from "@/app/providers";
import {headers} from "next/headers";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "LicenStory",
    description: "Where IP License Becomes Business",
};

export default async function RootLayout({
                                             children,
                                         }: Readonly<{
    children: React.ReactNode;
}>) {
    const headersObj = await headers();
    const cookies = headersObj.get('cookie')
    return (
        <html lang="en">
        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
        <RootProviders cookies={cookies}>
            <div className={"w-full h-6 bg-chart-1"}></div>
            <div className={"flex min-h-screen p-20 bg-[#EAEAEA]"}>
                <div
                    className="m-auto w-full max-w-[700px] relative">
                    <div>
                        <h1 className={"font-bold text-5xl"}>
                            LicenStory
                        </h1>
                        <div>
                            <h2 className={"text-lg font-medium"}>
                                Where IP licensing becomes business
                            </h2>
                            <h3 className={"text-neutral-500"}>
                                Powered on Story Protocol, Leveraged by AGI
                            </h3>
                        </div>
                        <div className={"mt-[64px] bg-white border rounded-xl px-6  py-10 w-full border-black"}>
                            {children}
                        </div>

                    </div>
                </div>
            </div>
        </RootProviders>
        </body>
        </html>
    );
}
