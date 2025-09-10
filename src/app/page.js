"use client";
import ProfilePicture from "@/components/profilepicture";
import Introduction from "@/components/introduction";
export default function Home() {
  return (
    <div style={{display: 'flex',
      flexDirection: 'row',
      padding: '1rem'
    }}>
        <ProfilePicture imagePath={"/images/selfie.jpg"} scale={0.3}/>
        <Introduction />
    </div>
  
  );
}
