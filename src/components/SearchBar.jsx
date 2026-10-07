import { useEffect, useState } from "react";
import { Search, X, SlidersHorizontal } from "lucide-react";

function SearchBar({ searchTerm, onSearch }) {
  const [value, setValue] = useState(searchTerm || "");

  useEffect(() => {
    setValue(searchTerm || "");
  }, [searchTerm]);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setValue(newValue);
    onSearch(newValue);
  };

  const handleClear = () => {
    setValue("");
    onSearch("");
  };

  return (
    <div className="group relative w-full">
      <div
        className="
          flex h-[52px] w-full items-center
          rounded-2xl
          border border-violet-100
          bg-white
          px-4
          shadow-[0_4px_18px_rgba(76,29,149,0.07)]
          transition-all duration-200
          group-hover:border-violet-200
          focus-within:border-violet-400
          focus-within:shadow-[0_6px_24px_rgba(109,40,217,0.12)]
        "
      >
        {/* SEARCH ICON */}

        <div className="mr-3 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
          <Search size={18} strokeWidth={2.2} />
        </div>

        {/* INPUT */}

        <input
          type="text"
          value={value}
          onChange={handleChange}
          placeholder="Search notes, notebooks or tags..."
          className="
            min-w-0 flex-1
            bg-transparent
            text-sm
            font-medium
            text-slate-700
            outline-none
            placeholder:text-slate-400
          "
        />

        {/* CLEAR */}

        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="
              mr-2
              flex h-8 w-8 shrink-0
              items-center justify-center
              rounded-lg
              text-slate-400
              transition
              hover:bg-violet-50
              hover:text-violet-600
            "
            aria-label="Clear search"
            title="Clear search"
          >
            <X size={17} />
          </button>
        )}

        {/* FILTER DECORATION */}

        <div className="hidden h-8 w-px bg-slate-200 sm:block" />

        <div
          className="
            ml-3 hidden h-8 w-8
            items-center justify-center
            rounded-lg
            text-slate-400
            sm:flex
          "
          title="Search filters"
        >
          <SlidersHorizontal size={16} />
        </div>
      </div>
    </div>
  );
}

export default SearchBar;