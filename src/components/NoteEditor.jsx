import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

// =========================================================
// NOTE EDITOR
// =========================================================

function NoteEditor({
  note,
  selectedNotebook,
  onSave,
  onClose,
}) {
  // =======================================================
  // CURRENT USER
  // =======================================================

  const [currentUser] = useState(() => {
    try {
      const saved =
        localStorage.getItem("notesKeeperCurrentUser") ||
        localStorage.getItem("notesKeeperUser");

      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const currentUserId =
    currentUser?.id ||
    currentUser?.email ||
    null;

  // =======================================================
  // NOTE STATE
  // =======================================================

  const [title, setTitle] = useState(
    note?.title || ""
  );

  const [content, setContent] = useState(
    note?.content || ""
  );

  const [notebook, setNotebook] = useState(
    note?.notebook ||
      selectedNotebook ||
      "Personal"
  );

  const [tag, setTag] = useState(
    note?.tag || ""
  );

  const [tagColor, setTagColor] = useState(
    note?.tagColor || "#8B5CF6"
  );

  const [noteColor, setNoteColor] = useState(
    note?.noteColor || "#FFFFFF"
  );

  const [lastEdited, setLastEdited] =
    useState(
      note?.updatedAt ||
        new Date().toLocaleString()
    );

  // =======================================================
  // AI STATE
  // =======================================================

  const [activeTool, setActiveTool] =
    useState("none");

  const [aiLoading, setAiLoading] =
    useState(false);

  // =======================================================
  // VOICE STATE
  // =======================================================

  const [isListening, setIsListening] =
    useState(false);

  const [speechSupported, setSpeechSupported] =
    useState(false);

  // =======================================================
  // NOTEBOOK STATE
  // =======================================================

  const [notebooks, setNotebooks] = useState([
    "Personal",
    "Work",
    "Study",
    "Ideas",
    "Projects",
  ]);

  // =======================================================
  // REFS
  // =======================================================

  const recognitionRef = useRef(null);

  const quillRef = useRef(null);

  const skipAutoSaveRef = useRef(true);

  const onSaveRef = useRef(onSave);

  useEffect(() => {
    onSaveRef.current = onSave;
  }, [onSave]);

  // =======================================================
  // LOAD SELECTED NOTE
  // =======================================================

  useEffect(() => {
    skipAutoSaveRef.current = true;

    setTitle(note?.title || "");

    setContent(note?.content || "");

    setNotebook(
      note?.notebook ||
        selectedNotebook ||
        "Personal"
    );

    setTag(note?.tag || "");

    setTagColor(
      note?.tagColor || "#8B5CF6"
    );

    setNoteColor(
      note?.noteColor || "#FFFFFF"
    );

    setLastEdited(
      note?.updatedAt ||
        new Date().toLocaleString()
    );
  }, [note, selectedNotebook]);

  // =======================================================
  // LOAD USER NOTEBOOKS
  // =======================================================

  useEffect(() => {
    const loadNotebooks = () => {
      const defaultNotebooks = [
        "Personal",
        "Work",
        "Study",
        "Ideas",
        "Projects",
      ];

      try {
        if (!currentUserId) {
          setNotebooks(defaultNotebooks);
          return;
        }

        const savedData = JSON.parse(
          localStorage.getItem(
            "notesKeeperNotebooksByUser"
          ) || "{}"
        );

        let list =
          Array.isArray(
            savedData[currentUserId]
          ) &&
          savedData[currentUserId].length
            ? savedData[currentUserId]
            : defaultNotebooks;

        if (
          note?.notebook &&
          !list.includes(note.notebook)
        ) {
          list = [
            ...list,
            note.notebook,
          ];
        }

        if (
          selectedNotebook &&
          selectedNotebook !== "All Notes" &&
          !list.includes(selectedNotebook)
        ) {
          list = [
            ...list,
            selectedNotebook,
          ];
        }

        setNotebooks([
          ...new Set(list),
        ]);
      } catch {
        setNotebooks(defaultNotebooks);
      }
    };

    loadNotebooks();

    const handleNotebookUpdate = () => {
      loadNotebooks();
    };

    window.addEventListener(
      "notebooksUpdated",
      handleNotebookUpdate
    );

    window.addEventListener(
      "storage",
      handleNotebookUpdate
    );

    return () => {
      window.removeEventListener(
        "notebooksUpdated",
        handleNotebookUpdate
      );

      window.removeEventListener(
        "storage",
        handleNotebookUpdate
      );
    };
  }, [
    note,
    selectedNotebook,
    currentUserId,
  ]);

  // =======================================================
  // SPEECH RECOGNITION
  // =======================================================

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechSupported(false);
      return;
    }

    setSpeechSupported(true);

    const recognition =
      new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-IN";

    recognition.onresult = (event) => {
      let finalText = "";

      for (
        let i = event.resultIndex;
        i < event.results.length;
        i++
      ) {
        if (event.results[i].isFinal) {
          finalText +=
            event.results[i][0]
              .transcript + " ";
        }
      }

      const transcript =
        finalText.trim();

      if (!transcript) return;

      try {
        const editor =
          quillRef.current?.getEditor();

        if (editor) {
          const selection =
            editor.getSelection(true);

          const index = selection
            ? selection.index
            : editor.getLength();

          editor.insertText(
            index,
            transcript + " ",
            "user"
          );

          editor.setSelection(
            index +
              transcript.length +
              1,
            0
          );

          setContent(
            editor.root.innerHTML
          );
        } else {
          setContent((previous) => {
            const safeText =
              escapeHtml(transcript);

            return (
              previous +
              `<p>${safeText}</p>`
            );
          });
        }
      } catch {
        setContent((previous) => {
          const safeText =
            escapeHtml(transcript);

          return (
            previous +
            `<p>${safeText}</p>`
          );
        });
      }
    };

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognitionRef.current =
      recognition;

    return () => {
      try {
        recognition.stop();
      } catch {
        // Already stopped
      }

      recognitionRef.current = null;
    };
  }, []);

  // =======================================================
  // AUTO SAVE
  // =======================================================

  useEffect(() => {
    if (!note) return;

    if (skipAutoSaveRef.current) {
      skipAutoSaveRef.current = false;
      return;
    }

    const timer = setTimeout(async () => {
      const updatedTime =
        new Date().toLocaleString();

      const updatedNote = {
        ...note,

        userId:
          note.userId ||
          currentUserId ||
          undefined,

        title:
          title.trim() ||
          "Untitled Note",

        content,

        notebook,

        tag,

        tagColor,

        noteColor,

        updatedAt: updatedTime,
      };

      try {
        // IMPORTANT:
        // Auto-save does NOT close editor.
        await onSaveRef.current(
          updatedNote
        );

        setLastEdited(updatedTime);

        skipAutoSaveRef.current = true;
      } catch (error) {
        console.error(
          "Auto-save failed:",
          error
        );
      }
    }, 1200);

    return () => {
      clearTimeout(timer);
    };
  }, [
    title,
    content,
    notebook,
    tag,
    tagColor,
    noteColor,
    note?.id,
    currentUserId,
  ]);

  // =======================================================
  // MANUAL SAVE
  // =======================================================

  const handleSave = async () => {
    if (!note) return;

    const updatedTime =
      new Date().toLocaleString();

    const updatedNote = {
      ...note,

      userId:
        note.userId ||
        currentUserId ||
        undefined,

      title:
        title.trim() ||
        "Untitled Note",

      content,

      notebook,

      tag,

      tagColor,

      noteColor,

      updatedAt: updatedTime,
    };

    try {
      await onSaveRef.current(
        updatedNote
      );

      setLastEdited(updatedTime);

      skipAutoSaveRef.current = true;

      // MANUAL SAVE → CLOSE
      if (typeof onClose === "function") {
        onClose();
      }
    } catch (error) {
      console.error(
        "Manual save failed:",
        error
      );
    }
  };

  // =======================================================
  // RICH TEXT TOOLBAR
  // =======================================================

  const modules = {
    toolbar: [
      [
        {
          header: [
            1,
            2,
            3,
            false,
          ],
        },
      ],

      [
        "bold",
        "italic",
        "underline",
        "strike",
      ],

      [
        {
          list: "ordered",
        },
        {
          list: "bullet",
        },
      ],

      [
        {
          align: [],
        },
      ],

      [
        "blockquote",
        "link",
      ],

      ["clean"],
    ],
  };

  // =======================================================
  // PLAIN TEXT
  // =======================================================

  const getPlainText = () => {
    return (content || "")
      .replace(/<[^>]*>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\s+/g, " ")
      .trim();
  };

  // =======================================================
  // AI ACTION
  // =======================================================

  const handleAIAction = (action) => {
    if (aiLoading) return;

    setAiLoading(true);
    setActiveTool(action);

    setTimeout(() => {
      const text = getPlainText();

      if (!text) {
        setAiLoading(false);
        setActiveTool("none");
        return;
      }

      // SUMMARIZE
      if (action === "summarize") {
        const words =
          text.split(/\s+/);

        const summary =
          words.length > 35
            ? words
                .slice(0, 35)
                .join(" ") + "..."
            : text;

        setContent(
          `<p><strong>AI Summary</strong></p>
           <p>${escapeHtml(
             summary
           )}</p>`
        );
      }

      // IMPROVE WRITING
      if (action === "improve") {
        const improved = text
          .replace(/\bi\b/g, "I")
          .replace(/\s+/g, " ")
          .trim();

        setContent(
          `<p>${escapeHtml(
            improved
          )}</p>`
        );
      }

      // GENERATE TITLE
      if (action === "title") {
        const words = text
          .split(/\s+/)
          .filter(Boolean)
          .slice(0, 6);

        const generatedTitle =
          words.length
            ? words
                .map(
                  (word) =>
                    word
                      .charAt(0)
                      .toUpperCase() +
                    word.slice(1)
                )
                .join(" ")
            : "My New Note";

        setTitle(generatedTitle);
      }

      // GENERATE TAG
      if (action === "tags") {
        const lower =
          text.toLowerCase();

        if (
          lower.includes("study") ||
          lower.includes("learn")
        ) {
          setTag("Study");
          setTagColor("#10B981");
        } else if (
          lower.includes("work") ||
          lower.includes("project")
        ) {
          setTag("Work");
          setTagColor("#3B82F6");
        } else if (
          lower.includes("idea") ||
          lower.includes("design")
        ) {
          setTag("Ideas");
          setTagColor("#F59E0B");
        } else {
          setTag("General");
          setTagColor("#8B5CF6");
        }
      }

      setAiLoading(false);
      setActiveTool("none");
    }, 700);
  };

  // =======================================================
  // VOICE INPUT
  // =======================================================

  const toggleVoiceInput = () => {
    if (!speechSupported) {
      alert(
        "Voice input is not supported in this browser."
      );
      return;
    }

    const recognition =
      recognitionRef.current;

    if (!recognition) return;

    if (isListening) {
      try {
        recognition.stop();
      } catch {
        // Already stopped
      }

      setIsListening(false);
      setActiveTool("none");
      return;
    }

    try {
      recognition.start();

      setIsListening(true);
      setActiveTool("voice");
    } catch {
      setIsListening(false);

      alert(
        "Voice input could not be started. Please try again."
      );
    }
  };

  // =======================================================
  // TEXT TO SPEECH
  // =======================================================

  const handleReadAloud = () => {
    const text = getPlainText();

    if (!text) {
      alert(
        "There is no content to read."
      );
      return;
    }

    if (
      typeof window === "undefined" ||
      !window.speechSynthesis
    ) {
      alert(
        "Text-to-speech is not supported in this browser."
      );
      return;
    }

    window.speechSynthesis.cancel();

    const speech =
      new SpeechSynthesisUtterance(
        text
      );

    speech.lang = "en-IN";
    speech.rate = 0.95;
    speech.pitch = 1;

    speech.onend = () => {
      setActiveTool("none");
    };

    window.speechSynthesis.speak(
      speech
    );

    setActiveTool("speak");
  };

  // =======================================================
  // STOP SPEAKING
  // =======================================================

  const stopSpeaking = () => {
    if (
      typeof window !== "undefined" &&
      window.speechSynthesis
    ) {
      window.speechSynthesis.cancel();
    }

    setActiveTool("none");
  };

  // =======================================================
  // CLOSE EDITOR
  // =======================================================

  const handleCloseEditor = () => {
    // Stop voice recognition
    try {
      recognitionRef.current?.stop();
    } catch {
      // already stopped
    }

    // Stop text-to-speech
    if (
      typeof window !== "undefined" &&
      window.speechSynthesis
    ) {
      window.speechSynthesis.cancel();
    }

    setIsListening(false);
    setActiveTool("none");

    // Close editor ONLY when
    // X or Cancel/Save calls this.
    if (typeof onClose === "function") {
      onClose();
    }
  };

  // =======================================================
  // CLEANUP
  // =======================================================

  useEffect(() => {
    return () => {
      if (
        typeof window !== "undefined" &&
        window.speechSynthesis
      ) {
        window.speechSynthesis.cancel();
      }

      try {
        recognitionRef.current?.stop();
      } catch {
        // Ignore cleanup error
      }
    };
  }, []);

  // =======================================================
  // COUNTS
  // =======================================================

  const plainText =
    getPlainText();

  const wordCount = plainText
    ? plainText.split(/\s+/).length
    : 0;

  const characterCount =
    plainText.length;
  // =======================================================
  // COLOR OPTIONS
  // =======================================================

  const noteColors = [
    "#FFFFFF",
    "#FEF3C7",
    "#DCFCE7",
    "#DBEAFE",
    "#FCE7F3",
    "#EDE9FE",
    "#F3F4F6",
  ];

  const tagColors = [
    "#8B5CF6",
    "#EC4899",
    "#3B82F6",
    "#10B981",
    "#F59E0B",
    "#EF4444",
    "#06B6D4",
  ];

  // =======================================================
  // RENDER
  // =======================================================

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
    >
      <div
        className="flex max-h-[95vh] w-full max-w-6xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl"
      >
        {/* =================================================
            HEADER
        ================================================= */}

        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-xl">
              📝
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-800">
                {note?.id
                  ? "Edit Note"
                  : "Create Note"}
              </h2>

              <p className="text-xs text-gray-500">
                {lastEdited
                  ? `Last edited: ${lastEdited}`
                  : "Start writing your note"}
              </p>
            </div>
          </div>

          {/* X BUTTON */}
          <button
            type="button"
            onClick={handleCloseEditor}
            className="flex h-9 w-9 items-center justify-center rounded-full text-2xl text-gray-500 transition hover:bg-gray-100 hover:text-gray-800"
          >
            ×
          </button>
        </div>

        {/* =================================================
            MAIN CONTENT
        ================================================= */}

        <div className="flex min-h-0 flex-1 overflow-hidden">
          {/* ===============================================
              LEFT SIDEBAR
          =============================================== */}

          <div className="hidden w-64 shrink-0 overflow-y-auto border-r border-gray-200 bg-gray-50 p-5 md:block">
            {/* NOTEBOOK */}

            <div className="mb-6">
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                Notebook
              </label>

              <select
                value={notebook}
                onChange={(e) =>
                  setNotebook(e.target.value)
                }
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
              >
                {notebooks.map(
                  (item) => (
                    <option
                      key={item}
                      value={item}
                    >
                      {item}
                    </option>
                  )
                )}
              </select>
            </div>

            {/* TAG */}

            <div className="mb-6">
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                Tag
              </label>

              <input
                type="text"
                value={tag}
                onChange={(e) =>
                  setTag(e.target.value)
                }
                placeholder="Add tag..."
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
              />
            </div>

            {/* TAG COLOR */}

            <div className="mb-6">
              <label className="mb-3 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                Tag Color
              </label>

              <div className="flex flex-wrap gap-2">
                {tagColors.map(
                  (color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() =>
                        setTagColor(color)
                      }
                      className={`h-7 w-7 rounded-full border-2 transition ${
                        tagColor === color
                          ? "scale-110 border-gray-800"
                          : "border-white"
                      }`}
                      style={{
                        backgroundColor:
                          color,
                      }}
                    />
                  )
                )}
              </div>
            </div>
{/* NOTE COLOR */}

