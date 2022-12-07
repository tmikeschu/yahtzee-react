import { useHotkeys } from "react-hotkeys-hook";
import { useYahtzeeStore } from "./machine";

const KEYS = [1, 2, 3, 4, 5].map(String);

export function useYahtzeeHotkeys() {
  const store = useYahtzeeStore();

  useHotkeys("r", () => store.send("ROLL"));

  useHotkeys(KEYS, (e) => {
    return store.send({ type: "SELECT_DIE", index: Number(e.key) - 1 });
  });
}
