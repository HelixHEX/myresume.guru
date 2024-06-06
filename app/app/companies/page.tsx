import Companies from "./data";

export default function Page() {
  return (
    <>
      <h1 className="mt-[-6px] text-4xl font-light text-black">Companies</h1>
      <p className="md:w-10/12 text-gray-400">
        Organize your job applications by company and see how many applications
        you have for each company
      </p>
      <Companies />
    </>
  );
}
