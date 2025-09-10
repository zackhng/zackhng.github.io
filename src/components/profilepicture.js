import style from "@/styles/profilepic.module.css"
import useImageMetadata from "@/hooks/useImageMetadata";
import generateAsciiFrame from "./generateASCIIFrame";

export default function ProfilePicture({imagePath,scale}) {
    const dim = useImageMetadata(imagePath);
    console.log(dim);
    if (!dim) {
        return <p>Loading profile picture...</p>;
    }
    const scaledWidth = Math.round(scale * dim.width);
    const scaledHeight = Math.round(scale * dim.height);

    const { ascii, padding } = generateAsciiFrame(scaledWidth, scaledHeight, 1.5);
    return (
        <div className={style.pictureFrame}>
            <pre className={style.asciiFrame}>
                {ascii}
            </pre>

            <img
            src={imagePath}
            width={scaledWidth}
            height={scaledHeight}
            alt=""
            className={style.profilepic}
            style={{
                top: `${padding}em`,   // dynamic offset into ASCII box
                left: `${padding}ch`,  // dynamic offset into ASCII box
            }}
            />
        </div>
        );
}