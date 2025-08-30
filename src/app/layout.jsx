import { Orbitron, Poppins, Josefin_Sans } from "next/font/google";
import "./globals.css";
import Logo from "/src/components/Logo/logo";

const orbitron = Orbitron({
    subsets: ["latin"],
    weight: ["500", "700"],
    variable: "--font-orbitron",
});

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700"],
    variable: "--font-poppins",
});

const josefinSans = Josefin_Sans({
    subsets: ["latin"],
    weight: ["400", "700"],
    variable: "--font-josefin-sans",
});

export const metadata = {
    title: "e-Move",
    description: "Plataforma de mobilidade elétrica",
};

export default function RootLayout({ children }) {
    return (
        <html lang="pt-br">
        <head>
            <link
                rel="stylesheet"
                href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
                integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw=="
                crossOrigin="anonymous"
                referrerPolicy="no-referrer"
            />
        </head>
        <body
            className={`${orbitron.variable} ${poppins.variable} ${josefinSans.variable}`}
        >
        <Logo />
        {children}
        </body>
        </html>
    );
}