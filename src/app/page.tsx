"use client";

import { useMemo } from "react";
import { candidates as allCandidates } from "@/data/dummyData";
import { CandidateList } from "@/components/CandidateList";
import { CommentsDrawer } from "@/components/CommentsDrawer";
import { MessageSquare, Users, Briefcase, TrendingUp } from "lucide-react";

export default function Home() {
  const stats = useMemo(() => [
    { label: "Total Candidates", value: allCandidates.length, icon: Users, color: "bg-orange-50 text-orange-600" },
    { label: "Active", value: allCandidates.filter((c) => c.status === "active").length, icon: Briefcase, color: "bg-green-50 text-green-600" },
    { label: "Interviewing", value: allCandidates.filter((c) => c.status === "interviewing").length, icon: MessageSquare, color: "bg-blue-50 text-blue-600" },
    { label: "Placed", value: allCandidates.filter((c) => c.status === "placed").length, icon: TrendingUp, color: "bg-purple-50 text-purple-600" },
  ], []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F76711] shadow-sm shadow-orange-200">
              <Briefcase className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">SeekHelpers</h1>
              <p className="text-xs font-medium text-gray-400">BackOffice</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden h-8 w-8 items-center justify-center rounded-full bg-orange-100 text-sm font-semibold text-orange-700 ring-2 ring-white shadow-sm sm:flex">
              JD
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Stats */}
        <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-3 flex items-center gap-2.5">
                <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${stat.color}`}>
                  <stat.icon className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium text-gray-500">{stat.label}</span>
              </div>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Candidate List */}
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="border-b border-gray-100 px-6 py-5">
            <h2 className="text-lg font-semibold text-gray-900">Candidates</h2>
            <p className="mt-1 text-sm text-gray-400">Manage and collaborate on candidate profiles</p>
          </div>
          <CandidateList />
        </div>
      </main>

      <CommentsDrawer />
    </div>
  );
}
