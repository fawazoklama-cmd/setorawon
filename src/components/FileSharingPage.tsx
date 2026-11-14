import React, { useRef, useState } from 'react';
import {
  Archive,
  Download,
  Eye,
  FileText,
  Film,
  FolderUp,
  Image as ImageIcon,
  Music,
  Trash2,
  X,
} from 'lucide-react';
import { useSetorawon } from '../context/SetorawonContext';
import { FileCategory, FileTransferItem, NavRoute } from '../types/app';
import { formatFileSize } from '../utils/identity';
import { FlowerIllustration } from './CuteIllustrations';

function CategoryIcon({ category }: { category: FileCategory }) {
  switch (category) {
    case 'image':
      return <ImageIcon className="w-5 h-5" />;
    case 'video':
      return <Film className="w-5 h-5" />;
    case 'audio':
      return <Music className="w-5 h-5" />;
    case 'archive':
      return <Archive className="w-5 h-5" />;
    default:
      return <FileText className="w-5 h-5" />;
  }
}

export const FileSharingPage: React.FC = () => {
  const {
    t,
    roomId,
    peers,
    settings,
    transfers,
    sendFiles,
    cancelTransfer,
    removeTransfer,
    clearCompletedTransfers,
    navigate,
  } = useSetorawon();

  const [isDragging, setIsDragging] = useState(false);
  const [targetPeerId, setTargetPeerId] = useState<string>('all');
  const [filter, setFilter] = useState<'all' | 'incoming' | 'outgoing'>('all');
  const [previewItem, setPreviewItem] = useState<FileTransferItem | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFilesSelected = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    await sendFiles(Array.from(fileList), 'file-sharing', targetPeerId);
  };

  const filteredTransfers = transfers.filter((item) => {
    if (filter === 'all') return true;
    return item.direction === filter;
  });

  if (!roomId) {
    return (
      <div className="bg-white dark:bg-[#1B2032] rounded-3xl border border-[#DCEEFF] dark:border-[#28304A] p-8 sm:p-12 text-center max-w-xl mx-auto mt-6 space-y-4">
        <div className="flex justify-center">
          <FlowerIllustration className="w-14 h-14" />
        </div>
        <h2 className="font-display text-xl font-bold text-[#30364D] dark:text-white">
          {t.chat.noRoomTitle}
        </h2>
        <p className="text-sm text-[#5A6382] dark:text-[#A4B0D1]">{t.chat.noRoomDesc}</p>
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
    <div className="space-y-6">
      {/* Drag & Drop Upload Zone */}
      <section className="bg-white dark:bg-[#1B2032] rounded-3xl border border-[#DCEEFF] dark:border-[#28304A] p-6 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-lg font-bold text-[#30364D] dark:text-white">
              {t.files.title}
            </h2>
            <p className="text-xs text-[#5A6382] dark:text-[#9AA5C4] mt-0.5">{t.files.subtitle}</p>
          </div>

          <div className="flex items-center gap-2">
            <label
              htmlFor="file-target-peer"
              className="text-xs font-medium text-[#5A6382] dark:text-[#9AA5C4]"
            >
              {t.files.targetPeerLabel}:
            </label>
            <select
              id="file-target-peer"
              value={targetPeerId}
              onChange={(e) => setTargetPeerId(e.target.value)}
              className="px-3 py-2 min-h-[40px] rounded-xl border border-[#DCEEFF] dark:border-[#2C3654] bg-[#F8F9FF] dark:bg-[#141826] text-xs font-medium text-[#30364D] dark:text-white"
            >
              <option value="all">{t.files.sendToAll}</option>
              {peers.map((peer) => (
                <option key={peer.peerId} value={peer.peerId}>
                  {peer.username}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            handleFilesSelected(e.dataTransfer.files);
          }}
          className={`rounded-3xl border-2 border-dashed p-8 text-center transition-colors space-y-4 ${
            isDragging
              ? 'border-[#83BDF7] bg-[#DCEEFF]/50 dark:bg-[#223250]/60'
              : 'border-[#83BDF7]/60 dark:border-[#2E3A5C] bg-[#F8FAFF] dark:bg-[#151A2A]'
          }`}
        >
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#DCEEFF] to-[#FFE0EF] dark:from-[#23324E] dark:to-[#3A2338] text-[#30364D] dark:text-white mx-auto flex items-center justify-center">
            <FolderUp className="w-7 h-7" />
          </div>

          <div className="space-y-1">
            <p className="font-display text-base font-semibold text-[#30364D] dark:text-white">
              {t.files.dropzoneTitle}
            </p>
            <p className="text-xs text-[#646D8A] dark:text-[#9AA5C4]">{t.files.dropzoneDesc}</p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={(e) => {
              handleFilesSelected(e.target.files);
              e.target.value = '';
            }}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 min-h-[44px] rounded-2xl bg-gradient-to-r from-[#83BDF7] to-[#FFA8CE] text-[#1E2438] text-sm font-bold hover:opacity-95 transition-opacity"
          >
            <FolderUp className="w-4 h-4" />
            <span>{t.files.chooseFiles}</span>
          </button>

          <div className="text-[11px] text-[#646D8A] dark:text-[#9AA5C4] space-y-0.5 pt-1">
            <p>{t.files.supportedTypes}</p>
            <p className="tabular-nums">
              {t.files.maxSizeLabel}: {settings.maxFileSizeMb} MB · {t.files.chunkedNote}
            </p>
          </div>
        </div>
      </section>

      {/* Transfers List */}
      <section className="bg-white dark:bg-[#1B2032] rounded-3xl border border-[#DCEEFF] dark:border-[#28304A] p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1 p-1 rounded-xl bg-[#F2F6FF] dark:bg-[#141826]">
            {(
              [
                { key: 'all', label: t.files.filterAll },
                { key: 'incoming', label: t.files.filterIncoming },
                { key: 'outgoing', label: t.files.filterOutgoing },
              ] as const
            ).map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setFilter(tab.key)}
                className={`px-3.5 py-2 min-h-[36px] rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                  filter === tab.key
                    ? 'bg-white dark:bg-[#242C44] text-[#30364D] dark:text-white shadow-xs'
                    : 'text-[#646D8A] dark:text-[#9AA5C4] hover:text-[#30364D] dark:hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {transfers.length > 0 && (
            <button
              type="button"
              onClick={clearCompletedTransfers}
              className="inline-flex items-center gap-1.5 px-3 py-2 min-h-[38px] rounded-xl text-xs font-semibold text-[#9E2157] dark:text-[#FFA8CE] hover:bg-[#FFE0EF]/60 dark:hover:bg-[#3A2237] transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{t.files.clearCompleted}</span>
            </button>
          )}
        </div>

        {filteredTransfers.length === 0 ? (
          <div className="py-10 text-center space-y-2">
            <p className="font-display text-base font-semibold text-[#30364D] dark:text-white">
              {t.files.noTransfersTitle}
            </p>
            <p className="text-xs text-[#646D8A] dark:text-[#9AA5C4]">{t.files.noTransfersDesc}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTransfers.map((item) => {
              const statusLabel =
                item.status === 'completed'
                  ? t.files.statusCompleted
                  : item.status === 'transferring'
                  ? t.files.statusTransferring
                  : item.status === 'cancelled'
                  ? t.files.statusCancelled
                  : item.status === 'error'
                  ? t.files.statusError
                  : t.files.statusQueued;

              return (
                <div
                  key={item.transferId}
                  className="p-4 rounded-2xl bg-[#F8FAFF] dark:bg-[#141826] border border-[#DCEEFF] dark:border-[#28304A] space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div
                        className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
                          item.direction === 'outgoing'
                            ? 'bg-[#DCEEFF] dark:bg-[#23324E] text-[#30364D] dark:text-[#DCEEFF]'
                            : 'bg-[#FFE0EF] dark:bg-[#3A2338] text-[#30364D] dark:text-[#FFD6E8]'
                        }`}
                      >
                        <CategoryIcon category={item.category} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-[#30364D] dark:text-white truncate">
                          {item.fileName}
                        </p>
                        <p className="text-xs text-[#646D8A] dark:text-[#9AA5C4] tabular-nums truncate">
                          {formatFileSize(item.transferredBytes)} / {formatFileSize(item.fileSize)} ·{' '}
                          {item.peerName} · {statusLabel}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {item.status === 'transferring' && (
                        <button
                          type="button"
                          onClick={() => cancelTransfer(item.transferId)}
                          className="inline-flex items-center gap-1 px-3 py-2 min-h-[38px] rounded-xl bg-[#FFE0EF] dark:bg-[#472336] text-[#9E2157] dark:text-[#FFC2DD] text-xs font-semibold"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>{t.files.cancel}</span>
                        </button>
                      )}

                      {item.objectUrl && item.status === 'completed' && (
                        <>
                          <button
                            type="button"
                            onClick={() => setPreviewItem(item)}
                            className="inline-flex items-center gap-1 px-3 py-2 min-h-[38px] rounded-xl bg-white dark:bg-[#222940] border border-[#DCEEFF] dark:border-[#323C5C] text-xs font-semibold text-[#30364D] dark:text-white hover:bg-[#DCEEFF]/40 transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>{t.files.preview}</span>
                          </button>

                          <a
                            href={item.objectUrl}
                            download={item.fileName}
                            className="inline-flex items-center gap-1 px-3.5 py-2 min-h-[38px] rounded-xl bg-[#83BDF7] text-[#1E2438] text-xs font-bold hover:bg-[#6fb2f5] transition-colors"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>{t.files.download}</span>
                          </a>
                        </>
                      )}

                      {item.status !== 'transferring' && (
                        <button
                          type="button"
                          onClick={() => removeTransfer(item.transferId)}
                          aria-label={t.files.remove}
                          className="p-2 min-h-[38px] min-w-[38px] rounded-xl text-[#646D8A] dark:text-[#9AA5C4] hover:bg-black/5 dark:hover:bg-white/10 flex items-center justify-center"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {item.status === 'transferring' && (
                    <div className="space-y-1">
                      <div className="w-full h-2 rounded-full bg-[#DCEEFF] dark:bg-[#25304A] overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#83BDF7] to-[#FFA8CE] transition-all duration-150"
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                      <p className="text-right text-[11px] font-mono tabular-nums text-[#5A6382] dark:text-[#9AA5C4]">
                        {item.progress}%
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* File Preview Modal */}
      {previewItem && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={t.files.previewModalTitle}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setPreviewItem(null)}
        >
          <div
            className="w-full max-w-2xl bg-white dark:bg-[#1B2032] rounded-3xl border border-[#DCEEFF] dark:border-[#28304A] overflow-hidden shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 py-4 border-b border-[#DCEEFF] dark:border-[#28304A] flex items-center justify-between gap-3">
              <div className="min-w-0">
                <h3 className="font-display text-base font-bold text-[#30364D] dark:text-white truncate">
                  {previewItem.fileName}
                </h3>
                <p className="text-xs text-[#646D8A] dark:text-[#9AA5C4] tabular-nums">
                  {formatFileSize(previewItem.fileSize)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPreviewItem(null)}
                aria-label={t.files.close}
                className="p-2 rounded-xl hover:bg-[#F2F8FF] dark:hover:bg-[#232A40]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 flex items-center justify-center bg-[#F8F9FF] dark:bg-[#121521] max-h-[65vh] overflow-auto">
              {previewItem.category === 'image' && previewItem.objectUrl ? (
                <img
                  src={previewItem.objectUrl}
                  alt={previewItem.fileName}
                  className="max-h-[55vh] rounded-2xl object-contain"
                />
              ) : previewItem.category === 'video' && previewItem.objectUrl ? (
                <video
                  src={previewItem.objectUrl}
                  controls
                  className="max-h-[55vh] w-full rounded-2xl bg-black"
                />
              ) : previewItem.category === 'audio' && previewItem.objectUrl ? (
                <audio src={previewItem.objectUrl} controls className="w-full" />
              ) : previewItem.mimeType === 'application/pdf' && previewItem.objectUrl ? (
                <iframe
                  src={previewItem.objectUrl}
                  title={previewItem.fileName}
                  className="w-full h-[55vh] rounded-2xl border border-[#DCEEFF] dark:border-[#28304A]"
                />
              ) : (
                <div className="py-10 text-center space-y-3">
                  <FileText className="w-12 h-12 mx-auto text-[#83BDF7]" />
                  <p className="text-sm text-[#5A6382] dark:text-[#A4B0D1]">
                    {t.files.previewUnavailable}
                  </p>
                </div>
              )}
            </div>

            <div className="px-5 py-3.5 border-t border-[#DCEEFF] dark:border-[#28304A] flex items-center justify-end gap-3">
              {previewItem.objectUrl && (
                <a
                  href={previewItem.objectUrl}
                  download={previewItem.fileName}
                  className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[42px] rounded-xl bg-[#83BDF7] text-[#1E2438] text-xs font-bold"
                >
                  <Download className="w-4 h-4" />
                  <span>{t.files.download}</span>
                </a>
              )}
              <button
                type="button"
                onClick={() => setPreviewItem(null)}
                className="px-4 py-2.5 min-h-[42px] rounded-xl bg-[#F2F6FF] dark:bg-[#232A40] text-xs font-semibold"
              >
                {t.files.close}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
