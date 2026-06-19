"use client";

import { useState, useRef, useCallback } from "react";
import { User } from "@/data/dummyData";
import { AtSign, Image, Smile, Send, X } from "lucide-react";

interface MessageComposerProps {
  placeholder?: string;
  users: User[];
  onSend: (content: string, mentions: number[] | null, attachments: { fileName: string; fileUrl: string; fileType: string; fileSize: number }[]) => void;
  compact?: boolean;
}

export function MessageComposer({
  placeholder = "Write a message...",
  users,
  onSend,
  compact = false,
}: MessageComposerProps) {
  const [content, setContent] = useState("");
  const [showMentions, setShowMentions] = useState(false);
  const [mentionQuery, setMentionQuery] = useState("");
  const [mentionIndex, setMentionIndex] = useState(0);
  const [mentionStart, setMentionStart] = useState(-1);
  const [selectedMentions, setSelectedMentions] = useState<number[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [localAttachments, setLocalAttachments] = useState<{ fileName: string; fileUrl: string; fileType: string; fileSize: number }[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const EMOJIS = ["👍", "❤️", "🔥", "😂", "👏", "👀", "🎉", "🤔", "✅", "🚀"];

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(mentionQuery.toLowerCase())
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value;
      setContent(value);

      const cursorPos = e.target.selectionStart;
      const textBeforeCursor = value.slice(0, cursorPos);
      const atIndex = textBeforeCursor.lastIndexOf("@");

      if (atIndex !== -1 && atIndex === textBeforeCursor.length - 1) {
        setShowMentions(true);
        setMentionQuery("");
        setMentionIndex(0);
        setMentionStart(atIndex);
      } else if (showMentions && mentionStart !== -1) {
        const query = textBeforeCursor.slice(mentionStart + 1);
        if (query.includes(" ") || cursorPos <= mentionStart) {
          setShowMentions(false);
          setMentionStart(-1);
        } else {
          setMentionQuery(query);
          setMentionIndex(0);
        }
      }

      e.target.style.height = "auto";
      e.target.style.height = e.target.scrollHeight + "px";
    },
    [showMentions, mentionStart]
  );

  const insertMention = useCallback(
    (user: User) => {
      if (mentionStart === -1) return;
      const before = content.slice(0, mentionStart);
      const after = content.slice(mentionStart + mentionQuery.length + 1);
      const newContent = `${before}@${user.name} ${after}`;
      setContent(newContent);
      setShowMentions(false);
      setMentionStart(-1);
      setSelectedMentions((prev) => [...prev, user.id]);
      textareaRef.current?.focus();
    },
    [content, mentionStart, mentionQuery]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (showMentions && filteredUsers.length > 0) {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          setMentionIndex((prev) => (prev + 1) % filteredUsers.length);
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          setMentionIndex((prev) => (prev - 1 + filteredUsers.length) % filteredUsers.length);
        } else if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          insertMention(filteredUsers[mentionIndex]);
        } else if (e.key === "Escape") {
          setShowMentions(false);
        }
      } else if (e.key === "Enter" && !e.shiftKey && (content.trim() || localAttachments.length > 0)) {
        e.preventDefault();
        handleSend();
      }
    },
    [showMentions, filteredUsers, mentionIndex, content, localAttachments.length, insertMention]
  );

  const handleSend = () => {
    if (!content.trim() && localAttachments.length === 0) return;
    onSend(content.trim(), selectedMentions.length > 0 ? selectedMentions : null, localAttachments);
    setContent("");
    setSelectedMentions([]);
    setLocalAttachments([]);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      alert("File too large. Max 10MB.");
      return;
    }

    const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      alert("Only PNG, JPG, JPEG, and WEBP files are allowed.");
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setLocalAttachments((prev) => [
      ...prev,
      {
        fileName: file.name,
        fileUrl: objectUrl,
        fileType: file.type,
        fileSize: file.size,
      },
    ]);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeAttachment = (index: number) => {
    setLocalAttachments((prev) => {
      const updated = [...prev];
      URL.revokeObjectURL(updated[index].fileUrl);
      updated.splice(index, 1);
      return updated;
    });
  };

  return (
    <div className="relative">
      {/* Attachments preview */}
      {localAttachments.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-2">
          {localAttachments.map((att, i) => (
            <div key={i} className="relative flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2">
              <img src={att.fileUrl} alt={att.fileName} className="h-8 w-8 rounded-lg object-cover" />
              <span className="max-w-[100px] truncate text-xs text-gray-600">{att.fileName}</span>
              <button
                onClick={() => removeAttachment(i)}
                className="flex h-5 w-5 items-center justify-center rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-600"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className={`relative flex items-end gap-2 rounded-2xl border border-gray-200 bg-gray-50 p-2 transition-all focus-within:border-[#F76711] focus-within:bg-white focus-within:shadow-md focus-within:shadow-orange-50 ${compact ? "" : ""}`}>
        <div className="flex items-center gap-0.5 pb-1.5">
          <button
            onClick={() => textareaRef.current?.focus()}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
            title="Mention"
          >
            <AtSign className="h-4 w-4" />
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
            title="Upload image"
          >
            <Image className="h-4 w-4" />
          </button>
          <div className="relative">
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
              title="Emoji"
            >
              <Smile className="h-4 w-4" />
            </button>
            {showEmojiPicker && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowEmojiPicker(false)} />
                <div className="absolute bottom-10 left-0 z-20 grid grid-cols-5 gap-2 rounded-xl border border-gray-200 bg-white p-2 shadow-xl">
                  {EMOJIS.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => {
                        setContent((prev) => prev + emoji);
                        setShowEmojiPicker(false);
                        textareaRef.current?.focus();
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
        </div>

        <textarea
          ref={textareaRef}
          value={content}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={1}
          className="max-h-32 min-h-[36px] flex-1 resize-none bg-transparent py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none"
          style={{ height: "auto" }}
        />

        <button
          onClick={handleSend}
          disabled={!content.trim() && localAttachments.length === 0}
          className="mb-0.5 flex h-8 w-8 items-center justify-center rounded-xl bg-[#F76711] text-white shadow-sm transition-all hover:bg-orange-600 hover:shadow-md active:scale-95 disabled:opacity-40 disabled:hover:bg-[#F76711] disabled:active:scale-100"
        >
          <Send className="h-4 w-4" />
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/jpg,image/webp"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* Mention Dropdown */}
      {showMentions && filteredUsers.length > 0 && (
        <div className="absolute bottom-full left-0 z-30 mb-2 w-64 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">
          <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-gray-400">Mention someone</div>
          <div className="max-h-48 overflow-y-auto custom-scrollbar">
            {filteredUsers.map((user, i) => (
              <button
                key={user.id}
                onClick={() => insertMention(user)}
                className={`flex w-full items-center gap-2 px-3 py-2.5 text-left transition-colors ${
                  i === mentionIndex ? "bg-orange-50" : "hover:bg-gray-50"
                }`}
              >
                <img
                  src={user.avatarUrl || "https://ui-avatars.com/api/?name=User"}
                  alt={user.name}
                  className="h-8 w-8 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
