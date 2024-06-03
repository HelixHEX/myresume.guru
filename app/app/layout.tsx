import Sidenav from "@/components/sidenav";

export default function Layout({children}: {children: React.ReactNode}) {
  return (
    <div className="flex pb-4 flex-col md:flex-row h-auto ">
      {process.env.APP_ENV && <Sidenav env={process.env.APP_ENV as "production" | "development"} />}
      <main className="md:ml-[200px] px-4 w-full lg:ml-[300px]">
        {children}
      </main>
    </div>
  )
}