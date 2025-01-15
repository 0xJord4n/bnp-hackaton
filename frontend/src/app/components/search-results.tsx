import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface SearchResultsProps {
  results: {
    companyInfo: {
      name: string;
      description: string;
      founded: string;
      employees: string;
      industry: string;
      website: string;
    };
    socialProfiles: {
      platform: string;
      handle: string;
    }[];
  };
}

export default function SearchResults({ results }: SearchResultsProps) {
  const { companyInfo, socialProfiles } = results;

  return (
    <div className="max-w-4xl mx-auto px-4 pb-12">
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-xl overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <CardHeader>
            <CardTitle className="text-white">Company Information</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2 text-sm">
              {Object.entries(companyInfo).map(([key, value]) => (
                <div key={key} className="flex">
                  <dt className="w-1/3 font-medium text-gray-400">
                    {key.charAt(0).toUpperCase() + key.slice(1)}:
                  </dt>
                  <dd className="w-2/3 text-white">{value}</dd>
                </div>
              ))}
            </dl>
          </CardContent>
        </Card>
        <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-xl overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <CardHeader>
            <CardTitle className="text-white">Social Profiles</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {socialProfiles.map((profile) => (
                <li key={profile.platform} className="flex items-center">
                  <span className="w-1/3 font-medium text-gray-400">
                    {profile.platform}:
                  </span>
                  <span className="w-2/3 text-white">{profile.handle}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
