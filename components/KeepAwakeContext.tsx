import React, { createContext, useState, ReactNode } from 'react';

interface KeepAwakeContextProps {
  keepAwake: boolean;
  setKeepAwake: (value: boolean) => void;
}

export const KeepAwakeContext = createContext<KeepAwakeContextProps>({
  keepAwake: false,
  setKeepAwake: () => {},
});

export const KeepAwakeProvider = ({ children }: { children: ReactNode }) => {
  const [keepAwake, setKeepAwake] = useState(false);

  return (
    <KeepAwakeContext.Provider value={{ keepAwake, setKeepAwake }}>
      {children}
    </KeepAwakeContext.Provider>
  );
};
