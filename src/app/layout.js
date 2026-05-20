import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JwtSaver from "@/components/auth/JwtSaver";
import { Toaster } from "sonner";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata = {
    title: "IdeaVault || Araf",
    description: "Startup Idea Sharing Platform",
};

export default function RootLayout({ children }) {
    return (
        <html data-theme="light" lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`} >
            <body className="min-h-full flex flex-col">
                <JwtSaver />
                <Navbar />
                {children}

                <Footer />
                <Toaster position="top-center" richColors />
            </body>
        </html>
    );
}
