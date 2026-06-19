"use client";

import { useMemo, useRef, useEffect, useState } from "react";
import { getDiscussion, users, addComment, toggleReactionData, addAttachment, CURRENT_USER_ID } from "@/data/dummyData";
import { useCommentsStore } from "@/hooks/useCommentsStore";
import { CommentCard } from "./CommentCard";
import { MessageComposer } from "./MessageComposer";
import { ArrowLeft, MessageSquare } from "lucide-react";

export function DiscussionView() {
  const selectedCandidate = useCommentsStore((s) => s.selectedCandidate);
  const selectedAgency = useCommentsStore((s) => s.selectedAgency);
  const goBack = useCommentsStore((s) => s.goBackToAgencyList);
  const openThread = useCommentsStore((s) => s.openThread);
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

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [discussion?.comments.length, localKey]);

  if (!selectedAgency) return null;

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

  const handleSend = (
    content: string,
    mentions: number[] | null,
    attachments: { fileName: string; fileUrl: string; fileType: string; fileSize: number }[]
  ) => {
    const newComment = addComment({
      candidateId: selectedCandidate!.id,
      agencyId: selectedAgency!.agencyId,
      userId: CURRENT_USER_ID,
      parentId: null,
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
    <div className="flex h-full flex-col bg-gray-200">
      {/* Discussion Header */}
      <div className="flex items-center gap-3 border-b border-gray-100 px-4 py-3">
        <button
          onClick={goBack}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-semibold text-gray-900">
            {selectedAgency.agencyName}
          </h3>
          <p className="text-xs text-gray-500">
            {selectedAgency.commentCount} comments
          </p>
        </div>
      </div>

      {/* Comments Thread */}
      <div ref={scrollRef} className="custom-scrollbar flex-1 overflow-y-auto px-4 py-4">
        {!discussion?.comments.length ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100">
              <MessageSquare className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-base font-semibold text-gray-900">Start the discussion</h3>
            <p className="mt-1 text-sm text-gray-500">Be the first person to comment.</p>
          </div>
        ) : (
          <div className="space-y-5">
            {discussion.comments.map((item) => (
              <CommentCard
                key={item.comment.id}
                comment={item.comment}
                user={item.user}
                reactions={discussion.reactions.filter((r) => r.commentId === item.comment.id)}
                attachments={discussion.attachments.filter((a) => a.commentId === item.comment.id)}
                replies={discussion.replies.filter((r) => r.comment.parentId === item.comment.id)}
                allReactions={discussion.reactions}
                allAttachments={discussion.attachments}
                onReact={handleReact}
                onOpenThread={openThread}
                users={users}
                currentUserId={CURRENT_USER_ID}
              />
            ))}
          </div>
        )}
      </div>

      {/* Message Composer */}
      <div className="border-t border-gray-100 bg-white px-4 py-3">
        <MessageComposer
          placeholder={`Reply to ${selectedAgency.agencyName}...`}
          users={users}
          onSend={handleSend}
        />
      </div>
    </div>
  );
}
