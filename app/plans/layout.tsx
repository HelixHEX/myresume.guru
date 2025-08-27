import Footer from "@/components/footer";
import Header from "@/components/header";

export default function PlansLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <div className="flex flex-col gap-10 p-4 sm:p-10 lg:px-30">
        {children}
      </div>
      <Footer />
    </>
  );
}