<div className="mb-6">
  <label className="mb-3 block text-xs font-semibold uppercase tracking-wide text-gray-500">
    Note Color
  </label>

  {/* PRESET + CUSTOM COLOR */}
  <div className="flex flex-wrap gap-2">

    {noteColors.map((color) => (
      <button
        key={color}
        type="button"
        onClick={() => setNoteColor(color)}
        title={color}
        className={`h-8 w-8 rounded-full border-2 transition ${
          noteColor === color
            ? "scale-110 border-violet-600 shadow-md"
            : "border-gray-200 hover:scale-105"
        }`}
        style={{
          backgroundColor: color,
        }}
      />
    ))}

    {/* CUSTOM COLOR PICKER */}
    <label
      title="Choose your own color"
      className={`relative flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-2 border-dashed border-violet-400 bg-white text-lg transition hover:scale-105 ${
        !noteColors.includes(noteColor)
          ? "scale-110 border-violet-600"
          : ""
      }`}
    >
      🎨

      <input
        type="color"
        value={noteColor}
        onChange={(e) =>
          setNoteColor(e.target.value)
        }
        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
      />
    </label>
  </div>

  {/* SELECTED COLOR */}
  <div className="mt-3 flex items-center gap-2">
    <div
      className="h-5 w-5 rounded-full border border-gray-300"
      style={{
        backgroundColor: noteColor,
      }}
    />

    <span className="text-xs text-gray-500">
      Selected: {noteColor}
    </span>
  </div>
