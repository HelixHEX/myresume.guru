"use client";

import React, { createContext, useState } from "react";

interface LayoutContextProps {
  sortBy: string;
  setSortBy: React.Dispatch<React.SetStateAction<string>>;
  resume: any | null;
  setResume: React.Dispatch<React.SetStateAction<any>>;
  status: "Done" | "Loading" | "Analyzing" | "Analyzed" | "Saving to database";
  setStatus: React.Dispatch<
    React.SetStateAction<
      "Done" | "Loading" | "Analyzing" | "Analyzed" | "Saving to database"
    >
  >;
  feedbacks: Feedback[],
  setFeedbacks: React.Dispatch<React.SetStateAction<Feedback[]>>;
}

const LayoutContext = createContext<LayoutContextProps>({
  sortBy: "",
  setSortBy: () => {},
  resume: null,
  setResume: () => {},
  status: "Loading",
  setStatus: () => {},
  feedbacks: [],
  setFeedbacks: () => {},
});

const LayoutProvider = ({ children }: { children: React.ReactNode }) => {
  const [resume, setResume] = useState<Resume | null>(null);
  const [status, setStatus] = useState<
    "Done" | "Loading" | "Analyzing" | "Analyzed" | "Saving to database"
  >("Loading");
  const [sortBy, setSortBy] = useState<string>("");
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  return (
    <LayoutContext.Provider
      value={{ sortBy, setSortBy, status, setStatus, resume, setResume, feedbacks, setFeedbacks }}
    >
      {children}
    </LayoutContext.Provider>
  );
};

/*

LEGACY CODE

const ChangeTitle = ({title}: {title: string}) => {
  const {setTitle} = useContext(context.resume.LayoutContext)
  
  useEffect(() => {
    setTitle(title)
  }, [title, setTitle]);

  return null;
}

*/

export { LayoutContext, LayoutProvider };
