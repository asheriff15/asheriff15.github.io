"use client";

import { useEffect, useState } from "react";

export default function TypedName({ text }: { text: string }) {
  const [shown, setShown] = useState("");

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(text);
      return;
    }
    let i = 0;
    const start = setTimeout(function step() {
      i++;
      setShown(text.slice(0, i));
      if (i < text.length) timer = setTimeout(step, 85);
    }, 500);
    let timer: ReturnType<typeof setTimeout> = start;
    return () => clearTimeout(timer);
  }, [text]);

  return (
    <span className="text-signal" aria-label={text}>
      <span aria-hidden>{shown}</span>
      <span className="caret" aria-hidden />
    </span>
  );
}
