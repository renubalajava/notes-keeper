import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
  getNotes,
  updateNote,
  deleteNote,
} from "../services/api.js";

function Archive() {
  // =========================================================
  // STATE
  // =========================================================

  const [archivedNotes, setArchivedNotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortMode, setSortMode] = useState("latest");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================================================
  // CURRENT USER
  // =========================================================

  let currentUser = null;

  try {
    currentUser = JSON.parse(
      localStorage.getItem("notesKeeperCurrentUser") || "null"
    );
  } catch {
    currentUser = null;
  }

  const currentUserId = currentUser?.id || currentUser?.email;

  const userName = currentUser?.name || "Renu Bala";
  const userInitial = userName.charAt(0).toUpperCase();

  // =========================================================
  // LOAD ARCHIVED NOTES - API
  // =========================================================

  const loadArchivedNotes = async () => {
    try {
      setLoading(true);
      setError("");

      const notes = await getNotes();

      const allNotes = Array.isArray(notes) ? notes : [];

      const archived = allNotes.filter(
        (note) =>
          note.archived === true &&
          (!currentUserId || note.userId === currentUserId)
      );

      setArchivedNotes(archived);
    } catch (err) {
      console.error("Failed to load archived notes:", err);
      setError("Unable to load archived notes.");
      setArchivedNotes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadArchivedNotes();
  }, []);

  // =========================================================
  // RESTORE NOTE - API
  // =========================================================

  const handleRestore = async (id) => {
    try {
      setError("");

      const note = archivedNotes.find(
        (item) => String(item.id) === String(id)
      );

      if (!note) return;

      const updatedNote = {
        ...note,
        archived: false,
        updatedAt: new Date().toISOString(),
      };

      await updateNote(id, updatedNote);

      setArchivedNotes((prevNotes) =>
        prevNotes.filter(
          (item) => String(item.id) !== String(id)
        )
      );
    } catch (err) {
      console.error("Failed to restore note:", err);
      setError("Failed to restore the note.");
    }
  };

  // =========================================================
  // PERMANENT DELETE - API
  // =========================================================

  const handlePermanentDelete = async (id) => {
    const shouldDelete = window.confirm(
      "Are you sure you want to permanently delete this note?"
    );

    if (!shouldDelete) return;

    try {
      setError("");

      await deleteNote(id);

      setArchivedNotes((prevNotes) =>
        prevNotes.filter(
          (item) => String(item.id) !== String(id)
        )
      );
    } catch (err) {
      console.error("Failed to delete note:", err);
      setError("Failed to permanently delete the note.");
    }
  };

  // =========================================================
  // SEARCH + SORT
  // =========================================================

  const filteredNotes = useMemo(() => {
    const search = searchTerm.toLowerCase().trim();

    let result = archivedNotes.filter((note) => {
      const title = note.title?.toLowerCase() || "";

      const notebook =
        note.notebook?.toLowerCase() || "";

      const content =
        note.content
          ?.replace(/<[^>]*>/g, " ")
          .replace(/&nbsp;/g, " ")
          .replace(/\s+/g, " ")
          .toLowerCase() || "";

      const tag = note.tag?.toLowerCase() || "";

      return (
        !search ||
        title.includes(search) ||
        notebook.includes(search) ||
        content.includes(search) ||
        tag.includes(search)
      );
    });

    if (sortMode === "oldest") {
      result = [...result].sort(
        (a, b) => Number(a.id) - Number(b.id)
      );
    } else {
      result = [...result].sort(
        (a, b) => Number(b.id) - Number(a.id)
      );
    }

    return result;
  }, [archivedNotes, searchTerm, sortMode]);

  // =========================================================
  // PREVIEW
  // =========================================================

  const getPreview = (content) => {
    if (!content) {
      return "This note has no content.";
    }

    const text = content
      .replace(/<[^>]*>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    return text.length > 150
      ? `${text.slice(0, 150)}...`
      : text;
  };

  // =========================================================
  // DATE FORMAT
  // =========================================================

  const formatDate = (date) => {
    if (!date) return "No date";

    try {
      return new Date(date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return date;
    }
  };

  // =========================================================
  // CATEGORY
  // =========================================================

  const getCategory = (note) => {
    const value = (
      note.notebook ||
      note.category ||
      note.tag ||
      "Personal"
    ).toLowerCase();

    if (
      value.includes("work") ||
      value.includes("project")
    ) {
      return "Work";
    }

    if (
      value.includes("study") ||
      value.includes("learning") ||
      value.includes("education")
    ) {
      return "Study";
    }

    if (
      value.includes("idea") ||
      value.includes("ideas")
    ) {
      return "Ideas";
    }

    if (value.includes("important")) {
      return "Important";
    }

    return "Personal";
  };

  // =========================================================
  // CATEGORY COUNT
  // =========================================================

  const getCategoryCount = (category) => {
    return archivedNotes.filter(
      (note) => getCategory(note) === category
    ).length;
  };

  // =========================================================
  // CATEGORY STYLE
  // =========================================================

  const getCategoryStyle = (category) => {
    const styles = {
      Personal: {
        dot: "bg-[#ff6542]",
        soft: "bg-orange-50",
        border: "border-orange-100",
        text: "text-orange-700",
        icon: "👤",
      },

      Work: {
        dot: "bg-[#ff9d00]",
        soft: "bg-amber-50",
        border: "border-amber-100",
        text: "text-amber-700",
        icon: "💼",
      },

      Study: {
        dot: "bg-[#ffe000]",
        soft: "bg-yellow-50",
        border: "border-yellow-100",
        text: "text-yellow-700",
        icon: "📚",
      },

      Ideas: {
        dot: "bg-[#20d7b0]",
        soft: "bg-emerald-50",
        border: "border-emerald-100",
        text: "text-emerald-700",
        icon: "💡",
      },

      Important: {
        dot: "bg-[#f472b6]",
        soft: "bg-pink-50",
        border: "border-pink-100",
        text: "text-pink-700",
        icon: "⭐",
      },
    };

    return styles[category] || styles.Personal;
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="min-h-screen bg-[#f7f4ff] text-slate-800">
      <div className="flex min-h-screen">

        {/* ===================================================
            PURPLE SIDEBAR
        =================================================== */}

        <aside className="hidden w-[245px] shrink-0 flex-col bg-[#24144f] px-5 py-6 text-white lg:flex">

          {/* LOGO */}

          <div className="mb-10 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-400 to-purple-600 text-xl shadow-lg">
              📝
            </div>

            <div>
              <h1 className="text-lg font-black">
                Notes Keeper
              </h1>

              <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-violet-300">
                Smart Workspace
              </p>
            </div>
          </div>

          {/* WORKSPACE */}

          <p className="mb-3 px-3 text-[9px] font-black uppercase tracking-[0.2em] text-violet-300">
            Workspace
          </p>

          <nav className="space-y-1">
            <SidebarItem
              to="/dashboard"
              icon="⌂"
              label="Dashboard"
            />

            <SidebarItem
              to="/notes"
              icon="▤"
              label="All Notes"
            />

            <SidebarItem
              to="/pinned"
              icon="★"
              label="Pinned"
            />

            <SidebarItem
              to="/archive"
              icon="▣"
              label="Archive"
              active
              count={archivedNotes.length}
            />
          </nav>

          {/* NOTEBOOKS */}

          <p className="mb-3 mt-9 px-3 text-[9px] font-black uppercase tracking-[0.2em] text-violet-300">
            Notebooks
          </p>

          <div className="space-y-1">
            <NotebookItem
              color="bg-[#ff6542]"
              label="Personal"
              count={getCategoryCount("Personal")}
            />

            <NotebookItem
              color="bg-[#ff9d00]"
              label="Work"
              count={getCategoryCount("Work")}
            />

            <NotebookItem
              color="bg-[#ffe000]"
              label="Study"
              count={getCategoryCount("Study")}
            />
          </div>

          {/* SMART TOOLS */}

          <p className="mb-3 mt-9 px-3 text-[9px] font-black uppercase tracking-[0.2em] text-violet-300">
            Smart Tools
          </p>

          <Link
            to="/ai-assistant"
            className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-violet-100 transition hover:bg-white/10"
          >
            <span className="text-lg">✦</span>

            AI Assistant

            <span className="ml-auto rounded-full bg-fuchsia-500 px-2 py-0.5 text-[8px] font-black">
              NEW
            </span>
          </Link>

          <Link
            to="/ai"
            className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-violet-100 transition hover:bg-white/10"
          >
            <span className="text-lg">◉</span>
            AI Notes
          </Link>

          <div className="flex-1" />

          {/* USER */}

          <div className="border-t border-white/10 pt-5">
            <div className="flex items-center gap-3 rounded-2xl bg-white/[0.07] p-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-violet-400 to-fuchsia-500 font-black">
                {userInitial}
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-bold">
                  {userName}
                </p>

                <p className="text-[10px] text-violet-300">
                  Notes Keeper User
                </p>
              </div>

            </div>
          </div>

        </aside>

        {/* ===================================================
            MAIN
        =================================================== */}

        <main className="min-w-0 flex-1">

          {/* TOP NAVBAR */}

          <header className="sticky top-0 z-30 bg-gradient-to-r from-[#32145f] via-[#5220a0] to-[#3b1675] px-4 py-4 text-white shadow-lg sm:px-6 lg:px-8">

            <div className="flex items-center justify-between gap-4">

              {/* MOBILE LOGO */}

              <div className="flex items-center gap-2 lg:hidden">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-400">
                  📝
                </div>

                <span className="font-black">
                  Notes Keeper
                </span>
              </div>

              {/* NAV */}

              <div className="mx-auto hidden items-center gap-8 md:flex">

                <TopNavItem
                  label="All"
                  color="bg-white"
                />

                <TopNavItem
                  label="Personal"
                  color="bg-[#ff6542]"
                />

                <TopNavItem
                  label="Work"
                  color="bg-[#ff9d00]"
                />

                <TopNavItem
                  label="Study"
                  color="bg-[#ffe000]"
                />

              </div>

              {/* PROFILE */}

              <div className="flex items-center gap-3">

                <button
                  type="button"
                  className="relative text-xl"
                >
                  ♧
                  <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-red-400" />
                </button>

                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-300 to-fuchsia-400 font-black">
                  {userInitial}
                </div>

                <span className="hidden text-sm font-bold sm:block">
                  {userName}
                </span>

              </div>

            </div>

          </header>

          {/* PAGE */}

          <section className="relative min-h-[calc(100vh-65px)] overflow-hidden px-4 py-6 sm:px-6 lg:px-8 lg:py-8">

            {/* SOFT PURPLE BACKGROUND */}

            <div className="pointer-events-none absolute inset-0">

              <div className="absolute -left-20 top-0 h-80 w-80 rounded-full bg-violet-300/25 blur-[100px]" />

              <div className="absolute right-[-80px] top-20 h-96 w-96 rounded-full bg-fuchsia-300/20 blur-[110px]" />

              <div className="absolute bottom-[-120px] left-[35%] h-80 w-80 rounded-full bg-purple-300/20 blur-[100px]" />

            </div>

            <div className="relative z-10">

              {/* HEADER */}

              <div className="mb-7 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

                <div className="flex items-center gap-4">

                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-purple-700 text-3xl text-white shadow-lg shadow-violet-200">
                    🗄️
                  </div>

                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-violet-600">
                      Saved Notes
                    </p>

                    <h2 className="mt-1 text-3xl font-black text-[#28134e]">
                      Archive
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Your archived notes are safely stored here.
                    </p>
                  </div>

                </div>

                <div className="rounded-2xl border border-violet-100 bg-white px-7 py-4 text-center shadow-sm">
                  <p className="text-3xl font-black text-violet-700">
                    {archivedNotes.length}
                  </p>

                  <p className="text-xs font-bold text-slate-500">
                    Archived Notes
                  </p>
                </div>

              </div>

              {/* ERROR */}

              {error && (
                <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-600">
                  {error}
                </div>
              )}

              {/* SEARCH + SORT */}

              <div className="mb-7 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                <div className="relative w-full max-w-[600px]">

                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-violet-500">
                    🔍
                  </span>

                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) =>
                      setSearchTerm(e.target.value)
                    }
                    placeholder="Search archived notes..."
                    className="w-full rounded-2xl border border-violet-100 bg-white py-4 pl-12 pr-4 text-sm outline-none shadow-sm transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
                  />

                </div>

                <div className="flex items-center gap-3">

                  <select
                    value={sortMode}
                    onChange={(e) =>
                      setSortMode(e.target.value)
                    }
                    className="rounded-xl border border-violet-100 bg-white px-4 py-3 text-sm font-bold text-slate-600 shadow-sm outline-none"
                  >
                    <option value="latest">
                      Latest First
                    </option>

                    <option value="oldest">
                      Oldest First
                    </option>
                  </select>

                  {searchTerm && (
                    <button
                      type="button"
                      onClick={() => setSearchTerm("")}
                      className="rounded-xl bg-violet-100 px-4 py-3 text-xs font-black text-violet-700 transition hover:bg-violet-200"
                    >
                      Clear
                    </button>
                  )}

                </div>

              </div>

              {/* CATEGORY CHIPS */}

              <div className="mb-7 flex gap-2 overflow-x-auto pb-1">

                <CategoryChip
                  icon="▦"
                  label="All"
                  count={archivedNotes.length}
                  active
                />

                <CategoryChip
                  icon="👤"
                  label="Personal"
                  count={getCategoryCount("Personal")}
                />

                <CategoryChip
                  icon="💼"
                  label="Work"
                  count={getCategoryCount("Work")}
                />

                <CategoryChip
                  icon="📚"
                  label="Study"
                  count={getCategoryCount("Study")}
                />

                <CategoryChip
                  icon="💡"
                  label="Ideas"
                  count={getCategoryCount("Ideas")}
                />

              </div>

              {/* TITLE */}

              <div className="mb-5">
                <h3 className="text-2xl font-black text-slate-900">
                  Archived Notes
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  {filteredNotes.length}{" "}
                  {filteredNotes.length === 1
                    ? "note"
                    : "notes"}{" "}
                  found
                </p>
              </div>

              {/* LOADING */}

              {loading ? (
                <div className="rounded-[28px] border border-violet-100 bg-white px-6 py-20 text-center shadow-sm">
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-violet-50 text-4xl">
                    ⏳
                  </div>

                  <h3 className="mt-5 text-xl font-black text-slate-800">
                    Loading archived notes...
                  </h3>

                  <p className="mt-2 text-sm text-slate-500">
                    Please wait.
                  </p>
                </div>

              ) : archivedNotes.length === 0 ? (

                <EmptyArchive />

              ) : filteredNotes.length === 0 ? (

                <div className="rounded-3xl border border-violet-100 bg-white px-6 py-20 text-center shadow-sm">

                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-violet-50 text-4xl">
                    🔍
                  </div>

                  <h3 className="mt-5 text-xl font-black text-slate-800">
                    No matching notes
                  </h3>

                  <p className="mt-2 text-sm text-slate-500">
                    Try another search term.
                  </p>

                  <button
                    type="button"
                    onClick={() => setSearchTerm("")}
                    className="mt-5 rounded-xl bg-violet-100 px-5 py-2.5 text-xs font-black text-violet-700 transition hover:bg-violet-200"
                  >
                    Clear Search
                  </button>

                </div>

              ) : (

                /* NOTES */

                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

                  {filteredNotes.map((note) => {

                    const category = getCategory(note);
                    const style = getCategoryStyle(category);

                    return (
                      <ArchiveCard
                        key={note.id}
                        note={note}
                        category={category}
                        style={style}
                        preview={getPreview(note.content)}
                        date={formatDate(note.updatedAt)}
                        onRestore={() =>
                          handleRestore(note.id)
                        }
                        onDelete={() =>
                          handlePermanentDelete(note.id)
                        }
                      />
                    );
                  })}

                </div>
              )}

              {/* FOOTER */}

              {!loading && archivedNotes.length > 0 && (
                <div className="mt-8 rounded-2xl border border-violet-100 bg-white/70 px-6 py-5 text-center">

                  <p className="text-sm font-bold text-slate-700">
                    🗄️ Your archived notes are safe here
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Restore them anytime or permanently delete them.
                  </p>

                </div>
              )}

            </div>

          </section>

        </main>

      </div>
    </div>
  );
}

