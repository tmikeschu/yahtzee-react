import * as React from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer
} from "@chakra-ui/react";

export const GlossaryTable = () => {
  return (
    <TableContainer>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Term</Th>
            <Th>Meaning</Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td>Upper bonus</Td>
            <Td>Score 63+ to get a 35 point bonus</Td>
          </Tr>
        </Tbody>
      </Table>
    </TableContainer>
  );
};
