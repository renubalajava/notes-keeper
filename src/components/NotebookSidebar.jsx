import { useEffect, useState } from "react";

import {
  getNotes,
  updateNote,
} from "../services/api";

// =====================================================
// NOTEBOOK SIDEBAR
// =====================================================

function NotebookSidebar({
  selectedNotebook,
  onSelectNotebook,
}) {
  // =====================================================
  // CURRENT USER
  // =====================================================

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

  // =====================================================
  // DEFAULT NOTEBOOKS
  // =====================================================

  const defaultNotebooks = [
    "All Notes",
    "Personal",
    "Work",
    "Study",
  ];

  const NOTEBOOK_STORAGE_KEY =
    "notesKeeperNotebooksByUser";

  // =====================================================
  // LOAD USER NOTEBOOKS
  // =====================================================

  const getUserNotebooks = () => {
    try {
      const saved = JSON.parse(
        localStorage.getItem(
          NOTEBOOK_STORAGE_KEY
        ) || "{}"
      );

      if (
        currentUserId &&
        Array.isArray(saved[currentUserId]) &&
        saved[currentUserId].length > 0
      ) {
        return saved[currentUserId];
      }

      return defaultNotebooks;
    } catch (error) {
      console.error(
        "Failed to load notebooks:",
        error
      );

      return defaultNotebooks;
    }
  };

  const [notebooks, setNotebooks] =
    useState(getUserNotebooks);

  // =====================================================
  // CREATE NOTEBOOK STATE
  // =====================================================

  const [showCreateModal, setShowCreateModal] =
    useState(false);

  const [newNotebook, setNewNotebook] =
    useState("");

  // =====================================================
  // RENAME STATE
  // =====================================================

  const [editingNotebook, setEditingNotebook] =
    useState(null);

  const [renameValue, setRenameValue] =
    useState("");

  // =====================================================
  // NOTES
  // =====================================================

  const [notes, setNotes] = useState([]);

  const [loadingNotes, setLoadingNotes] =
    useState(false);

  // =====================================================
  // SAVE NOTEBOOKS
  // =====================================================

  useEffect(() => {
    if (!currentUserId) {
      return;
    }

    try {
      const saved = JSON.parse(
        localStorage.getItem(
          NOTEBOOK_STORAGE_KEY
        ) || "{}"
      );

      saved[currentUserId] = notebooks;

      localStorage.setItem(
        NOTEBOOK_STORAGE_KEY,
        JSON.stringify(saved)
      );
    } catch (error) {
      console.error(
        "Failed to save notebooks:",
        error
      );
    }
  }, [notebooks, currentUserId]);

  // =====================================================
  // LOAD NOTES FROM API
  // =====================================================

  const loadNotes = async () => {
    if (!currentUserId) {
      setNotes([]);
      return;
    }

    try {
      setLoadingNotes(true);

      const allNotes = await getNotes();

      const userNotes = Array.isArray(allNotes)
        ? allNotes.filter(
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
    } finally {
      setLoadingNotes(false);
    }
  };

  // =====================================================
  // LOAD NOTES ON MOUNT
  // =====================================================

  useEffect(() => {
    loadNotes();

    const handleStorage = () => {
      loadNotes();
    };

    const handleNotesUpdated = () => {
      loadNotes();
    };

    window.addEventListener(
      "storage",
      handleStorage
    );

    window.addEventListener(
      "notesUpdated",
      handleNotesUpdated
    );

    return () => {
      window.removeEventListener(
        "storage",
        handleStorage
      );

      window.removeEventListener(
        "notesUpdated",
        handleNotesUpdated
      );
    };
  }, [currentUserId]);

  // =====================================================
  // CREATE NOTEBOOK
  // =====================================================

  const handleAddNotebook = (e) => {
    e.preventDefault();

    const name = newNotebook.trim();

    if (!name) {
      return;
    }

    const exists = notebooks.some(
      (notebook) =>
        notebook.toLowerCase() ===
        name.toLowerCase()
    );

    if (exists) {
      alert(
        "A notebook with this name already exists."
      );
      return;
    }

    setNotebooks((prev) => [
      ...prev,
      name,
    ]);

    setNewNotebook("");
    setShowCreateModal(false);

    onSelectNotebook(name);
  };

  // =====================================================
  // RENAME NOTEBOOK
  // =====================================================

  const handleRenameNotebook = async (oldName) => {
    const name = renameValue.trim();

    if (!name) {
      setEditingNotebook(null);
      setRenameValue("");
      return;
    }

    if (name === oldName) {
      setEditingNotebook(null);
      setRenameValue("");
      return;
    }

    const exists = notebooks.some(
      (notebook) =>
        notebook !== oldName &&
        notebook.toLowerCase() ===
          name.toLowerCase()
    );

    if (exists) {
      alert(
        "A notebook with this name already exists."
      );
      return;
    }

    try {
      // ===============================================
      // UPDATE NOTES THROUGH API
      // ===============================================

      const affectedNotes = notes.filter(
        (note) =>
          String(note?.userId) ===
            String(currentUserId) &&
          note?.notebook === oldName
      );

      await Promise.all(
        affectedNotes.map((note) =>
          updateNote(note.id, {
            ...note,
            notebook: name,
            updatedAt: new Date().toISOString(),
          })
        )
      );

      // Update local notes state
      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note?.notebook === oldName
            ? {
                ...note,
                notebook: name,
                updatedAt:
                  new Date().toISOString(),
              }
            : note
        )
      );

      // Update notebook list
      setNotebooks((prev) =>
        prev.map((notebook) =>
          notebook === oldName
            ? name
            : notebook
        )
      );

      if (selectedNotebook === oldName) {
        onSelectNotebook(name);
      }

      window.dispatchEvent(
        new Event("notesUpdated")
      );
    } catch (error) {
      console.error(
        "Failed to rename notebook:",
        error
      );

      alert(
        "Failed to rename notebook. Please try again."
      );

      return;
    }

    setEditingNotebook(null);
    setRenameValue("");
  };

  // =====================================================
  // DELETE NOTEBOOK
  // =====================================================

  const handleDeleteNotebook = async (
    notebookToDelete
  ) => {
    // Default notebooks cannot be deleted
    if (
      defaultNotebooks.includes(
        notebookToDelete
      )
    ) {
      alert(
        "Default notebooks cannot be deleted."
      );
      return;
    }

    const confirmed = window.confirm(
      `Delete "${notebookToDelete}" notebook?`
    );

    if (!confirmed) {
      return;
    }

    try {
      // ===============================================
      // MOVE NOTES TO PERSONAL THROUGH API
      // ===============================================

      const affectedNotes = notes.filter(
        (note) =>
          String(note?.userId) ===
            String(currentUserId) &&
          note?.notebook === notebookToDelete
      );

      await Promise.all(
        affectedNotes.map((note) =>
          updateNote(note.id, {
            ...note,
            notebook: "Personal",
            updatedAt: new Date().toISOString(),
          })
        )
      );

      // Update local notes state
      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note?.notebook === notebookToDelete
            ? {
                ...note,
                notebook: "Personal",
                updatedAt:
                  new Date().toISOString(),
              }
            : note
        )
      );

      // Remove notebook
      setNotebooks((prev) =>
        prev.filter(
          (notebook) =>
            notebook !== notebookToDelete
        )
      );

      if (
        selectedNotebook ===
        notebookToDelete
      ) {
        onSelectNotebook("All Notes");
      }

      window.dispatchEvent(
        new Event("notesUpdated")
      );
    } catch (error) {
      console.error(
        "Failed to update notes:",
        error
      );

      alert(
        "Failed to delete notebook. Please try again."
      );
    }
  };

  // =====================================================
  // NOTE COUNT
  // =====================================================

  const getNotebookCount = (
    notebook
  ) => {
    const activeNotes = notes.filter(
      (note) => !note?.archived
    );

    if (notebook === "All Notes") {
      return activeNotes.length;
    }

    return activeNotes.filter(
      (note) =>
        note?.notebook === notebook
    ).length;
  };

  // =====================================================
  // NOTEBOOK ICON
  // =====================================================

  const getNotebookIcon = (
    notebook
  ) => {
    if (notebook === "All Notes") {
      return "📝";
    }

    if (notebook === "Personal") {
      return "👤";
    }

    if (notebook === "Work") {
      return "💼";
    }

    if (notebook === "Study") {
      return "📚";
    }

    return "📁";
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <>
      <aside
        className="
          w-full shrink-0
          rounded-[26px]
          border border-violet-100
          bg-white
          p-4
          shadow-[0_12px_40px_rgba(91,33,182,0.08)]
          lg:w-64
        "
      >
        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-5 px-1">
          <div className="flex items-center justify-between gap-3">

            <div className="flex items-center gap-3">

              <div
                className="
                  flex h-11 w-11
                  items-center justify-center
                  rounded-2xl
                  bg-gradient-to-br
                  from-violet-600
                  via-purple-600
                  to-fuchsia-500
                  text-lg
                  text-white
                  shadow-lg
                  shadow-violet-200
                "
              >
                📚
              </div>

              <div>
                <h2 className="text-base font-extrabold text-[#24104f]">
                  Notebooks
                </h2>

                <p className="text-[11px] text-slate-400">
                  Your note spaces
                </p>
              </div>

            </div>

            {/* NOTEBOOK + BUTTON */}

            <button
              type="button"
              onClick={() => {
                setNewNotebook("");
                setShowCreateModal(true);
              }}
              className="
                flex h-9 w-9
                items-center justify-center
                rounded-xl
                bg-violet-100
                text-xl
                font-bold
                text-violet-700
                transition
                hover:bg-violet-600
                hover:text-white
                hover:shadow-md
                hover:shadow-violet-200
              "
              title="Create notebook"
              aria-label="Create notebook"
            >
              +
            </button>

          </div>
        </div>

        {/* =================================================
            NOTEBOOK LIST
        ================================================= */}

        <div className="space-y-1.5">

          {notebooks.map((notebook) => {

            const isActive =
              selectedNotebook === notebook;

            const count =
              getNotebookCount(notebook);

            const isEditing =
              editingNotebook === notebook;

            const isDefault =
              defaultNotebooks.includes(
                notebook
              );

            return (
              <div
                key={notebook}
                className={`
                  group relative
                  flex w-full
                  items-center gap-2
                  rounded-2xl
                  px-2 py-1.5
                  transition-all

                  ${
                    isActive
                      ? "bg-gradient-to-r from-violet-100 via-purple-50 to-fuchsia-50 text-violet-700 shadow-sm"
                      : "text-slate-600 hover:bg-violet-50/80 hover:text-violet-700"
                  }
                `}
              >

                {/* NOTEBOOK SELECT */}

                <button
                  type="button"
                  onClick={() => {
                    if (!isEditing) {
                      onSelectNotebook(
                        notebook
                      );
                    }
                  }}
                  className="
                    flex min-w-0
                    flex-1
                    items-center
                    gap-3
                    rounded-xl
                    px-1 py-1
                    text-left
                  "
                >

                  {isActive && (
                    <span
                      className="
                        absolute
                        left-0
                        top-1/2
                        h-7
                        w-1
                        -translate-y-1/2
                        rounded-r-full
                        bg-gradient-to-b
                        from-violet-600
                        to-fuchsia-500
                      "
                    />
                  )}

                  {/* ICON */}

                  <span
                    className={`
                      flex
                      h-9 w-9
                      shrink-0
                      items-center
                      justify-center
                      rounded-xl
                      text-sm

                      ${
                        isActive
                          ? "bg-gradient-to-br from-violet-600 to-purple-600 text-white shadow-md shadow-violet-200"
                          : "bg-slate-100 group-hover:bg-violet-100"
                      }
                    `}
                  >
                    {getNotebookIcon(
                      notebook
                    )}
                  </span>

                  {/* NAME */}

                  {isEditing ? (

                    <input
                      autoFocus
                      type="text"
                      value={renameValue}
                      onChange={(e) =>
                        setRenameValue(
                          e.target.value
                        )
                      }
                      onClick={(e) =>
                        e.stopPropagation()
                      }
                      onKeyDown={(e) => {

                        if (
                          e.key === "Enter"
                        ) {
                          e.preventDefault();

                          handleRenameNotebook(
                            notebook
                          );
                        }

                        if (
                          e.key === "Escape"
                        ) {
                          e.preventDefault();

                          setEditingNotebook(
                            null
                          );

                          setRenameValue(
                            ""
                          );
                        }

                      }}
                      className="
                        min-w-0
                        flex-1
                        rounded-lg
                        border
                        border-violet-300
                        bg-white
                        px-2 py-1
                        text-[12px]
                        font-bold
                        text-slate-700
                        outline-none
                        ring-2
                        ring-violet-100
                      "
                    />

                  ) : (

                    <span
                      className="
                        min-w-0
                        flex-1
                        truncate
                        text-[13px]
                        font-bold
                      "
                    >
                      {notebook}
                    </span>

                  )}

                </button>

                {/* =================================================
                    EDIT / DELETE
                ================================================= */}

                {!isEditing &&
                  !isDefault && (

                    <div
                      className="
                        flex
                        shrink-0
                        items-center
                        gap-1
                        opacity-0
                        transition
                        group-hover:opacity-100
                      "
                    >

                      {/* RENAME */}

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();

                          setEditingNotebook(
                            notebook
                          );

                          setRenameValue(
                            notebook
                          );
                        }}
                        className="
                          rounded-lg
                          px-2 py-1
                          text-xs
                          text-slate-400
                          hover:bg-violet-100
                          hover:text-violet-600
                        "
                        title="Rename notebook"
                      >
                        ✎
                      </button>

                      {/* DELETE */}

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();

                          handleDeleteNotebook(
                            notebook
                          );
                        }}
                        className="
                          rounded-lg
                          px-2 py-1
                          text-xs
                          text-slate-400
                          hover:bg-red-100
                          hover:text-red-600
                        "
                        title="Delete notebook"
                      >
                        🗑️
                      </button>

                    </div>
                  )}

                {/* =================================================
                    SAVE / CANCEL RENAME
                ================================================= */}

                {isEditing && (

                  <div
                    className="
                      flex
                      shrink-0
                      items-center
                      gap-1
                    "
                    onClick={(e) =>
                      e.stopPropagation()
                    }
                  >

                    <button
                      type="button"
                      onClick={() =>
                        handleRenameNotebook(
                          notebook
                        )
                      }
                      className="
                        rounded-lg
                        bg-violet-600
                        px-2 py-1
                        text-[10px]
                        font-bold
                        text-white
                        hover:bg-violet-700
                      "
                      title="Save"
                    >
                      ✓
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setEditingNotebook(
                          null
                        );

                        setRenameValue(
                          ""
                        );
                      }}
                      className="
                        rounded-lg
                        bg-slate-100
                        px-2 py-1
                        text-[10px]
                        font-bold
                        text-slate-500
                        hover:bg-slate-200
                      "
                      title="Cancel"
                    >
                      ×
                    </button>

                  </div>

                )}

                {/* COUNT */}

                {!isEditing && (

                  <span
                    className={`
                      min-w-[26px]
                      rounded-full
                      px-2 py-1
                      text-center
                      text-[10px]
                      font-extrabold

                      ${
                        isActive
                          ? "bg-violet-600 text-white"
                          : "bg-slate-100 text-slate-500 group-hover:bg-violet-100 group-hover:text-violet-700"
                      }
                    `}
                  >
                    {count}
                  </span>

                )}

              </div>
            );
          })}

        </div>
      </aside>

      {/* =====================================================
          CREATE NOTEBOOK MODAL
      ===================================================== */}

      {showCreateModal && (

        <div
          className="
            fixed
            inset-0
            z-[100]
            flex
            items-center
            justify-center
            bg-slate-950/40
            p-4
            backdrop-blur-sm
          "
          onMouseDown={() =>
            setShowCreateModal(false)
          }
        >

          <form
            onSubmit={handleAddNotebook}
            onMouseDown={(e) =>
              e.stopPropagation()
            }
            className="
              w-full
              max-w-md
              rounded-3xl
              border
              border-violet-100
              bg-white
              p-6
              shadow-2xl
            "
          >

            {/* MODAL HEADER */}

            <div
              className="
                mb-5
                flex
                items-start
                justify-between
              "
            >

              <div>

                <h3
                  className="
                    text-xl
                    font-extrabold
                    text-[#24104f]
                  "
                >
                  Create New Notebook
                </h3>

                <p
                  className="
                    mt-1
                    text-sm
                    text-slate-400
                  "
                >
                  Organize your notes
                  into a new space.
                </p>

              </div>

              <button
                type="button"
                onClick={() =>
                  setShowCreateModal(false)
                }
                className="
                  flex
                  h-9 w-9
                  items-center
                  justify-center
                  rounded-xl
                  bg-slate-100
                  text-slate-500
                  hover:bg-slate-200
                "
              >
                ×
              </button>

            </div>

            {/* INPUT LABEL */}

            <label
              className="
                mb-2
                block
                text-xs
                font-extrabold
                uppercase
                tracking-wider
                text-violet-600
              "
            >
              Notebook Name
            </label>

            {/* INPUT */}

            <input
              autoFocus
              type="text"
              value={newNotebook}
              onChange={(e) =>
                setNewNotebook(
                  e.target.value
                )
              }
              placeholder="Example: Java Practice"
              className="
                mb-5
                w-full
                rounded-2xl
                border
                border-slate-200
                bg-slate-50
                px-4 py-3
                text-sm
                font-semibold
                text-slate-700
                outline-none
                focus:border-violet-400
                focus:bg-white
                focus:ring-4
                focus:ring-violet-100
              "
            />

            {/* BUTTONS */}

            <div className="flex gap-3">

              <button
                type="button"
                onClick={() =>
                  setShowCreateModal(false)
                }
                className="
                  flex-1
                  rounded-2xl
                  bg-slate-100
                  px-4 py-3
                  text-sm
                  font-bold
                  text-slate-600
                  hover:bg-slate-200
                "
              >
                Cancel
              </button>

              <button
                type="submit"
                className="
                  flex-1
                  rounded-2xl
                  bg-gradient-to-r
                  from-violet-600
                  to-purple-600
                  px-4 py-3
                  text-sm
                  font-extrabold
                  text-white
                  shadow-lg
                  shadow-violet-200
                  transition
                  hover:-translate-y-0.5
                "
              >
                + Create Notebook
              </button>

            </div>

          </form>

        </div>

      )}
    </>
  );
}

export default NotebookSidebar;