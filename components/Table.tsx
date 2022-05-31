import React from "react";

const Table = ({ headers, rows }) => (
  <table>
    <thead>
      <tr>
        {headers.map((header) => (
          <th>{header}</th>
        ))}
      </tr>
    </thead>
    <tbody>
      {rows.map((row) => (
        <tr>
          {row.map((column, idx) =>
            idx === 0 ? (
              <td>
                <code>{column}</code>
              </td>
            ) : (
              <td>{column}</td>
            ),
          )}
        </tr>
      ))}
    </tbody>
  </table>
);

export default Table;
