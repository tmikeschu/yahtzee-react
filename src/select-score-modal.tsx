import * as React from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalContent,
  ModalOverlay,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import { useHotkeys } from "react-hotkeys-hook";
import { useYahtzeeStore } from "./machine";
import Select, { createFilter } from "react-select";
import { match } from "ts-pattern";
import { YahtzeeUtils } from "./utils";

export const SelectScoreModal = () => {
  const disclosure = useDisclosure();
  useHotkeys("meta+k", (e) => {
    e.preventDefault();
    disclosure.onOpen();
  });

  const inputRef = React.useRef(null);

  const {
    state: { context },
    send,
  } = useYahtzeeStore();
  const isYahtzee = YahtzeeUtils.handIsYahtzee(context.hand);
  const evaluated = YahtzeeUtils.evaluateHand(context);
  const upperEntries = (
    Object.entries(evaluated.upper) as [
      keyof typeof evaluated.upper,
      number | null
    ][]
  ).filter(
    ([key]) =>
      context.scoreCard.upper[key as keyof typeof context.scoreCard.upper] ===
      null
  );
  const lowerEntries = (
    Object.entries(evaluated.lower) as [
      keyof typeof evaluated.lower,
      number | null
    ][]
  ).filter(
    ([key]) =>
      context.scoreCard.lower[key as keyof typeof context.scoreCard.lower] ===
      null
  );
  const options = [
    ...upperEntries.map(([key, val]) => ({
      type: "upper" as const,
      value: key,
      label: `${YahtzeeUtils.getLabel(key)}: ${val ?? 0}`,
      score: val,
    })),
    ...lowerEntries.map(([key, val]) => ({
      type: "lower" as const,
      value: key,
      label: `${YahtzeeUtils.getLabel(key)}: ${val ?? 0}`,
      score: val,
    })),
  ];

  return (
    <Modal {...disclosure} initialFocusRef={inputRef}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Select score</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb="8">
          <Select
            isDisabled={!context.hand}
            ref={inputRef}
            isSearchable
            options={options}
            filterOption={createFilter({
              stringify: (x) => `${x.label} ${x.value}`,
              ignoreCase: true,
              matchFrom: "any",
            })}
            onChange={(v) => {
              match(v)
                .with({ type: "upper" }, ({ value: key, score }) =>
                  send({
                    type: "SET_SCORE",
                    level: "upper",
                    [key]: score,
                    isYahtzee,
                  })
                )
                .with({ type: "lower" }, ({ value: key, score }) =>
                  send({
                    type: "SET_SCORE",
                    level: "lower",
                    [key]: score,
                    isYahtzee,
                  })
                )
                .run();
              disclosure.onClose();
            }}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
