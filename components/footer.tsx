import Link from "next/link";

export default function Footer() {
  return (
    <div className='flex flex-row p-4 justify-between'>
      <div className="flex flex-row">
        <Link href='/' className="text-gray-400 hover:text-gray-500">myresume.guru</Link>
      </div>
      <p className="text-gray-400">Made with ❤️ by <Link className="text-purple-400 hover:text-purple-500 underline decoration-solid	" href='https://eliaswambugu.com'>Elias Wambugu</Link></p>
      <div className="flex flex-row">
        <Link href="#" className="text-gray-400 hover:text-gray-500">Privacy Policy</Link>
        <Link href="#" className="text-gray-400 hover:text-gray-500 ml-4">Terms of Service</Link>
      </div>
    </div>
  )
}