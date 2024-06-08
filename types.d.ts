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
  title: string;
  status: String;
  description: string;
  company?: Company;
  resumes?: Resume[];
  currentResume?: Resume;
};

type Item = {
  key: string;
  value: Feedback;
}

type Feedback = {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  title: string;
  text: string;
  status: string;

  application?: Application | null;
  applicationId?: number | null;
  resume?: Resume | null;
  resumeId?: number | null;
}

type FeedbackSchema = {
  title: string;
  text: string;
}