</div>

            {/* AI TOOLS */}

            <div>
              <label className="mb-3 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                AI Assistant
              </label>

              <div className="space-y-2">
                <button
                  type="button"
                  disabled={aiLoading}
                  onClick={() =>
                    handleAIAction(
                      "summarize"
                    )
                  }
                  className="flex w-full items-center gap-2 rounded-xl bg-violet-50 px-3 py-2.5 text-left text-sm font-medium text-violet-700 transition hover:bg-violet-100 disabled:opacity-50"
                >
                  ✨ Summarize
                </button>

                <button
                  type="button"
                  disabled={aiLoading}
                  onClick={() =>
                    handleAIAction(
                      "title"
                    )
                  }
                  className="flex w-full items-center gap-2 rounded-xl bg-violet-50 px-3 py-2.5 text-left text-sm font-medium text-violet-700 transition hover:bg-violet-100 disabled:opacity-50"
                >
                  🪄 Generate Title
                </button>

                <button
                  type="button"
                  disabled={aiLoading}
                  onClick={() =>
                    handleAIAction(
                      "tags"
                    )
                  }
                  className="flex w-full items-center gap-2 rounded-xl bg-violet-50 px-3 py-2.5 text-left text-sm font-medium text-violet-700 transition hover:bg-violet-100 disabled:opacity-50"
                >
                  🏷️ Generate Tags
                </button>

                <button
                  type="button"
                  disabled={aiLoading}
                  onClick={() =>
                    handleAIAction(
                      "improve"
                    )
                  }
                  className="flex w-full items-center gap-2 rounded-xl bg-violet-50 px-3 py-2.5 text-left text-sm font-medium text-violet-700 transition hover:bg-violet-100 disabled:opacity-50"
                >
                  ✍️ Improve Writing
                </button>
              </div>
            </div>
          </div>

          {/* ===============================================
              EDITOR AREA
          =============================================== */}

          <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
            <div
              className="flex-1 overflow-y-auto p-6"
              style={{
                backgroundColor:
                  noteColor,
              }}
            >
              {/* TITLE */}

              <input
                type="text"
                value={title}
                onChange={(e) =>
                  setTitle(e.target.value)
                }
                placeholder="Note title..."
                className="mb-5 w-full border-none bg-transparent text-3xl font-bold text-gray-800 outline-none placeholder:text-gray-300"
              />

              {/* MOBILE OPTIONS */}

              <div className="mb-5 grid grid-cols-1 gap-3 md:hidden">
                <select
                  value={notebook}
                  onChange={(e) =>
                    setNotebook(
                      e.target.value
                    )
                  }
                  className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none"
                >
                  {notebooks.map(
                    (item) => (
                      <option
                        key={item}
                        value={item}
                      >
                        {item}
                      </option>
                    )
                  )}
                </select>

                <input
                  type="text"
                  value={tag}
                  onChange={(e) =>
                    setTag(e.target.value)
                  }
                  placeholder="Add tag..."
                  className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none"
                />
              </div>

              {/* TOOLBAR */}

              <div className="mb-4 flex flex-wrap items-center gap-2">
                {/* VOICE INPUT */}

                {speechSupported && (
                  <button
                    type="button"
                    onClick={
                      toggleVoiceInput
                    }
                    className={`rounded-xl px-3 py-2 text-sm font-medium transition ${
                      isListening
                        ? "bg-red-100 text-red-600"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {isListening
                      ? "⏹ Stop Voice"
                      : "🎙️ Voice Input"}
                  </button>
                )}

                {/* READ ALOUD */}

                {activeTool ===
                "speak" ? (
                  <button
                    type="button"
                    onClick={
                      stopSpeaking
                    }
                    className="rounded-xl bg-red-100 px-3 py-2 text-sm font-medium text-red-600"
                  >
                    ⏹ Stop Reading
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={
                      handleReadAloud
                    }
                    className="rounded-xl bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-200"
                  >
                    🔊 Read Aloud
                  </button>
                )}

                {/* AI BUTTONS */}

                <button
                  type="button"
                  disabled={aiLoading}
                  onClick={() =>
                    handleAIAction(
                      "summarize"
                    )
                  }
                  className="rounded-xl bg-violet-100 px-3 py-2 text-sm font-medium text-violet-700 transition hover:bg-violet-200 disabled:opacity-50"
                >
                  ✨ AI
                </button>
              </div>

              {/* REACT QUILL */}

              <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                <ReactQuill
                  ref={quillRef}
                  theme="snow"
                  value={content}
                  onChange={setContent}
                  modules={modules}
                  placeholder="Start writing your note..."
                  className="note-editor-quill"
                />
              </div>

              {/* STATS */}

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-gray-500">
                <div className="flex items-center gap-4">
                  <span>
                    {wordCount} words
                  </span>

                  <span>
                    {characterCount} characters
                  </span>
                </div>

                <div>
                  {lastEdited
                    ? `Last saved: ${lastEdited}`
                    : "Not saved yet"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =================================================
            FOOTER
        ================================================= */}

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 bg-white px-6 py-4">
          <div className="text-xs text-gray-500">
            Auto-save is enabled
          </div>

          <div className="flex items-center gap-3">
            {/* CANCEL */}

            <button
              type="button"
              onClick={handleCloseEditor}
              className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-100"
            >
              Cancel
            </button>

            {/* SAVE */}

            <button
              type="button"
              onClick={handleSave}
              className="rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700"
            >
              ✓ Save Note
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// =========================================================
// HELPER
// =========================================================

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// =========================================================
// EXPORT
// =========================================================

export default NoteEditor;