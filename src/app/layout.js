import "./globals.css";
import Navbar from "@/components/navbar";

export const metadata = {
    title: "Ng Zhao Hui — Portfolio",
    description: "Computer science student and aspiring fintech engineer.",
};

// Applies the saved (or system) theme before paint to avoid a flash.
const noFlashTheme = `(function(){try{var t=localStorage.getItem('theme');if(!t){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}document.documentElement.dataset.theme=t;}catch(e){}})();`;

export default function RootLayout({ children }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body>
                <script dangerouslySetInnerHTML={{ __html: noFlashTheme }} />
                <Navbar />
                {children}
            </body>
        </html>
    );
}
