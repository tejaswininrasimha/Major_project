import { NavLink } from "react-router-dom";
import {
  BrainCircuit,
  LayoutDashboard,
  History,
  Activity,
} from "lucide-react";
import { motion } from "framer-motion";

const navLink = ({ isActive }) =>
  `relative flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition-all duration-200 ${
    isActive
      ? "bg-white/[0.07] text-white"
      : "text-slate-500 hover:bg-white/[0.04] hover:text-slate-200"
  }`;

export default function Navbar() {
  return (
    <motion.header
      initial={{ y: -15, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.35 }}
      className="sticky top-0 z-50 border-b border-white/[0.07] bg-[#080d17]/90 backdrop-blur-xl"
    >
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 md:px-8">

        {/* ==================================================
            BRAND
        ================================================== */}

        <NavLink
          to="/"
          className="group flex items-center gap-3.5"
        >
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-brand-400/20 bg-brand-500/10">
            <BrainCircuit
              size={21}
              className="text-brand-400 transition-transform duration-300 group-hover:scale-105"
            />

            <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full border-2 border-[#080d17] bg-emerald-400" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[17px] font-semibold tracking-tight text-slate-100">
                NeuroScan
              </span>

              <span className="rounded-md border border-brand-400/20 bg-brand-500/10 px-1.5 py-0.5 text-[9px] font-semibold tracking-wider text-brand-300">
                XAI
              </span>
            </div>

            <p className="mt-0.5 text-[10px] font-medium tracking-[0.13em] text-slate-600">
              EXPLAINABLE NEUROIMAGING
            </p>
          </div>
        </NavLink>


        {/* ==================================================
            RIGHT SIDE
        ================================================== */}

        <div className="flex items-center gap-4">

          {/* System status — desktop */}

          <div className="hidden items-center gap-2 border-r border-white/[0.07] pr-4 lg:flex">
            <Activity
              size={14}
              className="text-emerald-400"
            />

            <span className="text-[11px] text-slate-500">
              Analysis System
            </span>

            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          </div>


          {/* Navigation */}

          <nav className="flex items-center gap-1 rounded-xl border border-white/[0.07] bg-white/[0.025] p-1">

            <NavLink
              to="/"
              end
              className={navLink}
            >
              <LayoutDashboard size={15} />

              <span className="hidden sm:inline">
                Dashboard
              </span>
            </NavLink>

            <NavLink
              to="/history"
              className={navLink}
            >
              <History size={15} />

              <span className="hidden sm:inline">
                History
              </span>
            </NavLink>

          </nav>

        </div>
      </div>
    </motion.header>
  );
}