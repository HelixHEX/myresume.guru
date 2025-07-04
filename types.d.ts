type Resume = {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  userId: string;
  fileKey: string;
  status: string;
  text: string | null;

  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  github: string;
  linkedin: string;
  twitter: string;
  summary: string;
  skills: string;
  workExperience: WorkExperience[];
  education: Education[];
  education_new?: Education[];
  
  projects: Project[];
  certifications: Certification[];
  applications?: Application[];
  activeApplication?: Application[];
  feedbacks?: Feedback[];
  actionableFeedbacks?: ActionableFeedback[];
  improvements?: Improvement[];
};

type WorkExperience = {
  company?: string;
  title?: string;
  summary?: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  current?: boolean;
}

type Education = {
  school?: string;
  degree?: string;
  fieldOfStudy?: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  current?: boolean;
}

type Project = {
  name?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  url?: string;
}

type Certification = {
  name?: string;
  dae?: string;
}


type Company = {
  id: number;
  createdAt: string;
  updatedAt: string;
  name: string;
  userId: string;
  applications?: Application[];
};

type Application = {
  id: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  title: string;
  status: string;
  aiStatus: string;
  description: string;
  company?: Company;
  companyId?: number;
  resume?: Resume[];
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

type Improvement = {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  title: string;
  text: string;
  status: string;
  priority: number;
}

type FeedbackSchema = {
  title: string;
  text: string;
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

type MessageInput = {
  content: string;
  createdAt?: Date;
  id: string;
  role: string;
}

type Message = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  content: string;
  role: string;

  application?: Application | null;
  applicationId?: number | null;
  resume?: Resume | null;
  resumeId?: number | null;
}

// type ApiResponse = {
//   type: "http";
//   response: { feedbacks?: Feedback[]; error?: string; message?: string };
// };
// type StreamableApiResponse = {
//   type: "stream";
//   response: StreamableValue<{
//     error?: string | null | undefined;
//     feedbacks?: FeedbackStreamableValue;
//     message?: string | null | undefined;
//   }>;
// };

type AsyncIterableStream<T> = AsyncIterable<T> & ReadableStream<T>

