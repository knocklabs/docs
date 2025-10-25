import { Icon } from "@telegraph/icon";
import { Stack } from "@telegraph/layout";
import { Check } from "lucide-react";
import Link from "next/link";

interface Feature {
  name: string;
  href?: string;
  columns: string[];
}

interface FeatureCategory {
  name: string;
  features: Feature[];
}

interface ColumnHeader {
  name: string;
  href?: string;
}

interface FeaturesMatrixProps {
  columnHeaders: (string | ColumnHeader)[];
  categories: FeatureCategory[];
}

const FeaturesMatrix = ({ columnHeaders, categories }: FeaturesMatrixProps) => {
  const normalizedHeaders = columnHeaders.map((header) =>
    typeof header === "string" ? { name: header } : header,
  );

  const hasFeature = (feature: Feature, columnName: string): boolean => {
    return feature.columns.includes(columnName);
  };

  return (
    <div className="w-full mx-auto my-10">
      <table
        className="w-full border-separate border-spacing-0"
        style={{ tableLayout: "fixed" }}
      >
        <thead>
          <tr className="border-b border-gray-200">
            <th
              className="w-8 px-2 py-3 border-l-0 border-t-0 border-r-0"
              style={{ width: "32px" }}
            ></th>
            <th className="px-3 py-3 border-l-0 border-t-0 border-r-0"></th>
            {normalizedHeaders.map((header, index) => {
              const baseWidth = `${55 / normalizedHeaders.length}%`;

              return (
                <th
                  key={header.name}
                  className={`px-1 py-3 text-center font-semibold text-gray-900 text-xs border-t border-r border-gray-200 truncate ${
                    index === 0
                      ? "border-l border-gray-200 rounded-tl-md border-tl-0"
                      : ""
                  } ${
                    index === normalizedHeaders.length - 1
                      ? "border-r border-gray-200 rounded-tr-md border-tr-0"
                      : ""
                  }`}
                  style={{
                    width: baseWidth,
                    minWidth: "55px",
                    maxWidth: "70px",
                    borderTopLeftRadius: index === 0 ? ".375rem" : undefined,
                    borderTopRightRadius:
                      index === normalizedHeaders.length - 1
                        ? ".375rem"
                        : undefined,
                  }}
                >
                  {header.href ? (
                    <Link
                      href={header.href}
                      className="hover:underline text-gray-900"
                    >
                      {header.name}
                    </Link>
                  ) : (
                    header.name
                  )}
                </th>
              );
            })}
          </tr>
        </thead>

        <tbody>
          {categories.map((category, categoryIndex) => (
            <>
              {category.features.map((feature, featureIndex) => (
                <tr key={feature.name}>
                  {featureIndex === 0 && (
                    <td
                      className={`w-8 px-4 bg-gray-100 border-r border-gray-200 relative ${
                        categoryIndex !== categories.length - 1
                          ? ""
                          : "border-b border-gray-200"
                      }`}
                      rowSpan={category.features.length}
                      style={{ width: "32px" }}
                    >
                      {featureIndex === 0 && (
                        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gray-400 z-50"></div>
                      )}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="transform -rotate-90 whitespace-nowrap text-sm font-medium text-gray-400">
                          {category.name}
                        </div>
                      </div>
                    </td>
                  )}

                  <td
                    className={`px-3 py-2 text-sm relative ${
                      featureIndex === category.features.length - 1 &&
                      categoryIndex !== categories.length - 1
                        ? ""
                        : "border-b border-gray-200"
                    }`}
                    style={{
                      minWidth: "150px",
                    }}
                  >
                    {featureIndex === 0 && (
                      <div className="absolute top-0 -left-px -right-px h-0.5 bg-gray-400 z-1"></div>
                    )}
                    <div className="text-gray-700 text-xs break-words leading-tight">
                      {feature.href ? (
                        <Link
                          href={feature.href}
                          className="hover:underline text-gray-700"
                        >
                          {feature.name}
                        </Link>
                      ) : (
                        feature.name
                      )}
                    </div>
                  </td>

                  {normalizedHeaders.map((header, index) => {
                    return (
                      <td
                        key={`${feature.name}-${header.name}`}
                        className={`px-2 py-2 text-center border-r border-gray-200 relative ${
                          index === 0 ? "border-l border-gray-200" : ""
                        } ${
                          index === normalizedHeaders.length - 1
                            ? "border-r border-gray-200"
                            : ""
                        } ${
                          featureIndex === category.features.length - 1 &&
                          categoryIndex !== categories.length - 1
                            ? ""
                            : "border-b border-gray-200"
                        }`}
                      >
                        {featureIndex === 0 && (
                          <div className="absolute top-0 -left-px right-0 h-0.5 bg-gray-400 z-1"></div>
                        )}
                        {hasFeature(feature, header.name) && (
                          <Stack
                            w="3"
                            h="3"
                            rounded="full"
                            alignItems="center"
                            justifyContent="center"
                            mx="auto"
                            style={{
                              backgroundColor: "var(--tgph-accent-9)",
                            }}
                          >
                            <Icon
                              icon={Check}
                              color="white"
                              size="0"
                              aria-hidden={false}
                              alt="Check"
                              style={{
                                width: "90%",
                                height: "90%",
                                transform: "translateY(0.5px)",
                              }}
                            />
                          </Stack>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FeaturesMatrix;
