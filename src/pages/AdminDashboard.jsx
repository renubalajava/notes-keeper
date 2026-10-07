import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

/* =========================================================
   SVG ICONS
========================================================= */

const Icon = ({ name, size = 20, strokeWidth = 1.8 }) => {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };

  const icons = {
    menu: (
      <>
        <path d="M4 6h16" />
        <path d="M4 12h16" />
        <path d="M4 18h16" />
      </>
    ),

    home: (
      <>
        <path d="m3 10 9-7 9 7" />
        <path d="M5 9v11h14V9" />
        <path d="M9 20v-6h6v6" />
      </>
    ),

    users: (
      <>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </>
    ),

    note: (
      <>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <path d="M14 2v6h6" />
        <path d="M8 13h8" />
        <path d="M8 17h6" />
      </>
    ),

    reports: (
      <>
        <path d="M4 19V9" />
        <path d="M10 19V5" />
        <path d="M16 19v-8" />
        <path d="M22 19V3" />
      </>
    ),

    settings: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-1.41 1.41-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1.03 1.56V21h-2v-.09A1.7 1.7 0 0 0 12.39 19a1.7 1.7 0 0 0-1.88.34l-.06.06-1.41-1.41.06-.06A1.7 1.7 0 0 0 9.44 16a1.7 1.7 0 0 0-1.56-1.03H7v-2h.88A1.7 1.7 0 0 0 9.44 12a1.7 1.7 0 0 0-.34-1.88l-.06-.06 1.41-1.41.06.06A1.7 1.7 0 0 0 12.39 9a1.7 1.7 0 0 0 1.03-1.56V7h2v.44A1.7 1.7 0 0 0 16.44 9a1.7 1.7 0 0 0 1.88-.34l.06-.06 1.41 1.41-.06.06A1.7 1.7 0 0 0 19.39 12a1.7 1.7 0 0 0 1.56 1.03H21v2h-.44A1.7 1.7 0 0 0 19.4 15Z" />
      </>
    ),

    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4-4" />
      </>
    ),

    bell: (
      <>
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
        <path d="M10 21h4" />
      </>
    ),

    logout: (
      <>
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <path d="m16 17 5-5-5-5" />
        <path d="M21 12H9" />
      </>
    ),

    arrow: (
      <>
        <path d="M5 12h14" />
        <path d="m13 6 6 6-6 6" />
      </>
    ),

    more: (
      <>
        <circle cx="5" cy="12" r="1" fill="currentColor" />
        <circle cx="12" cy="12" r="1" fill="currentColor" />
        <circle cx="19" cy="12" r="1" fill="currentColor" />
      </>
    ),

    check: (
      <>
        <path d="m5 12 4 4L19 6" />
      </>
    ),

    archive: (
      <>
        <path d="M4 7h16" />
        <path d="M6 7v13h12V7" />
        <path d="M5 3h14l1 4H4l1-4Z" />
        <path d="M9 11h6" />
      </>
    ),
  };

  return <svg {...common}>{icons[name]}</svg>;
};

