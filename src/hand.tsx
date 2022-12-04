import * as React from "react";
import { HStack } from "@chakra-ui/react";
import { Die } from "./die";
import { useYahtzeeStore } from "./machine";
import { YahtzeeUtils } from "./utils";

export function Hand() {
  const { state, send } = useYahtzeeStore();
  const { context } = state;

  return (
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
  );
}
