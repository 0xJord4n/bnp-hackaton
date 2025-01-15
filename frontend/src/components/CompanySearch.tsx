"use client";

import { HarmonicCompany } from "@/lib/types";
import { useState } from "react";

interface CompanySearchProps {
  onCompanySelect: (id: string) => void;
}

export default function CompanySearch({ onCompanySelect }: CompanySearchProps) {
  const [company, setCompany] = useState<HarmonicCompany | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [domain, setDomain] = useState("");

  const searchCompany = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `/api/companies?domain=${encodeURIComponent(domain)}`
      );
      const result = await response.json();

      if (result.error) {
        setError(result.error);
        return;
      }
      setCompany(result.data);
      onCompanySelect(result.data.id);
    } catch (err) {
      setError("Failed to fetch company data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <form onSubmit={searchCompany} className="space-y-4">
        <input
          type="text"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          placeholder="Enter company domain"
          className="border p-2 rounded"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {error && <div className="text-red-500 mt-4">{error}</div>}

      {company && (
        <div className="mt-4">
          <h2 className="text-xl font-bold">{company.name}</h2>
          <p>
            Location: {company.location.city}, {company.location.country}
          </p>
          <p>Website: {company.website.url}</p>
        </div>
      )}
    </div>
  );
}
