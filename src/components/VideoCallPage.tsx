import React, { useEffect, useRef, useState } from 'react';
import {
  AppWindow,
  Camera,
  CameraOff,
  Maximize2,
  Mic,
  MicOff,
  Minimize2,
  Monitor,
  MonitorOff,
  PhoneOff,
  RefreshCw,
  SquareTerminal,
  Video,
} from 'lucide-react';
import { useSetorawon } from '../context/SetorawonContext';
import { NavRoute, ScreenShareSurface } from '../types/app';
import { formatDuration } from '../utils/identity';
import { CloudIllustration, UserAvatar } from './CuteIllustrations';

export const VideoCallPage: React.FC = () => {
  const {
    t,
    roomId,
    peers,
    profile,
    callStatus,
    activeCallPeerId,
    callDurationSeconds,
    localStream,
    remoteStream,
    screenStream,
    isMicMuted,
    isCameraOff,
    isScreenSharing,
    isScreenShareSupported,
    startLocalPreview,
    stopLocalPreview,
    startCall,
    endCall,
    toggleMic,
    toggleCamera,
    switchCameraFacing,
    startScreenShare,
    stopScreenShare,
    navigate,
  } = useSetorawon();

  const [selectedPeerId, setSelectedPeerId] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const stageRef = useRef<HTMLDivElement | null>(null);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const screenVideoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (peers.length > 0 && !peers.some((p) => p.peerId === selectedPeerId)) {
      setSelectedPeerId(peers[0].peerId);
    }
  }, [peers, selectedPeerId]);

  useEffect(() => {
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  useEffect(() => {
    if (screenVideoRef.current) {
      screenVideoRef.current.srcObject = screenStream;
    }
  }, [screenStream]);

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const toggleFullscreen = async () => {
    if (!stageRef.current) return;
    try {
      if (!document.fullscreenElement) {
        await stageRef.current.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch {
      // Ignore if fullscreen blocked
    }
  };

  const activePeer =
    peers.find((p) => p.peerId === (activeCallPeerId || selectedPeerId)) ?? null;
  const isInCall = callStatus === 'calling' || callStatus === 'connected';

  const handleScreenShareSurface = (surface: ScreenShareSurface) => {
    startScreenShare(surface, activePeer?.peerId);
  };

  if (!roomId) {
    return (
      <div className="bg-white dark:bg-[#1B2032] rounded-3xl border border-[#DCEEFF] dark:border-[#28304A] p-8 sm:p-12 text-center max-w-xl mx-auto mt-6 space-y-4">
        <div className="flex justify-center">
          <CloudIllustration className="w-20 h-14" />
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
      {/* Main Video Stage */}
      <div
        ref={stageRef}
        className="relative bg-[#151A2B] rounded-3xl overflow-hidden border border-[#DCEEFF] dark:border-[#28304A] shadow-sm"
      >
        <div className="relative aspect-video w-full max-h-[68vh] bg-gradient-to-br from-[#1B233B] to-[#291C2F] flex items-center justify-center">
          {remoteStream ? (
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-full object-contain bg-black"
            />
          ) : isScreenSharing && screenStream ? (
            <video
              ref={screenVideoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-contain bg-black"
            />
          ) : (
            <div className="text-center p-6 space-y-3">
              <div className="flex justify-center">
                <UserAvatar
                  preset={activePeer ? activePeer.avatarPreset : profile.avatarPreset}
                  customUrl={activePeer ? activePeer.customAvatarDataUrl : profile.customAvatarDataUrl}
                  name={activePeer ? activePeer.username : profile.username}
                  sizeClass="w-20 h-20 text-3xl"
                />
              </div>
              <p className="text-sm font-medium text-[#DCEEFF]">
                {activePeer ? activePeer.username : t.status.waitingPeers}
              </p>
              <p className="text-xs text-[#9AA5C4] max-w-sm mx-auto">{t.video.noRemoteVideo}</p>
            </div>
          )}

          {/* Top-left Status & Timer */}
          <div className="absolute top-3 left-3 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/50 backdrop-blur-md text-white text-xs">
            <span>{activePeer ? activePeer.username : t.video.remoteLabel}</span>
            {callStatus === 'connected' && (
              <>
                <span aria-hidden="true">·</span>
                <span className="font-mono tabular-nums text-[#83BDF7]">
                  {formatDuration(callDurationSeconds)}
                </span>
              </>
            )}
            {isScreenSharing && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-[#FFA8CE]">{t.video.screenShareActive}</span>
              </>
            )}
          </div>

          {/* Top-right Fullscreen Button */}
          <button
            type="button"
            onClick={toggleFullscreen}
            aria-label={isFullscreen ? t.video.exitFullscreen : t.video.fullscreen}
            className="absolute top-3 right-3 p-2.5 min-h-[40px] min-w-[40px] rounded-xl bg-black/50 backdrop-blur-md text-white hover:bg-black/70 transition-colors flex items-center justify-center"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Local Camera Picture-in-Picture */}
          {localStream && (
            <div className="absolute bottom-3 right-3 w-32 sm:w-44 aspect-video rounded-2xl overflow-hidden border-2 border-[#83BDF7]/70 bg-black shadow-lg">
              <video
                ref={localVideoRef}
                autoPlay
                muted
                playsInline
                className={`w-full h-full object-cover ${isCameraOff ? 'opacity-20' : ''}`}
              />
              <span className="absolute bottom-1 left-2 text-[10px] font-medium text-white drop-shadow">
                {t.video.youLabel}
              </span>
            </div>
          )}
        </div>

        {/* Video Call Controls Bar */}
        <div className="p-4 bg-white dark:bg-[#1B2032] border-t border-[#DCEEFF] dark:border-[#28304A] flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {!localStream ? (
              <button
                type="button"
                onClick={startLocalPreview}
                className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-2xl bg-[#DCEEFF] dark:bg-[#23324E] text-[#30364D] dark:text-[#DCEEFF] text-xs font-semibold hover:opacity-90 transition-opacity"
              >
                <Camera className="w-4 h-4" />
                <span>{t.video.previewLocal}</span>
              </button>
            ) : (
              !isInCall && (
                <button
                  type="button"
                  onClick={stopLocalPreview}
                  className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-2xl bg-[#F2F4FA] dark:bg-[#252C44] text-[#30364D] dark:text-white text-xs font-semibold hover:opacity-90 transition-opacity"
                >
                  <CameraOff className="w-4 h-4" />
                  <span>{t.video.stopPreview}</span>
                </button>
              )
            )}

            {localStream && (
              <>
                <button
                  type="button"
                  onClick={toggleCamera}
                  aria-label={isCameraOff ? t.video.camOff : t.video.camOn}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2.5 min-h-[44px] rounded-2xl text-xs font-semibold transition-colors ${
                    isCameraOff
                      ? 'bg-[#FFE0EF] dark:bg-[#472336] text-[#9E2157] dark:text-[#FFC2DD]'
                      : 'bg-[#F2F8FF] dark:bg-[#232B42] text-[#30364D] dark:text-white'
                  }`}
                >
                  {isCameraOff ? <CameraOff className="w-4 h-4" /> : <Camera className="w-4 h-4" />}
                  <span className="hidden sm:inline">
                    {isCameraOff ? t.video.camOff : t.video.camOn}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={toggleMic}
                  aria-label={isMicMuted ? t.video.micOff : t.video.micOn}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2.5 min-h-[44px] rounded-2xl text-xs font-semibold transition-colors ${
                    isMicMuted
                      ? 'bg-[#FFE0EF] dark:bg-[#472336] text-[#9E2157] dark:text-[#FFC2DD]'
                      : 'bg-[#F2F8FF] dark:bg-[#232B42] text-[#30364D] dark:text-white'
                  }`}
                >
                  {isMicMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  <span className="hidden sm:inline">
                    {isMicMuted ? t.video.micOff : t.video.micOn}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={switchCameraFacing}
                  aria-label={t.video.switchCamera}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2.5 min-h-[44px] rounded-2xl bg-[#F2F8FF] dark:bg-[#232B42] text-[#30364D] dark:text-white text-xs font-semibold hover:bg-[#DCEEFF] dark:hover:bg-[#2C3654] transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span className="hidden sm:inline">{t.video.switchCamera}</span>
                </button>
              </>
            )}
          </div>

          <div className="flex items-center gap-2 ml-auto">
            {peers.length > 1 && !isInCall && (
              <select
                value={selectedPeerId}
                onChange={(e) => setSelectedPeerId(e.target.value)}
                aria-label={t.voice.selectPeer}
                className="px-3 py-2 min-h-[44px] rounded-xl border border-[#DCEEFF] dark:border-[#2C3654] bg-[#F8F9FF] dark:bg-[#141826] text-xs text-[#30364D] dark:text-white"
              >
                {peers.map((p) => (
                  <option key={p.peerId} value={p.peerId}>
                    {p.username}
                  </option>
                ))}
              </select>
            )}

            {!isInCall ? (
              <button
                type="button"
                disabled={!activePeer}
                onClick={() => activePeer && startCall(activePeer.peerId, 'video')}
                className="inline-flex items-center gap-2 px-5 py-2.5 min-h-[44px] rounded-2xl bg-gradient-to-r from-[#83BDF7] to-[#FFA8CE] text-[#1E2438] text-xs font-bold hover:opacity-95 disabled:bg-none disabled:bg-[#DCEEFF]/60 dark:disabled:bg-[#27304A] dark:disabled:text-[#9AA5C4] disabled:cursor-not-allowed transition-opacity whitespace-nowrap"
              >
                <Video className="w-4 h-4" />
                <span>{t.video.startVideoCall}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={endCall}
                className="inline-flex items-center gap-2 px-5 py-2.5 min-h-[44px] rounded-2xl bg-[#FF7CA8] text-[#1E2438] text-xs font-bold hover:bg-[#fb699b] transition-colors whitespace-nowrap"
              >
                <PhoneOff className="w-4 h-4" />
                <span>{t.video.endCall}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Screen Sharing Controls Section */}
      <section className="bg-white dark:bg-[#1B2032] rounded-3xl border border-[#DCEEFF] dark:border-[#28304A] p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-display text-lg font-semibold text-[#30364D] dark:text-white">
              {t.video.screenShareSection}
            </h3>
            <p className="text-xs text-[#646D8A] dark:text-[#9AA5C4] mt-0.5">
              {t.video.screenShareHint}
            </p>
          </div>
          {isScreenSharing && (
            <button
              type="button"
              onClick={stopScreenShare}
              className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-2xl bg-[#FFE0EF] dark:bg-[#472336] text-[#9E2157] dark:text-[#FFC2DD] text-xs font-bold hover:opacity-90 transition-opacity"
            >
              <MonitorOff className="w-4 h-4" />
              <span>{t.video.stopSharing}</span>
            </button>
          )}
        </div>

        {!isScreenShareSupported ? (
          <p className="p-4 rounded-2xl bg-[#FFF5DC] dark:bg-[#332A18] text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
            {t.video.screenShareUnsupported}
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              {
                surface: 'monitor' as ScreenShareSurface,
                label: t.video.shareScreen,
                icon: <Monitor className="w-5 h-5" />,
                bg: 'bg-[#DCEEFF] dark:bg-[#23324E]',
              },
              {
                surface: 'window' as ScreenShareSurface,
                label: t.video.shareWindow,
                icon: <AppWindow className="w-5 h-5" />,
                bg: 'bg-[#FFE0EF] dark:bg-[#3A2338]',
              },
              {
                surface: 'browser' as ScreenShareSurface,
                label: t.video.shareTab,
                icon: <SquareTerminal className="w-5 h-5" />,
                bg: 'bg-[#E5F1FF] dark:bg-[#252E4A]',
              },
            ].map((item) => (
              <button
                key={item.surface}
                type="button"
                disabled={!activePeer && callStatus !== 'connected'}
                onClick={() => handleScreenShareSurface(item.surface)}
                className="p-4 rounded-2xl border border-[#DCEEFF] dark:border-[#2A3350] hover:border-[#83BDF7] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 text-left transition-colors min-h-[56px]"
              >
                <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center shrink-0`}>
                  {item.icon}
                </div>
                <span className="text-sm font-semibold text-[#30364D] dark:text-white">
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
