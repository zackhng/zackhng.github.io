import {useState, useEffect} from "react"

const useDeviceSize = () => {
    const [width, setWidth] = useState(0)
    const [height, setHeight] = useState(0)
    useEffect(()=>{
      function handleResize(){
        setWidth(window.innerWidth);
        setHeight(window.innerHeight);
      }
      handleResize();
      window.addEventListener("resize", handleResize);
      return ()=> window.removeEventListener("resize", handleResize);
    }, []);
    return [width,height]
  }

export default useDeviceSize;