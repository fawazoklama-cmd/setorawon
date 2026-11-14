import React, { useRef, useState } from 'react';
import {
  ArrowRight,
  Camera,
  Check,
  Copy,
  Edit3,
  FolderUp,
  LogOut,
  MessageCircleHeart,
  Phone,
  PlusCircle,
  RefreshCw,
  Share2,
  Trash2,
  Users,
  Video,
} from 'lucide-react';
import { useSetorawon } from '../context/SetorawonContext';
import { NavRoute } from '../types/app';
import { resizeAvatarToDataUrl } from '../utils/avatar';
import { formatClockTime } from '../utils/identity';
import {
  AVATAR_PRESETS,
  CloudIllustration,
  CuteChatIllustration,
  FlowerIllustration,
  HeartIllustration,
  SparklesIllustration,
  StarIllustration,
  UserAvatar,
} from './CuteIllustrations';

export const HomePage: React.FC = () => {
  const {
    t,
    profile,
    updateProfile,
    regenerateUserId,
    roomId,
    roomRole,
    connectionStatus,
    peers,
    recentSessions,
    clearHistory,
    createRoom,
    joinRoom,
    leaveRoom,
    navigate,
    addToast,
  } = useSetorawon();

  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(profile.username);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [customRoomInput, setCustomRoomInput] = useState('');
  const [joinRoomInput, setJoinRoomInput] = useState('');
  const [copiedId, setCopiedId] = useState(false);
  const [copiedRoom, setCopiedRoom] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = nameInput.trim();
    if (!cleaned) return;
    updateProfile({ username: cleaned });
    setEditingName(false);
    addToast('success', t.messages.profileSaved);
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await resizeAvatarToDataUrl(file);
      updateProfile({ customAvatarDataUrl: dataUrl });
      setShowAvatarPicker(false);
      addToast('success', t.messages.profileSaved);
    } catch {
      addToast('error', t.messages.fileUnsafe);
    } finally {
      e.target.value = '';
    }
  };

  const handleCopyUserId = () => {
    navigator.clipboard.writeText(profile.userId).then(() => {
      setCopiedId(true);
      addToast('success', t.messages.copiedId);
      window.setTimeout(() => setCopiedId(false), 1800);
    });
  };

  const handleShareUserId = async () => {
    const shareText = `SETORAWON ID: ${profile.userId}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: t.app.name, text: shareText });
        return;
      } catch {
        // Fallback to copy
      }
    }
    navigator.clipboard.writeText(shareText).then(() => {
      addToast('info', t.messages.copiedId);
    });
  };

  const handleCopyRoomCode = () => {
    if (!roomId) return;
    navigator.clipboard.writeText(roomId).then(() => {
      setCopiedRoom(true);
      addToast('success', t.messages.copiedRoom);
      window.setTimeout(() => setCopiedRoom(false), 1800);
    });
  };

  const handleShareRoomLink = async () => {
    if (!roomId) return;
    const shareUrl = `${window.location.origin}/?room=${encodeURIComponent(roomId)}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${t.app.name} — ${roomId}`,
          text: `${t.app.tagline} (${roomId})`,
          url: shareUrl,
        });
        return;
      } catch {
        // Fallback
      }
    }
    navigator.clipboard.writeText(shareUrl).then(() => {
      addToast('success', t.messages.shareNotSupported);
    });
  };

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#DCEEFF] via-[#F8F9FF] to-[#FFE0EF] dark:from-[#1D2B45] dark:via-[#1B2032] dark:to-[#352038] border border-[#83BDF7]/40 dark:border-[#83BDF7]/20 p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-medium text-[#4D5778] dark:text-[#B4C0E0]">
              <span>{t.app.name}</span>
              <span aria-hidden="true">·</span>
              <span>{t.app.noDatabaseBadge}</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#30364D] dark:text-white tracking-tight text-balance">
              {t.home.welcomeTitle}
            </h2>
            <p className="text-sm sm:text-base text-[#4B5472] dark:text-[#B8C3E0] leading-relaxed">
              {t.home.welcomeSubtitle}
            </p>
            <p className="text-xs text-[#5E6787] dark:text-[#98A4C7] leading-relaxed pt-1">
              {t.app.ephemeralNotice}
            </p>
          </div>

          <div className="flex items-center justify-center gap-3 shrink-0 self-center md:self-auto">
            <div className="animate-float-slow">
              <CloudIllustration className="w-20 h-14" />
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-2">
                <StarIllustration className="w-7 h-7" />
                <HeartIllustration className="w-6 h-6" />
              </div>
              <CuteChatIllustration className="w-16 h-12" />
            </div>
            <div className="flex flex-col items-center gap-2">
              <SparklesIllustration className="w-7 h-7" />
              <FlowerIllustration className="w-9 h-9" />
            </div>
          </div>
        </div>
      </section>

      {/* Main Grid: Profile + Room Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* User Profile Card */}
        <section className="lg:col-span-5 bg-white dark:bg-[#1B2032] rounded-3xl border border-[#DCEEFF] dark:border-[#28304A] p-6 flex flex-col justify-between gap-5">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-display text-lg font-semibold text-[#30364D] dark:text-white">
                {t.home.profileCardTitle}
              </h3>
              <span className="text-xs font-medium text-[#2B6CB0] dark:text-[#83BDF7]">
                {connectionStatus === 'online'
                  ? t.status.online
                  : connectionStatus === 'in-call'
                  ? t.status.inCall
                  : connectionStatus === 'connecting'
                  ? t.status.connecting
                  : t.status.offline}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <UserAvatar
                  preset={profile.avatarPreset}
                  customUrl={profile.customAvatarDataUrl}
                  name={profile.username}
                  sizeClass="w-16 h-16 text-2xl"
                />
                <button
                  type="button"
                  onClick={() => setShowAvatarPicker((prev) => !prev)}
                  aria-label={t.home.chooseAvatar}
                  className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-full bg-[#FFA8CE] text-[#30364D] border-2 border-white dark:border-[#1B2032] flex items-center justify-center hover:scale-105 transition-transform"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex-1 min-w-0">
                {editingName ? (
                  <form onSubmit={handleSaveName} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      maxLength={28}
                      aria-label={t.settings.usernameLabel}
                      className="w-full px-3 py-1.5 rounded-xl border border-[#83BDF7] bg-[#F8F9FF] dark:bg-[#141826] text-sm text-[#30364D] dark:text-white focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 rounded-xl bg-[#83BDF7] text-[#1E2438] text-xs font-semibold whitespace-nowrap shrink-0"
                    >
                      {t.home.saveName}
                    </button>
                  </form>
                ) : (
                  <div className="flex items-center gap-2">
                    <p className="font-display text-lg font-bold text-[#30364D] dark:text-white truncate">
                      {profile.username}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setNameInput(profile.username);
                        setEditingName(true);
                      }}
                      aria-label={t.home.editName}
                      className="p-1.5 rounded-lg text-[#5A6382] dark:text-[#9AA5C4] hover:bg-[#F2F8FF] dark:hover:bg-[#242C44] transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </div>
                )}
                <p className="text-xs text-[#646D8A] dark:text-[#9AA5C4] mt-0.5">
                  {t.home.userIdLabel}
                </p>
              </div>
            </div>

            {showAvatarPicker && (
              <div className="p-3.5 rounded-2xl bg-[#F8F9FF] dark:bg-[#141826] border border-[#DCEEFF] dark:border-[#2A3350] space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  {AVATAR_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => {
                        updateProfile({ avatarPreset: preset.id, customAvatarDataUrl: null });
                        setShowAvatarPicker(false);
                      }}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg border transition-transform hover:scale-105 ${
                        !profile.customAvatarDataUrl && profile.avatarPreset === preset.id
                          ? 'border-[#83BDF7] ring-2 ring-[#83BDF7]/40'
                          : 'border-transparent'
                      }`}
                      style={{ backgroundColor: preset.bg }}
                      aria-label={preset.label}
                    >
                      {preset.emoji}
                    </button>
                  ))}
                </div>
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-2 px-3 rounded-xl border border-dashed border-[#83BDF7] text-xs font-semibold text-[#2B6CB0] dark:text-[#83BDF7] hover:bg-[#DCEEFF]/40 dark:hover:bg-[#232E47] transition-colors"
                  >
                    {t.home.uploadPhoto}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User ID Box */}
          <div className="p-3.5 rounded-2xl bg-[#F2F8FF] dark:bg-[#151A2A] border border-[#DCEEFF] dark:border-[#28304A] space-y-3">
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-sm font-semibold tracking-wide text-[#30364D] dark:text-white tabular-nums">
                {profile.userId}
              </span>
              <button
                type="button"
                onClick={regenerateUserId}
                aria-label={t.home.regenerateId}
                className="p-1.5 rounded-lg text-[#5A6382] dark:text-[#9AA5C4] hover:bg-white dark:hover:bg-[#242C44] transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyUserId}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 min-h-[40px] rounded-xl bg-white dark:bg-[#222940] border border-[#DCEEFF] dark:border-[#323C5C] text-xs font-semibold text-[#30364D] dark:text-white hover:bg-[#DCEEFF]/50 dark:hover:bg-[#2A3350] transition-colors whitespace-nowrap"
              >
                {copiedId ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{t.home.copyId}</span>
              </button>
              <button
                type="button"
                onClick={handleShareUserId}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 min-h-[40px] rounded-xl bg-[#FFE0EF] dark:bg-[#3F253B] text-xs font-semibold text-[#30364D] dark:text-[#FFD6E8] hover:opacity-90 transition-opacity whitespace-nowrap"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{t.home.shareId}</span>
              </button>
            </div>
          </div>
        </section>

        {/* Room Create / Join or Active Room Panel */}
        <section className="lg:col-span-7 bg-white dark:bg-[#1B2032] rounded-3xl border border-[#DCEEFF] dark:border-[#28304A] p-6 flex flex-col justify-between gap-5">
          {roomId ? (
            <div className="space-y-5 h-full flex flex-col justify-between">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <span className="text-xs font-medium text-[#5A6382] dark:text-[#9AA5C4]">
                    {t.home.activeRoomLabel} ·{' '}
                    {roomRole === 'host' ? t.status.hostRole : t.status.guestRole}
                  </span>
                  <h3 className="font-display text-2xl sm:text-3xl font-bold font-mono tracking-wider text-[#30364D] dark:text-white mt-1 tabular-nums">
                    {roomId}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopyRoomCode}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 min-h-[44px] rounded-xl bg-[#DCEEFF] dark:bg-[#253552] text-[#30364D] dark:text-[#DCEEFF] text-xs font-semibold hover:opacity-90 transition-opacity whitespace-nowrap"
                  >
                    {copiedRoom ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{t.home.copyRoomCode}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleShareRoomLink}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 min-h-[44px] rounded-xl bg-[#FFE0EF] dark:bg-[#41263D] text-[#30364D] dark:text-[#FFD6E8] text-xs font-semibold hover:opacity-90 transition-opacity whitespace-nowrap"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>{t.home.shareRoomLink}</span>
                  </button>
                </div>
              </div>

              {/* Peers List */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs font-semibold text-[#5A6382] dark:text-[#9AA5C4]">
                  <span className="flex items-center gap-1.5">
                    <Users className="w-4 h-4" />
                    {t.home.peersInRoomTitle} ({peers.length + 1})
                  </span>
                </div>
                <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                  <div className="flex items-center justify-between p-2.5 rounded-2xl bg-[#F2F8FF] dark:bg-[#151A2A]">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <UserAvatar
                        preset={profile.avatarPreset}
                        customUrl={profile.customAvatarDataUrl}
                        name={profile.username}
                        sizeClass="w-9 h-9 text-sm"
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-[#30364D] dark:text-white truncate">
                          {profile.username} ({t.home.youLabel})
                        </p>
                        <p className="text-[11px] font-mono text-[#646D8A] dark:text-[#9AA5C4]">
                          {profile.userId}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300">
                      {connectionStatus === 'in-call' ? t.status.inCall : t.status.online}
                    </span>
                  </div>

                  {peers.length === 0 ? (
                    <p className="text-xs text-[#646D8A] dark:text-[#9AA5C4] py-2 px-1">
                      {t.home.noPeersYet}
                    </p>
                  ) : (
                    peers.map((peer) => (
                      <div
                        key={peer.peerId}
                        className="flex items-center justify-between p-2.5 rounded-2xl bg-[#FFF4F9] dark:bg-[#231D2D]"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <UserAvatar
                            preset={peer.avatarPreset}
                            customUrl={peer.customAvatarDataUrl}
                            name={peer.username}
                            sizeClass="w-9 h-9 text-sm"
                          />
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-[#30364D] dark:text-white truncate">
                              {peer.username}
                            </p>
                            <p className="text-[11px] font-mono text-[#646D8A] dark:text-[#9AA5C4]">
                              {peer.userId}
                            </p>
                          </div>
                        </div>
                        <span className="text-xs font-medium text-[#C2457D] dark:text-[#FFA8CE]">
                          {peer.status === 'in-call' ? t.status.inCall : t.status.online}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-[#DCEEFF] dark:border-[#28304A]">
                <button
                  type="button"
                  onClick={() => navigate(NavRoute.CHAT)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 min-h-[44px] rounded-2xl bg-[#83BDF7] text-[#1E2438] text-sm font-semibold hover:bg-[#72b3f5] transition-colors whitespace-nowrap"
                >
                  <MessageCircleHeart className="w-4 h-4" />
                  <span>{t.home.actionChat}</span>
                </button>
                <button
                  type="button"
                  onClick={leaveRoom}
                  className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-2xl bg-[#FFE0EF] dark:bg-[#422334] text-[#9E2157] dark:text-[#FFC2DD] text-sm font-semibold hover:opacity-90 transition-opacity whitespace-nowrap"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{t.home.leaveRoom}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              <h3 className="font-display text-lg font-semibold text-[#30364D] dark:text-white">
                {t.home.roomCardTitle}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Create Room */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    createRoom(customRoomInput);
                  }}
                  className="p-4 rounded-2xl bg-[#F2F8FF] dark:bg-[#151E30] border border-[#83BDF7]/40 dark:border-[#83BDF7]/20 flex flex-col justify-between gap-3"
                >
                  <div className="space-y-2">
                    <p className="text-sm font-bold text-[#30364D] dark:text-white">
                      {t.home.createRoom}
                    </p>
                    <p className="text-xs text-[#5A6382] dark:text-[#9AA5C4] leading-relaxed">
                      {t.home.createRoomDesc}
                    </p>
                    <input
                      type="text"
                      value={customRoomInput}
                      onChange={(e) => setCustomRoomInput(e.target.value)}
                      placeholder={t.home.customRoomPlaceholder}
                      aria-label={t.home.customRoomPlaceholder}
                      className="w-full px-3 py-2.5 rounded-xl border border-[#DCEEFF] dark:border-[#2C3757] bg-white dark:bg-[#1B2032] text-xs font-mono text-[#30364D] dark:text-white placeholder:text-[#8E97B3] focus:outline-none focus:border-[#83BDF7]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl bg-[#83BDF7] text-[#1E2438] text-xs font-bold tracking-wide hover:bg-[#6fb2f5] transition-colors whitespace-nowrap"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>{t.home.createRoom}</span>
                  </button>
                </form>

                {/* Join Room */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    joinRoom(joinRoomInput);
                  }}
                  className="p-4 rounded-2xl bg-[#FFF3F8] dark:bg-[#261B2A] border border-[#FFA8CE]/50 dark:border-[#FFA8CE]/20 flex flex-col justify-between gap-3"
                >
                  <div className="space-y-2">
                    <p className="text-sm font-bold text-[#30364D] dark:text-white">
                      {t.home.joinRoom}
                    </p>
                    <p className="text-xs text-[#5A6382] dark:text-[#9AA5C4] leading-relaxed">
                      {t.home.joinRoomDesc}
                    </p>
                    <input
                      type="text"
                      value={joinRoomInput}
                      onChange={(e) => setJoinRoomInput(e.target.value)}
                      placeholder={t.home.joinRoomPlaceholder}
                      aria-label={t.home.joinRoomPlaceholder}
                      className="w-full px-3 py-2.5 rounded-xl border border-[#FFE0EF] dark:border-[#442C47] bg-white dark:bg-[#1B2032] text-xs font-mono text-[#30364D] dark:text-white placeholder:text-[#8E97B3] focus:outline-none focus:border-[#FFA8CE]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl bg-[#FFA8CE] text-[#1E2438] text-xs font-bold tracking-wide hover:bg-[#f996c1] transition-colors whitespace-nowrap"
                  >
                    <ArrowRight className="w-4 h-4" />
                    <span>{t.home.joinRoom}</span>
                  </button>
                </form>
              </div>
            </div>
          )}
        </section>
      </div>

      {/* Quick Actions */}
      <section className="space-y-3">
        <h3 className="font-display text-lg font-semibold text-[#30364D] dark:text-white">
          {t.home.quickActionsTitle}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {[
            {
              route: NavRoute.CHAT,
              label: t.home.actionChat,
              icon: <MessageCircleHeart className="w-5 h-5" />,
              bg: 'bg-[#DCEEFF] dark:bg-[#22314C]',
            },
            {
              route: NavRoute.VOICE_CALL,
              label: t.home.actionVoice,
              icon: <Phone className="w-5 h-5" />,
              bg: 'bg-[#FFE0EF] dark:bg-[#3A2338]',
            },
            {
              route: NavRoute.VIDEO_CALL,
              label: t.home.actionVideo,
              icon: <Video className="w-5 h-5" />,
              bg: 'bg-[#E5F1FF] dark:bg-[#232F4A]',
            },
            {
              route: NavRoute.FILE_SHARING,
              label: t.home.actionFile,
              icon: <FolderUp className="w-5 h-5" />,
              bg: 'bg-[#FFE8F3] dark:bg-[#36223A]',
            },
          ].map((action) => (
            <button
              key={action.route}
              type="button"
              onClick={() => navigate(action.route)}
              className="group p-4 rounded-2xl bg-white dark:bg-[#1B2032] border border-[#DCEEFF] dark:border-[#28304A] hover:border-[#83BDF7] dark:hover:border-[#83BDF7]/60 flex items-center gap-3 text-left transition-all duration-150 hover:-translate-y-0.5 min-h-[60px]"
            >
              <div
                className={`w-10 h-10 rounded-xl ${action.bg} text-[#30364D] dark:text-white flex items-center justify-center shrink-0`}
              >
                {action.icon}
              </div>
              <span className="text-sm font-semibold text-[#30364D] dark:text-white truncate">
                {action.label}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Recent Local Sessions */}
      <section className="bg-white dark:bg-[#1B2032] rounded-3xl border border-[#DCEEFF] dark:border-[#28304A] p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-display text-lg font-semibold text-[#30364D] dark:text-white">
              {t.home.recentSessionsTitle}
            </h3>
            <p className="text-xs text-[#646D8A] dark:text-[#9AA5C4]">
              {t.home.recentSessionsSubtitle}
            </p>
          </div>
          {recentSessions.length > 0 && (
            <button
              type="button"
              onClick={clearHistory}
              className="inline-flex items-center gap-1.5 px-3 py-2 min-h-[38px] rounded-xl text-xs font-semibold text-[#9E2157] dark:text-[#FFA8CE] hover:bg-[#FFE0EF]/60 dark:hover:bg-[#3B2335] transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{t.home.clearHistory}</span>
            </button>
          )}
        </div>

        {recentSessions.length === 0 ? (
          <p className="text-sm text-[#646D8A] dark:text-[#9AA5C4] py-4">
            {t.home.noRecentSessions}
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {recentSessions.map((session) => (
              <div
                key={session.roomId}
                className="p-3.5 rounded-2xl bg-[#F8F9FF] dark:bg-[#141826] border border-[#DCEEFF] dark:border-[#28304A] flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <p className="font-mono text-sm font-bold text-[#30364D] dark:text-white truncate">
                    {session.roomId}
                  </p>
                  <p className="text-[11px] text-[#646D8A] dark:text-[#9AA5C4] tabular-nums">
                    {session.role === 'host' ? t.status.hostRole : t.status.guestRole} ·{' '}
                    {formatClockTime(session.joinedAt)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => joinRoom(session.roomId)}
                  className="px-3 py-1.5 min-h-[36px] rounded-xl bg-[#DCEEFF] dark:bg-[#24324D] text-[#30364D] dark:text-[#DCEEFF] text-xs font-semibold hover:opacity-90 transition-opacity whitespace-nowrap shrink-0"
                >
                  {t.home.rejoinRoom}
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
