import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import Peer, { DataConnection, MediaConnection } from 'peerjs';
import {
  AppSettings,
  CallStatus,
  CallType,
  ChatMessage,
  FileTransferItem,
  IncomingCallInfo,
  Language,
  NavRoute,
  P2PWirePacket,
  PeerParticipant,
  PeerPresenceStatus,
  RecentSession,
  ReplyReference,
  ScreenShareSurface,
  ThemeMode,
  ToastItem,
  UserProfile,
} from '../types/app';
import { TRANSLATIONS, TranslationStrings } from '../i18n/translations';
import {
  categorizeFile,
  generateRoomCode,
  generateUserId,
  getGuestPeerId,
  getRoomHostPeerId,
  isValidRoomCode,
  sanitizeRoomCode,
  validateFileForTransfer,
} from '../utils/identity';
import { CHUNK_SIZE, FileReassembler, getTotalChunks } from '../utils/fileTransfer';
import {
  clearRecentSessions,
  loadActiveSessionMeta,
  loadProfile,
  loadRecentSessions,
  loadSettings,
  recordRecentSession,
  resetStoredSettings,
  saveActiveSessionMeta,
  saveProfile,
  saveSettings,
} from '../utils/storage';
import { playSoftMessageChime, startRingtoneLoop } from '../utils/sound';

interface SetorawonContextValue {
  route: NavRoute;
  navigate: (next: NavRoute) => void;
  settings: AppSettings;
  t: TranslationStrings;
  setLanguage: (lang: Language) => void;
  setTheme: (theme: ThemeMode) => void;
  updateSettings: (patch: Partial<AppSettings>) => void;
  resetSettings: () => void;
  profile: UserProfile;
  updateProfile: (patch: Partial<UserProfile>) => void;
  regenerateUserId: () => void;
  roomId: string | null;
  roomRole: 'host' | 'guest' | null;
  myPeerId: string | null;
  connectionStatus: PeerPresenceStatus;
  peers: PeerParticipant[];
  recentSessions: RecentSession[];
  clearHistory: () => void;
  createRoom: (customCode?: string) => void;
  joinRoom: (code: string) => void;
  leaveRoom: () => void;
  messages: ChatMessage[];
  sendTextMessage: (text: string, replyTo?: ReplyReference) => void;
  sendTypingState: (isTyping: boolean) => void;
  deleteLocalMessage: (messageId: string) => void;
  transfers: FileTransferItem[];
  sendFiles: (
    files: File[],
    sourceContext: 'chat' | 'file-sharing',
    targetPeerId?: string | 'all',
    caption?: string
  ) => Promise<void>;
  cancelTransfer: (transferId: string) => void;
  removeTransfer: (transferId: string) => void;
  clearCompletedTransfers: () => void;
  callStatus: CallStatus;
  activeCallType: CallType | null;
  activeCallPeerId: string | null;
  callDurationSeconds: number;
  incomingCall: IncomingCallInfo | null;
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  screenStream: MediaStream | null;
  isMicMuted: boolean;
  isCameraOff: boolean;
  cameraFacing: 'user' | 'environment';
  isScreenSharing: boolean;
  isScreenShareSupported: boolean;
  startLocalPreview: () => Promise<void>;
  stopLocalPreview: () => void;
  startCall: (targetPeerId: string, callType: CallType, surface?: ScreenShareSurface) => Promise<void>;
  acceptIncomingCall: () => Promise<void>;
  declineIncomingCall: () => void;
  endCall: () => void;
  toggleMic: () => void;
  toggleCamera: () => void;
  switchCameraFacing: () => Promise<void>;
  startScreenShare: (surface: ScreenShareSurface, targetPeerId?: string) => Promise<void>;
  stopScreenShare: () => void;
  toasts: ToastItem[];
  addToast: (type: ToastItem['type'], message: string) => void;
  dismissToast: (id: string) => void;
}

const SetorawonContext = createContext<SetorawonContextValue | null>(null);

function routeFromPathname(pathname: string): NavRoute {
  const clean = pathname.replace(/\/+$/, '').toLowerCase() || '/';
  switch (clean) {
    case '/chat':
      return NavRoute.CHAT;
    case '/voice-call':
      return NavRoute.VOICE_CALL;
    case '/video-call':
      return NavRoute.VIDEO_CALL;
    case '/file-sharing':
      return NavRoute.FILE_SHARING;
    case '/settings':
      return NavRoute.SETTINGS;
    case '/about':
      return NavRoute.ABOUT;
    default:
      return NavRoute.HOME;
  }
}

function pathnameFromRoute(route: NavRoute): string {
  return route === NavRoute.HOME ? '/' : `/${route}`;
}

function buildIceServers(): RTCIceServer[] {
  const servers: RTCIceServer[] = [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
  ];
  const turnUrl = import.meta.env.VITE_TURN_URL;
  const turnUser = import.meta.env.VITE_TURN_USERNAME;
  const turnCred = import.meta.env.VITE_TURN_CREDENTIAL;
  if (turnUrl && typeof turnUrl === 'string' && turnUrl.trim().length > 0) {
    servers.push({
      urls: turnUrl.trim(),
      username: turnUser || undefined,
      credential: turnCred || undefined,
    });
  }
  return servers;
}

function buildPeerOptions() {
  const host = import.meta.env.VITE_PEER_HOST;
  const port = import.meta.env.VITE_PEER_PORT;
  const path = import.meta.env.VITE_PEER_PATH;
  return {
    ...(host ? { host } : {}),
    ...(port ? { port: Number(port) } : {}),
    ...(path ? { path } : {}),
    secure: typeof window !== 'undefined' ? window.location.protocol === 'https:' : true,
    config: {
      iceServers: buildIceServers(),
    },
  };
}

