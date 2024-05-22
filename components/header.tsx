import Logo from "./logo";
import { Button } from "./ui/button";

export default function Header() {
  return (
    <div className=' z-10 w-full backdrop-blur-xs fixed flex flex-row p-4 text-black justify-between'>
      <Logo />
      <div className="flex flex-row">
        <Button className="mr-2 hover:bg-white" variant={'ghost'}>
          Sign up
        </Button>
        <Button variant={'secondary'}>
          Login
        </Button>
      </div>
    </div>
  )
}