import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LinkIcon, Share2 } from "lucide-react";
import { SocialProfile } from "../../api/search/route";
import Link from "next/link";

interface SocialProfilesCardProps {
  socials: SocialProfile[];
}

export function SocialProfilesCard({ socials }: SocialProfilesCardProps) {
  return (
    <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-xl overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Share2 className="w-5 h-5 mr-2" />
          Social Profiles
        </CardTitle>
      </CardHeader>
      <CardContent className="relative z-10">
        <ul className="space-y-2">
          {socials.map((profile) => (
            <li key={profile.platform} className="flex items-center">
              <span className="w-2/3 font-medium text-gray-400">
                {profile.platform.charAt(0).toUpperCase() +
                  profile.platform.slice(1).toLowerCase()}
              </span>
              <Link
                href={profile.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-1/3 text-white hover:text-purple-400 transition-colors flex items-center justify-end"
              >
                <LinkIcon className="w-4 h-4 mr-2" />
                Visit
              </Link>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
