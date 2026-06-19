"use client";

import { candidates as allCandidates } from "@/data/dummyData";
import { useCommentsStore } from "@/hooks/useCommentsStore";
import { MessageSquare, Clock, Building2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export function CandidateList() {
  const openDrawer = useCommentsStore((s) => s.openDrawer);

  const statusStyles: Record<string, string> = {
    active: "bg-emerald-50 text-emerald-700 border-emerald-200",
    interviewing: "bg-sky-50 text-sky-700 border-sky-200",
    placed: "bg-violet-50 text-violet-700 border-violet-200",
  };

  return (
    <div className="divide-y divide-gray-50">
      {allCandidates.map((candidate) => (
        <div
          key={candidate.id}
          className="group flex items-center gap-4 px-4 py-4 transition-colors hover:bg-gray-50/80 sm:px-6"
        >
          <div className="relative">
            <img
              src={candidate.photoUrl}
              alt={candidate.name}
              className="h-11 w-11 rounded-full object-cover ring-2 ring-white shadow-sm"
            />
            <span className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white ${
              candidate.status === "active" ? "bg-emerald-400" :
              candidate.status === "interviewing" ? "bg-sky-400" : "bg-violet-400"
            }`} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="truncate text-sm font-semibold text-gray-900">
                {candidate.name}
              </h3>
              <span
                className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                  statusStyles[candidate.status] || "bg-gray-50 text-gray-700 border-gray-200"
                }`}
              >
                {candidate.status}
              </span>
            </div>
            <div className="mt-1 flex items-center gap-3 text-xs text-gray-400">
              <span className="font-mono font-medium text-gray-500">{candidate.candidateId}</span>
              {candidate.agency && (
                <span className="flex items-center gap-1">
                  <Building2 className="h-3 w-3" />
                  {candidate.agency}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatDistanceToNow(new Date(candidate.lastActivity), { addSuffix: true })}
              </span>
            </div>
          </div>
          <button
            onClick={() => openDrawer(candidate)}
            className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-600 shadow-sm transition-all hover:border-[#F76711] hover:text-[#F76711] hover:shadow-md active:scale-95"
          >
            <MessageSquare className="h-4 w-4" />
            <span className="hidden sm:inline">Comments</span>
          </button>
        </div>
      ))}
    </div>
  );
}
