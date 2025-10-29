import React from "react";
import { Icon } from "@telegraph/icon";
import { Stack } from "@telegraph/layout";
import { Check, X } from "lucide-react";
import Link from "next/link";

interface MatrixRow {
  name: string;
  href?: string;
  columnsYes?: string[];
  columnsNo?: string[];
}

interface MatrixRowGroup {
  name: string;
  rows: MatrixRow[];
}

interface MatrixColumn {
  name: string;
  href?: string;
}

interface FeaturesMatrixProps {
  columns: (string | MatrixColumn)[];
  rowGroups: MatrixRowGroup[];
  rowHeaderWidth?: string;
}

const FeaturesMatrix = ({
  columns,
  rowGroups,
  rowHeaderWidth = "35%",
}: FeaturesMatrixProps) => {
  const normalizedColumns = columns.map((column) =>
    typeof column === "string" ? { name: column } : column,
  );

  // Check if any row group has a name to determine if we should show the first column
  const hasRowGroupNames = rowGroups.some((group) => group.name);

  const getFeatureStatus = (
    row: MatrixRow,
    columnName: string,
  ): "available" | "unavailable" | null => {
    if (row.columnsYes?.includes(columnName)) {
      return "available";
    }
    if (row.columnsNo?.includes(columnName)) {
      return "unavailable";
    }
    return null;
  };

  // Calculate column widths based on whether we have row group names
  const groupNameWidth = hasRowGroupNames ? "32px" : "0";
  const dataColumnsWidth = hasRowGroupNames
    ? `calc(100% - ${rowHeaderWidth})`
    : `calc(100% - ${rowHeaderWidth})`;

  return (
    <div className="w-full mx-auto my-10 overflow-x-auto">
      <table
        className="w-full border-separate border-spacing-0"
        style={{ tableLayout: "fixed", maxWidth: "100%" }}
      >
        <thead>
          <tr className="border-b border-gray-200">
            {hasRowGroupNames && (
              <th
                className="px-2 py-3 border-l-0 border-t-0 border-r-0"
                style={{ width: groupNameWidth, minWidth: groupNameWidth }}
              ></th>
            )}
            <th
              className="px-3 py-3 border-l-0 border-t-0 border-r-0"
              style={{
                width: hasRowGroupNames
                  ? `calc(${rowHeaderWidth} - ${groupNameWidth})`
                  : rowHeaderWidth,
                maxWidth: hasRowGroupNames
                  ? `calc(${rowHeaderWidth} - ${groupNameWidth})`
                  : rowHeaderWidth,
              }}
            ></th>
            {normalizedColumns.map((column, index) => {
              const baseWidth = `calc(${dataColumnsWidth} / ${normalizedColumns.length})`;

              return (
                <th
                  key={column.name}
                  className={`px-1 py-3 text-center font-semibold text-xs border-t border-r border-gray-200 ${
                    index === 0
                      ? "border-l border-gray-200 rounded-tl-md border-tl-0"
                      : ""
                  } ${
                    index === normalizedColumns.length - 1
                      ? "border-r border-gray-200 rounded-tr-md border-tr-0"
                      : ""
                  }`}
                  style={{
                    width: baseWidth,
                    borderTopLeftRadius: index === 0 ? ".375rem" : undefined,
                    borderTopRightRadius:
                      index === normalizedColumns.length - 1
                        ? ".375rem"
                        : undefined,
                  }}
                >
                  <div className="break-words leading-tight">
                    {column.href ? (
                      <Link
                        href={column.href}
                        className="underline"
                        style={{ color: "var(--tgph-accent-11)" }}
                      >
                        {column.name}
                      </Link>
                    ) : (
                      <span className="text-gray-900">{column.name}</span>
                    )}
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>

        <tbody>
          {rowGroups.map((rowGroup, rowGroupIndex) => (
            <React.Fragment key={rowGroup.name}>
              {rowGroup.rows.map((row, rowIndex) => (
                <tr key={row.name}>
                  {hasRowGroupNames && rowIndex === 0 && (
                    <td
                      className={`px-4 bg-gray-100 border-r border-gray-200 relative ${
                        rowGroupIndex !== rowGroups.length - 1
                          ? ""
                          : "border-b border-gray-200"
                      }`}
                      rowSpan={rowGroup.rows.length}
                      style={{
                        width: groupNameWidth,
                        minWidth: groupNameWidth,
                      }}
                    >
                      {rowIndex === 0 && (
                        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gray-400 z-50"></div>
                      )}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="transform -rotate-90 whitespace-nowrap text-sm font-medium text-gray-400">
                          {rowGroup.name}
                        </div>
                      </div>
                    </td>
                  )}

                  <td
                    className={`px-3 py-2 text-sm relative ${
                      rowIndex === rowGroup.rows.length - 1 &&
                      rowGroupIndex !== rowGroups.length - 1
                        ? ""
                        : "border-b border-gray-200"
                    }`}
                  >
                    {rowIndex === 0 && hasRowGroupNames && (
                      <div className="absolute top-0 -left-px -right-px h-0.5 bg-gray-400 z-1"></div>
                    )}
                    {rowIndex === 0 && !hasRowGroupNames && (
                      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gray-400 z-1"></div>
                    )}
                    <div className="text-xs break-words leading-tight">
                      {row.href ? (
                        <Link
                          href={row.href}
                          className="underline"
                          style={{ color: "var(--tgph-accent-11)" }}
                        >
                          {row.name}
                        </Link>
                      ) : (
                        <span className="text-gray-700">{row.name}</span>
                      )}
                    </div>
                  </td>

                  {normalizedColumns.map((column, index) => {
                    return (
                      <td
                        key={`${row.name}-${column.name}`}
                        className={`px-2 py-2 text-center border-r border-gray-200 relative ${
                          index === 0 ? "border-l border-gray-200" : ""
                        } ${
                          index === normalizedColumns.length - 1
                            ? "border-r border-gray-200"
                            : ""
                        } ${
                          rowIndex === rowGroup.rows.length - 1 &&
                          rowGroupIndex !== rowGroups.length - 1
                            ? ""
                            : "border-b border-gray-200"
                        }`}
                      >
                        {rowIndex === 0 && (
                          <div className="absolute top-0 -left-px right-0 h-0.5 bg-gray-400 z-1"></div>
                        )}
                        {(() => {
                          const status = getFeatureStatus(row, column.name);
                          if (!status) return null;

                          const isAvailable = status === "available";
                          const icon = isAvailable ? Check : X;
                          const bgColor = isAvailable
                            ? "var(--tgph-accent-9)"
                            : "var(--tgph-gray-4)";
                          const iconColor = isAvailable ? "white" : "gray";
                          const alt = isAvailable
                            ? "Available"
                            : "Not available";
                          const transform = isAvailable
                            ? "translateY(0.5px)"
                            : undefined;

                          return (
                            <Stack
                              w="3"
                              h="3"
                              rounded="full"
                              alignItems="center"
                              justifyContent="center"
                              mx="auto"
                              style={{ backgroundColor: bgColor }}
                            >
                              <Icon
                                icon={icon}
                                color={iconColor}
                                size="0"
                                aria-hidden={false}
                                alt={alt}
                                style={{
                                  width: "90%",
                                  height: "90%",
                                  transform,
                                }}
                              />
                            </Stack>
                          );
                        })()}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FeaturesMatrix;
