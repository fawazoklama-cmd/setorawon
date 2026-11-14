import { Language } from '../types/app';

export interface TranslationStrings {
  app: {
    name: string;
    tagline: string;
    ephemeralNotice: string;
    noDatabaseBadge: string;
  };
  nav: {
    home: string;
    chat: string;
    voiceCall: string;
    videoCall: string;
    fileSharing: string;
    settings: string;
    about: string;
    more: string;
  };
  status: {
    offline: string;
    connecting: string;
    online: string;
    inCall: string;
    typing: string;
    roomActive: string;
    noRoom: string;
    hostRole: string;
    guestRole: string;
    peersConnected: string;
    waitingPeers: string;
  };
  home: {
    welcomeTitle: string;
    welcomeSubtitle: string;
    profileCardTitle: string;
    editName: string;
    saveName: string;
    cancel: string;
    uploadPhoto: string;
    chooseAvatar: string;
    userIdLabel: string;
    copyId: string;
    shareId: string;
    regenerateId: string;
    roomCardTitle: string;
    createRoom: string;
    createRoomDesc: string;
    customRoomPlaceholder: string;
    joinRoom: string;
    joinRoomDesc: string;
    joinRoomPlaceholder: string;
    leaveRoom: string;
    activeRoomLabel: string;
    copyRoomCode: string;
    shareRoomLink: string;
    quickActionsTitle: string;
    actionChat: string;
    actionVoice: string;
    actionVideo: string;
    actionFile: string;
    recentSessionsTitle: string;
    recentSessionsSubtitle: string;
    noRecentSessions: string;
    clearHistory: string;
    rejoinRoom: string;
    peersInRoomTitle: string;
    noPeersYet: string;
    youLabel: string;
  };
  chat: {
    title: string;
    subtitle: string;
    noRoomTitle: string;
    noRoomDesc: string;
    goHome: string;
    emptyChatTitle: string;
    emptyChatDesc: string;
    placeholder: string;
    send: string;
    attachFile: string;
    emojiPicker: string;
    reply: string;
    replyingTo: string;
    copy: string;
    deleteLocal: string;
    sent: string;
    delivered: string;
    sending: string;
    previewTitle: string;
    sendAttachment: string;
    download: string;
    cancelTransfer: string;
    transferring: string;
    completed: string;
    cancelled: string;
    ephemeralBanner: string;
  };
  voice: {
    title: string;
    subtitle: string;
    selectPeer: string;
    startCall: string;
    endCall: string;
    mute: string;
    unmute: string;
    calling: string;
    ringing: string;
    connected: string;
    ended: string;
    idleHint: string;
    noPeersHint: string;
    incomingTitle: string;
    incomingVoiceDesc: string;
    incomingVideoDesc: string;
    incomingScreenDesc: string;
    accept: string;
    decline: string;
    micActive: string;
    micMuted: string;
  };
  video: {
    title: string;
    subtitle: string;
    previewLocal: string;
    stopPreview: string;
    startVideoCall: string;
    endCall: string;
    camOn: string;
    camOff: string;
    micOn: string;
    micOff: string;
    switchCamera: string;
    fullscreen: string;
    exitFullscreen: string;
    youLabel: string;
    remoteLabel: string;
    noRemoteVideo: string;
    screenShareSection: string;
    shareScreen: string;
    shareWindow: string;
    shareTab: string;
    stopSharing: string;
    screenShareUnsupported: string;
    screenShareActive: string;
    screenShareHint: string;
  };
  files: {
    title: string;
    subtitle: string;
    dropzoneTitle: string;
    dropzoneDesc: string;
    chooseFiles: string;
    supportedTypes: string;
    maxSizeLabel: string;
    targetPeerLabel: string;
    sendToAll: string;
    filterAll: string;
    filterIncoming: string;
    filterOutgoing: string;
    noTransfersTitle: string;
    noTransfersDesc: string;
    preview: string;
    download: string;
    cancel: string;
    remove: string;
    clearCompleted: string;
    statusQueued: string;
    statusTransferring: string;
    statusCompleted: string;
    statusCancelled: string;
    statusError: string;
    previewModalTitle: string;
    close: string;
    previewUnavailable: string;
    chunkedNote: string;
  };
  settings: {
    title: string;
    subtitle: string;
    languageSection: string;
    languageDesc: string;
    themeSection: string;
    themeDesc: string;
    lightMode: string;
    darkMode: string;
    profileSection: string;
    usernameLabel: string;
    avatarLabel: string;
    devicesSection: string;
    micLabel: string;
    camLabel: string;
    defaultDevice: string;
    refreshDevices: string;
    testMedia: string;
    stopTestMedia: string;
    notificationsSection: string;
    soundNotif: string;
    soundNotifDesc: string;
    browserNotif: string;
    browserNotifDesc: string;
    privacySection: string;
    maxFileSize: string;
    autoAcceptFiles: string;
    autoAcceptFilesDesc: string;
    hideTyping: string;
    hideTypingDesc: string;
    clearLocalData: string;
    appInfoSection: string;
    architectureInfo: string;
    turnInfo: string;
    resetSettings: string;
    resetSuccess: string;
  };
  about: {
    title: string;
    subtitle: string;
    appLabel: string;
    taglineLabel: string;
    developerLabel: string;
    instagramLabel: string;
    requestedByLabel: string;
    madeWithLove: string;
    techTitle: string;
    noDbTitle: string;
    noDbDesc: string;
    webrtcTitle: string;
    webrtcDesc: string;
    privacyTitle: string;
    privacyDesc: string;
  };
  messages: {
    copiedId: string;
    copiedRoom: string;
    copiedText: string;
    roomCreated: string;
    roomJoined: string;
    roomLeft: string;
    peerJoined: string;
    peerLeft: string;
    invalidRoomCode: string;
    roomNotFound: string;
    roomIdTaken: string;
    peerError: string;
    fileTooLarge: string;
    fileEmpty: string;
    fileUnsafe: string;
    noPeerConnected: string;
    mediaPermissionDenied: string;
    cameraSwitchFailed: string;
    screenShareDenied: string;
    callRejected: string;
    callEnded: string;
    localDataCleared: string;
    profileSaved: string;
    shareNotSupported: string;
    newMessageFrom: string;
    incomingFileFrom: string;
  };
}

