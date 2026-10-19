import { useEffect, useRef, useState } from "react";

const videos = [
  "/videos/istockphoto1.mp4",
  "/videos/istockphoto2.mp4",
  "/videos/istockphoto3.mp4",
  "/videos/istockphoto4.mp4",
  "/videos/istockphoto5.mp4",
  "/videos/istockphoto6.mp4",
  "/videos/istockphoto7.mp4",
  "/videos/istockphoto8.mp4",
  "/videos/stockphoto9.mp4",
  "/videos/stockphoto10.mp4",
];

const VISIBLE_MS = 5200;
const FADE_MS = 450;

export default function VideoBackground({ className = "" }) {
  const [index, setIndex] = useState(0);
  const [fading, setFading] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    video.play().catch(() => {});
  }, [index]);

  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    let switchTimer;
    const interval = window.setInterval(() => {
      setFading(true);
      switchTimer = window.setTimeout(() => {
        setIndex((current) => (current + 1) % videos.length);
        setFading(false);
      }, FADE_MS);
    }, VISIBLE_MS);
    return () => {
      window.clearInterval(interval);
      window.clearTimeout(switchTimer);
    };
  }, []);

  return (
    <div className={`video-background ${className}`} aria-hidden="true">
      <video
        key={videos[index]}
        ref={videoRef}
        className={`hero-video ${fading ? "hero-video-fading" : ""}`}
        src={videos[index]}
        autoPlay
        muted
        playsInline
        loop
        preload="auto"
      />
      <div className="video-background__overlay" />
    </div>
  );
}