// =============================================================
// SIDEBAR ITEM
// =============================================================

function SidebarItem({
  to,
  icon,
  label,
  active = false,
  count,
}) {
  return (
    <Link
      to={to}
      className={`flex items-center justify-between rounded-xl px-3 py-3 text-sm font-semibold transition ${
        active
          ? "bg-violet-600 text-white shadow-lg shadow-violet-900/20"
          : "text-violet-100 hover:bg-white/10"
      }`}
    >
      <span className="flex items-center gap-3">
        <span className="flex h-7 w-7 items-center justify-center text-lg">
          {icon}
        </span>

        {label}
      </span>

      {count !== undefined && (
        <span className="rounded-full bg-white/15 px-2 py-0.5 text-[9px]">
          {count}
        </span>
      )}
    </Link>
  );
}

// =============================================================
// NOTEBOOK ITEM
// =============================================================

function NotebookItem({
  color,
  label,
  count,
}) {
  return (
    <div className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm text-violet-100">

      <span className="flex items-center gap-3">

        <span
          className={`h-3 w-3 rounded-[4px] ${color}`}
        />

        {label}

      </span>

      <span className="text-[10px] text-violet-300">
        {count}
      </span>

    </div>
  );
}

// =============================================================
// TOP NAV
// =============================================================

