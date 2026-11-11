"use client";

import { useEffect, useState } from "react";

export function useLiveClock(timeZone: string = "Asia/Karachi") {
  const [timeString, setTimeString] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      try {
        const now = new Date();
        const formatted = new Intl.DateTimeFormat("en-GB", {
          timeZone,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }).format(now);
        setTimeString(formatted);
      } catch {
        // Fallback to local time if timezone unsupported
        const now = new Date();
        setTimeString(now.toTimeString().split(" ")[0]);
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [timeZone]);

  return timeString;
}

