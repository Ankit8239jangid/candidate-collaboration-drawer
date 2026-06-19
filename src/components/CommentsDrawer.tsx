"use client";

import { useCommentsStore } from "@/hooks/useCommentsStore";
import { motion, AnimatePresence } from "framer-motion";
import { AgencyListView } from "./AgencyListView";
import { DiscussionView } from "./DiscussionView";
import { X } from "lucide-react";

export function CommentsDrawer() {
  const { isOpen, selectedCandidate, closeDrawer, view } = useCommentsStore();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
            onClick={closeDrawer}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.25, ease: "easeInOut" }}
            className="fixed right-0 top-0 z-50 h-full w-full bg-white shadow-2xl sm:w-[620px] lg:w-[720px]"
          >
            <div className="flex h-full flex-col">
              {/* Header */}
             
              {/* Content */}
              <div className="flex-1 overflow-hidden">
                <AnimatePresence mode="wait">
                  {view === "agency-list" ? (
                    <motion.div
                      key="agency-list"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      className="h-full"
                    >
                      <AgencyListView />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="discussion"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.2 }}
                      className="h-full"
                    >
                      <DiscussionView />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
