export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  avatarUrl: string;
}

export interface Agency {
  id: number;
  name: string;
  avatarUrl: string;
}

export interface Candidate {
  id: number;
  candidateId: string;
  name: string;
  photoUrl: string;
  status: "active" | "interviewing" | "placed";
  agency: string;
  lastActivity: string;
}

export interface Reaction {
  id: number;
  commentId: number;
  userId: number;
  emoji: string;
}

export interface Attachment {
  id: number;
  commentId: number;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
}

export interface Comment {
  id: number;
  candidateId: number;
  agencyId: number;
  userId: number;
  parentId: number | null;
  content: string;
  mentions: number[] | null;
  createdAt: string;
}

export interface CommentWithUser {
  comment: Comment;
  user: User;
}

export const users: User[] = [
  { id: 1, name: "John Recruiter", email: "john@seekhelpers.com", role: "recruiter", avatarUrl: "https://ui-avatars.com/api/?name=John+Recruiter&background=F76711&color=fff" },
  { id: 2, name: "Sarah Jenkins", email: "sarah@seekhelpers.com", role: "manager", avatarUrl: "https://ui-avatars.com/api/?name=Sarah+Jenkins&background=2563EB&color=fff" },
  { id: 3, name: "Alex Chen", email: "alex@elitehelpers.com", role: "recruiter", avatarUrl: "https://ui-avatars.com/api/?name=Alex+Chen&background=16A34A&color=fff" },
  { id: 4, name: "Mike Ross", email: "mike@seekhelpers.com", role: "sales", avatarUrl: "https://ui-avatars.com/api/?name=Mike+Ross&background=9333EA&color=fff" },
  { id: 5, name: "Emily Wang", email: "emily@seekhelpers.com", role: "recruiter", avatarUrl: "https://ui-avatars.com/api/?name=Emily+Wang&background=DC2626&color=fff" },
  { id: 6, name: "David Kim", email: "david@elitehelpers.com", role: "manager", avatarUrl: "https://ui-avatars.com/api/?name=David+Kim&background=0891B2&color=fff" },
];

export const agencies: Agency[] = [
  { id: 1, name: "SeekHelpers Agency", avatarUrl: "https://ui-avatars.com/api/?name=SeekHelpers&background=F76711&color=fff" },
  { id: 2, name: "Elite Helpers", avatarUrl: "https://ui-avatars.com/api/?name=Elite+Helpers&background=2563EB&color=fff" },
  { id: 3, name: "Sales Team", avatarUrl: "https://ui-avatars.com/api/?name=Sales+Team&background=16A34A&color=fff" },
  { id: 4, name: "Recruitment Team", avatarUrl: "https://ui-avatars.com/api/?name=Recruitment+Team&background=9333EA&color=fff" },
];

export const candidates: Candidate[] = [
  { id: 1, candidateId: "CAND-2048", name: "Maria Santos", photoUrl: "https://ui-avatars.com/api/?name=Maria+Santos&background=F76711&color=fff", status: "active", agency: "SeekHelpers Agency", lastActivity: new Date(Date.now() - 1000 * 60 * 30).toISOString() },
  { id: 2, candidateId: "CAND-2049", name: "James Wilson", photoUrl: "https://ui-avatars.com/api/?name=James+Wilson&background=2563EB&color=fff", status: "interviewing", agency: "Elite Helpers", lastActivity: new Date(Date.now() - 1000 * 60 * 120).toISOString() },
  { id: 3, candidateId: "CAND-2050", name: "Linda Chen", photoUrl: "https://ui-avatars.com/api/?name=Linda+Chen&background=16A34A&color=fff", status: "placed", agency: "SeekHelpers Agency", lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString() },
  { id: 4, candidateId: "CAND-2051", name: "Robert Taylor", photoUrl: "https://ui-avatars.com/api/?name=Robert+Taylor&background=9333EA&color=fff", status: "active", agency: "Sales Team", lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() },
  { id: 5, candidateId: "CAND-2052", name: "Sophie Martinez", photoUrl: "https://ui-avatars.com/api/?name=Sophie+Martinez&background=DC2626&color=fff", status: "interviewing", agency: "Recruitment Team", lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString() },
  { id: 6, candidateId: "CAND-2053", name: "Daniel Park", photoUrl: "https://ui-avatars.com/api/?name=Daniel+Park&background=0891B2&color=fff", status: "active", agency: "Elite Helpers", lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() },
];

