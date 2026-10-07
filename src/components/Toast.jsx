function Toast({
  message,
  type = "success",
  onClose,
}) {
  if (!message) return null;

  const styles = {
    success: {
      wrapper: "border-emerald-100 bg-white text-emerald-700",
      icon: "bg-emerald-50 text-emerald-600",
      line: "from-emerald-400 to-teal-400",
      symbol: "✓",
    },
    error: {
      wrapper: "border-rose-100 bg-white text-rose-700",
      icon: "bg-rose-50 text-rose-600",
      line: "from-rose-400 to-red-400",
      symbol: "!",
    },
    info: {
      wrapper: "border-violet-100 bg-white text-violet-700",
      icon: "bg-violet-50 text-violet-600",
      line: "from-violet-500 to-fuchsia-500",
      symbol: "i",
    },
  };

  const current = styles[type] || styles.success;

  return (
    <div className="fixed right-4 top-20 z-[200] w-[calc(100%-2rem)] max-w-[380px] sm:right-6">
      <div
        className={`
          relative overflow-hidden
          rounded-2xl
          border
          px-4 py-3.5
          ${current.wrapper}
          shadow-[0_12px_35px_rgba(45,20,90,0.14)]
          backdrop-blur-xl
        `}
      >
        {/* TOP ACCENT */}

        <div
          className={`
            absolute inset-x-0 top-0 h-[3px]
            bg-gradient-to-r
            ${current.line}
          `}
        />

        <div className="flex items-center gap-3">
          {/* ICON */}

          <div
            className={`
              flex h-10 w-10 shrink-0
              items-center justify-center
              rounded-xl
              text-sm font-black
              ${current.icon}
            `}
          >
            {current.symbol}
          </div>

          {/* MESSAGE */}

          <p className="min-w-0 flex-1 text-sm font-semibold leading-5 text-slate-700">
            {message}
          </p>

          {/* CLOSE */}

          <button
            type="button"
            onClick={onClose}
            aria-label="Close notification"
            className="
              flex h-8 w-8 shrink-0
              items-center justify-center
              rounded-lg
              text-lg
              text-slate-400
              transition
              hover:bg-slate-100
              hover:text-slate-700
            "
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
}

export default Toast;