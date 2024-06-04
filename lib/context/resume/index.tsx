'use client';

import React, { createContext, useContext, useEffect, useState } from "react";
import { context } from "..";

interface LayoutContextProps {
  title: string;
  setTitle: (title: string) => void;
  resume: any | null,
  setResume: React.Dispatch<React.SetStateAction<any>>;
  status:  "Done" | "Loading" | "Analyzing" | "Analyzed" | "Saving to database";
  setStatus: React.Dispatch<React.SetStateAction<"Done" | "Loading" | "Analyzing" | "Analyzed" | "Saving to database">>;
}

const LayoutContext = createContext<LayoutContextProps>({
  title: "",
  setTitle: () => {},
  resume: null,
  setResume: () => {},
  status: "Loading",
  setStatus: () => {}
});

const LayoutProvider = ({ children }: { children: React.ReactNode }) => {
  const [title, setTitle] = useState<string>("");
  const [resume, setResume] = useState<Resume | null>(null);
  const [status, setStatus] = useState<"Done" | "Loading" | "Analyzing" | "Analyzed" | "Saving to database">("Loading");

  return (
    <LayoutContext.Provider value={{ status, setStatus, title, setTitle, resume, setResume }}>
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