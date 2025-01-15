// import CompanySearch from '@/components/CompanySearch';

import CompanySearch from "../components/CompanySearch";

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Company Search</h1>
      <CompanySearch />
    </main>
  );
}