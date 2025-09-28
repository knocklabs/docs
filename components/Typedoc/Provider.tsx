import { createContext, useContext } from "react";
import { TypedocPage } from "@/lib/typedoc";

const TypedocsContext = createContext<{ typedocs: TypedocPage[] }>({
  typedocs: [],
});

export const TypedocsProvider = ({
  children,
  typedocs,
}: {
  children: React.ReactNode;
  typedocs: TypedocPage[];
}) => {
  return (
    <TypedocsContext.Provider value={{ typedocs }}>
      {children}
    </TypedocsContext.Provider>
  );
};

export const useTypedocs = () => {
  const context = useContext(TypedocsContext);
  if (context === undefined) {
    throw new Error("useTypedocs must be used within a TypedocsProvider");
  }
  return context;
};

export const useTypedoc = (slug: string) => {
  const { typedocs } = useTypedocs();
  return typedocs.find((typedoc) => typedoc.slug === slug);
};
