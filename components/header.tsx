import Logo from "./logo";
import { Button } from "./ui/button";

export default function Header() {
  return (
    <div className='flex flex-row p-4 justify-between'>
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