/* =========================================================
   MAIN ADMIN DASHBOARD
========================================================= */

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [activeMenu, setActiveMenu] =
    useState("dashboard");

  const [users, setUsers] = useState([]);
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  /* =======================================================
     LOAD DATA
  ======================================================= */

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    try {
      const usersData = JSON.parse(
        localStorage.getItem(
          "notesKeeperUsers"
        ) || "[]"
      );

      const notesData = JSON.parse(
        localStorage.getItem(
          "notesKeeperNotes"
        ) || "[]"
      );

      setUsers(
        Array.isArray(usersData)
          ? usersData
          : []
      );

      setNotes(
        Array.isArray(notesData)
          ? notesData
          : []
      );
    } catch (error) {
      console.error(
        "Admin data loading error:",
        error
      );

      setUsers([]);
      setNotes([]);
    }
  };

  /* =======================================================
     COUNTS
  ======================================================= */

  const normalUsers = useMemo(
    () =>
      users.filter(
        (user) =>
          String(user.role || "").toLowerCase() !==
          "admin"
      ),
    [users]
  );

  const activeUsers = useMemo(
    () =>
      normalUsers.filter(
        (user) =>
          String(user.status || "").toLowerCase() !==
          "inactive"
      ),
    [normalUsers]
  );

  const archivedNotes = useMemo(
    () =>
      notes.filter(
        (note) => note.archived === true
      ),
    [notes]
  );

  /* =======================================================
     SEARCH
  ======================================================= */

  const filteredUsers = useMemo(() => {
    const value = search
      .trim()
      .toLowerCase();

    if (!value) return normalUsers;

    return normalUsers.filter((user) =>
      `${user.name || ""} ${
        user.email || ""
      }`
        .toLowerCase()
        .includes(value)
    );
  }, [normalUsers, search]);

  const filteredNotes = useMemo(() => {
    const value = search
      .trim()
      .toLowerCase();

    if (!value) return notes;

    return notes.filter((note) =>
      `${note.title || ""} ${
        note.category || ""
      } ${note.content || ""}`
        .toLowerCase()
        .includes(value)
    );
  }, [notes, search]);

  /* =======================================================
     RECENT
  ======================================================= */

  const recentUsers = useMemo(
    () =>
      [...normalUsers]
        .sort(
          (a, b) =>
            getDateValue(b.createdAt) -
            getDateValue(a.createdAt)
        )
        .slice(0, 4),
    [normalUsers]
  );

  const recentNotes = useMemo(
    () =>
      [...notes]
        .sort(
          (a, b) =>
            getDateValue(
              b.updatedAt ||
                b.createdAt
            ) -
            getDateValue(
              a.updatedAt ||
                a.createdAt
            )
        )
        .slice(0, 4),
    [notes]
  );

  /* =======================================================
     LOGOUT
  ======================================================= */

  const handleLogout = () => {
    localStorage.removeItem(
      "notesKeeperLoggedIn"
    );

    localStorage.removeItem(
      "notesKeeperCurrentUser"
    );

    navigate("/login");
  };

  /* =======================================================
     MENU
  ======================================================= */

  const changeMenu = (menu) => {
    setActiveMenu(menu);
    setSearch("");
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#f7f4ff]">

      <div className="flex min-h-screen">
{/* Mobile Overlay */}
{mobileMenuOpen && (
  <button
    type="button"
    aria-label="Close mobile menu"
    onClick={() => setMobileMenuOpen(false)}
    className="fixed inset-0 z-40 bg-black/40 lg:hidden"
  />
)}
        {/* =================================================
            SIDEBAR
        ================================================= */}

        {/* SIDEBAR */}

<aside
  className={`
    fixed inset-y-0 left-0 z-50
    flex w-[230px] shrink-0 flex-col
    bg-gradient-to-b from-[#482097] via-[#4c24a0] to-[#32166f]
    text-white
    transition-transform duration-300
    lg:static lg:z-auto
    ${
      mobileMenuOpen
        ? "translate-x-0"
        : "-translate-x-full lg:translate-x-0"
    }
  `}
>
  {/* BRAND */}
  <div className="px-5 pt-6">
    <div className="flex items-center gap-3">
      <div className="flex h-[54px] w-[54px] items-center justify-center rounded-[17px] bg-gradient-to-br from-[#d9c1ff] to-[#934af3] shadow-[0_8px_20px_rgba(0,0,0,0.2)]">
        <Icon name="note" size={27} strokeWidth={1.8} />
      </div>

      <div>
        <h1 className="text-[20px] font-black">
          Notes Keeper
        </h1>
        <p className="text-[11px] text-purple-200">
          Admin Panel
        </p>
      </div>
    </div>
  </div>

  {/* NAVIGATION */}
  <nav className="mt-8 px-3">
    <SidebarItem
      active={activeMenu === "dashboard"}
      icon="home"
      label="Dashboard"
      onClick={() => changeMenu("dashboard")}
    />

    <SidebarItem
      active={activeMenu === "users"}
      icon="users"
      label="Users"
      count={normalUsers.length}
      onClick={() => changeMenu("users")}
    />

    <SidebarItem
      active={activeMenu === "notes"}
      icon="note"
      label="Notes"
      count={notes.length}
      onClick={() => changeMenu("notes")}
    />

    <SidebarItem
      active={activeMenu === "reports"}
      icon="reports"
      label="Reports"
      onClick={() => changeMenu("reports")}
    />

    <SidebarItem
      active={activeMenu === "settings"}
      icon="settings"
      label="Settings"
      onClick={() => changeMenu("settings")}
    />
  </nav>

  {/* ADMIN ACCESS */}
  <div className="mt-auto px-5 pb-5">
    <div className="relative overflow-hidden rounded-[21px] border border-white/20 bg-white/[0.08] p-5 backdrop-blur-xl">
      <div className="absolute -bottom-10 -right-8 h-28 w-28 rounded-full bg-purple-300/10" />

      <div className="relative z-10">
        <div className="mb-3 text-[32px]">
          👑
        </div>

        <h3 className="text-[14px] font-black">
          Admin Access
        </h3>

        <p className="mt-2 text-[10px] leading-5 text-purple-100/80">
          Manage users, monitor notes and keep your
          workspace organized.
        </p>
      </div>
    </div>

    {/* LOGOUT */}
    <button
      type="button"
      onClick={handleLogout}
      className="mt-4 flex w-full items-center gap-3 rounded-[15px] border border-white/20 bg-white/[0.06] px-4 py-3 text-sm font-bold transition hover:bg-white/10"
    >
      <Icon name="logout" size={19} />
      Logout
    </button>
  </div>
</aside>

        {/* =================================================
            MAIN
        ================================================= */}

        <main className="min-w-0 flex-1">

          {/* TOP HEADER */}

          <header className="sticky top-0 z-40 flex h-[76px] items-center gap-3 border-b border-purple-100 bg-white/90 px-4 shadow-sm backdrop-blur-xl sm:px-6">

            <button
              type="button"
               onClick={() => setMobileMenuOpen(true)}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-purple-50 text-purple-700 lg:hidden"
            >
              <Icon
                name="menu"
                size={22}
              />
            </button>

            {/* SEARCH */}

            <div className="relative max-w-[630px] flex-1">

              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-500">

                <Icon
                  name="search"
                  size={17}
                />

              </span>

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
                placeholder="Search users, notes, or anything..."
                className="h-11 w-full rounded-full border border-purple-100 bg-[#faf8ff] pl-11 pr-4 text-xs font-medium text-[#352568] outline-none transition focus:border-purple-400 focus:bg-white focus:ring-4 focus:ring-purple-100"
              />

            </div>

            {/* NOTIFICATION */}

            <button
              type="button"
              className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-purple-100 bg-white text-purple-700"
            >

              <Icon
                name="bell"
                size={19}
              />

              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-pink-500 px-1 text-[9px] font-black text-white">
                3
              </span>

            </button>

            {/* ADMIN */}

            <div className="flex items-center gap-2 sm:gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#efdfff] to-[#c59cff] text-lg">
                👩🏻
              </div>

              <div className="hidden sm:block">

                <p className="text-xs font-black text-[#29215a]">
                  Admin
                </p>

                <p className="text-[9px] text-slate-400">
                  Administrator
                </p>

              </div>

              <span className="text-purple-600">
                ⌄
              </span>

            </div>

          </header>

          {/* PAGE */}

          <div className="p-4 sm:p-6">

            {activeMenu ===
              "dashboard" && (
              <DashboardContent
                users={normalUsers}
                activeUsers={
                  activeUsers
                }
                notes={notes}
                archivedNotes={
                  archivedNotes
                }
                recentUsers={
                  recentUsers
                }
                recentNotes={
                  recentNotes
                }
                onReports={() =>
                  changeMenu(
                    "reports"
                  )
                }
              />
            )}

            {activeMenu === "users" && (
              <UsersTable
                users={filteredUsers}
              />
            )}

            {activeMenu === "notes" && (
              <NotesTable
                notes={filteredNotes}
              />
            )}

            {activeMenu ===
              "reports" && (
              <Reports
                users={normalUsers}
                activeUsers={
                  activeUsers
                }
                notes={notes}
                archivedNotes={
                  archivedNotes
                }
              />
            )}

            {activeMenu ===
              "settings" && (
              <Settings />
            )}

          </div>

        </main>

      </div>

    </div>
  );
}

