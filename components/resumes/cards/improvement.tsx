import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Props {
  id: number;
  title: string;
  text: string;
  priority: number;
  status: string;
}

const getPriorityColor = (priority: number) => {
  switch (priority) {
    case 5:
      return "bg-red-500/10 text-red-500 hover:bg-red-500/20";
    case 4:
      return "bg-orange-500/10 text-orange-500 hover:bg-orange-500/20";
    case 3:
      return "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20";
    case 2:
      return "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20";
    default:
      return "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20";
  }
};

export default function ImprovementCard({ title, text, priority }: Props) {
  return (
    <Card className="p-0 rounded-none">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <h3 className="text-xl font-bold">{title}</h3>
            {/* <Badge 
              className={`${getPriorityColor(priority)} cursor-default`}
              variant="secondary"
            >
              Priority {priority}
            </Badge> */}
          </div>
          <div className="text-[#373737] whitespace-pre-wrap">
            {text}
          </div>
        </div>
      </div>
    </Card>
  );
}
