import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CompanyInfo } from "../../api/search/route";

interface CompanyInfoCardProps {
  companyInfo: CompanyInfo;
}

export function CompanyInfoCard({ companyInfo }: CompanyInfoCardProps) {
  return (
    <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-xl overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
      <CardHeader>
        <CardTitle className="text-white">Company Information</CardTitle>
      </CardHeader>
      <CardContent className="relative z-10">
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
  );
}
