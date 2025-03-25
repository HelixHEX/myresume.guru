import Editor from "../../_components/editor";
import Preview from "../../_components/editor/preview";

export default async function NewResumePage() {


	return (
		<div className="w-full flex h-full">
			<div className="h-full p-4 px-4 sm:px-8 transition-all duration-300 w-full lg:w-[500px] bg-white sm:bg-blue-800">
				<h1 className=" text-4xl font-bold text-blue-800 sm:text-white">New Resume</h1>
				<Editor />
			</div>
				<Preview />
		</div>
	);
}
