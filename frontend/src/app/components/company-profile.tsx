import Image from "next/image";

interface CompanyProfileProps {
  name: string;
  logoUrl?: string | null;
  description?: string | null;
}

export function CompanyProfile({
  name,
  logoUrl,
  description,
}: CompanyProfileProps) {
  return (
    <div className="mb-8 bg-gray-900/50 border-gray-700 backdrop-blur-xl rounded-lg overflow-hidden">
      <div className="p-6 flex items-center">
        {logoUrl ? (
          <Image
            src={logoUrl || "/placeholder.svg"}
            alt={`${name} logo`}
            width={100}
            height={100}
            className="rounded-full mr-6"
          />
        ) : (
          <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center text-3xl font-bold text-white mr-6">
            {name.charAt(0)}
          </div>
        )}
        <div>
          <p className="text-gray-400">{description}</p>
        </div>
      </div>
    </div>
  );
}
