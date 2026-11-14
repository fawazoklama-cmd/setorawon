import React, { useEffect, useRef, useState } from 'react';
import {
  Check,
  Copy,
  FolderUp,
  Home,
  Info,
  Menu,
  MessageCircleHeart,
  Moon,
  Phone,
  PhoneCall,
  PhoneOff,
  Settings,
  Sun,
  Video,
  X,
} from 'lucide-react';
import { useSetorawon } from '../context/SetorawonContext';
import { NavRoute } from '../types/app';
import { SetorawonLogo, UserAvatar } from './CuteIllustrations';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    route,
    navigate,
    t,
    settings,
    setLanguage,
    setTheme,
    profile,
    roomId,
    connectionStatus,
    peers,
    incomingCall,
    acceptIncomingCall,
    declineIncomingCall,
    remoteStream,
    activeCallType,
    toasts,
    dismissToast,
    addToast,
  } = useSetorawon();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [copiedRoom, setCopiedRoom] = useState(false);
  const remoteAudioRef = useRef<HTMLAudioElement | null>(null);

  // Keep voice audio playing smoothly across views when in voice call or off the video screen
  useEffect(() => {
    const audioEl = remoteAudioRef.current;
    if (!audioEl) return;
    const shouldPlayAudioElement =
      Boolean(remoteStream) && (activeCallType === 'voice' || route !== NavRoute.VIDEO_CALL);
    if (shouldPlayAudioElement && remoteStream) {
      audioEl.srcObject = remoteStream;
      audioEl.play().catch(() => {});
    } else {
      audioEl.srcObject = null;
    }
  }, [remoteStream, activeCallType, route]);

  const navItems: Array<{ route: NavRoute; label: string; icon: React.ReactNode }> = [
    { route: NavRoute.HOME, label: t.nav.home, icon: <Home className="w-5 h-5" /> },
    { route: NavRoute.CHAT, label: t.nav.chat, icon: <MessageCircleHeart className="w-5 h-5" /> },
    { route: NavRoute.VOICE_CALL, label: t.nav.voiceCall, icon: <Phone className="w-5 h-5" /> },
    { route: NavRoute.VIDEO_CALL, label: t.nav.videoCall, icon: <Video className="w-5 h-5" /> },
    { route: NavRoute.FILE_SHARING, label: t.nav.fileSharing, icon: <FolderUp className="w-5 h-5" /> },
    { route: NavRoute.SETTINGS, label: t.nav.settings, icon: <Settings className="w-5 h-5" /> },
    { route: NavRoute.ABOUT, label: t.nav.about, icon: <Info className="w-5 h-5" /> },
  ];

  const currentPageTitle = navItems.find((item) => item.route === route)?.label ?? t.app.name;

  const handleCopyRoomId = () => {
    if (!roomId) return;
    navigator.clipboard.writeText(roomId).then(() => {
      setCopiedRoom(true);
      addToast('success', t.messages.copiedRoom);
      window.setTimeout(() => setCopiedRoom(false), 1800);
    });
  };

  const statusText =
    connectionStatus === 'in-call'
      ? t.status.inCall
      : connectionStatus === 'connecting'
      ? t.status.connecting
      : connectionStatus === 'online'
      ? t.status.online
      : t.status.offline;

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#F8F9FF] dark:bg-[#121521] text-[#30364D] dark:text-[#F1F4FF] transition-colors duration-200">
      <audio ref={remoteAudioRef} autoPlay playsInline className="hidden" />

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 bg-white/90 dark:bg-[#1B2032]/95 backdrop-blur-md border-r border-[#DCEEFF] dark:border-[#28304A] z-30">
        <div className="p-5 flex items-center gap-3 border-b border-[#DCEEFF]/70 dark:border-[#28304A]">
          <SetorawonLogo className="w-10 h-10 shrink-0" />
          <div className="min-w-0">
            <span className="font-display text-lg font-bold tracking-tight text-[#30364D] dark:text-white block">
              {t.app.name}
            </span>
            <span className="text-[11px] leading-tight text-[#646D8A] dark:text-[#9AA5C4] block">
              {t.app.tagline}
            </span>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto" aria-label="Main Navigation">
          {navItems.map((item) => {
            const isActive = route === item.route;
            return (
              <button
                key={item.route}
                type="button"
                onClick={() => navigate(item.route)}
                aria-current={isActive ? 'page' : undefined}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 min-h-[44px] rounded-2xl text-sm font-medium transition-all duration-150 whitespace-nowrap ${
                  isActive
                    ? 'bg-gradient-to-r from-[#DCEEFF] to-[#FFE0EF] dark:from-[#263859] dark:to-[#3E2742] text-[#30364D] dark:text-white shadow-sm'
                    : 'text-[#5A6382] dark:text-[#A4B0D1] hover:bg-[#F1F6FF] dark:hover:bg-[#232A40] hover:text-[#30364D] dark:hover:text-white'
                }`}
              >
                <span className={isActive ? 'text-[#2B6CB0] dark:text-[#83BDF7]' : ''}>{item.icon}</span>
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Active Room & Profile Footer inside Sidebar */}
        <div className="p-4 border-t border-[#DCEEFF]/70 dark:border-[#28304A] space-y-3">
          {roomId && (
            <div className="p-3 rounded-2xl bg-[#F2F8FF] dark:bg-[#222940] border border-[#83BDF7]/40 dark:border-[#83BDF7]/20">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-medium text-[#5A6382] dark:text-[#9AA5C4]">
                  {t.status.roomActive}
                </span>
                <span className="text-[11px] font-mono tabular-nums text-[#2B6CB0] dark:text-[#83BDF7]">
                  {peers.length} {t.status.peersConnected}
                </span>
              </div>
              <div className="mt-1 flex items-center justify-between gap-2">
                <span className="font-mono text-xs font-semibold text-[#30364D] dark:text-white truncate">
                  {roomId}
                </span>
                <button
                  type="button"
                  onClick={handleCopyRoomId}
                  aria-label={t.home.copyRoomCode}
                  className="p-1.5 rounded-lg hover:bg-[#DCEEFF] dark:hover:bg-[#2E3858] text-[#30364D] dark:text-[#DCEEFF] transition-colors"
                >
                  {copiedRoom ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3">
            <UserAvatar
              preset={profile.avatarPreset}
              customUrl={profile.customAvatarDataUrl}
              name={profile.username}
              sizeClass="w-10 h-10 text-base"
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-[#30364D] dark:text-white truncate">
                {profile.username}
              </p>
              <p className="text-xs text-[#646D8A] dark:text-[#9AA5C4] flex items-center gap-1.5 truncate">
                <span
                  className={`inline-block w-2 h-2 rounded-full shrink-0 ${
                    connectionStatus === 'online'
                      ? 'bg-emerald-500'
                      : connectionStatus === 'in-call'
                      ? 'bg-pink-500'
                      : connectionStatus === 'connecting'
                      ? 'bg-amber-400'
                      : 'bg-slate-400'
                  }`}
                />
                <span className="truncate">{statusText}</span>
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        {/* Top Bar (56px height to keep mobile sticky total <= 15%) */}
        <header className="sticky top-0 z-20 h-14 px-4 lg:px-8 bg-white/85 dark:bg-[#1B2032]/90 backdrop-blur-md border-b border-[#DCEEFF] dark:border-[#28304A] flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="lg:hidden">
              <SetorawonLogo className="w-8 h-8" />
            </div>
            <h1 className="font-display text-base lg:text-lg font-semibold text-[#30364D] dark:text-white truncate">
              {currentPageTitle}
            </h1>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {roomId && (
              <button
                type="button"
                onClick={handleCopyRoomId}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#DCEEFF] dark:bg-[#24324E] text-[#30364D] dark:text-[#DCEEFF] text-xs font-mono font-medium hover:bg-[#cbe3fc] dark:hover:bg-[#2d3e60] transition-colors whitespace-nowrap shrink-0"
              >
                <span>{roomId}</span>
                {copiedRoom ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            )}

            <button
              type="button"
              onClick={() => setLanguage(settings.language === 'id' ? 'en' : 'id')}
              aria-label="Switch Language"
              className="px-2.5 py-1.5 min-h-[38px] rounded-xl border border-[#DCEEFF] dark:border-[#2E3754] bg-white dark:bg-[#222940] text-xs font-semibold text-[#30364D] dark:text-[#F1F4FF] hover:bg-[#F2F8FF] dark:hover:bg-[#2A3350] transition-colors whitespace-nowrap shrink-0"
            >
              {settings.language === 'id' ? '🇮🇩 ID' : '🇺🇸 EN'}
            </button>

            <button
              type="button"
              onClick={() => setTheme(settings.theme === 'light' ? 'dark' : 'light')}
              aria-label={settings.theme === 'light' ? t.settings.darkMode : t.settings.lightMode}
              className="p-2 min-h-[38px] min-w-[38px] rounded-xl border border-[#DCEEFF] dark:border-[#2E3754] bg-white dark:bg-[#222940] text-[#30364D] dark:text-[#F1F4FF] hover:bg-[#FFE0EF]/60 dark:hover:bg-[#2A3350] transition-colors flex items-center justify-center shrink-0"
            >
              {settings.theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>
          </div>
        </header>

        {/* Page Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8 max-w-6xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation (64px height) */}
      <nav
        aria-label="Mobile Navigation"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-30 h-16 bg-white/95 dark:bg-[#1B2032]/95 backdrop-blur-md border-t border-[#DCEEFF] dark:border-[#28304A] grid grid-cols-5 items-center px-1"
      >
        {[
          { route: NavRoute.HOME, label: t.nav.home, icon: <Home className="w-5 h-5" /> },
          { route: NavRoute.CHAT, label: t.nav.chat, icon: <MessageCircleHeart className="w-5 h-5" /> },
          { route: NavRoute.VOICE_CALL, label: t.nav.voiceCall, icon: <Phone className="w-5 h-5" /> },
          { route: NavRoute.VIDEO_CALL, label: t.nav.videoCall, icon: <Video className="w-5 h-5" /> },
        ].map((item) => {
          const isActive = route === item.route;
          return (
            <button
              key={item.route}
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                navigate(item.route);
              }}
              aria-current={isActive ? 'page' : undefined}
              className={`flex flex-col items-center justify-center min-h-[48px] rounded-xl px-1 transition-colors ${
                isActive
                  ? 'text-[#2B6CB0] dark:text-[#83BDF7] font-semibold'
                  : 'text-[#5A6382] dark:text-[#9AA5C4]'
              }`}
            >
              {item.icon}
              <span className="text-[10px] mt-1 truncate max-w-full">{item.label}</span>
            </button>
          );
        })}

        <button
          type="button"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          aria-expanded={mobileMenuOpen}
          aria-label={t.nav.more}
          className={`flex flex-col items-center justify-center min-h-[48px] rounded-xl px-1 transition-colors ${
            mobileMenuOpen ||
            route === NavRoute.FILE_SHARING ||
            route === NavRoute.SETTINGS ||
            route === NavRoute.ABOUT
              ? 'text-[#C2457D] dark:text-[#FFA8CE] font-semibold'
              : 'text-[#5A6382] dark:text-[#9AA5C4]'
          }`}
        >
          <Menu className="w-5 h-5" />
          <span className="text-[10px] mt-1 truncate max-w-full">{t.nav.more}</span>
        </button>
      </nav>

      {/* Mobile More Sheet */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-xs flex items-end"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="w-full bg-white dark:bg-[#1B2032] rounded-t-3xl p-5 pb-8 space-y-2 border-t border-[#DCEEFF] dark:border-[#28304A]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-1.5 bg-[#DCEEFF] dark:bg-[#323B5B] rounded-full mx-auto mb-3" />
            {[
              { route: NavRoute.FILE_SHARING, label: t.nav.fileSharing, icon: <FolderUp className="w-5 h-5" /> },
              { route: NavRoute.SETTINGS, label: t.nav.settings, icon: <Settings className="w-5 h-5" /> },
              { route: NavRoute.ABOUT, label: t.nav.about, icon: <Info className="w-5 h-5" /> },
            ].map((item) => (
              <button
                key={item.route}
                type="button"
                onClick={() => {
                  navigate(item.route);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 min-h-[48px] rounded-2xl text-sm font-medium ${
                  route === item.route
                    ? 'bg-gradient-to-r from-[#DCEEFF] to-[#FFE0EF] dark:from-[#263859] dark:to-[#3E2742] text-[#30364D] dark:text-white'
                    : 'text-[#30364D] dark:text-[#E2E8FF] hover:bg-[#F2F8FF] dark:hover:bg-[#232A40]'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Global Incoming Call Modal */}
      {incomingCall && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={t.voice.incomingTitle}
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className="w-full max-w-sm bg-white dark:bg-[#1E2438] rounded-3xl p-6 border border-[#FFA8CE]/60 dark:border-[#FFA8CE]/30 shadow-xl text-center space-y-5">
            <div className="relative inline-flex items-center justify-center">
              <div className="absolute inset-0 rounded-3xl bg-[#FFA8CE]/40 animate-soft-ring" />
              <UserAvatar
                preset={incomingCall.fromAvatarPreset}
                customUrl={incomingCall.fromCustomAvatar}
                name={incomingCall.fromName}
                sizeClass="w-20 h-20 text-3xl relative z-10"
              />
            </div>

            <div className="space-y-1">
              <p className="text-xs font-semibold text-[#C2457D] dark:text-[#FFA8CE]">
                {t.voice.incomingTitle}
              </p>
              <h2 className="font-display text-xl font-bold text-[#30364D] dark:text-white">
                {incomingCall.fromName}
              </h2>
              <p className="text-sm text-[#5A6382] dark:text-[#A4B0D1]">
                {incomingCall.callType === 'voice'
                  ? t.voice.incomingVoiceDesc
                  : incomingCall.callType === 'video'
                  ? t.voice.incomingVideoDesc
                  : t.voice.incomingScreenDesc}
              </p>
            </div>

            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={declineIncomingCall}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 min-h-[44px] rounded-2xl bg-[#FFE0EF] dark:bg-[#4B2335] text-[#9E2157] dark:text-[#FFC2DD] font-semibold text-sm hover:opacity-90 transition-opacity"
              >
                <PhoneOff className="w-4 h-4" />
                <span>{t.voice.decline}</span>
              </button>
              <button
                type="button"
                onClick={acceptIncomingCall}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 min-h-[44px] rounded-2xl bg-[#83BDF7] text-[#1E2438] font-semibold text-sm hover:bg-[#71b2f5] transition-colors"
              >
                <PhoneCall className="w-4 h-4" />
                <span>{t.voice.accept}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notifications */}
      {toasts.length > 0 && (
        <div
          aria-live="polite"
          className="fixed bottom-20 lg:bottom-6 right-4 z-50 flex flex-col gap-2 max-w-xs w-[calc(100vw-2rem)]"
        >
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className={`flex items-start justify-between gap-3 px-4 py-3 rounded-2xl border shadow-md backdrop-blur-md text-xs font-medium transition-all ${
                toast.type === 'error'
                  ? 'bg-[#FFE6EE]/95 dark:bg-[#3E202B]/95 border-[#FFA8CE] text-[#8E1C49] dark:text-[#FFC6DC]'
                  : toast.type === 'warning'
                  ? 'bg-[#FFF5DC]/95 dark:bg-[#3A301A]/95 border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-100'
                  : toast.type === 'success'
                  ? 'bg-[#E6F4FF]/95 dark:bg-[#1E314A]/95 border-[#83BDF7] text-[#1D4E89] dark:text-[#DCEEFF]'
                  : 'bg-white/95 dark:bg-[#222940]/95 border-[#DCEEFF] dark:border-[#323C5C] text-[#30364D] dark:text-[#F1F4FF]'
              }`}
            >
              <span className="leading-relaxed">{toast.message}</span>
              <button
                type="button"
                onClick={() => dismissToast(toast.id)}
                aria-label={t.files.close}
                className="p-0.5 rounded-lg opacity-70 hover:opacity-100 shrink-0"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
