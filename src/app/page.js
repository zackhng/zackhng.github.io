import Image from "next/image";
import styles from "./page.module.css";
import Navbar from "@/components/navbar";
import ProfilePicture from "@/components/profilepicture";

export default function Home() {
  return (
    <div style={{display: 'flex',
      flexDirection: 'column'
    }}>
        <ProfilePicture />
    </div>

  );
}
