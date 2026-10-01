import { useState } from "react";
import {
  Activity,
  BrainCircuit,
  ShieldCheck,
  Sparkles,
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
    <div className="space-y-7">

      {/* ==================================================
          COMPACT HERO
      ================================================== */}

      <section className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-slate-900/50 px-6 py-6 md:px-8">
        <div className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-brand-500/[0.08] blur-3xl" />

        <div className="relative flex flex-col justify-between gap-6 lg:flex-row lg:items-center">

          {/* Hero text */}
          <div className="max-w-2xl">
            <div className="mb-3 inline-flex items-center gap-2 text-xs font-medium tracking-wide text-brand-300">
              <Sparkles size={14} />
              EXPLAINABLE AI • NEUROIMAGING
            </div>

            <h1 className="text-2xl font-semibold tracking-tight text-white md:text-3xl">
              Brain MRI Analysis
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
              Deep-learning classification with transparent visual
              explanations using Grad-CAM, Integrated Gradients and SHAP.
            </p>
          </div>

          {/* Capabilities */}
          <div className="grid grid-cols-3 gap-2 lg:min-w-[360px]">

            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] px-3 py-3">
              <BrainCircuit
                size={17}
                className="text-brand-400"
              />

              <p className="mt-2 text-xs font-medium text-slate-300">
                CNN
              </p>

              <p className="mt-0.5 text-[10px] text-slate-600">
                Classification
              </p>
            </div>

            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] px-3 py-3">
              <Activity
                size={17}
                className="text-brand-400"
              />

              <p className="mt-2 text-xs font-medium text-slate-300">
                3 Methods
              </p>

              <p className="mt-0.5 text-[10px] text-slate-600">
                Explainability
              </p>
            </div>

            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] px-3 py-3">
              <ShieldCheck
                size={17}
                className="text-brand-400"
              />

              <p className="mt-2 text-xs font-medium text-slate-300">
                Validation
              </p>

              <p className="mt-0.5 text-[10px] text-slate-600">
                MRI Input
              </p>
            </div>

          </div>
        </div>
      </section>


      {/* ==================================================
          ANALYSIS WORKSPACE
      ================================================== */}

      <section>

        {/* Workspace heading */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-white">
            Analysis Workspace
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Upload an MRI image and review the model output alongside
            its visual explanations.
          </p>
        </div>


        {/* ==================================================
            WORKSPACE GRID
        ================================================== */}

        <div className="grid items-start gap-6 xl:grid-cols-[390px_minmax(0,1fr)]">

          {/* ==================================================
              LEFT — MRI UPLOAD
          ================================================== */}

          <div className="space-y-4">

            <UploadCard
              onFileSelected={(selectedFile) => {
                setFile(selectedFile);
                setError(null);
                setResult(null);
              }}
              disabled={loading}
            />


            {/* Analyze Button */}

            <button
              type="button"
              onClick={handleAnalyze}
              disabled={!file || loading}
              className="btn-primary w-full justify-center py-3.5"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Analyzing MRI...
                </>
              ) : (
                <>
                  <BrainCircuit size={18} />
                  Analyze Scan
                </>
              )}
            </button>


            {/* Research notice */}

            <p className="px-3 text-center text-[11px] leading-5 text-slate-600">
              Research and educational system. Results should not be
              interpreted as a standalone clinical diagnosis.
            </p>

          </div>


          {/* ==================================================
              RIGHT — RESULTS
          ================================================== */}

          <div className="min-w-0">

            {/* ==================================================
                LOADING STATE
            ================================================== */}

            {loading && (
              <div className="flex min-h-[420px] items-center justify-center rounded-3xl border border-white/10 bg-slate-900/40 p-8">

                <div className="max-w-md text-center">

                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-brand-400/20 bg-brand-500/10">
                    <BrainCircuit
                      size={30}
                      className="animate-pulse text-brand-400"
                    />
                  </div>

                  <h2 className="mt-5 text-lg font-semibold text-white">
                    Analyzing MRI Scan
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    Running MRI validation, CNN inference and
                    explainability analysis.
                  </p>


                  {/* Pipeline indicators */}

                  <div className="mt-6 flex flex-wrap justify-center gap-2">

                    <span className="rounded-full border border-white/10 px-3 py-1 text-[11px] text-slate-500">
                      CNN
                    </span>

                    <span className="rounded-full border border-white/10 px-3 py-1 text-[11px] text-slate-500">
                      Grad-CAM
                    </span>

                    <span className="rounded-full border border-white/10 px-3 py-1 text-[11px] text-slate-500">
                      Integrated Gradients
                    </span>

                    <span className="rounded-full border border-white/10 px-3 py-1 text-[11px] text-slate-500">
                      SHAP
                    </span>

                  </div>


                  {/* Loading bar */}

                  <div className="mx-auto mt-6 h-1.5 max-w-xs overflow-hidden rounded-full bg-slate-800">
                    <div className="h-full w-2/3 animate-pulse rounded-full bg-brand-500" />
                  </div>

                </div>
              </div>
            )}


            {/* ==================================================
                ERROR STATE
            ================================================== */}

            {!loading && error && (
              <div className="flex min-h-[420px] items-center justify-center rounded-3xl border border-red-500/20 bg-red-500/[0.04] p-8">

                <div className="max-w-md text-center">

                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10">
                    <BrainCircuit
                      size={30}
                      className="text-red-400"
                    />
                  </div>

                  <h2 className="mt-5 text-xl font-semibold text-white">
                    Analysis Could Not Be Completed
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-slate-400">
                    {error}
                  </p>

                  <p className="mt-4 text-xs text-slate-500">
                    Check the uploaded image and try again.
                  </p>

                </div>
              </div>
            )}


            {/* ==================================================
                EMPTY STATE
            ================================================== */}

            {!loading && !error && !result && (
              <div className="flex min-h-[420px] items-center justify-center rounded-3xl border border-dashed border-white/10 bg-slate-900/30 p-8">

                <div className="max-w-sm text-center">

                  {/* Icon */}

                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl border border-white/10 bg-white/[0.03]">
                    <BrainCircuit
                      size={36}
                      className="text-slate-600"
                    />
                  </div>


                  {/* Heading */}

                  <h2 className="mt-5 text-lg font-semibold text-slate-300">
                    Awaiting MRI Analysis
                  </h2>


                  {/* Description */}

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Select a brain MRI from the upload panel.
                    Prediction results and explainability visualizations
                    will appear here.
                  </p>


                  {/* XAI Methods */}

                  <div className="mt-6 flex flex-wrap justify-center gap-2">

                    {[
                      "Grad-CAM",
                      "Integrated Gradients",
                      "SHAP",
                    ].map((method) => (
                      <span
                        key={method}
                        className="rounded-full border border-white/10 px-2.5 py-1 text-[11px] text-slate-500"
                      >
                        {method}
                      </span>
                    ))}

                  </div>

                </div>
              </div>
            )}


            {/* ==================================================
                SUCCESS RESULT
            ================================================== */}

            {!loading && result && (
              <ResultPanel result={result} />
            )}

          </div>
        </div>
      </section>
    </div>
  );
}