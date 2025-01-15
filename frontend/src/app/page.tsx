"use client";
import SimilarCompanies from "@/components/SimilarCompanies";
import CompanySearch from "../components/CompanySearch";
import { useState } from "react";

export default function Home() {
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(
    null
  );

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Company Search</h1>
      <CompanySearch onCompanySelect={(id) => setSelectedCompanyId(id)} />
      {selectedCompanyId && (
        <div className="mt-8">
          <SimilarCompanies companyId={selectedCompanyId} itemCount={6} />
        </div>
      )}
    </main>
  );
}
