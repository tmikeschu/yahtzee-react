import { useHotkeys } from "react-hotkeys-hook";
import { useYahtzeeStore } from "./machine";
import { YahtzeeUtils } from "./utils";

const KEYS = [1, 2, 3, 4, 5].map(String);

export function useYahtzeeHotkeys() {
  const store = useYahtzeeStore();

  const isGameOver = YahtzeeUtils.isGameOver(store.state.context);
  useHotkeys(
    "r",
    () => (isGameOver ? store.send("RESET") : store.send("ROLL")),
    [isGameOver]
  );

  useHotkeys(KEYS, (e) => {
    return store.send({ type: "SELECT_DIE", index: Number(e.key) - 1 });
  });
}
