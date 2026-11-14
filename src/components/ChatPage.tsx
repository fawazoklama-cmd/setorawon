import React, { useEffect, useRef, useState } from 'react';
import {
  Check,
  CheckCheck,
  Copy,
  Download,
  FileText,
  Paperclip,
  Reply,
  Send,
  Smile,
  Trash2,
  X,
} from 'lucide-react';
import { useSetorawon } from '../context/SetorawonContext';
import { ChatMessage, NavRoute, ReplyReference } from '../types/app';
import { formatClockTime, formatFileSize } from '../utils/identity';
import { CuteChatIllustration, UserAvatar } from './CuteIllustrations';

const EMOJI_LIST = [
  '😊', '🥰', '💗', '✨', '🌸', '☁️', '⭐', '🎀',
  '😂', '🥹', '👍', '🙌', '🎉', '🫶', '🍓', '🧸',
  '🎧', '📸', '💌', '🔥', '🤍', '🦋', '🌈', '☕',
];

export const ChatPage: React.FC = () => {
  const {
    t,
    roomId,
    peers,
    messages,
    sendTextMessage,
    sendTypingState,
    deleteLocalMessage,
    sendFiles,
    cancelTransfer,
    navigate,
    addToast,
  } = useSetorawon();

  const [inputText, setInputText] = useState('');
  const [replyTo, setReplyTo] = useState<ReplyReference | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [stagedFile, setStagedFile] = useState<{ file: File; previewUrl: string } | null>(null);

  const listEndRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const typingTimerRef = useRef<number | null>(null);

  useEffect(() => {
    listEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  useEffect(() => {
    return () => {
      if (stagedFile) {
        URL.revokeObjectURL(stagedFile.previewUrl);
      }
    };
  }, [stagedFile]);

  const handleTextChange = (val: string) => {
    setInputText(val);
    sendTypingState(val.trim().length > 0);
    if (typingTimerRef.current) {
      window.clearTimeout(typingTimerRef.current);
    }
    typingTimerRef.current = window.setTimeout(() => {
      sendTypingState(false);
    }, 1800);
  };

  const handleFilePicked = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (stagedFile) {
      URL.revokeObjectURL(stagedFile.previewUrl);
    }
    const previewUrl = URL.createObjectURL(file);
    setStagedFile({ file, previewUrl });
    e.target.value = '';
  };

  const clearStagedFile = () => {
    if (stagedFile) {
      URL.revokeObjectURL(stagedFile.previewUrl);
      setStagedFile(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowEmojiPicker(false);
    sendTypingState(false);

    if (stagedFile) {
      const fileToSend = stagedFile.file;
      const caption = inputText.trim();
      clearStagedFile();
      setInputText('');
      setReplyTo(null);
      await sendFiles([fileToSend], 'chat', 'all', caption);
      return;
    }

    if (!inputText.trim()) return;
    sendTextMessage(inputText, replyTo ?? undefined);
    setInputText('');
    setReplyTo(null);
  };

  const handleCopyMessage = (msg: ChatMessage) => {
    if (!msg.text) return;
    navigator.clipboard.writeText(msg.text).then(() => {
      addToast('success', t.messages.copiedText);
    });
  };

  const typingPeers = peers.filter((p) => p.isTyping);

  if (!roomId) {
    return (
      <div className="bg-white dark:bg-[#1B2032] rounded-3xl border border-[#DCEEFF] dark:border-[#28304A] p-8 sm:p-12 text-center max-w-xl mx-auto mt-6 space-y-4">
        <div className="flex justify-center">
          <CuteChatIllustration className="w-20 h-16" />
        </div>
        <h2 className="font-display text-xl font-bold text-[#30364D] dark:text-white">
          {t.chat.noRoomTitle}
        </h2>
        <p className="text-sm text-[#5A6382] dark:text-[#A4B0D1] leading-relaxed">
          {t.chat.noRoomDesc}
        </p>
        <button
          type="button"
          onClick={() => navigate(NavRoute.HOME)}
          className="inline-flex items-center justify-center px-6 py-3 min-h-[44px] rounded-2xl bg-[#83BDF7] text-[#1E2438] text-sm font-semibold hover:bg-[#71b2f5] transition-colors"
        >
          {t.chat.goHome}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-11rem)] lg:h-[calc(100vh-7.5rem)] bg-white dark:bg-[#1B2032] rounded-3xl border border-[#DCEEFF] dark:border-[#28304A] overflow-hidden">
      {/* Chat Header */}
      <div className="px-4 sm:px-6 py-3.5 border-b border-[#DCEEFF] dark:border-[#28304A] flex items-center justify-between gap-3 bg-[#F8FAFF] dark:bg-[#171C2C]">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="font-display text-base font-bold text-[#30364D] dark:text-white truncate">
              {roomId}
            </h2>
            <span className="text-xs text-[#646D8A] dark:text-[#9AA5C4] tabular-nums">
              · {peers.length} {t.status.peersConnected}
            </span>
          </div>
          <p className="text-xs text-[#5A6382] dark:text-[#9AA5C4] truncate mt-0.5">
            {typingPeers.length > 0
              ? `${typingPeers.map((p) => p.username).join(', ')} — ${t.status.typing}`
              : t.chat.ephemeralBanner}
          </p>
        </div>

        <div className="flex -space-x-2 shrink-0">
          {peers.slice(0, 3).map((peer) => (
            <UserAvatar
              key={peer.peerId}
              preset={peer.avatarPreset}
              customUrl={peer.customAvatarDataUrl}
              name={peer.username}
              sizeClass="w-8 h-8 text-xs ring-2 ring-white dark:ring-[#171C2C]"
            />
          ))}
        </div>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center max-w-sm mx-auto space-y-3">
            <CuteChatIllustration className="w-16 h-14" />
            <p className="font-display text-base font-semibold text-[#30364D] dark:text-white">
              {t.chat.emptyChatTitle}
            </p>
            <p className="text-xs text-[#646D8A] dark:text-[#9AA5C4] leading-relaxed">
              {t.chat.emptyChatDesc}
            </p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-end gap-2.5 group ${msg.isSelf ? 'justify-end' : 'justify-start'}`}
            >
              {!msg.isSelf && (
                <UserAvatar
                  preset={msg.senderAvatarPreset}
                  customUrl={msg.senderCustomAvatar}
                  name={msg.senderName}
                  sizeClass="w-8 h-8 text-xs mb-1"
                />
              )}

              <div className={`max-w-[82%] sm:max-w-[70%] space-y-1 ${msg.isSelf ? 'items-end' : 'items-start'} flex flex-col`}>
                {!msg.isSelf && (
                  <span className="text-[11px] font-medium text-[#646D8A] dark:text-[#9AA5C4] px-1">
                    {msg.senderName}
                  </span>
                )}

                <div
                  className={`rounded-3xl px-4 py-2.5 space-y-2 border ${
                    msg.isSelf
                      ? 'bg-[#DCEEFF] dark:bg-[#233554] border-[#83BDF7]/40 dark:border-[#83BDF7]/20 text-[#30364D] dark:text-[#F1F4FF] rounded-br-lg'
                      : 'bg-[#FFE0EF] dark:bg-[#3A2237] border-[#FFA8CE]/50 dark:border-[#FFA8CE]/20 text-[#30364D] dark:text-[#FFF0F6] rounded-bl-lg'
                  }`}
                >
                  {/* Quoted Reply */}
                  {msg.replyTo && (
                    <div className="px-3 py-1.5 rounded-xl bg-white/60 dark:bg-black/20 text-xs space-y-0.5">
                      <p className="font-semibold text-[11px]">{msg.replyTo.senderName}</p>
                      <p className="truncate opacity-80">
                        {msg.replyTo.text || msg.replyTo.attachmentName}
                      </p>
                    </div>
                  )}

                  {/* Attachment Rendering */}
                  {msg.attachment && (
                    <div className="space-y-2">
                      {msg.attachment.category === 'image' && msg.attachment.objectUrl && (
                        <img
                          src={msg.attachment.objectUrl}
                          alt={msg.attachment.fileName}
                          className="max-h-64 rounded-2xl object-cover w-full bg-white/40"
                        />
                      )}

                      {msg.attachment.category === 'video' && msg.attachment.objectUrl && (
                        <video
                          src={msg.attachment.objectUrl}
                          controls
                          className="max-h-64 rounded-2xl w-full bg-black/20"
                        />
                      )}

                      <div className="flex items-center justify-between gap-3 p-2.5 rounded-2xl bg-white/65 dark:bg-black/20">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <FileText className="w-5 h-5 shrink-0 opacity-80" />
                          <div className="min-w-0">
                            <p className="text-xs font-semibold truncate">{msg.attachment.fileName}</p>
                            <p className="text-[11px] opacity-75 tabular-nums">
                              {formatFileSize(msg.attachment.fileSize)}
                              {msg.attachment.status === 'transferring' && ` · ${msg.attachment.progress}%`}
                              {msg.attachment.status === 'cancelled' && ` · ${t.chat.cancelled}`}
                            </p>
                          </div>
                        </div>

                        {msg.attachment.status === 'transferring' ? (
                          <button
                            type="button"
                            onClick={() => cancelTransfer(msg.attachment!.transferId)}
                            aria-label={t.chat.cancelTransfer}
                            className="p-1.5 rounded-xl bg-white/80 dark:bg-black/30 hover:opacity-80 shrink-0"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        ) : (
                          msg.attachment.objectUrl &&
                          msg.attachment.status === 'completed' && (
                            <a
                              href={msg.attachment.objectUrl}
                              download={msg.attachment.fileName}
                              aria-label={`${t.chat.download} ${msg.attachment.fileName}`}
                              className="p-2 rounded-xl bg-white/80 dark:bg-black/30 hover:opacity-80 shrink-0"
                            >
                              <Download className="w-4 h-4" />
                            </a>
                          )
                        )}
                      </div>

                      {msg.attachment.status === 'transferring' && (
                        <div className="w-full h-1.5 rounded-full bg-white/60 overflow-hidden">
                          <div
                            className="h-full bg-[#30364D] dark:bg-[#83BDF7] transition-all duration-150"
                            style={{ width: `${msg.attachment.progress}%` }}
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Message Text */}
                  {msg.text && (
                    <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">{msg.text}</p>
                  )}

                  {/* Footer: timestamp + delivered */}
                  <div className="flex items-center justify-end gap-1.5 text-[10px] opacity-70 tabular-nums">
                    <span>{formatClockTime(msg.timestamp)}</span>
                    {msg.isSelf && (
                      <span title={msg.status === 'delivered' ? t.chat.delivered : t.chat.sent}>
                        {msg.status === 'delivered' ? (
                          <CheckCheck className="w-3.5 h-3.5" />
                        ) : (
                          <Check className="w-3.5 h-3.5" />
                        )}
                      </span>
                    )}
                  </div>
                </div>

                {/* Quick Actions Row */}
                <div className="flex items-center gap-1 opacity-80 sm:opacity-0 sm:group-hover:opacity-100 focus-within:opacity-100 transition-opacity px-1">
                  <button
                    type="button"
                    onClick={() =>
                      setReplyTo({
                        messageId: msg.id,
                        senderName: msg.senderName,
                        text: msg.text,
                        attachmentName: msg.attachment?.fileName,
                      })
                    }
                    aria-label={t.chat.reply}
                    className="p-1 rounded-lg text-[#5A6382] dark:text-[#9AA5C4] hover:bg-[#F2F8FF] dark:hover:bg-[#232A40]"
                  >
                    <Reply className="w-3.5 h-3.5" />
                  </button>
                  {msg.text && (
                    <button
                      type="button"
                      onClick={() => handleCopyMessage(msg)}
                      aria-label={t.chat.copy}
                      className="p-1 rounded-lg text-[#5A6382] dark:text-[#9AA5C4] hover:bg-[#F2F8FF] dark:hover:bg-[#232A40]"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => deleteLocalMessage(msg.id)}
                    aria-label={t.chat.deleteLocal}
                    className="p-1 rounded-lg text-[#9E2157] dark:text-[#FFA8CE] hover:bg-[#FFE0EF]/60 dark:hover:bg-[#3A2237]"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={listEndRef} />
      </div>

      {/* Staged Attachment Preview */}
      {stagedFile && (
        <div className="px-4 py-3 border-t border-[#DCEEFF] dark:border-[#28304A] bg-[#F8FAFF] dark:bg-[#161B2A] flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {stagedFile.file.type.startsWith('image/') ? (
              <img
                src={stagedFile.previewUrl}
                alt={stagedFile.file.name}
                className="w-12 h-12 rounded-xl object-cover shrink-0 border border-[#83BDF7]/40"
              />
            ) : stagedFile.file.type.startsWith('video/') ? (
              <video
                src={stagedFile.previewUrl}
                className="w-14 h-12 rounded-xl object-cover shrink-0 bg-black/20"
              />
            ) : (
              <div className="w-12 h-12 rounded-xl bg-[#DCEEFF] dark:bg-[#24324D] flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
            )}
            <div className="min-w-0">
              <p className="text-xs font-semibold text-[#30364D] dark:text-white truncate">
                {stagedFile.file.name}
              </p>
              <p className="text-[11px] text-[#646D8A] dark:text-[#9AA5C4] tabular-nums">
                {t.chat.previewTitle} · {formatFileSize(stagedFile.file.size)}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={clearStagedFile}
            aria-label={t.home.cancel}
            className="p-2 rounded-xl text-[#9E2157] dark:text-[#FFA8CE] hover:bg-[#FFE0EF]/60 dark:hover:bg-[#3A2237]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Reply Bar */}
      {replyTo && (
        <div className="px-4 py-2 border-t border-[#DCEEFF] dark:border-[#28304A] bg-[#FFF4F9] dark:bg-[#251C2B] flex items-center justify-between gap-3">
          <div className="min-w-0 text-xs">
            <span className="font-semibold text-[#C2457D] dark:text-[#FFA8CE]">
              {t.chat.replyingTo} {replyTo.senderName}
            </span>
            <p className="text-[#5A6382] dark:text-[#C5CDE3] truncate">
              {replyTo.text || replyTo.attachmentName}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setReplyTo(null)}
            aria-label={t.home.cancel}
            className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Emoji Picker Popover */}
      {showEmojiPicker && (
        <div className="px-4 py-3 border-t border-[#DCEEFF] dark:border-[#28304A] bg-white dark:bg-[#1E2438]">
          <div className="grid grid-cols-8 sm:grid-cols-12 gap-1.5">
            {EMOJI_LIST.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => {
                  setInputText((prev) => `${prev}${emoji}`);
                  setShowEmojiPicker(false);
                }}
                className="h-9 rounded-xl hover:bg-[#F2F8FF] dark:hover:bg-[#28304A] text-lg flex items-center justify-center transition-colors"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Message Composer */}
      <form
        onSubmit={handleSubmit}
        className="p-3 sm:p-4 border-t border-[#DCEEFF] dark:border-[#28304A] bg-white dark:bg-[#1B2032] flex items-center gap-2"
      >
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFilePicked}
          className="hidden"
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          aria-label={t.chat.attachFile}
          className="p-2.5 min-h-[44px] min-w-[44px] rounded-2xl bg-[#F2F8FF] dark:bg-[#232B42] text-[#30364D] dark:text-[#DCEEFF] hover:bg-[#DCEEFF] dark:hover:bg-[#2B3654] transition-colors flex items-center justify-center shrink-0"
        >
          <Paperclip className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={() => setShowEmojiPicker((prev) => !prev)}
          aria-label={t.chat.emojiPicker}
          aria-expanded={showEmojiPicker}
          className="p-2.5 min-h-[44px] min-w-[44px] rounded-2xl bg-[#FFF3F8] dark:bg-[#2E2134] text-[#30364D] dark:text-[#FFD6E8] hover:bg-[#FFE0EF] dark:hover:bg-[#3A2840] transition-colors flex items-center justify-center shrink-0"
        >
          <Smile className="w-5 h-5" />
        </button>

        <input
          type="text"
          value={inputText}
          onChange={(e) => handleTextChange(e.target.value)}
          placeholder={t.chat.placeholder}
          aria-label={t.chat.placeholder}
          className="flex-1 min-w-0 px-4 py-2.5 min-h-[44px] rounded-2xl border border-[#DCEEFF] dark:border-[#2D3654] bg-[#F8F9FF] dark:bg-[#131724] text-sm text-[#30364D] dark:text-white placeholder:text-[#8E97B3] focus:outline-none focus:border-[#83BDF7]"
        />

        <button
          type="submit"
          aria-label={stagedFile ? t.chat.sendAttachment : t.chat.send}
          className="px-4 py-2.5 min-h-[44px] rounded-2xl bg-gradient-to-r from-[#83BDF7] to-[#FFA8CE] text-[#1E2438] text-sm font-bold flex items-center gap-1.5 hover:opacity-95 transition-opacity whitespace-nowrap shrink-0"
        >
          <Send className="w-4 h-4" />
          <span className="hidden sm:inline">{t.chat.send}</span>
        </button>
      </form>
    </div>
  );
};
