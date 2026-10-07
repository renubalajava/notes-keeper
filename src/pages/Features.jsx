import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Play,
  FileText,
  BookOpen,
  Tag,
  Pin,
  Image as ImageIcon,
  Mic,
  Sparkles,
  ShieldCheck,
  Search,
  Folder,
  Archive,
  Settings,
  Bell,
  CheckSquare,
  BarChart3,
  Lightbulb,
} from "lucide-react";

import Navbar from "../components/Navbar";

function Features() {
  const features = [
    {
      icon: FileText,
      title: "Rich Note Editor",
      text: "Write, format and customize your notes with a beautiful editor.",
      bg: "bg-blue-50",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      arrowBg: "bg-blue-100",
      arrowColor: "text-blue-600",
    },
    {
      icon: BookOpen,
      title: "Notebooks",
      text: "Organize notes using notebooks and categories.",
      bg: "bg-pink-50",
      iconBg: "bg-pink-100",
      iconColor: "text-pink-600",
      arrowBg: "bg-pink-100",
      arrowColor: "text-pink-600",
    },
    {
      icon: Tag,
      title: "Tags & Search",
      text: "Easily find notes with tags and powerful search.",
      bg: "bg-cyan-50",
      iconBg: "bg-cyan-100",
      iconColor: "text-cyan-600",
      arrowBg: "bg-cyan-100",
      arrowColor: "text-cyan-600",
    },
    {
      icon: Pin,
      title: "Pin Important Notes",
      text: "Keep your important notes always at the top.",
      bg: "bg-orange-50",
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
      arrowBg: "bg-orange-100",
      arrowColor: "text-orange-600",
    },
    {
      icon: ImageIcon,
      title: "Images & Attachments",
      text: "Add images and files to your notes easily.",
      bg: "bg-violet-50",
      iconBg: "bg-violet-100",
      iconColor: "text-violet-600",
      arrowBg: "bg-violet-100",
      arrowColor: "text-violet-600",
    },
    {
      icon: Mic,
      title: "Voice Notes",
      text: "Convert your voice to text and save your ideas quickly.",
      bg: "bg-purple-50",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      arrowBg: "bg-purple-100",
      arrowColor: "text-purple-600",
    },
    {
      icon: Sparkles,
      title: "AI Assistant",
      text: "Summarize, improve writing, generate titles and tags.",
      bg: "bg-indigo-50",
      iconBg: "bg-indigo-100",
      iconColor: "text-indigo-600",
      arrowBg: "bg-indigo-100",
      arrowColor: "text-indigo-600",
    },
    {
      icon: ShieldCheck,
      title: "Secure & Private",
      text: "Your notes are safe, secure and only accessible to you.",
      bg: "bg-emerald-50",
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
      arrowBg: "bg-emerald-100",
      arrowColor: "text-emerald-600",
    },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f8f5ff] text-[#17134f]">

      {/* =====================================================
          NAVBAR
      ====================================================== */}
      <Navbar />

      {/* =====================================================
          MAIN PAGE
      ====================================================== */}
      <main className="lg:h-[calc(100vh-76px)] lg:overflow-hidden">

        <div className="mx-auto flex h-full max-w-[1500px] flex-col px-5 py-5 sm:px-8 lg:px-10 lg:py-4">

          {/* =================================================
              HERO SECTION
          ================================================== */}
          <section className="grid flex-shrink-0 items-center gap-4 lg:grid-cols-[0.92fr_1.08fr]">

            {/* LEFT CONTENT */}
            <div className="relative z-10 pl-1 lg:pl-4">

              {/* Badge */}
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-violet-100 px-4 py-2 text-[10px] font-extrabold uppercase tracking-[0.12em] text-violet-700">
                <Sparkles size={13} />
                Powerful Features
              </div>

              {/* Heading */}
              <h1 className="max-w-[650px] text-[34px] font-black leading-[1.04] tracking-[-0.035em] text-[#11104b] sm:text-[42px] lg:text-[48px]">

                Everything you need to

                <span className="block bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-500 bg-clip-text text-transparent">
                  stay organized
                </span>

              </h1>

              {/* Description */}
              <p className="mt-4 max-w-[570px] text-[13px] leading-5 text-slate-600 sm:text-[14px]">
                Notes Keeper comes with powerful features to help you
                capture, organize and manage your ideas easily.
              </p>

              {/* Buttons */}
              <div className="mt-5 flex flex-wrap items-center gap-3">

                <Link
                  to="/register"
                  className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-6 py-3 text-[12px] font-bold text-white shadow-lg shadow-purple-200 transition duration-300 hover:-translate-y-0.5 hover:shadow-xl"
                >
                  Get Started

                  <ArrowRight
                    size={15}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </Link>

                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-xl border border-violet-200 bg-white px-6 py-3 text-[12px] font-bold text-violet-700 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-violet-300 hover:shadow-md"
                >
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-violet-100">
                    <Play
                      size={10}
                      fill="currentColor"
                      className="ml-[1px]"
                    />
                  </span>

                  Watch Demo
                </button>

              </div>
            </div>

            {/* =================================================
                RIGHT PRODUCT MOCKUP
            ================================================== */}
            <div className="relative hidden h-[300px] items-center justify-center lg:flex">

              {/* Background glow */}
              <div className="absolute left-1/2 top-1/2 h-[280px] w-[280px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-300/30 blur-[70px]" />

              {/* Large circle */}
              <div className="absolute right-[7%] top-[8%] h-[230px] w-[230px] rounded-full bg-purple-200/35 blur-[2px]" />

              {/* =================================================
                  DASHBOARD WINDOW
              ================================================== */}
              <div className="relative w-[500px] rotate-[-2deg] rounded-[25px] border border-white/90 bg-white/90 p-3 shadow-[0_25px_60px_rgba(91,56,180,0.20)] backdrop-blur-sm">

                {/* Top browser bar */}
                <div className="flex items-center gap-1.5 px-2 py-1">

                  <span className="h-2.5 w-2.5 rounded-full bg-pink-300" />
                  <span className="h-2.5 w-2.5 rounded-full bg-purple-300" />
                  <span className="h-2.5 w-2.5 rounded-full bg-yellow-300" />

                  <div className="ml-4 h-6 flex-1 rounded-full bg-violet-50 px-3">
                    <div className="flex h-full items-center text-[7px] text-violet-300">
                      noteskeeper.app
                    </div>
                  </div>

                </div>

                {/* Dashboard */}
                <div className="mt-2 flex overflow-hidden rounded-[18px] border border-violet-100 bg-[#faf9ff]">

                  {/* ================= SIDEBAR ================= */}
                  <div className="w-[92px] flex-shrink-0 bg-gradient-to-b from-violet-600 to-purple-700 p-3">

                    {/* Mini logo */}
                    <div className="mb-5 flex items-center gap-1.5">
                      <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-white">
                        <FileText
                          size={12}
                          className="text-violet-600"
                        />
                      </div>

                      <span className="text-[8px] font-black text-white">
                        Notes
                      </span>
                    </div>

                    {/* Sidebar links */}
                    <div className="space-y-1.5">

                      <div className="flex items-center gap-2 rounded-lg bg-white/20 px-2 py-2 text-[7px] font-bold text-white">
                        <FileText size={10} />
                        All Notes
                      </div>

                      <div className="flex items-center gap-2 px-2 py-2 text-[7px] text-purple-100">
                        <Folder size={10} />
                        Notebooks
                      </div>

                      <div className="flex items-center gap-2 px-2 py-2 text-[7px] text-purple-100">
                        <Tag size={10} />
                        Tags
                      </div>

                      <div className="flex items-center gap-2 px-2 py-2 text-[7px] text-purple-100">
                        <Archive size={10} />
                        Archive
                      </div>

                      <div className="flex items-center gap-2 px-2 py-2 text-[7px] text-purple-100">
                        <Settings size={10} />
                        Settings
                      </div>

                    </div>
                  </div>

                  {/* ================= CONTENT ================= */}
                  <div className="min-w-0 flex-1 p-3">

                    {/* Header */}
                    <div className="flex items-center gap-2">

                      <div className="flex h-7 flex-1 items-center gap-2 rounded-lg bg-violet-50 px-2.5">
                        <Search
                          size={11}
                          className="text-violet-400"
                        />

                        <span className="text-[7px] text-violet-300">
                          Search notes...
                        </span>
                      </div>

                      <Bell
                        size={13}
                        className="text-violet-400"
                      />

                      <div className="h-6 w-6 rounded-full bg-gradient-to-br from-violet-400 to-fuchsia-400" />

                    </div>

                    {/* Note Cards */}
                    <div className="mt-3 grid grid-cols-3 gap-2">

                      {/* Note 1 */}
                      <div className="rounded-xl border border-orange-100 bg-orange-50 p-2.5">

                        <div className="mb-2 flex h-6 w-6 items-center justify-center rounded-lg bg-orange-100">
                          <Folder
                            size={12}
                            className="text-orange-500"
                          />
                        </div>

                        <div className="h-1.5 w-12 rounded-full bg-orange-200" />
                        <div className="mt-1 h-1 w-8 rounded-full bg-orange-100" />

                      </div>

                      {/* Note 2 */}
                      <div className="rounded-xl border border-pink-100 bg-pink-50 p-2.5">

                        <div className="mb-2 flex h-6 w-6 items-center justify-center rounded-lg bg-pink-100">
                          <Tag
                            size={12}
                            className="text-pink-500"
                          />
                        </div>

                        <div className="h-1.5 w-12 rounded-full bg-pink-200" />
                        <div className="mt-1 h-1 w-9 rounded-full bg-pink-100" />

                      </div>

                      {/* Note 3 */}
                      <div className="rounded-xl border border-blue-100 bg-blue-50 p-2.5">

                        <div className="mb-2 flex h-6 w-6 items-center justify-center rounded-lg bg-blue-100">
                          <Pin
                            size={12}
                            className="text-blue-500"
                          />
                        </div>

                        <div className="h-1.5 w-12 rounded-full bg-blue-200" />
                        <div className="mt-1 h-1 w-8 rounded-full bg-blue-100" />

                      </div>

                    </div>

                    {/* Bottom cards */}
                    <div className="mt-2 grid grid-cols-2 gap-2">

                      {/* Image card */}
                      <div className="flex h-[62px] items-center gap-2 rounded-xl border border-violet-100 bg-violet-50 p-2">

                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white">
                          <ImageIcon
                            size={17}
                            className="text-violet-400"
                          />
                        </div>

                        <div>
                          <div className="h-1.5 w-16 rounded-full bg-violet-200" />
                          <div className="mt-2 h-1 w-10 rounded-full bg-violet-100" />
                        </div>

                      </div>

                      {/* Checklist */}
                      <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-2">

                        <div className="flex items-center gap-2">

                          <CheckSquare
                            size={16}
                            className="text-indigo-400"
                          />

                          <div>
                            <div className="h-1.5 w-16 rounded-full bg-indigo-200" />
                            <div className="mt-2 h-1 w-10 rounded-full bg-indigo-100" />
                          </div>

                        </div>

                        <div className="mt-2 flex gap-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-indigo-300" />
                          <span className="h-1.5 w-10 rounded-full bg-indigo-100" />
                        </div>

                      </div>

                    </div>

                  </div>
                </div>
              </div>

              {/* =================================================
                  FLOATING ELEMENTS
              ================================================== */}

              {/* Sparkle */}
              <div className="absolute left-[4%] top-[38%] flex h-12 w-12 rotate-[-8deg] items-center justify-center rounded-xl border border-white bg-white shadow-lg">
                <Sparkles
                  size={20}
                  className="text-orange-400"
                />
              </div>

              {/* Chart */}
              <div className="absolute bottom-[5%] left-[8%] flex h-12 w-12 rotate-[-8deg] items-center justify-center rounded-xl border border-white bg-white shadow-lg">
                <BarChart3
                  size={20}
                  className="text-violet-500"
                />
              </div>

              {/* Lightbulb */}
              <div className="absolute right-[1%] top-[30%] flex h-12 w-12 rotate-[5deg] items-center justify-center rounded-xl border border-white bg-pink-100 shadow-lg">
                <Lightbulb
                  size={21}
                  className="text-pink-500"
                />
              </div>

              {/* Sticky note */}
              <div className="absolute -bottom-1 right-[6%] w-[95px] rotate-[5deg] rounded-xl bg-[#fff8c9] p-3 shadow-lg">

                <p className="font-serif text-[10px] font-bold leading-4 text-slate-700">
                  Capture
                  <br />
                  Organize
                  <br />
                  Create
                  <br />
                  Grow
                  <span className="ml-1 text-pink-500">♥</span>
                </p>

              </div>

              {/* Plant */}
              <div className="absolute -bottom-1 -right-2">

                <div className="relative">

                  <div className="absolute bottom-5 left-2 h-10 w-4 rotate-[-25deg] rounded-full bg-violet-400" />
                  <div className="absolute bottom-8 left-5 h-12 w-4 rotate-[15deg] rounded-full bg-purple-500" />
                  <div className="absolute bottom-6 left-8 h-9 w-4 rotate-[35deg] rounded-full bg-violet-300" />

                  <div className="h-7 w-12 rounded-b-xl bg-purple-200" />

                </div>

              </div>

            </div>
          </section>

          {/* =================================================
              FEATURE CARDS
          ================================================== */}
          <section className="mt-4 grid flex-1 grid-cols-2 gap-2.5 lg:grid-cols-4 lg:gap-3">

            {features.map((feature) => {

              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className={`group relative min-h-[100px] rounded-[19px] border border-white/80 ${feature.bg} p-4 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg`}
                >

                  {/* Icon */}
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${feature.iconBg} ${feature.iconColor}`}
                  >
                    <Icon size={20} />
                  </div>

                  {/* Arrow */}
                  <div
                    className={`absolute right-4 top-[43px] flex h-7 w-7 items-center justify-center rounded-full ${feature.arrowBg} ${feature.arrowColor} opacity-80 transition duration-300 group-hover:translate-x-1`}
                  >
                    <ArrowRight size={13} />
                  </div>

                  {/* Title */}
                  <h3 className="mt-3 pr-7 text-[13px] font-black tracking-tight text-[#15124e]">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="mt-1.5 max-w-[240px] text-[10px] leading-[1.45] text-slate-600">
                    {feature.text}
                  </p>

                </div>
              );
            })}

          </section>

        </div>
      </main>
    </div>
  );
}

export default Features;