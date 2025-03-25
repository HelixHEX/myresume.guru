import Editor from "../../_components/editor";

export default async function NewResumePage() {


	return (
		<div className="w-full flex h-full">
			<div className="h-full p-4 px-8 w-[500px] bg-white sm:bg-blue-800">
				<h1 className=" text-4xl font-bold text-white">New Resume</h1>
				<Editor />
			</div>
		</div>
	);
}
