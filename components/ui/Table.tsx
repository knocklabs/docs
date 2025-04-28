import React from "react";
import { Box } from "@telegraph/layout";

export const TableElement = (props) => (
  <Box as="table" border="px" borderColor="gray-4" mb="2" w="full" {...props} style={{ overflow: "hidden", borderCollapse: "collapse", textIndent: "0" }} />
);

export const ThElement = (props) => (
  <Box as="th" p="2" border="px" borderColor="gray-4" fontWeight="semi-bold" bg="gray-2" {...props} style={{ fontSize: "12px", color: "var(--tgph-gray-12)", lineHeight: "1.5", ...props.style }} />
);

export const TdElement = (props) => (
  <Box as="td" p="2" border="px" borderColor="gray-4" {...props} style={{ fontSize: "12px", color: "var(--tgph-gray-12)", lineHeight: "1.5", ...props.style }} />
);

export const TheadElement = (props) => (
  <Box as="thead" {...props} style={{ textAlign: "left", ...props.style }} />
);

const Table = ({ headers, rows }) => (
  <TableElement>
    <TheadElement>
      <tr>
        {headers.map((header, i) => (
          <ThElement key={i}>{header}</ThElement>
        ))}
      </tr>
    </TheadElement>
    <tbody>
      {rows.map((row, i) => (
        <tr key={i}>
          {row.map((column, idx) =>
            idx === 0 ? (
              <TdElement key={idx}>
                <code>{column}</code>
              </TdElement>
            ) : (
                <TdElement key={idx}>{column}</TdElement>
            ),
          )}
        </tr>
      ))}
    </tbody>
  </TableElement>
);

export default Table;
