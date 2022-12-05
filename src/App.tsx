import * as React from "react";
import { VStack, Heading, Center, Box } from "@chakra-ui/react";
import { ScoreCardButtons } from "./score-card-buttons";
import { Hand } from "./hand";
import { ScoreSummary } from "./score-summary";
import { GameMenu } from "./game-menu";
import { SelectScoreModal } from "./select-score-modal";
import { useYahtzeeHotkeys } from "./use-yahtzee-hotkeys";
import { GameButton } from "./game-button";

export default function App() {
  useYahtzeeHotkeys();

  return (
    <Center position="relative">
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

        <ScoreSummary />

        <ScoreCardButtons />

        <Hand />

        <GameButton />
      </VStack>

      <Box position="fixed" top={0} right={0} padding={{ base: "1", sm: "4" }}>
        <GameMenu />
      </Box>

      <SelectScoreModal />
    </Center>
  );
}
