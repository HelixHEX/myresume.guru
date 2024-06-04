type Resume = {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  userId: string;
  fileKey: string;
  status: string;
  text: string | null;

  applications?: Application[];
  activeApplication?: Application[];
  feedbacks?: Feedback[];
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

type FeedbackSchema = {
  title: string;
  text: string;
}