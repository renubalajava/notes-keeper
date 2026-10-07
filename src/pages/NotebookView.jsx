import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import NoteEditor from "../components/NoteEditor";

import {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
} from "../services/api";

function NotebookView() {
  const { notebookName } = useParams();
  const navigate = useNavigate();

  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [showEditor, setShowEditor] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================================================
  // CURRENT USER
  // =========================================================

  const getCurrentUser = () => {
    try {
      return JSON.parse(
        localStorage.getItem("notesKeeperCurrentUser") || "null"
      );
    } catch {
      return null;
    }
  };

  const currentUser = getCurrentUser();

  const currentUserId =
    currentUser?.id || currentUser?.email || null;

  // =========================================================
  // LOAD NOTES FROM API
  // =========================================================

  const loadNotes = async () => {
    try {
      setLoading(true);
      setError("");

      const allNotes = await getNotes();

      const safeNotes = Array.isArray(allNotes)
        ? allNotes
        : [];

      const userNotes = currentUserId
        ? safeNotes.filter(
            (note) =>
              String(note.userId) ===
              String(currentUserId)
          )
        : [];

      setNotes(userNotes);
    } catch (err) {
      console.error("Failed to load notes:", err);

      setError(
        "Unable to load notes. Please make sure JSON Server is running."
      );

      setNotes([]);
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // LOAD NOTES
  // =========================================================

  useEffect(() => {
    loadNotes();

    const handleStorage = () => {
      loadNotes();
    };

    window.addEventListener(
      "storage",
      handleStorage
    );

    window.addEventListener(
      "notesUpdated",
      handleStorage
    );

    return () => {
      window.removeEventListener(
        "storage",
        handleStorage
      );

      window.removeEventListener(
        "notesUpdated",
        handleStorage
      );
    };
  }, []);

  // =========================================================
  // NOTEBOOK NAME
  // =========================================================

  const decodedNotebookName = decodeURIComponent(
    notebookName || ""
  );

  // =========================================================
  // NOTEBOOK COLOR THEME
  // =========================================================

  const getNotebookTheme = (name) => {
    const notebook = name.toLowerCase();

    if (notebook.includes("work")) {
      return {
        page: "bg-blue-50/60",
        iconBg: "bg-blue-100",
        iconText: "text-blue-600",
        title: "text-slate-800",
        subtitle: "text-slate-500",
        button: "bg-blue-600 hover:bg-blue-700",
        searchFocus:
          "focus:border-blue-400 focus:ring-blue-100",
        emptyIcon: "bg-blue-100 text-blue-600",
        accent: "blue",
      };
    }

    if (
      notebook.includes("study") ||
      notebook.includes("learning")
    ) {
      return {
        page: "bg-emerald-50/60",
        iconBg: "bg-emerald-100",
        iconText: "text-emerald-600",
        title: "text-slate-800",
        subtitle: "text-slate-500",
        button:
          "bg-emerald-600 hover:bg-emerald-700",
        searchFocus:
          "focus:border-emerald-400 focus:ring-emerald-100",
        emptyIcon:
          "bg-emerald-100 text-emerald-600",
        accent: "emerald",
      };
    }

    if (notebook.includes("idea")) {
      return {
        page: "bg-amber-50/70",
        iconBg: "bg-amber-100",
        iconText: "text-amber-600",
        title: "text-slate-800",
        subtitle: "text-slate-500",
        button:
          "bg-amber-500 hover:bg-amber-600",
        searchFocus:
          "focus:border-amber-400 focus:ring-amber-100",
        emptyIcon:
          "bg-amber-100 text-amber-600",
        accent: "amber",
      };
    }

    if (notebook.includes("important")) {
      return {
        page: "bg-pink-50/60",
        iconBg: "bg-pink-100",
        iconText: "text-pink-600",
        title: "text-slate-800",
        subtitle: "text-slate-500",
        button:
          "bg-pink-600 hover:bg-pink-700",
        searchFocus:
          "focus:border-pink-400 focus:ring-pink-100",
        emptyIcon:
          "bg-pink-100 text-pink-600",
        accent: "pink",
      };
    }

    return {
      page: "bg-violet-50/60",
      iconBg: "bg-violet-100",
      iconText: "text-violet-600",
      title: "text-slate-800",
      subtitle: "text-slate-500",
      button:
        "bg-violet-600 hover:bg-violet-700",
      searchFocus:
        "focus:border-violet-400 focus:ring-violet-100",
      emptyIcon:
        "bg-violet-100 text-violet-600",
      accent: "violet",
    };
  };

  // =========================================================
  // CARD THEME
  // =========================================================

  const getCardTheme = (note) => {
    const value = (
      note.notebook ||
      note.category ||
      note.tag ||
      "Personal"
    ).toLowerCase();

    if (value.includes("work")) {
      return {
        header: "bg-blue-50",
        border: "border-blue-100",
        icon: "bg-blue-100 text-blue-600",
        badge:
          "bg-blue-50 text-blue-700 border-blue-200",
        accent: "text-blue-600",
        line: "bg-blue-500",
      };
    }

    if (
      value.includes("study") ||
      value.includes("learning")
    ) {
      return {
        header: "bg-emerald-50",
        border: "border-emerald-100",
        icon:
          "bg-emerald-100 text-emerald-600",
        badge:
          "bg-emerald-50 text-emerald-700 border-emerald-200",
        accent: "text-emerald-600",
        line: "bg-emerald-500",
      };
    }

    if (value.includes("idea")) {
      return {
        header: "bg-amber-50",
        border: "border-amber-100",
        icon:
          "bg-amber-100 text-amber-600",
        badge:
          "bg-amber-50 text-amber-700 border-amber-200",
        accent: "text-amber-600",
        line: "bg-amber-500",
      };
    }

    if (value.includes("important")) {
      return {
        header: "bg-pink-50",
        border: "border-pink-100",
        icon:
          "bg-pink-100 text-pink-600",
        badge:
          "bg-pink-50 text-pink-700 border-pink-200",
        accent: "text-pink-600",
        line: "bg-pink-500",
      };
    }

    return {
      header: "bg-violet-50",
      border: "border-violet-100",
      icon:
        "bg-violet-100 text-violet-600",
      badge:
        "bg-violet-50 text-violet-700 border-violet-200",
      accent: "text-violet-600",
      line: "bg-violet-500",
    };
  };

  const theme =
    getNotebookTheme(decodedNotebookName);

  // =========================================================
  // FILTER NOTES
  // =========================================================

  const notebookNotes = useMemo(() => {
    return notes
      .filter(
        (note) =>
          !note.archived &&
          (note.notebook || "General").toLowerCase() ===
            decodedNotebookName.toLowerCase()
      )
      .filter((note) => {
        const search =
          searchTerm.toLowerCase().trim();

        if (!search) return true;

        const title = note.title || "";
        const content = note.content || "";
        const tag = note.tag || "";

        return (
          title
            .toLowerCase()
            .includes(search) ||
          content
            .replace(/<[^>]*>/g, " ")
            .toLowerCase()
            .includes(search) ||
          tag
            .toLowerCase()
            .includes(search)
        );
      })
      .sort((a, b) => {
        if (a.pinned && !b.pinned) return -1;

        if (!a.pinned && b.pinned) return 1;

        return (
          new Date(
            b.updatedAt ||
              b.createdAt ||
              0
          ) -
          new Date(
            a.updatedAt ||
              a.createdAt ||
              0
          )
        );
      });
  }, [
    notes,
    decodedNotebookName,
    searchTerm,
  ]);

  // =========================================================
  // EDIT NOTE
  // =========================================================

  const handleEdit = (note) => {
    setSelectedNote(note);
    setShowEditor(true);
  };

  // =========================================================
  // SAVE / CREATE NOTE
  // =========================================================

  const handleSave = async (
    updatedNote,
    options = {}
  ) => {
    try {
      setError("");

      const now =
        new Date().toISOString();

      // =====================================================
      // CREATE NEW NOTE
      // =====================================================

      if (!updatedNote?.id) {
        const newNote = {
          ...updatedNote,

          userId: currentUserId,

          notebook:
            updatedNote.notebook ||
            decodedNotebookName,

          title:
            updatedNote.title?.trim() ||
            "Untitled Note",

          content:
            updatedNote.content || "",

          tag:
            updatedNote.tag || "",

          pinned:
            Boolean(updatedNote.pinned),

          archived:
            Boolean(updatedNote.archived),

          createdAt:
            updatedNote.createdAt || now,

          updatedAt: now,
        };

        const createdNote =
          await createNote(newNote);

        setNotes((prevNotes) => [
          ...prevNotes,
          createdNote,
        ]);

        if (!options.autoSave) {
          setSelectedNote(null);
          setShowEditor(false);
        }

        window.dispatchEvent(
          new Event("notesUpdated")
        );

        return;
      }

      // =====================================================
      // UPDATE EXISTING NOTE
      // =====================================================

      const noteToUpdate = {
        ...updatedNote,

        userId:
          updatedNote.userId ||
          currentUserId,

        notebook:
          updatedNote.notebook ||
          decodedNotebookName,

        updatedAt: now,
      };

      const savedNote =
        await updateNote(
          updatedNote.id,
          noteToUpdate
        );

      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          String(note.id) ===
          String(savedNote.id)
            ? savedNote
            : note
        )
      );

      if (!options.autoSave) {
        setSelectedNote(null);
        setShowEditor(false);
      }

      window.dispatchEvent(
        new Event("notesUpdated")
      );
    } catch (err) {
      console.error(
        "Failed to save note:",
        err
      );

      setError(
        "Unable to save note. Please make sure JSON Server is running."
      );
    }
  };

  // =========================================================
  // DELETE NOTE
  // =========================================================

  const handleDelete = async (noteId) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this note?"
      );

    if (!confirmed) return;

    try {
      setError("");

      await deleteNote(noteId);

      setNotes((prevNotes) =>
        prevNotes.filter(
          (note) =>
            String(note.id) !==
            String(noteId)
        )
      );

      if (
        selectedNote &&
        String(selectedNote.id) ===
          String(noteId)
      ) {
        setSelectedNote(null);
        setShowEditor(false);
      }

      window.dispatchEvent(
        new Event("notesUpdated")
      );
    } catch (err) {
      console.error(
        "Failed to delete note:",
        err
      );

      setError(
        "Unable to delete note. Please try again."
      );
    }
  };

  // =========================================================
  // PIN / UNPIN
  // =========================================================

  const handlePin = async (noteId) => {
    try {
      setError("");

      const note = notes.find(
        (item) =>
          String(item.id) ===
          String(noteId)
      );

      if (!note) return;

      const updatedNote = {
        ...note,

        pinned:
          !note.pinned,

        updatedAt:
          new Date().toISOString(),
      };

      const savedNote =
        await updateNote(
          noteId,
          updatedNote
        );

      setNotes((prevNotes) =>
        prevNotes.map((item) =>
          String(item.id) ===
          String(savedNote.id)
            ? savedNote
            : item
        )
      );

      window.dispatchEvent(
        new Event("notesUpdated")
      );
    } catch (err) {
      console.error(
        "Failed to update pin:",
        err
      );

      setError(
        "Unable to update pin status."
      );
    }
  };

  // =========================================================
  // ARCHIVE NOTE
  // =========================================================

  const handleArchive = async (noteId) => {
    try {
      setError("");

      const note = notes.find(
        (item) =>
          String(item.id) ===
          String(noteId)
      );

      if (!note) return;

      const updatedNote = {
        ...note,

        archived: true,

        updatedAt:
          new Date().toISOString(),
      };

      await updateNote(
        noteId,
        updatedNote
      );

      setNotes((prevNotes) =>
        prevNotes.filter(
          (item) =>
            String(item.id) !==
            String(noteId)
        )
      );

      window.dispatchEvent(
        new Event("notesUpdated")
      );
    } catch (err) {
      console.error(
        "Failed to archive note:",
        err
      );

      setError(
        "Unable to archive note."
      );
    }
  };

  // =========================================================
  // HELPERS
  // =========================================================

  const stripHtml = (html = "") => {
    return html
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  };

  const formatDate = (date) => {
    if (!date) return "";

    const parsedDate =
      new Date(date);

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return "";
    }

    return parsedDate.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  const getTagStyle = (tag) => {
    const styles = {
      red:
        "bg-red-50 text-red-700 border-red-200",

      orange:
        "bg-orange-50 text-orange-700 border-orange-200",

      yellow:
        "bg-yellow-50 text-yellow-700 border-yellow-200",

      green:
        "bg-green-50 text-green-700 border-green-200",

      blue:
        "bg-blue-50 text-blue-700 border-blue-200",

      purple:
        "bg-purple-50 text-purple-700 border-purple-200",

      teal:
        "bg-teal-50 text-teal-700 border-teal-200",
    };

    return (
      styles[tag?.toLowerCase()] ||
      "bg-violet-50 text-violet-700 border-violet-200"
    );
  };

  const getNotebookIcon = () => {
    const name =
      decodedNotebookName.toLowerCase();

    if (name.includes("work"))
      return "💼";

    if (name.includes("study"))
      return "📚";

    if (name.includes("learning"))
      return "🎓";

    if (name.includes("idea"))
      return "💡";

    if (name.includes("important"))
      return "⭐";

    return "📓";
  };
  // =========================================================
