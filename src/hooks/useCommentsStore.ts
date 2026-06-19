import { create } from "zustand";
import { Candidate, Agency, User, Comment, Reaction, Attachment } from "@/data/dummyData";

interface AgencyStats {
  agencyId: number;
  agencyName: string;
  agencyAvatar: string | null;
  commentCount: number;
  lastMessage: string | null;
  lastActivity: string | null;
}

interface CommentsStore {
  isOpen: boolean;
  selectedCandidate: Candidate | null;
  selectedAgency: AgencyStats | null;
  view: "agency-list" | "discussion" | "thread";
  activeThreadId: number | null;
  comments: Comment[];
  reactions: Reaction[];
  attachments: Attachment[];
  openDrawer: (candidate: Candidate) => void;
  closeDrawer: () => void;
  selectAgency: (agency: AgencyStats) => void;
  goBackToAgencyList: () => void;
  openThread: (commentId: number) => void;
  closeThread: () => void;
  addComment: (comment: Comment) => void;
  addReaction: (reaction: Reaction) => void;
  removeReaction: (reactionId: number) => void;
  addAttachment: (attachment: Attachment) => void;
}

export const useCommentsStore = create<CommentsStore>((set) => ({
  isOpen: false,
  selectedCandidate: null,
  selectedAgency: null,
  view: "agency-list",
  activeThreadId: null,
  comments: [],
  reactions: [],
  attachments: [],
  openDrawer: (candidate) =>
    set({
      isOpen: true,
      selectedCandidate: candidate,
      selectedAgency: null,
      view: "agency-list",
      activeThreadId: null,
    }),
  closeDrawer: () =>
    set({
      isOpen: false,
      selectedCandidate: null,
      selectedAgency: null,
      view: "agency-list",
      activeThreadId: null,
    }),
  selectAgency: (agency) =>
    set({
      selectedAgency: agency,
      view: "discussion",
      activeThreadId: null,
    }),
  goBackToAgencyList: () =>
    set({
      selectedAgency: null,
      view: "agency-list",
      activeThreadId: null,
    }),
  openThread: (commentId) =>
    set({
      activeThreadId: commentId,
      view: "thread",
    }),
  closeThread: () =>
    set({
      activeThreadId: null,
      view: "discussion",
    }),
  addComment: (comment) =>
    set((state) => ({
      comments: [...state.comments, comment],
    })),
  addReaction: (reaction) =>
    set((state) => ({
      reactions: [...state.reactions, reaction],
    })),
  removeReaction: (reactionId) =>
    set((state) => ({
      reactions: state.reactions.filter((r) => r.id !== reactionId),
    })),
  addAttachment: (attachment) =>
    set((state) => ({
      attachments: [...state.attachments, attachment],
    })),
}));
