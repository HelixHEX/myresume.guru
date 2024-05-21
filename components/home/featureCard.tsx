import { Card, CardContent, CardHeader } from "../ui/card";

type Props = {
  title: string;
  description: string;
  Icon: React.FC<React.SVGProps<SVGSVGElement>>
}

export default function FeatureCard({title, description, Icon}: Props) {
  return (
    <Card className="w-full lg:w-[200px] p-2">
      <CardHeader>
        <Icon />
        <h1 className="text-lg font-bold">{title}</h1>
      </CardHeader>
      <CardContent>
        <p className=" text-gray-400">{description}</p>
      </CardContent>
    </Card>
  )
}