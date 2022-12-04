import * as React from "react";
import {
  IconButton,
  Menu,
  MenuList,
  MenuItem,
  MenuButton,
  useDisclosure,
  Modal,
  ModalHeader,
  ModalBody,
  ModalContent,
  ModalOverlay,
  ModalCloseButton,
  ModalFooter,
  Button,
  VStack,
} from "@chakra-ui/react";
import { SettingsIcon, WarningIcon, QuestionIcon } from "@chakra-ui/icons";
import { useYahtzeeStore } from "./machine";
import { useHotkeys } from "react-hotkeys-hook";
import { KeyboardShortcutTable } from "./keyboard-shortcut-table";
import { GlossaryTable } from "./glossary-table";

export function GameMenu() {
  const store = useYahtzeeStore();

  const menuDisclosure = useDisclosure();

  const helpDisclosure = useDisclosure();
  const menuBtnRef = React.useRef<HTMLButtonElement>(null);

  useHotkeys("shift+?", () => {
    menuBtnRef.current?.click();
  });

  return (
    <>
      <Menu {...menuDisclosure}>
        <MenuButton ref={menuBtnRef} as={IconButton} icon={<SettingsIcon />} />
        <MenuList>
          <MenuItem icon={<QuestionIcon />} onClick={helpDisclosure.onOpen}>
            Help
          </MenuItem>
          <MenuItem
            onClick={() => store.send("RESET")}
            color="red"
            icon={<WarningIcon />}
          >
            Reset
          </MenuItem>
        </MenuList>
      </Menu>

      <Modal {...helpDisclosure} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Help</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb="8">
            <VStack spacing="4" alignItems="stretch">
              <GlossaryTable />
              <KeyboardShortcutTable />
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button onClick={helpDisclosure.onClose}>Done</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
