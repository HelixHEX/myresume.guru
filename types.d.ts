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
  aiStatus: String;
  description: string;
  company?: Company;
  resumes?: Resume[];
  currentResume?: Resume;
  feedbacks?: Feedback[];
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

type ApplicationScore =  {
  title: string;
  score: number;
}


const ApplicationScoreSchema = z.object({
  scores: z
    .array(
      z.object({
        title: z.string().describe("The title of the section"),
        score: z.number().describe("The score of the skill"),
      })
    )
    .describe("The scores on the resume"),
  error: z
    .string()
    .optional()
    .describe("An error message if the job description does not look like a  job description"),
});