export let comments: Comment[] = [
  { id: 1, candidateId: 1, agencyId: 1, userId: 1, parentId: null, content: "Candidate speaks fluent Cantonese and has 5 years of experience in hospitality.", mentions: null, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() },
  { id: 2, candidateId: 1, agencyId: 1, userId: 2, parentId: null, content: "Great! @John Recruiter can you schedule an interview for next week?", mentions: [1], createdAt: new Date(Date.now() - 1000 * 60 * 60 * 22).toISOString() },
  { id: 3, candidateId: 1, agencyId: 1, userId: 1, parentId: null, content: "Sure, I'll reach out to her today.", mentions: null, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString() },
  { id: 4, candidateId: 1, agencyId: 1, userId: 5, parentId: null, content: "Her references checked out very well. Previous employer gave excellent feedback.", mentions: null, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString() },
  { id: 5, candidateId: 1, agencyId: 1, userId: 2, parentId: null, content: "Perfect, let's move her to the interviewing stage.", mentions: null, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 16).toISOString() },
  { id: 6, candidateId: 1, agencyId: 1, userId: 4, parentId: null, content: "Sales team is interested. Potential placement at the Grand Hotel.", mentions: null, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 14).toISOString() },
  { id: 7, candidateId: 1, agencyId: 1, userId: 4, parentId: null, content: "Client is willing to offer competitive salary.", mentions: null, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString() },
  { id: 8, candidateId: 1, agencyId: 1, userId: 1, parentId: null, content: "Interview scheduled for Monday at 2 PM.", mentions: null, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 10).toISOString() },
  { id: 9, candidateId: 1, agencyId: 1, userId: 2, parentId: null, content: "Thanks for the update @John Recruiter!", mentions: [1], createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString() },
  { id: 10, candidateId: 1, agencyId: 1, userId: 5, parentId: null, content: "I'll prepare the interview materials.", mentions: null, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString() },
  { id: 11, candidateId: 1, agencyId: 1, userId: 2, parentId: 8, content: "Make sure to ask about her salary expectations.", mentions: null, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 9).toISOString() },
  { id: 12, candidateId: 1, agencyId: 1, userId: 1, parentId: 8, content: "Will do, thanks for the reminder!", mentions: null, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8.5).toISOString() },
  { id: 13, candidateId: 1, agencyId: 2, userId: 3, parentId: null, content: "We also have her profile. She's a strong candidate for our client.", mentions: null, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 15).toISOString() },
  { id: 14, candidateId: 1, agencyId: 2, userId: 6, parentId: null, content: "Agreed. Let's coordinate with SeekHelpers on this.", mentions: null, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 13).toISOString() },
  { id: 15, candidateId: 1, agencyId: 2, userId: 6, parentId: 13, content: "What's the timeline looking like?", mentions: null, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 14).toISOString() },
  { id: 16, candidateId: 1, agencyId: 2, userId: 3, parentId: 13, content: "Client wants someone within 2 weeks.", mentions: null, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 13.5).toISOString() },
  { id: 17, candidateId: 1, agencyId: 3, userId: 4, parentId: null, content: "Sales team is interested. Potential placement at the Grand Hotel.", mentions: null, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString() },
  { id: 18, candidateId: 1, agencyId: 3, userId: 4, parentId: null, content: "Client is willing to offer competitive salary.", mentions: null, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString() },
  { id: 19, candidateId: 1, agencyId: 4, userId: 2, parentId: null, content: "Recruitment team reviewing her background check.", mentions: null, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 19).toISOString() },
  { id: 20, candidateId: 1, agencyId: 4, userId: 5, parentId: null, content: "Background check cleared. No issues found.", mentions: null, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 17).toISOString() },
];

