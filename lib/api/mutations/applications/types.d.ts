type CreateApplication = {
  title: string;
  url: string;
  resumeId: number;
  jobDescription: string;
  companyId: number;
}

type CreateApplicationResponse = {
  application?: Application;
  message?: string;
};

type CreateApplicationResponse = {
  application?: Application;
  message?: string;
}

type UseAddApplication = {
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  setUrl: React.Dispatch<React.SetStateAction<string>>;
  setJobDescription: React.Dispatch<React.SetStateAction<string>>;
  setResumeId: React.Dispatch<React.SetStateAction<number | null>>;
  companyId: number;
}