export const TRANSLATIONS: Record<Language, TranslationStrings> = {
  id: {
    app: {
      name: 'SETORAWON',
      tagline: 'Share Moments, Stay Connected.',
      ephemeralNotice:
        'Tanpa database: pesan dan file dikirim langsung peer-to-peer (WebRTC) dan hanya tersedia selama sesi aktif.',
      noDatabaseBadge: 'Sesi Peer-to-Peer Sementara',
    },
    nav: {
      home: 'Beranda',
      chat: 'Obrolan',
      voiceCall: 'Panggilan Suara',
      videoCall: 'Panggilan Video',
      fileSharing: 'Berbagi File',
      settings: 'Pengaturan',
      about: 'Tentang',
      more: 'Lainnya',
    },
    status: {
      offline: 'Offline',
      connecting: 'Menghubungkan...',
      online: 'Online',
      inCall: 'Sedang Menelepon',
      typing: 'Sedang mengetik...',
      roomActive: 'Room Aktif',
      noRoom: 'Belum Masuk Room',
      hostRole: 'Host Room',
      guestRole: 'Peserta',
      peersConnected: 'terhubung',
      waitingPeers: 'Menunggu teman bergabung',
    },
    home: {
      welcomeTitle: 'Halo, siap terhubung hari ini?',
      welcomeSubtitle:
        'Buat atau gabung room untuk berkirim pesan, foto, video, dokumen, telepon, video call, dan berbagi layar secara real-time.',
      profileCardTitle: 'Identitas Pengguna',
      editName: 'Edit Nama',
      saveName: 'Simpan',
      cancel: 'Batal',
      uploadPhoto: 'Upload Foto',
      chooseAvatar: 'Pilih Avatar',
      userIdLabel: 'ID Pengguna Unik',
      copyId: 'Salin ID',
      shareId: 'Bagikan',
      regenerateId: 'Buat ID Baru',
      roomCardTitle: 'Ruang Komunikasi (Room)',
      createRoom: 'CREATE ROOM',
      createRoomDesc: 'Buat room baru dan bagikan kodenya kepada temanmu untuk mulai terhubung.',
      customRoomPlaceholder: 'Opsional (cth: MANDA-01)',
      joinRoom: 'JOIN ROOM',
      joinRoomDesc: 'Masukkan kode room dari teman untuk langsung bergabung ke sesi yang sama.',
      joinRoomPlaceholder: 'Room ID (cth: ROOM-7K2M)',
      leaveRoom: 'Keluar Room',
      activeRoomLabel: 'Room Saat Ini',
      copyRoomCode: 'Salin Kode',
      shareRoomLink: 'Bagikan Tautan',
      quickActionsTitle: 'Aksi Cepat',
      actionChat: 'Buka Obrolan',
      actionVoice: 'Panggilan Suara',
      actionVideo: 'Panggilan Video',
      actionFile: 'Kirim File',
      recentSessionsTitle: 'Sesi Lokal Terbaru',
      recentSessionsSubtitle: 'Disimpan sementara hanya di browser perangkat ini.',
      noRecentSessions: 'Belum ada riwayat sesi lokal di browser ini.',
      clearHistory: 'Hapus Riwayat',
      rejoinRoom: 'Gabung Lagi',
      peersInRoomTitle: 'Peserta di Room',
      noPeersYet: 'Bagikan kode room agar temanmu bisa bergabung di sini.',
      youLabel: 'Kamu',
    },
    chat: {
      title: 'Obrolan Real-Time',
      subtitle: 'Pesan instan peer-to-peer tanpa penyimpanan database.',
      noRoomTitle: 'Kamu belum bergabung ke room',
      noRoomDesc: 'Buat room baru atau gabung menggunakan Room ID di halaman Beranda terlebih dahulu.',
      goHome: 'Ke Beranda',
      emptyChatTitle: 'Belum ada pesan di sesi ini',
      emptyChatDesc: 'Mulai sapa temanmu dengan teks, emoji, foto, video, atau dokumen!',
      placeholder: 'Tulis pesan manis di sini...',
      send: 'Kirim',
      attachFile: 'Lampirkan File',
      emojiPicker: 'Pilih Emoji',
      reply: 'Balas',
      replyingTo: 'Membalas',
      copy: 'Salin',
      deleteLocal: 'Hapus lokal',
      sent: 'Terkirim',
      delivered: 'Diterima',
      sending: 'Mengirim...',
      previewTitle: 'Pratinjau Lampiran',
      sendAttachment: 'Kirim Lampiran',
      download: 'Unduh',
      cancelTransfer: 'Batalkan',
      transferring: 'Mengirim...',
      completed: 'Selesai',
      cancelled: 'Dibatalkan',
      ephemeralBanner: 'Riwayat chat hanya bertahan selama sesi aktif (tidak disimpan ke server/database).',
    },
    voice: {
      title: 'Panggilan Suara',
      subtitle: 'Panggilan audio WebRTC jernih langsung antar perangkat.',
      selectPeer: 'Pilih Teman di Room',
      startCall: 'Mulai Panggilan Suara',
      endCall: 'Akhiri Panggilan',
      mute: 'Bisukan Mikrofon',
      unmute: 'Aktifkan Mikrofon',
      calling: 'Memanggil...',
      ringing: 'Panggilan Masuk...',
      connected: 'Terhubung',
      ended: 'Panggilan Berakhir',
      idleHint: 'Pilih teman yang online di room untuk memulai panggilan suara.',
      noPeersHint: 'Belum ada teman lain di room. Undang teman dengan membagikan Room ID.',
      incomingTitle: 'Panggilan Masuk',
      incomingVoiceDesc: 'mengundang kamu ke panggilan suara',
      incomingVideoDesc: 'mengundang kamu ke panggilan video',
      incomingScreenDesc: 'sedang berbagi layar denganmu',
      accept: 'Terima',
      decline: 'Tolak',
      micActive: 'Mikrofon Aktif',
      micMuted: 'Mikrofon Dibisukan',
    },
    video: {
      title: 'Panggilan Video & Berbagi Layar',
      subtitle: 'Tatap muka dua arah dan presentasi layar real-time via WebRTC.',
      previewLocal: 'Pratinjau Kamera',
      stopPreview: 'Tutup Pratinjau',
      startVideoCall: 'Mulai Video Call',
      endCall: 'Akhiri Panggilan',
      camOn: 'Kamera Aktif',
      camOff: 'Kamera Mati',
      micOn: 'Mikrofon Aktif',
      micOff: 'Mikrofon Mati',
      switchCamera: 'Ganti Kamera',
      fullscreen: 'Layar Penuh',
      exitFullscreen: 'Keluar Layar Penuh',
      youLabel: 'Kamera Kamu',
      remoteLabel: 'Lawan Bicara',
      noRemoteVideo: 'Menunggu video lawan bicara atau mulai panggilan.',
      screenShareSection: 'Berbagi Layar (Screen Capture API)',
      shareScreen: 'Seluruh Layar',
      shareWindow: 'Jendela Aplikasi',
      shareTab: 'Tab Browser',
      stopSharing: 'Hentikan Berbagi',
      screenShareUnsupported:
        'Browser atau perangkat ini belum mendukung Screen Capture API (getDisplayMedia). Fitur ini tersedia di browser desktop modern.',
      screenShareActive: 'Sedang Berbagi Layar',
      screenShareHint: 'Pilih jenis tampilan yang ingin dibagikan ke teman di room.',
    },
    files: {
      title: 'Berbagi File Peer-to-Peer',
      subtitle: 'Kirim foto, video, PDF, DOCX, XLSX, PPTX, ZIP dengan transfer bertahap (chunked).',
      dropzoneTitle: 'Tarik & lepas file di sini, atau klik untuk memilih',
      dropzoneDesc: 'File dikirim langsung antar perangkat tanpa diunggah ke database mana pun.',
      chooseFiles: 'Pilih File',
      supportedTypes: 'Mendukung Foto, Video, PDF, DOCX, XLSX, PPTX, ZIP, dan dokumen lainnya',
      maxSizeLabel: 'Batas ukuran per file',
      targetPeerLabel: 'Tujuan Pengiriman',
      sendToAll: 'Semua teman di room',
      filterAll: 'Semua',
      filterIncoming: 'Diterima',
      filterOutgoing: 'Dikirim',
      noTransfersTitle: 'Belum ada aktivitas transfer file',
      noTransfersDesc: 'Pilih file di atas saat terhubung ke room untuk memulai transfer peer-to-peer.',
      preview: 'Pratinjau',
      download: 'Unduh',
      cancel: 'Batalkan',
      remove: 'Hapus',
      clearCompleted: 'Bersihkan Selesai',
      statusQueued: 'Menunggu',
      statusTransferring: 'Mengirim...',
      statusCompleted: 'Selesai',
      statusCancelled: 'Dibatalkan',
      statusError: 'Gagal',
      previewModalTitle: 'Pratinjau File',
      close: 'Tutup',
      previewUnavailable: 'Pratinjau langsung tidak tersedia untuk format ini. Silakan unduh file.',
      chunkedNote: 'Menggunakan chunked transfer 64 KB agar aman untuk memori browser.',
    },
    settings: {
      title: 'Pengaturan Aplikasi',
      subtitle: 'Sesuaikan bahasa, tema, profil, perangkat media, dan privasi.',
      languageSection: 'Bahasa / Language',
      languageDesc: 'Pilihan bahasa disimpan otomatis di LocalStorage browser.',
      themeSection: 'Tampilan & Tema',
      themeDesc: 'Pilih mode terang pastel atau mode gelap yang nyaman di mata.',
      lightMode: 'Mode Terang',
      darkMode: 'Mode Gelap',
      profileSection: 'Profil & Avatar',
      usernameLabel: 'Nama Pengguna',
      avatarLabel: 'Avatar atau Foto Profil',
      devicesSection: 'Mikrofon & Kamera',
      micLabel: 'Perangkat Mikrofon',
      camLabel: 'Perangkat Kamera',
      defaultDevice: 'Default Sistem',
      refreshDevices: 'Deteksi Ulang Perangkat',
      testMedia: 'Uji Kamera & Mikrofon',
      stopTestMedia: 'Hentikan Uji',
      notificationsSection: 'Notifikasi',
      soundNotif: 'Suara Notifikasi & Dering',
      soundNotifDesc: 'Putar nada lembut saat pesan atau panggilan masuk.',
      browserNotif: 'Notifikasi Browser',
      browserNotifDesc: 'Tampilkan notifikasi desktop saat tab tidak aktif.',
      privacySection: 'Privasi & Keamanan Transfer',
      maxFileSize: 'Batas Maksimum Ukuran File',
      autoAcceptFiles: 'Terima File Masuk Otomatis',
      autoAcceptFilesDesc: 'File aman dari teman di room langsung disiapkan sebagai Blob lokal.',
      hideTyping: 'Sembunyikan Status Mengetik',
      hideTypingDesc: 'Jangan kirim indikator saat kamu sedang mengetik pesan.',
      clearLocalData: 'Hapus Riwayat Sesi Lokal',
      appInfoSection: 'Informasi Aplikasi & WebRTC',
      architectureInfo:
        'SETORAWON berjalan 100% tanpa database. Signaling room menggunakan PeerJS Cloud dan pengiriman data menggunakan WebRTC DataChannel/MediaStream.',
      turnInfo:
        'Catatan Jaringan: Konfigurasi default menggunakan STUN publik Google. Untuk jaringan dengan firewall/NAT ketat, layanan TURN eksternal mungkin diperlukan melalui variabel environment.',
      resetSettings: 'Reset Pengaturan ke Default',
      resetSuccess: 'Pengaturan berhasil dikembalikan ke default.',
    },
    about: {
      title: 'Tentang SETORAWON',
      subtitle: 'Platform komunikasi real-time yang hangat, estetik, dan menjaga privasi.',
      appLabel: 'Application',
      taglineLabel: 'Tagline',
      developerLabel: 'Developer / Engineer',
      instagramLabel: 'Instagram',
      requestedByLabel: 'Requested By',
      madeWithLove: 'Made with love 💗',
      techTitle: 'Transparansi Arsitektur Tanpa Database',
      noDbTitle: 'Tanpa Database Permanen',
      noDbDesc:
        'SETORAWON tidak menggunakan MySQL, PostgreSQL, MongoDB, Firebase, atau Supabase. Pesan, foto, video, dan file hanya hidup selama sesi aktif di memori dan Blob sementara browser.',
      webrtcTitle: 'Peer-to-Peer WebRTC & TURN',
      webrtcDesc:
        'Komunikasi berjalan langsung antar browser melalui PeerJS & WebRTC dengan STUN default. Pada jaringan korporat atau NAT simetris tertentu, relay TURN tambahan mungkin diperlukan.',
      privacyTitle: 'Keamanan & Validasi File',
      privacyDesc:
        'Setiap file yang dikirim divalidasi ukuran serta ekstensinya (file executable berbahaya ditolak) dan tidak pernah dieksekusi di browser.',
    },
    messages: {
      copiedId: 'ID Pengguna berhasil disalin!',
      copiedRoom: 'Kode Room berhasil disalin!',
      copiedText: 'Teks pesan disalin!',
      roomCreated: 'Room berhasil dibuat dan siap digunakan!',
      roomJoined: 'Berhasil terhubung ke room!',
      roomLeft: 'Kamu telah keluar dari room.',
      peerJoined: 'bergabung ke room.',
      peerLeft: 'keluar dari room.',
      invalidRoomCode: 'Masukkan minimal 4 karakter huruf/angka untuk Room ID.',
      roomNotFound: 'Room tidak ditemukan atau host sedang offline.',
      roomIdTaken: 'Kode Room tersebut sedang dipakai. Coba kode lain atau gabung sebagai peserta.',
      peerError: 'Koneksi signaling PeerJS mengalami kendala. Periksa internet dan coba lagi.',
      fileTooLarge: 'Ukuran file melebihi batas maksimum yang diizinkan.',
      fileEmpty: 'File kosong (0 byte) tidak dapat dikirim.',
      fileUnsafe: 'Jenis file executable ini diblokir demi keamanan.',
      noPeerConnected: 'Belum ada teman yang terhubung di room.',
      mediaPermissionDenied: 'Izin kamera atau mikrofon ditolak oleh browser.',
      cameraSwitchFailed: 'Tidak dapat mengganti kamera pada perangkat ini.',
      screenShareDenied: 'Berbagi layar dibatalkan atau izin tidak diberikan.',
      callRejected: 'Panggilan ditolak oleh lawan bicara.',
      callEnded: 'Panggilan telah berakhir.',
      localDataCleared: 'Riwayat sesi lokal berhasil dibersihkan.',
      profileSaved: 'Profil berhasil diperbarui!',
      shareNotSupported: 'Tautan disalin ke clipboard.',
      newMessageFrom: 'Pesan baru dari',
      incomingFileFrom: 'File masuk dari',
    },
  },
  en: {
    app: {
      name: 'SETORAWON',
      tagline: 'Share Moments, Stay Connected.',
      ephemeralNotice:
        'Zero database: messages and files are sent directly peer-to-peer (WebRTC) and remain available only during the active session.',
      noDatabaseBadge: 'Ephemeral Peer-to-Peer Session',
    },
    nav: {
      home: 'Home',
      chat: 'Chat',
      voiceCall: 'Voice Call',
      videoCall: 'Video Call',
      fileSharing: 'File Sharing',
      settings: 'Settings',
      about: 'About',
      more: 'More',
    },
    status: {
      offline: 'Offline',
      connecting: 'Connecting...',
      online: 'Online',
      inCall: 'In a Call',
      typing: 'Typing...',
      roomActive: 'Room Active',
      noRoom: 'No Active Room',
      hostRole: 'Room Host',
      guestRole: 'Participant',
      peersConnected: 'connected',
      waitingPeers: 'Waiting for peers to join',
    },
    home: {
      welcomeTitle: 'Hello, ready to connect today?',
      welcomeSubtitle:
        'Create or join a room to share real-time messages, photos, videos, documents, voice calls, video calls, and screen sharing.',
      profileCardTitle: 'User Identity',
      editName: 'Edit Name',
      saveName: 'Save',
      cancel: 'Cancel',
      uploadPhoto: 'Upload Photo',
      chooseAvatar: 'Choose Avatar',
      userIdLabel: 'Unique User ID',
      copyId: 'Copy ID',
      shareId: 'Share',
      regenerateId: 'New ID',
      roomCardTitle: 'Communication Room',
      createRoom: 'CREATE ROOM',
      createRoomDesc: 'Start a fresh room and share the Room ID with your friend to connect.',
      customRoomPlaceholder: 'Optional (e.g. MANDA-01)',
      joinRoom: 'JOIN ROOM',
      joinRoomDesc: 'Enter a Room ID from your friend to connect into the same live session.',
      joinRoomPlaceholder: 'Room ID (e.g. ROOM-7K2M)',
      leaveRoom: 'Leave Room',
      activeRoomLabel: 'Current Room',
      copyRoomCode: 'Copy Code',
      shareRoomLink: 'Share Link',
      quickActionsTitle: 'Quick Actions',
      actionChat: 'Open Chat',
      actionVoice: 'Voice Call',
      actionVideo: 'Video Call',
      actionFile: 'Send Files',
      recentSessionsTitle: 'Recent Local Sessions',
      recentSessionsSubtitle: 'Stored temporarily in this browser only.',
      noRecentSessions: 'No recent local session history in this browser.',
      clearHistory: 'Clear History',
      rejoinRoom: 'Rejoin',
      peersInRoomTitle: 'Peers in Room',
      noPeersYet: 'Share your Room ID so a friend can join you here.',
      youLabel: 'You',
    },
    chat: {
      title: 'Real-Time Chat',
      subtitle: 'Instant peer-to-peer messaging with zero database persistence.',
      noRoomTitle: 'You are not in a room yet',
      noRoomDesc: 'Create a new room or join an existing Room ID from the Home page first.',
      goHome: 'Go to Home',
      emptyChatTitle: 'No messages in this session yet',
      emptyChatDesc: 'Say hello with text, emojis, photos, videos, or documents!',
      placeholder: 'Write a sweet message here...',
      send: 'Send',
      attachFile: 'Attach File',
      emojiPicker: 'Choose Emoji',
      reply: 'Reply',
      replyingTo: 'Replying to',
      copy: 'Copy',
      deleteLocal: 'Delete locally',
      sent: 'Sent',
      delivered: 'Delivered',
      sending: 'Sending...',
      previewTitle: 'Attachment Preview',
      sendAttachment: 'Send Attachment',
      download: 'Download',
      cancelTransfer: 'Cancel',
      transferring: 'Sending...',
      completed: 'Completed',
      cancelled: 'Cancelled',
      ephemeralBanner: 'Chat history lives only in this active session (never saved to a server or database).',
    },
    voice: {
      title: 'Voice Call',
      subtitle: 'Crisp WebRTC peer-to-peer audio calls.',
      selectPeer: 'Select Peer in Room',
      startCall: 'Start Voice Call',
      endCall: 'End Call',
      mute: 'Mute Microphone',
      unmute: 'Unmute Microphone',
      calling: 'Calling...',
      ringing: 'Incoming Call...',
      connected: 'Connected',
      ended: 'Call Ended',
      idleHint: 'Select an online peer in your room to start a voice call.',
      noPeersHint: 'No other peers in the room yet. Invite someone with your Room ID.',
      incomingTitle: 'Incoming Call',
      incomingVoiceDesc: 'is inviting you to a voice call',
      incomingVideoDesc: 'is inviting you to a video call',
      incomingScreenDesc: 'is sharing their screen with you',
      accept: 'Accept',
      decline: 'Decline',
      micActive: 'Microphone On',
      micMuted: 'Microphone Muted',
    },
    video: {
      title: 'Video Call & Screen Sharing',
      subtitle: 'Two-way video calls and real-time screen sharing over WebRTC.',
      previewLocal: 'Camera Preview',
      stopPreview: 'Stop Preview',
      startVideoCall: 'Start Video Call',
      endCall: 'End Call',
      camOn: 'Camera On',
      camOff: 'Camera Off',
      micOn: 'Mic On',
      micOff: 'Mic Off',
      switchCamera: 'Switch Camera',
      fullscreen: 'Fullscreen',
      exitFullscreen: 'Exit Fullscreen',
      youLabel: 'Your Camera',
      remoteLabel: 'Remote Peer',
      noRemoteVideo: 'Waiting for remote video or start a call.',
      screenShareSection: 'Screen Sharing (Screen Capture API)',
      shareScreen: 'Entire Screen',
      shareWindow: 'App Window',
      shareTab: 'Browser Tab',
      stopSharing: 'Stop Sharing',
      screenShareUnsupported:
        'Screen Capture API (getDisplayMedia) is not supported on this browser/device. Available on modern desktop browsers.',
      screenShareActive: 'Screen Sharing Active',
      screenShareHint: 'Choose what you want to share with your peer in the room.',
    },
    files: {
      title: 'Peer-to-Peer File Sharing',
      subtitle: 'Send photos, videos, PDF, DOCX, XLSX, PPTX, ZIP with chunked P2P transfer.',
      dropzoneTitle: 'Drag & drop files here, or click to browse',
      dropzoneDesc: 'Files transfer directly between peers without uploading to any database.',
      chooseFiles: 'Choose Files',
      supportedTypes: 'Supports Photos, Videos, PDF, DOCX, XLSX, PPTX, ZIP, and any safe document',
      maxSizeLabel: 'Max file size limit',
      targetPeerLabel: 'Transfer Recipient',
      sendToAll: 'All peers in room',
      filterAll: 'All',
      filterIncoming: 'Received',
      filterOutgoing: 'Sent',
      noTransfersTitle: 'No file transfers yet',
      noTransfersDesc: 'Select files above while connected to a room to start a P2P transfer.',
      preview: 'Preview',
      download: 'Download',
      cancel: 'Cancel',
      remove: 'Remove',
      clearCompleted: 'Clear Completed',
      statusQueued: 'Queued',
      statusTransferring: 'Transferring...',
      statusCompleted: 'Completed',
      statusCancelled: 'Cancelled',
      statusError: 'Failed',
      previewModalTitle: 'File Preview',
      close: 'Close',
      previewUnavailable: 'Inline preview is unavailable for this format. Please download the file.',
      chunkedNote: 'Uses 64 KB chunked streaming to keep browser memory usage low.',
    },
    settings: {
      title: 'Application Settings',
      subtitle: 'Customize language, theme, profile, media devices, and privacy.',
      languageSection: 'Language / Bahasa',
      languageDesc: 'Your language preference is saved automatically in LocalStorage.',
      themeSection: 'Appearance & Theme',
      themeDesc: 'Switch between soft pastel light mode and eye-friendly dark mode.',
      lightMode: 'Light Mode',
      darkMode: 'Dark Mode',
      profileSection: 'Profile & Avatar',
      usernameLabel: 'Username',
      avatarLabel: 'Avatar or Profile Photo',
      devicesSection: 'Microphone & Camera',
      micLabel: 'Microphone Device',
      camLabel: 'Camera Device',
      defaultDevice: 'System Default',
      refreshDevices: 'Refresh Devices',
      testMedia: 'Test Camera & Mic',
      stopTestMedia: 'Stop Test',
      notificationsSection: 'Notifications',
      soundNotif: 'Sound & Ringtone Chimes',
      soundNotifDesc: 'Play gentle chimes when messages or calls arrive.',
      browserNotif: 'Browser Notifications',
      browserNotifDesc: 'Show desktop alerts when the tab is in the background.',
      privacySection: 'Privacy & Transfer Security',
      maxFileSize: 'Maximum File Size Limit',
      autoAcceptFiles: 'Auto-Accept Incoming Files',
      autoAcceptFilesDesc: 'Safe incoming files are automatically assembled into temporary local Blobs.',
      hideTyping: 'Hide Typing Indicator',
      hideTypingDesc: 'Do not broadcast when you are typing in chat.',
      clearLocalData: 'Clear Local Session History',
      appInfoSection: 'App & WebRTC Information',
      architectureInfo:
        'SETORAWON operates 100% without a database. Room signaling uses PeerJS Cloud while media and files stream over WebRTC.',
      turnInfo:
        'Network Note: Google public STUN servers are enabled by default. Restrictive corporate NATs or firewalls may require an external TURN server configured via environment variables.',
      resetSettings: 'Reset Settings to Default',
      resetSuccess: 'Settings have been restored to defaults.',
    },
    about: {
      title: 'About SETORAWON',
      subtitle: 'A warm, aesthetic, privacy-first real-time communication web app.',
      appLabel: 'Application',
      taglineLabel: 'Tagline',
      developerLabel: 'Developer / Engineer',
      instagramLabel: 'Instagram',
      requestedByLabel: 'Requested By',
      madeWithLove: 'Made with love 💗',
      techTitle: 'Zero-Database Architecture Transparency',
      noDbTitle: 'No Permanent Database',
      noDbDesc:
        'SETORAWON does not use MySQL, PostgreSQL, MongoDB, Firebase, or Supabase. Messages, media, and files exist only during the active session via temporary memory and Blob URLs.',
      webrtcTitle: 'Peer-to-Peer WebRTC & TURN',
      webrtcDesc:
        'Communication flows browser-to-browser via PeerJS & WebRTC with default STUN servers. Symmetric NAT networks may require an additional TURN relay service.',
      privacyTitle: 'Security & File Validation',
      privacyDesc:
        'Every file transfer is validated by size and extension (executable files are blocked) and files are never executed inside the browser.',
    },
    messages: {
      copiedId: 'User ID copied to clipboard!',
      copiedRoom: 'Room ID copied to clipboard!',
      copiedText: 'Message text copied!',
      roomCreated: 'Room created and ready for connections!',
      roomJoined: 'Connected to room!',
      roomLeft: 'You left the room.',
      peerJoined: 'joined the room.',
      peerLeft: 'left the room.',
      invalidRoomCode: 'Please enter at least 4 letters/numbers for the Room ID.',
      roomNotFound: 'Room not found or the host is currently offline.',
      roomIdTaken: 'That Room ID is already active. Try another code or join it instead.',
      peerError: 'PeerJS signaling encountered a connection error. Please check your network.',
      fileTooLarge: 'File exceeds the maximum allowed size limit.',
      fileEmpty: 'Empty files (0 bytes) cannot be sent.',
      fileUnsafe: 'Executable file types are blocked for security.',
      noPeerConnected: 'No peer is currently connected in the room.',
      mediaPermissionDenied: 'Camera or microphone permission was denied by the browser.',
      cameraSwitchFailed: 'Unable to switch camera on this device.',
      screenShareDenied: 'Screen sharing was cancelled or permission was denied.',
      callRejected: 'The call was declined by the remote peer.',
      callEnded: 'The call has ended.',
      localDataCleared: 'Local session history cleared.',
      profileSaved: 'Profile updated!',
      shareNotSupported: 'Link copied to clipboard.',
      newMessageFrom: 'New message from',
      incomingFileFrom: 'Incoming file from',
    },
  },
};
