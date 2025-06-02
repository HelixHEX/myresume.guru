"use client";
import Footer from "@/components/footer";
import Header from "@/components/header";
import FeatureCard from "@/components/home/featureCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import {
  BriefcaseBusiness,
  Chrome,
  CircleCheck,
  FileEdit,
  FileText,
  Megaphone,
  Search,
  Sparkle,
  Sparkles,
  WandSparkles,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Fade, Jello, Slide, Tada, Zoom } from "react-swift-reveal";
import Editor from "./app/(resumes)/_components/editor";
import PDFPreview from "./app/(resumes)/_components/editor/preview";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import React, { useState } from "react";
import { Hero115 } from "@/components/home/hero";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";
import { useGetDownloadedResumes } from "./app/(resumes)/lib/queries";

const text = `The resume currently lacks a personal summary, which is a crucial section that provides a snapshot of your professional identity and career goals. A well-crafted summary can capture the attention of hiring managers and set the tone for the rest of the resume.**Actionable Steps:**1. Write a concise summary (3-4 sentences) that highlights your key skills, experiences, and career objectives.2. Focus on your strengths in software development and project management.3. Mention any unique qualities or achievements that differentiate you from other candidates.**Example:**"Dynamic software engineer with over 5 years of experience in developing scalable web applications and leading project management initiatives. Proven track record in enhancing user engagement and satisfaction through innovative solutions. Passionate about leveraging AI to improve user experiences and drive business growth."`;

