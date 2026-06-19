"use client";

import { useMemo, useState } from "react";
import { getAgencyStats, users } from "@/data/dummyData";
import { useCommentsStore } from "@/hooks/useCommentsStore";
import { Search, MessageSquare, ChevronRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export function AgencyListView() {
  const selectedCandidate = useCommentsStore((s) => s.selectedCandidate);
  const selectAgency = useCommentsStore((s) => s.selectAgency);
  const [searchQuery, setSearchQuery] = useState("");

  const agencyStats = useMemo(() => {
    if (!selectedCandidate) return [];
    return getAgencyStats(selectedCandidate.id);
  }, [selectedCandidate]);

  const filteredAgencies = agencyStats.filter((agency) =>
    agency.agencyName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!filteredAgencies.length) {
    return (
      <div className="flex h-full flex-col items-center justify-center px-6 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100">
          <MessageSquare className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-base font-semibold text-gray-900">
          {searchQuery ? "No agencies match your search" : "No discussions available"}
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          {searchQuery
            ? "Try a different search term"
            : "No agencies have commented on this candidate yet."}
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      {/* Search */}
      <div className="border-b border-gray-50 px-4 py-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search agency discussions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 outline-none transition-all focus:border-[#F76711] focus:bg-white focus:ring-2 focus:ring-orange-100"
          />
        </div>
      </div>

      {/* Agency List */}
      <div className="flex-1 overflow-y-auto p-3 custom-scrollbar">
        <div className="space-y-2">
          {filteredAgencies.map((agency) => (
            <button
              key={agency.agencyId}
              onClick={() => selectAgency(agency)}
              className="flex w-full items-start gap-3 rounded-xl border border-gray-100 bg-white p-4 text-left transition-all hover:border-gray-200 hover:bg-gray-50/80 hover:shadow-sm"
            >
              <img
                src={agency.agencyAvatar || "https://ui-avatars.com/api/?name=Agency"}
                alt={agency.agencyName}
                className="mt-0.5 h-11 w-11 rounded-full object-cover shadow-sm"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="truncate text-sm font-semibold text-gray-900">
                    {agency.agencyName}
                  </h3>
                  <ChevronRight className="h-4 w-4 shrink-0 text-gray-300" />
                </div>
                {agency.lastMessage && (
                  <p className="mt-1 truncate text-sm text-gray-500">
                    {agency.lastMessage}
                  </p>
                )}
                <div className="mt-2 flex items-center gap-3">
                  <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-2.5 py-1 text-xs font-semibold text-[#F76711]">
                    <MessageSquare className="h-3 w-3" />
                    {agency.commentCount} comments
                  </span>
                  {agency.lastActivity && (
                    <span className="text-xs text-gray-400">
                      {formatDistanceToNow(new Date(agency.lastActivity), { addSuffix: true })}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
