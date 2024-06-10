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
  actionableFeedbacks?: ActionableFeedback[];
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
  aiStatus: String;
  description: string;
  company?: Company;
  companyId?: number;
  resumes?: Resume[];
  currentResume?: Resume;
  feedbacks?: Feedback[];
  applicationScores?: ApplicationScore[];
  actionableFeedbacks?: ActionableFeedback[];
};

type ApplicationScore = {
  id: number;
  createdAt: string;
  updatedAt: string;
  userId: string;
  title: string;
  score: number;
  description?: string;
  resumeId?: number;
  resume?: Resume;
}

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
  text?: string | null;
  error?: string;
  status: string;

  application?: Application | null;
  applicationId?: number | null;
  resume?: Resume | null;
  resumeId?: number | null;
  actionableFeedbacks?: ActionableFeedback[];
}

type FeedbackSchema = {
  title: string;
  text: string;
}

type ApplicationScore =  {
  title: string;
  score: number;
}


type ActionableFeedback = {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  title: string;
  text: string;
  status: string;

  feedback?: Feedback | null;
  application?: Application | null;
  applicationId?: number | null;
  resume?: Resume | null;
  resumeId?: number | null;
}