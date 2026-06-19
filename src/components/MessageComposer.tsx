"use client";

import { useState, useRef, useCallback } from "react";
import { User } from "@/data/dummyData";
import { AtSign, Paperclip, Smile, Send, X, FileText, FileSpreadsheet, FileArchive, File as FileIcon } from "lucide-react";

interface LocalAttachment {
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
}

interface MessageComposerProps {
  placeholder?: string;
  users: User[];
  onSend: (content: string, mentions: number[] | null, attachments: LocalAttachment[]) => void;
  compact?: boolean;
}

const EMOJIS = ["👍", "❤️", "🔥", "😂", "👏", "👀", "🎉", "🤔", "✅", "🚀"];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const ALLOWED_EXTENSIONS = ["png", "jpg", "jpeg", "webp", "gif", "pdf", "doc", "docx", "xls", "xlsx", "zip", "txt"];

function docIconFor(fileName: string, fileType: string) {
  const ext = fileName.split(".").pop()?.toLowerCase() ?? "";
  if (ext === "pdf" || fileType === "application/pdf") return FileText;
  if (ext === "doc" || ext === "docx") return FileText;
  if (ext === "xls" || ext === "xlsx") return FileSpreadsheet;
  if (ext === "zip" || ext === "rar" || ext === "7z") return FileArchive;
  return FileIcon;
}

function docColorFor(fileName: string, fileType: string) {
  const ext = fileName.split(".").pop()?.toLowerCase() ?? "";
  if (ext === "pdf" || fileType === "application/pdf") return "text-red-600";
  if (ext === "doc" || ext === "docx") return "text-blue-600";
  if (ext === "xls" || ext === "xlsx") return "text-green-600";
  if (ext === "zip" || ext === "rar" || ext === "7z") return "text-amber-600";
  return "text-gray-600";
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
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
  const [localAttachments, setLocalAttachments] = useState<LocalAttachment[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(mentionQuery.toLowerCase())
  );

  const ingestFiles = useCallback((fileList: FileList | null) => {
    if (!fileList) return;
    const incoming: LocalAttachment[] = [];
    Array.from(fileList).forEach((file) => {
      const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
      if (file.size > MAX_FILE_SIZE) {
        alert(`"${file.name}" is too large. Max 10MB.`);
        return;
      }
      if (!ALLOWED_EXTENSIONS.includes(ext)) {
        alert(`"${file.name}" is not a supported file type.`);
        return;
      }
      incoming.push({
        fileName: file.name,
        fileUrl: URL.createObjectURL(file),
        fileType: file.type || `application/${ext}`,
        fileSize: file.size,
      });
    });
    if (incoming.length) setLocalAttachments((prev) => [...prev, ...incoming]);
  }, []);

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

  function handleSend() {
    if (!content.trim() && localAttachments.length === 0) return;
    onSend(content.trim(), selectedMentions.length > 0 ? selectedMentions : null, localAttachments);
    setContent("");
    setSelectedMentions([]);
    localAttachments.forEach((a) => URL.revokeObjectURL(a.fileUrl));
    setLocalAttachments([]);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }

  const removeAttachment = (index: number) => {
    setLocalAttachments((prev) => {
      const updated = [...prev];
      URL.revokeObjectURL(updated[index].fileUrl);
      updated.splice(index, 1);
      return updated;
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    ingestFiles(e.dataTransfer.files);
  };

  return (
    <div className="relative">
      {/* Attachment preview area — shown before sending */}
      {localAttachments.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-2">
          {localAttachments.map((att, i) => {
            const isImage = att.fileType.startsWith("image/");
            if (isImage) {
              return (
                <div key={i} className="relative h-16 w-16 overflow-hidden rounded-xl border border-gray-200">
                  <img src={att.fileUrl} alt={att.fileName} className="h-full w-full object-cover" />
                  <button
                    onClick={() => removeAttachment(i)}
                    className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
                  >
                    <X className="h-2.5 w-2.5" />
                  </button>
                </div>
              );
            }
            const Icon = docIconFor(att.fileName, att.fileType);
            const color = docColorFor(att.fileName, att.fileType);
            return (
              <div key={i} className="relative flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 py-1.5 pl-2 pr-7">
                <Icon className={`h-4 w-4 ${color}`} />
                <div className="min-w-0">
                  <p className="max-w-[120px] truncate text-xs font-medium text-gray-700">{att.fileName}</p>
                  <p className="text-[10px] text-gray-400">{formatFileSize(att.fileSize)}</p>
                </div>
                <button
                  onClick={() => removeAttachment(i)}
                  className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-600"
                >
                  <X className="h-2.5 w-2.5" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        className={`relative flex items-end gap-2 rounded-2xl border bg-gray-50 p-2 transition-all focus-within:bg-white focus-within:shadow-md focus-within:shadow-orange-50 ${
          isDragOver ? "border-brand bg-brand-50/40 ring-2 ring-brand/30" : "border-gray-200 focus-within:border-brand"
        }`}
      >
        {isDragOver && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-2xl text-sm font-medium text-brand">
            Drop files to attach
          </div>
        )}

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
            title="Attach file"
          >
            <Paperclip className="h-4 w-4" />
          </button>

          {/* Emoji button — popover anchored to its own wrapper, opens ABOVE the toolbar */}
          <div className="relative">
            <button
              onClick={() => setShowEmojiPicker((v) => !v)}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
              title="Emoji"
            >
              <Smile className="h-4 w-4" />
            </button>
            {showEmojiPicker && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setShowEmojiPicker(false)} />
                <div className="emoji absolute bottom-full left-0 z-40 mb-2 grid grid-cols-5 gap-2 rounded-xl border border-gray-200 bg-white p-2 shadow-xl">
                  {EMOJIS.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => {
                        setContent((prev) => prev + emoji);
                        setShowEmojiPicker(false);
                        textareaRef.current?.focus();
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
          className="mb-0.5 flex h-8 w-8 items-center justify-center rounded-xl bg-brand text-white shadow-sm transition-all hover:bg-orange-600 hover:shadow-md active:scale-95 disabled:opacity-40 disabled:hover:bg-brand disabled:active:scale-100"
        >
          <Send className="h-4 w-4" />
        </button>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={ALLOWED_EXTENSIONS.map((e) => `.${e}`).join(",")}
          onChange={(e) => {
            ingestFiles(e.target.files);
            if (fileInputRef.current) fileInputRef.current.value = "";
          }}
          className="hidden"
        />
      </div>

      {/* Mention Dropdown */}
      {showMentions && filteredUsers.length > 0 && (
        <div className="absolute bottom-full left-0 z-40 mb-2 w-64 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">
          <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-gray-400">Mention someone</div>
          <div className="custom-scrollbar max-h-48 overflow-y-auto">
            {filteredUsers.map((user, i) => (
              <button
                key={user.id}
                onClick={() => insertMention(user)}
                className={`flex w-full items-center gap-2 px-3 py-2.5 text-left transition-colors ${
                  i === mentionIndex ? "bg-brand-50" : "hover:bg-gray-50"
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
