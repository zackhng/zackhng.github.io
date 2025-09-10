"use client";
import {useEffect, useState} from 'react'

function useImageMetadata(path) {
    const [dim, setDim] = useState(null);
    
    useEffect(()=>{
        if(!path){return;}

        const img = new Image();
        img.src = path; // Load the path of the image to the Image object

        const handleLoad = () =>{
            const width = img.naturalWidth;
            const height = img.naturalHeight;
            setDim({
                width: width,
                height:height,
            });
        };

        img.onload = handleLoad;
        return ()=>{
            img.onload = null;
        };
    }, [path]);
    return dim;
}

export default useImageMetadata;