'use client';

import { createContext, useContext, useEffect, useState } from "react";
import { context } from "..";

interface LayoutContextProps {
  title: string;
  setTitle: (title: string) => void;
}

const LayoutContext = createContext<LayoutContextProps>({
  title: "",
  setTitle: () => {},
});

const LayoutProvider = ({ children }: { children: React.ReactNode }) => {
  const [title, setTitle] = useState<string>("");

  return (
    <LayoutContext.Provider value={{ title, setTitle }}>
      {children}
    </LayoutContext.Provider>
  );
};

const ChangeTitle = ({title}: {title: string}) => {
  const {setTitle} = useContext(context.resume.LayoutContext)
  
  useEffect(() => {
    setTitle("Improve your resume")
  }, [setTitle]);

  return null;
}

export { LayoutContext, LayoutProvider, ChangeTitle };