/* =========================================================
   SIDEBAR ITEM
========================================================= */

function SidebarItem({
  active,
  icon,
  label,
  count,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`mb-2 flex w-full items-center gap-4 rounded-[16px] px-4 py-3.5 text-sm font-bold transition ${
        active
          ? "bg-gradient-to-r from-[#9659f5] to-[#7939dd] shadow-lg shadow-purple-900/30"
          : "text-purple-100/85 hover:bg-white/10"
      }`}
    >

      <span className="w-6">

        <Icon
          name={icon}
          size={19}
        />

      </span>

      <span className="flex-1 text-left">
        {label}
      </span>

      {count !== undefined && (
        <span className="rounded-full bg-white/15 px-2.5 py-1 text-[10px]">
          {count}
        </span>
      )}

    </button>
  );
}

/* =========================================================
   DASHBOARD CONTENT
========================================================= */

function DashboardContent({
  users,
  activeUsers,
  notes,
  archivedNotes,
  recentUsers,
  recentNotes,
  onReports,
}) {
  return (
    <div className="space-y-5">

      {/* =================================================
          HERO
      ================================================= */}

      <section className="relative min-h-[280px] overflow-hidden rounded-[27px] border border-purple-100 bg-gradient-to-r from-[#eee2ff] via-[#e7d9ff] to-[#d3baff]">

        {/* BACKGROUND */}

        <div className="absolute inset-0 opacity-40">

          <div className="absolute -left-20 -top-20 h-60 w-60 rounded-full bg-white blur-3xl" />

          <div className="absolute bottom-[-100px] left-[45%] h-60 w-60 rounded-full bg-purple-300/40 blur-3xl" />

        </div>

        {/* TEXT */}

        <div className="relative z-10 max-w-[650px] px-7 py-8 sm:px-10 sm:py-9">

          <p className="text-[11px] font-black uppercase tracking-wider text-[#5221a5]">
            Welcome back, Admin! 👋
          </p>

          <h2 className="mt-4 text-[34px] font-black leading-[1.08] tracking-tight text-[#2d1c69] sm:text-[42px]">

            Manage your users,
            <br />

            <span className="text-[#7a1ff1]">
              monitor your workspace.
            </span>

          </h2>

          <p className="mt-4 max-w-[480px] text-sm leading-5 text-purple-900/65">
            Keep your Notes Keeper
            platform organized by
            managing users, tracking
            activity and ensuring a
            smooth experience for
            everyone.
          </p>

          <button
            type="button"
            onClick={onReports}
            className="mt-5 flex items-center gap-2 rounded-full bg-gradient-to-r from-[#7525e7] to-[#9a2eff] px-6 py-3 text-xs font-black text-white shadow-lg shadow-purple-400/30 transition hover:-translate-y-0.5"
          >
            View Reports

            <Icon
              name="arrow"
              size={15}
            />

          </button>

        </div>

{/* GIRL */}
<div className="absolute bottom-0 right-0 hidden h-full w-[56%] lg:block">
  <img
    src="https://www.kindpng.com/picc/m/109-1092226_girl-with-laptop-png-transparent-png.png"
    alt="Notes Keeper Admin"
    className="h-full w-full object-contain object-right-bottom"
  />
</div>

        {/* BADGE */}

        <div className="absolute right-[7%] top-8 hidden rounded-[16px] border border-white/70 bg-white/80 px-5 py-3 text-center shadow-xl backdrop-blur-md xl:block">

          <p className="text-[9px] font-black uppercase tracking-wider text-purple-500">
            Organize
          </p>

          <p className="mt-1 text-xs font-black text-purple-800">
            People • Ideas
          </p>

        </div>

      </section>

      {/* =================================================
          STAT CARDS
      ================================================= */}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <StatCard
          type="purple"
          icon="users"
          title="Total Users"
          value={users.length}
          percentage="12%"
        />

        <StatCard
          type="pink"
          icon="note"
          title="Total Notes"
          value={notes.length}
          percentage="18%"
        />

        <StatCard
          type="green"
          icon="check"
          title="Active Users"
          value={activeUsers.length}
          percentage="10%"
        />

        <StatCard
          type="orange"
          icon="archive"
          title="Archived Notes"
          value={archivedNotes.length}
          percentage="8%"
        />

      </section>

      {/* =================================================
          CHARTS
      ================================================= */}

      <section className="grid gap-5 xl:grid-cols-[1.45fr_0.8fr_0.75fr]">

        <NotesChart />

        <CategoryChart
          total={notes.length}
        />

        <Activity />

      </section>

      {/* =================================================
          TABLES
      ================================================= */}

      <section className="grid gap-5 xl:grid-cols-[1.2fr_1fr]">

        <RecentUsers
          users={recentUsers}
        />

        <RecentNotes
          notes={recentNotes}
        />

      </section>

    </div>
  );
}

