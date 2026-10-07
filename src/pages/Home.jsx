import React from "react";
import { Link } from "react-router-dom";

import {
  ArrowRight,
  Play,
  Sparkles,
  Check,
  Crown,
  FileText,
  Folder,
  Tag,
  Star,
  Mic,
  Cloud,
  ShieldCheck,
  Zap,
} from "lucide-react";

import Navbar from "../components/Navbar";

function Home() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#faf8ff] text-slate-900">

      {/* ================= NAVBAR ================= */}

      <Navbar />

      {/* ================= MAIN ================= */}

      <main className="relative">

        {/* Background decorations */}

        <div className="pointer-events-none absolute left-[-180px] top-[100px] h-[500px] w-[500px] rounded-full bg-purple-200/25 blur-[120px]" />

        <div className="pointer-events-none absolute right-[-180px] top-[40px] h-[520px] w-[520px] rounded-full bg-fuchsia-200/20 blur-[130px]" />

        <div className="pointer-events-none absolute bottom-[200px] left-[35%] h-[400px] w-[600px] rounded-full bg-violet-200/20 blur-[120px]" />

        {/* =====================================================
            HERO SECTION
        ====================================================== */}

        <section className="relative mx-auto max-w-[1500px] px-6 pb-14 pt-10 sm:px-8 lg:px-12 xl:px-16">

          <div className="grid items-center gap-10 lg:grid-cols-[45%_55%]">

            {/* =================================================
                LEFT CONTENT
            ================================================= */}

            <div className="relative z-20 py-8 lg:py-12">

              {/* Badge */}

              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-purple-200 bg-white/90 px-4 py-2 text-xs font-bold tracking-wide text-purple-700 shadow-sm backdrop-blur">

                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-purple-100">
                  <Sparkles size={12} />
                </span>

                YOUR PERSONAL NOTES SPACE

              </div>

              {/* Heading */}

              <h1 className="max-w-[650px] text-[48px] font-extrabold leading-[1.02] tracking-[-2.5px] text-slate-950 sm:text-[56px] xl:text-[64px]">

                A Calm Space

                <br />

                <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-500 bg-clip-text text-transparent">
                  for Your Ideas.
                </span>

              </h1>

              {/* Description */}

              <p className="mt-6 max-w-[560px] text-[16px] leading-7 text-slate-500">
                Notes Keeper helps you capture thoughts, organize your notes
                and focus on what matters most.
              </p>

              {/* CTA Buttons */}

              <div className="mt-8 flex flex-wrap items-center gap-3">

                <Link
                  to="/register"
                  className="group inline-flex h-[52px] items-center gap-3 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-7 text-sm font-bold text-white shadow-lg shadow-purple-200 transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  Get Started Free

                  <ArrowRight
                    size={18}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </Link>

                <Link
                  to="/how-it-works"
                  className="inline-flex h-[52px] items-center gap-3 rounded-xl border border-slate-200 bg-white px-6 text-sm font-bold text-slate-700 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-purple-300 hover:text-purple-700 hover:shadow-md"
                >

                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                    <Play size={12} fill="currentColor" />
                  </span>

                  Watch Demo

                </Link>

              </div>

              {/* Trust Badges */}

              <div className="mt-7 flex flex-wrap gap-3">

                <TrustBadge
                  icon={<Zap size={15} />}
                  text="Easy to Use"
                />

                <TrustBadge
                  icon={<ShieldCheck size={15} />}
                  text="100% Secure"
                />

                <TrustBadge
                  icon={<Cloud size={15} />}
                  text="Access Anywhere"
                />

              </div>

            </div>

            {/* =================================================
                RIGHT VISUAL
            ================================================= */}

            <div className="relative min-h-[600px]">

              {/* Glow behind image */}

              <div className="absolute left-[5%] top-[8%] h-[520px] w-[600px] rounded-full bg-purple-200/35 blur-[100px]" />

              {/* Girl Image */}

              <img
                src="/home-girl.png"
                alt="Woman using Notes Keeper"
                className="relative z-10 mx-auto mt-2 w-full max-w-[680px] object-contain"
              />

              {/* =================================================
                  PREMIUM CARD
              ================================================= */}

              <div className="absolute left-[4%] top-[11%] z-30 w-[185px] rotate-[-5deg] rounded-2xl border border-white/90 bg-white/95 p-4 shadow-[0_18px_40px_rgba(76,29,149,0.16)] backdrop-blur-xl">

                <div className="flex items-center gap-2">

                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-sm">
                    <Crown size={15} fill="currentColor" />
                  </div>

                  <span className="text-sm font-bold text-slate-800">
                    Premium
                  </span>

                </div>

                <div className="mt-3 space-y-2.5">

                  <PremiumRow text="Unlimited Notes" />

                  <PremiumRow text="AI Assistant" />

                  <PremiumRow text="Voice Notes" />

                  <PremiumRow text="Priority Support" />

                </div>

              </div>

              {/* =================================================
                  RIGHT BENEFITS
              ================================================= */}

              <div className="absolute right-0 top-[18%] z-30 hidden space-y-3 xl:block">

                <BenefitCard
                  icon={<FileText size={19} />}
                  title="Organize Easily"
                  iconBg="bg-pink-100"
                  iconColor="text-pink-600"
                />

                <BenefitCard
                  icon={<Star size={19} />}
                  title="Stay Productive"
                  iconBg="bg-purple-100"
                  iconColor="text-purple-600"
                />

                <BenefitCard
                  icon={<Cloud size={19} />}
                  title="Access Anywhere"
                  iconBg="bg-indigo-100"
                  iconColor="text-indigo-600"
                />

                <BenefitCard
                  icon={<ShieldCheck size={19} />}
                  title="100% Private"
                  iconBg="bg-blue-100"
                  iconColor="text-blue-600"
                />

              </div>

              {/* =================================================
                  STATISTICS
              ================================================= */}

              <div className="absolute bottom-[15px] left-1/2 z-30 w-[700px] max-w-[92%] -translate-x-1/2 rounded-2xl border border-white/90 bg-white/90 p-3 shadow-[0_18px_45px_rgba(76,29,149,0.15)] backdrop-blur-xl">

                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">

                  <StatCard
                    icon={<FileText size={18} />}
                    value="24"
                    label="Total Notes"
                    iconBg="bg-blue-100"
                    iconColor="text-blue-600"
                  />

                  <StatCard
                    icon={<Folder size={18} />}
                    value="08"
                    label="Notebooks"
                    iconBg="bg-purple-100"
                    iconColor="text-purple-600"
                  />

                  <StatCard
                    icon={<Tag size={18} />}
                    value="12"
                    label="Tags"
                    iconBg="bg-violet-100"
                    iconColor="text-violet-600"
                  />

                  <StatCard
                    icon={<Star size={18} />}
                    value="06"
                    label="Pinned"
                    iconBg="bg-emerald-100"
                    iconColor="text-emerald-600"
                  />

                </div>

              </div>

            </div>

          </div>

        </section>

        {/* =====================================================
            FEATURES
        ====================================================== */}

        <section className="relative mx-auto max-w-[1450px] px-6 pb-16 sm:px-8 lg:px-12 xl:px-16">

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">

            <FeatureCard
              icon={<Folder size={21} />}
              title="Smart Organization"
              description="Keep notes neatly grouped and easy to find."
              iconBg="bg-purple-100"
              iconColor="text-purple-600"
            />

            <FeatureCard
              icon={<Sparkles size={21} />}
              title="AI Assistant"
              description="Summarize, improve and generate ideas with AI."
              iconBg="bg-pink-100"
              iconColor="text-pink-600"
            />

            <FeatureCard
              icon={<Mic size={21} />}
              title="Voice Notes"
              description="Convert your voice to text instantly."
              iconBg="bg-blue-100"
              iconColor="text-blue-600"
            />

            <FeatureCard
              icon={<Cloud size={21} />}
              title="Sync Everywhere"
              description="Access your notes on all devices, anytime."
              iconBg="bg-indigo-100"
              iconColor="text-indigo-600"
            />

          </div>

        </section>

      </main>

    </div>
  );
}

