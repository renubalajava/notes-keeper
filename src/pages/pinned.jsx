import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
  getNotes,
  updateNote,
  deleteNote,
} from "../services/api.js";

import NoteEditor from "../components/NoteEditor.jsx";
import SearchBar from "../components/SearchBar.jsx";
import Toast from "../components/Toast.jsx";

/* =========================================================
   PINNED NOTES
========================================================= */

function Pinned() {
  /* =========================================================
     CURRENT USER
  ========================================================= */

  const [currentUser] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem("notesKeeperCurrentUser") ||
          localStorage.getItem("notesKeeperUser") ||
          "null"
      );
    } catch (error) {
      console.error("Unable to read current user:", error);
      return null;
    }
  });

  const currentUserId =
    currentUser?.id ||
    currentUser?.email ||
    null;

  /* =========================================================
     STATE
  ========================================================= */

  const [notes, setNotes] = useState([]);

  const [selectedNote, setSelectedNote] =
    useState(null);

  const [showEditor, setShowEditor] =
    useState(false);

  const [searchTerm, setSearchTerm] =
    useState("");

  const [toast, setToast] = useState({
    message: "",
    type: "success",
  });

  /* =========================================================
     LOAD NOTES FROM API
  ========================================================= */

  useEffect(() => {
    const loadNotes = async () => {
      try {
        const allNotes = await getNotes();

        const notesArray = Array.isArray(allNotes)
          ? allNotes
          : [];

        /*
         * IMPORTANT:
         * Only current user's notes are loaded.
         */
        const userNotes = currentUserId
          ? notesArray.filter(
              (note) =>
                String(note?.userId) ===
                String(currentUserId)
            )
          : [];

        setNotes(userNotes);
      } catch (error) {
        console.error(
          "Failed to load notes:",
          error
        );

        setNotes([]);

        showToast(
          "Failed to load notes.",
          "error"
        );
      }
    };

    loadNotes();
  }, [currentUserId]);

  /* =========================================================
     TOAST
  ========================================================= */

  const showToast = (
    message,
    type = "success"
  ) => {
    setToast({
      message,
      type,
    });

    setTimeout(() => {
      setToast({
        message: "",
        type: "success",
      });
    }, 2500);
  };

  /* =========================================================
     EDIT NOTE
  ========================================================= */

  const handleEditNote = (note) => {
    setSelectedNote(note);
    setShowEditor(true);
  };

  /* =========================================================
     SAVE EDITED NOTE
  ========================================================= */

  const handleSaveNote = async (updatedNote) => {
    try {
      const noteToSave = {
        ...updatedNote,
        userId: currentUserId,
        updatedAt: new Date().toISOString(),
      };

      const savedNote = await updateNote(
        updatedNote.id,
        noteToSave
      );

      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note.id === savedNote.id
            ? savedNote
            : note
        )
      );

      setSelectedNote(savedNote);

      showToast(
        "Note updated successfully!"
      );
    } catch (error) {
      console.error(
        "Failed to update note:",
        error
      );

      showToast(
        "Failed to update note.",
        "error"
      );
    }
  };

  /* =========================================================
     CLOSE EDITOR
  ========================================================= */

  const handleCloseEditor = () => {
    setShowEditor(false);
    setSelectedNote(null);
  };

  /* =========================================================
     UNPIN NOTE
  ========================================================= */

  const handleUnpin = async (id) => {
    const currentNote = notes.find(
      (note) => note.id === id
    );

    if (!currentNote) {
      return;
    }

    try {
      const savedNote = await updateNote(id, {
        ...currentNote,
        pinned: false,
        userId: currentUserId,
        updatedAt: new Date().toISOString(),
      });

      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note.id === savedNote.id
            ? savedNote
            : note
        )
      );

      /*
       * If currently opened note was unpinned,
       * close editor.
       */
      if (selectedNote?.id === id) {
        setSelectedNote(null);
        setShowEditor(false);
      }

      showToast(
        "Note removed from pinned notes.",
        "info"
      );
    } catch (error) {
      console.error(
        "Failed to unpin note:",
        error
      );

      showToast(
        "Failed to update note.",
        "error"
      );
    }
  };

  /* =========================================================
     DELETE NOTE
  ========================================================= */

  const handleDeleteNote = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this note?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteNote(id);

      setNotes((prevNotes) =>
        prevNotes.filter(
          (note) => note.id !== id
        )
      );

      if (selectedNote?.id === id) {
        setSelectedNote(null);
        setShowEditor(false);
      }

      showToast(
        "Note deleted successfully!"
      );
    } catch (error) {
      console.error(
        "Failed to delete note:",
        error
      );

      showToast(
        "Failed to delete note.",
        "error"
      );
    }
  };

  /* =========================================================
     SEARCH + PINNED FILTER
  ========================================================= */

  const pinnedNotes = useMemo(() => {
    const query = searchTerm
      .trim()
      .toLowerCase();

    return notes.filter((note) => {
      /*
       * Only pinned and non-archived notes.
       */
      if (
        !note?.pinned ||
        note?.archived
      ) {
        return false;
      }

      /*
       * Search
       */
      if (!query) {
        return true;
      }

      const plainContent = (
        note?.content || ""
      )
        .replace(/<[^>]*>/g, " ")
        .replace(/&nbsp;/g, " ")
        .replace(/\s+/g, " ")
        .toLowerCase();

      return (
        (note?.title || "")
          .toLowerCase()
          .includes(query) ||
        plainContent.includes(query) ||
        (note?.notebook || "")
          .toLowerCase()
          .includes(query) ||
        (note?.tag || "")
          .toLowerCase()
          .includes(query)
      );
    });
  }, [notes, searchTerm]);

  /* =========================================================
     PREVIEW
  ========================================================= */

  const getPreview = (content) => {
    if (!content) {
      return "No content added yet.";
    }

    const text = content
      .replace(/<[^>]*>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    return (
      text || "No content added yet."
    );
  };

  /* =========================================================
     USER
  ========================================================= */

  const userName =
    currentUser?.name || "User";

  const userInitial = userName
    .charAt(0)
    .toUpperCase();

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="min-h-screen bg-[#f7f5ff] text-slate-900">

      {/* TOAST */}
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() =>
          setToast({
            message: "",
            type: "success",
          })
        }
      />

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-[245px] bg-[#241044] text-white shadow-2xl lg:block">

        <div className="flex h-full flex-col px-5 py-6">

          {/* LOGO */}

          <div className="mb-9 flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-lg font-black shadow-lg">
              N
            </div>

            <div>
              <h1 className="text-lg font-extrabold tracking-tight">
                Notes Keeper
              </h1>

              <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-violet-300">
                Smart Workspace
              </p>
            </div>

          </div>

          {/* WORKSPACE */}

          <p className="mb-3 px-2 text-[9px] font-bold uppercase tracking-[0.2em] text-violet-300">
            Workspace
          </p>

          <nav className="space-y-1.5">

            <Link
              to="/dashboard"
              className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-violet-100 transition hover:bg-white/10"
            >
              <span className="text-base">
                ⌂
              </span>
              Dashboard
            </Link>

            <Link
              to="/notes"
              className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-violet-100 transition hover:bg-white/10"
            >
              <span className="text-base">
                ▣
              </span>
              All Notes
            </Link>

            {/* ACTIVE */}

            <Link
              to="/pinned"
              className="flex items-center gap-3 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-3 py-3 text-sm font-bold shadow-lg shadow-violet-950/30"
            >
              <span>📌</span>

              <span>
                Pinned Notes
              </span>

              <span className="ml-auto rounded-full bg-white/20 px-2 py-0.5 text-[9px]">
                {pinnedNotes.length}
              </span>
            </Link>

            <Link
              to="/archive"
              className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-violet-100 transition hover:bg-white/10"
            >
              <span>▤</span>
              Archive
            </Link>

          </nav>

          {/* SMART TOOLS */}

          <p className="mb-3 mt-8 px-2 text-[9px] font-bold uppercase tracking-[0.2em] text-violet-300">
            Smart Tools
          </p>

          <nav className="space-y-1.5">

            <Link
              to="/ai-assistant"
              className="flex items-center justify-between rounded-xl px-3 py-3 text-sm font-semibold text-violet-100 transition hover:bg-white/10"
            >
              <span className="flex items-center gap-3">
                <span>✧</span>
                AI Assistant
              </span>

              <span className="rounded-full bg-fuchsia-500 px-2 py-0.5 text-[8px] font-bold">
                NEW
              </span>
            </Link>

          </nav>

          {/* USER */}

          <div className="mt-auto border-t border-white/10 pt-5">

            <div className="flex items-center gap-3 rounded-2xl bg-white/10 p-3">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 font-extrabold shadow-md">
                {userInitial}
              </div>

              <div className="min-w-0">

                <p className="truncate text-sm font-bold">
                  {userName}
                </p>

                <p className="text-[9px] text-violet-300">
                  Notes Keeper User
                </p>

              </div>

            </div>

          </div>

        </div>

      </aside>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="lg:ml-[245px]">

        {/* TOP NAVBAR */}

        <header className="sticky top-0 z-30 border-b border-violet-100 bg-gradient-to-r from-violet-700 via-purple-700 to-fuchsia-700 text-white shadow-md">

          <div className="flex min-h-[74px] items-center justify-between gap-5 px-5 sm:px-8">

            {/* TITLE */}

            <div>

              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-violet-200">
                Notes Workspace
              </p>

              <h2 className="text-xl font-extrabold sm:text-2xl">
                Pinned Notes
              </h2>

            </div>

            {/* SEARCH */}

            <div className="hidden w-full max-w-md md:block">

              <SearchBar
                searchTerm={searchTerm}
                onSearch={setSearchTerm}
              />

            </div>

            {/* PROFILE */}

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20 font-bold shadow-inner ring-2 ring-white/20">
              {userInitial}
            </div>

          </div>

        </header>

        {/* CONTENT */}

        <section className="mx-auto max-w-[1450px] px-5 py-7 sm:px-8 lg:px-10">

          {/* MOBILE SEARCH */}

          <div className="mb-6 md:hidden">

            <SearchBar
              searchTerm={searchTerm}
              onSearch={setSearchTerm}
            />

          </div>

          {/* =================================================
              HERO
          ================================================= */}

          <div className="relative mb-8 overflow-hidden rounded-[28px] bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 p-7 text-white shadow-xl sm:p-9">

            {/* DECORATION */}

            <div className="absolute -right-10 -top-16 h-48 w-48 rounded-full bg-white/10" />

            <div className="absolute -bottom-20 right-32 h-40 w-40 rounded-full bg-fuchsia-300/10" />

            <div className="absolute right-12 top-12 text-6xl opacity-10">
              📌
            </div>

            <div className="relative">

              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-xl backdrop-blur">
                📌
              </div>

              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-violet-200">
                Your Important Notes
              </p>

              <h1 className="mt-2 text-3xl font-black sm:text-4xl">
                Pinned Notes
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-6 text-violet-100">
                Your most important ideas and reminders,
                kept right where you need them.
              </p>

              <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-xs font-bold backdrop-blur">
                📌 {pinnedNotes.length}{" "}
                {pinnedNotes.length === 1
                  ? "Pinned Note"
                  : "Pinned Notes"}
              </div>

            </div>

          </div>

          {/* =================================================
              SECTION HEADER
          ================================================= */}

          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">

            <div>

              <div className="flex items-center gap-2">

                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-100 text-sm">
                  📌
                </span>

                <h2 className="text-xl font-extrabold text-slate-900">
                  Your Pinned Notes
                </h2>

              </div>

              <p className="mt-1 ml-10 text-xs text-slate-400">
                {pinnedNotes.length}{" "}
                {pinnedNotes.length === 1
                  ? "important note"
                  : "important notes"}
              </p>

            </div>

            {searchTerm && (
              <button
                onClick={() =>
                  setSearchTerm("")
                }
                className="rounded-xl border border-violet-100 bg-white px-4 py-2 text-xs font-bold text-violet-700 shadow-sm transition hover:bg-violet-50"
              >
                Clear Search
              </button>
            )}

          </div>

          {/* =================================================
              EMPTY STATE
          ================================================= */}

          {pinnedNotes.length === 0 ? (

            <div className="rounded-[28px] border border-violet-100 bg-white px-6 py-20 text-center shadow-sm">

              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-[28px] bg-gradient-to-br from-violet-100 to-fuchsia-100 text-5xl">
                📌
              </div>

              <h2 className="mt-6 text-2xl font-extrabold text-slate-800">

                {searchTerm
                  ? "No matching pinned notes"
                  : "No pinned notes yet"}

              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">

                {searchTerm
                  ? "Try another search term or clear your search."
                  : "Pin your important notes from All Notes and they will appear here."}

              </p>

              {searchTerm ? (

                <button
                  onClick={() =>
                    setSearchTerm("")
                  }
                  className="mt-6 rounded-xl bg-violet-600 px-5 py-3 text-sm font-extrabold text-white shadow-md transition hover:bg-violet-700"
                >
                  Clear Search
                </button>

              ) : (

                <Link
                  to="/notes"
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-extrabold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-violet-700"
                >
                  View All Notes →
                </Link>

              )}

            </div>

          ) : (

            /* =================================================
               PINNED GRID
            ================================================= */

            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

              {pinnedNotes.map((note) => (

                <PinnedNoteCard
                  key={note.id}
                  note={note}
                  getPreview={getPreview}
                  onEdit={() =>
                    handleEditNote(note)
                  }
                  onUnpin={() =>
                    handleUnpin(note.id)
                  }
                  onDelete={() =>
                    handleDeleteNote(note.id)
                  }
                />

              ))}

            </div>

          )}

          {/* FOOTER */}

          <footer className="py-8 text-center text-xs text-slate-400">
            Notes Keeper • Your important ideas, always within reach
          </footer>

        </section>

      </main>

      {/* =====================================================
          NOTE EDITOR
      ===================================================== */}

      {showEditor && selectedNote && (
        <NoteEditor
          note={selectedNote}
          onSave={handleSaveNote}
          onClose={handleCloseEditor}
        />
      )}

    </div>
  );
}

