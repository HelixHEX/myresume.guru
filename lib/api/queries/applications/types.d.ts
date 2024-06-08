type GetApplicationsResponse = {
  applications: Application[];
};

type GetApplicationResponse = {
  application?: Application;
  message?: string;
};

type GenerateApplicationFeedbackResponse = {
  error?: string;
  response: { scores: ApplicationScore[] };
};