export default function Home() {
  const { user } = useUser();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const { data: downloadedResumes } = useGetDownloadedResumes();

  const formSchema = z.object({
    email: z.string().email().min(1, { message: "Email is required" }),
    mailingLists: z.string().min(1, { message: "Mailing list is required" }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      mailingLists: "cmbdbg9160zof0j08bs697wit",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    toast.promise(
      async () => {
        const encodedEmail = encodeURIComponent(data.email);
        const encodedMailingLists = encodeURIComponent(data.mailingLists);
        const encodedFirstName = encodeURIComponent(user?.firstName || "");
        const encodedLastName = encodeURIComponent(user?.lastName || "");
        const body = `email=${encodedEmail}&mailingLists=${encodedMailingLists}&firstName=${encodedFirstName}&lastName=${encodedLastName}`;
        await axios
          .post(
            "https://app.loops.so/api/newsletter-form/cmbd7l5oo08oe2u0ivt4j73rq",
            body,
            {
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
              },
            }
          )
          .then(() => {
            form.reset();
            setSubscribed(true);
          });
      },
      {
        loading: "Submitting...",
        success: "Subscribed successfully",
        error: "Failed to subscribe",
      }
    );
  };

  return (
    <>
      <Header />
      <div className="p-6  mb-44 pt-[62px] w-full h-auto flex flex-col">
        <Hero115
          icon={
            <Sparkles className="h-4 w-4 text-black dark:text-neutral-400" />
          }
          heading="Land your dream job with MyResume.guru"
          description="Craft a resume that stands out."
          button={{ text: "Try now!", url: "/sign-up" }}
        />
        <div className="pt-4 flex flex-col lg:w-[1000px] w-full self-center">
          {/* EDITOR SECTION */}
          <div className="flex pt-20 pb-2 gap-4 items-center justify-center">
            <Sparkles />
            <h1 className=" text-center font-bold text-4xl">
              Create a <span className="text-blue-800">free</span> resume!
            </h1>
            <Sparkles />
          </div>
          {/* <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="self-center pb-8"
          >
            <div className=" self-center font-bold">
              Over <span className="text-blue-800">{downloadedResumes?.downloadedResumes}</span> resumes downloaded
            </div>
          </motion.div> */}

          <div className="w-full shadow-lg bg-[#F6F6F6] rounded-lg flex h-full max-h-screen overflow-y-auto">
            <div className="h-full p-4 px-4 sm:px-8 transition-all duration-300 w-full lg:w-[700px] bg-white ">
              <div className="md:hidden h-full w-full pt-4">
                <Tabs defaultValue="edit" className="w-full">
                  <div className="flex justify-center gap-4">
                    <TabsList className="self-center">
                      <TabsTrigger
                        className="cursor-pointer text-blue-800 data-[state=active]:text-white data-[state=active]:bg-blue-800 bg-white rounded-none border-none"
                        value="edit"
                      >
                        Edit
                      </TabsTrigger>
                      <TabsTrigger
                        className="cursor-pointer text-blue-800 data-[state=active]:bg-blue-800 bg-white data-[state=active]:text-white rounded-none border-none"
                        value="preview"
                      >
                        Preview
                      </TabsTrigger>
                    </TabsList>
                  </div>
                  <TabsContent className="h-full  flex w-full" value="edit">
                    <Editor isHomePage={true} resumeId={""} />
                  </TabsContent>
                  <TabsContent className="w-full md:flex" value="preview">
                    <PDFPreview />
                  </TabsContent>
                </Tabs>
              </div>
              <div className="hidden md:block">
                <div className="flex gap-2 ">
                  <h1 className=" text-4xl font-bold text-blue-800 sm:text-white">
                    New Resume
                  </h1>
                </div>
                <Editor resumeId={""} />
              </div>
            </div>
            <div className="hidden bg-[#F6F6F6] w-full md:flex">
              <PDFPreview />
            </div>
          </div>
          {/* NEWSLETTER SECTION */}
          <div
            id="newsletter"
            className="flex flex-col w-full pt-30 sm:pt-60 self-center"
          >
            <Fade delay={300}>
              <h1 className="text-2xl w-full sm:w-[680px] sm:text-5xl font-bold">
                Subscribe to the{" "}
                <span className="text-blue-800">Hiring Scroll</span> newsletter.
              </h1>
            </Fade>
            <Fade delay={600}>
              <p className=" w-full text-muted-foreground sm:w-[600px] mt-4">
                I know that writing a great resume is just the first step —
                finding the right job is what truly matters.
              </p>
            </Fade>
            <Fade delay={900}>
              <p className="mt-4 w-full sm:max-w-[600px] text-muted-foreground">
                {" "}
                That&apos;s why I launched the Hiring Scroll, a{" "}
                <span className="text-blue-800 font-bold">free</span> (for now)
                weekly job listings newsletter, curated specifically for users
                like you.
              </p>
            </Fade>
            <Fade delay={1200}>
              <p className="mt-4 text-gray-700 font-bold">
                {" "}
                Every week, you&apos;ll get:
              </p>
            </Fade>
            <Fade delay={1500}>
              <p className="text-muted-foreground">
                ✅ Remote-friendly roles from top companies
              </p>
              <p className="text-muted-foreground">
                ✅ Entry-level to senior openings based on your profile
              </p>
              <p className="text-muted-foreground">✅ Job tips and advice</p>
              <p className="text-muted-foreground">
                ✅ No spam — just real opportunities
              </p>
            </Fade>
            <Fade delay={subscribed ? 0 : 1800}>
              {!subscribed ? (
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4 pt-4 flex flex-col sm:flex-row w-auto sm:gap-4"
                  >
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="flex flex-col gap-2">
                          <FormControl>
                            <Input
                              className="rounded-md w-[400px]"
                              placeholder="Enter your email"
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="mailingLists"
                      render={({ field }) => (
                        <FormItem className="flex flex-col gap-2">
                          <FormControl>
                            <Input
                              className="rounded-md w-[400px] hidden"
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      variant="outline"
                      className="rounded-md px-8 bg-linear-to-b from-white to-gray-300/30 hover:from-blue-800/50 hover:to-blue-900 text-blue-800 cursor-pointer hover:bg-blue-800 hover:text-white"
                    >
                      Subscribe
                    </Button>
                  </form>
                </Form>
              ) : (
                <p className="font-bold text-blue-800 mt-4">
                  Thanks for subscribing!
                </p>
              )}
            </Fade>
          </div>
          {/* FEATURES SECTION */}
          <div className="flex flex-col pt-40 w-full sm:self-center ">
            <h1 className="text-4xl  font-bold">Features</h1>
            <div className="flex w-full items-center h-full justify-between flex-col lg:flex-row mt-8">
              <ul className="grid grid-cols-1 grid-rows-none gap-4 md:grid-cols-12 md:grid-rows-3 lg:gap-4 xl:max-h-[34rem] xl:grid-rows-2">
                <GridItem
                  area="md:[grid-area:1/1/2/7] xl:[grid-area:1/1/2/5]"
                  icon={
                    <Sparkles className="h-4 w-4 text-black dark:text-neutral-400" />
                  }
                  title="AI-powered suggestions"
                  description="Our AI powered resume scanner will help you identify areas of improvement."
                />
                <GridItem
                  delay={600}
                  area="md:[grid-area:1/7/2/13] xl:[grid-area:2/1/3/5]"
                  icon={
                    <WandSparkles className="h-4 w-4 text-black dark:text-neutral-400" />
                  }
                  title="AI Resume Guru"
                  description="Personalized AI resume assistant. You can ask questions about your resume or get tips on how to prepare for an interview."
                />
                <GridItem
                  delay={400}
                  area="md:[grid-area:2/1/3/7] xl:[grid-area:1/5/3/8]"
                  icon={
                    <BriefcaseBusiness className="h-4 w-4 text-black dark:text-neutral-400" />
                  }
                  title="Job Application Tracker"
                  description="You can keep track of the jobs you've applied to and the status of your applications."
                />
                <GridItem
                  delay={600}
                  area="md:[grid-area:2/7/3/13] xl:[grid-area:1/8/2/13]"
                  icon={
                    <FileEdit className="h-4 w-4 text-black dark:text-neutral-400" />
                  }
                  title="Resume Builder"
                  description="The resume builder will help you cresume that stands out from the crowd."
                />
                <GridItem
                  delay={300}
                  area="md:[grid-area:2/7/3/13] xl:[grid-area:2/8/2/13]"
                  icon={
                    <Chrome className="h-4 w-4 text-black dark:text-neutral-400" />
                  }
                  title="Chrome Extension"
                  description="With the chrome extension, you can generate tailored resumes for job applications and auto apply to jobs on sites like LinkedIn & Indeed.  (Comming soon...!)"
                />
              </ul>
            </div>
          </div>

          {/* FEEDBACK SECTION */}
          <div className="mt-44 flex flex-col w-full self-center">
            <Zoom duration={1000}>
              <h1 className="text-4xl  font-bold">
                {"Get resume feedback that's actually meaningful."}
              </h1>
            </Zoom>
            <Zoom delay={100}>
              <p className="mt-8 ">
                {
                  "Your resume is often the first thing a potential employer sees, so it's important to make a good impression. MyResume Guru makes it easy to get feedback on your resume, so you can feel confident that you're putting your best foot forward."
                }
              </p>
            </Zoom>
          </div>

          <div className="flex mt-4 flex-col w-full pt-40 self-center">
            <Zoom>
              <h1 className="text-2xl text-center  font-bold">
                Example Improvements
              </h1>
            </Zoom>
            <Zoom delay={100}>
              <Card className="p-6 rounded-none mt-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <Fade out delay={100}>
                        <h3 className="text-xl font-bold">
                          Enhance Personal Summary
                        </h3>
                      </Fade>
                    </div>
                    <div className="text-[#373737] text-left whitespace-pre-wrap">
                      <Fade out delay={200}>
                        The resume currently lacks a personal summary, which is
                        a crucial section that provides a snapshot of your
                        professional identity and career goals. A well-crafted
                        summary can immediately capture the attention of hiring
                        managers and set the tone for the rest of the resume.
                      </Fade>
                      <br />
                      <br />
                      <Fade out delay={300}>
                        **Actionable Steps:**
                      </Fade>
                      <br />
                      <Fade out delay={400}>
                        {`1. **Write a Concise Summary:** Start with a strong opening that highlights your key skills and experiences. For example, "Dynamic Front-End Developer with over 5 years of experience in building scalable web applications using React and Next.js."`}
                      </Fade>
                      <br />
                      <Fade out delay={500}>
                        {`2. **Include Career Goals:** Mention your career aspirations and how they align with the roles you are applying for. For example, "Seeking to leverage expertise in UI/UX design to contribute to innovative projects at a forward-thinking tech company."`}
                      </Fade>
                      <br />
                      <Fade out delay={600}>
                        {" "}
                        {`3. **Highlight Key Achievements:** Briefly mention one or two significant accomplishments that demonstrate your impact, such as "Led a team to increase app performance by 30%, enhancing user experience."`}
                      </Fade>
                      <br />
                      <br />
                      <Fade out delay={700}>
                        **Example Summary:**
                      </Fade>
                      <br />
                      <Fade out delay={800}>
                        {`"Innovative Front-End Developer with 5+ years of experience in creating user-centric applications using React and Next.js. Proven track record of improving app performance and user satisfaction. Passionate about leveraging technology to solve real-world problems and eager to contribute to cutting-edge projects in a dynamic tech environment."`}
                      </Fade>
                    </div>
                  </div>
                </div>
              </Card>
            </Zoom>
          </div>

          {/* <h1 className="mt-44 font-bold text-4xl text-center">
          Coming Soon...!
        </h1> */}
        </div>
      </div>
      <Footer />
    </>
  );
}

interface GridItemProps {
  area: string;
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode;
  delay?: number;
}

const GridItem = ({ area, icon, title, description, delay }: GridItemProps) => {
  return (
    <Zoom delay={delay}>
      <li className={`min-h-[14rem] w-full list-none ${area}`}>
        <div className="relative h-full rounded-2.5xl border p-2 md:rounded-3xl md:p-3">
          <GlowingEffect
            variant="blue"
            blur={0}
            borderWidth={3}
            spread={80}
            glow={true}
            disabled={false}
            proximity={64}
            inactiveZone={0.01}
          />
          <div className="relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl border-0.75 p-6 dark:shadow-[0px_0px_27px_0px_#2D2D2D] md:p-6">
            <div className="relative flex flex-1 flex-col justify-between gap-3">
              <div className="w-fit rounded-lg border border-gray-600 p-2">
                {icon}
              </div>
              <div className="space-y-3">
                <h3 className="pt-0.5 text-xl/[1.375rem] font-semibold font-sans -tracking-4 md:text-2xl/[1.875rem] text-balance text-black dark:text-white">
                  {title}
                </h3>
                <p className="[&_b]:md:font-semibold [&_strong]:md:font-semibold font-sans text-sm/[1.125rem] md:text-base/[1.375rem] text-black dark:text-neutral-400">
                  {description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </li>
    </Zoom>
  );
};
