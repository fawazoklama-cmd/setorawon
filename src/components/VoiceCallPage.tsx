import React, { useEffect, useState } from 'react';
import { Mic, MicOff, Phone, PhoneOff, Volume2 } from 'lucide-react';
import { useSetorawon } from '../context/SetorawonContext';
import { NavRoute } from '../types/app';
import { formatDuration } from '../utils/identity';
import { HeartIllustration, SparklesIllustration, UserAvatar } from './CuteIllustrations';

export const VoiceCallPage: React.FC = () => {
  const {
    t,
    roomId,
    peers,
    profile,
    callStatus,
    activeCallType,
    activeCallPeerId,
    callDurationSeconds,
    isMicMuted,
    startCall,
    endCall,
    toggleMic,
    navigate,
  } = useSetorawon();

  const [selectedPeerId, setSelectedPeerId] = useState<string>('');

  useEffect(() => {
    if (peers.length > 0 && !peers.some((p) => p.peerId === selectedPeerId)) {
      setSelectedPeerId(peers[0].peerId);
    }
  }, [peers, selectedPeerId]);

  const activePeer =
    peers.find((p) => p.peerId === (activeCallPeerId || selectedPeerId)) ?? null;

  const isInVoiceOrCall =
    callStatus === 'calling' || callStatus === 'ringing' || callStatus === 'connected';

  if (!roomId) {
    return (
      <div className="bg-white dark:bg-[#1B2032] rounded-3xl border border-[#DCEEFF] dark:border-[#28304A] p-8 sm:p-12 text-center max-w-xl mx-auto mt-6 space-y-4">
        <div className="flex justify-center">
          <HeartIllustration className="w-12 h-12" />
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
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-gradient-to-br from-white via-[#F8FAFF] to-[#FFF2F8] dark:from-[#1B2032] dark:via-[#191F30] dark:to-[#281D2C] rounded-3xl border border-[#DCEEFF] dark:border-[#28304A] p-6 sm:p-10 text-center space-y-7">
        <div className="flex items-center justify-between text-xs text-[#646D8A] dark:text-[#9AA5C4]">
          <span>{t.voice.title}</span>
          <span className="font-mono tabular-nums">{roomId}</span>
        </div>

        {/* Avatar Stage */}
        <div className="py-4 flex flex-col items-center space-y-4">
          <div className="relative inline-flex items-center justify-center">
            {isInVoiceOrCall && (
              <div className="absolute -inset-3 rounded-[2rem] bg-gradient-to-tr from-[#83BDF7]/40 to-[#FFA8CE]/40 animate-soft-ring" />
            )}
            <UserAvatar
              preset={activePeer ? activePeer.avatarPreset : profile.avatarPreset}
              customUrl={activePeer ? activePeer.customAvatarDataUrl : profile.customAvatarDataUrl}
              name={activePeer ? activePeer.username : profile.username}
              sizeClass="w-28 h-28 text-4xl relative z-10 shadow-sm"
            />
            <div className="absolute -top-2 -right-3 z-20">
              <SparklesIllustration className="w-7 h-7" />
            </div>
          </div>

          <div className="space-y-1">
            <h2 className="font-display text-2xl font-bold text-[#30364D] dark:text-white">
              {activePeer ? activePeer.username : t.status.waitingPeers}
            </h2>
            <p className="text-sm font-medium text-[#5A6382] dark:text-[#A4B0D1]">
              {callStatus === 'connected'
                ? `${t.voice.connected} · ${activeCallType?.toUpperCase()}`
                : callStatus === 'calling'
                ? t.voice.calling
                : peers.length > 0
                ? t.voice.idleHint
                : t.voice.noPeersHint}
            </p>
            {callStatus === 'connected' && (
              <p className="font-mono text-2xl font-bold text-[#2B6CB0] dark:text-[#83BDF7] tabular-nums pt-1">
                {formatDuration(callDurationSeconds)}
              </p>
            )}
          </div>
        </div>

        {/* Peer Selector when multiple peers are connected */}
        {peers.length > 1 && !isInVoiceOrCall && (
          <div className="max-w-xs mx-auto text-left space-y-1.5">
            <label
              htmlFor="voice-peer-select"
              className="block text-xs font-semibold text-[#5A6382] dark:text-[#9AA5C4]"
            >
              {t.voice.selectPeer}
            </label>
            <select
              id="voice-peer-select"
              value={selectedPeerId}
              onChange={(e) => setSelectedPeerId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl border border-[#DCEEFF] dark:border-[#2C3654] bg-white dark:bg-[#141826] text-sm text-[#30364D] dark:text-white"
            >
              {peers.map((p) => (
                <option key={p.peerId} value={p.peerId}>
                  {p.username} ({p.userId})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Call Controls */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          {!isInVoiceOrCall ? (
            <button
              type="button"
              disabled={!activePeer}
              onClick={() => activePeer && startCall(activePeer.peerId, 'voice')}
              className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 min-h-[48px] rounded-2xl bg-gradient-to-r from-[#83BDF7] to-[#FFA8CE] text-[#1E2438] text-sm font-bold hover:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
            >
              <Phone className="w-5 h-5" />
              <span>{t.voice.startCall}</span>
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={toggleMic}
                className={`inline-flex items-center justify-center gap-2 px-5 py-3 min-h-[48px] rounded-2xl text-sm font-semibold transition-colors ${
                  isMicMuted
                    ? 'bg-[#FFE0EF] dark:bg-[#472336] text-[#9E2157] dark:text-[#FFC2DD]'
                    : 'bg-[#DCEEFF] dark:bg-[#243452] text-[#30364D] dark:text-[#DCEEFF]'
                }`}
              >
                {isMicMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                <span>{isMicMuted ? t.voice.unmute : t.voice.mute}</span>
              </button>

              <button
                type="button"
                onClick={endCall}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 min-h-[48px] rounded-2xl bg-[#FF7CA8] text-[#1E2438] text-sm font-bold hover:bg-[#fb699b] transition-colors"
              >
                <PhoneOff className="w-5 h-5" />
                <span>{t.voice.endCall}</span>
              </button>
            </>
          )}
        </div>

        {/* Mic status indicator */}
        {isInVoiceOrCall && (
          <div className="inline-flex items-center gap-2 text-xs text-[#5A6382] dark:text-[#9AA5C4]">
            <Volume2 className="w-4 h-4" />
            <span>{isMicMuted ? t.voice.micMuted : t.voice.micActive}</span>
          </div>
        )}
      </div>
    </div>
  );
};