export let reactions: Reaction[] = [
  { id: 1, commentId: 1, userId: 2, emoji: "👍" },
  { id: 2, commentId: 1, userId: 3, emoji: "👍" },
  { id: 3, commentId: 1, userId: 5, emoji: "🔥" },
  { id: 4, commentId: 2, userId: 1, emoji: "👍" },
  { id: 5, commentId: 5, userId: 1, emoji: "👏" },
  { id: 6, commentId: 5, userId: 5, emoji: "👏" },
  { id: 7, commentId: 8, userId: 2, emoji: "👍" },
  { id: 8, commentId: 8, userId: 5, emoji: "👍" },
  { id: 9, commentId: 8, userId: 4, emoji: "👍" },
  { id: 10, commentId: 12, userId: 2, emoji: "❤️" },
  { id: 11, commentId: 13, userId: 6, emoji: "👍" },
  { id: 12, commentId: 16, userId: 6, emoji: "🔥" },
  { id: 13, commentId: 20, userId: 2, emoji: "👏" },
];

export let attachments: Attachment[] = [
  { id: 1, commentId: 1, fileName: "resume_maria_santos.pdf", fileUrl: "https://placehold.co/400x500/F76711/ffffff?text=Resume+PDF", fileType: "application/pdf", fileSize: 2457600 },
  { id: 2, commentId: 5, fileName: "interview_notes.jpg", fileUrl: "https://placehold.co/600x400/2563EB/ffffff?text=Interview+Notes", fileType: "image/jpeg", fileSize: 1843200 },
];

let nextCommentId = 21;
let nextReactionId = 14;
let nextAttachmentId = 3;

export function addComment(comment: Omit<Comment, "id" | "createdAt">): Comment {
  const newComment: Comment = {
    ...comment,
    id: nextCommentId++,
    createdAt: new Date().toISOString(),
  };
  comments = [...comments, newComment];
  return newComment;
}

export function toggleReactionData(commentId: number, userId: number, emoji: string): { added: boolean; reaction?: Reaction } {
  const existing = reactions.find(
    (r) => r.commentId === commentId && r.userId === userId && r.emoji === emoji
  );
  if (existing) {
    reactions = reactions.filter((r) => r.id !== existing.id);
    return { added: false };
  }
  const newReaction: Reaction = {
    id: nextReactionId++,
    commentId,
    userId,
    emoji,
  };
  reactions = [...reactions, newReaction];
  return { added: true, reaction: newReaction };
}

export function addAttachment(attachment: Omit<Attachment, "id">): Attachment {
  const newAttachment: Attachment = {
    ...attachment,
    id: nextAttachmentId++,
  };
  attachments = [...attachments, newAttachment];
  return newAttachment;
}

export function getAgencyStats(candidateId: number) {
  return agencies.map((agency) => {
    const agencyComments = comments.filter(
      (c) => c.candidateId === candidateId && c.agencyId === agency.id && c.parentId === null
    );
    const lastComment = agencyComments[agencyComments.length - 1];
    return {
      agencyId: agency.id,
      agencyName: agency.name,
      agencyAvatar: agency.avatarUrl,
      commentCount: agencyComments.length,
      lastMessage: lastComment?.content || null,
      lastActivity: lastComment?.createdAt || null,
    };
  }).filter((a) => a.commentCount > 0);
}

export function getDiscussion(candidateId: number, agencyId: number) {
  const mainComments = comments
    .filter((c) => c.candidateId === candidateId && c.agencyId === agencyId && c.parentId === null)
    .map((c) => ({ comment: c, user: users.find((u) => u.id === c.userId)! }));

  const replyComments = comments
    .filter((c) => c.candidateId === candidateId && c.agencyId === agencyId && c.parentId !== null)
    .map((c) => ({ comment: c, user: users.find((u) => u.id === c.userId)! }));

  const commentIds = mainComments.map((c) => c.comment.id);
  const replyIds = replyComments.map((c) => c.comment.id);
  const allIds = [...commentIds, ...replyIds];

  return {
    comments: mainComments,
    replies: replyComments,
    reactions: reactions.filter((r) => allIds.includes(r.commentId)),
    attachments: attachments.filter((a) => allIds.includes(a.commentId)),
  };
}
