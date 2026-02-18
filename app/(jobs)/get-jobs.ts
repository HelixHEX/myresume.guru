import { schedules } from "@trigger.dev/sdk/v3";
import axios from "axios";
import prisma from "@/lib/prisma";
import { Browserbase } from "@browserbasehq/sdk";
import { chromium } from "playwright-core";

const bb = new Browserbase({ apiKey: process.env.BROWSERBASE_API_KEY! });

// Function to extract the actual job URL using Browserbase + Playwright
const resolveJobicyUrl = async (jobicyUrl: string): Promise<string> => {
  let session;
  let browser;
  let page;

  try {
    // Create a session
    session = await bb.sessions.create({
      projectId: process.env.BROWSERBASE_PROJECT_ID!
    });

    // Connect and automate
    browser = await chromium.connectOverCDP(session.connectUrl);
    page = await browser.newPage();

    console.log(`Navigating to Jobicy URL: ${jobicyUrl}`);

    // Navigate to the Jobicy page
    await page.goto(jobicyUrl, { waitUntil: 'networkidle', timeout: 30000 });

    // Wait for the page to load and look for the "Apply Now" button
    console.log('Looking for Apply Now button...');
    // 
    await page.waitForSelector('button:has-text("Apply Now")', { timeout: 10000 });

    // Click the "Apply Now" button
    console.log('Clicking Apply Now button...');
    await page.click('button:has-text("Apply Now")');

    // Wait for the modal to appear and look for the "Continue as Guest" button
    console.log('Waiting for modal to appear...');
    await page.waitForSelector('button[apply-url]', { timeout: 10000 });

    // Get all buttons with apply-url and their attributes
    const buttonInfo = await page.evaluate(() => {
      const buttons = document.querySelectorAll('button[apply-url]');
      return Array.from(buttons).map(button => ({
        id: button.id,
        applyUrl: button.getAttribute('apply-url'),
        text: button.textContent?.trim(),
        className: button.className
      }));
    });

    console.log('Found buttons with apply-url:', buttonInfo);

    // Look for the "Continue as Guest" button
    const continueButton = await page.evaluate(() => {
      const buttons = document.querySelectorAll('button[apply-url]');
      for (const button of buttons) {
        if (button.textContent?.includes('Continue as Guest')) {
          return {
            id: button.id,
            applyUrl: button.getAttribute('apply-url'),
            text: button.textContent.trim()
          };
        }
      }
      return null;
    });

    if (continueButton) {
      console.log('Found Continue as Guest button:', continueButton);

      // Set up page event listener before clicking
      const pagePromise = browser.contexts()[0].waitForEvent('page');

      // Wait for the specific button to be visible and clickable
      console.log('Waiting for Continue as Guest button to be clickable...');
      await page.waitForSelector(`button[apply-url]:has-text("Continue as Guest")`, {
        state: 'visible',
        timeout: 10000
      });

      // Click the "Continue as Guest" button
      console.log('Clicking Continue as Guest button...');
      await page.click(`button[apply-url]`);
      console.log('Page Clicked');

      // Wait for either a new page or navigation
      // If no new page opened, check if current page navigated
      console.log('checking if current page navigated...');
      await page.waitForLoadState('networkidle');
      const currentUrl = page.url();
      console.log(`Current URL after clicking: ${currentUrl}`);

      // Check if URL changed (indicating navigation)
      if (currentUrl !== jobicyUrl) {
        return currentUrl;
      } else {
        console.log('URL did not change, button click may not have worked');
        return jobicyUrl;
      }
    } else {
      console.log('No Continue as Guest button found');
      return jobicyUrl;
    }

  } catch (error: any) {
    console.error(`Failed to resolve URL ${jobicyUrl}:`, error.message);
    return jobicyUrl; // Fallback to original URL
  } finally {
    // Clean up: close browser and end session
    try {
      if (browser) {
        await browser.close();
      }
    } catch (cleanupError) {
      console.error('Error during cleanup:', cleanupError);
    }
  }
};

export const getJobs = schedules.task({
  id: 'get-jobs',
  // every 1 hour
  cron: {
    pattern: '0 * * * *',
    timezone: 'America/Los_Angeles',
  },
  run: async () => {
    const res = await axios.get(`${process.env.JOBS_API_URL}?count=100`)
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
        console.log('job already exists', job.id)
        continue
      }

      // Resolve the actual job URL
      console.log(`Resolving URL for job ${job.id}: ${job.url}`);
      const actualUrl = await resolveJobicyUrl(job.url);
      console.log(`Resolved URL: ${actualUrl}`);

      await prisma.job.create({
        data: {
          platformId: job.id.toString(),
          platform: 'jobicy',
          url: actualUrl, // Use the resolved URL instead of Jobicy URL
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