/* ================================================================
   TRUST BADGE
================================================================ */

function TrustBadge({ icon, text }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-white bg-white/90 px-4 py-2 shadow-sm backdrop-blur">

      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-purple-50 text-purple-600">
        {icon}
      </span>

      <span className="text-xs font-semibold text-slate-600">
        {text}
      </span>

    </div>
  );
}

/* ================================================================
   PREMIUM ROW
================================================================ */

function PremiumRow({ text }) {
  return (
    <div className="flex items-center gap-2 text-[10px] font-medium text-slate-600">

      <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-purple-100 text-purple-600">
        <Check size={9} strokeWidth={3} />
      </span>

      <span>{text}</span>

    </div>
  );
}

/* ================================================================
   BENEFIT CARD
================================================================ */

function BenefitCard({
  icon,
  title,
  iconBg,
  iconColor,
}) {
  return (
    <div className="flex w-[195px] items-center gap-3 rounded-2xl border border-white/90 bg-white/95 px-3 py-2.5 shadow-[0_10px_25px_rgba(76,29,149,0.10)] backdrop-blur-xl">

      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconBg} ${iconColor}`}
      >
        {icon}
      </div>

      <span className="text-xs font-bold text-slate-700">
        {title}
      </span>

    </div>
  );
}

/* ================================================================
   STAT CARD
================================================================ */

function StatCard({
  icon,
  value,
  label,
  iconBg,
  iconColor,
}) {
  return (
    <div className="rounded-xl bg-slate-50/90 px-3 py-3">

      <div className="flex items-center gap-2.5">

        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${iconBg} ${iconColor}`}
        >
          {icon}
        </div>

        <div>

          <p className="text-base font-bold leading-none text-slate-800">
            {value}
          </p>

          <p className="mt-1 text-[9px] font-medium text-slate-400">
            {label}
          </p>

        </div>

      </div>

    </div>
  );
}

/* ================================================================
   FEATURE CARD
================================================================ */

function FeatureCard({
  icon,
  title,
  description,
  iconBg,
  iconColor,
}) {
  return (
    <div className="group min-h-[112px] rounded-2xl border border-purple-100/80 bg-white/90 px-6 py-5 shadow-[0_8px_30px_rgba(88,28,135,0.06)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_35px_rgba(88,28,135,0.10)]">

      <div className="flex items-center gap-4">

        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${iconBg} ${iconColor} transition-transform duration-300 group-hover:scale-105`}
        >
          {icon}
        </div>

        <div className="min-w-0">

          <h3 className="text-sm font-bold text-slate-800">
            {title}
          </h3>

          <p className="mt-1 text-[11px] leading-5 text-slate-400">
            {description}
          </p>

        </div>

      </div>

    </div>
  );
}

export default Home;