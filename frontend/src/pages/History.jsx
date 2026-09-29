import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  ArrowRight,
  Brain,
  CalendarDays,
  CheckCircle2,
  Clock3,
  History as HistoryIcon,
  ScanLine,
} from "lucide-react";
import { motion } from "framer-motion";
import { fetchHistory } from "../api/client.js";

export default function History() {
  const [scans, setScans] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchHistory()
      .then(setScans)
      .catch(() =>
        setError("Could not load scan history. Check that the backend is running.")
      );
  }, []);

  const totalScans = useMemo(() => scans?.length ?? 0, [scans]);

  const latestScan = useMemo(() => {
    if (!scans?.length) return null;

    return [...scans].sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    )[0];
  }, [scans]);

  function formatDate(date) {
    if (!date) return "—";

    return new Date(date).toLocaleDateString(undefined, {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  function formatTime(date) {
    if (!date) return "";

    return new Date(date).toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <div className="mx-auto max-w-7xl px-5 py-8 md:px-8 md:py-10">

      {/* ==================================================
          PAGE HEADER
      ================================================== */}

      <section className="mb-8">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">

          <div>
            <div className="mb-3 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-400">
              <HistoryIcon size={14} />
              Analysis Archive
            </div>

            <h1 className="text-3xl font-semibold tracking-tight text-slate-100 md:text-4xl">
              Scan History
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
              Review previously analyzed brain MRI scans, model predictions,
              confidence values and explainability reports.
            </p>
          </div>


          {/* Summary */}

          <div className="grid grid-cols-2 gap-3 sm:min-w-[360px]">

            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] px-4 py-4">
              <div className="flex items-center gap-2 text-slate-500">
                <ScanLine size={14} />

                <span className="text-[10px] font-medium uppercase tracking-[0.13em]">
                  Total Scans
                </span>
              </div>

              <p className="mt-2 text-2xl font-semibold text-slate-100">
                {totalScans}
              </p>
            </div>


            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] px-4 py-4">
              <div className="flex items-center gap-2 text-slate-500">
                <Clock3 size={14} />

                <span className="text-[10px] font-medium uppercase tracking-[0.13em]">
                  Latest
                </span>
              </div>

              <p className="mt-2 text-sm font-medium text-slate-300">
                {latestScan
                  ? formatDate(latestScan.created_at)
                  : "No records"}
              </p>
            </div>

          </div>

        </div>
      </section>


      {/* ==================================================
          ARCHIVE HEADER
      ================================================== */}

      <div className="mb-4 flex items-center justify-between border-b border-white/[0.06] pb-4">

        <div>
          <h2 className="text-sm font-semibold text-slate-200">
            Analysis Records
          </h2>

          <p className="mt-1 text-xs text-slate-600">
            Stored MRI analysis sessions
          </p>
        </div>

        {scans && scans.length > 0 && (
          <div className="flex items-center gap-2 text-[11px] text-slate-600">
            <Activity
              size={13}
              className="text-brand-400"
            />

            {totalScans} {totalScans === 1 ? "record" : "records"}
          </div>
        )}

      </div>


      {/* ==================================================
          ERROR
      ================================================== */}

      {error && (
        <div className="rounded-2xl border border-red-400/15 bg-red-400/[0.05] px-5 py-4">

          <div className="flex items-start gap-3">

            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-400/10">
              <Activity
                size={16}
                className="text-red-300"
              />
            </div>

            <div>
              <p className="text-sm font-medium text-red-200">
                Unable to load analysis records
              </p>

              <p className="mt-1 text-xs text-red-300/60">
                {error}
              </p>
            </div>

          </div>

        </div>
      )}


      {/* ==================================================
          LOADING
      ================================================== */}

      {!scans && !error && (
        <div className="flex min-h-[330px] items-center justify-center rounded-2xl border border-white/[0.07] bg-white/[0.018]">

          <div className="text-center">

            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl border border-brand-400/15 bg-brand-500/[0.06]">
              <ScanLine
                size={19}
                className="animate-soft-pulse text-brand-400"
              />
            </div>

            <p className="mt-4 text-sm text-slate-400">
              Loading analysis records
            </p>

            <p className="mt-1 text-xs text-slate-600">
              Retrieving scan history...
            </p>

          </div>

        </div>
      )}


      {/* ==================================================
          EMPTY STATE
      ================================================== */}

      {scans && scans.length === 0 && (
        <div className="flex min-h-[360px] flex-col items-center justify-center rounded-2xl border border-dashed border-white/[0.09] bg-white/[0.015] px-6 text-center">

          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-brand-400/15 bg-brand-500/[0.06]">
            <Brain
              size={25}
              className="text-brand-400"
            />
          </div>

          <h2 className="mt-5 text-lg font-semibold text-slate-200">
            No analysis records yet
          </h2>

          <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
            MRI scans analyzed from the dashboard will appear here with their
            predictions and explainability reports.
          </p>

          <Link
            to="/"
            className="btn-primary mt-6"
          >
            Analyze MRI
            <ArrowRight size={15} />
          </Link>

        </div>
      )}


      {/* ==================================================
          SCAN GRID
      ================================================== */}

      {scans && scans.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">

          {scans.map((scan, index) => {
            const confidence = Math.min(
              100,
              Math.max(0, Number(scan.confidence ?? 0))
            );

            const className =
              scan.predicted_class || "Unknown";

            const isTumor =
              scan.predicted_class &&
              scan.predicted_class.toLowerCase() !== "notumor";

            return (
              <motion.div
                key={scan.id}
                initial={{
                  opacity: 0,
                  y: 10,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.3,
                  delay: Math.min(index * 0.04, 0.25),
                }}
              >

                <Link
                  to={`/history/${scan.id}`}
                  className="group block overflow-hidden rounded-2xl border border-white/[0.07] bg-[#101719] transition duration-200 hover:border-brand-400/20 hover:bg-[#111a1c]"
                >

                  {/* MRI IMAGE */}

                  <div className="relative h-52 overflow-hidden bg-[#070b0d]">

                    {scan.original_image_b64 ? (
                      <img
                        src={`data:image/png;base64,${scan.original_image_b64}`}
                        alt="Brain MRI scan"
                        className="h-full w-full object-contain p-2 transition-transform duration-500 group-hover:scale-[1.025]"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">

                        <Brain
                          size={30}
                          className="text-slate-700"
                        />

                      </div>
                    )}


                    {/* Prediction Badge */}

                    <div className="absolute left-3 top-3">

                      <div
                        className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[10px] font-semibold backdrop-blur-md ${
                          isTumor
                            ? "border-red-400/15 bg-[#120c0d]/85 text-red-300"
                            : "border-emerald-400/15 bg-[#08110e]/85 text-emerald-300"
                        }`}
                      >
                        <CheckCircle2 size={11} />

                        {className}
                      </div>

                    </div>


                    {/* Open indicator */}

                    <div className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] bg-black/40 text-slate-500 opacity-0 backdrop-blur transition group-hover:opacity-100">

                      <ArrowRight size={14} />

                    </div>

                  </div>


                  {/* INFORMATION */}

                  <div className="border-t border-white/[0.06] p-5">

                    <div className="flex items-start justify-between gap-4">

                      <div>
                        <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-slate-600">
                          Model Confidence
                        </p>

                        <p className="mt-1.5 text-2xl font-semibold text-slate-100">
                          {confidence.toFixed(1)}
                          <span className="ml-1 text-sm font-normal text-slate-600">
                            %
                          </span>
                        </p>
                      </div>


                      <div className="text-right">

                        <p className="text-[10px] uppercase tracking-[0.12em] text-slate-600">
                          Prediction
                        </p>

                        <p
                          className={`mt-1.5 text-xs font-medium ${
                            isTumor
                              ? "text-red-300"
                              : "text-emerald-300"
                          }`}
                        >
                          {className}
                        </p>

                      </div>

                    </div>


                    {/* CONFIDENCE BAR */}

                    <div className="mt-4 h-1 overflow-hidden rounded-full bg-white/[0.05]">

                      <div
                        className={`h-full rounded-full ${
                          isTumor
                            ? "bg-red-400"
                            : "bg-emerald-400"
                        }`}
                        style={{
                          width: `${confidence}%`,
                        }}
                      />

                    </div>


                    {/* DATE */}

                    <div className="mt-4 flex items-center justify-between border-t border-white/[0.05] pt-4">

                      <div className="flex items-center gap-2 text-[11px] text-slate-600">

                        <CalendarDays size={13} />

                        <span>
                          {formatDate(scan.created_at)}
                        </span>

                        <span className="text-slate-700">
                          •
                        </span>

                        <span>
                          {formatTime(scan.created_at)}
                        </span>

                      </div>


                      <span className="text-[10px] font-medium text-brand-400 opacity-0 transition group-hover:opacity-100">
                        View report
                      </span>

                    </div>

                  </div>

                </Link>

              </motion.div>
            );
          })}

        </div>
      )}

    </div>
  );
}