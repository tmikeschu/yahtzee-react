import * as React from "react";
import { VStack, Heading, Center, Box, Show, Hide } from "@chakra-ui/react";
import { ScoreCardButtons } from "./score-card-buttons";
import { Hand } from "./hand";
import { ScoreSummary } from "./score-summary";
import { GameMenu } from "./game-menu";
import { SelectScoreModal } from "./select-score-modal";
import { useYahtzeeHotkeys } from "./use-yahtzee-hotkeys";
import { GameButton } from "./game-button";
import { usePersist } from "./use-persist";

export default function App() {
  usePersist();
  useYahtzeeHotkeys();

  return (
    <Center position="relative" h="100vh" overflowY="scroll">
      <VStack
        spacing="4"
        py={{ base: "2", sm: "8" }}
        px={{ base: "2", sm: "4" }}
        maxW="md"
        w="full"
      >
        <Heading color="gray.600" letterSpacing="tight">
          Yahtzee
        </Heading>

        <Show above="sm">
          <Hand />
        </Show>

        <ScoreSummary />

        <ScoreCardButtons />

        <Hide above="sm">
          <Hand />
        </Hide>

        <GameButton />
      </VStack>

      <Box position="fixed" top={0} right={0} padding={{ base: "1", sm: "4" }}>
        <GameMenu />
      </Box>

      <SelectScoreModal />
    </Center>
  );
}
