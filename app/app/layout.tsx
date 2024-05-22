import Sidenav from "@/components/sidenav";

export default function Layout({children}: {children: React.ReactNode}) {
  return (
    <div className="flex pb-4 flex-col md:flex-row h-full ">
      <Sidenav />
      <main className="md:ml-[200px] px-4 w-full lg:ml-[300px]">
        {children}
      </main>
    </div>
  )
}