import * as React from "react";
import { HStack, VStack, Button } from "@chakra-ui/react";
import { Die } from "./die";
import { useYahtzeeStore } from "./machine";
import { match } from "ts-pattern";
import { YahtzeeUtils } from "./utils";

export function Hand() {
  const { state, send } = useYahtzeeStore();
  const { context } = state;
  const isGameOver = YahtzeeUtils.isGameOver(context);

  return (
    <VStack spacing="2">
      <HStack>
        {context.hand
          ? context.hand.map((n, i) => {
              const isLoading = !n.selected && state.matches("rolling");
              return (
                <Die
                  isSelected={n.selected}
                  key={i}
                  onClick={() => send({ type: "SELECT_DIE", index: i })}
                  isLoading={isLoading}
                >
                  {isLoading ? YahtzeeUtils.getRandomRoll() : n.value}
                </Die>
              );
            })
          : Array.from({ length: 5 }, (_, i) => (
              <Die dotColor="gray.400" borderColor="gray.400" key={i}>
                {YahtzeeUtils.getRandomRoll()}
              </Die>
            ))}
      </HStack>

      {match({ isGameOver, turn: context.turn })
        .with({ isGameOver: true }, () => (
          <Button colorScheme="pink" onClick={() => send("RESET")}>
            Play again
          </Button>
        ))
        .with({ turn: 0 }, () => (
          <Button colorScheme="blue" onClick={() => send("ROLL")}>
            Roll to play
          </Button>
        ))
        .with({ turn: 3 }, () => (
          <Button colorScheme="blue" isDisabled>
            Select score
          </Button>
        ))
        .otherwise(({ turn }) => (
          <Button colorScheme="blue" onClick={() => send("ROLL")}>
            Roll {turn}
          </Button>
        ))}
    </VStack>
  );
}
