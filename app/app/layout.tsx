import Sidenav from "@/components/sidenav";

export default function Layout({children}: {children: React.ReactNode}) {
  return (
    <div className="flex flex-col md:flex-row h-full ">
      <Sidenav />
      <main className="md:ml-[200px] lg:ml-[300px]">
        {children}
      </main>
    </div>
  )
}