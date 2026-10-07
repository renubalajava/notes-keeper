import React from "react";
import { Link } from "react-router-dom";
import {
  UserPlus,
  FilePenLine,
  FolderKanban,
  TrendingUp,
  ArrowRight,
  Sparkles,
  Zap,
  FileText,
  Folder,
  Check,
  Heart,
  Search,
  Bell,
  LayoutDashboard,
  Pin,
} from "lucide-react";

import Navbar from "../components/Navbar";

function HowItWorks() {
  const steps = [
    {
      number: "01",
      icon: UserPlus,
      title: "Create Your Account",
      description: "Sign up in seconds and get started with Notes Keeper.",
      badge: "Quick & Easy Setup",
      badgeIcon: Zap,
      numberBg: "from-violet-600 to-purple-600",
      iconBg: "bg-violet-100",
      iconColor: "text-violet-600",
      badgeBg: "bg-violet-50 text-violet-600",
      platform: "from-violet-400 to-purple-500",
    },
    {
      number: "02",
      icon: FilePenLine,
      title: "Create Notes",
      description: "Capture thoughts, ideas, tasks and everything important.",
      badge: "Capture Anything",
      badgeIcon: FileText,
      numberBg: "from-pink-500 to-fuchsia-500",
      iconBg: "bg-pink-100",
      iconColor: "text-pink-600",
      badgeBg: "bg-pink-50 text-pink-600",
      platform: "from-pink-400 to-fuchsia-500",
    },
    {
      number: "03",
      icon: FolderKanban,
      title: "Organize & Manage",
      description: "Use notebooks, tags and pins to keep everything organized.",
      badge: "Stay Organized",
      badgeIcon: Folder,
      numberBg: "from-orange-400 to-amber-500",
      iconBg: "bg-orange-100",
      iconColor: "text-orange-500",
      badgeBg: "bg-orange-50 text-orange-600",
      platform: "from-orange-300 to-amber-400",
    },
    {
      number: "04",
      icon: TrendingUp,
      title: "Stay Productive",
      description: "Find your notes quickly and turn ideas into action.",
      badge: "Achieve More",
      badgeIcon: TrendingUp,
      numberBg: "from-emerald-400 to-teal-500",
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
      badgeBg: "bg-emerald-50 text-emerald-600",
      platform: "from-emerald-300 to-teal-400",
    },
  ];

  return (
    <div className="h-[100dvh] w-full overflow-hidden bg-[#faf8ff] text-[#12163f]">

      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <Navbar />

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="relative h-[calc(100dvh-82px)] overflow-hidden">

        {/* ===================================================
            BACKGROUND GLOWS
        =================================================== */}

        <div className="pointer-events-none absolute -left-40 top-10 h-[420px] w-[420px] rounded-full bg-violet-300/25 blur-3xl" />

        <div className="pointer-events-none absolute -right-40 top-10 h-[420px] w-[420px] rounded-full bg-pink-200/30 blur-3xl" />

        <div className="pointer-events-none absolute left-1/2 top-[45%] h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-purple-200/20 blur-3xl" />

        {/* ===================================================
            3D GRID FLOOR
        =================================================== */}

        <div
          className="pointer-events-none absolute bottom-[-110px] left-[-15%] h-[360px] w-[130%] opacity-50"
          style={{
            transform: "perspective(500px) rotateX(62deg)",
            backgroundImage: `
              linear-gradient(
                rgba(124,58,237,0.20) 1px,
                transparent 1px
              ),
              linear-gradient(
                90deg,
                rgba(124,58,237,0.20) 1px,
                transparent 1px
              )
            `,
            backgroundSize: "42px 42px",
            maskImage: "linear-gradient(to top, black, transparent)",
            WebkitMaskImage:
              "linear-gradient(to top, black, transparent)",
          }}
        />

        {/* ===================================================
            FLOATING NOTE - LEFT
        =================================================== */}

        <div
          className="
            absolute
            left-[6%]
            top-[9%]
            hidden
            h-[86px]
            w-[70px]
            rotate-[-9deg]
            items-center
            justify-center
            rounded-[22px]
            border
            border-white
            bg-white/85
            shadow-[0_20px_45px_rgba(100,50,200,0.18)]
            backdrop-blur-xl
            lg:flex
          "
        >
          <div className="flex flex-col items-center gap-1.5 text-purple-500">
            <FileText size={27} />

            <span className="h-1 w-9 rounded-full bg-purple-300" />
            <span className="h-1 w-6 rounded-full bg-purple-200" />
            <span className="h-1 w-10 rounded-full bg-purple-300" />
          </div>
        </div>

        {/* ===================================================
            FLOATING FOLDER - RIGHT
        =================================================== */}

        <div
          className="
            absolute
            right-[6%]
            top-[10%]
            hidden
            h-[70px]
            w-[84px]
            rotate-[7deg]
            items-center
            justify-center
            rounded-[22px]
            border
            border-white
            bg-white/85
            text-purple-500
            shadow-[0_20px_45px_rgba(100,50,200,0.18)]
            backdrop-blur-xl
            lg:flex
          "
        >
          <Folder size={31} />

          <Heart
            size={12}
            className="
              absolute
              bottom-2
              right-3
              fill-pink-300
              text-pink-500
            "
          />
        </div>

        {/* Decorative sparkles */}

        <Sparkles
          size={19}
          className="absolute left-[16%] top-[31%] text-purple-400"
        />

        <Sparkles
          size={18}
          className="absolute right-[15%] top-[32%] text-pink-400"
        />

        {/* ===================================================
            HERO
        =================================================== */}

        <section className="relative z-10 flex h-[31%] items-center justify-center px-5">

          <div className="text-center">

            {/* Badge */}

            <div
              className="
                mx-auto
                mb-3
                flex
                w-fit
                items-center
                gap-2
                rounded-full
                border
                border-purple-200
                bg-white/80
                px-5
                py-1.5
                text-[10px]
                font-black
                tracking-[0.2em]
                text-purple-600
                shadow-sm
                backdrop-blur-xl
              "
            >
              <Sparkles size={13} />

              HOW IT WORKS
            </div>

            {/* Heading */}

            <h1
              className="
                text-5xl
                font-black
                leading-none
                tracking-[-2.5px]
                text-slate-900
                sm:text-[56px]
                lg:text-[62px]
              "
            >
              How{" "}

              <span
                className="
                  bg-gradient-to-r
                  from-violet-600
                  via-fuchsia-500
                  to-purple-600
                  bg-clip-text
                  text-transparent
                "
              >
                Notes Keeper
              </span>

              {" "}Works
            </h1>

            {/* Subtitle */}

            <p className="mt-4 text-sm text-slate-500 sm:text-base">
              Start organizing your thoughts in just a few simple steps.
            </p>

          </div>
        </section>

        {/* ===================================================
            FOUR STEPS
        =================================================== */}

        <section className="relative z-20 h-[44%] px-5 lg:px-8">

          <div
            className="
              mx-auto
              grid
              h-full
              max-w-[1420px]
              grid-cols-4
              gap-4
            "
          >

            {steps.map((step, index) => {
              const Icon = step.icon;
              const BadgeIcon = step.badgeIcon;

              return (
                <div
                  key={step.number}
                  className="group relative flex h-full items-center"
                >

                  {/* Connecting arrow */}

                  {index < 3 && (
                    <div
                      className="
                        absolute
                        -right-5
                        top-1/2
                        z-40
                        hidden
                        -translate-y-1/2
                        lg:block
                      "
                    >
                      <ArrowRight
                        size={26}
                        strokeWidth={2}
                        className="
                          text-purple-400
                          transition-all
                          duration-300
                          group-hover:translate-x-1
                        "
                      />
                    </div>
                  )}

                  {/* Card */}

                  <div
                    className="
                      relative
                      flex
                      h-[90%]
                      w-full
                      flex-col
                      items-center
                      justify-center
                      rounded-[28px]
                      border
                      border-white
                      bg-white/90
                      px-5
                      text-center
                      shadow-[0_18px_45px_rgba(80,50,150,0.10)]
                      backdrop-blur-xl
                      transition-all
                      duration-500
                      hover:-translate-y-4
                      hover:shadow-[0_30px_70px_rgba(100,40,220,0.20)]
                    "
                  >

                    {/* Number */}

                    <div
                      className={`
                        absolute
                        -top-5
                        flex
                        h-11
                        w-11
                        items-center
                        justify-center
                        rounded-full
                        bg-gradient-to-br
                        ${step.numberBg}
                        text-xs
                        font-black
                        text-white
                        shadow-lg
                      `}
                    >
                      {step.number}
                    </div>

                    {/* Main Icon */}

                    <div
                      className={`
                        mb-4
                        flex
                        h-[72px]
                        w-[72px]
                        items-center
                        justify-center
                        rounded-[23px]
                        ${step.iconBg}
                        ${step.iconColor}
                        shadow-inner
                        transition-all
                        duration-500
                        group-hover:scale-110
                        group-hover:rotate-3
                      `}
                    >
                      <Icon size={35} strokeWidth={2} />
                    </div>

                    {/* Title */}

                    <h3
                      className="
                        text-[17px]
                        font-black
                        text-slate-900
                        lg:text-[18px]
                      "
                    >
                      {step.title}
                    </h3>

                    {/* Description */}

                    <p
                      className="
                        mt-2
                        max-w-[235px]
                        text-[11px]
                        leading-5
                        text-slate-500
                        lg:text-xs
                      "
                    >
                      {step.description}
                    </p>

                    {/* Badge */}

                    <div
                      className={`
                        mt-4
                        flex
                        items-center
                        gap-1.5
                        rounded-full
                        px-3.5
                        py-1.5
                        text-[9px]
                        font-bold
                        ${step.badgeBg}
                      `}
                    >
                      <BadgeIcon size={12} />

                      {step.badge}
                    </div>

                    {/* 3D platform */}

                    <div
                      className={`
                        absolute
                        -bottom-1
                        left-[10%]
                        right-[10%]
                        h-2.5
                        rounded-full
                        bg-gradient-to-r
                        ${step.platform}
                        opacity-70
                        blur-[1px]
                      `}
                    />

                  </div>
                </div>
              );
            })}

          </div>
        </section>

        {/* ===================================================
            BOTTOM PREMIUM CTA
        =================================================== */}

        <section className="relative z-30 h-[25%] px-5 pb-4 lg:px-8">

          <div
            className="
              relative
              mx-auto
              flex
              h-full
              max-w-[1420px]
              items-center
              justify-between
              overflow-hidden
              rounded-[28px]
              border
              border-white
              bg-gradient-to-r
              from-white
              via-purple-50
              to-violet-100
              px-7
              shadow-[0_20px_55px_rgba(80,50,150,0.12)]
            "
          >

            {/* Background glow */}

            <div
              className="
                pointer-events-none
                absolute
                right-0
                top-0
                h-full
                w-[55%]
                bg-purple-200/25
                blur-3xl
              "
            />

            {/* CTA content */}

            <div className="relative z-10">

              <div
                className="
                  flex
                  items-center
                  gap-1.5
                  text-[9px]
                  font-black
                  tracking-[0.16em]
                  text-purple-600
                "
              >
                <Sparkles size={12} />

                ALL IN ONE PLACE
              </div>

              <h2
                className="
                  mt-1
                  text-xl
                  font-black
                  text-slate-900
                  sm:text-2xl
                  lg:text-[27px]
                "
              >
                Everything You Need to Stay Organized
              </h2>

              <p className="mt-1 text-[10px] text-slate-500 sm:text-xs">
                Create, manage and access your notes beautifully.
              </p>

            </div>

            {/* =================================================
                DASHBOARD PREVIEW
            ================================================= */}

            <div className="relative z-10 hidden items-center gap-5 md:flex">

              {/* Dashboard */}

              <div
                className="
                  relative
                  flex
                  h-[82px]
                  w-[225px]
                  overflow-hidden
                  rounded-[18px]
                  border
                  border-white
                  bg-white
                  p-2
                  shadow-[0_18px_35px_rgba(80,40,150,0.15)]
                  transition-all
                  duration-500
                  hover:-translate-y-2
                "
              >

                {/* Mini sidebar */}

                <div
                  className="
                    flex
                    w-[32px]
                    shrink-0
                    flex-col
                    items-center
                    gap-2
                    rounded-xl
                    bg-gradient-to-b
                    from-purple-600
                    to-violet-700
                    py-2
                  "
                >
                  <FileText
                    size={12}
                    className="text-white"
                  />

                  <span className="h-1 w-3 rounded bg-white/60" />
                  <span className="h-1 w-3 rounded bg-white/60" />
                  <span className="h-1 w-3 rounded bg-white/60" />
                  <span className="h-1 w-3 rounded bg-white/60" />
                  <span className="h-1 w-3 rounded bg-white/60" />

                </div>

                {/* Main dashboard */}

                <div className="flex flex-1 flex-col gap-2 px-2">

                  {/* Search */}

                  <div className="flex items-center gap-1">

                    <div
                      className="
                        flex
                        h-4
                        flex-1
                        items-center
                        gap-1
                        rounded
                        bg-purple-50
                        px-1
                      "
                    >
                      <Search
                        size={7}
                        className="text-purple-400"
                      />

                      <span className="text-[5px] text-purple-300">
                        Search notes...
                      </span>
                    </div>

                    <Bell
                      size={8}
                      className="text-purple-400"
                    />

                    <div className="h-4 w-4 rounded-full bg-gradient-to-br from-purple-300 to-purple-500" />

                  </div>

                  {/* Category cards */}

                  <div className="grid grid-cols-4 gap-1">

                    <div className="flex h-7 items-center justify-center rounded-md bg-purple-50">
                      <FileText
                        size={10}
                        className="text-purple-500"
                      />
                    </div>

                    <div className="flex h-7 items-center justify-center rounded-md bg-pink-50">
                      <Heart
                        size={9}
                        className="text-pink-500"
                      />
                    </div>

                    <div className="flex h-7 items-center justify-center rounded-md bg-blue-50">
                      <Folder
                        size={10}
                        className="text-blue-500"
                      />
                    </div>

                    <div className="flex h-7 items-center justify-center rounded-md bg-emerald-50">
                      <TrendingUp
                        size={10}
                        className="text-emerald-500"
                      />
                    </div>

                  </div>

                  {/* Note rows */}

                  <div className="flex gap-1">

                    <div className="h-2 flex-1 rounded bg-purple-100" />

                    <div className="h-2 w-10 rounded bg-pink-100" />

                  </div>

                  <div className="flex gap-1">

                    <div className="h-2 w-2/3 rounded bg-slate-100" />

                    <div className="h-2 flex-1 rounded bg-emerald-100" />

                  </div>

                </div>

                {/* Floating check */}

                <div
                  className="
                    absolute
                    -right-1
                    -top-1
                    flex
                    h-6
                    w-6
                    items-center
                    justify-center
                    rounded-full
                    bg-emerald-400
                    text-white
                    shadow-lg
                  "
                >
                  <Check size={12} />
                </div>

              </div>

              {/* Get Started */}

              <Link
                to="/register"
                className="
                  flex
                  items-center
                  gap-2
                  rounded-2xl
                  bg-gradient-to-r
                  from-violet-600
                  via-purple-600
                  to-fuchsia-500
                  px-6
                  py-3.5
                  text-xs
                  font-black
                  text-white
                  shadow-[0_12px_30px_rgba(117,38,255,0.30)]
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:shadow-[0_18px_40px_rgba(117,38,255,0.40)]
                "
              >
                Get Started

                <ArrowRight size={16} />
              </Link>

            </div>

            {/* Mobile button */}

            <Link
              to="/register"
              className="
                relative
                z-10
                flex
                shrink-0
                items-center
                gap-1
                rounded-xl
                bg-gradient-to-r
                from-violet-600
                to-fuchsia-500
                px-4
                py-2.5
                text-[10px]
                font-black
                text-white
                shadow-lg
                md:hidden
              "
            >
              Start

              <ArrowRight size={13} />
            </Link>

          </div>
        </section>

        {/* ===================================================
            EXTRA FLOATING ICONS
        =================================================== */}

        <div
          className="
            absolute
            bottom-[15%]
            left-[3%]
            hidden
            h-10
            w-10
            items-center
            justify-center
            rounded-xl
            border
            border-white
            bg-white/90
            text-pink-500
            shadow-xl
            lg:flex
          "
        >
          <Pin size={17} />
        </div>

        <div
          className="
            absolute
            bottom-[14%]
            right-[3%]
            hidden
            h-11
            w-11
            rotate-[-12deg]
            items-center
            justify-center
            rounded-xl
            border
            border-white
            bg-white/90
            text-purple-500
            shadow-xl
            lg:flex
          "
        >
          <LayoutDashboard size={18} />
        </div>

      </main>
    </div>
  );
}

export default HowItWorks;