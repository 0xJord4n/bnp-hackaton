import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CompanyInfo, SocialProfile } from "../../api/search/route";
import { formatCompanyInfoKey } from "@/lib/utils/format";
import {
  Building2,
  Link as LinkIcon,
  Github,
  Linkedin,
  Twitter,
  Facebook,
  Instagram,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { HarmonicFounded } from "@/lib/types";

interface CompanyInfoCardProps {
  companyInfo: CompanyInfo;
  socials: SocialProfile[];
}

const bannedFields = ["logo_url", "description", "name"];

// @ts-ignore
const socialIcons: { [key: string]: any } = {
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
  facebook: Facebook,
  instagram: Instagram,
};

const formatFoundedDate = (founded: HarmonicFounded | string) => {
  if (typeof founded === "string") return founded;

  const { date, granularity } = founded;
  const [year, month, day] = date.split("-");

  switch (granularity) {
    case "YEAR":
      return year;
    case "MONTH":
      return `${
        [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ][parseInt(month) - 1]
      } ${year}`;
    case "DAY":
      return new Date(date).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
        day: "numeric",
      });
    default:
      return date;
  }
};

export function CompanyInfoCard({
  companyInfo,
  socials,
}: CompanyInfoCardProps) {
  return (
    <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-xl overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
      <CardHeader>
        <div className="flex items-center gap-6 mb-4">
          {companyInfo.logo_url ? (
            <Image
              src={companyInfo.logo_url}
              alt={`${companyInfo.name} logo`}
              width={80}
              height={80}
              className="rounded-full"
            />
          ) : (
            <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center text-2xl font-bold text-white">
              {companyInfo.name.charAt(0)}
            </div>
          )}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <CardTitle className="text-white flex items-center">
                <Building2 className="w-5 h-5 mr-2" />
                Company Information
              </CardTitle>
              {socials && socials.length > 0 && (
                <div className="flex gap-2">
                  {socials.map((profile) => {
                    const IconComponent =
                      socialIcons[profile.platform.toLowerCase()] || LinkIcon;
                    return (
                      <Link
                        key={profile.platform}
                        href={profile.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-white transition-colors"
                        title={profile.platform}
                      >
                        <IconComponent className="w-5 h-5" />
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
            {companyInfo.description && (
              <p className="text-gray-400 text-sm mb-3">
                {companyInfo.description}
              </p>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="relative z-10">
        <dl className="space-y-2 text-sm">
          {Object.entries(companyInfo)
            .filter(([key]) => !bannedFields.includes(key))
            .map(([key, value]) => (
              <div key={key} className="flex">
                <dt className="w-1/3 font-medium text-gray-400">
                  {formatCompanyInfoKey(key)}:
                </dt>
                <dd className="w-2/3 text-white">
                  {key === "founded" ? formatFoundedDate(value) : value}
                </dd>
              </div>
            ))}
        </dl>
      </CardContent>
    </Card>
  );
}
