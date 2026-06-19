"use client";

import { useCommentsStore } from "@/hooks/useCommentsStore";
import { motion, AnimatePresence } from "framer-motion";
import { AgencyListView } from "./AgencyListView";
import { DiscussionView } from "./DiscussionView";
import { ThreadView } from "./ThreadView";
import { X } from "lucide-react";

export function CommentsDrawer() {
  const { isOpen, closeDrawer, view } = useCommentsStore();

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
            <div className="relative flex h-full flex-col">
              {/* Close button */}
              <button
                onClick={closeDrawer}
                className="absolute right-3 top-3 z-[60] flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
                title="Close"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Content */}
              <div className="flex-1 overflow-hidden">
                <AnimatePresence mode="wait">
                  {view === "agency-list" && (
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
                  )}
                  {view === "discussion" && (
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
                  {view === "thread" && (
                    <motion.div
                      key="thread"
                      initial={{ opacity: 0, x: 40 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 40 }}
                      transition={{ duration: 0.2 }}
                      className="h-full"
                    >
                      <ThreadView />
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
