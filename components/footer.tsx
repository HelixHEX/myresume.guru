export default function Footer() {
	return (
		<footer className="bg-blue-800 w-full py-4">
			<div className="container mx-auto px-4">
				<p className="text-center font-bold text-white">
					&copy; {new Date().getFullYear()} MyResume.<span>Guru</span>{" "}
					| Suppoort:{" "}
					<a href="mailto:elias@thenxtcreatives.com" >
						elias@thenxtcreatives.com
					</a>
				</p>
			</div>
		</footer>
	);
}
