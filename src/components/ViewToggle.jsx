import { Grid2X2, List } from "lucide-react";

function ViewToggle({ view, onChange }) {
  return (
    <div className="inline-flex items-center rounded-xl border border-violet-100 bg-white p-1 shadow-[0_4px_14px_rgba(76,29,149,0.07)]">
      {/* GRID */}

      <button
        type="button"
        onClick={() => onChange("grid")}
        aria-label="Grid view"
        title="Grid view"
        className={`
          flex h-9 w-10 items-center justify-center
          rounded-lg
          transition-all duration-200
          ${
            view === "grid"
              ? "bg-gradient-to-br from-violet-600 to-purple-600 text-white shadow-sm"
              : "text-slate-400 hover:bg-violet-50 hover:text-violet-600"
          }
        `}
      >
        <Grid2X2 size={17} strokeWidth={2.2} />
      </button>

      {/* LIST */}

      <button
        type="button"
        onClick={() => onChange("list")}
        aria-label="List view"
        title="List view"
        className={`
          flex h-9 w-10 items-center justify-center
          rounded-lg
          transition-all duration-200
          ${
            view === "list"
              ? "bg-gradient-to-br from-violet-600 to-purple-600 text-white shadow-sm"
              : "text-slate-400 hover:bg-violet-50 hover:text-violet-600"
          }
        `}
      >
        <List size={18} strokeWidth={2.2} />
      </button>
    </div>
  );
}

export default ViewToggle;