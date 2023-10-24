import React from "react";

const Table = ({ headers, rows }) => (
  <table>
    <thead>
      <tr>
        {headers.map((header, i) => (
          <th key={i}>{header}</th>
        ))}
      </tr>
    </thead>
    <tbody>
      {rows.map((row, i) => (
        <tr key={i}>
          {row.map((column, idx) =>
            idx === 0 ? (
              <td key={idx}>
                <code>{column}</code>
              </td>
            ) : (
              <td key={idx}>{column}</td>
            ),
          )}
        </tr>
      ))}
    </tbody>
  </table>
);

export default Table;
