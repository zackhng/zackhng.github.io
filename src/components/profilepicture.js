import Image from "next/image";
export default function ProfilePicture() {
    return (
        <div style={{position: "relative" , width: "150px" , height: "150px" }}>
            <Image src="/images/selfie.jpg"
            alt="Profile Picture"
            fill
            style={{objectFit: 'contain'}}
            ></Image>
        </div>
    );
}