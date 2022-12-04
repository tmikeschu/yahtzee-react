import { useHotkeys } from "react-hotkeys-hook";
import { useYahtzeeStore } from "./machine";
import { YahtzeeUtils } from "./utils";

export function useYahtzeeHotkeys() {
  const store = useYahtzeeStore();
  console.log(store.state.value);
  const isGameOver = YahtzeeUtils.isGameOver(store.state.context);
  useHotkeys(
    "r",
    () => (isGameOver ? store.send("RESET") : store.send("ROLL")),
    [isGameOver]
  );
  useHotkeys("1", () => store.send({ type: "SELECT_DIE", index: 0 }));
  useHotkeys("2", () => store.send({ type: "SELECT_DIE", index: 1 }));
  useHotkeys("3", () => store.send({ type: "SELECT_DIE", index: 2 }));
  useHotkeys("4", () => store.send({ type: "SELECT_DIE", index: 3 }));
  useHotkeys("5", () => store.send({ type: "SELECT_DIE", index: 4 }));
}
