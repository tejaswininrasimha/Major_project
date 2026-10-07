import { useState } from "react";
import {
  Activity,
  BrainCircuit,
  CheckCircle2,
  ChevronRight,
  CircleDot,
  Microscope,
  ScanLine,
  ShieldCheck,
} from "lucide-react";

import UploadCard from "../components/UploadCard.jsx";
import ResultPanel from "../components/ResultPanel.jsx";
import { predictScan } from "../api/client.js";

export default function Dashboard() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  async function handleAnalyze() {
    if (!file) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await predictScan(file);
      setResult(data);
    } catch (err) {
      console.error("Scan analysis error:", err);

      const responseData = err?.response?.data;

      if (responseData?.valid_mri === false) {
        setError(
          responseData?.message ||
            "The uploaded image does not appear to be a brain MRI. Please upload a valid brain MRI image."
        );
      } else {
        setError(
          responseData?.error ||
            "Something went wrong while analyzing the scan."
        );
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-5 py-7 md:px-8 md:py-9">

      {/* =====================================================
          WORKSPACE HEADER
      ===================================================== */}

      <header className="mb-7">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">

          <div>
            <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-brand-400">
              <CircleDot size={14} />
              Neuroimaging Workspace
            </div>

            <h1 className="text-3xl font-semibold tracking-[-0.035em] text-slate-100 md:text-[40px] md:leading-[1.12]">
              Explainable Brain MRI Analysis
            </h1>

            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-400">
              Classify a brain MRI and inspect the visual evidence behind the
              model decision using multiple explainability methods.
            </p>
          </div>

          <div className="hidden items-center gap-3 rounded-xl border border-sky-400/10 bg-[#07131c]/80 px-4 py-3 lg:flex">
            <Microscope size={18} className="text-brand-400" />

            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                Framework
              </p>

              <p className="mt-0.5 text-sm font-medium text-slate-300">
                CNN + Multi-method XAI
              </p>
            </div>
          </div>

        </div>
      </header>


      {/* =====================================================
          PIPELINE
      ===================================================== */}

      <section className="mb-6 rounded-2xl border border-sky-400/10 bg-[#07131c]/80 px-5 py-4">

        <div className="flex flex-wrap items-center gap-2.5 text-sm">

          <div className="flex items-center gap-2 font-medium text-slate-200">
            <ScanLine size={16} className="text-brand-400" />
            MRI Input
          </div>

          <ChevronRight size={15} className="text-slate-700" />

          <div className="flex items-center gap-2 text-slate-400">
            <ShieldCheck size={16} className="text-brand-400" />
            Validation
          </div>

          <ChevronRight size={15} className="text-slate-700" />

          <div className="flex items-center gap-2 text-slate-400">
            <BrainCircuit size={16} className="text-brand-400" />
            CNN Classification
          </div>

          <ChevronRight size={15} className="text-slate-700" />

          <div className="flex items-center gap-2 text-slate-400">
            <Activity size={16} className="text-brand-400" />
            Explainability
          </div>

          <div className="ml-auto hidden items-center gap-2 text-xs font-medium text-slate-500 md:flex">
            Grad-CAM
            <span>•</span>
            Integrated Gradients
            <span>•</span>
            SHAP
          </div>

        </div>

      </section>


      {/* =====================================================
          MAIN WORKSTATION
      ===================================================== */}

      <section className="overflow-hidden rounded-2xl border border-sky-400/10 bg-[#07131c]/90 shadow-[0_20px_60px_rgba(0,0,0,0.28)]">

        {/* Workstation Headings */}

        <div className="grid border-b border-sky-400/10 lg:grid-cols-[380px_minmax(0,1fr)]">

          <div className="border-b border-sky-400/10 px-5 py-4 lg:border-b-0 lg:border-r">

            <div className="flex items-center gap-2">
              <ScanLine size={17} className="text-brand-400" />

              <h2 className="text-base font-semibold text-slate-100">
                MRI Input
              </h2>
            </div>

            <p className="mt-1.5 text-sm text-slate-500">
              Select the scan for model inference
            </p>

          </div>


          <div className="px-5 py-4">

            <div className="flex items-center gap-2">
              <Activity size={17} className="text-brand-400" />

              <h2 className="text-base font-semibold text-slate-100">
                Analysis Output
              </h2>
            </div>

            <p className="mt-1.5 text-sm text-slate-500">
              Classification and explainability results
            </p>

          </div>

        </div>


        {/* =====================================================
            WORKSPACE
        ===================================================== */}

        <div className="grid lg:grid-cols-[380px_minmax(0,1fr)]">

          {/* =================================================
              LEFT — MRI INPUT
          ================================================= */}

          <aside className="border-b border-sky-400/10 bg-[#061018]/70 p-5 lg:border-b-0 lg:border-r">

            <UploadCard
              onFileSelected={(selectedFile) => {
                setFile(selectedFile);
                setError(null);
                setResult(null);
              }}
              disabled={loading}
            />


            <button
              type="button"
              onClick={handleAnalyze}
              disabled={!file || loading}
              className="btn-primary mt-4 w-full py-3.5 text-[15px]"
            >

              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#021018]/30 border-t-[#021018]" />
                  Running Analysis
                </>
              ) : (
                <>
                  <BrainCircuit size={19} />
                  Analyze MRI
                </>
              )}

            </button>


            {/* Input Status */}

            <div className="mt-4 rounded-xl border border-sky-400/[0.08] bg-sky-400/[0.025] px-4 py-3">

              <div className="flex items-center justify-between gap-3">

                <span className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">
                  Input Status
                </span>

                {file ? (
                  <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-300">
                    <CheckCircle2 size={13} />
                    Ready
                  </span>
                ) : (
                  <span className="text-xs text-slate-600">
                    No scan selected
                  </span>
                )}

              </div>

            </div>


            <p className="mt-4 px-2 text-center text-xs leading-5 text-slate-600">
              Research and educational prototype. Not intended as an
              independent clinical diagnostic system.
            </p>

          </aside>


          {/* =================================================
              RIGHT — ANALYSIS OUTPUT
          ================================================= */}

          <main className="min-w-0 bg-[#041018]/55 p-5 md:p-6">

            {/* LOADING */}

            {loading && (
              <div className="flex min-h-[500px] items-center justify-center">

                <div className="w-full max-w-md text-center">

                  <div className="relative mx-auto flex h-16 w-16 items-center justify-center">

                    <div className="absolute inset-0 animate-ping rounded-full border border-brand-400/10" />

                    <div className="relative flex h-14 w-14 items-center justify-center rounded-xl border border-brand-400/20 bg-brand-500/[0.07]">
                      <BrainCircuit
                        size={27}
                        className="animate-soft-pulse text-brand-400"
                      />
                    </div>

                  </div>


                  <h2 className="mt-5 text-lg font-semibold text-slate-100">
                    Processing MRI
                  </h2>

                  <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-400">
                    Running validation, CNN inference and explainability
                    analysis.
                  </p>


                  <div className="mx-auto mt-7 max-w-sm">

                    <div className="grid grid-cols-4 gap-1.5">

                      {[
                        "Validate",
                        "Classify",
                        "Explain",
                        "Report",
                      ].map((step) => (
                        <div key={step}>

                          <div className="h-1.5 animate-pulse rounded-full bg-brand-400/50" />

                          <p className="mt-2 text-[11px] font-medium text-slate-500">
                            {step}
                          </p>

                        </div>
                      ))}

                    </div>

                  </div>

                </div>

              </div>
            )}


            {/* ERROR */}

            {!loading && error && (
              <div className="flex min-h-[500px] items-center justify-center">

                <div className="max-w-md text-center">

                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl border border-red-400/20 bg-red-400/[0.06]">
                    <Activity
                      size={25}
                      className="text-red-300"
                    />
                  </div>

                  <p className="mt-5 text-xs font-semibold uppercase tracking-[0.14em] text-red-300">
                    Analysis Failed
                  </p>

                  <h2 className="mt-2 text-xl font-semibold text-slate-100">
                    Unable to process this MRI
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-slate-400">
                    {error}
                  </p>

                  <p className="mt-4 text-xs text-slate-600">
                    Verify the input image and try again.
                  </p>

                </div>

              </div>
            )}


            {/* =================================================
                EMPTY ANALYSIS
            ================================================= */}

            {!loading && !error && !result && (
              <div className="flex min-h-[500px] flex-col justify-between">

                <div className="flex flex-1 items-center justify-center">

                  <div className="max-w-md text-center">

                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl border border-brand-400/15 bg-brand-500/[0.06] shadow-[0_0_30px_rgba(56,189,248,0.05)]">
                      <BrainCircuit
                        size={32}
                        className="text-brand-400"
                      />
                    </div>


                    <p className="mt-5 text-xs font-semibold uppercase tracking-[0.14em] text-brand-400">
                      Analysis Output
                    </p>

                    <h2 className="mt-2 text-xl font-semibold text-slate-200">
                      No analysis generated
                    </h2>

                    <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-500">
                      Upload a brain MRI from the input panel and start the
                      analysis to generate classification and XAI results.
                    </p>

                  </div>

                </div>


                {/* Result Metrics */}

                <div className="grid grid-cols-3 overflow-hidden rounded-xl border border-sky-400/[0.08] bg-sky-400/[0.018]">

                  <div className="border-r border-sky-400/[0.08] px-4 py-3.5">

                    <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-600">
                      Prediction
                    </p>

                    <p className="mt-1.5 text-base text-slate-600">
                      —
                    </p>

                  </div>


                  <div className="border-r border-sky-400/[0.08] px-4 py-3.5">

                    <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-600">
                      Confidence
                    </p>

                    <p className="mt-1.5 text-base text-slate-600">
                      —
                    </p>

                  </div>


                  <div className="px-4 py-3.5">

                    <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-600">
                      Processing
                    </p>

                    <p className="mt-1.5 text-base text-slate-600">
                      —
                    </p>

                  </div>

                </div>

              </div>
            )}


            {/* SUCCESS */}

            {!loading && result && (
              <ResultPanel result={result} />
            )}

          </main>

        </div>

      </section>


      {/* =====================================================
          XAI METHODS
      ===================================================== */}

      <section className="mt-5 grid gap-3 md:grid-cols-3">

        <div className="rounded-xl border border-sky-400/[0.08] bg-[#07131c]/75 px-5 py-4">

          <div className="flex items-center gap-2.5">

            <div className="h-2 w-2 rounded-full bg-brand-400 shadow-[0_0_8px_rgba(56,189,248,0.5)]" />

            <span className="text-sm font-semibold text-slate-300">
              Grad-CAM
            </span>

          </div>

          <p className="mt-2 text-xs leading-5 text-slate-500">
            Highlights spatial regions influencing CNN activation.
          </p>

        </div>


        <div className="rounded-xl border border-sky-400/[0.08] bg-[#07131c]/75 px-5 py-4">

          <div className="flex items-center gap-2.5">

            <div className="h-2 w-2 rounded-full bg-brand-400 shadow-[0_0_8px_rgba(56,189,248,0.5)]" />

            <span className="text-sm font-semibold text-slate-300">
              Integrated Gradients
            </span>

          </div>

          <p className="mt-2 text-xs leading-5 text-slate-500">
            Measures pixel attribution relative to a baseline input.
          </p>

        </div>


        <div className="rounded-xl border border-sky-400/[0.08] bg-[#07131c]/75 px-5 py-4">

          <div className="flex items-center gap-2.5">

            <div className="h-2 w-2 rounded-full bg-brand-400 shadow-[0_0_8px_rgba(56,189,248,0.5)]" />

            <span className="text-sm font-semibold text-slate-300">
              SHAP
            </span>

          </div>

          <p className="mt-2 text-xs leading-5 text-slate-500">
            Estimates feature contributions toward the model output.
          </p>

        </div>

      </section>

    </div>
  );
}