import { Wifi, Zap } from "lucide-react";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface Hero115Props {
  icon?: React.ReactNode;
  heading: string;
  description: string;
  button: {
    text: string;
    icon?: React.ReactNode;
    url: string;
  };
  trustText?: string;
  imageSrc?: string;
  imageAlt?: string;
}

const Hero115 = ({
  icon = <Wifi className="size-6" />,
  heading = "Blocks built with Shadcn & Tailwind",
  description = "Finely crafted components built with React, Tailwind and Shadcn UI. Developers can copy and paste these blocks directly into their project.",
  button = {
    text: "Discover Features",
    icon: <Zap className="ml-2 size-4" />,
    url: "https://www.shadcnblocks.com",
  },
  trustText = "Trusted by 120+ users",
  imageSrc = "/images/app.png",
  imageAlt = "placeholder",
}: Hero115Props) => {
  return (
    <section className="overflow-hidden py-32">
      <div className="container">
        <div className="flex flex-col gap-5">
          <div className="relative flex flex-col gap-5">
            <div
              style={{
                transform: "translate(-50%, -50%)",
              }}
              className="absolute top-1/2 left-1/2 -z-10 mx-auto size-[800px] rounded-full border p-16 [mask-image:linear-gradient(to_top,transparent,transparent,white,white,white,transparent,transparent)] md:size-[1300px] md:p-32"
            >
              <div className="size-full rounded-full border p-16 md:p-32">
                <div className="size-full rounded-full border"></div>
              </div>
            </div>
            {/* <span className="mx-auto flex size-16 items-center justify-center rounded-full border md:size-20">
              {icon}
            </span> */}
            {trustText && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="self-center"
                >
                  <div className=" self-center text-blue-800">{trustText}</div>
                </motion.div>
              )}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="mx-auto max-w-5xl text-center text-3xl font-medium text-balance md:text-6xl">
                {/* add highlight effect to word dream */}
                Land your <span className="text-blue-800">dream</span> job with
                MyResume.guru
              </h2>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <p className="mx-auto max-w-3xl text-center text-muted-foreground md:text-lg">
                {description}
              </p>
            </motion.div>
            <div className="flex flex-col items-center justify-center gap-3 pt-3 pb-12">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <Button
                  size="lg"
                  variant={"ghost"}
                  asChild
                  className=" text-blue-800 hover:bg-blue-800 hover:text-white transition-all duration-400 cursor-pointer"
                >
                  <a href={button.url}>
                    {button.text} {button.icon}
                  </a>
                </Button>
              </motion.div>

              
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.3 }}
          >
            <img
              src={imageSrc}
              alt={imageAlt}
              className="mx-auto h-full max-h-[800px] w-full max-w-5xl rounded-2xl object-cover"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export { Hero115 };
