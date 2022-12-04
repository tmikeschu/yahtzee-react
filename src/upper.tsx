import * as React from "react";
import { Button, Grid, GridItem, HStack, Text } from "@chakra-ui/react";
import { useYahtzeeStore } from "./machine";
import { YahtzeeUtils } from "./utils";

export function Upper() {
  const { send, state } = useYahtzeeStore();
  const { context } = state;
  const evaluated = YahtzeeUtils.evaluateHand(context);

  return (
    <Grid templateColumns="1fr 1fr" w="full" gap={{ base: "1", sm: "4" }}>
      {(
        Object.entries(evaluated.upper) as [
          keyof typeof evaluated.upper,
          number | null
        ][]
      ).map(([key, val]) => {
        const isUsed =
          context.scoreCard.upper[
            key as keyof typeof context.scoreCard.upper
          ] !== null;
        const isDisabled = isUsed || !context.hand;
        const label = YahtzeeUtils.getLabel(key);
        const isYahtzee = YahtzeeUtils.handIsYahtzee(context.hand);

        return (
          <GridItem key={key} w="full">
            <Button
              variant={isUsed ? "solid" : "outline"}
              colorScheme={isUsed ? "teal" : "gray"}
              w="full"
              size={{ base: "sm", sm: "sm" }}
              isDisabled={isDisabled}
              onClick={() =>
                send({
                  type: "SET_SCORE",
                  level: "upper",
                  [key]: val,
                  isYahtzee,
                })
              }
            >
              <HStack justifyContent="space-between" w="full">
                <Text>{label}</Text>
                <Text>{context.hand ? val ?? 0 : val ?? "-"}</Text>
              </HStack>
            </Button>
          </GridItem>
        );
      })}
    </Grid>
  );
}
