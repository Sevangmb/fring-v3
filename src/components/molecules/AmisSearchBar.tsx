
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Layout, LayoutList } from "lucide-react";

interface AmisSearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
}

const AmisSearchBar: React.FC<AmisSearchBarProps> = ({
  searchTerm,
  onSearchChange,
  viewMode,
  onViewModeChange
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 justify-between mb-6">
      <div className="relative w-full md:w-72">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher un ami..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="flex border rounded-md">
        <Button
          variant={viewMode === "grid" ? "secondary" : "ghost"}
          size="sm"
          className="rounded-r-none"
          onClick={() => onViewModeChange("grid")}
        >
          <Layout className="h-4 w-4" />
        </Button>
        <Button
          variant={viewMode === "list" ? "secondary" : "ghost"}
          size="sm"
          className="rounded-l-none"
          onClick={() => onViewModeChange("list")}
        >
          <LayoutList className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default AmisSearchBar;
