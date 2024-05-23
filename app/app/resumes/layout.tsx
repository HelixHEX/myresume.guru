export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col w-full h-full mt-6">
      <div className=" flex flex-col w-full h-full ">
        <h1 className="mt-[-6px] text-4xl text-black">My Resumes</h1>
        {children}
      </div>
    </div>
  );
}
