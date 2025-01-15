"use client";

import { useState, useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import SearchResults from "./search-results";
import Navbar from "./navbar";
import AnimatedBackground from "./animated-background";

export default function SearchSection() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [url, setUrl] = useState(searchParams.get("url") || "");
  const [isLoading, setIsLoading] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const [error, setError] = useState("");

  const MemoizedSearchResults = useMemo(() => SearchResults, []);

  const handleSearch = useCallback(
    async (searchUrl: string) => {
      if (!searchUrl) return;

      setIsLoading(true);
      setError("");

      try {
        const [data] = await Promise.all([
          fetch(`/api/search?url=${encodeURIComponent(searchUrl)}`).then(
            (response) => {
              if (!response.ok) {
                throw new Error("Failed to fetch data");
              }
              return response.json();
            }
          ),
          new Promise((resolve) => setTimeout(resolve, 500)), // Ensure minimum 500ms loading time
        ]);

        setSearchResults(data);
        setSearchPerformed(true);
        router.push(`/?url=${encodeURIComponent(searchUrl)}`, {
          scroll: false,
        });
      } catch (err) {
        setError("An error occurred while fetching data. Please try again.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    },
    [router]
  );

  const handleLogoClick = useCallback(() => {
    setUrl("");
    setSearchPerformed(false);
    setSearchResults(null);
    setError("");
    router.push("/", { scroll: false });
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(url);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <AnimatedBackground />

      {/* Content */}
      <div className="relative z-10 w-full flex-grow flex flex-col">
        <Navbar onLogoClick={handleLogoClick} />
        <div
          className={cn(
            "max-w-3xl mx-auto px-4 w-full",
            searchPerformed ? "py-8" : "flex-grow flex flex-col justify-center"
          )}
        >
          {!searchPerformed && (
            <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-6 text-center">
              Discover Companies
            </h1>
          )}
          <form onSubmit={handleSubmit} className="relative mb-8">
            <div className="relative flex items-center">
              <div className="absolute left-4 text-gray-400 pointer-events-none z-20">
                <Search className="h-5 w-5" />
              </div>
              <Input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter a domain (e.g., example.com)"
                className={cn(
                  "w-full pl-12 pr-36 h-14 text-lg bg-gray-900/50 border-gray-700",
                  "placeholder:text-gray-500 text-white",
                  "focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50",
                  "transition-all duration-300 ease-in-out",
                  "backdrop-blur-xl rounded-full",
                  "z-10"
                )}
              />
              <div className="absolute right-2 z-20">
                <Button
                  type="submit"
                  disabled={!url || isLoading}
                  className={cn(
                    "bg-gradient-to-r from-purple-500 to-pink-500 text-white h-10 px-6 rounded-full",
                    "hover:from-purple-600 hover:to-pink-600",
                    "transition-all duration-300 ease-in-out",
                    "disabled:opacity-50 disabled:cursor-not-allowed"
                  )}
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    "Search"
                  )}
                </Button>
              </div>
            </div>
          </form>
          {error && (
            <div className="text-red-500 text-center mb-4">{error}</div>
          )}
          {!searchPerformed && !error && (
            <div className="text-sm text-gray-400 text-center">
              Popular searches:{" "}
              <span className="text-purple-400">vercel.com</span>,{" "}
              <span className="text-pink-400">stripe.com</span>,{" "}
              <span className="text-blue-400">airbnb.com</span>
            </div>
          )}
        </div>
        {searchPerformed && searchResults && (
          <MemoizedSearchResults results={searchResults} />
        )}
      </div>
    </div>
  );
}