// UI
// =========================================================

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className={`min-h-screen ${theme.page} text-slate-800`}>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* ================= HEADER ================= */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <button
              onClick={() => navigate("/notes")}
              className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-violet-600"
            >
              <ArrowLeft size={17} />
              Back to All Notes
            </button>

            <div className="flex items-center gap-3">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-2xl ${theme.iconBg}`}
              >
                {getNotebookIcon()}
              </div>

              <div>
                <h1 className="text-2xl font-bold sm:text-3xl">
                  {decodedNotebookName}
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                  {filteredNotes.length}{" "}
                  {filteredNotes.length === 1 ? "note" : "notes"} in this
                  notebook
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              setSelectedNote(null);
              setShowEditor(true);
            }}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-200 transition hover:bg-violet-700"
          >
            <Plus size={18} />
            New Note
          </button>
        </div>

        {/* ================= SEARCH / CONTROLS ================= */}
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

            <div className="w-full lg:max-w-xl">
              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={`Search in ${decodedNotebookName}...`}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-100"
                />

                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-700"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-slate-500">
                {filteredNotes.length} results
              </span>

              <button
                onClick={() => setSearchTerm("")}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-violet-300 hover:text-violet-600"
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        {/* ================= LOADING ================= */}
        {loading && (
          <div className="flex min-h-[300px] items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <Loader2
                size={32}
                className="animate-spin text-violet-600"
              />
              <p className="text-sm text-slate-500">
                Loading notes...
              </p>
            </div>
          </div>
        )}

        {/* ================= ERROR ================= */}
        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
            <AlertCircle
              size={32}
              className="mx-auto mb-3 text-red-500"
            />

            <h3 className="font-semibold text-red-700">
              Unable to load notes
            </h3>

            <p className="mt-1 text-sm text-red-600">
              {error}
            </p>

            <button
              onClick={loadNotes}
              className="mt-4 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        )}

        {/* ================= EMPTY STATE ================= */}
        {!loading && !error && filteredNotes.length === 0 && (
          <div className="flex min-h-[420px] flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white px-6 text-center shadow-sm">
            <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-violet-50">
              <NotebookTabs
                size={38}
                className="text-violet-500"
              />
            </div>

            <h2 className="text-xl font-bold text-slate-800">
              {searchTerm
                ? "No matching notes"
                : "This notebook is empty"}
            </h2>

            <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
              {searchTerm
                ? "Try another search term or clear the search."
                : `Create your first note in ${decodedNotebookName}.`}
            </p>

            {searchTerm ? (
              <button
                onClick={() => setSearchTerm("")}
                className="mt-6 rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-violet-300 hover:text-violet-600"
              >
                Clear Search
              </button>
            ) : (
              <button
                onClick={() => {
                  setSelectedNote(null);
                  setShowEditor(true);
                }}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-200 transition hover:bg-violet-700"
              >
                <Plus size={18} />
                Create Note
              </button>
            )}
          </div>
        )}

        {/* ================= NOTES GRID ================= */}
        {!loading && !error && filteredNotes.length > 0 && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredNotes.map((note) => {
              const preview =
                stripHtml(note.content || "").slice(0, 150) ||
                "No content";

              return (
                <article
                  key={note.id}
                  className={`group relative flex min-h-[250px] flex-col overflow-hidden rounded-2xl border bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-xl ${
                    note.pinned
                      ? "border-amber-200"
                      : "border-slate-200"
                  }`}
                >
                  {/* Pin */}
                  {note.pinned && (
                    <div className="absolute right-4 top-4 rounded-full bg-amber-50 p-2 text-amber-500">
                      <Pin size={15} fill="currentColor" />
                    </div>
                  )}

                  {/* Title */}
                  <div className="pr-10">
                    <h2 className="line-clamp-2 text-lg font-bold text-slate-800">
                      {note.title || "Untitled Note"}
                    </h2>
                  </div>

                  {/* Preview */}
                  <p className="mt-3 line-clamp-5 flex-1 text-sm leading-6 text-slate-500">
                    {preview}
                    {stripHtml(note.content || "").length > 150
                      ? "..."
                      : ""}
                  </p>

                  {/* Metadata */}
                  <div className="mt-4 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      {note.tag && (
                        <span className="rounded-full bg-violet-50 px-2.5 py-1 text-xs font-medium text-violet-600">
                          #{note.tag}
                        </span>
                      )}

                      {note.notebook && (
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                          {note.notebook}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-400">
                      {note.updatedAt
                        ? `Edited ${note.updatedAt}`
                        : "Recently edited"}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                    <button
                      onClick={() => handlePin(note)}
                      title={
                        note.pinned
                          ? "Unpin note"
                          : "Pin note"
                      }
                      className={`rounded-lg p-2 transition ${
                        note.pinned
                          ? "bg-amber-50 text-amber-500"
                          : "text-slate-400 hover:bg-amber-50 hover:text-amber-500"
                      }`}
                    >
                      <Pin
                        size={17}
                        fill={
                          note.pinned
                            ? "currentColor"
                            : "none"
                        }
                      />
                    </button>

                    <button
                      onClick={() => {
                        setSelectedNote(note);
                        setShowEditor(true);
                      }}
                      title="Edit note"
                      className="rounded-lg p-2 text-slate-400 transition hover:bg-violet-50 hover:text-violet-600"
                    >
                      <Edit3 size={17} />
                    </button>

                    <button
                      onClick={() => handleArchive(note)}
                      title="Archive note"
                      className="rounded-lg p-2 text-slate-400 transition hover:bg-orange-50 hover:text-orange-500"
                    >
                      <Archive size={17} />
                    </button>

                    <button
                      onClick={() => handleDelete(note)}
                      title="Delete note"
                      className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* ================= FOOTER INFO ================= */}
        {!loading && !error && filteredNotes.length > 0 && (
          <div className="mt-8 text-center">
            <p className="text-xs text-slate-400">
              Showing {filteredNotes.length}{" "}
              {filteredNotes.length === 1 ? "note" : "notes"} from{" "}
              {decodedNotebookName}
            </p>
          </div>
        )}
      </main>

      {/* ================= NOTE EDITOR ================= */}
      {showEditor && (
        <NoteEditor
          note={selectedNote}
          selectedNotebook={decodedNotebookName}
          onSave={handleSave}
          onClose={() => {
            setSelectedNote(null);
            setShowEditor(false);
            loadNotes();
          }}
        />
      )}
    </div>
  );
}

export default NotebookView;
