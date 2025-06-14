import Link from "next/link";
import styles from '@/styles/navbar.module.css'; // ✅ Correct path




export default function Navbar({style}) {
    return (
    <nav 
    style={{ display: 'flex', 
    padding: '1rem', 
    paddingLeft: '10%',
    paddingRight: '10%',
    paddingTop: '30px',
    borderBottom: '1px solid #ccc' , 
    justifyContent: 'space-between',
    width: '100%' , 
    textDecoration: "none",
    ...style}}>
            <h1>Ng Zhao Hui</h1>
            <a href="/" style={{ textDecoration: 'none', color: 'inherit' }}>Home</a>
            <a href="/about" style={{ textDecoration: 'none', color: 'inherit' }}>About</a>
            <a href="/projects" style={{ textDecoration: 'none', color: 'inherit' }}>Projects</a>
            <a href="/resume" style={{ textDecoration: 'none', color: 'inherit' }}>Resume</a>

    </nav>
    );
}