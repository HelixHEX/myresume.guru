import { cn } from "../utils";
import ClerkProvider from "./clerk";
import { Manrope } from "next/font/google";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-sans" });

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      {/* <html lang="en">
        <body
          className={cn(
            " min-h-svh h-screen bg-white font-sans antialiased",
            manrope.variable
          )}
        > */}
          {children}
        {/* </body>
      </html> */}
    </ClerkProvider>
  );
}
