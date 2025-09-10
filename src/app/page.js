import ProfilePicture from "@/components/profilepicture";
import Introduction from "@/components/introduction";
export default function Home() {
  return (
    <div style={{display: 'flex',
      flexDirection: 'row'
    }}>
        <ProfilePicture imagePath={"/images/selfie.jpg"} scale={100}/>
        <Introduction />
    </div>
  
  );
}
