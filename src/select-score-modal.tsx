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
  const entries = (
    Object.entries(evaluated) as [keyof typeof evaluated, number | null][]
  ).filter(
    ([key]) => context.scoreCard[key as keyof typeof context.scoreCard] === null
  );
  const options = entries.map(([key, val]) => ({
    value: key,
    label: `${YahtzeeUtils.getLabel(key)}: ${val ?? 0}`,
    score: val,
  }));

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
              if (!v) return;
              send({
                type: "SET_SCORE",
                [v.value]: v.score,
                isYahtzee,
              });
              disclosure.onClose();
            }}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
