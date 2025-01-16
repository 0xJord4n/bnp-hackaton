"use client";

import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";

export function ExportButton() {
  const handleExport = () => {
    // Placeholder function for PDF export
    // In a real application, this would trigger a backend service to generate and download the PDF
    console.log("Exporting data as PDF...");
    alert("PDF export functionality would be implemented here.");
  };

  return (
    <Button
      onClick={handleExport}
      className="bg-purple-600 hover:bg-purple-700"
    >
      <FileDown className="mr-2 h-4 w-4" /> Export as PDF
    </Button>
  );
}