/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
  type,
  icon,
  title,
  value,
  percentage,
}) {
  const styles = {
    purple: {
      icon: "bg-purple-100 text-purple-600",
      bar: "bg-purple-300",
    },

    pink: {
      icon: "bg-pink-100 text-pink-500",
      bar: "bg-pink-300",
    },

    green: {
      icon: "bg-emerald-100 text-emerald-500",
      bar: "bg-emerald-300",
    },

    orange: {
      icon: "bg-orange-100 text-orange-500",
      bar: "bg-orange-300",
    },
  };

  const style =
    styles[type];

  return (
    <div className="rounded-[21px] border border-purple-100 bg-white p-5 shadow-[0_7px_24px_rgba(89,53,157,0.07)] transition hover:-translate-y-1 hover:shadow-xl">

      <div className="flex items-start justify-between">

        <div
          className={`flex h-12 w-12 items-center justify-center rounded-[15px] ${style.icon}`}
        >
          <Icon
            name={icon}
            size={21}
          />
        </div>

        <div className="flex h-11 items-end gap-1">

          {[14, 20, 26, 34, 42].map(
            (height, index) => (
              <span
                key={index}
                className={`w-1.5 rounded-full ${style.bar}`}
                style={{
                  height: `${height}px`,
                }}
              />
            )
          )}

        </div>

      </div>

      <p className="mt-4 text-xs font-bold text-slate-400">
        {title}
      </p>

      <div className="mt-1 flex items-end justify-between">

        <span className="text-3xl font-black text-[#29215a]">
          {value}
        </span>

        <span className="text-xs font-black text-emerald-500">
          ↑ {percentage}
        </span>

      </div>

      <p className="mt-1 text-[10px] text-slate-400">
        from last month
      </p>

    </div>
  );
}

/* =========================================================
   NOTES CHART
========================================================= */

