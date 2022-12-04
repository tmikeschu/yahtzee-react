import * as React from "react";
import { VStack, Heading, Center, Box } from "@chakra-ui/react";
import { Upper } from "./upper";
import { Lower } from "./lower";
import { Hand } from "./hand";
import { Score } from "./score";
import { GameMenu } from "./game-menu";
import { SelectScoreModal } from "./select-score-modal";
import { useYahtzeeHotkeys } from "./use-yahtzee-hotkeys";

export default function App() {
  useYahtzeeHotkeys();

  return (
    <Center position="relative">
      <VStack
        spacing={{ base: "2", sm: "4" }}
        py={{ base: "2", sm: "8" }}
        px={{ base: "1", sm: "4" }}
        maxW="md"
        w="full"
      >
        <Heading color="blue.500">Yahtzee</Heading>

        <Hand />

        <VStack spacing={{ base: "2", sm: "4" }} w="full">
          <Upper />
          <Lower />
        </VStack>

        <Score />
      </VStack>

      <Box position="fixed" top={0} right={0} padding={{ base: "1", sm: "4" }}>
        <GameMenu />
      </Box>

      <SelectScoreModal />
    </Center>
  );
}
