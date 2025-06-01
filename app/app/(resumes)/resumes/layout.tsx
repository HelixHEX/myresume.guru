export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-y-scroll">
      <div className=" flex flex-col w-full h-full ">
        {/* <Title /> */}
        {children}
      </div>
    </div>
  );
}
