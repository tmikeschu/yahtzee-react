import React from "react";
import { useYahtzeeStore } from "./machine";

export function usePersist() {
  React.useEffect(() => {
    const handler = () => {
      useYahtzeeStore.getState().persist();
    };

    const events = [
      [window, "beforeunload"],
      [document, "visibilitychange"],
    ] as const;

    events.forEach(([obj, event]) => {
      obj.addEventListener(event, handler);
    });

    return () => {
      events.forEach(([obj, event]) => {
        obj.removeEventListener(event, handler);
      });
    };
  }, []);
}
