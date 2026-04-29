import React, { useState, useRef, useEffect } from "react";
import Webcam from "react-webcam";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import "@tensorflow/tfjs";
import Swal from 'sweetalert2'

const videoConstraints = {
  width: 1280,
  height: 720,
  facingMode: "user"
};

export default function Camera() {
    
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [phoneDetected, setPhoneDetected] = useState(false);
  let modelRef = useRef(null);

  const capture = React.useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
  }, [webcamRef]);


  useEffect(() => {
    const loadModel = async () => {
      console.log("Load model coco ssd");
      const loadedModel = await cocoSsd.load();
      modelRef.current = loadedModel;
      console.log("Dataset coco ssd already loaded");
      setIsModelLoading(false);
    };
    loadModel();
  }, []);


  useEffect(() => {
    if (isModelLoading) return;

    const detectFrame = async () => {
      if (
        webcamRef.current &&
        webcamRef.current.video &&
        webcamRef.current.video.readyState === 4 &&
        modelRef.current
      ) {
        const predictions = await modelRef.current.detect(webcamRef.current.video);
        const phones = predictions.filter(
          (prediction) => prediction.class === "cell phone"
        );
        
        if (phones.length > 0) {
          setPhoneDetected(true);
          console.log("Phone detected!");
          Swal.fire({
  title: "Lock in!",
  text: "Please put your phone down and focus on your activities.",
  icon: "error"
});
        } else {
          setPhoneDetected(false);
        }
      }
      
      requestAnimationFrame(detectFrame);
    };

    const animationId = requestAnimationFrame(detectFrame);
    
    return () => cancelAnimationFrame(animationId);
  }, [isModelLoading]);

  return (
    <>
      <div className="flex items-center justify-center h-180">
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
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </>
  );
}