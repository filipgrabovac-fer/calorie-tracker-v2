"use client";

import { createContext, useContext, useState } from "react";

export type PersonType = "filip" | "klara";

export type GlobalStateDataType = {
  person_type: PersonType | null;
  setPerson: (person: PersonType) => void;
};

const GlobalStateContext = createContext<GlobalStateDataType>({
  person_type: null,
  setPerson: () => {},
});

export const GlobalStateProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [person_type, setPerson] = useState<PersonType | null>(null);

  return (
    <GlobalStateContext.Provider value={{ person_type, setPerson }}>
      {children}
    </GlobalStateContext.Provider>
  );
};

export const useGlobalState = () => {
  return useContext(GlobalStateContext);
};
