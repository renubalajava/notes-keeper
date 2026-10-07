import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

/* =========================================================
   AI CHAT COMPONENT
   Notes Keeper - Premium Purple AI Assistant
========================================================= */

function AIChat() {
  /* =========================================================
     NOTES
  ========================================================= */

  const [notes, setNotes] = useState([]);

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
      console.error(
        "Unable to read current user:",
        error
      );
      return null;
    }
  });

  const currentUserId =
    currentUser?.id ||
    currentUser?.email ||
    null;

  /* =========================================================
     LOAD CURRENT USER NOTES
  ========================================================= */

  useEffect(() => {
    const loadNotes = () => {
      try {
        const storedNotes = JSON.parse(
          localStorage.getItem("notesKeeperNotes") ||
            "[]"
        );

        const allNotes = Array.isArray(storedNotes)
          ? storedNotes
          : [];

        const userNotes = currentUserId
          ? allNotes.filter(
              (note) =>
                note?.userId === currentUserId
            )
          : [];

        setNotes(userNotes);
      } catch (error) {
        console.error(
          "Unable to load notes:",
          error
        );

        setNotes([]);
      }
    };

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

  /* =========================================================
     CHAT STATE
  ========================================================= */

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "ai",
      text:
        "Hello! I'm Notes Keeper AI ✨\n\nI can help you understand your notes, find information, check your note statistics, and give you useful insights.\n\nWhat would you like to know?",
    },
  ]);

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] =
    useState(false);

  const messagesEndRef = useRef(null);

  /* =========================================================
     VOICE STATE
  ========================================================= */

  const [isListening, setIsListening] =
    useState(false);

  const [speechError, setSpeechError] =
    useState("");

  const [speakingId, setSpeakingId] =
    useState(null);

  const recognitionRef = useRef(null);

  const speechSupported =
    typeof window !== "undefined" &&
    ("SpeechRecognition" in window ||
      "webkitSpeechRecognition" in window);

  const voiceSupported =
    typeof window !== "undefined" &&
    "speechSynthesis" in window;

  /* =========================================================
     QUICK QUESTIONS
  ========================================================= */

  const suggestions = [
    {
      icon: "📊",
      text: "How many notes do I have?",
    },
    {
      icon: "📌",
      text: "Show my pinned notes",
    },
    {
      icon: "📚",
      text: "What notebooks do I have?",
    },
    {
      icon: "✨",
      text: "Give me an overview of my notes",
    },
  ];

  /* =========================================================
     NOTE STATISTICS
  ========================================================= */

  const noteStats = useMemo(() => {
    const total = notes.length;

    const active = notes.filter(
      (note) => note?.archived !== true
    ).length;

    const archived = notes.filter(
      (note) => note?.archived === true
    ).length;

    const pinned = notes.filter(
      (note) => note?.pinned === true
    ).length;

    const notebooks = [
      ...new Set(
        notes
          .map(
            (note) =>
              note?.notebook ||
              note?.category ||
              "Personal"
          )
          .filter(Boolean)
      ),
    ];

    const tags = [
      ...new Set(
        notes
          .map(
            (note) =>
              note?.tag ||
              (Array.isArray(note?.tags)
                ? note.tags[0]
                : note?.tags)
          )
          .filter(Boolean)
      ),
    ];

    return {
      total,
      active,
      archived,
      pinned,
      notebooks,
      tags,
    };
  }, [notes]);

  /* =========================================================
     SCROLL TO BOTTOM
  ========================================================= */

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, isLoading]);

  /* =========================================================
     CLEAR CHAT
  ========================================================= */

  const handleClearChat = () => {
    window.speechSynthesis?.cancel();
    setSpeakingId(null);

    setMessages([
      {
        id: Date.now(),
        sender: "ai",
        text:
          "Chat cleared ✨\n\nI'm ready to help you with your Notes Keeper workspace. What would you like to know?",
      },
    ]);

    setInput("");
    setSpeechError("");
  };

  /* =========================================================
     FIND NOTE TEXT
  ========================================================= */

  const getNoteText = (note) => {
    return [
      note?.title,
      note?.content,
      note?.notebook,
      note?.category,
      note?.tag,
      Array.isArray(note?.tags)
        ? note.tags.join(" ")
        : note?.tags,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
  };

  /* =========================================================
     AI RESPONSE GENERATOR
  ========================================================= */

  const generateResponse = (question) => {
    const query = question
      .trim()
      .toLowerCase();

    if (!query) {
      return "Please type a question and I'll help you. ✨";
    }

    /* TOTAL NOTES */

    if (
      query.includes("how many notes") ||
      query.includes("total notes") ||
      query.includes("number of notes")
    ) {
      return `You currently have ${noteStats.total} note${
        noteStats.total === 1 ? "" : "s"
      } in Notes Keeper. 📝`;
    }

    /* ACTIVE NOTES */

    if (
      query.includes("active notes") ||
      query.includes("unarchived")
    ) {
      return `You have ${noteStats.active} active note${
        noteStats.active === 1 ? "" : "s"
      } and ${noteStats.archived} archived note${
        noteStats.archived === 1 ? "" : "s"
      }. ✨`;
    }

    /* ARCHIVED NOTES */

    if (
      query.includes("archived") ||
      query.includes("archive")
    ) {
      return `You have ${noteStats.archived} archived note${
        noteStats.archived === 1 ? "" : "s"
      }. 📦`;
    }

    /* PINNED NOTES */

    if (
      query.includes("pinned") ||
      query.includes("important notes")
    ) {
      const pinnedNotes = notes.filter(
        (note) => note?.pinned === true
      );

      if (pinnedNotes.length === 0) {
        return "You don't have any pinned notes yet. 📌";
      }

      const titles = pinnedNotes
        .slice(0, 5)
        .map(
          (note, index) =>
            `${index + 1}. ${
              note?.title || "Untitled Note"
            }`
        )
        .join("\n");

      return `You have ${pinnedNotes.length} pinned note${
        pinnedNotes.length === 1 ? "" : "s"
      }:\n\n${titles}`;
    }

    /* NOTEBOOKS */

    if (
      query.includes("notebook") ||
      query.includes("notebooks")
    ) {
      if (noteStats.notebooks.length === 0) {
        return "You don't have any notebooks with notes yet. 📚";
      }

      return `You currently have ${
        noteStats.notebooks.length
      } notebook${
        noteStats.notebooks.length === 1
          ? ""
          : "s"
      }:\n\n${noteStats.notebooks
        .map(
          (name, index) =>
            `${index + 1}. ${name}`
        )
        .join("\n")}`;
    }

    /* TAGS */

    if (
      query.includes("tag") ||
      query.includes("tags")
    ) {
      if (noteStats.tags.length === 0) {
        return "I couldn't find any tags in your notes yet. 🏷️";
      }

      return `Here are the tags I found:\n\n${noteStats.tags
        .slice(0, 12)
        .map(
          (tag, index) =>
            `${index + 1}. ${tag}`
        )
        .join("\n")}`;
    }

    /* SEARCH NOTES */

    const searchWords = query
      .replace(
        /show|find|search|give|me|tell|about|notes|note|what|is|my|the|do|i|have/gi,
        " "
      )
      .split(/\s+/)
      .map((word) => word.trim())
      .filter((word) => word.length > 2);

    if (searchWords.length > 0) {
      const matchingNotes = notes.filter(
        (note) => {
          const noteText =
            getNoteText(note);

          return searchWords.some((word) =>
            noteText.includes(word)
          );
        }
      );

      if (matchingNotes.length > 0) {
        const titles = matchingNotes
          .slice(0, 5)
          .map(
            (note, index) =>
              `${index + 1}. ${
                note?.title ||
                "Untitled Note"
              }`
          )
          .join("\n");

        return `I found ${
          matchingNotes.length
        } matching note${
          matchingNotes.length === 1
            ? ""
            : "s"
        }:\n\n${titles}`;
      }
    }

    /* OVERVIEW */

    if (
      query.includes("overview") ||
      query.includes("summary") ||
      query.includes("statistics") ||
      query.includes("stats")
    ) {
      return `Here's your Notes Keeper overview ✨

📝 Total Notes: ${noteStats.total}
✨ Active Notes: ${noteStats.active}
📌 Pinned Notes: ${noteStats.pinned}
📦 Archived Notes: ${noteStats.archived}
📚 Notebooks: ${noteStats.notebooks.length}

Keep capturing your ideas and stay organized!`;
    }

    /* HELP */

    if (
      query.includes("help") ||
      query.includes("what can you do") ||
      query.includes("capabilities")
    ) {
      return `I can help you with your Notes Keeper workspace. ✨

I can:

• Check your note statistics
• Find notes by keywords
• Show pinned notes
• Tell you about notebooks
• Check archived notes
• Show tags
• Give you a notes overview
• Read AI responses aloud
• Take voice questions 🎤`;
    }

    /* GREETING */

    if (
      query === "hi" ||
      query === "hello" ||
      query === "hey" ||
      query.includes("good morning") ||
      query.includes("good evening")
    ) {
      return `Hello! 👋

I'm your Notes Keeper AI Assistant.

You currently have ${noteStats.total} note${
        noteStats.total === 1 ? "" : "s"
      } in your workspace.

What would you like to explore?`;
    }

    /* DEFAULT */

    return `I can help you explore your Notes Keeper data. ✨

Try asking me:

• "How many notes do I have?"
• "Show my pinned notes"
• "What notebooks do I have?"
• "Give me an overview of my notes"
• "Show my archived notes"

You can also use the quick questions below.`;
  };
    /* =========================================================
     SEND MESSAGE
  ========================================================= */

  const handleSend = async () => {
    const trimmedInput = input.trim();

    if (!trimmedInput || isLoading) {
      return;
    }

    const userMessage = {
      id: Date.now(),
      sender: "user",
      text: trimmedInput,
    };

    setMessages((previous) => [
      ...previous,
      userMessage,
    ]);

    setInput("");
    setIsLoading(true);

    window.setTimeout(() => {
      const response =
        generateResponse(trimmedInput);

      const aiMessage = {
        id: Date.now() + 1,
        sender: "ai",
        text: response,
      };

      setMessages((previous) => [
        ...previous,
        aiMessage,
      ]);

      setIsLoading(false);
    }, 700);
  };

  /* =========================================================
     KEYBOARD HANDLER
  ========================================================= */

  const handleKeyDown = (event) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();
      handleSend();
    }
  };

  /* =========================================================
     QUICK QUESTION
  ========================================================= */

  const handleSuggestion = (text) => {
    setInput(text);

    window.setTimeout(() => {
      const userMessage = {
        id: Date.now(),
        sender: "user",
        text,
      };

      setMessages((previous) => [
        ...previous,
        userMessage,
      ]);

      setIsLoading(true);

      window.setTimeout(() => {
        const response =
          generateResponse(text);

        setMessages((previous) => [
          ...previous,
          {
            id: Date.now() + 1,
            sender: "ai",
            text: response,
          },
        ]);

        setIsLoading(false);
      }, 700);

      setInput("");
    }, 50);
  };

  /* =========================================================
     AI VOICE - TEXT TO SPEECH
  ========================================================= */

  const handleSpeak = (
    messageId,
    text
  ) => {
    if (!voiceSupported) {
      return;
    }

    if (speakingId === messageId) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();

    const utterance =
      new SpeechSynthesisUtterance(text);

    utterance.lang = "en-IN";
    utterance.rate = 0.95;
    utterance.pitch = 1;

    utterance.onstart = () => {
      setSpeakingId(messageId);
    };

    utterance.onend = () => {
      setSpeakingId(null);
    };

    utterance.onerror = () => {
      setSpeakingId(null);
    };

    window.speechSynthesis.speak(
      utterance
    );
  };

  /* =========================================================
     VOICE INPUT - SPEECH TO TEXT
  ========================================================= */

  const handleVoiceInput = () => {
    setSpeechError("");

    if (!speechSupported) {
      setSpeechError(
        "Speech-to-Text is not supported in this browser. Please use Chrome or Edge."
      );
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechError(
        "Speech recognition is not available in this browser."
      );
      return;
    }

    const recognition =
      new SpeechRecognition();

    recognition.lang = "en-IN";
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognitionRef.current =
      recognition;

    recognition.onstart = () => {
      setIsListening(true);
      setSpeechError("");
    };

    recognition.onresult = (event) => {
      let transcript = "";

      for (
        let i = event.resultIndex;
        i < event.results.length;
        i += 1
      ) {
        transcript +=
          event.results[i][0]
            ?.transcript || "";
      }

      setInput(transcript);
    };

    recognition.onerror = (event) => {
      setIsListening(false);

      if (
        event.error === "not-allowed"
      ) {
        setSpeechError(
          "Microphone permission was denied. Please allow microphone access."
        );
      } else if (
        event.error === "no-speech"
      ) {
        setSpeechError(
          "No speech detected. Please try again."
        );
      } else {
        setSpeechError(
          "Voice input could not be started. Please try again."
        );
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      recognitionRef.current = null;
    };

    try {
      recognition.start();
    } catch (error) {
      console.error(
        "Speech recognition error:",
        error
      );

      setIsListening(false);
      recognitionRef.current = null;
    }
  };

  /* =========================================================
     CLEANUP
  ========================================================= */

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
      window.speechSynthesis?.cancel();
    };
  }, []);

  /* =========================================================
     NAVIGATION
  ========================================================= */

  const goTo = (path) => {
    window.location.href = path;
  };
  /* =========================================================
     UI
  ========================================================= */

  return (
    <div className="h-screen overflow-hidden bg-[#f7f4ff] text-[#24144d]">

      {/* BACKGROUND */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-violet-300/20 blur-[100px]" />

        <div className="absolute right-[-120px] top-[15%] h-[420px] w-[420px] rounded-full bg-fuchsia-300/20 blur-[110px]" />

        <div className="absolute bottom-[-150px] left-[35%] h-[380px] w-[380px] rounded-full bg-purple-300/20 blur-[100px]" />
      </div>

      <div className="relative flex h-screen overflow-hidden">

        {/* =====================================================
            SIDEBAR
        ===================================================== */}

        <aside className="hidden h-screen w-[245px] shrink-0 flex-col bg-gradient-to-b from-[#35126d] via-[#442080] to-[#291052] px-4 py-5 text-white lg:flex">

          {/* LOGO */}
          <div className="mb-7 flex items-center gap-3 px-2">

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-400 to-fuchsia-500 text-2xl shadow-lg">
              📝
            </div>

            <div>
              <h1 className="text-lg font-black tracking-tight">
                Notes Keeper
              </h1>

              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-purple-200">
                Smart Workspace
              </p>
            </div>

          </div>

          {/* NAVIGATION */}
          <div className="space-y-1">

            <button
              type="button"
              onClick={() => goTo("/dashboard")}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-purple-100 transition hover:bg-white/10"
            >
              <span>⌂</span>
              Dashboard
            </button>

            <button
              type="button"
              onClick={() => goTo("/notes")}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-purple-100 transition hover:bg-white/10"
            >
              <span>📄</span>
              All Notes
            </button>

            <button
              type="button"
              onClick={() => goTo("/pinned")}
              className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm font-semibold text-purple-100 transition hover:bg-white/10"
            >
              <span className="flex items-center gap-3">
                <span>★</span>
                Pinned
              </span>

              <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px]">
                {noteStats.pinned}
              </span>
            </button>

            <button
              type="button"
              onClick={() => goTo("/archive")}
              className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm font-semibold text-purple-100 transition hover:bg-white/10"
            >
              <span className="flex items-center gap-3">
                <span>▣</span>
                Archived
              </span>

              <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px]">
                {noteStats.archived}
              </span>
            </button>

          </div>

          {/* NOTEBOOKS */}
          <div className="mt-6">

            <div className="mb-2 flex items-center justify-between px-2">

              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-purple-300">
                Notebooks
              </p>

              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/15 text-xs">
                +
              </span>

            </div>

            <div className="space-y-1">

              {[
                ["Personal", "🌸"],
                ["Work", "🔵"],
                ["Study", "🟡"],
                ["Ideas", "🟠"],
              ].map(([name, icon]) => {

                const count = notes.filter(
                  (note) =>
                    (
                      note?.notebook ||
                      note?.category ||
                      "Personal"
                    ) === name
                ).length;

                return (
                  <button
                    key={name}
                    type="button"
                    onClick={() =>
                      goTo(
                        `/notebook/${encodeURIComponent(
                          name
                        )}`
                      )
                    }
                    className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm font-medium text-purple-100 transition hover:bg-white/10"
                  >
                    <span className="flex items-center gap-3">
                      <span>{icon}</span>
                      {name}
                    </span>

                    <span className="text-[10px] text-purple-300">
                      {count}
                    </span>
                  </button>
                );
              })}

            </div>
          </div>

          {/* SMART TOOLS */}
          <div className="mt-6">

            <p className="mb-2 px-2 text-[10px] font-black uppercase tracking-[0.2em] text-purple-300">
              Smart Tools
            </p>

            <button
              type="button"
              className="flex w-full items-center gap-3 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 px-3 py-2.5 text-sm font-bold shadow-lg shadow-purple-950/20"
            >
              <span>✦</span>
              AI Assistant
            </button>

            <button
              type="button"
              className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-purple-100 transition hover:bg-white/10"
            >
              <span>🎤</span>
              Voice Notes
            </button>

          </div>

          {/* USER */}
          <div className="mt-auto rounded-2xl border border-white/10 bg-white/10 p-3 backdrop-blur-md">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-violet-400 to-fuchsia-500 font-black">
                {(
                  currentUser?.name ||
                  "Renu"
                )
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <div className="min-w-0">

                <p className="truncate text-sm font-bold">
                  {currentUser?.name || "Renu"}
                </p>

                <p className="truncate text-[10px] text-purple-200">
                  Notes Keeper User
                </p>

              </div>

            </div>

            <button
              type="button"
              onClick={() => {
                localStorage.removeItem(
                  "notesKeeperLoggedIn"
                );

                localStorage.removeItem(
                  "notesKeeperCurrentUser"
                );

                goTo("/login");
              }}
              className="mt-3 flex w-full items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-xs font-bold text-white transition hover:bg-white/20"
            >
              ⇥
              Log Out
            </button>

          </div>

        </aside>

        {/* =====================================================
            MAIN
        ===================================================== */}

        <main className="min-w-0 flex-1 overflow-hidden">

          {/* TOP BAR */}
          <div className="h-[68px] px-4 py-3 lg:px-6">

            <div className="flex h-full items-center justify-between gap-3 rounded-2xl border border-violet-100 bg-white/90 px-4 shadow-[0_8px_25px_rgba(76,29,149,0.06)] backdrop-blur-xl">

              <div className="flex min-w-0 flex-1 items-center gap-3">

                <span className="text-xl text-violet-500">
                  ⌕
                </span>

                <input
                  type="text"
                  placeholder="Search notes, notebooks, or ideas..."
                  className="min-w-0 flex-1 bg-transparent text-sm font-medium text-slate-700 outline-none placeholder:text-violet-300"
                />

                <span className="hidden rounded-lg bg-violet-50 px-2 py-1 text-[10px] font-bold text-violet-400 sm:block">
                  Ctrl K
                </span>

              </div>

              <div className="flex items-center gap-3">

                <button
                  type="button"
                  className="hidden h-10 w-10 items-center justify-center rounded-xl border border-violet-100 bg-white text-lg text-violet-600 sm:flex"
                >
                  ♧
                </button>

                <div className="flex items-center gap-2">

                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-sm font-black text-white">
                    {(
                      currentUser?.name ||
                      "Renu"
                    )
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <span className="hidden text-sm font-bold text-[#29134f] sm:block">
                    {currentUser?.name || "Renu"}
                  </span>

                  <span className="text-xs text-slate-400">
                    ▾
                  </span>

                </div>

              </div>

            </div>

          </div>

          {/* PAGE */}
          <div className="h-[calc(100vh-68px)] overflow-hidden px-4 pb-4 lg:px-6">

            {/* PAGE HEADER */}
            <section className="mb-3 flex h-[112px] shrink-0 items-center justify-between rounded-[24px] border border-violet-100 bg-white/90 px-6 shadow-[0_10px_35px_rgba(76,29,149,0.07)] backdrop-blur-xl">

              <div className="flex items-center gap-4">

                <div className="relative">

                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 via-purple-600 to-fuchsia-500 text-3xl text-white shadow-lg">
                    ✦
                  </div>

                  <span className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-[3px] border-white bg-emerald-400" />

                </div>

                <div>

                  <p className="text-[9px] font-black uppercase tracking-[0.25em] text-violet-500">
                    Notes Keeper
                  </p>

                  <h1 className="text-3xl font-black tracking-tight text-[#29134f]">
                    AI Assistant
                  </h1>

                  <p className="text-xs font-medium text-slate-500">
                    Your intelligent notes companion
                  </p>

                </div>

              </div>

              <div className="flex items-center gap-2">

                <div className="hidden items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-600 sm:flex">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  AI Online
                </div>

                <button
                  type="button"
                  onClick={handleClearChat}
                  className="rounded-xl border border-violet-100 bg-violet-50 px-4 py-2.5 text-xs font-bold text-violet-700 transition hover:bg-violet-100"
                >
                  Clear Chat
                </button>

              </div>

            </section>

            {/* CONTENT */}
            <div className="grid h-[calc(100%-124px)] min-h-0 gap-3 lg:grid-cols-[300px_minmax(0,1fr)]">

              {/* LEFT PANEL */}
              <aside className="hidden min-h-0 overflow-hidden rounded-[24px] border border-violet-100 bg-white/90 p-4 shadow-[0_10px_35px_rgba(76,29,149,0.07)] lg:block">

                {/* AI PROFILE */}
                <div className="rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50 to-fuchsia-50 p-4">

                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-2xl text-white shadow-lg">
                    ✦
                  </div>

                  <h2 className="text-base font-black text-[#29134f]">
                    Notes Keeper AI
                  </h2>

                  <p className="mt-1 text-[11px] leading-4 text-slate-500">
                    Ask questions about your notes and get quick insights.
                  </p>

                  <div className="mt-3 flex items-center gap-2 text-[11px] font-bold text-emerald-600">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    Ready to help
                  </div>

                </div>

                {/* STATS */}
                <div className="mt-3 grid grid-cols-2 gap-2">

                  <div className="rounded-xl border border-violet-100 bg-white p-3 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-semibold text-slate-500">
                        Total Notes
                      </span>

                      <span className="rounded-lg bg-violet-50 px-2 py-1">
                        📝
                      </span>
                    </div>

                    <p className="mt-1 text-xl font-black text-[#29134f]">
                      {noteStats.total}
                    </p>
                  </div>

                  <div className="rounded-xl border border-violet-100 bg-white p-3 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-semibold text-slate-500">
                        Active Notes
                      </span>

                      <span className="rounded-lg bg-emerald-50 px-2 py-1">
                        ✨
                      </span>
                    </div>

                    <p className="mt-1 text-xl font-black text-[#29134f]">
                      {noteStats.active}
                    </p>
                  </div>

                  <div className="rounded-xl border border-violet-100 bg-white p-3 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-semibold text-slate-500">
                        Pinned Notes
                      </span>

                      <span className="rounded-lg bg-fuchsia-50 px-2 py-1">
                        📌
                      </span>
                    </div>

                    <p className="mt-1 text-xl font-black text-[#29134f]">
                      {noteStats.pinned}
                    </p>
                  </div>

                  <div className="rounded-xl border border-violet-100 bg-white p-3 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-semibold text-slate-500">
                        Archived
                      </span>

                      <span className="rounded-lg bg-emerald-50 px-2 py-1">
                        ▣
                      </span>
                    </div>

                    <p className="mt-1 text-xl font-black text-[#29134f]">
                      {noteStats.archived}
                    </p>
                  </div>

                </div>

                {/* CAPABILITIES */}
                <div className="mt-4 border-t border-violet-100 pt-3">

                  <p className="mb-2 text-[9px] font-black uppercase tracking-[0.2em] text-violet-400">
                    AI Capabilities
                  </p>

                  <div className="grid grid-cols-2 gap-2">

                    <div className="rounded-lg bg-violet-50 px-2.5 py-2 text-[10px] font-semibold text-violet-700">
                      📝 Note insights
                    </div>

                    <div className="rounded-lg bg-purple-50 px-2.5 py-2 text-[10px] font-semibold text-purple-700">
                      📊 Statistics
                    </div>

                    <div className="rounded-lg bg-fuchsia-50 px-2.5 py-2 text-[10px] font-semibold text-fuchsia-700">
                      🎤 Voice input
                    </div>

                    <div className="rounded-lg bg-indigo-50 px-2.5 py-2 text-[10px] font-semibold text-indigo-700">
                      🔊 AI voice
                    </div>

                  </div>

                </div>

              </aside>

              {/* CHAT */}
              <section className="flex min-h-0 flex-col overflow-hidden rounded-[24px] border border-violet-100 bg-white shadow-[0_15px_45px_rgba(76,29,149,0.09)]">

                {/* CHAT HEADER */}
                <div className="flex shrink-0 items-center justify-between border-b border-violet-100 bg-gradient-to-r from-violet-50 via-white to-fuchsia-50 px-5 py-3">

                  <div className="flex items-center gap-3">

                    <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white shadow">

                      ✦

                      <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-white bg-emerald-400" />

                    </div>

                    <div>

                      <h2 className="text-sm font-black text-[#29134f]">
                        Notes Keeper AI
                      </h2>

                      <p className="text-[9px] font-semibold text-emerald-600">
                        ● Online · Ready to assist
                      </p>

                    </div>

                  </div>

                  <div className="rounded-full bg-violet-100 px-3 py-1.5 text-[9px] font-black uppercase tracking-wider text-violet-600">
                    Smart Notes AI
                  </div>

                </div>

                {/* MESSAGES */}
                <div className="min-h-0 flex-1 space-y-4 overflow-y-auto bg-[#fcfaff] p-4 sm:p-5">

                  {messages.map((message) => (

                    <div
                      key={message.id}
                      className={`flex ${
                        message.sender === "user"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >

                      <div
                        className={`flex max-w-[90%] items-end gap-2 ${
                          message.sender === "user"
                            ? "flex-row-reverse"
                            : ""
                        }`}
                      >

                        {/* AVATAR */}
                        <div
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs shadow-sm ${
                            message.sender === "user"
                              ? "border border-violet-100 bg-white text-violet-600"
                              : "bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white"
                          }`}
                        >
                          {message.sender === "user"
                            ? (
                                currentUser?.name ||
                                "Renu"
                              )
                                .charAt(0)
                                .toUpperCase()
                            : "✦"}
                        </div>

                        <div className="flex flex-col gap-1.5">

                          <div
                            className={`rounded-xl px-4 py-3 text-xs leading-5 shadow-sm ${
                              message.sender === "user"
                                ? "rounded-br-md bg-gradient-to-r from-violet-600 to-purple-600 text-white"
                                : "rounded-bl-md border border-violet-100 bg-white text-slate-700"
                            }`}
                          >
                            <p className="whitespace-pre-line">
                              {message.text}
                            </p>
                          </div>

                          {message.sender === "ai" && (
                            <button
                              type="button"
                              onClick={() =>
                                handleSpeak(
                                  message.id,
                                  message.text
                                )
                              }
                              disabled={!voiceSupported}
                              className={`w-fit rounded-lg border px-2.5 py-1 text-[9px] font-bold ${
                                speakingId === message.id
                                  ? "border-rose-200 bg-rose-50 text-rose-600"
                                  : "border-violet-100 bg-violet-50 text-violet-600 hover:bg-violet-100"
                              }`}
                            >
                              🔊{" "}
                              {speakingId === message.id
                                ? "Stop"
                                : "Listen"}
                            </button>
                          )}

                        </div>

                      </div>

                    </div>

                  ))}

                  {/* LOADING */}
                  {isLoading && (
                    <div className="flex justify-start">

                      <div className="flex items-end gap-2">

                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 text-xs text-white">
                          ✦
                        </div>

                        <div className="rounded-xl rounded-bl-md border border-violet-100 bg-white px-4 py-3">

                          <div className="flex gap-1.5">

                            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-violet-400" />

                            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-purple-400 [animation-delay:150ms]" />

                            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-fuchsia-400 [animation-delay:300ms]" />

                          </div>

                        </div>

                      </div>

                    </div>
                  )}

                  <div ref={messagesEndRef} />

                </div>

                {/* QUICK QUESTIONS */}
                <div className="shrink-0 border-t border-violet-100 bg-white px-4 py-2.5">

                  <div className="mb-2 flex items-center justify-between">

                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-violet-500">
                      Quick Questions
                    </p>

                    <span className="text-[9px] font-semibold text-slate-400">
                      Tap to ask
                    </span>

                  </div>

                  <div className="grid grid-cols-2 gap-2 xl:grid-cols-4">

                    {suggestions.map(
                      (suggestion) => (
                        <button
                          key={suggestion.text}
                          type="button"
                          onClick={() =>
                            handleSuggestion(
                              suggestion.text
                            )
                          }
                          disabled={isLoading}
                          className="truncate rounded-lg border border-violet-100 bg-violet-50/60 px-2.5 py-2 text-left text-[9px] font-semibold text-slate-600 transition hover:border-violet-200 hover:bg-violet-100 hover:text-violet-700 disabled:opacity-50"
                        >
                          <span className="mr-1">
                            {suggestion.icon}
                          </span>

                          {suggestion.text}
                        </button>
                      )
                    )}

                  </div>

                </div>

                {/* INPUT */}
                <div className="shrink-0 border-t border-violet-100 bg-white px-4 py-2.5">

                  {speechError && (
                    <div className="mb-2 rounded-lg border border-rose-100 bg-rose-50 px-3 py-2 text-[10px] font-semibold text-rose-600">
                      {speechError}
                    </div>
                  )}

                  <div className="flex items-center gap-2 rounded-xl border border-violet-100 bg-[#faf8ff] p-1.5 focus-within:border-violet-300 focus-within:bg-white focus-within:ring-2 focus-within:ring-violet-100">

                    <span className="px-2 text-sm text-violet-400">
                      📎
                    </span>

                    <textarea
                      value={input}
                      onChange={(event) =>
                        setInput(
                          event.target.value
                        )
                      }
                      onKeyDown={handleKeyDown}
                      rows={1}
                      placeholder={
                        isListening
                          ? "Listening... speak now"
                          : "Ask your AI assistant..."
                      }
                      className="min-h-[38px] max-h-24 flex-1 resize-none bg-transparent px-2 py-2 text-xs font-medium text-slate-700 outline-none placeholder:text-slate-400"
                    />

                    <button
                      type="button"
                      onClick={handleVoiceInput}
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm shadow-sm transition ${
                        isListening
                          ? "animate-pulse bg-gradient-to-r from-rose-500 to-red-500 text-white"
                          : "border border-violet-100 bg-violet-50 text-violet-600 hover:bg-violet-100"
                      }`}
                      aria-label={
                        isListening
                          ? "Stop voice input"
                          : "Start voice input"
                      }
                    >
                      {isListening
                        ? "■"
                        : "🎤"}
                    </button>

                    <button
                      type="button"
                      onClick={handleSend}
                      disabled={
                        !input.trim() ||
                        isLoading
                      }
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-r from-violet-600 to-purple-600 text-sm text-white shadow-md transition hover:-translate-y-0.5 disabled:opacity-30"
                      aria-label="Send message"
                    >
                      ➤
                    </button>

                  </div>

                  <div className="mt-1.5 flex items-center justify-center gap-2 text-[8px] font-semibold text-slate-400">

                    <span>Enter to send</span>

                    <span className="text-violet-400">
                      •
                    </span>

                    <span>Shift + Enter</span>

                    <span className="text-violet-400">
                      •
                    </span>

                    <span>🎤 Voice</span>

                    <span className="text-violet-400">
                      •
                    </span>

                    <span>🔊 AI voice</span>

                  </div>

                </div>

              </section>

            </div>

          </div>

        </main>

      </div>

    </div>
  );
}

export default AIChat;