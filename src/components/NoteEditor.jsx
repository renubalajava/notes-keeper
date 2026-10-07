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

  // COLOUR TAG
  const [tagColor, setTagColor] = useState(
    note?.tagColor || "#8B5CF6"
  );

  // NOTE BACKGROUND COLOR
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
        await onSaveRef.current(
          updatedNote,
          {
            autoSave: true,
          }
        );

        setLastEdited(updatedTime);
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
  // RENDER
  // =======================================================

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#12052b]/75 p-3 backdrop-blur-md sm:p-5">
      <div className="flex max-h-[95vh] w-full max-w-[1200px] flex-col overflow-hidden rounded-[30px] border border-white/40 bg-white shadow-[0_30px_100px_rgba(45,10,90,0.35)]">

        {/* HEADER */}

        <header className="relative overflow-hidden border-b border-violet-100 bg-gradient-to-r from-[#f6f1ff] via-white to-[#fff1fc] px-5 py-4 sm:px-7">

          <div className="absolute -right-16 -top-20 h-48 w-48 rounded-full bg-violet-300/20 blur-3xl" />

          <div className="relative flex items-center justify-between gap-4">

            <div className="flex min-w-0 items-center gap-3">

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-600 text-xl text-white shadow-lg shadow-violet-200">
                ✦
              </div>

              <div className="min-w-0">

                <div className="flex items-center gap-2">

                  <h2 className="truncate text-lg font-extrabold text-slate-900 sm:text-xl">
                    {note
                      ? "Edit Note"
                      : "New Note"}
                  </h2>

                  <span className="hidden rounded-full bg-emerald-100 px-2 py-1 text-[9px] font-bold text-emerald-700 sm:block">
                    AUTO SAVE
                  </span>

                </div>

                <p className="mt-1 text-[10px] text-slate-400 sm:text-xs">
                  Last edited • {lastEdited}
                </p>

              </div>

            </div>

            <button
              type="button"
              onClick={onClose}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-xl font-bold text-slate-400 shadow-sm transition hover:bg-violet-100 hover:text-violet-700"
            >
              ×
            </button>

          </div>

        </header>

        {/* BODY */}

        <div className="grid min-h-0 flex-1 overflow-y-auto lg:grid-cols-[1fr_310px]">

          {/* EDITOR */}

          <section className="min-w-0 p-5 sm:p-7">

            {/* TITLE */}

            <div className="mb-5">

              <label className="mb-2 block text-[10px] font-extrabold uppercase tracking-[0.18em] text-violet-600">
                Note Title
              </label>

              <input
                type="text"
                value={title}
                onChange={(e) =>
                  setTitle(e.target.value)
                }
                placeholder="Give your note a title..."
                className="w-full border-0 bg-transparent px-0 py-2 text-3xl font-extrabold tracking-tight text-slate-900 outline-none placeholder:text-slate-300 sm:text-4xl"
              />

            </div>

            {/* NOTEBOOK + TAG + COLOR */}

            <div className="mb-5 grid gap-3 sm:grid-cols-2">

              {/* NOTEBOOK */}

              <div className="rounded-2xl border border-violet-100 bg-violet-50/60 p-3">

                <label className="mb-1 block text-[9px] font-extrabold uppercase tracking-wider text-violet-500">
                  Notebook
                </label>

                <select
                  value={notebook}
                  onChange={(e) =>
                    setNotebook(e.target.value)
                  }
                  className="w-full bg-transparent text-sm font-bold text-slate-700 outline-none"
                >

                  {!notebooks.includes(
                    notebook
                  ) &&
                    notebook && (
                      <option value={notebook}>
                        📁 {notebook}
                      </option>
                    )}

                  {notebooks.map(
                    (item) => (
                      <option
                        key={item}
                        value={item}
                      >
                        📁 {item}
                      </option>
                    )
                  )}

                </select>

              </div>

              {/* COLOUR TAG */}

              <div className="rounded-2xl border border-fuchsia-100 bg-fuchsia-50/60 p-3">

                <label className="mb-1 block text-[9px] font-extrabold uppercase tracking-wider text-fuchsia-500">
                  Colour Tag
                </label>

                <div className="flex items-center gap-2">

                  <input
                    type="text"
                    value={tag}
                    onChange={(e) =>
                      setTag(e.target.value)
                    }
                    placeholder="e.g. Java, Work"
                    className="min-w-0 flex-1 rounded-xl border border-fuchsia-100 bg-white px-3 py-2 text-sm font-bold text-slate-700 outline-none focus:border-fuchsia-300"
                  />

                  <input
                    type="color"
                    value={tagColor}
                    onChange={(e) =>
                      setTagColor(
                        e.target.value
                      )
                    }
                    title="Choose tag colour"
                    className="h-10 w-10 shrink-0 cursor-pointer rounded-xl border-0 bg-white p-1"
                  />

                </div>

                {/* TAG PREVIEW */}

                <div className="mt-2">

                  {tag.trim() && (
                    <span
                      className="inline-flex items-center rounded-full px-3 py-1 text-[10px] font-extrabold"
                      style={{
                        backgroundColor:
                          `${tagColor}20`,
                        color: tagColor,
                        border:
                          `1px solid ${tagColor}60`,
                      }}
                    >
                      {tag}
                    </span>
                  )}

                </div>

              </div>

              {/* NOTE BACKGROUND COLOR */}

              <div className="rounded-2xl border border-amber-100 bg-amber-50/60 p-3 sm:col-span-2">

                <label className="mb-2 block text-[9px] font-extrabold uppercase tracking-wider text-amber-600">
                  Note Background Color
                </label>

                <div className="flex items-center gap-3">

                  <input
                    type="color"
                    value={noteColor}
                    onChange={(e) =>
                      setNoteColor(
                        e.target.value
                      )
                    }
                    title="Choose note background colour"
                    className="h-10 w-10 cursor-pointer rounded-xl border-0 bg-white p-1"
                  />

                  <div
                    className="flex-1 rounded-xl border px-3 py-2 text-xs font-bold text-slate-600"
                    style={{
                      backgroundColor:
                        noteColor,
                    }}
                  >
                    Note Preview
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setNoteColor("#FFFFFF")
                    }
                    className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-[10px] font-bold text-slate-500 hover:bg-slate-50"
                  >
                    Reset
                  </button>

                </div>

              </div>

            </div>

            {/* EDITOR */}

            <div className="overflow-hidden rounded-[22px] border border-violet-100 bg-white shadow-sm">

              <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/70 px-4 py-3">

                <span className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-slate-400">
                  Note Content
                </span>

                <div className="flex items-center gap-3 text-[10px] text-slate-400">

                  <span>
                    {wordCount} words
                  </span>

                  <span>
                    {characterCount} chars
                  </span>

                </div>

              </div>

              <ReactQuill
                ref={quillRef}
                theme="snow"
                value={content}
                onChange={setContent}
                modules={modules}
                placeholder="Start writing your thoughts..."
                className="note-editor-purple"
              />

            </div>

            {/* QUICK ACTIONS */}

            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">

              {/* VOICE */}

              <button
                type="button"
                onClick={
                  toggleVoiceInput
                }
                disabled={
                  !speechSupported
                }
                className={`rounded-2xl border p-3 text-left transition ${
                  isListening
                    ? "border-red-200 bg-red-50 text-red-600"
                    : "border-violet-100 bg-violet-50 text-violet-700 hover:bg-violet-100"
                } disabled:cursor-not-allowed disabled:opacity-50`}
              >

                <div className="text-lg">
                  {isListening
                    ? "⏹️"
                    : "🎙️"}
                </div>

                <p className="mt-1 text-xs font-extrabold">
                  {isListening
                    ? "Stop Voice"
                    : "Voice Input"}
                </p>

                <p className="mt-0.5 text-[9px] text-slate-400">
                  Speak your note
                </p>

              </button>

              {/* READ */}

              <button
                type="button"
                onClick={
                  handleReadAloud
                }
                className="rounded-2xl border border-indigo-100 bg-indigo-50 p-3 text-left text-indigo-700 transition hover:bg-indigo-100"
              >

                <div className="text-lg">
                  🔊
                </div>

                <p className="mt-1 text-xs font-extrabold">
                  Read Aloud
                </p>

                <p className="mt-0.5 text-[9px] text-slate-400">
                  Listen to note
                </p>

              </button>

              {/* STOP */}

              <button
                type="button"
                onClick={
                  stopSpeaking
                }
                className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-left text-slate-700 transition hover:bg-slate-100"
              >

                <div className="text-lg">
                  🔇
                </div>

                <p className="mt-1 text-xs font-extrabold">
                  Stop Audio
                </p>

                <p className="mt-0.5 text-[9px] text-slate-400">
                  Stop speech
                </p>

              </button>

              {/* SAVE */}

              <button
                type="button"
                onClick={
                  handleSave
                }
                className="rounded-2xl bg-gradient-to-br from-violet-600 to-purple-700 p-3 text-left text-white shadow-lg shadow-violet-200 transition hover:-translate-y-0.5 hover:shadow-xl"
              >

                <div className="text-lg">
                  💾
                </div>

                <p className="mt-1 text-xs font-extrabold">
                  Save Note
                </p>

                <p className="mt-0.5 text-[9px] text-purple-200">
                  Save changes
                </p>

              </button>

            </div>

          </section>

          {/* SMART SIDEBAR */}

          <aside className="border-t border-violet-100 bg-[#faf8ff] p-5 lg:border-l lg:border-t-0 sm:p-6">

            {/* AI */}

            <div className="rounded-[24px] bg-gradient-to-br from-[#35116b] via-[#5b21b6] to-[#86198f] p-5 text-white shadow-xl">

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 text-xl backdrop-blur">
                  ✨
                </div>

                <div>

                  <h3 className="text-base font-extrabold">
                    AI Assistant
                  </h3>

                  <p className="text-[10px] text-purple-200">
                    Smart writing tools
                  </p>

                </div>

              </div>

              <p className="mt-4 text-xs leading-5 text-purple-100">
                Use AI tools to improve,
                summarize and organize
                your note.
              </p>

              <div className="mt-5 space-y-2">

                <AIButton
                  icon="✦"
                  title="Summarize Note"
                  description="Create a quick summary"
                  onClick={() =>
                    handleAIAction(
                      "summarize"
                    )
                  }
                  loading={
                    aiLoading &&
                    activeTool ===
                      "summarize"
                  }
                />

                <AIButton
                  icon="✍️"
                  title="Improve Writing"
                  description="Make your writing clearer"
                  onClick={() =>
                    handleAIAction(
                      "improve"
                    )
                  }
                  loading={
                    aiLoading &&
                    activeTool ===
                      "improve"
                  }
                />

                <AIButton
                  icon="🏷️"
                  title="Generate Tags"
                  description="Find a useful category"
                  onClick={() =>
                    handleAIAction(
                      "tags"
                    )
                  }
                  loading={
                    aiLoading &&
                    activeTool === "tags"
                  }
                />

                <AIButton
                  icon="🪄"
                  title="Generate Title"
                  description="Create a smart title"
                  onClick={() =>
                    handleAIAction(
                      "title"
                    )
                  }
                  loading={
                    aiLoading &&
                    activeTool ===
                      "title"
                  }
                />

              </div>

            </div>

            {/* VOICE */}

            <div className="mt-4 rounded-[24px] border border-violet-100 bg-white p-5 shadow-sm">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-fuchsia-500 to-violet-600 text-lg text-white shadow-md">
                  🎙️
                </div>

                <div>

                  <h3 className="text-sm font-extrabold text-slate-800">
                    Voice & Speech
                  </h3>

                  <p className="text-[10px] text-slate-400">
                    Hands-free note taking
                  </p>

                </div>

              </div>

              <div className="mt-4 rounded-2xl bg-violet-50 p-4">

                <div className="flex items-center justify-between">

                  <span className="text-xs font-bold text-violet-700">
                    Voice Input
                  </span>

                  <span
                    className={`h-2.5 w-2.5 rounded-full ${
                      isListening
                        ? "animate-pulse bg-red-500"
                        : speechSupported
                        ? "bg-emerald-500"
                        : "bg-slate-300"
                    }`}
                  />

                </div>

                <p className="mt-2 text-[10px] leading-5 text-slate-500">
                  {isListening
                    ? "Listening... speak naturally."
                    : speechSupported
                    ? "Microphone is ready."
                    : "Speech recognition unavailable."}
                </p>

                <button
                  type="button"
                  onClick={
                    toggleVoiceInput
                  }
                  disabled={
                    !speechSupported
                  }
                  className={`mt-3 w-full rounded-xl px-4 py-2.5 text-xs font-extrabold transition ${
                    isListening
                      ? "bg-red-500 text-white"
                      : "bg-violet-600 text-white hover:bg-violet-700"
                  } disabled:cursor-not-allowed disabled:opacity-50`}
                >
                  {isListening
                    ? "Stop Listening"
                    : "Start Voice Input"}
                </button>

              </div>

              <button
                type="button"
                onClick={
                  handleReadAloud
                }
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-600 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700"
              >
                🔊 Read My Note Aloud
              </button>

            </div>

            {/* NOTE INFORMATION */}

            <div className="mt-4 rounded-[24px] border border-slate-100 bg-white p-5 shadow-sm">

              <p className="text-[9px] font-extrabold uppercase tracking-[0.18em] text-slate-400">
                Note Information
              </p>

              <div className="mt-4 space-y-3">

                <InfoRow
                  label="Notebook"
                  value={
                    notebook ||
                    "Personal"
                  }
                />

                <div className="flex items-center justify-between gap-3">

                  <span className="text-[10px] font-medium text-slate-400">
                    Tag
                  </span>

                  {tag ? (
                    <span
                      className="max-w-[150px] truncate rounded-full px-2.5 py-1 text-[9px] font-extrabold"
                      style={{
                        backgroundColor:
                          `${tagColor}20`,
                        color: tagColor,
                        border:
                          `1px solid ${tagColor}50`,
                      }}
                    >
                      {tag}
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-slate-700">
                      No Tag
                    </span>
                  )}

                </div>

                <InfoRow
                  label="Background"
                  value={noteColor}
                />

                <InfoRow
                  label="Words"
                  value={wordCount}
                />

                <InfoRow
                  label="Characters"
                  value={
                    characterCount
                  }
                />

              </div>

            </div>

          </aside>

        </div>

        {/* FOOTER */}

        <footer className="flex flex-col-reverse gap-3 border-t border-slate-100 bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7">

          <div className="flex items-center gap-2 text-[10px] text-slate-400">

            <span className="h-2 w-2 rounded-full bg-emerald-500" />

            Changes are automatically saved

          </div>

          <div className="flex justify-end gap-3">

            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-slate-600 transition hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="rounded-xl bg-gradient-to-r from-violet-600 to-purple-700 px-6 py-2.5 text-xs font-extrabold text-white shadow-lg shadow-violet-200 transition hover:-translate-y-0.5 hover:shadow-xl"
            >
              ✓ Save Note
            </button>

          </div>

        </footer>

      </div>
    </div>
  );
}

// =========================================================
// SAFE HTML
// =========================================================

function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// =========================================================
// AI BUTTON
// =========================================================

function AIButton({
  icon,
  title,
  description,
  onClick,
  loading,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className="flex w-full items-center gap-3 rounded-xl bg-white/10 p-3 text-left transition hover:bg-white/20 disabled:opacity-60"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/15 text-sm">
        {loading ? "..." : icon}
      </span>

      <span className="min-w-0 flex-1">

        <span className="block text-xs font-extrabold">
          {loading
            ? "Working..."
            : title}
        </span>

        <span className="mt-0.5 block text-[9px] text-purple-200">
          {description}
        </span>

      </span>

      <span className="text-xs text-purple-200">
        →
      </span>

    </button>
  );
}

// =========================================================
// INFO ROW
// =========================================================

function InfoRow({
  label,
  value,
}) {
  return (
    <div className="flex items-center justify-between gap-3">

      <span className="text-[10px] font-medium text-slate-400">
        {label}
      </span>

      <span className="max-w-[150px] truncate text-[10px] font-bold text-slate-700">
        {value}
      </span>

    </div>
  );
}

export default NoteEditor;