import * as React from "react";
import {
  Stat,
  StatLabel,
  StatNumber,
  StatGroup,
  VStack,
  Card,
} from "@chakra-ui/react";
import { useYahtzeeStore } from "./machine";
import { YahtzeeUtils } from "./utils";

export function Score() {
  const { state } = useYahtzeeStore();
  const { context } = state;
  return (
    <VStack alignItems="stretch" w="full">
      <Card>
        <StatGroup w="full">
          <Stat size={{ base: "sm", sm: "md" }} textAlign="center">
            <StatLabel>Upper</StatLabel>
            <StatNumber>
              {YahtzeeUtils.getUpperScore(context.scoreCard.upper)}
            </StatNumber>
          </Stat>

          <Stat size={{ base: "sm", sm: "md" }} textAlign="center">
            <StatLabel>Upper Bonus</StatLabel>
            <StatNumber>
              {YahtzeeUtils.getUpperBonus(context.scoreCard.upper)}
            </StatNumber>
          </Stat>
        </StatGroup>
      </Card>

      <Card>
        <StatGroup w="full">
          <Stat size={{ base: "sm", sm: "md" }} textAlign="center">
            <StatLabel>Lower</StatLabel>
            <StatNumber>
              {YahtzeeUtils.getLowerScore(context.scoreCard.lower)}
            </StatNumber>
          </Stat>

          <Stat size={{ base: "sm", sm: "md" }} textAlign="center">
            <StatLabel>Yahtzee Bonus</StatLabel>
            <StatNumber>{YahtzeeUtils.getYahtzeeBonus(context)}</StatNumber>
          </Stat>
        </StatGroup>
      </Card>

      <Card>
        <StatGroup w="full">
          <Stat size={{ base: "sm", sm: "md" }} textAlign="center">
            <StatLabel>Total</StatLabel>
            <StatNumber>{YahtzeeUtils.getTotalScore(context)}</StatNumber>
          </Stat>
        </StatGroup>
      </Card>
    </VStack>
  );
}
