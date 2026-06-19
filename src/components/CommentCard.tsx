"use client";

import { useState } from "react";
import { User, Reaction, Attachment, Comment } from "@/data/dummyData";
import { formatDistanceToNow } from "date-fns";
import { X, Smile, MessageCirclePlus, FileText, FileSpreadsheet, FileArchive, File as FileIcon, Download } from "lucide-react";

interface CommentCardProps {
  comment: Comment;
  user: User | null;
  reactions: Reaction[];
  attachments: Attachment[];
  replies: { comment: Comment; user: User | null }[];
  allReactions: Reaction[];
  allAttachments: Attachment[];
  onReact: (commentId: number, emoji: string) => void;
  onOpenThread?: (commentId: number) => void;
  users: User[];
  isReply?: boolean;
  isThreadParent?: boolean;
  parentAuthorName?: string;
  currentUserId?: number;
}

const REACTION_EMOJIS = ["👍", "❤️", "🔥", "😂", "👏", "👀"];

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

/** Resolve a document-type chip (icon + color) from a file name / mime. */
function docMeta(fileName: string, fileType: string): { Icon: typeof FileText; color: string; bg: string; label: string } {
  const ext = fileName.split(".").pop()?.toLowerCase() ?? "";
  if (ext === "pdf" || fileType === "application/pdf")
    return { Icon: FileText, color: "text-red-600", bg: "bg-red-50", label: "PDF" };
  if (ext === "doc" || ext === "docx")
    return { Icon: FileText, color: "text-blue-600", bg: "bg-blue-50", label: "DOC" };
  if (ext === "xls" || ext === "xlsx")
    return { Icon: FileSpreadsheet, color: "text-green-600", bg: "bg-green-50", label: "XLS" };
  if (ext === "zip" || ext === "rar" || ext === "7z")
    return { Icon: FileArchive, color: "text-amber-600", bg: "bg-amber-50", label: "ZIP" };
  return { Icon: FileIcon, color: "text-gray-600", bg: "bg-gray-100", label: "FILE" };
}

