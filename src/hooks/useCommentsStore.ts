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
  view: "agency-list" | "discussion";
  comments: Comment[];
  reactions: Reaction[];
  attachments: Attachment[];
  openDrawer: (candidate: Candidate) => void;
  closeDrawer: () => void;
  selectAgency: (agency: AgencyStats) => void;
  goBackToAgencyList: () => void;
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
  comments: [],
  reactions: [],
  attachments: [],
  openDrawer: (candidate) =>
    set({
      isOpen: true,
      selectedCandidate: candidate,
      selectedAgency: null,
      view: "agency-list",
    }),
  closeDrawer: () =>
    set({
      isOpen: false,
      selectedCandidate: null,
      selectedAgency: null,
      view: "agency-list",
    }),
  selectAgency: (agency) =>
    set({
      selectedAgency: agency,
      view: "discussion",
    }),
  goBackToAgencyList: () =>
    set({
      selectedAgency: null,
      view: "agency-list",
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
