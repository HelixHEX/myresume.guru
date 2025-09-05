import { schedules } from "@trigger.dev/sdk/v3";
import axios from "axios";
import prisma from "@/lib/prisma";
export const getJobs = schedules.task({
  id: 'get-jobs',
  // every 1 hour
  cron: {
   pattern: '0 * * * *',
   timezone: 'America/Los_Angeles',
  },
  run: async () => {
    const res = await axios.get(`${process.env.JOBS_API_URL}?count=100&geo=usa&industry=engineering`)
    console.log('before', res.data.jobs.length)
    res.data.jobs = res.data.jobs.filter((job: any) => job.salaryMin && job.salaryMax && job.salaryCurrency)
    console.log('after', res.data.jobs.length)
    for (const job of res.data.jobs) {
      const exists = await prisma.job.findFirst({
        where: {
          AND: [
            {
              platformId: job.id.toString()
            },
            {
              platform: 'jobicy'
            }
          ]
        }
      })
      if (exists) {
        continue
      }
      await prisma.job.create({
        data: {
          platformId: job.id.toString(),
          platform: 'jobicy',
          url: job.url,
          jobSlug: job.jobSlug,
          jobTitle: job.jobTitle,
          companyName: job.companyName,
          companyLogo: job.companyLogo,
          jobIndustry: job.jobIndustry,
          jobType: job.jobType,
          jobGeo: job.jobGeo,
          jobLevel: job.jobLevel,
          jobExcerpt: job.jobExcerpt,
          jobDescription: job.jobDescription,
          pubDate: job.pubDate,
          salaryMin: job.salaryMin,
          salaryMax: job.salaryMax,
          salaryCurrency: job.salaryCurrency,
          salaryPeriod: job.salaryPeriod,
        }
      })
    }

  }
})