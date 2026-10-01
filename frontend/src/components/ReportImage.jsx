import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Expand,
  ImageOff,
  X,
} from "lucide-react";

export default function ReportImage({
  title,
  base64,
  description,
}) {
  const [open, setOpen] = useState(false);

  // Close lightbox with ESC
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    if (open) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <>
      {/* ==================================================
          XAI VISUALIZATION CARD
      ================================================== */}

      <motion.article
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -3 }}
        transition={{ duration: 0.25 }}
        className="group overflow-hidden rounded-2xl border border-white/[0.08] bg-slate-900/60"
      >
        {/* Image */}

        {base64 ? (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="relative block w-full overflow-hidden bg-[#080d17] text-left"
            aria-label={`Open ${title} visualization`}
          >
            <div className="flex h-[260px] items-center justify-center p-3">
              <img
                src={`data:image/png;base64,${base64}`}
                alt={`${title} explainability visualization`}
                className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-[1.02]"
              />
            </div>

            {/* Expand control */}

            <div className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-slate-950/70 text-slate-400 opacity-0 backdrop-blur-md transition-all duration-200 group-hover:opacity-100">
              <Expand size={15} />
            </div>

            {/* Subtle bottom overlay */}

            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#080d17]/50 to-transparent" />
          </button>
        ) : (
          <div className="flex h-[260px] flex-col items-center justify-center bg-[#080d17] px-6 text-center">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.03]">
              <ImageOff
                size={19}
                className="text-slate-600"
              />
            </div>

            <p className="mt-3 text-xs text-slate-600">
              Visualization unavailable
            </p>
          </div>
        )}

        {/* Information */}

        <div className="border-t border-white/[0.07] px-5 py-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-200">
                {title}
              </h3>

              {description && (
                <p className="mt-1.5 text-xs leading-5 text-slate-500">
                  {description}
                </p>
              )}
            </div>

            <span className="shrink-0 rounded-md border border-brand-400/15 bg-brand-500/[0.07] px-2 py-1 text-[9px] font-semibold tracking-wider text-brand-300">
              XAI
            </span>
          </div>

          {base64 && (
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="mt-4 inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-500 transition hover:text-brand-300"
            >
              <Expand size={12} />
              Expand visualization
            </button>
          )}
        </div>
      </motion.article>


      {/* ==================================================
          FULL-SCREEN IMAGE VIEWER
      ================================================== */}

      <AnimatePresence>
        {open && base64 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#03060c]/95 p-4 backdrop-blur-sm md:p-8"
            role="dialog"
            aria-modal="true"
            aria-label={`${title} visualization`}
          >
            {/* Top bar */}

            <div className="absolute inset-x-0 top-0 flex items-center justify-between border-b border-white/[0.07] bg-[#03060c]/70 px-5 py-4 backdrop-blur-xl md:px-8">

              <div>
                <p className="text-sm font-medium text-slate-200">
                  {title}
                </p>

                <p className="mt-0.5 text-[11px] text-slate-600">
                  Explainability visualization
                </p>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-slate-400 transition hover:bg-white/[0.08] hover:text-white"
                aria-label="Close visualization"
              >
                <X size={18} />
              </button>

            </div>


            {/* Full image */}

            <motion.img
              initial={{
                opacity: 0,
                scale: 0.97,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                scale: 0.97,
              }}
              transition={{ duration: 0.2 }}
              onClick={(event) => event.stopPropagation()}
              src={`data:image/png;base64,${base64}`}
              alt={`${title} explainability visualization`}
              className="mt-16 max-h-[80vh] max-w-[94vw] rounded-xl object-contain shadow-2xl"
            />


            {/* ESC hint */}

            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-lg border border-white/[0.07] bg-white/[0.03] px-3 py-1.5 text-[10px] text-slate-600">
              Press ESC to close
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}