type GetApplicationsResponse = {
  applications: Application[];
  message?: string;
};

type GetApplicationResponse = {
  application?: Application;
  message?: string;
};

type GenerateApplicationFeedbackResponse = {
  error?: string;
  response: { scores: ApplicationScore[] };
};
