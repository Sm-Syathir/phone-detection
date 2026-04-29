import React, { useState, useRef } from "react";
import Webcam from "react-webcam";

const videoConstraints = {
  width: 1280,
  height: 720,
  facingMode: "user"
};

export default function Camera() {
    const webcamRef = React.useRef(null);
  const capture = React.useCallback(
    () => {
      const imageSrc = webcamRef.current.getScreenshot();
    },
    [webcamRef]
  );
  return (
    <>
       <div className="flex items-center justify-center  h-180 ">
        <Webcam
        className="rounded-3xl border-3 border-solid border-black"
        audio={false}
        height={850}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width={850}
        videoConstraints={videoConstraints}
        style={{ transform: 'scaleX(-1)' }}
      />
       </div>
       
    </>
  );
}