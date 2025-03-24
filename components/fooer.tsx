export default function Footer() {
	return (
		<footer className="bg-dark-gray py-4">
			<div className="container mx-auto px-4">
				<p className="text-center font-bold text-white">
					&copy; {new Date().getFullYear()} MyResume.<span className="text-blue-500">Guru</span>{" "}
					| Suppoort:{" "}
					<a href="mailto:elias@thenxtcreatives.com" className="text-blue-500">
						elias@thenxtcreatives.com
					</a>
				</p>
			</div>
		</footer>
	);
}
