import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSort,
  faSortUp,
  faSortDown,
} from "@fortawesome/free-solid-svg-icons";

interface HeaderProps {
  onSort: (column: string) => void;
  sortConfig: {
    key: string | null;
    direction: "asc" | "desc" | null;
  };
}

const HeaderComponent = ({ onSort, sortConfig }: HeaderProps) => {
  const columns = [
    {
      name: "id",
      value: "#",
      className: "cursor-pointer flex items-center gap-2",
      sortable: true,
    },
    {
      name: "name",
      value: "Name",
      className: "cursor-pointer flex items-center gap-2",
      sortable: true,
    },
    {
      name: "price",
      value: "Price",
      className: "cursor-pointer flex items-center gap-2",
      sortable: true,
    },
    {
      name: "percent_change_24h",
      value: "24h%",
      className: "cursor-pointer flex items-center gap-2",
      sortable: true,
    },
  ];

  const getSortIcon = (columnName: string) => {
    if (sortConfig.key !== columnName) return faSort;
    return sortConfig.direction === "asc" ? faSortUp : faSortDown;
  };

  return (
    <header className="grid grid-cols-4 w-full bg-[#1e1e1e] py-4 px-6 text-gray-200">
      {columns.map((column) => (
        <div
          key={column.name}
          className={`text-sm font-medium ${column.className}`}
          onClick={() => column.sortable && onSort(column.name)}
        >
          {column.value}
          {column.sortable && (
            <FontAwesomeIcon
              icon={getSortIcon(column.name)}
              className="h-3 w-3"
            />
          )}
        </div>
      ))}
    </header>
  );
};

export default HeaderComponent;
