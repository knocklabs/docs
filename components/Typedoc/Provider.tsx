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
  return useContext(TypedocsContext);
};

export const useTypedoc = (slug: string) => {
  const { typedocs } = useTypedocs();
  return typedocs.find((typedoc) => typedoc.slug === slug);
};
