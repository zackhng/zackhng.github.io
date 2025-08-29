import "./globals.css";
import Navbar from "@/components/navbar";

export default function RootLayout({ children }) {
  const navbarMap = [
    {name: "Home", link: "/" },
    {name: "About", link: "/about" },
    {name: "Resume", link: "/resume" },
    {name: "Projects", link: "/projects" },
  ]
  return (
    <html lang="en">
      <body>
        <Navbar navbarArray={navbarMap}/>
        {children}
      </body>
    </html>
  );
}
