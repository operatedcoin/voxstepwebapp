import React, { createContext, useState } from 'react';

interface AnswerContextProps {
  selectedAnswers: string[];
  setSelectedAnswers: React.Dispatch<React.SetStateAction<string[]>>;
}

export const AnswerContext = createContext<AnswerContextProps>({
  selectedAnswers: [],
  setSelectedAnswers: () => {},
});

export const AnswerProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);

  return (
    <AnswerContext.Provider value={{ selectedAnswers, setSelectedAnswers }}>
      {children}
    </AnswerContext.Provider>
  );
};
