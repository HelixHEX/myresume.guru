import { Card, CardContent, CardHeader } from "../ui/card";
import Zoom from "react-reveal/Zoom";

type Props = {
  title: string;
  description: string;
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
  delay?: string;
};

export default function FeatureCard({
  title,
  description,
  Icon,
  delay,
}: Props) {
  return (
    <div className="w-full mb-8 lg:w-[220px]">
      <Zoom>
        <Card className="w-full mb-8 h-72 lg:w-[220px] p-2">
          <CardHeader>
            <Icon />
            <h1 className="text-lg font-bold">{title}</h1>
          </CardHeader>
          <CardContent>
            <p className=" text-gray-400">{description}</p>
          </CardContent>
        </Card>
      </Zoom>
    </div>
  );
}