function NotesChart() {
  return (
    <div className="rounded-[21px] border border-purple-100 bg-white p-5 shadow-[0_7px_24px_rgba(89,53,157,0.06)]">

      <div className="flex items-start justify-between">

        <div>

          <h3 className="text-lg font-black text-[#29215a]">
            Notes Overview
          </h3>

          <p className="mt-1 text-xs text-slate-400">
            Created vs Archived notes
          </p>

        </div>

        <button
          type="button"
          className="rounded-full bg-purple-50 px-4 py-2 text-[10px] font-black text-purple-700"
        >
          Last 7 Days
          <span className="ml-2">
            ⌄
          </span>
        </button>

      </div>

      <div className="relative mt-5 h-[215px]">

        <div className="absolute inset-0 flex flex-col justify-between pl-7">

          {[20, 15, 10, 5, 0].map(
            (number) => (
              <div
                key={number}
                className="flex items-center gap-2"
              >

                <span className="absolute left-0 w-5 text-[9px] text-slate-400">
                  {number}
                </span>

                <div className="h-px flex-1 bg-purple-100" />

              </div>
            )
          )}

        </div>

        <svg
          viewBox="0 0 700 220"
          preserveAspectRatio="none"
          className="absolute left-7 top-0 h-[195px] w-[calc(100%-30px)]"
        >

          <defs>

            <linearGradient
              id="purpleArea"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >

              <stop
                offset="0%"
                stopColor="#7138dd"
                stopOpacity="0.28"
              />

              <stop
                offset="100%"
                stopColor="#7138dd"
                stopOpacity="0"
              />

            </linearGradient>

          </defs>

          <path
            d="M0 175 C60 150 95 135 145 145 S220 70 285 65 S370 125 430 105 S505 60 560 82 S645 115 700 75 L700 220 L0 220 Z"
            fill="url(#purpleArea)"
          />

          <path
            d="M0 175 C60 150 95 135 145 145 S220 70 285 65 S370 125 430 105 S505 60 560 82 S645 115 700 75"
            fill="none"
            stroke="#7138dd"
            strokeWidth="4"
            strokeLinecap="round"
          />

          <path
            d="M0 195 C75 180 105 175 145 185 S225 165 285 180 S370 188 430 152 S505 120 560 142 S650 164 700 150"
            fill="none"
            stroke="#f47e9c"
            strokeWidth="3"
            strokeLinecap="round"
          />

          <circle
            cx="285"
            cy="65"
            r="6"
            fill="#7138dd"
          />

        </svg>

        <div className="absolute bottom-0 left-8 right-0 flex justify-between text-[10px] font-semibold text-slate-400">

          {[
            "Mon",
            "Tue",
            "Wed",
            "Thu",
            "Fri",
            "Sat",
            "Sun",
          ].map((day) => (
            <span key={day}>
              {day}
            </span>
          ))}

        </div>

      </div>

      <div className="mt-3 flex gap-5">

        <Legend
          color="bg-purple-600"
          label="Created Notes"
        />

        <Legend
          color="bg-pink-400"
          label="Archived Notes"
        />

      </div>

    </div>
  );
}

function Legend({
  color,
  label,
}) {
  return (
    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500">

      <span
        className={`h-2.5 w-2.5 rounded-full ${color}`}
      />

      {label}

    </div>
  );
}

/* =========================================================
   CATEGORY
========================================================= */

function CategoryChart({
  total,
}) {
  return (
    <div className="rounded-[21px] border border-purple-100 bg-white p-5 shadow-[0_7px_24px_rgba(89,53,157,0.06)]">

      <h3 className="text-lg font-black text-[#29215a]">
        Notes by Category
      </h3>

      <p className="mt-1 text-xs text-slate-400">
        Note distribution
      </p>

      <div className="mt-6 flex justify-center">

        <div
          className="relative flex h-[160px] w-[160px] items-center justify-center rounded-full"
          style={{
            background:
              "conic-gradient(#6930d5 0deg 126deg,#824bdc 126deg 216deg,#9e70e8 216deg 288deg,#bd98f2 288deg 342deg,#ded0fb 342deg 360deg)",
          }}
        >

          <div className="flex h-[100px] w-[100px] flex-col items-center justify-center rounded-full bg-white">

            <span className="text-3xl font-black text-[#29215a]">
              {total}
            </span>

            <span className="text-[10px] font-bold text-slate-400">
              Notes
            </span>

          </div>

        </div>

      </div>

      <div className="mt-5 space-y-3">

        <CategoryRow
          color="bg-purple-700"
          label="Work"
          value="35%"
        />

        <CategoryRow
          color="bg-purple-500"
          label="Personal"
          value="25%"
        />

        <CategoryRow
          color="bg-purple-400"
          label="Study"
          value="20%"
        />

        <CategoryRow
          color="bg-purple-300"
          label="Ideas"
          value="15%"
        />

        <CategoryRow
          color="bg-purple-200"
          label="Others"
          value="5%"
        />

      </div>

    </div>
  );
}

