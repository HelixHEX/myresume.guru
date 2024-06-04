'use client';

import { createContext, useContext, useEffect, useState } from "react";
import { context } from "..";

interface LayoutContextProps {
  title: string;
  setTitle: (title: string) => void;
  resume: any | null,
  setResume: (resume: any) => void;
}

const LayoutContext = createContext<LayoutContextProps>({
  title: "",
  setTitle: () => {},
  resume: null,
  setResume: () => {}
});

const LayoutProvider = ({ children }: { children: React.ReactNode }) => {
  const [title, setTitle] = useState<string>("");
  const [resume, setResume] = useState<Resume | null>(null);

  return (
    <LayoutContext.Provider value={{ title, setTitle, resume, setResume }}>
      {children}
    </LayoutContext.Provider>
  );
};

const ChangeTitle = ({title}: {title: string}) => {
  const {setTitle} = useContext(context.resume.LayoutContext)
  
  useEffect(() => {
    setTitle(title)
  }, [title, setTitle]);

  return null;
}

export { LayoutContext, LayoutProvider, ChangeTitle };