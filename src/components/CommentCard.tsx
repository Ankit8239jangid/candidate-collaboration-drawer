"use client";

import { useState } from "react";
import { User, Reaction, Attachment, Comment } from "@/data/dummyData";
import { formatDistanceToNow } from "date-fns";
import { CornerDownRight, X, Smile, MessageCirclePlus } from "lucide-react";
import { MessageComposer } from "./MessageComposer";

interface CommentCardProps {
  comment: Comment;
  user: User | null;
  reactions: Reaction[];
  attachments: Attachment[];
  replies: { comment: Comment; user: User | null }[];
  allReactions: Reaction[];
  allAttachments: Attachment[];
  onReact: (commentId: number, emoji: string) => void;
  onReply: (content: string, mentions: number[] | null, attachments: { fileName: string; fileUrl: string; fileType: string; fileSize: number }[]) => void;
  users: User[];
  isReply?: boolean;
  currentUserId?: number;
}

const REACTION_EMOJIS = ["👍", "❤️", "🔥", "😂", "👏", "👀"];

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

function renderMentions(content: string, usersList: User[]) {
  // Build a regex that matches @UserName patterns (supports multi-word names)
  // Sort by name length descending so longer names match first
  const sorted = [...usersList].sort((a, b) => b.name.length - a.name.length);
  const pattern = new RegExp(
    "(" + sorted.map((u) => `@${u.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`).join("|") + ")",
    "g"
  );
  const parts = content.split(pattern);
  return parts.map((part, i) => {
    if (!part.startsWith("@")) return <span key={i}>{part}</span>;
    const userName = part.slice(1);
    const mention = usersList.find((u) => u.name === userName);
    if (mention) {
      return (
        <span
          key={i}
          className="inline-block rounded-md bg-orange-50 px-1.5 py-0.5 text-sm font-semibold text-[#F76711]"
        >
          {part}
        </span>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

export function CommentCard({
  comment,
  user,
  reactions,
  attachments,
  replies,
  allReactions,
  allAttachments,
  onReact,
  onReply,
  users,
  isReply = false,
  currentUserId = 1,
}: CommentCardProps) {
  const [showReplyComposer, setShowReplyComposer] = useState(false);
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const isMyComment = user?.id === currentUserId;

  const reactionCounts = reactions.reduce((acc, r) => {
    acc[r.emoji] = (acc[r.emoji] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className={`${isReply ? "ml-10 mt-3" : ""}`}>
      <div className={`group flex gap-3 rounded-2xl p-3 transition-colors ${isMyComment ? "bg-orange-50/60 ring-1 ring-orange-100" : ""}`}>
        <img
          src={user?.avatarUrl || "https://ui-avatars.com/api/?name=User"}
          alt={user?.name || "User"}
          className="h-9 w-9 shrink-0 rounded-full object-cover shadow-sm"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-sm font-semibold ${isMyComment ? "text-[#F76711]" : "text-gray-900"}`}>
              {user?.name || "Unknown"}
            </span>
            {isMyComment && (
              <span className="rounded-full bg-[#F76711]/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#F76711]">
                You
              </span>
            )}
            <span className="text-xs text-gray-400">
              {comment.createdAt
                ? formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })
                : "Just now"}
            </span>
            {user?.role && !isMyComment && (
              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-gray-500">
                {user.role}
              </span>
            )}
          </div>

          <div className="mt-1.5 text-sm leading-7 text-gray-700">
            {renderMentions(comment.content, users)}
          </div>

          {/* Attachments */}
          {attachments.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {attachments.map((attachment) => (
                <div key={attachment.id}>
                  {attachment.fileType.startsWith("image/") ? (
                    <button
                      onClick={() => setLightboxImage(attachment.fileUrl)}
                      className="group/img relative overflow-hidden rounded-xl border border-gray-200 shadow-sm"
                    >
                      <img
                        src={attachment.fileUrl}
                        alt={attachment.fileName}
                        className="h-32 w-40 object-cover transition-transform duration-300 group-hover/img:scale-105"
                      />
                    </button>
                  ) : (
                    <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100">
                        <span className="text-xs font-bold text-orange-600">PDF</span>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-700">{attachment.fileName}</p>
                        <p className="text-xs text-gray-400">{formatFileSize(attachment.fileSize)}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Reactions — always visible */}
          {Object.keys(reactionCounts).length > 0 && (
            <div className="mt-2 flex items-center gap-1.5 flex-wrap">
              {Object.entries(reactionCounts).map(([emoji, count]) => (
                <button
                  key={emoji}
                  onClick={() => onReact(comment.id, emoji)}
                  className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white px-2.5 py-1 text-xs transition-all hover:border-orange-200 hover:bg-orange-50 hover:shadow-sm"
                >
                  <span>{emoji}</span>
                  <span className="font-semibold text-gray-600">{count}</span>
                </button>
              ))}
            </div>
          )}

          {/* Hover actions: Emoji picker + Reply — only visible on hover */}
          {!isReply && (
            <div className="mt-1 flex items-center gap-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
              <div className="relative">
                <button
                  onClick={() => setShowReactionPicker(!showReactionPicker)}
                  className="flex h-7 items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                  style={{ fontFamily: "'Segoe UI Emoji', 'Apple Color Emoji', 'Noto Color Emoji', sans-serif" }}
                >
                  <Smile className="h-3.5 w-3.5" />
                  <span>Emoji</span>
                </button>
                {showReactionPicker && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowReactionPicker(false)}
                    />
                    <div className="absolute left-0 top-8 z-20 flex items-center gap-2 rounded-xl border border-gray-200 bg-white p-2 shadow-xl">
                      {REACTION_EMOJIS.map((emoji) => (
                        <button
                          key={emoji}
                          onClick={() => {
                            onReact(comment.id, emoji);
                            setShowReactionPicker(false);
                          }}
                          className="flex h-9 w-9 items-center justify-center rounded-lg text-xl leading-none transition-colors hover:bg-gray-100"
                          style={{ fontFamily: "'Segoe UI Emoji', 'Apple Color Emoji', 'Noto Color Emoji', sans-serif" }}
                        >
                          <span className="block">{emoji}</span>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              <button
                onClick={() => {
                  setShowReplyComposer(!showReplyComposer);
                  setShowReactionPicker(false);
                }}
                className="flex h-7 items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
              >
                <MessageCirclePlus className="h-3.5 w-3.5" />
                <span>Reply</span>
              </button>
            </div>
          )}

          {/* Reply Composer */}
          {showReplyComposer && !isReply && (
            <div className="mt-3">
              <MessageComposer
                placeholder="Write a reply..."
                users={users}
                onSend={(content: string, mentions: number[] | null, attachments: { fileName: string; fileUrl: string; fileType: string; fileSize: number }[]) => {
                  onReply(content, mentions, attachments);
                  setShowReplyComposer(false);
                }}
                compact
              />
            </div>
          )}
        </div>
      </div>

      {/* Replies */}
      {replies.length > 0 && !isReply && (
        <div className="mt-2">
          {replies.map((reply) => (
            <CommentCard
              key={reply.comment.id}
              comment={reply.comment}
              user={reply.user}
              reactions={allReactions.filter((r) => r.commentId === reply.comment.id)}
              attachments={allAttachments.filter((a) => a.commentId === reply.comment.id)}
              replies={[]}
              allReactions={allReactions}
              allAttachments={allAttachments}
              onReact={onReact}
              onReply={onReply}
              users={users}
              isReply
              currentUserId={currentUserId}
            />
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4"
          onClick={() => setLightboxImage(null)}
        >
          <button
            onClick={() => setLightboxImage(null)}
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
          >
            <X className="h-5 w-5" />
          </button>
          <img
            src={lightboxImage}
            alt="Attachment"
            className="max-h-[85vh] max-w-full rounded-xl object-contain shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