/* =========================================================
   PINNED NOTE CARD
========================================================= */

function PinnedNoteCard({
  note,
  getPreview,
  onEdit,
  onUnpin,
  onDelete,
}) {
  /* =========================================================
     THEME
  ========================================================= */

  const getTheme = () => {
    const value = (
      note?.notebook ||
      note?.category ||
      note?.tag ||
      "Personal"
    ).toLowerCase();

    if (value.includes("work")) {
      return {
        header:
          "from-blue-50 to-indigo-50",
        border:
          "border-blue-100",
        icon:
          "bg-blue-100 text-blue-600",
        badge:
          "bg-blue-50 text-blue-700 border-blue-200",
        accent:
          "text-blue-600",
        bottom:
          "bg-blue-500",
      };
    }

    if (
      value.includes("study") ||
      value.includes("learning")
    ) {
      return {
        header:
          "from-emerald-50 to-teal-50",
        border:
          "border-emerald-100",
        icon:
          "bg-emerald-100 text-emerald-600",
        badge:
          "bg-emerald-50 text-emerald-700 border-emerald-200",
        accent:
          "text-emerald-600",
        bottom:
          "bg-emerald-500",
      };
    }

    if (value.includes("idea")) {
      return {
        header:
          "from-amber-50 to-orange-50",
        border:
          "border-amber-100",
        icon:
          "bg-amber-100 text-amber-600",
        badge:
          "bg-amber-50 text-amber-700 border-amber-200",
        accent:
          "text-amber-600",
        bottom:
          "bg-amber-500",
      };
    }

    if (value.includes("important")) {
      return {
        header:
          "from-pink-50 to-rose-50",
        border:
          "border-pink-100",
        icon:
          "bg-pink-100 text-pink-600",
        badge:
          "bg-pink-50 text-pink-700 border-pink-200",
        accent:
          "text-pink-600",
        bottom:
          "bg-pink-500",
      };
    }

    return {
      header:
        "from-violet-50 to-fuchsia-50",
      border:
        "border-violet-100",
      icon:
        "bg-violet-100 text-violet-600",
      badge:
        "bg-violet-50 text-violet-700 border-violet-200",
      accent:
        "text-violet-600",
      bottom:
        "bg-violet-500",
    };
  };

  const theme = getTheme();

  /* =========================================================
     DATE
  ========================================================= */

  const formatDate = (date) => {
    if (!date) {
      return "Recently";
    }

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
      return "Recently";
    }

    return parsed.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  /* =========================================================
     ICON
  ========================================================= */

  const getIcon = () => {
    const value = (
      note?.notebook ||
      note?.category ||
      note?.tag ||
      "Personal"
    ).toLowerCase();

    if (value.includes("work")) {
      return "💼";
    }

    if (value.includes("study")) {
      return "📚";
    }

    if (value.includes("learning")) {
      return "🎓";
    }

    if (value.includes("idea")) {
      return "💡";
    }

    if (value.includes("important")) {
      return "⭐";
    }

    return "📝";
  };

  /* =========================================================
     CARD
  ========================================================= */

  return (
    <article
      className={`group relative overflow-hidden rounded-[22px] border ${theme.border} bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl`}
    >

      {/* CARD HEADER */}

      <div
        className={`bg-gradient-to-br ${theme.header} p-4`}
      >

        <div className="flex items-start justify-between gap-3">

          <div className="flex items-center gap-3">

            <div
              className={`flex h-11 w-11 items-center justify-center rounded-xl ${theme.icon} text-lg`}
            >
              {getIcon()}
            </div>

            <div>

              <p className="text-[8px] font-bold uppercase tracking-[0.15em] text-slate-400">
                Notebook
              </p>

              <span className="text-xs font-bold text-slate-700">
                {note?.notebook ||
                  "Personal"}
              </span>

            </div>

          </div>

          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white shadow-sm">
            📌
          </div>

        </div>

      </div>

      {/* CONTENT */}

      <div className="p-5">

        <div className="mb-3 flex items-center justify-between gap-2">

          {note?.tag ? (

            <span
              className={`rounded-full border px-2.5 py-1 text-[9px] font-extrabold capitalize ${theme.badge}`}
            >
              {note.tag}
            </span>

          ) : (

            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[9px] font-bold text-slate-500">
              General
            </span>

          )}

          <span className="text-[9px] text-slate-400">
            {formatDate(
              note?.updatedAt ||
                note?.createdAt
            )}
          </span>

        </div>

        {/* TITLE + PREVIEW */}

        <button
          onClick={onEdit}
          className="w-full text-left"
        >

          <h3 className="line-clamp-2 text-base font-extrabold text-slate-800 transition group-hover:text-violet-700">
            {note?.title ||
              "Untitled Note"}
          </h3>

          <p className="mt-2 line-clamp-4 min-h-[80px] text-xs leading-5 text-slate-500">
            {getPreview(
              note?.content
            )}
          </p>

        </button>

        {/* ACTIONS */}

        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">

          <button
            onClick={onEdit}
            className={`text-[10px] font-bold ${theme.accent} transition hover:opacity-60`}
          >
            Open Note →
          </button>

          <div className="flex gap-1">

            <button
              onClick={onUnpin}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-xs text-amber-600 transition hover:bg-amber-100"
              title="Unpin"
            >
              📌
            </button>

            <button
              onClick={onDelete}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-xs text-red-500 transition hover:bg-red-100"
              title="Delete"
            >
              🗑️
            </button>

          </div>

        </div>

      </div>

      {/* BOTTOM ACCENT */}

      <div
        className={`h-1 ${theme.bottom}`}
      />

    </article>
  );
}

export default Pinned;