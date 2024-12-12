"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import HeaderComponent from "../components/header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp, faArrowDown } from "@fortawesome/free-solid-svg-icons";
import SearchBar from "../components/searchBar";

interface Crypto {
  id: number;
  name: string;
  symbol: string;
  quote: {
    USD: {
      price: number;
      percent_change_24h: number;
    };
  };
}

export default function Home() {
  const [cryptoData, setCryptoData] = useState<Crypto[]>([]);
  const [filteredData, setFilteredData] = useState<Crypto[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState<{
    key: string | null;
    direction: "asc" | "desc" | null;
  }>({
    key: null,
    direction: null,
  });
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetchCryptoData();
  }, []);

  const fetchCryptoData = async () => {
    try {
      // Use absolute URL with the deployed domain
      const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL
        ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
        : "http://localhost:3000";

      const response = await axios.get(`${baseUrl}/api/crypto`);
      setCryptoData(response.data.data);
      setFilteredData(response.data.data);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
        console.error("API Error:", error);
      } else {
        setError("An unexpected error occurred");
        console.error("Unknown Error:", error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSort = (columnName: string) => {
    setSortConfig((current) => {
      const newDirection =
        current.key === columnName
          ? current.direction === "asc"
            ? "desc"
            : current.direction === "desc"
              ? null
              : "asc"
          : "asc";

      const sortedData = [...filteredData].sort((a, b) => {
        if (!newDirection) return 0;

        let aValue: number | string;
        let bValue: number | string;

        switch (columnName) {
          case "id":
            aValue = a.id;
            bValue = b.id;
            break;
          case "name":
            aValue = a.name;
            bValue = b.name;
            break;
          case "price":
            aValue = a.quote.USD.price;
            bValue = b.quote.USD.price;
            break;
          case "percent_change_24h":
            aValue = a.quote.USD.percent_change_24h;
            bValue = b.quote.USD.percent_change_24h;
            break;
          default:
            return 0;
        }

        if (typeof aValue === "string") {
          return newDirection === "asc"
            ? aValue.localeCompare(String(bValue))
            : String(bValue).localeCompare(String(aValue));
        }

        return newDirection === "asc"
          ? (aValue as number) - (bValue as number)
          : (bValue as number) - (aValue as number);
      });

      setFilteredData(sortedData);

      return {
        key: newDirection ? columnName : null,
        direction: newDirection,
      };
    });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value.toLowerCase();
    const filtered = cryptoData.filter((crypto) =>
      crypto.name.toLowerCase().includes(searchValue)
    );
    setFilteredData(filtered);
  };

  const handleClickOutside = () => {
    setIsOpen(false);
  };

  const LoadingSkeleton = () => (
    <>
      {[1, 2, 3, 4, 5].map((index) => (
        <div
          key={index}
          className="grid grid-cols-4 bg-[#302c2c] py-4 px-6 my-6 rounded-lg animate-pulse"
        >
          <div className="h-4 bg-gray-600 rounded w-8"></div>
          <div className="h-4 bg-gray-600 rounded w-24"></div>
          <div className="h-4 bg-gray-600 rounded w-20"></div>
          <div className="h-4 bg-gray-600 rounded w-16"></div>
        </div>
      ))}
    </>
  );

  if (error) {
    return (
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col text-white items-center justify-center min-h-[200px]">
          <p className="text-red-500">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex flex-col text-white">
        <SearchBar
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          handleSearch={handleSearch}
          handleClickOutside={handleClickOutside}
        />
        <HeaderComponent onSort={handleSort} sortConfig={sortConfig} />
        <div>
          {isLoading ? (
            <LoadingSkeleton />
          ) : (
            filteredData.map((crypto) => (
              <div
                key={crypto.id}
                className="grid grid-cols-4 bg-[#2f2e2e] py-4 px-6 my-6 rounded-lg items-center hover:bg-[#9844fc] cursor-pointer"
              >
                <div>{crypto.id}</div>
                <div className="flex items-center gap-2">
                  {/* <img
                    src={`/crypto-icons/${crypto.name.toLowerCase()}.svg`}
                    alt={crypto.name}
                    className="w-4 h-4"
                  /> */}
                  <div className="flex flex-col">
                    <div>{crypto.name}</div>
                    <span className="text-sm">{crypto.symbol}</span>
                  </div>
                </div>
                <div>
                  $
                  {crypto.quote.USD.price.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
                {crypto.quote.USD.percent_change_24h > 0 ? (
                  <div className="flex items-center gap-2 text-green-500 bg-[#144414] rounded-lg px-2 py-1 w-fit">
                    <FontAwesomeIcon icon={faArrowUp} />
                    {crypto.quote.USD.percent_change_24h.toFixed(2)}%
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-red-500 bg-[#432a29] rounded-lg px-2 py-1 w-fit">
                    <FontAwesomeIcon icon={faArrowDown} />
                    {crypto.quote.USD.percent_change_24h.toFixed(2)}%
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
