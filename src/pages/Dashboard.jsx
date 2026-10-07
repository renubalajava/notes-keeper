import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  Bell,
  ChevronDown,
  Home,
  FileText,
  Star,
  Archive,
  Plus,
  Sparkles,
  Mic,
  BookOpen,
  CheckSquare,
  Square,
  ArrowRight,
  MoreVertical,
  LogOut,
  LayoutDashboard,
  X,
  Folder,
  Send,
} from "lucide-react";

function Dashboard() {
  const navigate = useNavigate();

  const [notes, setNotes] = useState([]);
  const [notebooks, setNotebooks] = useState([
    "Personal",
    "Work",
    "Study",
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showProfile, setShowProfile] = useState(false);
  const [focusTasks, setFocusTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [toast, setToast] = useState("");

  const [currentUser, setCurrentUser] = useState({
    name: "Renu",
    role: "Notes Keeper User",
  });
const activeNotebookCount = new Set(
  notes
    .filter((note) => note?.archived !== true)
    .map((note) => note?.notebook)
    .filter(Boolean)
).size;
  /* =========================
     LOAD DATA
  ========================= */
/* =========================
   LOAD DATA
========================= */

useEffect(() => {
  const loadData = () => {
    try {
      // =========================
      // CURRENT USER
      // =========================

      const savedUser = localStorage.getItem(
        "notesKeeperCurrentUser"
      );

      let user = null;

      if (savedUser) {
        try {
          user = JSON.parse(savedUser);
        } catch {
          user = null;
        }
      }

      if (user) {
        setCurrentUser({
          id: user?.id || null,
          email: user?.email || "",
          name:
            user?.name ||
            user?.username ||
            user?.email ||
            "Renu",
          role:
            user?.role === "ADMIN" ||
            user?.role === "admin"
              ? "Administrator"
              : "Notes Keeper User",
        });
      } else {
        setCurrentUser({
          id: null,
          email: "",
          name: "Renu",
          role: "Notes Keeper User",
        });
      }

      // =========================
      // CURRENT USER ID
      // =========================

      const currentUserId =
        user?.id || user?.email || null;

      // =========================
      // LOAD NOTES
      // =========================

      const savedNotes = localStorage.getItem(
        "notesKeeperNotes"
      );

      let allNotes = [];

      try {
        allNotes = savedNotes
          ? JSON.parse(savedNotes)
          : [];
      } catch {
        allNotes = [];
      }

      if (!Array.isArray(allNotes)) {
        allNotes = [];
      }

      /*
       * IMPORTANT:
       *
       * Never assign old notes without userId
       * to the current user.
       *
       * Dashboard must only display notes that
       * already belong to the logged-in user.
       */

      const userNotes = currentUserId
        ? allNotes.filter(
            (note) =>
              String(note?.userId) ===
              String(currentUserId)
          )
        : [];

      setNotes(userNotes);

      // =========================
      // LOAD NOTEBOOKS
      // =========================

      const savedNotebooks =
        localStorage.getItem(
          "notesKeeperNotebooks"
        );

      if (savedNotebooks) {
        try {
          const parsed =
            JSON.parse(savedNotebooks);

          if (
            Array.isArray(parsed) &&
            parsed.length > 0
          ) {
            setNotebooks(parsed);
          }
        } catch {
          setNotebooks([
            "Personal",
            "Work",
            "Study",
          ]);
        }
      }

      // =========================
      // LOAD FOCUS TASKS
      // =========================

      const savedFocus =
        localStorage.getItem(
          "notesKeeperFocus"
        );

      if (savedFocus) {
        try {
          const parsed =
            JSON.parse(savedFocus);

          if (Array.isArray(parsed)) {
            setFocusTasks(parsed);
          }
        } catch {
          setFocusTasks([]);
        }
      }
    } catch (error) {
      console.error(
        "Dashboard data loading failed:",
        error
      );

      setNotes([]);
    }
  };

  loadData();

  // Same-tab updates
  window.addEventListener(
    "notesUpdated",
    loadData
  );

  window.addEventListener(
    "notebooksUpdated",
    loadData
  );

  // Cross-tab updates
  window.addEventListener(
    "storage",
    loadData
  );

  return () => {
    window.removeEventListener(
      "notesUpdated",
      loadData
    );

    window.removeEventListener(
      "notebooksUpdated",
      loadData
    );

    window.removeEventListener(
      "storage",
      loadData
    );
  };
}, []);
  /* =========================
     TOAST
  ========================= */

  const showToast = (message) => {
    setToast(message);

    setTimeout(() => {
      setToast("");
    }, 2200);
  };

  /* =========================
     COUNTS
  ========================= */

  const totalNotes = notes.filter(
  (note) => note?.archived !== true
).length;

  const pinnedNotes = notes.filter(
  (note) => note?.pinned === true
).length;

  const archivedNotes = notes.filter(
    (note) => note?.archived === true
  ).length;

  const notebookStats = useMemo(() => {
  return notebooks.map((name) => ({
    name,
    count: notes.filter(
      (note) =>
        note?.notebook === name &&
        note?.archived !== true
    ).length,
  }));
}, [notes, notebooks]);

  const recentNotes = useMemo(() => {
    return notes
      .filter((note) => note?.archived !== true)
      .sort(
        (a, b) =>
          new Date(
            b?.updatedAt || b?.createdAt || 0
          ) -
          new Date(
            a?.updatedAt || a?.createdAt || 0
          )
      )
      .slice(0, 4);
  }, [notes]);

  /* =========================
     SEARCH
  ========================= */

  const handleSearch = (e) => {
    e.preventDefault();

    const value = searchTerm.trim();

    if (!value) {
      navigate("/notes");
      return;
    }

    navigate(
      `/notes?search=${encodeURIComponent(value)}`
    );
  };

  /* =========================
     FOCUS TASKS
  ========================= */

  const saveTasks = (tasks) => {
    setFocusTasks(tasks);

    localStorage.setItem(
      "notesKeeperFocus",
      JSON.stringify(tasks)
    );
  };

  const addTask = () => {
    const value = newTask.trim();

    if (!value) return;

    saveTasks([
      ...focusTasks,
      {
        id: Date.now(),
        text: value,
        completed: false,
      },
    ]);

    setNewTask("");
  };

  const toggleTask = (id) => {
    saveTasks(
      focusTasks.map((task) =>
        task.id === id
          ? {
              ...task,
              completed: !task.completed,
            }
          : task
      )
    );
  };

  const deleteTask = (id) => {
    saveTasks(
      focusTasks.filter((task) => task.id !== id)
    );
  };

  /* =========================
     CREATE NOTE
  ========================= */

  const handleCreateNote = () => {
  const currentUserId =
    currentUser?.id ||
    currentUser?.email ||
    null;

  if (!currentUserId) {
    navigate("/login");
    return;
  }

  const now = new Date().toISOString();

  const note = {
    id: Date.now(),

    // IMPORTANT: owner of this note
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

  try {
    const savedNotes =
      localStorage.getItem("notesKeeperNotes");

    let allNotes = [];

    try {
      allNotes = savedNotes
        ? JSON.parse(savedNotes)
        : [];
    } catch {
      allNotes = [];
    }

    if (!Array.isArray(allNotes)) {
      allNotes = [];
    }

    // Preserve every user's notes
    const updated = [note, ...allNotes];

    localStorage.setItem(
      "notesKeeperNotes",
      JSON.stringify(updated)
    );

    // Dashboard shows only current user's notes
    setNotes((previousNotes) => [
      note,
      ...previousNotes,
    ]);

    window.dispatchEvent(
      new Event("notesUpdated")
    );

    navigate("/notes");
  } catch (error) {
    console.error(
      "Failed to create note:",
      error
    );
  }
};

   
  /* =========================
     LOGOUT
  ========================= */

  const handleLogout = () => {
    localStorage.removeItem("notesKeeperLoggedIn");
    localStorage.removeItem("notesKeeperCurrentUser");

    navigate("/login");
  };

  const initial =
    currentUser?.name?.charAt(0)?.toUpperCase() || "R";

  const formatDate = (date) => {
    if (!date) return "";

    try {
      return new Date(date).toLocaleDateString(
        "en-US",
        {
          month: "short",
          day: "numeric",
        }
      );
    } catch {
      return "";
    }
  };

  return (
    <div className="h-screen overflow-hidden bg-[#f7f5ff] text-[#21163d]">

      {/* =========================
          SIDEBAR
      ========================= */}

      <aside
        className="
          fixed
          left-0
          top-0
          z-50
          hidden
          h-screen
          w-[260px]
          overflow-hidden
          bg-gradient-to-b
          from-[#29105d]
          via-[#351576]
          to-[#1f0d48]
          text-white
          shadow-[10px_0_35px_rgba(48,20,100,.16)]
          lg:block
        "
      >
        <div className="flex h-full flex-col px-4 py-5">

          {/* LOGO */}

          <div className="mb-6 flex items-center gap-3 px-2">

            <div
              className="
                flex
                h-14
                w-14
                shrink-0
                items-center
                justify-center
                rounded-2xl
                bg-gradient-to-br
                from-[#ffb7e8]
                to-[#b34dff]
                text-2xl
                shadow-lg
              "
            >
              📝
            </div>

            <div>
              <h1 className="text-[22px] font-black leading-5">
                Notes Keeper
              </h1>

              <p className="mt-2 text-[9px] font-bold tracking-[.2em] text-purple-300">
                SMART WORKSPACE
              </p>
            </div>
          </div>

          <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[.18em] text-purple-300">
            Workspace
          </p>

          <nav className="space-y-1">

            <SidebarItem
              to="/dashboard"
              icon={<Home size={19} />}
              label="Dashboard"
              active
            />

            <SidebarItem
              to="/notes"
              icon={<FileText size={19} />}
              label="All Notes"
            />

            <SidebarItem
              to="/pinned"
              icon={<Star size={19} />}
              label="Pinned"
              badge={pinnedNotes}
            />

            <SidebarItem
              to="/archive"
              icon={<Archive size={19} />}
              label="Archived"
              badge={archivedNotes}
            />
          </nav>

          {/* NOTEBOOKS */}

          <div className="mt-5">

            <div className="mb-2 flex items-center justify-between px-3">

              <p className="text-[10px] font-bold uppercase tracking-[.18em] text-purple-300">
                Notebooks
              </p>

              <button
                type="button"
                onClick={() => navigate("/notes")}
                className="text-purple-300 hover:text-white"
              >
                <Plus size={16} />
              </button>
            </div>

            <div className="space-y-1">

              {notebooks.slice(0, 4).map(
                (notebook, index) => {

                  const count =
                    notebookStats.find(
                      (item) =>
                        item.name === notebook
                    )?.count || 0;

                  const colors = [
                    "bg-pink-400",
                    "bg-blue-500",
                    "bg-violet-500",
                    "bg-emerald-500",
                  ];

                  return (
                    <button
                      key={notebook}
                      type="button"
                      onClick={() =>
                        navigate(
                          `/notebook/${encodeURIComponent(
                            notebook
                          )}`
                        )
                      }
                      className="
                        flex
                        w-full
                        items-center
                        gap-3
                        rounded-xl
                        px-3
                        py-2
                        text-left
                        text-sm
                        transition
                        hover:bg-white/10
                      "
                    >
                      <span
                        className={`h-2.5 w-2.5 rounded-full ${
                          colors[index % colors.length]
                        }`}
                      />

                      <span className="flex-1 truncate">
                        {notebook}
                      </span>

                      <span className="text-xs text-purple-300">
                        {count}
                      </span>
                    </button>
                  );
                }
              )}
            </div>
          </div>

          {/* SMART TOOLS */}

          <div className="mt-5">

            <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[.18em] text-purple-300">
              Smart Tools
            </p>

            <SidebarItem
              to="/ai-assistant"
              icon={<Sparkles size={19} />}
              label="AI Assistant"
              badgeText="NEW"
            />

            <button
              type="button"
              onClick={() =>
                showToast(
                  "Voice Note is available inside Note Editor."
                )
              }
              className="
                flex
                w-full
                items-center
                gap-3
                rounded-xl
                px-3
                py-2
                text-sm
                text-white/85
                transition
                hover:bg-white/10
              "
            >
              <Mic size={19} />
              Voice Notes
            </button>
          </div>

          <div className="flex-1" />

          {/* USER */}

          <div
            className="
              rounded-2xl
              border
              border-white/10
              bg-white/10
              p-3
            "
          >
            <div className="flex items-center gap-3">

              <div
                className="
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-gradient-to-br
                  from-fuchsia-500
                  to-violet-600
                  font-bold
                "
              >
                {initial}
              </div>

              <div className="min-w-0">

                <p className="truncate text-sm font-bold">
                  {currentUser.name}
                </p>

                <p className="text-[11px] text-purple-300">
                  {currentUser.role}
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="
              mt-2
              flex
              w-full
              items-center
              gap-3
              rounded-xl
              px-3
              py-2
              text-sm
              text-white/80
              transition
              hover:bg-white/10
            "
          >
            <LogOut size={18} />
            Log Out
          </button>
        </div>
      </aside>

      {/* =========================
          MAIN
      ========================= */}

      <main className="h-screen overflow-hidden lg:ml-[260px]">

        {/* HEADER */}

        <header className="h-[72px] px-5 pt-3 lg:px-7">

          <div
            className="
              flex
              h-[56px]
              items-center
              justify-between
              rounded-[22px]
              border
              border-violet-100
              bg-white/90
              px-4
              shadow-[0_5px_25px_rgba(82,42,140,.07)]
              backdrop-blur
            "
          >

            <form
              onSubmit={handleSearch}
              className="
                flex
                h-11
                w-[55%]
                max-w-[660px]
                items-center
                rounded-full
                border
                border-violet-100
                bg-[#faf8ff]
                px-4
              "
            >
              <Search
                size={20}
                className="text-violet-500"
              />

              <input
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(e.target.value)
                }
                placeholder="Search notes, notebooks, or ideas..."
                className="
                  ml-3
                  w-full
                  bg-transparent
                  text-sm
                  outline-none
                  placeholder:text-slate-400
                "
              />

              <span className="hidden rounded-full bg-violet-100 px-3 py-1 text-[10px] font-bold text-violet-600 md:block">
                Ctrl K
              </span>
            </form>

            <div className="flex items-center gap-3">

              <button
                type="button"
                className="
                  relative
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-violet-100
                  bg-white
                "
              >
                <Bell size={18} />

                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-pink-500" />
              </button>

              <div className="h-7 w-px bg-violet-100" />

              <button
                type="button"
                onClick={() =>
                  setShowProfile(!showProfile)
                }
                className="
                  flex
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-violet-100
                  bg-white
                  px-2
                  py-1.5
                  pr-3
                "
              >
                <span
                  className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-full
                    bg-gradient-to-br
                    from-violet-500
                    to-fuchsia-500
                    font-bold
                    text-white
                  "
                >
                  {initial}
                </span>

                <span className="hidden text-sm font-bold md:block">
                  {currentUser.name}
                </span>

                <ChevronDown size={15} />
              </button>

              {showProfile && (
                <div
                  className="
                    absolute
                    right-7
                    top-[68px]
                    z-50
                    w-48
                    rounded-2xl
                    border
                    border-violet-100
                    bg-white
                    p-2
                    shadow-xl
                  "
                >
                  <Link
                    to="/dashboard"
                    className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm hover:bg-violet-50"
                  >
                    <Home size={15} />
                    Dashboard
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-red-500 hover:bg-red-50"
                  >
                    <LogOut size={15} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* CONTENT */}

        <section
          className="
            h-[calc(100vh-72px)]
            overflow-hidden
            px-5
            pb-4
            pt-2
            lg:px-7
          "
        >

          {/* HERO */}

          <div
            className="
              relative
              mb-3
              h-[255px]
              overflow-hidden
              rounded-[28px]
              border
              border-violet-100
              bg-gradient-to-r
              from-[#f1e7ff]
              via-[#eadcff]
              to-[#dfceff]
              shadow-[0_15px_40px_rgba(89,42,150,.12)]
            "
          >

            <div
              className="
                relative
                z-20
                flex
                h-full
                w-[58%]
                flex-col
                justify-center
                px-8
                xl:px-10
              "
            >

              <div
                className="
                  mb-3
                  w-fit
                  rounded-full
                  border
                  border-violet-200
                  bg-white/70
                  px-4
                  py-1.5
                  text-xs
                  font-bold
                  text-violet-800
                "
              >
                Good Morning, {currentUser.name} ☀️
              </div>

              <h1
                className="
                  text-[42px]
                  font-black
                  leading-[.98]
                  tracking-tight
                  text-[#241044]
                  xl:text-[46px]
                "
              >
                Welcome to
                <br />

                <span
                  className="
                    bg-gradient-to-r
                    from-[#6324e9]
                    via-[#8127ef]
                    to-[#d02ee8]
                    bg-clip-text
                    text-transparent
                  "
                >
                  Notes Keeper
                </span>
              </h1>

              <p className="mt-3 max-w-[470px] text-[14px] leading-6 text-[#44336b]">
                Capture ideas, organize your thoughts,
                and make meaningful progress every day.
              </p>

              <div className="mt-4 flex gap-3">

                <button
                  type="button"
                  onClick={handleCreateNote}
                  className="
                    flex
                    h-11
                    items-center
                    gap-2
                    rounded-full
                    bg-gradient-to-r
                    from-violet-600
                    to-fuchsia-500
                    px-6
                    text-sm
                    font-bold
                    text-white
                    shadow-lg
                  "
                >
                  <Plus size={18} />
                  Create Note
                </button>

                <Link
                  to="/ai-assistant"
                  className="
                    flex
                    h-11
                    items-center
                    gap-2
                    rounded-full
                    border
                    border-violet-200
                    bg-white/90
                    px-6
                    text-sm
                    font-bold
                    text-violet-700
                  "
                >
                  <Sparkles size={17} />
                  Explore AI
                </Link>
              </div>
            </div>

            {/* GIRL */}

            <div
              className="
                absolute
                bottom-0
                right-[5%]
                h-full
                w-[49%]
              "
            >
              <img
                src="/public/dashboard-girl.png"
                alt="Notes Keeper workspace"
                className="
                  absolute
                  bottom-0
                  right-0
                  h-[108%]
                  w-full
                  object-contain
                  object-bottom
                  drop-shadow-[0_18px_22px_rgba(67,35,115,.20)]
                "
              />
            </div>

            {/* QUOTE */}

            <div
              className="
                absolute
                right-5
                top-6
                z-30
                w-[175px]
                rounded-2xl
                border
                border-white/80
                bg-white/75
                p-3
                shadow-lg
                backdrop-blur
              "
            >
              <p className="text-[9px] font-black uppercase tracking-[.15em] text-violet-600">
                Daily Thought
              </p>

              <p className="mt-1.5 text-xs font-bold leading-5 text-[#261641]">
                “Your ideas deserve a beautiful home.”
              </p>
            </div>
          </div>

          {/* STATS */}

          <div className="mb-3 grid grid-cols-4 gap-3">

            <StatCard
              icon={<FileText size={21} />}
              title="Total Notes"
              value={totalNotes}
              text="All your notes"
              type="purple"
            />

            <StatCard
              icon={<Star size={21} />}
              title="Pinned Notes"
              value={pinnedNotes}
              text="Important notes"
              type="pink"
            />

            <StatCard
              icon={<BookOpen size={21} />}
              title="Notebooks"
                value={activeNotebookCount}
              text="Collections"
              type="blue"
            />

            <StatCard
              icon={<Archive size={21} />}
              title="Archived"
              value={archivedNotes}
              text="Safely stored"
              type="orange"
            />
          </div>

          {/* MIDDLE */}

          <div className="mb-3 grid h-[205px] grid-cols-[1.25fr_1fr_1fr] gap-3">

            {/* RECENT NOTES */}

            <Panel>

              <PanelHeader
                icon={<FileText size={18} />}
                title="Recent Notes"
                link="/notes"
              />

              <div className="mt-2 space-y-1">

                {recentNotes.length === 0 ? (
                  <EmptyState
                    icon={<FileText size={22} />}
                    text="No notes yet"
                  />
                ) : (
                  recentNotes.map((note, index) => (
                    <div
                      key={note.id || index}
                      className="
                        flex
                        items-center
                        gap-3
                        rounded-xl
                        px-2
                        py-2
                        hover:bg-violet-50
                      "
                    >
                      <div
                        className={`
                          flex
                          h-9
                          w-9
                          shrink-0
                          items-center
                          justify-center
                          rounded-xl
                          ${
                            index % 4 === 0
                              ? "bg-amber-100 text-amber-600"
                              : index % 4 === 1
                              ? "bg-violet-100 text-violet-600"
                              : index % 4 === 2
                              ? "bg-pink-100 text-pink-600"
                              : "bg-blue-100 text-blue-600"
                          }
                        `}
                      >
                        <FileText size={16} />
                      </div>

                      <Link
                        to="/notes"
                        className="min-w-0 flex-1"
                      >
                        <p className="truncate text-xs font-bold">
                          {note.title ||
                            "Untitled Note"}
                        </p>

                        <p className="truncate text-[10px] text-slate-400">
                          {note.content
  ? note.content
      .replace(/<[^>]*>/g, "")
      .replace(/&nbsp;/g, " ")
      .slice(0, 45)
  : "No content"}
                        </p>
                      </Link>

                      <span className="hidden text-[9px] text-slate-400 xl:block">
                        {formatDate(
                          note.updatedAt ||
                            note.createdAt
                        )}
                      </span>

                      <MoreVertical
                        size={14}
                        className="text-violet-400"
                      />
                    </div>
                  ))
                )}
              </div>
            </Panel>

            {/* FOCUS */}

            <Panel>

              <PanelHeader
                icon={<CheckSquare size={18} />}
                title="Today's Focus"
              />

              <div className="mt-1">

                <div className="space-y-1">

                  {focusTasks
                    .slice(0, 3)
                    .map((task) => (
                      <div
                        key={task.id}
                        className="flex items-center gap-2 border-b border-violet-50 py-1.5"
                      >
                        <button
                          type="button"
                          onClick={() =>
                            toggleTask(task.id)
                          }
                          className={
                            task.completed
                              ? "text-violet-600"
                              : "text-slate-300"
                          }
                        >
                          {task.completed ? (
                            <CheckSquare size={17} />
                          ) : (
                            <Square size={17} />
                          )}
                        </button>

                        <span
                          className={`min-w-0 flex-1 truncate text-[11px] ${
                            task.completed
                              ? "text-slate-400 line-through"
                              : "text-slate-700"
                          }`}
                        >
                          {task.text}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            deleteTask(task.id)
                          }
                          className="text-slate-300 hover:text-red-500"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}

                  {focusTasks.length === 0 && (
                    <p className="py-3 text-center text-[11px] text-slate-400">
                      Add your focus task
                    </p>
                  )}
                </div>

                <div className="mt-2 flex gap-2">

                  <input
                    value={newTask}
                    onChange={(e) =>
                      setNewTask(e.target.value)
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        addTask();
                      }
                    }}
                    placeholder="Add task..."
                    className="
                      h-8
                      min-w-0
                      flex-1
                      rounded-full
                      border
                      border-violet-100
                      bg-[#faf8ff]
                      px-3
                      text-[11px]
                      outline-none
                    "
                  />

                  <button
                    type="button"
                    onClick={addTask}
                    className="
                      flex
                      h-8
                      w-8
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      bg-violet-600
                      text-white
                    "
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            </Panel>

            {/* AI */}

            <Panel>

              <div className="flex items-center gap-2">

                <div
                  className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-xl
                    bg-gradient-to-br
                    from-violet-500
                    to-fuchsia-500
                    text-white
                  "
                >
                  <Sparkles size={18} />
                </div>

                <div>
                  <h3 className="text-sm font-black">
                    AI Assistant
                  </h3>

                  <p className="text-[9px] text-slate-400">
                    Smart help for your notes
                  </p>
                </div>
              </div>

              <div className="mt-2 space-y-1.5">

                <AIAction
                  icon={<FileText size={14} />}
                  text="Summarize notes"
                />

                <AIAction
                  icon={<Sparkles size={14} />}
                  text="Generate ideas"
                />

                <AIAction
                  icon={<ArrowRight size={14} />}
                  text="Improve writing"
                />

                <AIAction
                  icon={<CheckSquare size={14} />}
                  text="Create to-do list"
                />
              </div>

              <button
                type="button"
                onClick={() =>
                  navigate("/ai-assistant")
                }
                className="
                  mt-2
                  flex
                  h-8
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-gradient-to-r
                  from-violet-600
                  to-fuchsia-500
                  text-[11px]
                  font-bold
                  text-white
                "
              >
                <Send size={13} />
                Ask AI
              </button>
            </Panel>
          </div>

          {/* BOTTOM */}

          <div className="grid h-[145px] grid-cols-[1.3fr_1fr] gap-3">

            {/* NOTEBOOKS */}

            <Panel>

              <PanelHeader
                icon={<BookOpen size={18} />}
                title="Notebook Overview"
                link="/notes"
              />

              <div className="mt-2 grid grid-cols-4 gap-2">

                {notebookStats
                  .slice(0, 3)
                  .map((item, index) => {

                    const colors = [
                      "bg-pink-400",
                      "bg-blue-500",
                      "bg-violet-500",
                    ];

                    return (
                      <button
                        key={item.name}
                        type="button"
                        onClick={() =>
                          navigate(
                            `/notebook/${encodeURIComponent(
                              item.name
                            )}`
                          )
                        }
                        className="
                          flex
                          h-[82px]
                          items-center
                          gap-2
                          rounded-xl
                          border
                          border-violet-100
                          bg-white
                          px-3
                          text-left
                          hover:bg-violet-50
                        "
                      >
                        <div
                          className={`
                            flex
                            h-9
                            w-9
                            shrink-0
                            items-center
                            justify-center
                            rounded-xl
                            text-white
                            ${colors[index]}
                          `}
                        >
                          <Folder size={17} />
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-[11px] font-bold">
                            {item.name}
                          </p>

                          <p className="mt-1 text-[9px] text-slate-400">
                            {item.count} notes
                          </p>
                        </div>
                      </button>
                    );
                  })}

                <button
                  type="button"
                  onClick={() =>
                    navigate("/notes")
                  }
                  className="
                    flex
                    h-[82px]
                    flex-col
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-dashed
                    border-violet-200
                    text-violet-500
                  "
                >
                  <Plus size={20} />

                  <span className="mt-1 text-[10px] font-bold">
                    Add New
                  </span>
                </button>
              </div>
            </Panel>

            {/* QUICK ACTIONS */}

            <Panel>

              <PanelHeader
                icon={<Sparkles size={18} />}
                title="Quick Actions"
              />

              <div className="mt-2 grid grid-cols-4 gap-2">

                <QuickAction
                  icon={<FileText size={18} />}
                  label="New Note"
                  onClick={handleCreateNote}
                />

                <QuickAction
                  icon={<Mic size={18} />}
                  label="Voice"
                  onClick={() =>
                    showToast(
                      "Voice Note is available inside Note Editor."
                    )
                  }
                />

                <QuickAction
                  icon={<Sparkles size={18} />}
                  label="AI"
                  onClick={() =>
                    navigate("/ai-assistant")
                  }
                />

                <QuickAction
                  icon={<BookOpen size={18} />}
                  label="Notebook"
                  onClick={() =>
                    navigate("/notes")
                  }
                />
              </div>
            </Panel>
          </div>
        </section>
      </main>

      {/* MOBILE NAV */}

      <div
        className="
          fixed
          bottom-4
          left-1/2
          z-50
          flex
          -translate-x-1/2
          items-center
          gap-1
          rounded-2xl
          border
          border-violet-100
          bg-white/95
          p-1.5
          shadow-xl
          lg:hidden
        "
      >
        <MobileNav
          to="/dashboard"
          icon={<LayoutDashboard size={18} />}
        />

        <MobileNav
          to="/notes"
          icon={<FileText size={18} />}
        />

        <button
          type="button"
          onClick={handleCreateNote}
          className="
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-xl
            bg-gradient-to-br
            from-violet-600
            to-fuchsia-500
            text-white
            shadow-lg
          "
        >
          <Plus size={20} />
        </button>

        <MobileNav
          to="/pinned"
          icon={<Star size={18} />}
        />

        <MobileNav
          to="/archive"
          icon={<Archive size={18} />}
        />
      </div>

      {/* TOAST */}

      {toast && (
        <div
          className="
            fixed
            bottom-6
            left-1/2
            z-[100]
            -translate-x-1/2
            rounded-full
            bg-[#241044]
            px-5
            py-3
            text-sm
            font-semibold
            text-white
            shadow-2xl
          "
        >
          {toast}
        </div>
      )}
    </div>
  );
}

/* =========================================================
   SIDEBAR ITEM
========================================================= */

function SidebarItem({
  to,
  icon,
  label,
  active = false,
  badge,
  badgeText,
}) {
  return (
    <Link
      to={to}
      className={`
        flex
        h-10
        items-center
        gap-3
        rounded-xl
        px-3
        text-sm
        font-semibold
        transition
        ${
          active
            ? "bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white shadow-lg"
            : "text-white/85 hover:bg-white/10 hover:text-white"
        }
      `}
    >
      <span>{icon}</span>

      <span className="flex-1">
        {label}
      </span>

      {badgeText && (
        <span className="rounded-full bg-fuchsia-500 px-2 py-0.5 text-[8px] font-black">
          {badgeText}
        </span>
      )}

      {badge !== undefined && (
        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-white/15 px-1.5 text-[10px] text-purple-200">
          {badge}
        </span>
      )}
    </Link>
  );
}

/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
  icon,
  title,
  value,
  text,
  type,
}) {
  const styles = {
    purple: {
      bg: "bg-[#f5f0ff]",
      icon: "bg-violet-600",
      text: "text-violet-600",
    },
    pink: {
      bg: "bg-[#fff1f8]",
      icon: "bg-pink-500",
      text: "text-pink-500",
    },
    blue: {
      bg: "bg-[#eef6ff]",
      icon: "bg-blue-500",
      text: "text-blue-500",
    },
    orange: {
      bg: "bg-[#fff6ed]",
      icon: "bg-orange-500",
      text: "text-orange-500",
    },
  };

  const style = styles[type];

  return (
    <div
      className={`
        ${style.bg}
        flex
        h-[108px]
        items-center
        gap-3
        rounded-[22px]
        border
        border-white
        px-4
        shadow-sm
      `}
    >
      <div
        className={`
          flex
          h-11
          w-11
          shrink-0
          items-center
          justify-center
          rounded-2xl
          ${style.icon}
          text-white
          shadow-md
        `}
      >
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-[11px] font-semibold text-slate-500">
          {title}
        </p>

        <p className="text-2xl font-black">
          {value}
        </p>

        <p
          className={`truncate text-[9px] font-semibold ${style.text}`}
        >
          {text}
        </p>
      </div>

      <ArrowRight
        size={15}
        className={`ml-auto hidden ${style.text} sm:block`}
      />
    </div>
  );
}

/* =========================================================
   PANEL
========================================================= */

function Panel({ children }) {
  return (
    <div
      className="
        overflow-hidden
        rounded-[22px]
        border
        border-violet-100
        bg-white/90
        p-4
        shadow-[0_5px_20px_rgba(75,35,130,.06)]
      "
    >
      {children}
    </div>
  );
}

/* =========================================================
   PANEL HEADER
========================================================= */

function PanelHeader({
  icon,
  title,
  link,
}) {
  return (
    <div className="flex items-center justify-between">

      <div className="flex items-center gap-2">
        <span className="text-violet-600">
          {icon}
        </span>

        <h2 className="text-sm font-black">
          {title}
        </h2>
      </div>

      {link && (
        <Link
          to={link}
          className="
            flex
            items-center
            gap-1
            text-[10px]
            font-bold
            text-violet-600
          "
        >
          View All
          <ArrowRight size={12} />
        </Link>
      )}
    </div>
  );
}

/* =========================================================
   EMPTY
========================================================= */

function EmptyState({ icon, text }) {
  return (
    <div className="flex h-[135px] flex-col items-center justify-center text-slate-400">
      {icon}

      <p className="mt-2 text-xs">
        {text}
      </p>
    </div>
  );
}

/* =========================================================
   AI ACTION
========================================================= */

function AIAction({ icon, text }) {
  return (
    <button
      type="button"
      className="
        flex
        h-8
        w-full
        items-center
        gap-2
        rounded-xl
        border
        border-violet-100
        bg-[#faf8ff]
        px-3
        text-left
        text-[10px]
        font-semibold
        text-slate-700
        hover:bg-violet-50
      "
    >
      <span className="text-violet-600">
        {icon}
      </span>

      {text}
    </button>
  );
}

/* =========================================================
   QUICK ACTION
========================================================= */

function QuickAction({
  icon,
  label,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        flex
        h-[82px]
        flex-col
        items-center
        justify-center
        rounded-xl
        border
        border-violet-100
        bg-gradient-to-b
        from-white
        to-[#f7f2ff]
        text-violet-700
        transition
        hover:-translate-y-0.5
        hover:shadow-md
      "
    >
      <div
        className="
          mb-1
          flex
          h-9
          w-9
          items-center
          justify-center
          rounded-xl
          bg-violet-100
        "
      >
        {icon}
      </div>

      <span className="text-[10px] font-bold">
        {label}
      </span>
    </button>
  );
}

/* =========================================================
   MOBILE NAV
========================================================= */

function MobileNav({ to, icon }) {
  return (
    <Link
      to={to}
      className="
        flex
        h-11
        w-11
        items-center
        justify-center
        rounded-xl
        text-violet-600
        hover:bg-violet-100
      "
    >
      {icon}
    </Link>
  );
}

export default Dashboard;