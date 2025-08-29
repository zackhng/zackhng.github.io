"use client"
import style from "@/styles/navbar.module.css"
import useDeviceSize from "@/hooks/useDeviceSize";
import { useEffect } from "react";

export default function Navbar({navbarArray}) {
  const [width, height] = useDeviceSize();
  console.log(width)
  const underscoreWidth = "-".repeat(width/5.32);
  const underscoreHeight = '|\n'.repeat(Math.floor(height/250))
  return (
    <div className={style.navbar}>
      <div>{underscoreWidth}</div>
      <div className={style.contentContainer}>
        <div className={style.leftVerticle}>{underscoreHeight}</div>
        {navbarArray.map((item)=>(
          <div key={item.name} className={style.navbarContent}>
            <a href={item.link}>{item.name}</a>
          </div>
        ))}
        <div className={style.rightVerticle}>{underscoreHeight}</div>
      </div>
      <div>{underscoreWidth}</div>
    </div>
  );
}
