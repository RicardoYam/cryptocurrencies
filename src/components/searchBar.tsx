import React, { useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface SearchBarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleClickOutside: () => void;
}

const SearchBarComponent = ({
  isOpen,
  setIsOpen,
  handleSearch,
  handleClickOutside,
}: SearchBarProps) => {
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        handleClickOutside();
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [handleClickOutside]);

  return (
    <div>
      {isOpen ? (
        <div ref={searchRef} className="flex items-center gap-2">
          <Search size={30} />
          <Input
            placeholder="Search"
            onChange={handleSearch}
            className="border-none"
          />
        </div>
      ) : (
        <div>
          <div className="flex items-center gap-2">
            <span
              className="flex-1 text-2xl font-bold cursor-pointer"
              onClick={() => setIsOpen(true)}
            >
              AssetTracker
            </span>
            <Search size={30} />
          </div>
          <span className="text-gray-500">
            Track your favourite crypto assets
          </span>
        </div>
      )}
    </div>
  );
};

export default SearchBarComponent;