function CategoryRow({
  color,
  label,
  value,
}) {
  return (
    <div className="flex items-center justify-between">

      <div className="flex items-center gap-2">

        <span
          className={`h-2.5 w-2.5 rounded-full ${color}`}
        />

        <span className="text-[10px] font-semibold text-slate-500">
          {label}
        </span>

      </div>

      <span className="text-[10px] font-black text-[#29215a]">
        {value}
      </span>

    </div>
  );
}

/* =========================================================
   ACTIVITY
========================================================= */

function Activity() {
  const items = [
    {
      icon: "users",
      bg: "bg-purple-100",
      text: "text-purple-600",
      title: "New user registered",
      sub: "New account created",
      time: "2 min ago",
    },
    {
      icon: "note",
      bg: "bg-indigo-100",
      text: "text-indigo-600",
      title: "Note created",
      sub: "Meeting Notes",
      time: "10 min ago",
    },
    {
      icon: "users",
      bg: "bg-pink-100",
      text: "text-pink-500",
      title: "User updated",
      sub: "Profile updated",
      time: "25 min ago",
    },
    {
      icon: "archive",
      bg: "bg-purple-100",
      text: "text-purple-600",
      title: "Note archived",
      sub: "Project Plan",
      time: "1 hour ago",
    },
    {
      icon: "archive",
      bg: "bg-red-100",
      text: "text-red-500",
      title: "Note deleted",
      sub: "Old document",
      time: "2 hours ago",
    },
  ];

  return (
    <div className="rounded-[21px] border border-purple-100 bg-white p-5 shadow-[0_7px_24px_rgba(89,53,157,0.06)]">

      <div className="flex items-center justify-between">

        <h3 className="text-lg font-black text-[#29215a]">
          Recent Activity
        </h3>

        <button
          type="button"
          className="rounded-full bg-purple-50 px-3 py-1.5 text-[9px] font-black text-purple-700"
        >
          View All
        </button>

      </div>

      <div className="mt-5 space-y-4">

        {items.map((item) => (
          <div
            key={item.title}
            className="flex items-center gap-3"
          >

            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${item.bg} ${item.text}`}
            >
              <Icon
                name={item.icon}
                size={16}
              />
            </div>

            <div className="min-w-0 flex-1">

              <p className="truncate text-[10px] font-black text-[#29215a]">
                {item.title}
              </p>

              <p className="truncate text-[9px] text-slate-400">
                {item.sub}
              </p>

            </div>

            <span className="whitespace-nowrap text-[8px] text-slate-400">
              {item.time}
            </span>

          </div>
        ))}

      </div>

    </div>
  );
}

/* =========================================================
   RECENT USERS
========================================================= */

function RecentUsers({
  users,
}) {
  return (
    <div className="rounded-[21px] border border-purple-100 bg-white p-5 shadow-[0_7px_24px_rgba(89,53,157,0.06)]">

      <div className="flex items-center justify-between">

        <div>

          <h3 className="text-lg font-black text-[#29215a]">
            Recent Users
          </h3>

          <p className="mt-1 text-xs text-slate-400">
            Latest registered accounts
          </p>

        </div>

        <button
          type="button"
          className="rounded-full bg-purple-50 px-4 py-2 text-[10px] font-black text-purple-700"
        >
          View All
        </button>

      </div>

      <div className="mt-5 overflow-x-auto">

        <table className="w-full min-w-[650px]">

          <thead>

            <tr className="border-b border-purple-100 text-left text-[9px] uppercase tracking-wider text-slate-400">

              <th className="pb-3">
                #
              </th>

              <th className="pb-3">
                Name
              </th>

              <th className="pb-3">
                Email
              </th>

              <th className="pb-3">
                Role
              </th>

              <th className="pb-3">
                Status
              </th>

              <th className="pb-3">
                Joined
              </th>

            </tr>

          </thead>

          <tbody>

            {users.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  className="py-8 text-center text-xs text-slate-400"
                >
                  No users available
                </td>
              </tr>
            ) : (
              users.map(
                (user, index) => (
                  <tr
                    key={
                      user.id ||
                      user.email ||
                      index
                    }
                    className="border-b border-slate-100 last:border-0"
                  >

                    <td className="py-3 text-xs text-slate-400">
                      {index + 1}
                    </td>

                    <td className="py-3">

                      <div className="flex items-center gap-2">

                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 text-purple-700">
                          <Icon
                            name="users"
                            size={14}
                          />
                        </div>

                        <span className="text-xs font-bold text-[#29215a]">
                          {user.name ||
                            "User"}
                        </span>

                      </div>

                    </td>

                    <td className="py-3 text-xs text-slate-500">
                      {user.email ||
                        "—"}
                    </td>

                    <td className="py-3 text-xs text-slate-500">
                      {user.role ||
                        "User"}
                    </td>

                    <td className="py-3">

                      <span
                        className={`rounded-full px-3 py-1 text-[9px] font-black ${
                          String(
                            user.status ||
                              ""
                          ).toLowerCase() ===
                          "inactive"
                            ? "bg-pink-100 text-pink-500"
                            : "bg-emerald-100 text-emerald-600"
                        }`}
                      >
                        {String(
                          user.status ||
                            ""
                        ).toLowerCase() ===
                        "inactive"
                          ? "Inactive"
                          : "Active"}
                      </span>

                    </td>

                    <td className="py-3 text-xs text-slate-500">
                      {formatDate(
                        user.createdAt
                      )}
                    </td>

                  </tr>
                )
              )
            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}

/* =========================================================
   RECENT NOTES
========================================================= */

function RecentNotes({
  notes,
}) {
  return (
    <div className="rounded-[21px] border border-purple-100 bg-white p-5 shadow-[0_7px_24px_rgba(89,53,157,0.06)]">

      <div className="flex items-center justify-between">

        <div>

          <h3 className="text-lg font-black text-[#29215a]">
            Recent Notes
          </h3>

          <p className="mt-1 text-xs text-slate-400">
            Latest notes activity
          </p>

        </div>

        <button
          type="button"
          className="rounded-full bg-purple-50 px-4 py-2 text-[10px] font-black text-purple-700"
        >
          View All
        </button>

      </div>

      <div className="mt-5 overflow-x-auto">

        <table className="w-full min-w-[500px]">

          <thead>

            <tr className="border-b border-purple-100 text-left text-[9px] uppercase tracking-wider text-slate-400">

              <th className="pb-3">
                Title
              </th>

              <th className="pb-3">
                Category
              </th>

              <th className="pb-3">
                Status
              </th>

              <th className="pb-3">
                Updated
              </th>

            </tr>

          </thead>

          <tbody>

            {notes.length === 0 ? (
              <tr>
                <td
                  colSpan="4"
                  className="py-8 text-center text-xs text-slate-400"
                >
                  No notes available
                </td>
              </tr>
            ) : (
              notes.map(
                (note, index) => (
                  <tr
                    key={
                      note.id ||
                      `${note.title}-${index}`
                    }
                    className="border-b border-slate-100 last:border-0"
                  >

                    <td className="py-3">

                      <div className="flex items-center gap-2">

                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                          <Icon
                            name="note"
                            size={14}
                          />
                        </div>

                        <span className="text-xs font-bold text-[#29215a]">
                          {note.title ||
                            "Untitled Note"}
                        </span>

                      </div>

                    </td>

                    <td className="py-3 text-xs text-slate-500">
                      {note.category ||
                        note.notebook ||
                        "General"}
                    </td>

                    <td className="py-3">

                      <span
                        className={`rounded-full px-3 py-1 text-[9px] font-black ${
                          note.archived
                            ? "bg-orange-100 text-orange-600"
                            : "bg-emerald-100 text-emerald-600"
                        }`}
                      >
                        {note.archived
                          ? "Archived"
                          : "Active"}
                      </span>

                    </td>

                    <td className="py-3 text-xs text-slate-500">
                      {formatDate(
                        note.updatedAt ||
                          note.createdAt
                      )}
                    </td>

                  </tr>
                )
              )
            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}

/* =========================================================
   USERS PAGE
========================================================= */

function UsersTable({
  users,
}) {
  return (
    <PageCard
      eyebrow="MANAGE"
      title="Users"
      description="Latest registered Notes Keeper accounts."
    >

      <div className="mt-6 overflow-x-auto">

        <table className="w-full min-w-[700px]">

          <thead>
            <tr className="border-b border-purple-100 text-left text-[10px] uppercase tracking-wider text-slate-400">

              <th className="pb-4">
                #
              </th>

              <th className="pb-4">
                Name
              </th>

              <th className="pb-4">
                Email
              </th>

              <th className="pb-4">
                Role
              </th>

              <th className="pb-4">
                Status
              </th>

              <th className="pb-4">
                Joined
              </th>

            </tr>
          </thead>

          <tbody>

            {users.map(
              (user, index) => (
                <tr
                  key={
                    user.id ||
                    user.email ||
                    index
                  }
                  className="border-b border-slate-100"
                >

                  <td className="py-4 text-xs text-slate-400">
                    {index + 1}
                  </td>

                  <td className="py-4 text-xs font-bold text-[#29215a]">
                    {user.name ||
                      "User"}
                  </td>

                  <td className="py-4 text-xs text-slate-500">
                    {user.email ||
                      "—"}
                  </td>

                  <td className="py-4 text-xs capitalize text-slate-500">
                    {user.role ||
                      "user"}
                  </td>

                  <td className="py-4">

                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-[9px] font-black text-emerald-600">
                      {user.status ===
                      "inactive"
                        ? "Inactive"
                        : "Active"}
                    </span>

                  </td>

                  <td className="py-4 text-xs text-slate-500">
                    {formatDate(
                      user.createdAt
                    )}
                  </td>

                </tr>
              )
            )}

          </tbody>

        </table>

        {users.length === 0 && (
          <EmptyState text="No users found." />
        )}

      </div>

    </PageCard>
  );
}

/* =========================================================
   NOTES PAGE
========================================================= */

function NotesTable({
  notes,
}) {
  return (
    <PageCard
      eyebrow="MANAGE"
      title="Notes"
      description="View and monitor all Notes Keeper notes."
    >

      <div className="mt-6 overflow-x-auto">

        <table className="w-full min-w-[650px]">

          <thead>
            <tr className="border-b border-purple-100 text-left text-[10px] uppercase tracking-wider text-slate-400">

              <th className="pb-4">
                Title
              </th>

              <th className="pb-4">
                Category
              </th>

              <th className="pb-4">
                Status
              </th>

              <th className="pb-4">
                Updated
              </th>

            </tr>
          </thead>

          <tbody>

            {notes.map(
              (note, index) => (
                <tr
                  key={
                    note.id ||
                    index
                  }
                  className="border-b border-slate-100"
                >

                  <td className="py-4 text-xs font-bold text-[#29215a]">
                    {note.title ||
                      "Untitled Note"}
                  </td>

                  <td className="py-4 text-xs text-slate-500">
                    {note.category ||
                      note.notebook ||
                      "General"}
                  </td>

                  <td className="py-4">

                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-[9px] font-black text-emerald-600">
                      {note.archived
                        ? "Archived"
                        : "Active"}
                    </span>

                  </td>

                  <td className="py-4 text-xs text-slate-500">
                    {formatDate(
                      note.updatedAt ||
                        note.createdAt
                    )}
                  </td>

                </tr>
              )
            )}

          </tbody>

        </table>

        {notes.length === 0 && (
          <EmptyState text="No notes found." />
        )}

      </div>

    </PageCard>
  );
}

/* =========================================================
   REPORTS
========================================================= */

function Reports({
  users,
  activeUsers,
  notes,
  archivedNotes,
}) {
  return (
    <div className="space-y-5">

      <PageCard
        eyebrow="ANALYTICS"
        title="Reports & Analytics"
        description="Overview of your Notes Keeper workspace."
      >

        <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

          <MiniReport
            title="Total Users"
            value={users.length}
            icon="users"
          />

          <MiniReport
            title="Active Users"
            value={activeUsers.length}
            icon="check"
          />

          <MiniReport
            title="Total Notes"
            value={notes.length}
            icon="note"
          />

          <MiniReport
            title="Archived Notes"
            value={archivedNotes.length}
            icon="archive"
          />

        </div>

      </PageCard>

    </div>
  );
}

function MiniReport({
  title,
  value,
  icon,
}) {
  return (
    <div className="rounded-[18px] bg-purple-50 p-5">

      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-purple-600 shadow-sm">

        <Icon
          name={icon}
          size={19}
        />

      </div>

      <p className="mt-4 text-xs font-bold text-slate-400">
        {title}
      </p>

      <p className="mt-1 text-3xl font-black text-[#29215a]">
        {value}
      </p>

    </div>
  );
}

/* =========================================================
   SETTINGS
========================================================= */

function Settings() {
  return (
    <PageCard
      eyebrow="SYSTEM"
      title="Settings"
      description="Administrator settings for Notes Keeper."
    >

      <div className="mt-6 space-y-3">

        <Setting
          title="Application"
          value="Notes Keeper"
        />

        <Setting
          title="Panel"
          value="Administrator"
        />

        <Setting
          title="Storage"
          value="Local Storage"
        />

        <Setting
          title="Status"
          value="Operational"
        />

      </div>

    </PageCard>
  );
}

function Setting({
  title,
  value,
}) {
  return (
    <div className="flex items-center justify-between rounded-[14px] bg-purple-50 px-5 py-4">

      <span className="text-xs font-bold text-slate-500">
        {title}
      </span>

      <span className="text-xs font-black text-[#29215a]">
        {value}
      </span>

    </div>
  );
}

/* =========================================================
   PAGE CARD
========================================================= */

function PageCard({
  eyebrow,
  title,
  description,
  children,
}) {
  return (
    <section className="rounded-[24px] border border-purple-100 bg-white p-6 shadow-[0_7px_24px_rgba(89,53,157,0.06)]">

      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-purple-500">
        {eyebrow}
      </p>

      <h2 className="mt-2 text-3xl font-black text-[#29215a]">
        {title}
      </h2>

      <p className="mt-2 text-sm text-slate-400">
        {description}
      </p>

      {children}

    </section>
  );
}

function EmptyState({
  text,
}) {
  return (
    <div className="py-12 text-center text-xs text-slate-400">
      {text}
    </div>
  );
}

/* =========================================================
   HELPERS
========================================================= */

function getDateValue(value) {
  if (!value) return 0;

  const date = new Date(value);

  const time = date.getTime();

  return Number.isNaN(time)
    ? 0
    : time;
}

function formatDate(value) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
}