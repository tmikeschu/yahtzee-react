import * as React from "react";
import {
  VStack,
  Card,
  HStack,
  Box,
  StackProps,
  TextProps,
  Text,
} from "@chakra-ui/react";
import { useYahtzeeStore } from "./machine";
import { YahtzeeUtils } from "./utils";

export function ScoreSummary() {
  const { state } = useYahtzeeStore();
  const { context } = state;

  const upper = (
    <Stat color="blue.600">
      <StatLabel>Upper</StatLabel>
      <StatNumber>{YahtzeeUtils.getUpperScore(context.scoreCard)}</StatNumber>
    </Stat>
  );

  const upperBonus = (
    <Stat color="blue.600">
      <StatLabel>Upper Bonus</StatLabel>
      <StatNumber>{YahtzeeUtils.getUpperBonus(context.scoreCard)}</StatNumber>
    </Stat>
  );

  const lower = (
    <Stat color="purple.600">
      <StatLabel>Lower</StatLabel>
      <StatNumber>{YahtzeeUtils.getLowerScore(context.scoreCard)}</StatNumber>
    </Stat>
  );

  const yahtzeeBonus = (
    <Stat color="purple.600">
      <StatLabel>Yahtzee Bonus</StatLabel>
      <StatNumber>{YahtzeeUtils.getYahtzeeBonus(context)}</StatNumber>
    </Stat>
  );

  const total = (
    <Stat fontSize="lg">
      <StatLabel>Total</StatLabel>
      <StatNumber>{YahtzeeUtils.getTotalScore(context)}</StatNumber>
    </Stat>
  );
  return (
    <Card as={VStack} py="2" px="4" w="full">
      <VStack>
        <Box>{total}</Box>
      </VStack>
      <HStack justifyContent="space-evenly" w="full">
        <VStack>
          {upper}
          {lower}
        </VStack>

        <VStack>
          {upperBonus}
          {yahtzeeBonus}
        </VStack>
      </HStack>
    </Card>
  );
}

function Stat(props: StackProps) {
  return <HStack w="full" justifyContent="space-between" {...props} />;
}

function StatLabel(props: TextProps) {
  return (
    <Text
      fontWeight="bold"
      letterSpacing="tight"
      textTransform="uppercase"
      {...props}
    />
  );
}

function StatNumber(props: TextProps) {
  return <Text fontWeight="extrabold" {...props} />;
}
