import React from "react";

const LoadingScreen: React.FC = () => (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      background: "#fff",
      zIndex: 9999,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <video
      src="/loading.mp4"
      autoPlay
      muted
      playsInline
      style={{ 
        maxWidth: "80vw", 
        maxHeight: "100vh", 
        width: "auto", 
        height: "auto",
        objectFit: "contain"
      }}
    />
  </div>
);

export default LoadingScreen;