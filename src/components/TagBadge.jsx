function TagBadge({ tag }) {
  if (!tag) return null;

  const tagStyles = {
    red: "bg-rose-50 text-rose-600 ring-rose-200",
    orange: "bg-orange-50 text-orange-600 ring-orange-200",
    yellow: "bg-amber-50 text-amber-700 ring-amber-200",
    green: "bg-emerald-50 text-emerald-600 ring-emerald-200",
    blue: "bg-sky-50 text-sky-600 ring-sky-200",
    purple: "bg-violet-50 text-violet-600 ring-violet-200",
    teal: "bg-teal-50 text-teal-600 ring-teal-200",
  };

  const style =
    tagStyles[tag] ||
    "bg-slate-50 text-slate-600 ring-slate-200";

  return (
    <span
      className={`
        inline-flex items-center gap-1.5
        rounded-full
        px-3 py-1
        text-[11px]
        font-bold
        tracking-wide
        ring-1 ring-inset
        transition-all duration-200
        hover:scale-[1.03]
        ${style}
      `}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {tag}
    </span>
  );
}

export default TagBadge;