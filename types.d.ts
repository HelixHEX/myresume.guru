type Resume = {
  id: number;
  createdAt: string;
  updatedAt: string;
  name: string;
  userId: string;
  fileKey: string;
  applications?: Application[];
  activeApplication?: Application[];
};

type Company = {
  id: number;
  createdAt: string;
  updatedAt: string;
  name: string;
  userId: string;
  applications?: Application[];
};

type Application = {
  id: number;
  createdAt: string;
  updatedAt: string;
  userId: string;
  name: string;
  status: String;
  company?: Company;
  resumes?: Resume[];
  currentResume?: Resume;
};
