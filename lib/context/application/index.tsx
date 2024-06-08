"use client";

import { useGetApplication } from "@/lib/api/queries/applications";
import React, { createContext, useEffect, useState } from "react";

interface ApplicationContextProps {
  applicationId: string;
  setApplicationId: React.Dispatch<React.SetStateAction<string>>;
  application: Application | undefined;
  // setApplication: React.Dispatch<React.SetStateAction<Application | null>>;
  status: "Done" | "Loading" | "Analyzing" | "Analyzed" | "Saving to database";
  setStatus: React.Dispatch<
    React.SetStateAction<
      "Done" | "Loading" | "Analyzing" | "Analyzed" | "Saving to database"
    >
  >;
}

const ApplicationContext = createContext<ApplicationContextProps>({
  applicationId: "",
  setApplicationId: () => {},
  application: undefined,
  // setApplication: () => {},
  status: "Loading",
  setStatus: () => {},
});

const ApplicationProvider = ({ children, id }: { id: string,children: React.ReactNode }) => {
  const [applicationId, setApplicationId] = useState<string>("");
  // const [application, setApplication] = useState<Application | null>(null);
  const { data: applicationData, status: applicationStatus } = useGetApplication(id);
  const [status, setStatus] = useState<
    "Done" | "Loading" | "Analyzing" | "Analyzed" | "Saving to database"
  >("Loading");

  // console.log(applicationStatus === 'success' && applicationData?.application && applicationData.application.aiStatus === 'not-started')
  useEffect(() => { 
    if (applicationStatus === "pending") {
      setStatus("Loading");
    }
  }, [applicationStatus]);

  // useEffect(() => {
  //   console.log(applicationStatus)
  // }, [applicationStatus])

  // useEffect(() => {
  //   if (applicationStatus === "success" && data && data.application) {
  //     console.log(data.application);
  //     setApplication(data.application);
  //     if(data.application.status === '') {
        
  //     }
  //   }
  // }, [applicationStatus, data]);


  const application = applicationData?.application;

  return (
    <ApplicationContext.Provider
      value={{
        applicationId,
        setApplicationId,
        application,
        // setApplication,
        status,
        setStatus,
      }}
    >
      {children}
    </ApplicationContext.Provider>
  );
};

export { ApplicationContext, ApplicationProvider };
