import * as React from "react";
import {
  Kbd,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  HStack,
  Code,
} from "@chakra-ui/react";

export const KeyboardShortcutTable = () => {
  return (
    <TableContainer>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Keyboard shortcut</Th>
            <Th>Effect</Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td>
              <Kbd>r</Kbd>
            </Td>
            <Td>Roll</Td>
          </Tr>
          <Tr>
            <Td>
              <HStack>
                {[1, 2, 3, 4, 5].map((n) => (
                  <Kbd key={n}>{n}</Kbd>
                ))}
              </HStack>
            </Td>
            <Td>
              (De)select <Code>N</Code>th die
            </Td>
          </Tr>
          <Tr>
            <Td>
              <Kbd>⌘</Kbd> + <Kbd>k</Kbd>
            </Td>
            <Td>Open scoring menu</Td>
          </Tr>
          <Tr>
            <Td>
              <Kbd>⌘</Kbd> + <Kbd>?</Kbd>
            </Td>
            <Td>Open game menu</Td>
          </Tr>
        </Tbody>
      </Table>
    </TableContainer>
  );
};
