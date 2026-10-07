import React from "react";
import { Link } from "react-router-dom";
import {
  Heart,
  Smile,
  TrendingUp,
  Settings,
  Users,
  FileText,
  Star,
  ArrowRight,
  Check,
  Clock3,
  Send,
  Lightbulb,
} from "lucide-react";

import Navbar from "../components/Navbar";

function About() {
  const values = [
    {
      icon: Smile,
      title: "Easy to Use",
      text: "Simple and intuitive interface for everyone.",
      bg: "bg-yellow-50",
      iconBg: "bg-yellow-100",
      color: "text-yellow-500",
    },
    {
      icon: Heart,
      title: "Beautiful Design",
      text: "A clean and modern interface you'll love.",
      bg: "bg-pink-50",
      iconBg: "bg-pink-100",
      color: "text-pink-500",
    },
    {
      icon: TrendingUp,
      title: "Productivity Focus",
      text: "Stay organized and achieve more.",
      bg: "bg-emerald-50",
      iconBg: "bg-emerald-100",
      color: "text-emerald-500",
    },
    {
      icon: Settings,
      title: "Always Improving",
      text: "New features and better experience.",
      bg: "bg-violet-50",
      iconBg: "bg-violet-100",
      color: "text-violet-600",
    },
  ];

  return (
    <div className="h-screen overflow-hidden bg-[#faf8ff] text-[#171052]">
      {/* NAVBAR */}
      <Navbar />

      {/* PAGE */}
      <main className="h-[calc(100vh-68px)] overflow-hidden px-4 py-3 sm:px-6 lg:px-8">
        <div className="mx-auto flex h-full max-w-[1380px] flex-col">

          {/* ================= HERO ================= */}
          <section className="grid min-h-0 flex-1 grid-cols-1 items-center gap-2 lg:grid-cols-[0.92fr_1.08fr]">

            {/* ================= LEFT ================= */}
            <div className="min-w-0">

              {/* Badge */}
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-violet-100 px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-wide text-violet-700">
                <Heart size={13} fill="currentColor" />
                About Notes Keeper
              </div>

              {/* Heading */}
              <h1 className="text-[43px] font-black leading-[0.96] tracking-tight sm:text-[48px] lg:text-[52px]">
                Your thoughts.
                <span className="block bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-500 bg-clip-text text-transparent">
                  Your ideas.
                </span>
                <span className="block text-[#171052]">
                  Your space.
                </span>
              </h1>

              {/* Description */}
              <p className="mt-4 max-w-[610px] text-[13px] leading-5 text-slate-600 sm:text-[14px]">
                Notes Keeper is designed to make capturing, organizing and
                managing your thoughts simple, beautiful and productive.
                Whether it's your daily tasks, creative ideas, study notes or
                personal moments — keep everything in one place.
              </p>

              {/* VALUE CARDS */}
              <div className="mt-4 grid max-w-[650px] grid-cols-2 gap-2.5">
                {values.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.title}
                      className={`flex min-h-[76px] items-center gap-3 rounded-2xl border border-purple-100 ${item.bg} px-3.5 py-2.5 shadow-sm`}
                    >
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${item.iconBg}`}
                      >
                        <Icon
                          size={21}
                          className={item.color}
                          fill={
                            item.title === "Beautiful Design"
                              ? "currentColor"
                              : "none"
                          }
                        />
                      </div>

                      <div>
                        <p className="text-[11px] font-extrabold text-[#171052] sm:text-xs">
                          {item.title}
                        </p>

                        <p className="mt-1 text-[9px] leading-3.5 text-slate-500 sm:text-[10px]">
                          {item.text}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ================= SMALLER ILLUSTRATION ================= */}
            <div className="relative flex h-full min-h-[260px] items-center justify-center">

              {/* Background glow */}
              <div className="absolute h-[250px] w-[380px] rounded-full bg-violet-200/25 blur-3xl" />

              <div className="absolute right-[10%] top-[14%] h-[220px] w-[350px] rounded-[45%] bg-gradient-to-br from-violet-100 via-purple-50 to-pink-100" />

              {/* Hearts */}
              <Heart
                size={16}
                fill="currentColor"
                className="absolute left-[15%] top-[27%] text-pink-400"
              />

              <Heart
                size={20}
                fill="currentColor"
                className="absolute right-[12%] top-[38%] text-pink-400"
              />

              <Heart
                size={14}
                fill="currentColor"
                className="absolute right-[29%] top-[12%] text-pink-300"
              />

              {/* Paper plane */}
              <Send
                size={28}
                className="absolute right-[4%] top-[12%] rotate-[-25deg] text-fuchsia-400"
              />

              {/* Dotted line */}
              <div className="absolute right-[8%] top-[17%] h-12 w-20 rounded-full border-r-2 border-t-2 border-dashed border-violet-400" />

              {/* CLOCK */}
              <div className="absolute right-[20%] top-[8%] z-30 flex h-[65px] w-[65px] items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-purple-700 shadow-lg shadow-violet-300">
                <div className="flex h-[49px] w-[49px] items-center justify-center rounded-full bg-white">
                  <Clock3
                    size={27}
                    className="text-violet-600"
                  />
                </div>
              </div>

              {/* NOTEBOOK */}
              <div className="absolute left-[28%] top-[27%] z-20 h-[190px] w-[235px] rounded-xl bg-white shadow-xl shadow-violet-300/40">

                {/* Spiral */}
                <div className="absolute -left-3 top-5 flex flex-col gap-3">
                  {[1, 2, 3, 4, 5].map((item) => (
                    <div
                      key={item}
                      className="h-[18px] w-[18px] rounded-full border-[3px] border-violet-500 bg-white"
                    />
                  ))}
                </div>

                {/* Notebook heading */}
                <div className="border-b border-violet-100 px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded bg-violet-600" />

                    <div className="h-2 w-24 rounded-full bg-violet-200" />
                  </div>

                  <div className="mt-2 h-1.5 w-20 rounded-full bg-pink-200" />
                </div>

                {/* Checklist */}
                <div className="space-y-3 px-6 py-4">
                  {[1, 2, 3].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3"
                    >
                      <div className="flex h-5 w-5 items-center justify-center rounded bg-violet-600">
                        <Check
                          size={12}
                          strokeWidth={3}
                          className="text-white"
                        />
                      </div>

                      <div className="h-2 w-28 rounded-full bg-violet-100" />
                    </div>
                  ))}
                </div>
              </div>

              {/* STICKY NOTE */}
              <div className="absolute left-[52%] top-[34%] z-40 rotate-[4deg] rounded-lg bg-yellow-100 px-3 py-2 text-center shadow-lg">
                <p className="text-[8px] font-bold leading-4 text-[#27145f]">
                  Small
                  <br />
                  Notes
                  <br />
                  Big Dreams
                </p>

                <Heart
                  size={9}
                  fill="currentColor"
                  className="mx-auto text-pink-500"
                />
              </div>

              {/* CUP */}
              <div className="absolute bottom-[16%] left-[18%] z-40">

                <div className="relative flex h-[55px] w-[55px] items-center justify-center rounded-b-xl rounded-t-lg bg-gradient-to-br from-violet-500 to-purple-700 shadow-lg">

                  <Heart
                    size={21}
                    fill="white"
                    className="text-white"
                  />

                  {/* Handle */}
                  <div className="absolute -right-4 top-3 h-6 w-5 rounded-r-full border-[4px] border-violet-600" />
                </div>

                {/* Pens */}
                <div className="absolute -top-9 left-3 flex gap-1.5">
                  <div className="h-11 w-2 rotate-[-8deg] rounded-full bg-orange-400" />
                  <div className="h-12 w-2 rotate-[4deg] rounded-full bg-pink-400" />
                  <div className="h-11 w-2 rotate-[12deg] rounded-full bg-violet-500" />
                </div>

              </div>

              {/* BOOKS */}
              <div className="absolute bottom-[17%] right-[9%] z-20 space-y-1">
                <div className="h-5 w-28 rounded-md bg-violet-400 shadow" />
                <div className="h-5 w-36 rounded-md bg-pink-300 shadow" />
                <div className="h-5 w-24 rounded-md bg-purple-300 shadow" />
              </div>

              {/* PLANT */}
              <div className="absolute bottom-[16%] right-[20%] z-30">

                {/* Pot */}
                <div className="h-[55px] w-[55px] rounded-b-2xl bg-gradient-to-b from-violet-300 to-purple-500 shadow-lg" />

                {/* Leaves */}
                <div className="absolute -top-14 left-1/2 h-16 w-16 -translate-x-1/2">

                  <span className="absolute left-5 top-3 h-12 w-5 rotate-[-35deg] rounded-full bg-emerald-400" />

                  <span className="absolute left-7 top-0 h-16 w-6 rounded-full bg-emerald-500" />

                  <span className="absolute left-10 top-4 h-12 w-5 rotate-[38deg] rounded-full bg-emerald-400" />

                  <span className="absolute left-0 top-7 h-9 w-4 rotate-[-55deg] rounded-full bg-emerald-300" />

                </div>
              </div>

              {/* Pencil */}
              <div className="absolute bottom-[19%] right-[32%] z-50 h-16 w-3 rotate-[22deg] rounded-full bg-pink-400 shadow" />

              {/* Illustration base */}
              <div className="absolute bottom-[11%] left-1/2 h-2 w-[370px] -translate-x-1/2 rounded-full bg-violet-300/80" />

            </div>
          </section>

          {/* ================= STATS ================= */}
          <section className="shrink-0 rounded-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-500 text-white shadow-lg shadow-purple-200">

            <div className="grid grid-cols-3 divide-x divide-white/20">

              {/* Happy Users */}
              <div className="flex items-center justify-center gap-3 py-2.5">

                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15">
                  <Users size={21} />
                </div>

                <div>
                  <p className="text-xl font-black">
                    1K+
                  </p>

                  <p className="text-[9px] text-purple-100">
                    Happy Users
                  </p>
                </div>

              </div>

              {/* Notes */}
              <div className="flex items-center justify-center gap-3 py-2.5">

                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15">
                  <FileText size={21} />
                </div>

                <div>
                  <p className="text-xl font-black">
                    10K+
                  </p>

                  <p className="text-[9px] text-purple-100">
                    Notes Created
                  </p>
                </div>

              </div>

              {/* Feedback */}
              <div className="flex items-center justify-center gap-3 py-2.5">

                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15">
                  <Star
                    size={21}
                    fill="currentColor"
                  />
                </div>

                <div>
                  <p className="text-xl font-black">
                    98%
                  </p>

                  <p className="text-[9px] text-purple-100">
                    Positive Feedback
                  </p>
                </div>

              </div>

            </div>
          </section>

          {/* ================= CTA ================= */}
          <section className="mt-3 shrink-0 rounded-3xl border border-violet-100 bg-gradient-to-r from-violet-100 via-purple-50 to-fuchsia-100 px-6 py-2.5">

            <div className="flex items-center justify-between">

              {/* Light bulb */}
              <div className="hidden h-12 w-12 items-center justify-center rounded-full bg-yellow-100 lg:flex">
                <Lightbulb
                  size={27}
                  className="text-yellow-500"
                  fill="currentColor"
                />
              </div>

              {/* Center content */}
              <div className="flex-1 text-center">

                <h2 className="text-lg font-black text-[#171052]">
                  Ready to organize your ideas?
                </h2>

                <p className="mt-0.5 text-[10px] text-slate-500">
                  Create your Notes Keeper workspace and keep everything in one
                  beautiful place.
                </p>

                <Link
                  to="/register"
                  className="mt-1.5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 px-5 py-2 text-[11px] font-bold text-white shadow-lg shadow-violet-200 transition hover:-translate-y-0.5"
                >
                  Get Started
                  <ArrowRight size={13} />
                </Link>

              </div>

              {/* Right sticky note */}
              <div className="hidden rotate-[5deg] rounded-lg bg-yellow-100 px-4 py-2.5 text-center shadow-lg lg:block">
                <p className="text-[9px] font-bold leading-4 text-violet-800">
                  Turn
                  <br />
                  Ideas
                  <br />
                  into
                  <br />
                  Action ♥
                </p>
              </div>

            </div>
          </section>

        </div>
      </main>
    </div>
  );
}

export default About;