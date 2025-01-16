"use client";

import { HarmonicCompany } from "@/lib/types";
import { useState, useEffect } from "react";

interface SimilarCompaniesProps {
  companyId: string;
  itemCount?: number;
}

export default function SimilarCompanies({
  companyId,
  itemCount = 5,
}: SimilarCompaniesProps) {
  const [companies, setCompanies] = useState<HarmonicCompany[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSimilarCompanies = async () => {
      if (!companyId) return;

      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `/api/companies/similar?id=${companyId}&size=${itemCount}`
        );
        const result = await response.json();

        if (result.error) {
          setError(result.error);
          return;
        }

        setCompanies(result.data);
      } catch {
        setError("Failed to fetch similar companies");
      } finally {
        setLoading(false);
      }
    };

    fetchSimilarCompanies();
  }, [companyId, itemCount]);

  if (loading) {
    return <div className="animate-pulse">Loading similar companies...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Similar Companies</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {companies.map((company) => (
          <div
            key={company.id}
            className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-4">
              {company.logo_url ? (
                <img
                  src={company.logo_url}
                  alt={`${company.name} logo`}
                  className="w-12 h-12 object-contain"
                />
              ) : (
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  {company.name.charAt(0)}
                </div>
              )}
              <div>
                <h3 className="font-medium">{company.name}</h3>
                <p className="text-sm text-gray-600">
                  {company.location.city}, {company.location.country}
                </p>
              </div>
            </div>
            {company.description && (
              <p className="mt-2 text-sm text-gray-700 line-clamp-2">
                {company.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
