import * as React from "react";
import { Button } from "@chakra-ui/react";
import { useYahtzeeStore } from "./machine";
import { match } from "ts-pattern";
import { YahtzeeUtils } from "./utils";

export const GameButton = () => {
  const { state, send } = useYahtzeeStore();
  const { context } = state;
  const isGameOver = YahtzeeUtils.isGameOver(context);

  return match({ isGameOver, turn: context.turn })
    .with({ isGameOver: true }, () => (
      <Button colorScheme="red" onClick={() => send("RESET")}>
        Play again
      </Button>
    ))
    .with({ turn: 0 }, () => (
      <Button colorScheme="blue" onClick={() => send("ROLL")}>
        Roll to play
      </Button>
    ))
    .with({ turn: 3 }, () => (
      <Button colorScheme="gray" isDisabled>
        Select score
      </Button>
    ))
    .otherwise(({ turn }) => (
      <Button colorScheme="blue" onClick={() => send("ROLL")}>
        Roll {turn}
      </Button>
    ));
};
