import React from "react";
import {
  Pencil,
  Trash2,
  Pin,
  Archive,
  MoreVertical,
  BookOpen,
} from "lucide-react";

function NoteCard({
  note,
  onEdit,
  onDelete,
  onView,
  onPin,
  onArchive,
}) {
  if (!note) return null;

  const getTagStyle = (tag) => {
    const styles = {
      red: "bg-rose-50 text-rose-600",
      orange: "bg-orange-50 text-orange-600",
      yellow: "bg-amber-50 text-amber-700",
      green: "bg-emerald-50 text-emerald-600",
      blue: "bg-sky-50 text-sky-600",
      purple: "bg-violet-50 text-violet-600",
      teal: "bg-teal-50 text-teal-600",
    };

    return styles[tag] || "bg-slate-50 text-slate-600";
  };

  const stripHtml = (html = "") => {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
  };

  const preview = stripHtml(note.content || "");

  return (
    <article
      className={`
        group relative
        overflow-hidden
        rounded-2xl
        border
        border-violet-100
        bg-white
        p-5
        shadow-[0_6px_22px_rgba(76,29,149,0.07)]
        transition-all duration-300
        hover:-translate-y-1
        hover:shadow-[0_14px_32px_rgba(76,29,149,0.12)]
        ${note.pinned ? "ring-2 ring-violet-200" : ""}
      `}
    >
      {/* TOP ACCENT */}
      <div
        className={`
          absolute inset-x-0 top-0 h-1
          ${
            note.pinned
              ? "bg-gradient-to-r from-violet-500 to-fuchsia-500"
              : "bg-gradient-to-r from-violet-300 to-purple-300"
          }
        `}
      />

      {/* HEADER */}
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3
            className="truncate text-lg font-bold text-slate-800"
            title={note.title || "Untitled Note"}
          >
            {note.title || "Untitled Note"}
          </h3>

          {note.notebook && (
            <div className="mt-2 flex items-center gap-1.5 text-xs font-medium text-slate-400">
              <BookOpen size={13} />
              <span className="truncate">{note.notebook}</span>
            </div>
          )}
        </div>

        {/* PIN */}
        <button
          type="button"
          onClick={() => onPin?.(note)}
          aria-label={note.pinned ? "Unpin note" : "Pin note"}
          title={note.pinned ? "Unpin note" : "Pin note"}
          className={`
            flex h-9 w-9 shrink-0
            items-center justify-center
            rounded-xl
            transition
            ${
              note.pinned
                ? "bg-violet-100 text-violet-600"
                : "text-slate-300 hover:bg-violet-50 hover:text-violet-600"
            }
          `}
        >
          <Pin
            size={16}
            strokeWidth={2.2}
            className={note.pinned ? "fill-current" : ""}
          />
        </button>
      </div>

      {/* CONTENT */}
      <button
        type="button"
        onClick={() => onView?.(note)}
        className="block w-full text-left"
      >
        <p className="mb-5 line-clamp-4 min-h-[80px] text-sm leading-6 text-slate-500">
          {preview || "No content yet..."}
        </p>
      </button>

      {/* FOOTER */}
      <div className="mb-4 flex items-center justify-between gap-3">
        {/* TAG */}
        {note.tag ? (
          <span
            className={`
              inline-flex items-center gap-1.5
              rounded-full
              px-3 py-1
              text-[11px]
              font-bold
              ${getTagStyle(note.tag)}
            `}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
            {note.tag}
          </span>
        ) : (
          <span className="text-xs text-slate-300">No tag</span>
        )}

        {/* DATE */}
        <span className="truncate text-[11px] font-medium text-slate-400">
          {note.updatedAt || note.createdAt || ""}
        </span>
      </div>

      {/* ACTIONS */}
      <div
        className="
          flex items-center justify-between
          border-t border-slate-100
          pt-3
        "
      >
        <button
          type="button"
          onClick={() => onEdit?.(note)}
          className="
            inline-flex items-center gap-1.5
            rounded-lg
            px-3 py-2
            text-xs font-semibold
            text-violet-600
            transition
            hover:bg-violet-50
          "
        >
          <Pencil size={14} />
          Edit
        </button>

        <div className="flex items-center gap-1">
          {/* ARCHIVE */}
          <button
            type="button"
            onClick={() => onArchive?.(note)}
            aria-label="Archive note"
            title="Archive note"
            className="
              flex h-8 w-8
              items-center justify-center
              rounded-lg
              text-slate-400
              transition
              hover:bg-amber-50
              hover:text-amber-600
            "
          >
            <Archive size={15} />
          </button>

          {/* DELETE */}
          <button
            type="button"
            onClick={() => onDelete?.(note)}
            aria-label="Delete note"
            title="Delete note"
            className="
              flex h-8 w-8
              items-center justify-center
              rounded-lg
              text-slate-400
              transition
              hover:bg-rose-50
              hover:text-rose-600
            "
          >
            <Trash2 size={15} />
          </button>

          {/* MORE */}
          <button
            type="button"
            aria-label="More actions"
            title="More actions"
            className="
              flex h-8 w-8
              items-center justify-center
              rounded-lg
              text-slate-300
              transition
              hover:bg-slate-100
              hover:text-slate-600
            "
          >
            <MoreVertical size={16} />
          </button>
        </div>
      </div>
    </article>
  );
}

export default NoteCard;