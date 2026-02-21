
"use client";

import { motion } from "framer-motion";
import { Box, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  is3D: boolean;
  has3DModel: boolean;
  onToggle: () => void;
}

export default function ViewerToggle({ is3D, has3DModel, onToggle }: Props) {
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={onToggle}
        disabled={!has3DModel}
        title={has3DModel ? (is3D ? "Switch to 2D view" : "Switch to 3D view") : "No 3D model available yet"}
        className={cn(
          "relative flex items-center gap-2 px-4 py-2 border text-xs souls-title tracking-widest transition-all duration-300",
          has3DModel
            ? "border-[oklch(0.72_0.08_75/50%)] hover:border-[oklch(0.72_0.08_75)] cursor-pointer"
            : "border-[oklch(0.72_0.08_75/15%)] cursor-not-allowed opacity-40"
        )}
      >
        <motion.div
          className="flex items-center gap-2"
          animate={{ opacity: 1 }}
        >
          <div className="flex items-center gap-1.5">
            <ImageIcon
              className={cn(
                "w-3.5 h-3.5 transition-colors duration-200",
                !is3D ? "text-[oklch(0.72_0.08_75)]" : "text-[oklch(0.45_0.01_60)]"
              )}
            />
            <span
              className={cn(
                "transition-colors duration-200",
                !is3D ? "text-[oklch(0.72_0.08_75)]" : "text-[oklch(0.45_0.01_60)]"
              )}
            >
              2D
            </span>
          </div>

          {/* Toggle track */}
          <div
            className={cn(
              "relative w-10 h-5 border transition-all duration-300",
              is3D && has3DModel
                ? "border-[oklch(0.72_0.08_75/60%)] bg-[oklch(0.72_0.08_75/10%)]"
                : "border-[oklch(0.72_0.08_75/30%)]"
            )}
          >
            <motion.div
              className="absolute top-0.5 w-4 h-4 bg-[oklch(0.72_0.08_75)]"
              animate={{ left: is3D ? "calc(100% - 18px)" : "2px" }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          </div>

          <div className="flex items-center gap-1.5">
            <span
              className={cn(
                "transition-colors duration-200",
                is3D ? "text-[oklch(0.72_0.08_75)]" : "text-[oklch(0.45_0.01_60)]"
              )}
            >
              3D
            </span>
            <Box
              className={cn(
                "w-3.5 h-3.5 transition-colors duration-200",
                is3D ? "text-[oklch(0.72_0.08_75)]" : "text-[oklch(0.45_0.01_60)]"
              )}
            />
          </div>
        </motion.div>
      </button>

      {!has3DModel && (
        <span className="text-xs souls-text text-[oklch(0.35_0.01_60)] italic">
          3D model coming soon
        </span>
      )}
    </div>
  );
}
