import Image from "next/image";

interface CompanyProfileProps {
  name: string;
  logoUrl?: string | null;
}

export function CompanyProfile({ name, logoUrl }: CompanyProfileProps) {
  return (
    <div className="flex flex-col items-center justify-center w-full">
      {logoUrl ? (
        <div className="relative w-40 h-40 md:w-48 md:h-48">
          <Image
            src={logoUrl}
            alt={`${name} logo`}
            fill
            className="rounded-full object-contain"
            sizes="(max-width: 768px) 160px, 192px"
          />
        </div>
      ) : (
        <div className="w-40 h-40 md:w-48 md:h-48 bg-gray-700 rounded-full flex items-center justify-center text-4xl font-bold text-white">
          {name.charAt(0)}
        </div>
      )}
      <h1 className="text-2xl md:text-3xl font-bold text-white mt-4 text-center">
        {name}
      </h1>
    </div>
  );
}