function renderMentions(content: string, usersList: User[]) {
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
        <span key={i} className="mx-0.5 inline-block rounded-full bg-brand-50 px-2 py-0.5 text-sm font-semibold text-brand">
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
  onOpenThread,
  users,
  isReply = false,
  isThreadParent = false,
  parentAuthorName,
  currentUserId = 1,
}: CommentCardProps) {
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const isMyComment = user?.id === currentUserId;

  const reactionCounts = reactions.reduce((acc, r) => {
    acc[r.emoji] = (acc[r.emoji] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const replyCount = replies.length;
  const lastReply = replies[replyCount - 1];
  const lastReplyName = lastReply?.user?.name;

  // Connector line for threaded replies
  const withConnector = isReply;

  return (
    <div className={isReply ? "mt-3" : ""}>
      <div className={`group flex ${withConnector ? "" : isMyComment ? "justify-end" : ""}`}>
        {/* Vertical connector for replies */}
        {withConnector && (
          <div className="mr-3 flex flex-col items-center">
            <span className="mt-3 block h-full w-px bg-gray-200" />
          </div>
        )}

        <div className={`min-w-0 ${isThreadParent ? "w-full" : "max-w-[85%] sm:max-w-[75%]"}`}>
          {/* "Replying to" label for replies */}
          {withConnector && parentAuthorName && (
            <div className="mb-1 text-xs text-gray-400">
              Replying to <span className="font-medium text-brand">@{parentAuthorName}</span>
            </div>
          )}

          <div className="flex gap-2.5">
            <img
              src={user?.avatarUrl || "https://ui-avatars.com/api/?name=User"}
              alt={user?.name || "User"}
              className="h-9 w-9 shrink-0 rounded-full object-cover shadow-sm"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-sm font-semibold ${isMyComment ? "text-brand" : "text-gray-900"}`}>
                  {user?.name || "Unknown"}
                </span>
                {isMyComment && (
                  <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand">
                    You
                  </span>
                )}
                <span className="text-xs text-gray-400">
                  {comment.createdAt
                    ? formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })
                    : "Just now"}
                </span>
                {user?.role && !isMyComment && (
                  <span className="rounded-full  px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-gray-500">
                    {user.role}
                  </span>
                )}
              </div>

              {/* Message bubble */}
              {comment.content && (
                <div className={`mt-1.5 inline-block rounded-2xl px-3.5 py-2 text-sm leading-6 ${isMyComment ? "bg-brand-50 text-gray-800" : "bg-gray-50 text-gray-700"}`}>
                  {renderMentions(comment.content, users)}
                </div>
              )}

              {/* Attachments — inside the card flow, not floating */}
              {attachments.length > 0 && (
                <div className="mt-2 flex flex-col gap-2">
                  {attachments.map((attachment) => (
                    <div key={attachment.id} className="max-w-sm">
                      {attachment.fileType.startsWith("image/") ? (
                        <button
                          onClick={() => setLightboxImage(attachment.fileUrl)}
                          className="group/img relative block overflow-hidden rounded-xl border border-gray-200 shadow-sm"
                        >
                          <img
                            src={attachment.fileUrl}
                            alt={attachment.fileName}
                            className="h-40 w-full max-w-sm object-cover transition-transform duration-300 group-hover/img:scale-105"
                          />
                        </button>
                      ) : (() => {
                          const meta = docMeta(attachment.fileName, attachment.fileType);
                          const { Icon } = meta;
                          return (
                            <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-3 py-2.5 shadow-sm">
                              <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${meta.bg}`}>
                                <Icon className={`h-4 w-4 ${meta.color}`} />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-xs font-medium text-gray-800">{attachment.fileName}</p>
                                <p className="text-[11px] text-gray-400">{formatFileSize(attachment.fileSize)}</p>
                              </div>
                              <a
                                href={attachment.fileUrl}
                                download={attachment.fileName}
                                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
                                title="Download"
                              >
                                <Download className="h-3.5 w-3.5" />
                              </a>
                            </div>
                          );
                        })()}
                    </div>
                  ))}
                </div>
              )}

              {/* Reactions — always visible when present */}
              {Object.keys(reactionCounts).length > 0 && (
                <div className="mt-1.5 flex items-center gap-1.5 flex-wrap">
                  {Object.entries(reactionCounts).map(([emoji, count]) => (
                    <button
                      key={emoji}
                      onClick={() => onReact(comment.id, emoji)}
                      className="emoji inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white px-2 py-0.5 text-xs transition-all hover:border-brand-200 hover:bg-brand-50 hover:shadow-sm"
                    >
                      <span className="text-sm">{emoji}</span>
                      <span className="font-semibold text-gray-600">{count}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Hover actions: Emoji + Reply — only on main comments (not replies, not the thread parent) */}
              {!isReply && !isThreadParent && (
                <div className="mt-1 flex items-center gap-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100 focus-within:opacity-100">
                  <div className="relative">
                    <button
                      onClick={() => setShowReactionPicker((v) => !v)}
                      className="flex h-7 items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                    >
                      <Smile className="h-3.5 w-3.5" />
                      <span>React</span>
                    </button>
                    {showReactionPicker && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setShowReactionPicker(false)} />
                        <div className="emoji absolute left-0 top-8 z-20 flex items-center gap-1 rounded-xl border border-gray-200 bg-white p-1.5 shadow-xl">
                          {REACTION_EMOJIS.map((emoji) => (
                            <button
                              key={emoji}
                              onClick={() => {
                                onReact(comment.id, emoji);
                                setShowReactionPicker(false);
                              }}
                              className="flex h-9 w-9 items-center justify-center rounded-lg text-xl leading-none transition-transform hover:scale-125 hover:bg-gray-100"
                            >
                              <span className="block">{emoji}</span>
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>

                  {onOpenThread && (
                    <button
                      onClick={() => onOpenThread(comment.id)}
                      className="flex h-7 items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                    >
                      <MessageCirclePlus className="h-3.5 w-3.5" />
                      <span>Reply</span>
                    </button>
                  )}
                </div>
              )}

              {/* Thread summary chip — replaces inline replies on the main feed */}
              {!isReply && !isThreadParent && replyCount > 0 && onOpenThread && (
                <button
                  onClick={() => onOpenThread(comment.id)}
                  className="mt-1.5 inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand transition-colors hover:bg-brand-100"
                >
                  <span className="font-semibold">{replyCount} {replyCount === 1 ? "reply" : "replies"}</span>
                  {lastReplyName && (
                    <span className="text-brand/70">· last by {lastReplyName}</span>
                  )}
                  <span className="text-brand/70">→</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

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
