import Image from "next/image";
import style from "@/styles/profilepic.module.css"
import useImageMetadata from "@/hooks/useImageMetadata";
import generateAsciiframe from "./generateASCIIFrame";

export default function ProfilePicture({imagePath,scale}) {
    const dim = useImageMetadata(imagePath);

    const scaledWidth = Math.round(scale * dim.width);
    const scaledHeight = Math.round(scale * dim.height);

    const asciiFrame = generateAsciiframe(scaledWidth,scaledHeight);
    console.log('ASCII Frame:', asciiFrame);

    return (
        <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
            <pre style={{ fontFamily: 'monospace', lineHeight: '1em' }}>
                {asciiFrame}
            </pre>
            <img
                src={imagePath}
                width={scaledWidth}
                height={scaledHeight}
                alt=""
                style={{
                border: '2px solid black',
                imageRendering: 'pixelated', // optional
                }}
            />
        </div>
    );
}