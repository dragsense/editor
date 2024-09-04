import React, { useEffect, useRef } from "react";

const Video = ({ src, alt, mimetype, duration = 0 }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (duration === 0) return;

    const videoElement = videoRef.current;

    // When the video is loaded, set it to stop at 10 seconds
    const handleLoadedMetadata = () => {
      videoElement.currentTime = 0; // Start from the beginning
    };

    // Stop the video at 10 seconds
    const handleTimeUpdate = () => {
      if (videoElement.currentTime >= duration) {
        videoElement.pause();
        videoElement.currentTime = 0; // Reset to start
      }
    };

    videoElement.addEventListener("loadedmetadata", handleLoadedMetadata);
    videoElement.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      if (duration === 0) return;

      videoElement.removeEventListener("loadedmetadata", handleLoadedMetadata);
      videoElement.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, []);

  return (
    <div style={{ position: "relative", padding: "56.25% 0 0 0", height: 0 }}>
      <video
        ref={videoRef}
        alt={alt}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
        controls
      >
        <source src={src} type={mimetype} />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default Video;
