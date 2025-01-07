import React from "react";
import { VscInfo, VscHome } from "react-icons/vsc";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";

export default function SlideHeader({ title, description }) {
  return (
    <div className="w-full h-[10%] bg-gray-700 flex items-center justify-between px-2">
      <VscHome className="w-[5%] text-yellow-200 text-2xl" />
      <div className="w-[95%] h-full flex items-center justify-end">
        <h1 className="text-white text-xl flex text-end">{title}</h1>
        <Tippy content={description} allowHTML="true">
          <VscInfo className="text-yellow-200 text-2xl ml-2" />
        </Tippy>
      </div>
    </div>
  );
}
