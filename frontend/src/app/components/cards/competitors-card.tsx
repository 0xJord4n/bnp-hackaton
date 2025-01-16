import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, LinkIcon } from "lucide-react";
import Link from "next/link";

interface Competitor {
  name: string;
  website: string;
}

interface CompetitorsCardProps {
  competitors: Competitor[];
}

export function CompetitorsCard({ competitors }: CompetitorsCardProps) {
  if (!competitors || competitors.length === 0) return null;

  return (
    <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-xl overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Users className="w-5 h-5 mr-2" />
          Competitors
        </CardTitle>
      </CardHeader>
      <CardContent className="relative z-10">
        <ul className="space-y-2">
          {competitors.map((competitor) => (
            <li
              key={competitor.name}
              className="flex items-center justify-between"
            >
              <span className="font-medium text-gray-400">
                {competitor.name}
              </span>
              <Link
                href={competitor.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-purple-400 transition-colors flex items-center"
              >
                <LinkIcon className="w-4 h-4 mr-2" />
                Website
              </Link>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