export const SetorawonProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [route, setRoute] = useState<NavRoute>(() =>
    typeof window !== 'undefined' ? routeFromPathname(window.location.pathname) : NavRoute.HOME
  );
  const [settings, setSettings] = useState<AppSettings>(() => loadSettings());
  const [profile, setProfile] = useState<UserProfile>(() => loadProfile());
  const [recentSessions, setRecentSessions] = useState<RecentSession[]>(() => loadRecentSessions());

  const [roomId, setRoomId] = useState<string | null>(null);
  const [roomRole, setRoomRole] = useState<'host' | 'guest' | null>(null);
  const [myPeerId, setMyPeerId] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<PeerPresenceStatus>('offline');
  const [peers, setPeers] = useState<PeerParticipant[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [transfers, setTransfers] = useState<FileTransferItem[]>([]);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  // Call & Media State
  const [callStatus, setCallStatus] = useState<CallStatus>('idle');
  const [activeCallType, setActiveCallType] = useState<CallType | null>(null);
  const [activeCallPeerId, setActiveCallPeerId] = useState<string | null>(null);
  const [callDurationSeconds, setCallDurationSeconds] = useState(0);
  const [incomingCall, setIncomingCall] = useState<IncomingCallInfo | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [cameraFacing, setCameraFacing] = useState<'user' | 'environment'>('user');
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  const peerRef = useRef<Peer | null>(null);
  const connectionsRef = useRef<Map<string, DataConnection>>(new Map());
  const activeMediaConnRef = useRef<MediaConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);
  const reassemblersRef = useRef<Map<string, FileReassembler>>(new Map());
  const cancelledTransfersRef = useRef<Set<string>>(new Set());
  const seenPacketIdsRef = useRef<Set<string>>(new Set());
  const objectUrlsRef = useRef<Set<string>>(new Set());
  const ringtoneStopRef = useRef<(() => void) | null>(null);
  const activeCallIdRef = useRef<string | null>(null);
  const pendingOutboundCallRef = useRef<{
    callId: string;
    targetPeerId: string;
    callType: CallType;
    stream: MediaStream;
  } | null>(null);
  const acceptedInboundCallRef = useRef<{
    callId: string;
    stream: MediaStream | null;
    callType: CallType;
  } | null>(null);

  const settingsRef = useRef(settings);
  settingsRef.current = settings;
  const profileRef = useRef(profile);
  profileRef.current = profile;
  const roomRoleRef = useRef(roomRole);
  roomRoleRef.current = roomRole;
  const peersRef = useRef(peers);
  peersRef.current = peers;

  const t = useMemo(() => TRANSLATIONS[settings.language], [settings.language]);
  const tRef = useRef(t);
  tRef.current = t;

  const isScreenShareSupported =
    typeof navigator !== 'undefined' &&
    Boolean(navigator.mediaDevices && typeof navigator.mediaDevices.getDisplayMedia === 'function');

  // Sync Dark mode & HTML lang attribute
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', settings.theme === 'dark');
      document.documentElement.lang = settings.language;
    }
    saveSettings(settings);
  }, [settings]);

  // Sync URL navigation
  useEffect(() => {
    const onPopState = () => {
      setRoute(routeFromPathname(window.location.pathname));
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const navigate = useCallback((next: NavRoute) => {
    setRoute(next);
    if (typeof window !== 'undefined') {
      const targetPath = pathnameFromRoute(next);
      if (window.location.pathname !== targetPath) {
        window.history.pushState({}, '', targetPath);
      }
    }
  }, []);

  const addToast = useCallback((type: ToastItem['type'], message: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setToasts((prev) => [...prev.slice(-3), { id, type, message }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((item) => item.id !== id));
    }, 4200);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const setLanguage = useCallback((language: Language) => {
    setSettings((prev) => ({ ...prev, language }));
  }, []);

  const setTheme = useCallback((theme: ThemeMode) => {
    setSettings((prev) => ({ ...prev, theme }));
  }, []);

  const updateSettings = useCallback((patch: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...patch }));
  }, []);

  const resetSettings = useCallback(() => {
    const fresh = resetStoredSettings();
    setSettings(fresh);
    addToast('success', TRANSLATIONS[fresh.language].settings.resetSuccess);
  }, [addToast]);

  const triggerNotification = useCallback((title: string, body: string) => {
    if (settingsRef.current.soundNotifications) {
      playSoftMessageChime();
    }
    if (
      settingsRef.current.browserNotifications &&
      typeof Notification !== 'undefined' &&
      Notification.permission === 'granted' &&
      document.hidden
    ) {
      try {
        new Notification(title, { body });
      } catch {
        // Ignore notification failures
      }
    }
  }, []);

  const broadcastPacket = useCallback((packet: P2PWirePacket, excludePeerId?: string) => {
    connectionsRef.current.forEach((conn, pid) => {
      if (pid === excludePeerId) return;
      if (conn.open) {
        try {
          conn.send(packet);
        } catch {
          // Connection may be closing
        }
      }
    });
  }, []);

  const sendDirectPacket = useCallback((targetPeerId: string, packet: P2PWirePacket) => {
    const conn = connectionsRef.current.get(targetPeerId);
    if (conn && conn.open) {
      try {
        conn.send(packet);
        return true;
      } catch {
        return false;
      }
    }
    return false;
  }, []);

  const updateProfile = useCallback(
    (patch: Partial<UserProfile>) => {
      setProfile((prev) => {
        const next = { ...prev, ...patch };
        saveProfile(next);
        if (peerRef.current && peerRef.current.id) {
          broadcastPacket({
            type: 'presence:update',
            fromPeerId: peerRef.current.id,
            status: connectionStatus === 'in-call' ? 'in-call' : 'online',
            profile: next,
          });
        }
        return next;
      });
    },
    [broadcastPacket, connectionStatus]
  );

  const regenerateUserId = useCallback(() => {
    updateProfile({ userId: generateUserId() });
    addToast('info', tRef.current.messages.profileSaved);
  }, [addToast, updateProfile]);

  // Call duration ticker
  useEffect(() => {
    if (callStatus !== 'connected') {
      setCallDurationSeconds(0);
      return;
    }
    const start = Date.now();
    const timer = window.setInterval(() => {
      setCallDurationSeconds(Math.floor((Date.now() - start) / 1000));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [callStatus]);

  const stopRingtone = useCallback(() => {
    if (ringtoneStopRef.current) {
      ringtoneStopRef.current();
      ringtoneStopRef.current = null;
    }
  }, []);

  const cleanupMediaStreams = useCallback(() => {
    stopRingtone();
    if (activeMediaConnRef.current) {
      try {
        activeMediaConnRef.current.close();
      } catch {
        // Ignore
      }
      activeMediaConnRef.current = null;
    }
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    }
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach((track) => track.stop());
      screenStreamRef.current = null;
    }
    setLocalStream(null);
    setRemoteStream(null);
    setScreenStream(null);
    setIsMicMuted(false);
    setIsCameraOff(false);
    setIsScreenSharing(false);
    setCallStatus('idle');
    setActiveCallType(null);
    setActiveCallPeerId(null);
    setIncomingCall(null);
    activeCallIdRef.current = null;
    pendingOutboundCallRef.current = null;
    acceptedInboundCallRef.current = null;
  }, [stopRingtone]);

  const attachMediaConnection = useCallback(
    (mediaConn: MediaConnection, callType: CallType, remotePeerId: string) => {
      activeMediaConnRef.current = mediaConn;
      setActiveCallType(callType);
      setActiveCallPeerId(remotePeerId);
      setCallStatus('connected');
      setConnectionStatus('in-call');
      if (peerRef.current?.id) {
        broadcastPacket({
          type: 'presence:update',
          fromPeerId: peerRef.current.id,
          status: 'in-call',
        });
      }

      mediaConn.on('stream', (stream) => {
        setRemoteStream(stream);
      });

      mediaConn.on('close', () => {
        cleanupMediaStreams();
        setConnectionStatus(peerRef.current?.open ? 'online' : 'offline');
        if (peerRef.current?.id) {
          broadcastPacket({
            type: 'presence:update',
            fromPeerId: peerRef.current.id,
            status: 'online',
          });
        }
      });

      mediaConn.on('error', () => {
        cleanupMediaStreams();
        setConnectionStatus(peerRef.current?.open ? 'online' : 'offline');
      });
    },
    [broadcastPacket, cleanupMediaStreams]
  );

  const handleIncomingPacket = useCallback(
    (rawPacket: unknown, fromConn: DataConnection) => {
      const packet = rawPacket as P2PWirePacket;
      if (!packet || typeof packet !== 'object' || !('type' in packet)) return;
      const fromPeerId = fromConn.peer;

      switch (packet.type) {
        case 'hello': {
          const newPeer: PeerParticipant = {
            peerId: fromPeerId,
            userId: packet.profile.userId,
            username: packet.profile.username,
            avatarPreset: packet.profile.avatarPreset,
            customAvatarDataUrl: packet.profile.customAvatarDataUrl,
            status: 'online',
            isTyping: false,
            isHost: packet.isHost,
          };
          setPeers((prev) => {
            const exists = prev.some((p) => p.peerId === fromPeerId);
            const updated = exists
              ? prev.map((p) => (p.peerId === fromPeerId ? newPeer : p))
              : [...prev, newPeer];
            if (roomRoleRef.current === 'host') {
              const selfEntry: PeerParticipant = {
                peerId: peerRef.current?.id || '',
                userId: profileRef.current.userId,
                username: profileRef.current.username,
                avatarPreset: profileRef.current.avatarPreset,
                customAvatarDataUrl: profileRef.current.customAvatarDataUrl,
                status: 'online',
                isHost: true,
              };
              broadcastPacket({
                type: 'peers:sync',
                peers: [selfEntry, ...updated],
              });
            }
            return updated;
          });
          addToast('success', `${packet.profile.username} ${tRef.current.messages.peerJoined}`);
          break;
        }
        case 'peers:sync': {
          const myId = peerRef.current?.id;
          const filtered = packet.peers.filter((p) => p.peerId && p.peerId !== myId);
          setPeers(filtered);
          break;
        }
        case 'presence:update': {
          setPeers((prev) =>
            prev.map((p) =>
              p.peerId === packet.fromPeerId
                ? {
                    ...p,
                    status: packet.status,
                    ...(packet.profile
                      ? {
                          username: packet.profile.username,
                          avatarPreset: packet.profile.avatarPreset,
                          customAvatarDataUrl: packet.profile.customAvatarDataUrl,
                        }
                      : {}),
                  }
                : p
            )
          );
          if (roomRoleRef.current === 'host') {
            broadcastPacket(packet, fromPeerId);
          }
          break;
        }
        case 'chat:typing': {
          setPeers((prev) =>
            prev.map((p) => (p.peerId === packet.fromPeerId ? { ...p, isTyping: packet.isTyping } : p))
          );
          if (roomRoleRef.current === 'host') {
            broadcastPacket(packet, fromPeerId);
          }
          break;
        }
        case 'chat:message': {
          if (seenPacketIdsRef.current.has(packet.message.id)) return;
          seenPacketIdsRef.current.add(packet.message.id);

          const incoming: ChatMessage = {
            ...packet.message,
            isSelf: false,
            status: 'delivered',
          };
          setMessages((prev) => [...prev, incoming]);
          setPeers((prev) =>
            prev.map((p) => (p.peerId === packet.message.senderPeerId ? { ...p, isTyping: false } : p))
          );

          // Acknowledge receipt
          sendDirectPacket(fromPeerId, {
            type: 'chat:ack',
            messageId: packet.message.id,
            fromPeerId: peerRef.current?.id || '',
          });

          if (roomRoleRef.current === 'host') {
            broadcastPacket(packet, fromPeerId);
          }

          triggerNotification(
            `${tRef.current.messages.newMessageFrom} ${packet.message.senderName}`,
            packet.message.text || 'Attachment'
          );
          break;
        }
        case 'chat:ack': {
          setMessages((prev) =>
            prev.map((m) => (m.id === packet.messageId ? { ...m, status: 'delivered' } : m))
          );
          break;
        }
        case 'file:meta': {
          if (seenPacketIdsRef.current.has(`meta-${packet.transferId}`)) return;
          seenPacketIdsRef.current.add(`meta-${packet.transferId}`);

          const check = validateFileForTransfer(
            { name: packet.fileName, size: packet.fileSize, type: packet.mimeType },
            settingsRef.current.maxFileSizeMb
          );
          if (!check.valid) {
            sendDirectPacket(fromPeerId, {
              type: 'file:cancel',
              transferId: packet.transferId,
              fromPeerId: peerRef.current?.id || '',
            });
            return;
          }

          const reassembler = new FileReassembler({
            transferId: packet.transferId,
            fileName: packet.fileName,
            mimeType: packet.mimeType,
            totalBytes: packet.fileSize,
            totalChunks: packet.totalChunks,
          });
          reassemblersRef.current.set(packet.transferId, reassembler);

          const category = categorizeFile(packet.mimeType, packet.fileName);
          const item: FileTransferItem = {
            transferId: packet.transferId,
            direction: 'incoming',
            peerId: packet.fromPeerId,
            peerName: packet.fromName,
            fileName: packet.fileName,
            fileSize: packet.fileSize,
            mimeType: packet.mimeType,
            category,
            progress: 0,
            transferredBytes: 0,
            status: 'transferring',
            createdAt: Date.now(),
            sourceContext: packet.sourceContext,
          };
          setTransfers((prev) => [item, ...prev]);

          if (packet.sourceContext === 'chat' && packet.chatMessageId) {
            const senderPeer = peersRef.current.find((p) => p.peerId === packet.fromPeerId);
            const chatMsg: ChatMessage = {
              id: packet.chatMessageId,
              senderPeerId: packet.fromPeerId,
              senderUserId: senderPeer?.userId || '',
              senderName: packet.fromName,
              senderAvatarPreset: senderPeer?.avatarPreset || 'cloud',
              senderCustomAvatar: senderPeer?.customAvatarDataUrl || null,
              isSelf: false,
              text: packet.caption || '',
              timestamp: Date.now(),
              status: 'delivered',
              attachment: {
                transferId: packet.transferId,
                fileName: packet.fileName,
                fileSize: packet.fileSize,
                mimeType: packet.mimeType,
                category,
                progress: 0,
                status: 'transferring',
              },
            };
            setMessages((prev) => [...prev, chatMsg]);
          }

          if (roomRoleRef.current === 'host') {
            broadcastPacket(packet, fromPeerId);
          }
          break;
        }
        case 'file:chunk': {
          const reassembler = reassemblersRef.current.get(packet.transferId);
          if (reassembler) {
            const res = reassembler.addChunk(packet.chunkIndex, packet.data);
            setTransfers((prev) =>
              prev.map((item) =>
                item.transferId === packet.transferId
                  ? {
                      ...item,
                      progress: res.progress,
                      transferredBytes: res.transferredBytes,
                    }
                  : item
              )
            );
            setMessages((prev) =>
              prev.map((msg) =>
                msg.attachment?.transferId === packet.transferId
                  ? {
                      ...msg,
                      attachment: { ...msg.attachment, progress: res.progress },
                    }
                  : msg
              )
            );
          }
          if (roomRoleRef.current === 'host') {
            broadcastPacket(packet, fromPeerId);
          }
          break;
        }
        case 'file:complete': {
          const reassembler = reassemblersRef.current.get(packet.transferId);
          if (reassembler && reassembler.isComplete()) {
            const blob = reassembler.buildBlob();
            const url = URL.createObjectURL(blob);
            objectUrlsRef.current.add(url);
            reassemblersRef.current.delete(packet.transferId);

            setTransfers((prev) =>
              prev.map((item) =>
                item.transferId === packet.transferId
                  ? {
                      ...item,
                      progress: 100,
                      transferredBytes: item.fileSize,
                      status: 'completed',
                      objectUrl: url,
                    }
                  : item
              )
            );
            setMessages((prev) =>
              prev.map((msg) =>
                msg.attachment?.transferId === packet.transferId
                  ? {
                      ...msg,
                      attachment: {
                        ...msg.attachment,
                        progress: 100,
                        status: 'completed',
                        objectUrl: url,
                      },
                    }
                  : msg
              )
            );
            triggerNotification(
              `${tRef.current.messages.incomingFileFrom} ${reassembler.fileName}`,
              reassembler.fileName
            );
          }
          if (roomRoleRef.current === 'host') {
            broadcastPacket(packet, fromPeerId);
          }
          break;
        }
        case 'file:cancel': {
          cancelledTransfersRef.current.add(packet.transferId);
          const reassembler = reassemblersRef.current.get(packet.transferId);
          if (reassembler) {
            reassembler.cancel();
            reassemblersRef.current.delete(packet.transferId);
          }
          setTransfers((prev) =>
            prev.map((item) =>
              item.transferId === packet.transferId ? { ...item, status: 'cancelled' } : item
            )
          );
          setMessages((prev) =>
            prev.map((msg) =>
              msg.attachment?.transferId === packet.transferId
                ? { ...msg, attachment: { ...msg.attachment, status: 'cancelled' } }
                : msg
            )
          );
          break;
        }
        case 'call:invite': {
          if (activeCallIdRef.current) {
            sendDirectPacket(fromPeerId, {
              type: 'call:reject',
              callId: packet.callId,
              fromPeerId: peerRef.current?.id || '',
              reason: 'busy',
            });
            return;
          }
          activeCallIdRef.current = packet.callId;
          setIncomingCall({
            callId: packet.callId,
            fromPeerId: packet.fromPeerId,
            fromName: packet.profile.username,
            fromUserId: packet.profile.userId,
            fromAvatarPreset: packet.profile.avatarPreset,
            fromCustomAvatar: packet.profile.customAvatarDataUrl,
            callType: packet.callType,
          });
          setCallStatus('ringing');
          if (settingsRef.current.soundNotifications) {
            stopRingtone();
            ringtoneStopRef.current = startRingtoneLoop();
          }
          break;
        }
        case 'call:accept': {
          const pending = pendingOutboundCallRef.current;
          if (!pending || pending.callId !== packet.callId || !peerRef.current) return;
          const mediaConn = peerRef.current.call(pending.targetPeerId, pending.stream, {
            metadata: {
              callId: pending.callId,
              callType: pending.callType,
            },
          });
          attachMediaConnection(mediaConn, pending.callType, pending.targetPeerId);
          pendingOutboundCallRef.current = null;
          break;
        }
        case 'call:reject': {
          if (activeCallIdRef.current === packet.callId) {
            cleanupMediaStreams();
            addToast('warning', tRef.current.messages.callRejected);
          }
          break;
        }
        case 'call:hangup': {
          if (activeCallIdRef.current === packet.callId) {
            cleanupMediaStreams();
            setConnectionStatus(peerRef.current?.open ? 'online' : 'offline');
            addToast('info', tRef.current.messages.callEnded);
          }
          break;
        }
      }
    },
    [
      addToast,
      attachMediaConnection,
      broadcastPacket,
      cleanupMediaStreams,
      sendDirectPacket,
      stopRingtone,
      triggerNotification,
    ]
  );

  const registerDataConnection = useCallback(
    (conn: DataConnection, isHostSide: boolean) => {
      conn.on('open', () => {
        connectionsRef.current.set(conn.peer, conn);
        conn.send({
          type: 'hello',
          profile: profileRef.current,
          isHost: isHostSide,
        } satisfies P2PWirePacket);
      });

      conn.on('data', (data) => {
        handleIncomingPacket(data, conn);
      });

      conn.on('close', () => {
        const leaving = peersRef.current.find((p) => p.peerId === conn.peer);
        connectionsRef.current.delete(conn.peer);
        setPeers((prev) => {
          const updated = prev.filter((p) => p.peerId !== conn.peer);
          if (roomRoleRef.current === 'host') {
            const selfEntry: PeerParticipant = {
              peerId: peerRef.current?.id || '',
              userId: profileRef.current.userId,
              username: profileRef.current.username,
              avatarPreset: profileRef.current.avatarPreset,
              customAvatarDataUrl: profileRef.current.customAvatarDataUrl,
              status: 'online',
              isHost: true,
            };
            broadcastPacket({
              type: 'peers:sync',
              peers: [selfEntry, ...updated],
            });
          }
          return updated;
        });
        if (leaving) {
          addToast('info', `${leaving.username} ${tRef.current.messages.peerLeft}`);
        }
        if (activeCallPeerId === conn.peer) {
          cleanupMediaStreams();
        }
      });

      conn.on('error', () => {
        connectionsRef.current.delete(conn.peer);
      });
    },
    [activeCallPeerId, addToast, broadcastPacket, cleanupMediaStreams, handleIncomingPacket]
  );

  const tearDownPeer = useCallback(() => {
    cleanupMediaStreams();
    connectionsRef.current.forEach((conn) => {
      try {
        conn.close();
      } catch {
        // Ignore
      }
    });
    connectionsRef.current.clear();
    if (peerRef.current) {
      try {
        peerRef.current.destroy();
      } catch {
        // Ignore
      }
      peerRef.current = null;
    }
    setPeers([]);
    setMyPeerId(null);
    setConnectionStatus('offline');
  }, [cleanupMediaStreams]);

  const leaveRoom = useCallback(() => {
    tearDownPeer();
    setRoomId(null);
    setRoomRole(null);
    saveActiveSessionMeta(null);
    addToast('info', tRef.current.messages.roomLeft);
  }, [addToast, tearDownPeer]);

  const initializeRoomPeer = useCallback(
    (code: string, role: 'host' | 'guest') => {
      const cleaned = sanitizeRoomCode(code);
      if (!isValidRoomCode(cleaned)) {
        addToast('error', tRef.current.messages.invalidRoomCode);
        return;
      }

      tearDownPeer();
      setRoomId(cleaned);
      setRoomRole(role);
      setConnectionStatus('connecting');
      saveActiveSessionMeta({ roomId: cleaned, role });

      const peerId = role === 'host' ? getRoomHostPeerId(cleaned) : getGuestPeerId(profileRef.current.userId);
      const peer = new Peer(peerId, buildPeerOptions());
      peerRef.current = peer;

      peer.on('open', (assignedId) => {
        setMyPeerId(assignedId);
        setConnectionStatus('online');
        const updatedRecent = recordRecentSession({
          roomId: cleaned,
          role,
          joinedAt: Date.now(),
          lastPeerCount: 0,
        });
        setRecentSessions(updatedRecent);

        if (role === 'host') {
          addToast('success', tRef.current.messages.roomCreated);
        } else {
          const hostPeerId = getRoomHostPeerId(cleaned);
          const conn = peer.connect(hostPeerId, {
            reliable: true,
            metadata: { profile: profileRef.current },
          });
          registerDataConnection(conn, false);
          addToast('success', tRef.current.messages.roomJoined);
        }
      });

      peer.on('connection', (incomingConn) => {
        registerDataConnection(incomingConn, role === 'host');
      });

      peer.on('call', (mediaConn) => {
        const meta = (mediaConn.metadata || {}) as { callId?: string; callType?: CallType };
        const accepted = acceptedInboundCallRef.current;
        if (accepted && (!meta.callId || accepted.callId === meta.callId)) {
          mediaConn.answer(accepted.stream || undefined);
          attachMediaConnection(mediaConn, accepted.callType, mediaConn.peer);
          acceptedInboundCallRef.current = null;
        } else {
          mediaConn.close();
        }
      });

      peer.on('error', (err) => {
        const errType = (err as { type?: string }).type;
        if (errType === 'unavailable-id') {
          addToast('error', tRef.current.messages.roomIdTaken);
          tearDownPeer();
          setRoomId(null);
          setRoomRole(null);
          saveActiveSessionMeta(null);
        } else if (errType === 'peer-unavailable') {
          addToast('error', tRef.current.messages.roomNotFound);
          setConnectionStatus('online');
        } else {
          addToast('error', tRef.current.messages.peerError);
          setConnectionStatus('offline');
        }
      });
    },
    [addToast, attachMediaConnection, registerDataConnection, tearDownPeer]
  );

  const createRoom = useCallback(
    (customCode?: string) => {
      const code = customCode && customCode.trim().length > 0 ? sanitizeRoomCode(customCode) : generateRoomCode();
      initializeRoomPeer(code, 'host');
    },
    [initializeRoomPeer]
  );

  const joinRoom = useCallback(
    (code: string) => {
      initializeRoomPeer(code, 'guest');
    },
    [initializeRoomPeer]
  );

  // Auto-handle ?room=XYZ query param or active session meta
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const urlRoom = params.get('room');
    if (urlRoom && isValidRoomCode(urlRoom)) {
      initializeRoomPeer(urlRoom, 'guest');
      window.history.replaceState({}, '', window.location.pathname);
      return;
    }
    const existing = loadActiveSessionMeta();
    if (existing) {
      initializeRoomPeer(existing.roomId, existing.role);
    }
    return () => {
      tearDownPeer();
      objectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
      objectUrlsRef.current.clear();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const clearHistory = useCallback(() => {
    setRecentSessions(clearRecentSessions());
    addToast('info', tRef.current.messages.localDataCleared);
  }, [addToast]);

  const sendTextMessage = useCallback(
    (text: string, replyTo?: ReplyReference) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      const msgId = `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      const myId = peerRef.current?.id || 'local';
      const hasPeers = connectionsRef.current.size > 0;

      const localMsg: ChatMessage = {
        id: msgId,
        senderPeerId: myId,
        senderUserId: profile.userId,
        senderName: profile.username,
        senderAvatarPreset: profile.avatarPreset,
        senderCustomAvatar: profile.customAvatarDataUrl,
        isSelf: true,
        text: trimmed,
        timestamp: Date.now(),
        status: hasPeers ? 'sent' : 'sending',
        replyTo,
      };

      setMessages((prev) => [...prev, localMsg]);
      seenPacketIdsRef.current.add(msgId);

      if (hasPeers) {
        const { isSelf: _s, status: _st, ...wireMsg } = localMsg;
        broadcastPacket({
          type: 'chat:message',
          message: wireMsg,
        });
      }
    },
    [broadcastPacket, profile]
  );

  const sendTypingState = useCallback(
    (isTyping: boolean) => {
      if (settingsRef.current.hideTypingIndicator || !peerRef.current?.id) return;
      broadcastPacket({
        type: 'chat:typing',
        fromPeerId: peerRef.current.id,
        isTyping,
      });
    },
    [broadcastPacket]
  );

  const deleteLocalMessage = useCallback((messageId: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== messageId));
  }, []);

  const sendFiles = useCallback(
    async (
      files: File[],
      sourceContext: 'chat' | 'file-sharing',
      targetPeerId: string | 'all' = 'all',
      caption?: string
    ) => {
      if (files.length === 0) return;

      for (const file of files) {
        const check = validateFileForTransfer(file, settingsRef.current.maxFileSizeMb);
        if (!check.valid) {
          if (check.reason === 'empty') addToast('error', tRef.current.messages.fileEmpty);
          if (check.reason === 'too_large') addToast('error', tRef.current.messages.fileTooLarge);
          if (check.reason === 'unsafe_type') addToast('error', tRef.current.messages.fileUnsafe);
          continue;
        }

        const transferId = `tx-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
        const category = categorizeFile(file.type, file.name);
        const previewUrl = URL.createObjectURL(file);
        objectUrlsRef.current.add(previewUrl);

        const totalChunks = getTotalChunks(file.size, CHUNK_SIZE);
        const myId = peerRef.current?.id || 'local';
        const hasPeers = connectionsRef.current.size > 0;

        const targetName =
          targetPeerId === 'all'
            ? tRef.current.files.sendToAll
            : peersRef.current.find((p) => p.peerId === targetPeerId)?.username || 'Peer';

        const transferItem: FileTransferItem = {
          transferId,
          direction: 'outgoing',
          peerId: targetPeerId,
          peerName: targetName,
          fileName: file.name,
          fileSize: file.size,
          mimeType: file.type || 'application/octet-stream',
          category,
          progress: hasPeers ? 0 : 100,
          transferredBytes: hasPeers ? 0 : file.size,
          status: hasPeers ? 'transferring' : 'completed',
          objectUrl: previewUrl,
          createdAt: Date.now(),
          sourceContext,
        };
        setTransfers((prev) => [transferItem, ...prev]);

        const chatMessageId =
          sourceContext === 'chat'
            ? `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
            : undefined;

        if (sourceContext === 'chat' && chatMessageId) {
          const msg: ChatMessage = {
            id: chatMessageId,
            senderPeerId: myId,
            senderUserId: profileRef.current.userId,
            senderName: profileRef.current.username,
            senderAvatarPreset: profileRef.current.avatarPreset,
            senderCustomAvatar: profileRef.current.customAvatarDataUrl,
            isSelf: true,
            text: caption || '',
            timestamp: Date.now(),
            status: hasPeers ? 'sent' : 'sending',
            attachment: {
              transferId,
              fileName: file.name,
              fileSize: file.size,
              mimeType: file.type || 'application/octet-stream',
              category,
              objectUrl: previewUrl,
              progress: hasPeers ? 0 : 100,
              status: hasPeers ? 'transferring' : 'completed',
            },
          };
          setMessages((prev) => [...prev, msg]);
        }

        if (!hasPeers) {
          addToast('warning', tRef.current.messages.noPeerConnected);
          continue;
        }

        const metaPacket: P2PWirePacket = {
          type: 'file:meta',
          transferId,
          fromPeerId: myId,
          fromName: profileRef.current.username,
          fileName: file.name,
          fileSize: file.size,
          mimeType: file.type || 'application/octet-stream',
          totalChunks,
          sourceContext,
          chatMessageId,
          caption,
        };

        if (targetPeerId === 'all') {
          broadcastPacket(metaPacket);
        } else {
          sendDirectPacket(targetPeerId, metaPacket);
        }

        // Stream chunks cleanly without holding the full file buffer in memory
        for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex += 1) {
          if (cancelledTransfersRef.current.has(transferId)) {
            break;
          }
          const start = chunkIndex * CHUNK_SIZE;
          const end = Math.min(file.size, start + CHUNK_SIZE);
          const buffer = await file.slice(start, end).arrayBuffer();

          const chunkPacket: P2PWirePacket = {
            type: 'file:chunk',
            transferId,
            fromPeerId: myId,
            chunkIndex,
            data: buffer,
          };

          if (targetPeerId === 'all') {
            broadcastPacket(chunkPacket);
          } else {
            sendDirectPacket(targetPeerId, chunkPacket);
          }

          const progress = Math.min(100, Math.round(((chunkIndex + 1) / totalChunks) * 100));
          setTransfers((prev) =>
            prev.map((item) =>
              item.transferId === transferId
                ? { ...item, progress, transferredBytes: end }
                : item
            )
          );
          if (sourceContext === 'chat') {
            setMessages((prev) =>
              prev.map((m) =>
                m.attachment?.transferId === transferId
                  ? { ...m, attachment: { ...m.attachment, progress } }
                  : m
              )
            );
          }

          // Yield micro-frame periodically to keep UI smooth & avoid DataChannel congestion
          if (chunkIndex % 4 === 3) {
            await new Promise((r) => window.setTimeout(r, 8));
          }
        }

        if (!cancelledTransfersRef.current.has(transferId)) {
          const completePacket: P2PWirePacket = {
            type: 'file:complete',
            transferId,
            fromPeerId: myId,
          };
          if (targetPeerId === 'all') {
            broadcastPacket(completePacket);
          } else {
            sendDirectPacket(targetPeerId, completePacket);
          }
          setTransfers((prev) =>
            prev.map((item) =>
              item.transferId === transferId
                ? { ...item, progress: 100, transferredBytes: file.size, status: 'completed' }
                : item
            )
          );
          if (sourceContext === 'chat') {
            setMessages((prev) =>
              prev.map((m) =>
                m.attachment?.transferId === transferId
                  ? {
                      ...m,
                      status: 'delivered',
                      attachment: { ...m.attachment, progress: 100, status: 'completed' },
                    }
                  : m
              )
            );
          }
        }
      }
    },
    [addToast, broadcastPacket, sendDirectPacket]
  );

  const cancelTransfer = useCallback(
    (transferId: string) => {
      cancelledTransfersRef.current.add(transferId);
      const reassembler = reassemblersRef.current.get(transferId);
      if (reassembler) {
        reassembler.cancel();
        reassemblersRef.current.delete(transferId);
      }
      broadcastPacket({
        type: 'file:cancel',
        transferId,
        fromPeerId: peerRef.current?.id || '',
      });
      setTransfers((prev) =>
        prev.map((item) => (item.transferId === transferId ? { ...item, status: 'cancelled' } : item))
      );
      setMessages((prev) =>
        prev.map((msg) =>
          msg.attachment?.transferId === transferId
            ? { ...msg, attachment: { ...msg.attachment, status: 'cancelled' } }
            : msg
        )
      );
    },
    [broadcastPacket]
  );

  const removeTransfer = useCallback((transferId: string) => {
    setTransfers((prev) => prev.filter((item) => item.transferId !== transferId));
  }, []);

  const clearCompletedTransfers = useCallback(() => {
    setTransfers((prev) =>
      prev.filter((item) => item.status === 'queued' || item.status === 'transferring')
    );
  }, []);

  const acquireUserMedia = useCallback(
    async (withVideo: boolean, facing: 'user' | 'environment' = 'user'): Promise<MediaStream | null> => {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          addToast('error', tRef.current.messages.mediaPermissionDenied);
          return null;
        }
        const audioConstraint: MediaTrackConstraints | boolean = settingsRef.current.selectedMicId
          ? { deviceId: { exact: settingsRef.current.selectedMicId } }
          : true;
        const videoConstraint: MediaTrackConstraints | boolean = withVideo
          ? settingsRef.current.selectedCamId
            ? { deviceId: { exact: settingsRef.current.selectedCamId } }
            : { facingMode: facing }
          : false;

        const stream = await navigator.mediaDevices.getUserMedia({
          audio: audioConstraint,
          video: videoConstraint,
        });
        return stream;
      } catch {
        // Retry with simpler constraints if exact device/facing failed
        try {
          const fallback = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: withVideo,
          });
          return fallback;
        } catch {
          addToast('error', tRef.current.messages.mediaPermissionDenied);
          return null;
        }
      }
    },
    [addToast]
  );

  const startLocalPreview = useCallback(async () => {
    if (localStreamRef.current) return;
    const stream = await acquireUserMedia(true, cameraFacing);
    if (!stream) return;
    localStreamRef.current = stream;
    setLocalStream(stream);
    setIsMicMuted(false);
    setIsCameraOff(false);
  }, [acquireUserMedia, cameraFacing]);

  const stopLocalPreview = useCallback(() => {
    if (callStatus === 'connected' || callStatus === 'calling') return;
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((tr) => tr.stop());
      localStreamRef.current = null;
    }
    setLocalStream(null);
  }, [callStatus]);

  const startCall = useCallback(
    async (targetPeerId: string, callType: CallType, surface: ScreenShareSurface = 'monitor') => {
      if (!peerRef.current || !connectionsRef.current.has(targetPeerId)) {
        addToast('error', tRef.current.messages.noPeerConnected);
        return;
      }

      let stream: MediaStream | null = null;
      if (callType === 'screen') {
        if (!isScreenShareSupported) {
          addToast('error', tRef.current.video.screenShareUnsupported);
          return;
        }
        try {
          const displayStream = await navigator.mediaDevices.getDisplayMedia({
            video: { displaySurface: surface } as MediaTrackConstraints,
            audio: true,
          });
          screenStreamRef.current = displayStream;
          setScreenStream(displayStream);
          setIsScreenSharing(true);
          stream = displayStream;
        } catch {
          addToast('error', tRef.current.messages.screenShareDenied);
          return;
        }
      } else {
        stream = await acquireUserMedia(callType === 'video', cameraFacing);
        if (!stream) return;
        if (localStreamRef.current) {
          localStreamRef.current.getTracks().forEach((tr) => tr.stop());
        }
        localStreamRef.current = stream;
        setLocalStream(stream);
      }

      const callId = `call-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      activeCallIdRef.current = callId;
      pendingOutboundCallRef.current = { callId, targetPeerId, callType, stream };
      setActiveCallPeerId(targetPeerId);
      setActiveCallType(callType);
      setCallStatus('calling');

      sendDirectPacket(targetPeerId, {
        type: 'call:invite',
        callId,
        fromPeerId: peerRef.current.id,
        profile: profileRef.current,
        callType,
      });
    },
    [acquireUserMedia, addToast, cameraFacing, isScreenShareSupported, sendDirectPacket]
  );

  const acceptIncomingCall = useCallback(async () => {
    const info = incomingCall;
    if (!info || !peerRef.current) return;
    stopRingtone();

    let answerStream: MediaStream | null = null;
    if (info.callType === 'voice') {
      answerStream = await acquireUserMedia(false);
    } else if (info.callType === 'video') {
      answerStream = await acquireUserMedia(true, cameraFacing);
    } else {
      // Screen share receive-only: try optional audio or empty MediaStream
      answerStream = new MediaStream();
    }

    if (info.callType !== 'screen' && !answerStream) {
      sendDirectPacket(info.fromPeerId, {
        type: 'call:reject',
        callId: info.callId,
        fromPeerId: peerRef.current.id,
      });
      cleanupMediaStreams();
      return;
    }

    if (answerStream && info.callType !== 'screen') {
      localStreamRef.current = answerStream;
      setLocalStream(answerStream);
    }

    acceptedInboundCallRef.current = {
      callId: info.callId,
      stream: answerStream,
      callType: info.callType,
    };

    setIncomingCall(null);
    setActiveCallPeerId(info.fromPeerId);
    setActiveCallType(info.callType);
    setCallStatus('calling');

    sendDirectPacket(info.fromPeerId, {
      type: 'call:accept',
      callId: info.callId,
      fromPeerId: peerRef.current.id,
    });

    if (info.callType === 'voice') {
      navigate(NavRoute.VOICE_CALL);
    } else {
      navigate(NavRoute.VIDEO_CALL);
    }
  }, [
    acquireUserMedia,
    cameraFacing,
    cleanupMediaStreams,
    incomingCall,
    navigate,
    sendDirectPacket,
    stopRingtone,
  ]);

  const declineIncomingCall = useCallback(() => {
    if (!incomingCall) return;
    sendDirectPacket(incomingCall.fromPeerId, {
      type: 'call:reject',
      callId: incomingCall.callId,
      fromPeerId: peerRef.current?.id || '',
    });
    cleanupMediaStreams();
  }, [cleanupMediaStreams, incomingCall, sendDirectPacket]);

  const endCall = useCallback(() => {
    if (activeCallPeerId && activeCallIdRef.current) {
      sendDirectPacket(activeCallPeerId, {
        type: 'call:hangup',
        callId: activeCallIdRef.current,
        fromPeerId: peerRef.current?.id || '',
      });
    }
    cleanupMediaStreams();
    setConnectionStatus(peerRef.current?.open ? 'online' : 'offline');
    if (peerRef.current?.id) {
      broadcastPacket({
        type: 'presence:update',
        fromPeerId: peerRef.current.id,
        status: 'online',
      });
    }
  }, [activeCallPeerId, broadcastPacket, cleanupMediaStreams, sendDirectPacket]);

  const toggleMic = useCallback(() => {
    const stream = localStreamRef.current;
    if (!stream) return;
    const nextMuted = !isMicMuted;
    stream.getAudioTracks().forEach((track) => {
      track.enabled = !nextMuted;
    });
    setIsMicMuted(nextMuted);
  }, [isMicMuted]);

  const toggleCamera = useCallback(() => {
    const stream = localStreamRef.current;
    if (!stream) return;
    const nextOff = !isCameraOff;
    stream.getVideoTracks().forEach((track) => {
      track.enabled = !nextOff;
    });
    setIsCameraOff(nextOff);
  }, [isCameraOff]);

  const switchCameraFacing = useCallback(async () => {
    const nextFacing = cameraFacing === 'user' ? 'environment' : 'user';
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      addToast('error', tRef.current.messages.cameraSwitchFailed);
      return;
    }
    try {
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: nextFacing } },
        audio: false,
      });
      const newVideoTrack = newStream.getVideoTracks()[0];
      if (!newVideoTrack) {
        addToast('error', tRef.current.messages.cameraSwitchFailed);
        return;
      }
      if (localStreamRef.current) {
        const oldTracks = localStreamRef.current.getVideoTracks();
        oldTracks.forEach((tr) => {
          localStreamRef.current?.removeTrack(tr);
          tr.stop();
        });
        localStreamRef.current.addTrack(newVideoTrack);
        setLocalStream(new MediaStream(localStreamRef.current.getTracks()));
      }
      if (activeMediaConnRef.current?.peerConnection) {
        const videoSender = activeMediaConnRef.current.peerConnection
          .getSenders()
          .find((s) => s.track?.kind === 'video');
        if (videoSender) {
          await videoSender.replaceTrack(newVideoTrack);
        }
      }
      setCameraFacing(nextFacing);
    } catch {
      addToast('error', tRef.current.messages.cameraSwitchFailed);
    }
  }, [addToast, cameraFacing]);

  const stopScreenShare = useCallback(() => {
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach((tr) => tr.stop());
      screenStreamRef.current = null;
    }
    setScreenStream(null);
    setIsScreenSharing(false);
    // Restore camera track if we were in a video call
    if (activeMediaConnRef.current?.peerConnection && localStreamRef.current) {
      const camTrack = localStreamRef.current.getVideoTracks()[0];
      const videoSender = activeMediaConnRef.current.peerConnection
        .getSenders()
        .find((s) => s.track?.kind === 'video');
      if (camTrack && videoSender) {
        videoSender.replaceTrack(camTrack).catch(() => {});
      }
    } else if (activeCallType === 'screen') {
      endCall();
    }
  }, [activeCallType, endCall]);

  const startScreenShare = useCallback(
    async (surface: ScreenShareSurface, targetPeerId?: string) => {
      if (!isScreenShareSupported) {
        addToast('error', tRef.current.video.screenShareUnsupported);
        return;
      }
      // If not already in an active call and a targetPeerId is provided, initiate a screen-share call
      if (callStatus !== 'connected' && targetPeerId) {
        await startCall(targetPeerId, 'screen', surface);
        return;
      }
      try {
        const displayStream = await navigator.mediaDevices.getDisplayMedia({
          video: { displaySurface: surface } as MediaTrackConstraints,
          audio: true,
        });
        const videoTrack = displayStream.getVideoTracks()[0];
        if (videoTrack) {
          videoTrack.onended = () => {
            stopScreenShare();
          };
        }
        if (screenStreamRef.current) {
          screenStreamRef.current.getTracks().forEach((tr) => tr.stop());
        }
        screenStreamRef.current = displayStream;
        setScreenStream(displayStream);
        setIsScreenSharing(true);

        if (activeMediaConnRef.current?.peerConnection && videoTrack) {
          const videoSender = activeMediaConnRef.current.peerConnection
            .getSenders()
            .find((s) => s.track?.kind === 'video');
          if (videoSender) {
            await videoSender.replaceTrack(videoTrack);
          }
        }
      } catch {
        addToast('error', tRef.current.messages.screenShareDenied);
      }
    },
    [addToast, callStatus, isScreenShareSupported, startCall, stopScreenShare]
  );

  const value: SetorawonContextValue = {
    route,
    navigate,
    settings,
    t,
    setLanguage,
    setTheme,
    updateSettings,
    resetSettings,
    profile,
    updateProfile,
    regenerateUserId,
    roomId,
    roomRole,
    myPeerId,
    connectionStatus,
    peers,
    recentSessions,
    clearHistory,
    createRoom,
    joinRoom,
    leaveRoom,
    messages,
    sendTextMessage,
    sendTypingState,
    deleteLocalMessage,
    transfers,
    sendFiles,
    cancelTransfer,
    removeTransfer,
    clearCompletedTransfers,
    callStatus,
    activeCallType,
    activeCallPeerId,
    callDurationSeconds,
    incomingCall,
    localStream,
    remoteStream,
    screenStream,
    isMicMuted,
    isCameraOff,
    cameraFacing,
    isScreenSharing,
    isScreenShareSupported,
    startLocalPreview,
    stopLocalPreview,
    startCall,
    acceptIncomingCall,
    declineIncomingCall,
    endCall,
    toggleMic,
    toggleCamera,
    switchCameraFacing,
    startScreenShare,
    stopScreenShare,
    toasts,
    addToast,
    dismissToast,
  };

  return <SetorawonContext.Provider value={value}>{children}</SetorawonContext.Provider>;
};

export function useSetorawon(): SetorawonContextValue {
  const ctx = useContext(SetorawonContext);
  if (!ctx) {
    throw new Error('useSetorawon must be used within SetorawonProvider');
  }
  return ctx;
}
