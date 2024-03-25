import React from "react";
import { useYahtzeeStore } from "./machine";

export function usePersist() {
  React.useEffect(() => {
    const handler = () => {
      useYahtzeeStore.getState().persist();
    };

    window.addEventListener("beforeunload", handler);

    return () => {
      window.removeEventListener("beforeunload", handler);
    };
  }, []);
}
