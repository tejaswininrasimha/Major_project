import { useEffect, useRef, useState } from "react";
import {
  UploadCloud,
  ImageIcon,
  CheckCircle2,
  FileImage,
  RefreshCw,
  ScanLine,
  BrainCircuit,
  Crosshair,
} from "lucide-react";
import { motion } from "framer-motion";

export default function UploadCard({ onFileSelected, disabled }) {
  const inputRef = useRef(null);

  const [dragOver, setDragOver] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState("");

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  function handleFile(file) {
    if (!file) return;

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    const newPreviewUrl = URL.createObjectURL(file);

    setPreviewUrl(newPreviewUrl);
    setFileName(file.name);
    setFileSize(`${(file.size / 1024 / 1024).toFixed(2)} MB`);

    onFileSelected(file);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="overflow-hidden rounded-2xl border border-sky-400/15 bg-[#041019]/90 shadow-[0_20px_60px_rgba(0,0,0,0.35)]"
    >
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="border-b border-sky-400/10 bg-sky-400/[0.025] px-5 py-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="mb-1.5 flex items-center gap-2">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-sky-300 shadow-[0_0_10px_rgba(125,211,252,0.9)]" />

              <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-sky-300/70">
                MRI Input Module
              </span>
            </div>

            <h2 className="text-base font-semibold text-sky-50">
              Upload MRI Scan
            </h2>

            <p className="mt-1 text-[11px] text-slate-500">
              FLAIR neuroimaging input
            </p>
          </div>

          <div className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-sky-300/20 bg-sky-400/[0.07]">
            <div className="absolute inset-1 rounded-lg border border-sky-300/[0.06]" />

            <FileImage
              size={19}
              className="relative text-sky-300"
            />
          </div>
        </div>
      </div>

      <div className="p-4">

        {/* =====================================================
            MRI SCANNER / DROP ZONE
        ===================================================== */}

        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            handleFile(e.dataTransfer.files?.[0]);
          }}
          onClick={() => {
            if (!disabled) inputRef.current?.click();
          }}
          className={`
            group relative cursor-pointer overflow-hidden rounded-xl
            border transition-all duration-300
            ${
              dragOver
                ? "border-sky-300/70 bg-sky-400/[0.08] shadow-[0_0_35px_rgba(56,189,248,0.14)]"
                : "border-sky-400/15 bg-[#020b11] hover:border-sky-300/35"
            }
            ${disabled ? "cursor-not-allowed opacity-60" : ""}
          `}
        >

          {/* Technical grid */}

          <div
            className="pointer-events-none absolute inset-0 opacity-[0.16]"
            style={{
              backgroundImage: `
                linear-gradient(rgba(56,189,248,0.14) 1px, transparent 1px),
                linear-gradient(90deg, rgba(56,189,248,0.14) 1px, transparent 1px)
              `,
              backgroundSize: "26px 26px",
            }}
          />

          {/* Center glow */}

          <div className="pointer-events-none absolute left-1/2 top-1/2 h-52 w-52 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-400/[0.055] blur-3xl" />

          {/* HUD corner brackets */}

          <div className="pointer-events-none absolute left-3 top-3 h-7 w-7 border-l border-t border-sky-300/60" />
          <div className="pointer-events-none absolute right-3 top-3 h-7 w-7 border-r border-t border-sky-300/60" />
          <div className="pointer-events-none absolute bottom-3 left-3 h-7 w-7 border-b border-l border-sky-300/60" />
          <div className="pointer-events-none absolute bottom-3 right-3 h-7 w-7 border-b border-r border-sky-300/60" />

          {/* Top technical text */}

          <div className="pointer-events-none absolute left-5 top-4 z-20 flex items-center gap-2">
            <Crosshair size={10} className="text-sky-300/70" />

            <span className="text-[8px] font-medium uppercase tracking-[0.18em] text-sky-300/60">
              NeuroScan // MRI
            </span>
          </div>

          <div className="pointer-events-none absolute right-5 top-4 z-20">
            <span className="font-mono text-[8px] tracking-wider text-sky-300/40">
              INPUT_01
            </span>
          </div>


          {/* =================================================
              MRI SELECTED
          ================================================= */}

          {previewUrl ? (
            <div className="relative min-h-[310px]">

              {/* MRI preview */}

              <div className="relative flex min-h-[310px] items-center justify-center px-8 pb-10 pt-11">

                {/* Circular HUD */}

                <div className="pointer-events-none absolute left-1/2 top-1/2 h-60 w-60 -translate-x-1/2 -translate-y-1/2 rounded-full border border-sky-300/[0.08]" />

                <div className="pointer-events-none absolute left-1/2 top-1/2 h-52 w-52 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-sky-300/[0.14]" />

                <div className="pointer-events-none absolute left-1/2 top-1/2 h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full border border-sky-300/[0.07]" />


                {/* Glow behind image */}

                <div className="pointer-events-none absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-300/[0.09] blur-3xl" />


                {/* MRI */}

                <img
                  src={previewUrl}
                  alt="Selected MRI preview"
                  className="relative z-10 max-h-[230px] w-full object-contain drop-shadow-[0_0_14px_rgba(125,211,252,0.18)]"
                />


                {/* Scan beam */}

                <div className="pointer-events-none absolute left-[8%] right-[8%] top-[30%] z-20 h-px animate-[scanBeam_3.8s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-sky-300/90 to-transparent shadow-[0_0_12px_rgba(125,211,252,0.8)]" />


                {/* Crosshair */}

                <div className="pointer-events-none absolute left-1/2 top-1/2 z-20 h-5 w-px -translate-x-1/2 -translate-y-1/2 bg-sky-300/30" />

                <div className="pointer-events-none absolute left-1/2 top-1/2 z-20 h-px w-5 -translate-x-1/2 -translate-y-1/2 bg-sky-300/30" />


                {/* Change button */}

                <div className="absolute right-5 top-10 z-30 flex items-center gap-1.5 rounded-md border border-sky-300/15 bg-[#020a10]/85 px-2.5 py-1.5 text-[9px] uppercase tracking-wider text-sky-200/70 backdrop-blur">
                  <RefreshCw size={10} />
                  Change
                </div>


                {/* Scan label */}

                <div className="absolute bottom-5 left-1/2 z-20 -translate-x-1/2">
                  <div className="flex items-center gap-2 rounded-full border border-sky-300/10 bg-[#020a10]/75 px-3 py-1.5 backdrop-blur">
                    <ScanLine
                      size={11}
                      className="text-sky-300"
                    />

                    <span className="text-[8px] font-medium uppercase tracking-[0.15em] text-sky-200/70">
                      MRI Preview
                    </span>
                  </div>
                </div>

              </div>

            </div>
          ) : (

            /* =================================================
               EMPTY SCANNER
            ================================================= */

            <div className="relative flex min-h-[310px] flex-col items-center justify-center px-5 py-12 text-center">

              {/* Circular AI scanner */}

              <div className="relative flex h-36 w-36 items-center justify-center">

                {/* Outer ring */}

                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute inset-0 rounded-full border border-dashed border-sky-300/20"
                />

                {/* Second ring */}

                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{
                    duration: 14,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute inset-[12px] rounded-full border border-dashed border-sky-300/15"
                />

                {/* Third ring */}

                <div className="absolute inset-[25px] rounded-full border border-sky-300/10 bg-sky-400/[0.025]" />

                {/* Ring markers */}

                <div className="absolute left-1/2 top-0 h-2 w-px -translate-x-1/2 bg-sky-300/70" />

                <div className="absolute bottom-0 left-1/2 h-2 w-px -translate-x-1/2 bg-sky-300/70" />

                <div className="absolute left-0 top-1/2 h-px w-2 -translate-y-1/2 bg-sky-300/70" />

                <div className="absolute right-0 top-1/2 h-px w-2 -translate-y-1/2 bg-sky-300/70" />


                {/* Center */}

                <div className="relative flex h-16 w-16 items-center justify-center rounded-full border border-sky-300/25 bg-sky-400/[0.08] shadow-[0_0_30px_rgba(56,189,248,0.12)]">

                  <BrainCircuit
                    size={28}
                    className="text-sky-300 drop-shadow-[0_0_7px_rgba(125,211,252,0.5)]"
                  />

                </div>

              </div>


              <div className="mt-5 flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-sky-300 shadow-[0_0_8px_rgba(125,211,252,0.9)]" />

                <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-sky-300/70">
                  Awaiting MRI Input
                </span>

                <span className="h-1 w-1 rounded-full bg-sky-300 shadow-[0_0_8px_rgba(125,211,252,0.9)]" />
              </div>


              <h3 className="mt-3 text-sm font-semibold text-sky-50">
                Drop brain MRI here
              </h3>


              <p className="mt-2 max-w-[250px] text-[11px] leading-5 text-slate-500">
                Select a FLAIR brain MRI image to initialize the AI analysis
                pipeline.
              </p>


              <button
                type="button"
                disabled={disabled}
                onClick={(e) => {
                  e.stopPropagation();
                  inputRef.current?.click();
                }}
                className="mt-5 inline-flex items-center gap-2 rounded-lg border border-sky-300/25 bg-sky-400/[0.08] px-4 py-2.5 text-xs font-medium text-sky-200 transition hover:border-sky-300/50 hover:bg-sky-400/[0.13] hover:shadow-[0_0_20px_rgba(56,189,248,0.08)]"
              >
                <UploadCloud size={15} />
                Select MRI
              </button>


              <div className="mt-4 flex items-center gap-2 text-[9px] uppercase tracking-wider text-slate-700">
                <ImageIcon size={10} />
                Drag & Drop Supported
              </div>

            </div>
          )}
        </div>


        {/* =====================================================
            SELECTED FILE
        ===================================================== */}

        {previewUrl && (
          <div className="mt-3 flex items-center gap-3 rounded-xl border border-sky-400/10 bg-sky-400/[0.025] px-3.5 py-3">

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-emerald-400/15 bg-emerald-400/[0.06]">
              <CheckCircle2
                size={16}
                className="text-emerald-300"
              />
            </div>

            <div className="min-w-0 flex-1">

              <p className="truncate text-xs font-medium text-slate-200">
                {fileName}
              </p>

              <p className="mt-1 text-[10px] text-slate-600">
                {fileSize} • Ready for AI analysis
              </p>

            </div>

            <div className="hidden items-center gap-1.5 sm:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />

              <span className="text-[9px] uppercase tracking-wider text-emerald-300/70">
                Ready
              </span>
            </div>

          </div>
        )}


        {/* =====================================================
            TECHNICAL INFO
        ===================================================== */}

        <div className="mt-3 grid grid-cols-2 gap-2">

          <div className="rounded-lg border border-sky-400/[0.08] bg-sky-400/[0.018] px-3 py-2.5">

            <p className="text-[8px] font-semibold uppercase tracking-[0.16em] text-sky-300/40">
              Image Formats
            </p>

            <p className="mt-1.5 text-[10px] text-slate-500">
              JPG · JPEG · PNG · BMP
            </p>

          </div>


          <div className="rounded-lg border border-sky-400/[0.08] bg-sky-400/[0.018] px-3 py-2.5">

            <p className="text-[8px] font-semibold uppercase tracking-[0.16em] text-sky-300/40">
              Imaging Mode
            </p>

            <p className="mt-1.5 text-[10px] text-slate-500">
              Brain MRI · FLAIR
            </p>

          </div>

        </div>


        <input
          ref={inputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.bmp"
          className="hidden"
          disabled={disabled}
          onChange={(e) => {
            handleFile(e.target.files?.[0]);
            e.target.value = "";
          }}
        />


        {/* Local animation used by MRI scan beam */}

        <style>
          {`
            @keyframes scanBeam {
              0% {
                top: 18%;
                opacity: 0;
              }

              15% {
                opacity: 0.9;
              }

              50% {
                opacity: 0.55;
              }

              85% {
                opacity: 0.9;
              }

              100% {
                top: 82%;
                opacity: 0;
              }
            }
          `}
        </style>

      </div>
    </motion.div>
  );
}