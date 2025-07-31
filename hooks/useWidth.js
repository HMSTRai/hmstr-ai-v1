import { useState, useEffect } from "react";

export default function useWidth() {
  const [width, setWidth] = useState(null);
  const [breakpoints] = useState({
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    "2xl": 1536,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    setWidth(window.innerWidth);
    const handleResize = () => setWidth(window.innerWidth);

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return {
    width: width ?? 1920,
    breakpoints,
  };
}
