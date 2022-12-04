import * as React from "react";
import { Button, Grid, GridItem, HStack, Text } from "@chakra-ui/react";
import { useYahtzeeStore } from "./machine";
import { YahtzeeUtils } from "./utils";
import { match } from "ts-pattern";

export function ScoreCardButtons() {
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
        const keyLevel = YahtzeeUtils.getKeyLevel(key);
        const isDisabled = !context.hand || isUsed;
        const label = YahtzeeUtils.getLabel(key);
        const isYahtzee = YahtzeeUtils.handIsYahtzee(context.hand);

        return (
          <GridItem key={key} w="full" _last={{ gridColumn: "span 2" }}>
            <Button
              w="full"
              _disabled={{ opacity: 0.7, cursor: "not-allowed" }}
              variant={isUsed ? "solid" : "outline"}
              isDisabled={isDisabled}
              onClick={() =>
                send({
                  type: "SET_SCORE",
                  isYahtzee,
                  [key]: val,
                })
              }
              color={match(keyLevel)
                .with("upper", () => "blue.600")
                .with("lower", () => "purple.600")
                .exhaustive()}
            >
              <HStack justifyContent="space-between" w="full">
                <Text
                  {...(key === "chance"
                    ? {
                        letterSpacing: "widest",
                        textTransform: "uppercase",
                      }
                    : {})}
                >
                  {label}
                </Text>
                <Text>{context.hand || val !== null ? val ?? 0 : "-"}</Text>
              </HStack>
            </Button>
          </GridItem>
        );
      })}
    </Grid>
  );
}