function TopNavItem({
  label,
  color,
}) {
  return (
    <div className="flex items-center gap-2 text-sm font-semibold text-white">

      <span
        className={`h-5 w-5 rounded-full border border-white/20 ${color}`}
      />

      {label}

    </div>
  );
}

// =============================================================
// CATEGORY CHIP
// =============================================================

function CategoryChip({
  icon,
  label,
  count,
  active = false,
}) {
  return (
    <div
      className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-xs font-bold ${
        active
          ? "bg-violet-600 text-white shadow-md shadow-violet-200"
          : "border border-violet-100 bg-white text-slate-600 shadow-sm"
      }`}
    >
      <span>{icon}</span>

      {label}

      <span className="opacity-70">
        {count}
      </span>
    </div>
  );
}

// =============================================================
// ARCHIVE CARD
// =============================================================

function ArchiveCard({
  note,
  category,
  style,
  preview,
  date,
  onRestore,
  onDelete,
}) {
  return (
    <article className="group overflow-hidden rounded-[24px] border border-violet-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">

      {/* CARD TOP */}

      <div
        className={`border-b px-5 py-4 ${style.soft} ${style.border}`}
      >

        <div className="flex items-center justify-between">

          <div className="flex items-center gap-3">

            <div
              className={`flex h-11 w-11 items-center justify-center rounded-xl text-xl shadow-sm ${style.dot}`}
            >
              {style.icon}
            </div>

            <div>

              <p
                className={`text-sm font-black ${style.text}`}
              >
                {category}
              </p>

              <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                Archived
              </p>

            </div>

          </div>

          <span className="rounded-full bg-white px-3 py-1.5 text-[9px] font-bold text-slate-500 shadow-sm">
            {date}
          </span>

        </div>

      </div>

      {/* BODY */}

      <div className="p-5">

        <h4 className="min-h-[55px] line-clamp-2 text-xl font-black leading-7 text-[#33204d]">
          {note.title || "Untitled Note"}
        </h4>

        <div
          className={`mt-4 min-h-[125px] rounded-2xl border p-4 ${style.soft} ${style.border}`}
        >
          <p className={`text-sm leading-6 ${style.text}`}>
            {preview}
          </p>
        </div>

        {/* TAG */}

        <div className="mt-4 flex flex-wrap gap-2">

          <span
            className={`rounded-full border px-3 py-1.5 text-[9px] font-black ${style.soft} ${style.border} ${style.text}`}
          >
            {style.icon} {category}
          </span>

          {note.tag && (
            <span className="rounded-full bg-slate-100 px-3 py-1.5 text-[9px] font-bold text-slate-500">
              #{note.tag}
            </span>
          )}

        </div>

        {/* META */}

        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">

          <span className="text-[10px] font-bold text-slate-400">
            🗄️ Archived Note
          </span>

          <span className="text-[9px] font-bold text-violet-400">
            #{String(note.id).slice(-4)}
          </span>

        </div>

        {/* ACTIONS */}

        <div className="mt-5 grid grid-cols-2 gap-2">

          <button
            type="button"
            onClick={onRestore}
            className="rounded-xl bg-violet-600 px-4 py-3 text-xs font-black text-white shadow-md shadow-violet-200 transition hover:-translate-y-0.5 hover:bg-violet-700"
          >
            ↩ Restore
          </button>

          <button
            type="button"
            onClick={onDelete}
            className="rounded-xl bg-red-50 px-4 py-3 text-xs font-black text-red-600 transition hover:bg-red-100"
          >
            🗑 Delete
          </button>

        </div>

      </div>

    </article>
  );
}

// =============================================================
// EMPTY ARCHIVE
// =============================================================

function EmptyArchive() {
  return (
    <div className="rounded-[28px] border border-violet-100 bg-white px-6 py-20 text-center shadow-sm">

      <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-[28px] bg-violet-100 text-5xl">
        🗄️
      </div>

      <h3 className="mt-6 text-2xl font-black text-slate-800">
        No Archived Notes
      </h3>

      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
        Notes that you archive will appear here.
        You can restore them whenever you need.
      </p>

      <Link
        to="/notes"
        className="mt-6 inline-flex rounded-xl bg-violet-600 px-6 py-3 text-xs font-black text-white shadow-lg shadow-violet-200 transition hover:bg-violet-700"
      >
        Go to All Notes
      </Link>

    </div>
  );
}

export default Archive;