export enum NavRoute {
  HOME = 'home',
  CHAT = 'chat',
  VOICE_CALL = 'voice-call',
  VIDEO_CALL = 'video-call',
  FILE_SHARING = 'file-sharing',
  SETTINGS = 'settings',
  ABOUT = 'about',
}

export type Language = 'id' | 'en';
export type ThemeMode = 'light' | 'dark';

export type PeerPresenceStatus = 'offline' | 'connecting' | 'online' | 'in-call';

export interface UserProfile {
  userId: string;
  username: string;
  avatarPreset: string;
  customAvatarDataUrl: string | null;
}

export interface AppSettings {
  language: Language;
  theme: ThemeMode;
  selectedMicId: string;
  selectedCamId: string;
  soundNotifications: boolean;
  browserNotifications: boolean;
  maxFileSizeMb: number;
  autoAcceptFiles: boolean;
  hideTypingIndicator: boolean;
}

export interface RecentSession {
  roomId: string;
  role: 'host' | 'guest';
  joinedAt: number;
  lastPeerCount: number;
}

export interface PeerParticipant {
  peerId: string;
  userId: string;
  username: string;
  avatarPreset: string;
  customAvatarDataUrl: string | null;
  status: PeerPresenceStatus;
  isTyping?: boolean;
  isHost?: boolean;
}

export interface ReplyReference {
  messageId: string;
  senderName: string;
  text: string;
  attachmentName?: string;
}

export interface ChatAttachment {
  transferId: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  category: FileCategory;
  objectUrl?: string;
  progress: number;
  status: 'pending' | 'transferring' | 'completed' | 'cancelled' | 'error';
}

export interface ChatMessage {
  id: string;
  senderPeerId: string;
  senderUserId: string;
  senderName: string;
  senderAvatarPreset: string;
  senderCustomAvatar?: string | null;
  isSelf: boolean;
  text: string;
  timestamp: number;
  status: 'sending' | 'sent' | 'delivered';
  replyTo?: ReplyReference;
  attachment?: ChatAttachment;
}

export type FileCategory = 'image' | 'video' | 'audio' | 'document' | 'archive' | 'other';

export interface FileTransferItem {
  transferId: string;
  direction: 'outgoing' | 'incoming';
  peerId: string;
  peerName: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  category: FileCategory;
  progress: number;
  transferredBytes: number;
  status: 'queued' | 'transferring' | 'completed' | 'cancelled' | 'error';
  objectUrl?: string;
  createdAt: number;
  errorMessage?: string;
  sourceContext: 'chat' | 'file-sharing';
}

export type CallType = 'voice' | 'video' | 'screen';
export type CallStatus = 'idle' | 'calling' | 'ringing' | 'connected' | 'ended' | 'error';
export type ScreenShareSurface = 'monitor' | 'window' | 'browser';

export interface IncomingCallInfo {
  callId: string;
  fromPeerId: string;
  fromName: string;
  fromUserId: string;
  fromAvatarPreset: string;
  fromCustomAvatar: string | null;
  callType: CallType;
}

export interface ToastItem {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
}

export type P2PWirePacket =
  | {
      type: 'hello';
      profile: UserProfile;
      isHost: boolean;
    }
  | {
      type: 'peers:sync';
      peers: PeerParticipant[];
    }
  | {
      type: 'chat:message';
      message: Omit<ChatMessage, 'isSelf' | 'status'>;
    }
  | {
      type: 'chat:ack';
      messageId: string;
      fromPeerId: string;
    }
  | {
      type: 'chat:typing';
      fromPeerId: string;
      isTyping: boolean;
    }
  | {
      type: 'presence:update';
      fromPeerId: string;
      status: PeerPresenceStatus;
      profile?: UserProfile;
    }
  | {
      type: 'file:meta';
      transferId: string;
      fromPeerId: string;
      fromName: string;
      fileName: string;
      fileSize: number;
      mimeType: string;
      totalChunks: number;
      sourceContext: 'chat' | 'file-sharing';
      chatMessageId?: string;
      caption?: string;
    }
  | {
      type: 'file:chunk';
      transferId: string;
      fromPeerId: string;
      chunkIndex: number;
      data: ArrayBuffer;
    }
  | {
      type: 'file:complete';
      transferId: string;
      fromPeerId: string;
    }
  | {
      type: 'file:cancel';
      transferId: string;
      fromPeerId: string;
    }
  | {
      type: 'call:invite';
      callId: string;
      fromPeerId: string;
      profile: UserProfile;
      callType: CallType;
    }
  | {
      type: 'call:accept';
      callId: string;
      fromPeerId: string;
    }
  | {
      type: 'call:reject';
      callId: string;
      fromPeerId: string;
      reason?: string;
    }
  | {
      type: 'call:hangup';
      callId: string;
      fromPeerId: string;
    };
