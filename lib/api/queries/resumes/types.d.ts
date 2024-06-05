type GetAllResumesResponse = Resume[]

type GetResumeFeedbackResponse = {
  feedbacks?: Feedback[]
  message?: string
}

type GetResumeResponse = {
  resume?: Resume
  message?: string
}