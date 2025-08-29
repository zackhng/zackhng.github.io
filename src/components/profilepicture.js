import Image from "next/image";
import style from "@/styles/profilepic.module.css"
export default function ProfilePicture({imagePath}) {
    return (
        <div className={style.pictureFrame}>
            <Image 
            className={style.profilepic} 
            src={imagePath} 
            fill 
            alt ="profile picture"
            ></Image>
        </div>
    );
}