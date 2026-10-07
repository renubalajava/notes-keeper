import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import NoteEditor from "../components/NoteEditor.jsx";
import SearchBar from "../components/SearchBar.jsx";
import Toast from "../components/Toast.jsx";

const NOTE_STORAGE_KEY = "notesKeeperNotes";
const NOTEBOOK_STORAGE_KEY = "notesKeeperNotebooksByUser";

const DEFAULT_NOTEBOOKS = [
  "All Notes",
  "Personal",
  "Work",
  "Study",
];

// =============================================================
// ALL NOTES
// =============================================================

function AllNotes() {
  // ===========================================================
  // CURRENT USER
  // ===========================================================

  const [currentUser] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem("notesKeeperCurrentUser") ||
          localStorage.getItem("notesKeeperUser") ||
          "null"
      );
    } catch (error) {
      console.error("Failed to read current user:", error);
      return null;
    }
  });

  const currentUserId =
    currentUser?.id ||
    currentUser?.email ||
    null;

  // ===========================================================
  // STATE
  // ===========================================================

  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
const [loadError, setLoadError] = useState("");
const [reloadKey, setReloadKey] = useState(0);
  const [selectedNote, setSelectedNote] = useState(null);
  const [showEditor, setShowEditor] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState("All Notes");

  const [selectedNotebook, setSelectedNotebook] =
    useState("All Notes");

  const [viewMode, setViewMode] = useState("grid");
  const [sortMode, setSortMode] = useState("latest");

  const [notebookList, setNotebookList] =
    useState(DEFAULT_NOTEBOOKS);

  const [toast, setToast] = useState({
    message: "",
    type: "success",
  });

  // ===========================================================
  // LOAD USER NOTES
  // ===========================================================

  useEffect(() => {
      setIsLoading(true);
  setLoadError("");


    const loadNotes = () => {
      try {
        const savedNotes = JSON.parse(
          localStorage.getItem(NOTE_STORAGE_KEY) || "[]"
        );

        const allNotes = Array.isArray(savedNotes)
          ? savedNotes
          : [];

        /*
         * Legacy migration:
         * Old notes may not have userId.
         * Assign them to current logged-in user.
         */
        let migratedNotes = allNotes;

        if (currentUserId) {
          migratedNotes = allNotes.map((note) => {
            if (!note.userId) {
              return {
                ...note,
                userId: currentUserId,
              };
            }

            return note;
          });

          const changed =
            migratedNotes.some(
              (note, index) =>
                note !== allNotes[index]
            );

          if (changed) {
            localStorage.setItem(
              NOTE_STORAGE_KEY,
              JSON.stringify(migratedNotes)
            );
          }
        }

        /*
         * Only current user's notes are loaded.
         */
        const userNotes = currentUserId
          ? migratedNotes.filter(
              (note) =>
                note.userId === currentUserId
            )
          : [];

        setNotes(userNotes);
      } catch (error) {
  console.error(
    "Failed to load notes:",
    error
  );

  setNotes([]);
  setLoadError("We couldn't load your notes. Please try again.");
}
finally {
  setIsLoading(false);
}
    };

    loadNotes();

    window.addEventListener(
      "storage",
      loadNotes
    );

    window.addEventListener(
      "notesUpdated",
      loadNotes
    );

    return () => {
      window.removeEventListener(
        "storage",
        loadNotes
      );

      window.removeEventListener(
        "notesUpdated",
        loadNotes
      );
    };
  }, [currentUserId, reloadKey]);

  // ===========================================================
  // LOAD USER NOTEBOOKS
  // ===========================================================

  useEffect(() => {
    const loadNotebooks = () => {
      try {
        if (!currentUserId) {
          setNotebookList(DEFAULT_NOTEBOOKS);
          return;
        }

        const savedByUser = JSON.parse(
          localStorage.getItem(
            NOTEBOOK_STORAGE_KEY
          ) || "{}"
        );

        let userNotebooks =
          savedByUser[currentUserId];

        /*
         * Legacy migration.
         *
         * Old version used:
         * notesKeeperNotebooks
         *
         * New version uses:
         * notesKeeperNotebooksByUser
         */
        if (
          !Array.isArray(userNotebooks) ||
          userNotebooks.length === 0
        ) {
          let legacyNotebooks = [];

          try {
            legacyNotebooks = JSON.parse(
              localStorage.getItem(
                "notesKeeperNotebooks"
              ) || "[]"
            );
          } catch {
            legacyNotebooks = [];
          }

          if (
            Array.isArray(legacyNotebooks) &&
            legacyNotebooks.length > 0
          ) {
            userNotebooks = legacyNotebooks;
          } else {
            userNotebooks = [
              "Personal",
              "Work",
              "Study",
            ];
          }

          userNotebooks = [
            ...new Set(
              userNotebooks.filter(
                (item) =>
                  item &&
                  item !== "All Notes"
              )
            ),
          ];

          savedByUser[currentUserId] =
            userNotebooks;

          localStorage.setItem(
            NOTEBOOK_STORAGE_KEY,
            JSON.stringify(savedByUser)
          );
        }

        const finalList = [
          "All Notes",
          ...userNotebooks.filter(
            (item) =>
              item !== "All Notes"
          ),
        ];

        setNotebookList([
          ...new Set(finalList),
        ]);
      } catch (error) {
        console.error(
          "Failed to load notebooks:",
          error
        );

        setNotebookList(DEFAULT_NOTEBOOKS);
      }
    };

    loadNotebooks();

    window.addEventListener(
      "storage",
      loadNotebooks
    );

    window.addEventListener(
      "notebooksUpdated",
      loadNotebooks
    );

    return () => {
      window.removeEventListener(
        "storage",
        loadNotebooks
      );

      window.removeEventListener(
        "notebooksUpdated",
        loadNotebooks
      );
    };
  }, [currentUserId]);

  // ===========================================================
  // SAVE NOTES
  // ===========================================================

  const saveNotes = (updatedNotes) => {
    try {
      const savedNotes = JSON.parse(
        localStorage.getItem(
          NOTE_STORAGE_KEY
        ) || "[]"
      );

      const allNotes = Array.isArray(savedNotes)
        ? savedNotes
        : [];

      /*
       * Preserve notes belonging to other users.
       */
      const otherUsersNotes = currentUserId
        ? allNotes.filter(
            (note) =>
              note.userId &&
              note.userId !== currentUserId
          )
        : [];

      /*
       * Make sure every saved note belongs
       * to current user.
       */
      const safeUpdatedNotes =
        currentUserId
          ? updatedNotes.map((note) => ({
              ...note,
              userId:
                note.userId ||
                currentUserId,
            }))
          : updatedNotes;

      const finalNotes = currentUserId
        ? [
            ...otherUsersNotes,
            ...safeUpdatedNotes,
          ]
        : safeUpdatedNotes;

      localStorage.setItem(
        NOTE_STORAGE_KEY,
        JSON.stringify(finalNotes)
      );

      setNotes(safeUpdatedNotes);

      /*
       * Same-tab sync.
       */
      window.dispatchEvent(
        new Event("notesUpdated")
      );
    } catch (error) {
      console.error(
        "Failed to save notes:",
        error
      );
    }
  };

  // ===========================================================
  // TOAST
  // ===========================================================

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

  // ===========================================================
  // CREATE NOTE
  // ===========================================================

  const handleCreateNote = () => {
    if (!currentUserId) {
      showToast(
        "Please login first.",
        "error"
      );
      return;
    }

    const now = new Date().toLocaleString();

    const newNote = {
      id: Date.now(),

      userId: currentUserId,

      title: "Untitled Note",
      content: "",

      notebook: "Personal",
      tag: "Personal",

      pinned: false,
      archived: false,

      createdAt: now,
      updatedAt: now,
    };

    const updatedNotes = [
      newNote,
      ...notes,
    ];

    saveNotes(updatedNotes);

    setSelectedNote(newNote);
    setShowEditor(true);

    showToast(
      "New note created successfully!"
    );
  };

  // ===========================================================
  // EDIT NOTE
  // ===========================================================

  const handleEditNote = (note) => {
    setSelectedNote(note);
    setShowEditor(true);
  };

  // ===========================================================
  // SAVE NOTE
  // ===========================================================

  const handleSaveNote = (updatedNote) => {
    const safeUpdatedNote = {
      ...updatedNote,

      userId:
        updatedNote.userId ||
        currentUserId,
    };

    const updatedNotes = notes.map(
      (note) =>
        note.id === safeUpdatedNote.id
          ? safeUpdatedNote
          : note
    );

    saveNotes(updatedNotes);

    setSelectedNote(safeUpdatedNote);

    showToast(
      "Note updated successfully!"
    );
  };

  // ===========================================================
  // CLOSE EDITOR
  // ===========================================================

  const handleCloseEditor = () => {
    setShowEditor(false);
    setSelectedNote(null);
  };

  // ===========================================================
  // DELETE
  // ===========================================================

  const handleDeleteNote = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this note?"
    );

    if (!confirmed) return;

    const updatedNotes = notes.filter(
      (note) => note.id !== id
    );

    saveNotes(updatedNotes);

    if (selectedNote?.id === id) {
      setSelectedNote(null);
      setShowEditor(false);
    }

    showToast(
      "Note deleted successfully!"
    );
  };

  // ===========================================================
  // PIN
  // ===========================================================

  const handleTogglePin = (id) => {
    const currentNote = notes.find(
      (note) => note.id === id
    );

    const updatedNotes = notes.map(
      (note) =>
        note.id === id
          ? {
              ...note,
              pinned: !note.pinned,
              updatedAt:
                new Date().toLocaleString(),
            }
          : note
    );

    saveNotes(updatedNotes);

    if (currentNote?.pinned) {
      showToast(
        "Note unpinned",
        "info"
      );
    } else {
      showToast(
        "Note pinned successfully!"
      );
    }
  };

  // ===========================================================
  // ARCHIVE
  // ===========================================================

  const handleArchiveNote = (id) => {
    const updatedNotes = notes.map(
      (note) =>
        note.id === id
          ? {
              ...note,
              archived: true,
              updatedAt:
                new Date().toLocaleString(),
            }
          : note
    );

    saveNotes(updatedNotes);

    if (selectedNote?.id === id) {
      setSelectedNote(null);
      setShowEditor(false);
    }

    showToast(
      "Note archived successfully!",
      "info"
    );
  };

  // ===========================================================
  // ACTIVE NOTES
  // ===========================================================

  const activeNotes = useMemo(() => {
    return notes.filter(
      (note) => !note.archived
    );
  }, [notes]);

  // ===========================================================
  // FILTER + SEARCH + SORT
  // ===========================================================

  const filteredNotes = useMemo(() => {
    const query =
      searchTerm
        .trim()
        .toLowerCase();

    const result = activeNotes.filter(
      (note) => {
        const matchesNotebook =
          selectedNotebook ===
            "All Notes" ||
          note.notebook ===
            selectedNotebook;

        const matchesCategory =
          selectedCategory ===
            "All Notes" ||
          note.notebook ===
            selectedCategory ||
          note.tag ===
            selectedCategory;

        /*
         * FIXED HTML REGEX
         */
        const plainContent = (
          note.content || ""
        )
          .replace(/<[^>]*>/g, " ")
          .replace(/&nbsp;/g, " ")
          .replace(/\s+/g, " ")
          .toLowerCase();

        const matchesSearch =
          !query ||
          (note.title || "")
            .toLowerCase()
            .includes(query) ||
          plainContent.includes(query) ||
          (note.notebook || "")
            .toLowerCase()
            .includes(query) ||
          (note.tag || "")
            .toLowerCase()
            .includes(query);

        return (
          matchesNotebook &&
          matchesCategory &&
          matchesSearch
        );
      }
    );

    return result.sort((a, b) => {
      if (sortMode === "pinned") {
        return (
          Number(Boolean(b.pinned)) -
          Number(Boolean(a.pinned))
        );
      }

      if (sortMode === "oldest") {
        return (
          Number(a.id) -
          Number(b.id)
        );
      }

      return (
        Number(b.id) -
        Number(a.id)
      );
    });
  }, [
    activeNotes,
    searchTerm,
    selectedCategory,
    selectedNotebook,
    sortMode,
  ]);

  // ===========================================================
  // COUNTS
  // ===========================================================

  const totalNotes = notes.length;

  const pinnedNotes = notes.filter(
    (note) =>
      note.pinned &&
      !note.archived
  ).length;

  const archivedNotes = notes.filter(
    (note) => note.archived
  ).length;

  // ===========================================================
  // USER
  // ===========================================================

  const userName =
    currentUser?.name || "Renu";

  const userInitial = userName
    .charAt(0)
    .toUpperCase();

  // ===========================================================
  // NOTEBOOK
  // ===========================================================

  const handleNotebookSelect = (
    notebook
  ) => {
    setSelectedNotebook(notebook);
    setSelectedCategory("All Notes");
    setSearchTerm("");
  };

  const handleCategorySelect = (
    category
  ) => {
    setSelectedCategory(category);

    if (
      notebookList.includes(category)
    ) {
      setSelectedNotebook(category);
    } else {
      setSelectedNotebook("All Notes");
    }
  };

  // ===========================================================
  // PREVIEW
  // ===========================================================

  const getPreview = (content) => {
    if (!content) {
      return "No content added yet.";
    }

    /*
     * FIXED HTML REGEX
     */
    const text = content
      .replace(/<[^>]*>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    return (
      text ||
      "No content added yet."
    );
  };

  // ===========================================================
  // CATEGORY COLORS
  // ===========================================================

  const categoryColors = [
    "bg-white",
    "bg-[#ff6542]",
    "bg-[#ff9d00]",
    "bg-[#ffe000]",
    "bg-[#8bd63d]",
    "bg-[#20d5b0]",
    "bg-[#29a9e5]",
    "bg-[#d5d8dc]",
  ];

  // ===========================================================
  // LOGOUT
  // ===========================================================

  const handleLogout = () => {
    localStorage.removeItem(
      "notesKeeperLoggedIn"
    );

    localStorage.removeItem(
      "notesKeeperCurrentUser"
    );

    window.location.href = "/login";
  };

  // ===========================================================
  // RENDER
  // ===========================================================

  return (
    <div className="min-h-screen bg-[#f5f2ff] text-slate-800">

      {/* =====================================================
          PURPLE SIDEBAR
      ===================================================== */}

      <aside className="fixed left-0 top-0 z-50 hidden h-screen w-[245px] overflow-hidden bg-gradient-to-b from-[#281052] via-[#321461] to-[#1d0b3d] text-white shadow-[10px_0_35px_rgba(49,20,92,0.18)] lg:block">

        <div className="flex h-full flex-col px-4 py-6">

          {/* LOGO */}

          <div className="mb-8 flex items-center gap-3 px-2">

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#fdbb25] to-[#ff7043] text-2xl shadow-lg">
              📝
            </div>

            <div>
              <h1 className="text-xl font-extrabold leading-5">
                Notes
                <br />
                Keeper
              </h1>

              <p className="mt-1 text-[8px] font-semibold tracking-[0.2em] text-purple-300">
                SMART WORKSPACE
              </p>
            </div>

          </div>

          {/* WORKSPACE */}

          <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-purple-300">
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
              active
            />

            <SidebarItem
              to="/pinned"
              icon="★"
              label="Pinned"
              badge={pinnedNotes}
            />

            <SidebarItem
              to="/archive"
              icon="▣"
              label="Archive"
              badge={archivedNotes}
            />

          </nav>

          {/* NOTEBOOKS */}

          <div className="mt-7">

            <div className="mb-2 flex items-center justify-between px-3">

              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-purple-300">
                Notebooks
              </p>

              <span className="text-lg text-purple-300">
                +
              </span>

            </div>

            <nav className="space-y-1">

              {notebookList
                .filter(
                  (item) =>
                    item !== "All Notes"
                )
                .map(
                  (notebook, index) => (
                    <button
                      key={notebook}
                      type="button"
                      onClick={() =>
                        handleNotebookSelect(
                          notebook
                        )
                      }
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition ${
                        selectedNotebook ===
                        notebook
                          ? "bg-white/15 text-white"
                          : "text-purple-100 hover:bg-white/10"
                      }`}
                    >

                      <span
                        className={`h-3 w-3 rounded-[4px] ${
                          categoryColors[
                            (index + 1) %
                              categoryColors.length
                          ]
                        }`}
                      />

                      <span className="truncate">
                        {notebook}
                      </span>

                    </button>
                  )
                )}

            </nav>

          </div>

          {/* SMART TOOLS */}

          <div className="mt-7">

            <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-purple-300">
              Smart Tools
            </p>

            <SidebarItem
              to="/ai-assistant"
              icon="✦"
              label="AI Assistant"
              badge="NEW"
            />

            <button
              type="button"
              onClick={() =>
                showToast(
                  "Voice features are available inside Note Editor.",
                  "info"
                )
              }
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-purple-100 transition hover:bg-white/10"
            >
              <span className="w-6 text-center text-lg">
                ♫
              </span>

              <span>
                Voice Notes
              </span>
            </button>

          </div>

          {/* USER */}

          <div className="mt-auto border-t border-white/10 pt-5">

            <div className="flex items-center gap-3 rounded-2xl bg-white/[0.07] p-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-400 to-purple-500 font-bold shadow-lg">
                {userInitial}
              </div>

              <div className="min-w-0 flex-1">

                <p className="truncate text-sm font-bold">
                  {userName}
                </p>

                <p className="truncate text-[10px] text-purple-300">
                  Notes Keeper User
                </p>

              </div>

            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="mt-3 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-purple-200 transition hover:bg-red-500/10 hover:text-red-300"
            >
              <span className="text-lg">
                ⇥
              </span>

              Logout
            </button>

          </div>

        </div>

      </aside>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="min-h-screen lg:ml-[245px]">

        {/* TOP NAVBAR */}

        <header className="sticky top-0 z-40 border-b border-purple-900/20 bg-gradient-to-r from-[#39136c] via-[#5119a2] to-[#3a126e] text-white shadow-lg">

          <div className="flex min-h-[64px] items-center gap-5 overflow-x-auto px-5">

            {/* MOBILE LOGO */}

            <div className="flex shrink-0 items-center gap-2 lg:hidden">

              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#fdbb25] text-lg">
                📝
              </div>

              <span className="font-bold">
                Notes Keeper
              </span>

            </div>

            {/* CATEGORIES */}

            <div className="mx-auto flex items-center gap-6 whitespace-nowrap">

              <TopCategory
                label="All"
                color="bg-white"
                active={
                  selectedCategory ===
                  "All Notes"
                }
                onClick={() =>
                  handleCategorySelect(
                    "All Notes"
                  )
                }
              />

              {notebookList
                .filter(
                  (item) =>
                    item !== "All Notes"
                )
                .map(
                  (notebook, index) => (
                    <TopCategory
                      key={notebook}
                      label={notebook}
                      color={
                        categoryColors[
                          (index + 1) %
                            categoryColors.length
                        ]
                      }
                      active={
                        selectedNotebook ===
                        notebook
                      }
                      onClick={() =>
                        handleNotebookSelect(
                          notebook
                        )
                      }
                    />
                  )
                )}

            </div>

            {/* PROFILE */}

            <div className="hidden shrink-0 items-center gap-3 md:flex">

              <button
                type="button"
                className="relative text-xl text-white/90"
                onClick={() =>
                  showToast(
                    "No new notifications.",
                    "info"
                  )
                }
              >
                ♧

                <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-red-400" />
              </button>

              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-400 to-purple-300 font-bold">
                {userInitial}
              </div>

              <span className="text-sm font-semibold">
                {userName}
              </span>

            </div>

          </div>

        </header>

        {/* CONTENT */}

        <section className="relative min-h-[calc(100vh-64px)] overflow-hidden px-5 py-7 sm:px-7 lg:px-9">

          {/* BACKGROUND GLOW */}

          <div className="pointer-events-none absolute inset-0 overflow-hidden">

            <div className="absolute -left-20 top-0 h-[420px] w-[420px] rounded-full bg-purple-300/35 blur-[100px]" />

            <div className="absolute right-[-100px] top-[10%] h-[450px] w-[450px] rounded-full bg-fuchsia-300/25 blur-[110px]" />

            <div className="absolute bottom-[-150px] left-[35%] h-[400px] w-[400px] rounded-full bg-violet-300/25 blur-[100px]" />

          </div>

          <div className="relative z-10">

            {/* ADD NOTE BAR */}

            <div className="mx-auto mb-7 flex max-w-[740px] items-center gap-2">

              <button
                type="button"
                onClick={handleCreateNote}
                className="flex h-[62px] flex-1 items-center justify-between rounded-xl border border-purple-100 bg-white px-5 text-left shadow-[0_5px_20px_rgba(75,35,130,0.10)] transition hover:shadow-[0_8px_25px_rgba(75,35,130,0.15)]"
              >

                <span className="text-sm text-slate-400">
                  Add a note...
                </span>

                <span className="text-xl text-purple-600">
                  +
                </span>

              </button>

              <button
                type="button"
                onClick={() =>
                  setViewMode(
                    viewMode ===
                      "grid"
                      ? "list"
                      : "grid"
                  )
                }
                className="flex h-[62px] w-[62px] items-center justify-center rounded-xl border border-purple-100 bg-white text-xl text-purple-700 shadow-[0_5px_20px_rgba(75,35,130,0.10)]"
                title="Change view"
              >
                {viewMode === "grid"
                  ? "☷"
                  : "▦"}
              </button>

            </div>

            {/* SEARCH / SORT */}

            <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

              <div className="w-full max-w-[510px]">

                <SearchBar
                  searchTerm={searchTerm}
                  onSearch={setSearchTerm}
                />

              </div>

              <div className="flex items-center gap-3">

                <select
                  value={sortMode}
                  onChange={(e) =>
                    setSortMode(
                      e.target.value
                    )
                  }
                  className="rounded-xl border border-purple-100 bg-white px-4 py-3 text-sm font-semibold text-slate-600 shadow-sm outline-none"
                >

                  <option value="latest">
                    Latest First
                  </option>

                  <option value="oldest">
                    Oldest First
                  </option>

                  <option value="pinned">
                    Pinned First
                  </option>

                </select>

                <button
                  type="button"
                  onClick={
                    handleCreateNote
                  }
                  className="rounded-xl bg-gradient-to-r from-[#6425d5] to-[#812de6] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-purple-300/30 transition hover:-translate-y-0.5"
                >
                  + New Note
                </button>

              </div>

            </div>

            {/* TITLE */}

            <div className="mb-6">

              <h1 className="text-3xl font-black tracking-tight text-[#241452]">

                {selectedNotebook ===
                "All Notes"
                  ? "All Notes"
                  : selectedNotebook}

              </h1>

              <p className="mt-1 text-sm text-slate-500">

                {filteredNotes.length}{" "}

                {filteredNotes.length === 1
                  ? "note"
                  : "notes"}

              </p>

            </div>

            {/* NOTES */}

{isLoading ? (
  <LoadingState />
) : loadError ? (
  <ErrorState
    message={loadError}
    onRetry={() => setReloadKey((value) => value + 1)}
  />
) : filteredNotes.length === 0 ? (
  <EmptyState onCreate={handleCreateNote} />


            ) : viewMode === "grid" ? (

              <div className="columns-1 gap-5 sm:columns-2 lg:columns-3 xl:columns-4">

                {filteredNotes.map(
                  (note, index) => (

                    <div
                      key={note.id}
                      className="mb-5 break-inside-avoid"
                    >

                      <NoteCard
                        note={note}
                        index={index}
                        getPreview={
                          getPreview
                        }
                        searchTerm={searchTerm}
                        onEdit={() =>
                          handleEditNote(
                            note
                          )
                        }
                        onDelete={() =>
                          handleDeleteNote(
                            note.id
                          )
                        }
                        onPin={() =>
                          handleTogglePin(
                            note.id
                          )
                        }
                        onArchive={() =>
                          handleArchiveNote(
                            note.id
                          )
                        }
                        listMode={false}
                      />

                    </div>

                  )
                )}

              </div>

            ) : (

              <div className="space-y-4">

                {filteredNotes.map(
                  (note, index) => (

                    <NoteCard
                      key={note.id}
                      note={note}
                      index={index}
                      getPreview={
                        getPreview
                      }
                      searchTerm={searchTerm}
                      onEdit={() =>
                        handleEditNote(
                          note
                        )
                      }
                      onDelete={() =>
                        handleDeleteNote(
                          note.id
                        )
                      }
                      onPin={() =>
                        handleTogglePin(
                          note.id
                        )
                      }
                      onArchive={() =>
                        handleArchiveNote(
                          note.id
                        )
                      }
                      listMode={true}
                    />

                  )
                )}

              </div>

            )}

            {/* FOOTER */}

            <footer className="py-10 text-center text-xs text-purple-400">
              Notes Keeper • Organize your thoughts beautifully
            </footer>

          </div>

        </section>

      </main>

      {/* NOTE EDITOR */}

      {showEditor &&
        selectedNote && (
          <NoteEditor
            note={selectedNote}
            onSave={handleSaveNote}
            onClose={
              handleCloseEditor
            }
          />
        )}

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
  badge,
}) {
  return (
    <Link
      to={to}
      className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
        active
          ? "bg-gradient-to-r from-[#7132d7] to-[#8740e7] text-white shadow-lg shadow-purple-900/20"
          : "text-purple-100 hover:bg-white/10 hover:text-white"
      }`}
    >

      <span className="flex items-center gap-3">

        <span className="flex w-6 justify-center text-lg">
          {icon}
        </span>

        {label}

      </span>

      {badge !== undefined && (
        <span className="rounded-full bg-white/15 px-2 py-0.5 text-[9px]">
          {badge}
        </span>
      )}

    </Link>
  );
}

// =============================================================
// TOP CATEGORY
// =============================================================

function TopCategory({
  label,
  color,
  active,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex items-center gap-2 py-5 text-sm transition ${
        active
          ? "font-bold text-white"
          : "font-medium text-purple-100 hover:text-white"
      }`}
    >

      <span
        className={`h-5 w-5 rounded-full border border-white/20 ${color}`}
      />

      <span>{label}</span>

      {active && (
        <span className="absolute bottom-0 left-0 right-0 h-[3px] rounded-full bg-white" />
      )}

    </button>
  );
}

// =============================================================
// SEARCH HIGHLIGHT
// =============================================================

function HighlightText({ text, searchTerm }) {
  if (!text) return null;

  const value = String(text);
  const query = String(searchTerm || "").trim();

  if (!query) {
    return <>{value}</>;
  }

  const escapedQuery = query.replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&"
  );

  const parts = value.split(
    new RegExp(`(${escapedQuery})`, "gi")
  );

  return (
    <>
      {parts.map((part, index) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <mark
            key={index}
            className="rounded bg-yellow-300 px-1 font-bold text-slate-900"
          >
            {part}
          </mark>
        ) : (
          <span key={index}>{part}</span>
        )
      )}
    </>
  );
}
// =============================================================
// NOTE CARD
// =============================================================

function NoteCard({
  note,
  index,
  getPreview,
    searchTerm,
  onEdit,
  onDelete,
  onPin,
  onArchive,
  listMode,
}) {
  const themes = [
    {
      bg: "bg-[#ff6543]",
      text: "text-[#4b1b11]",
    },
    {
      bg: "bg-white",
      text: "text-[#433453]",
    },
    {
      bg: "bg-[#39b5e8]",
      text: "text-[#12394c]",
    },
    {
      bg: "bg-[#ffdc00]",
      text: "text-[#554700]",
    },
    {
      bg: "bg-[#ff9e00]",
      text: "text-[#563600]",
    },
    {
      bg: "bg-[#20d7b0]",
      text: "text-[#06493e]",
    },
    {
      bg: "bg-[#9add42]",
      text: "text-[#2e4c0c]",
    },
    {
      bg: "bg-[#c9aaff]",
      text: "text-[#352060]",
    },
    {
      bg: "bg-[#f5a9d0]",
      text: "text-[#5a2444]",
    },
  ];

  const theme =
    themes[index % themes.length];

  return (
    <article
      className={`
        group relative overflow-hidden
        border border-black/5
        shadow-[0_4px_12px_rgba(48,25,80,0.13)]
        transition-all duration-300
        hover:-translate-y-1
        hover:shadow-[0_12px_28px_rgba(48,25,80,0.18)]
        ${theme.bg}
        ${
          listMode
            ? "flex min-h-[150px] rounded-2xl"
            : "rounded-2xl"
        }
      `}
    >

      <div className="w-full p-5">

        {/* TOP */}

        <div className="mb-4 flex items-start justify-between gap-3">

          <div className="flex flex-wrap gap-2">

            {note.notebook && (
              <span className="rounded-full bg-white/65 px-3 py-1 text-[10px] font-bold text-slate-700 backdrop-blur">
                {note.notebook}
              </span>
            )}

            {note.tag && (
              <span className="rounded-full bg-white/50 px-3 py-1 text-[10px] font-bold text-slate-700">
                {note.tag}
              </span>
            )}

          </div>

          <button
            type="button"
            onClick={onPin}
            title={
              note.pinned
                ? "Unpin note"
                : "Pin note"
            }
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/70 text-base shadow-sm transition hover:scale-105 hover:bg-white ${
              note.pinned
                ? "text-red-500"
                : "text-slate-500"
            }`}
          >
            {note.pinned
              ? "📌"
              : "★"}
          </button>

        </div>

        {/* CONTENT */}

        <button
          type="button"
          onClick={onEdit}
          className="w-full text-left"
        >

         <h2
  className={`line-clamp-2 text-xl font-extrabold leading-7 ${theme.text}`}
>
  <HighlightText
    text={note.title || "Untitled Note"}
    searchTerm={searchTerm}
  />
</h2>

          <p
  className={`mt-4 text-[15px] leading-7 ${theme.text}`}
>
  <HighlightText
    text={getPreview(note.content)}
    searchTerm={searchTerm}
  />
</p>

        </button>

        {/* FOOTER */}

        <div className="mt-6 flex items-center justify-between border-t border-black/10 pt-4">

          <span
            className={`max-w-[170px] truncate text-[10px] italic opacity-75 ${theme.text}`}
          >
            {note.updatedAt ||
              "Recently"}
          </span>

          <div className="flex items-center gap-1.5">

            <button
              type="button"
              onClick={onArchive}
              title="Archive"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/65 text-xs text-slate-600 transition hover:bg-white"
            >
              ▾
            </button>

            <button
              type="button"
              onClick={onDelete}
              title="Delete"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/65 text-sm text-red-500 transition hover:bg-white"
            >
              ×
            </button>

          </div>

        </div>

      </div>

    </article>
  );
}

function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mb-4"></div>

      <h3 className="text-lg font-semibold text-slate-700">
        Loading notes...
      </h3>

      <p className="mt-1 text-sm text-slate-500">
        Please wait while your notes are loading.
      </p>
    </div>
  );
}
//---
//Error state
function ErrorState({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-14 h-14 flex items-center justify-center rounded-full bg-red-50 text-red-500 text-2xl mb-4">
        !
      </div>

      <h3 className="text-lg font-semibold text-slate-700">
        Something went wrong
      </h3>

      <p className="mt-2 text-sm text-slate-500 max-w-md">
        {message}
      </p>

      <button
        type="button"
        onClick={onRetry}
        className="mt-5 px-5 py-2.5 rounded-xl bg-purple-600 text-white text-sm font-semibold hover:bg-purple-700 transition"
      >
        Try Again
      </button>
    </div>
  );
}
// =============================================================
// EMPTY STATE
// =============================================================

function EmptyState({ onCreate }) {
  return (
    <div className="mx-auto max-w-[600px] rounded-2xl border border-dashed border-purple-200 bg-white/80 px-6 py-20 text-center shadow-sm backdrop-blur">

      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-purple-100 to-violet-200 text-4xl text-purple-600">
        ✦
      </div>

      <h2 className="mt-5 text-xl font-extrabold text-[#281052]">
        No notes found
      </h2>

      <p className="mt-2 text-sm text-slate-500">
        Create your first note and start organizing your ideas.
      </p>

      <button
        type="button"
        onClick={onCreate}
        className="mt-6 rounded-xl bg-gradient-to-r from-[#6425d5] to-[#812de6] px-6 py-3 text-sm font-bold text-white shadow-lg"
      >
        + Create Note
      </button>

    </div>
  );
}

export default AllNotes;