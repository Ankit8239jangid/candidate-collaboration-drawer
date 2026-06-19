"use client";

import { useMemo, useRef, useEffect, useState } from "react";
import { getDiscussion, users, addComment, toggleReactionData, addAttachment, CURRENT_USER_ID } from "@/data/dummyData";
import { useCommentsStore } from "@/hooks/useCommentsStore";
import { CommentCard } from "./CommentCard";
import { MessageComposer } from "./MessageComposer";
import { ArrowLeft, MessageSquare } from "lucide-react";

export function ThreadView() {
  const selectedCandidate = useCommentsStore((s) => s.selectedCandidate);
  const selectedAgency = useCommentsStore((s) => s.selectedAgency);
  const activeThreadId = useCommentsStore((s) => s.activeThreadId);
  const closeThread = useCommentsStore((s) => s.closeThread);
  const storeAddComment = useCommentsStore((s) => s.addComment);
  const storeAddReaction = useCommentsStore((s) => s.addReaction);
  const storeRemoveReaction = useCommentsStore((s) => s.removeReaction);
  const storeAddAttachment = useCommentsStore((s) => s.addAttachment);
  const storeComments = useCommentsStore((s) => s.comments);
  const storeReactions = useCommentsStore((s) => s.reactions);
  const storeAttachments = useCommentsStore((s) => s.attachments);

  const scrollRef = useRef<HTMLDivElement>(null);
  const [localKey, setLocalKey] = useState(0);

  const discussion = useMemo(() => {
    if (!selectedCandidate || !selectedAgency) return null;
    return getDiscussion(selectedCandidate.id, selectedAgency.agencyId);
  }, [selectedCandidate, selectedAgency, localKey, storeComments, storeReactions, storeAttachments]);

  // Resolve parent + its replies from the discussion
  const parentItem = useMemo(
    () => discussion?.comments.find((c) => c.comment.id === activeThreadId) ?? null,
    [discussion, activeThreadId]
  );

  const replies = useMemo(
    () => (discussion?.replies ?? []).filter((r) => r.comment.parentId === activeThreadId),
    [discussion, activeThreadId]
  );

  const parentAuthorName = parentItem?.user?.name ?? null;

  // Keep latest reply in view, but never yank the user up while they scroll history.
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [replies.length, localKey]);

  if (!selectedAgency || !parentItem) return null;

  const handleReact = (commentId: number, emoji: string) => {
    const result = toggleReactionData(commentId, CURRENT_USER_ID, emoji);
    if (result.added && result.reaction) {
      storeAddReaction(result.reaction);
    } else {
      const existing = storeReactions.find(
        (r) => r.commentId === commentId && r.userId === CURRENT_USER_ID && r.emoji === emoji
      );
      if (existing) storeRemoveReaction(existing.id);
    }
    setLocalKey((k) => k + 1);
  };

  const handleReply = (
    content: string,
    mentions: number[] | null,
    attachments: { fileName: string; fileUrl: string; fileType: string; fileSize: number }[]
  ) => {
    if (activeThreadId == null) return;
    const newComment = addComment({
      candidateId: selectedCandidate!.id,
      agencyId: selectedAgency!.agencyId,
      userId: CURRENT_USER_ID,
      parentId: activeThreadId,
      content,
      mentions,
    });
    storeAddComment(newComment);

    attachments.forEach((att) => {
      const newAtt = addAttachment({
        commentId: newComment.id,
        fileName: att.fileName,
        fileUrl: att.fileUrl,
        fileType: att.fileType,
        fileSize: att.fileSize,
      });
      storeAddAttachment(newAtt);
    });

    setLocalKey((k) => k + 1);

    requestAnimationFrame(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
      }
    });
  };

  return (
    <div className="flex h-full flex-col">
      {/* Thread Header */}
      <div className="flex items-center gap-3 border-b border-gray-100 px-4 py-3">
        <button
          onClick={closeThread}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-semibold text-gray-900">Thread</h3>
          <p className="text-xs text-gray-500">
            {replies.length} {replies.length === 1 ? "reply" : "replies"}
          </p>
        </div>
      </div>

      {/* Sticky parent — lives OUTSIDE the scroll container so it never scrolls away */}
      <div className="shrink-0 border-b border-gray-100 bg-white px-4 py-3">
        <CommentCard
          comment={parentItem.comment}
          user={parentItem.user}
          reactions={discussion!.reactions.filter((r) => r.commentId === parentItem.comment.id)}
          attachments={discussion!.attachments.filter((a) => a.commentId === parentItem.comment.id)}
          replies={[]}
          allReactions={discussion!.reactions}
          allAttachments={discussion!.attachments}
          onReact={handleReact}
          onReply={() => {}}
          onOpenThread={() => {}}
          users={users}
          currentUserId={CURRENT_USER_ID}
          isThreadParent
        />
      </div>

      {/* Scrollable replies */}
      <div ref={scrollRef} className="custom-scrollbar flex-1 overflow-y-auto px-4 py-4">
        {replies.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100">
              <MessageSquare className="h-7 w-7 text-gray-400" />
            </div>
            <h3 className="text-sm font-semibold text-gray-900">No replies yet</h3>
            <p className="mt-1 text-xs text-gray-500">Be the first to continue this thread.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {replies.map((reply) => (
              <CommentCard
                key={reply.comment.id}
                comment={reply.comment}
                user={reply.user}
                reactions={discussion!.reactions.filter((r) => r.commentId === reply.comment.id)}
                attachments={discussion!.attachments.filter((a) => a.commentId === reply.comment.id)}
                replies={[]}
                allReactions={discussion!.reactions}
                allAttachments={discussion!.attachments}
                onReact={handleReact}
                onReply={() => {}}
                onOpenThread={() => {}}
                users={users}
                currentUserId={CURRENT_USER_ID}
                isReply
                parentAuthorName={parentAuthorName ?? undefined}
              />
            ))}
          </div>
        )}
      </div>

      {/* Fixed reply composer */}
      <div className="border-t border-gray-100 bg-white px-4 py-3">
        <MessageComposer
          placeholder={`Reply to ${parentAuthorName ?? "thread"}...`}
          users={users}
          onSend={handleReply}
          compact
        />
      </div>
    </div>
  );
}
