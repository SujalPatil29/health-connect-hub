import { useEffect, useRef } from "react";

interface VideoPlayerProps {
  stream: MediaStream | null;
  muted?: boolean;
  className?: string;
  label?: string;
}

const VideoPlayer = ({ stream, muted = false, className = "", label }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className={`relative overflow-hidden rounded-xl ${className}`}>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={muted}
        className="h-full w-full object-cover"
      />
      {label && (
        <span className="absolute bottom-2 left-2 rounded bg-foreground/70 px-2 py-0.5 text-xs text-background">
          {label}
        </span>
      )}
    </div>
  );
};

export default VideoPlayer;
