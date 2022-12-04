import * as React from "react";
import { Button, Grid, GridItem, HStack, Text } from "@chakra-ui/react";
import { useYahtzeeStore } from "./machine";
import { YahtzeeUtils } from "./utils";

export function ScoreCard() {
  const { state, send } = useYahtzeeStore();
  const { context } = state;
  const evaluated = YahtzeeUtils.evaluateHand(context);

  return (
    <Grid templateColumns="1fr 1fr" gap={{ base: "1", sm: "4" }} w="full">
      {(
        Object.entries(evaluated) as [keyof typeof evaluated, number | null][]
      ).map(([key, val]) => {
        const isUsed =
          context.scoreCard[key as keyof typeof context.scoreCard] !== null;
        const isDisabled = !context.hand || isUsed;
        const label = YahtzeeUtils.getLabel(key);
        const isYahtzee = YahtzeeUtils.handIsYahtzee(context.hand);

        return (
          <GridItem key={key} w="full" _last={{ gridColumn: "span 2" }}>
            <Button
              w="full"
              size={{ base: "sm", sm: "sm" }}
              colorScheme={isUsed ? "teal" : "gray"}
              variant={isUsed ? "solid" : "outline"}
              isDisabled={isDisabled}
              onClick={() =>
                send({
                  type: "SET_SCORE",
                  isYahtzee,
                  [key]: val,
                })
              }
            >
              <HStack justifyContent="space-between" w="full">
                <Text>{label}</Text>
                <Text>{context.hand || val !== null ? val ?? 0 : "-"}</Text>
              </HStack>
            </Button>
          </GridItem>
        );
      })}
    </Grid>
  );
}