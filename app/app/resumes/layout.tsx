export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col w-full h-full   mt-6 items-center">
      {/* <main className=" bg-blue-400"> */}
      {children}
      {/* </main> */}
    </div>
  );
}
