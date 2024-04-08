import * as React from "react";
import { Button } from "@chakra-ui/react";
import { useYahtzeeStore } from "./machine";
import { match } from "ts-pattern";

export const GameButton = () => {
  const { state, send } = useYahtzeeStore();
  const { context } = state;
  const isGameOver = state.matches("gameOver");

  return match({ isGameOver, turn: context.turn })
    .with({ isGameOver: true }, () => (
      <Button size="lg" colorScheme="red" onClick={() => send("ROLL")}>
        Play again
      </Button>
    ))
    .with({ turn: 0 }, () => (
      <Button size="lg" colorScheme="blue" onClick={() => send("ROLL")}>
        Roll to play
      </Button>
    ))
    .with({ turn: 3 }, () => (
      <Button size="lg" colorScheme="gray" isDisabled>
        Select score
      </Button>
    ))
    .otherwise(({ turn }) => (
      <Button size="lg" colorScheme="blue" onClick={() => send("ROLL")}>
        Roll {turn}
      </Button>
    ));
};
