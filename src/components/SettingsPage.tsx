import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Bell,
  Camera,
  Globe,
  Info,
  Mic,
  Moon,
  RefreshCw,
  RotateCcw,
  Shield,
  Sun,
  Trash2,
  User,
} from 'lucide-react';
import { useSetorawon } from '../context/SetorawonContext';
import { NavRoute } from '../types/app';
import { resizeAvatarToDataUrl } from '../utils/avatar';
import { AVATAR_PRESETS, UserAvatar } from './CuteIllustrations';

export const SettingsPage: React.FC = () => {
  const {
    t,
    settings,
    setLanguage,
    setTheme,
    updateSettings,
    resetSettings,
    profile,
    updateProfile,
    clearHistory,
    navigate,
    addToast,
  } = useSetorawon();

  const [usernameDraft, setUsernameDraft] = useState(profile.username);
  const [mics, setMics] = useState<MediaDeviceInfo[]>([]);
  const [cams, setCams] = useState<MediaDeviceInfo[]>([]);
  const [testStream, setTestStream] = useState<MediaStream | null>(null);
  const testVideoRef = useRef<HTMLVideoElement | null>(null);
  const avatarInputRef = useRef<HTMLInputElement | null>(null);

  const loadDevices = useCallback(async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) return;
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      setMics(devices.filter((d) => d.kind === 'audioinput'));
      setCams(devices.filter((d) => d.kind === 'videoinput'));
    } catch {
      // Ignore permission constraints
    }
  }, []);

  useEffect(() => {
    loadDevices();
    return () => {
      if (testStream) {
        testStream.getTracks().forEach((tr) => tr.stop());
      }
    };
  }, [loadDevices, testStream]);

  useEffect(() => {
    if (testVideoRef.current) {
      testVideoRef.current.srcObject = testStream;
    }
  }, [testStream]);

  const handleToggleMediaTest = async () => {
    if (testStream) {
      testStream.getTracks().forEach((tr) => tr.stop());
      setTestStream(null);
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: settings.selectedMicId ? { deviceId: { exact: settings.selectedMicId } } : true,
        video: settings.selectedCamId ? { deviceId: { exact: settings.selectedCamId } } : true,
      });
      setTestStream(stream);
      await loadDevices();
    } catch {
      addToast('error', t.messages.mediaPermissionDenied);
    }
  };

  const handleBrowserNotifToggle = async (enabled: boolean) => {
    if (enabled && typeof Notification !== 'undefined' && Notification.permission === 'default') {
      try {
        await Notification.requestPermission();
      } catch {
        // Ignore
      }
    }
    updateSettings({ browserNotifications: enabled });
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await resizeAvatarToDataUrl(file);
      updateProfile({ customAvatarDataUrl: dataUrl });
      addToast('success', t.messages.profileSaved);
    } catch {
      addToast('error', t.messages.fileUnsafe);
    } finally {
      e.target.value = '';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-[#30364D] dark:text-white">
          {t.settings.title}
        </h2>
        <p className="text-sm text-[#5A6382] dark:text-[#9AA5C4] mt-1">{t.settings.subtitle}</p>
      </div>

      {/* Language & Theme */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <section className="bg-white dark:bg-[#1B2032] rounded-3xl border border-[#DCEEFF] dark:border-[#28304A] p-5 space-y-4">
          <div className="flex items-center gap-2.5">
            <Globe className="w-5 h-5 text-[#2B6CB0] dark:text-[#83BDF7]" />
            <h3 className="font-display text-base font-bold text-[#30364D] dark:text-white">
              {t.settings.languageSection}
            </h3>
          </div>
          <p className="text-xs text-[#646D8A] dark:text-[#9AA5C4]">{t.settings.languageDesc}</p>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => setLanguage('id')}
              className={`py-2.5 px-3 min-h-[44px] rounded-2xl border text-xs font-bold transition-colors ${
                settings.language === 'id'
                  ? 'bg-[#DCEEFF] dark:bg-[#233554] border-[#83BDF7] text-[#30364D] dark:text-white'
                  : 'border-[#DCEEFF] dark:border-[#28304A] text-[#5A6382] dark:text-[#9AA5C4]'
              }`}
            >
              🇮🇩 Indonesia
            </button>
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`py-2.5 px-3 min-h-[44px] rounded-2xl border text-xs font-bold transition-colors ${
                settings.language === 'en'
                  ? 'bg-[#FFE0EF] dark:bg-[#3A2338] border-[#FFA8CE] text-[#30364D] dark:text-white'
                  : 'border-[#DCEEFF] dark:border-[#28304A] text-[#5A6382] dark:text-[#9AA5C4]'
              }`}
            >
              🇺🇸 English
            </button>
          </div>
        </section>

        <section className="bg-white dark:bg-[#1B2032] rounded-3xl border border-[#DCEEFF] dark:border-[#28304A] p-5 space-y-4">
          <div className="flex items-center gap-2.5">
            {settings.theme === 'light' ? (
              <Sun className="w-5 h-5 text-[#C2457D]" />
            ) : (
              <Moon className="w-5 h-5 text-[#83BDF7]" />
            )}
            <h3 className="font-display text-base font-bold text-[#30364D] dark:text-white">
              {t.settings.themeSection}
            </h3>
          </div>
          <p className="text-xs text-[#646D8A] dark:text-[#9AA5C4]">{t.settings.themeDesc}</p>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => setTheme('light')}
              className={`py-2.5 px-3 min-h-[44px] rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-colors ${
                settings.theme === 'light'
                  ? 'bg-[#DCEEFF] border-[#83BDF7] text-[#30364D]'
                  : 'border-[#DCEEFF] dark:border-[#28304A] text-[#5A6382] dark:text-[#9AA5C4]'
              }`}
            >
              <Sun className="w-4 h-4" />
              <span>{t.settings.lightMode}</span>
            </button>
            <button
              type="button"
              onClick={() => setTheme('dark')}
              className={`py-2.5 px-3 min-h-[44px] rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-colors ${
                settings.theme === 'dark'
                  ? 'bg-[#2A2542] border-[#FFA8CE] text-white'
                  : 'border-[#DCEEFF] dark:border-[#28304A] text-[#5A6382] dark:text-[#9AA5C4]'
              }`}
            >
              <Moon className="w-4 h-4" />
              <span>{t.settings.darkMode}</span>
            </button>
          </div>
        </section>
      </div>

      {/* Profile Editor */}
      <section className="bg-white dark:bg-[#1B2032] rounded-3xl border border-[#DCEEFF] dark:border-[#28304A] p-6 space-y-5">
        <div className="flex items-center gap-2.5">
          <User className="w-5 h-5 text-[#2B6CB0] dark:text-[#83BDF7]" />
          <h3 className="font-display text-base font-bold text-[#30364D] dark:text-white">
            {t.settings.profileSection}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (usernameDraft.trim()) {
                updateProfile({ username: usernameDraft.trim() });
                addToast('success', t.messages.profileSaved);
              }
            }}
            className="space-y-2.5"
          >
            <label
              htmlFor="settings-username"
              className="block text-xs font-semibold text-[#5A6382] dark:text-[#9AA5C4]"
            >
              {t.settings.usernameLabel}
            </label>
            <div className="flex items-center gap-2">
              <input
                id="settings-username"
                type="text"
                value={usernameDraft}
                onChange={(e) => setUsernameDraft(e.target.value)}
                maxLength={28}
                className="flex-1 px-3.5 py-2.5 min-h-[44px] rounded-2xl border border-[#DCEEFF] dark:border-[#2C3654] bg-[#F8F9FF] dark:bg-[#141826] text-sm text-[#30364D] dark:text-white"
              />
              <button
                type="submit"
                className="px-4 py-2.5 min-h-[44px] rounded-2xl bg-[#83BDF7] text-[#1E2438] text-xs font-bold whitespace-nowrap"
              >
                {t.home.saveName}
              </button>
            </div>
          </form>

          <div className="space-y-2.5">
            <p className="text-xs font-semibold text-[#5A6382] dark:text-[#9AA5C4]">
              {t.settings.avatarLabel}
            </p>
            <div className="flex flex-wrap items-center gap-2.5">
              <UserAvatar
                preset={profile.avatarPreset}
                customUrl={profile.customAvatarDataUrl}
                name={profile.username}
                sizeClass="w-11 h-11 text-lg"
              />
              {AVATAR_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => updateProfile({ avatarPreset: preset.id, customAvatarDataUrl: null })}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-base border transition-transform hover:scale-105 ${
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
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => avatarInputRef.current?.click()}
                className="px-3 py-2 min-h-[40px] rounded-xl border border-dashed border-[#FFA8CE] text-xs font-semibold text-[#C2457D] dark:text-[#FFA8CE]"
              >
                {t.home.uploadPhoto}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Microphone & Camera Devices */}
      <section className="bg-white dark:bg-[#1B2032] rounded-3xl border border-[#DCEEFF] dark:border-[#28304A] p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Camera className="w-5 h-5 text-[#C2457D] dark:text-[#FFA8CE]" />
            <h3 className="font-display text-base font-bold text-[#30364D] dark:text-white">
              {t.settings.devicesSection}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={loadDevices}
              className="inline-flex items-center gap-1.5 px-3 py-2 min-h-[38px] rounded-xl bg-[#F2F6FF] dark:bg-[#232A40] text-xs font-semibold"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{t.settings.refreshDevices}</span>
            </button>
            <button
              type="button"
              onClick={handleToggleMediaTest}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 min-h-[38px] rounded-xl bg-[#DCEEFF] dark:bg-[#243452] text-[#30364D] dark:text-[#DCEEFF] text-xs font-semibold"
            >
              <Mic className="w-3.5 h-3.5" />
              <span>{testStream ? t.settings.stopTestMedia : t.settings.testMedia}</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label
              htmlFor="settings-mic"
              className="block text-xs font-semibold text-[#5A6382] dark:text-[#9AA5C4]"
            >
              {t.settings.micLabel}
            </label>
            <select
              id="settings-mic"
              value={settings.selectedMicId}
              onChange={(e) => updateSettings({ selectedMicId: e.target.value })}
              className="w-full px-3.5 py-2.5 min-h-[44px] rounded-2xl border border-[#DCEEFF] dark:border-[#2C3654] bg-[#F8F9FF] dark:bg-[#141826] text-xs text-[#30364D] dark:text-white"
            >
              <option value="">{t.settings.defaultDevice}</option>
              {mics.map((mic, i) => (
                <option key={mic.deviceId || i} value={mic.deviceId}>
                  {mic.label || `${t.settings.micLabel} ${i + 1}`}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="settings-cam"
              className="block text-xs font-semibold text-[#5A6382] dark:text-[#9AA5C4]"
            >
              {t.settings.camLabel}
            </label>
            <select
              id="settings-cam"
              value={settings.selectedCamId}
              onChange={(e) => updateSettings({ selectedCamId: e.target.value })}
              className="w-full px-3.5 py-2.5 min-h-[44px] rounded-2xl border border-[#DCEEFF] dark:border-[#2C3654] bg-[#F8F9FF] dark:bg-[#141826] text-xs text-[#30364D] dark:text-white"
            >
              <option value="">{t.settings.defaultDevice}</option>
              {cams.map((cam, i) => (
                <option key={cam.deviceId || i} value={cam.deviceId}>
                  {cam.label || `${t.settings.camLabel} ${i + 1}`}
                </option>
              ))}
            </select>
          </div>
        </div>

        {testStream && (
          <div className="rounded-2xl overflow-hidden bg-black max-w-sm aspect-video border border-[#83BDF7]">
            <video ref={testVideoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
          </div>
        )}
      </section>

      {/* Notifications & Privacy */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <section className="bg-white dark:bg-[#1B2032] rounded-3xl border border-[#DCEEFF] dark:border-[#28304A] p-6 space-y-4">
          <div className="flex items-center gap-2.5">
            <Bell className="w-5 h-5 text-[#2B6CB0] dark:text-[#83BDF7]" />
            <h3 className="font-display text-base font-bold text-[#30364D] dark:text-white">
              {t.settings.notificationsSection}
            </h3>
          </div>

          <label className="flex items-start justify-between gap-3 cursor-pointer">
            <div>
              <p className="text-sm font-semibold text-[#30364D] dark:text-white">
                {t.settings.soundNotif}
              </p>
              <p className="text-xs text-[#646D8A] dark:text-[#9AA5C4]">{t.settings.soundNotifDesc}</p>
            </div>
            <input
              type="checkbox"
              checked={settings.soundNotifications}
              onChange={(e) => updateSettings({ soundNotifications: e.target.checked })}
              className="w-5 h-5 mt-0.5 accent-[#83BDF7]"
            />
          </label>

          <label className="flex items-start justify-between gap-3 cursor-pointer">
            <div>
              <p className="text-sm font-semibold text-[#30364D] dark:text-white">
                {t.settings.browserNotif}
              </p>
              <p className="text-xs text-[#646D8A] dark:text-[#9AA5C4]">{t.settings.browserNotifDesc}</p>
            </div>
            <input
              type="checkbox"
              checked={settings.browserNotifications}
              onChange={(e) => handleBrowserNotifToggle(e.target.checked)}
              className="w-5 h-5 mt-0.5 accent-[#FFA8CE]"
            />
          </label>
        </section>

        <section className="bg-white dark:bg-[#1B2032] rounded-3xl border border-[#DCEEFF] dark:border-[#28304A] p-6 space-y-4">
          <div className="flex items-center gap-2.5">
            <Shield className="w-5 h-5 text-[#C2457D] dark:text-[#FFA8CE]" />
            <h3 className="font-display text-base font-bold text-[#30364D] dark:text-white">
              {t.settings.privacySection}
            </h3>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span>{t.settings.maxFileSize}</span>
              <span className="font-mono tabular-nums text-[#2B6CB0] dark:text-[#83BDF7]">
                {settings.maxFileSizeMb} MB
              </span>
            </div>
            <input
              type="range"
              min={5}
              max={100}
              step={5}
              value={settings.maxFileSizeMb}
              onChange={(e) => updateSettings({ maxFileSizeMb: Number(e.target.value) })}
              aria-label={t.settings.maxFileSize}
              className="w-full accent-[#83BDF7]"
            />
          </div>

          <label className="flex items-start justify-between gap-3 cursor-pointer">
            <div>
              <p className="text-sm font-semibold text-[#30364D] dark:text-white">
                {t.settings.hideTyping}
              </p>
              <p className="text-xs text-[#646D8A] dark:text-[#9AA5C4]">{t.settings.hideTypingDesc}</p>
            </div>
            <input
              type="checkbox"
              checked={settings.hideTypingIndicator}
              onChange={(e) => updateSettings({ hideTypingIndicator: e.target.checked })}
              className="w-5 h-5 mt-0.5 accent-[#FFA8CE]"
            />
          </label>

          <button
            type="button"
            onClick={clearHistory}
            className="inline-flex items-center gap-2 px-3.5 py-2 min-h-[40px] rounded-xl bg-[#FFE0EF] dark:bg-[#3F2334] text-[#9E2157] dark:text-[#FFC2DD] text-xs font-semibold"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{t.settings.clearLocalData}</span>
          </button>
        </section>
      </div>

      {/* App Info & Reset */}
      <section className="bg-white dark:bg-[#1B2032] rounded-3xl border border-[#DCEEFF] dark:border-[#28304A] p-6 space-y-4">
        <div className="flex items-center gap-2.5">
          <Info className="w-5 h-5 text-[#2B6CB0] dark:text-[#83BDF7]" />
          <h3 className="font-display text-base font-bold text-[#30364D] dark:text-white">
            {t.settings.appInfoSection}
          </h3>
        </div>
        <p className="text-xs text-[#5A6382] dark:text-[#A4B0D1] leading-relaxed">
          {t.settings.architectureInfo}
        </p>
        <p className="text-xs text-[#5A6382] dark:text-[#A4B0D1] leading-relaxed">
          {t.settings.turnInfo}
        </p>

        <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-[#DCEEFF] dark:border-[#28304A]">
          <button
            type="button"
            onClick={() => navigate(NavRoute.ABOUT)}
            className="text-xs font-semibold text-[#2B6CB0] dark:text-[#83BDF7] hover:underline"
          >
            {t.nav.about} — SETORAWON (@wazzz.dotcom)
          </button>

          <button
            type="button"
            onClick={resetSettings}
            className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-2xl bg-[#FFE0EF] dark:bg-[#422334] text-[#9E2157] dark:text-[#FFC2DD] text-xs font-bold hover:opacity-90 transition-opacity"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{t.settings.resetSettings}</span>
          </button>
        </div>
      </section>
    </div>
  );
};
