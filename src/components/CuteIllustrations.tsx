import React, { useId } from 'react';

export const SetorawonLogo: React.FC<{ className?: string }> = ({ className = 'w-9 h-9' }) => {
  const uid = useId().replace(/:/g, '');
  const gradId = `stwGrad-${uid}`;
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={gradId} x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#83BDF7" />
          <stop offset="100%" stopColor="#FFA8CE" />
        </linearGradient>
      </defs>
      <rect x="4" y="6" width="40" height="34" rx="14" fill={`url(#${gradId})`} />
      <path d="M15 40L11 45L20 40H15Z" fill="#95C0F2" />
      <path
        d="M16 21C16 17.6863 18.6863 15 22 15H26C29.3137 15 32 17.6863 32 21C32 24.3137 29.3137 27 26 27H22C18.6863 27 16 24.3137 16 21Z"
        fill="#FFFFFF"
        fillOpacity="0.94"
      />
      <circle cx="21" cy="21" r="1.7" fill="#30364D" />
      <circle cx="27" cy="21" r="1.7" fill="#30364D" />
      <path
        d="M22.5 23.5C23.3 24.3 24.7 24.3 25.5 23.5"
        stroke="#30364D"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M36 10L37.1 12.4L39.5 13.5L37.1 14.6L36 17L34.9 14.6L32.5 13.5L34.9 12.4L36 10Z"
        fill="#FFFFFF"
      />
    </svg>
  );
};

export const CloudIllustration: React.FC<{ className?: string }> = ({ className = 'w-16 h-12' }) => (
  <svg viewBox="0 0 80 56" fill="none" className={className} aria-hidden="true">
    <path
      d="M22 46H60C67.732 46 74 39.732 74 32C74 24.765 68.514 18.813 61.474 18.075C58.855 10.466 51.632 5 43.133 5C32.426 5 23.746 13.68 23.746 24.387C23.746 24.94 23.77 25.487 23.816 26.028C16.054 26.557 10 33.011 10 40.9C10 43.717 12.283 46 15.1 46H22Z"
      fill="#DCEEFF"
      stroke="#83BDF7"
      strokeWidth="2.5"
    />
    <circle cx="35" cy="30" r="2" fill="#30364D" />
    <circle cx="49" cy="30" r="2" fill="#30364D" />
    <circle cx="31" cy="33" r="2.2" fill="#FFA8CE" fillOpacity="0.8" />
    <circle cx="53" cy="33" r="2.2" fill="#FFA8CE" fillOpacity="0.8" />
    <path d="M39.5 32.5C40.7 33.8 43.3 33.8 44.5 32.5" stroke="#30364D" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

export const StarIllustration: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <svg viewBox="0 0 40 40" fill="none" className={className} aria-hidden="true">
    <path
      d="M20 4L24.2 13.6L34.5 14.8L26.8 21.9L28.9 32.2L20 27L11.1 32.2L13.2 21.9L5.5 14.8L15.8 13.6L20 4Z"
      fill="#FFE0EF"
      stroke="#FFA8CE"
      strokeWidth="2.2"
      strokeLinejoin="round"
    />
  </svg>
);

export const HeartIllustration: React.FC<{ className?: string }> = ({ className = 'w-7 h-7' }) => (
  <svg viewBox="0 0 36 36" fill="none" className={className} aria-hidden="true">
    <path
      d="M18 31C18 31 5 22.6 5 13.3C5 8.8 8.5 5.5 12.6 5.5C15.1 5.5 17 6.8 18 8.5C19 6.8 20.9 5.5 23.4 5.5C27.5 5.5 31 8.8 31 13.3C31 22.6 18 31 18 31Z"
      fill="#FFA8CE"
      fillOpacity="0.85"
      stroke="#E879A9"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
  </svg>
);

export const FlowerIllustration: React.FC<{ className?: string }> = ({ className = 'w-9 h-9' }) => (
  <svg viewBox="0 0 44 44" fill="none" className={className} aria-hidden="true">
    <circle cx="22" cy="11" r="6" fill="#FFE0EF" stroke="#FFA8CE" strokeWidth="1.8" />
    <circle cx="32.5" cy="18.6" r="6" fill="#DCEEFF" stroke="#83BDF7" strokeWidth="1.8" />
    <circle cx="28.5" cy="31" r="6" fill="#FFE0EF" stroke="#FFA8CE" strokeWidth="1.8" />
    <circle cx="15.5" cy="31" r="6" fill="#DCEEFF" stroke="#83BDF7" strokeWidth="1.8" />
    <circle cx="11.5" cy="18.6" r="6" fill="#FFE0EF" stroke="#FFA8CE" strokeWidth="1.8" />
    <circle cx="22" cy="22" r="5.5" fill="#FFFFFF" stroke="#83BDF7" strokeWidth="1.8" />
    <circle cx="22" cy="22" r="2.2" fill="#FFA8CE" />
  </svg>
);

export const SparklesIllustration: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <svg viewBox="0 0 40 40" fill="none" className={className} aria-hidden="true">
    <path
      d="M17 6L19.4 13.6L27 16L19.4 18.4L17 26L14.6 18.4L7 16L14.6 13.6L17 6Z"
      fill="#83BDF7"
      fillOpacity="0.7"
    />
    <path
      d="M29 22L30.5 26.5L35 28L30.5 29.5L29 34L27.5 29.5L23 28L27.5 26.5L29 22Z"
      fill="#FFA8CE"
    />
  </svg>
);

export const CuteChatIllustration: React.FC<{ className?: string }> = ({ className = 'w-14 h-12' }) => (
  <svg viewBox="0 0 64 52" fill="none" className={className} aria-hidden="true">
    <rect x="6" y="8" width="34" height="24" rx="11" fill="#DCEEFF" stroke="#83BDF7" strokeWidth="2" />
    <path d="M14 32L11 39L20 32" fill="#DCEEFF" stroke="#83BDF7" strokeWidth="2" strokeLinejoin="round" />
    <circle cx="17" cy="20" r="2" fill="#30364D" />
    <circle cx="23" cy="20" r="2" fill="#30364D" />
    <circle cx="29" cy="20" r="2" fill="#30364D" />
    <rect x="26" y="20" width="32" height="22" rx="10" fill="#FFE0EF" stroke="#FFA8CE" strokeWidth="2" />
    <path d="M48 42L52 48L42 42" fill="#FFE0EF" stroke="#FFA8CE" strokeWidth="2" strokeLinejoin="round" />
    <path d="M36 31H48" stroke="#30364D" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const AvatarGlyph: React.FC<{ id: string }> = ({ id }) => {
  switch (id) {
    case 'blossom':
      return <FlowerIllustration className="w-[70%] h-[70%]" />;
    case 'star':
      return <StarIllustration className="w-[68%] h-[68%]" />;
    case 'ribbon':
      return <HeartIllustration className="w-[64%] h-[64%]" />;
    case 'bunny':
      return (
        <svg viewBox="0 0 36 36" fill="none" className="w-[72%] h-[72%]" aria-hidden="true">
          <ellipse cx="13" cy="10" rx="3" ry="6.5" fill="#FFFFFF" stroke="#83BDF7" strokeWidth="1.6" />
          <ellipse cx="23" cy="10" rx="3" ry="6.5" fill="#FFFFFF" stroke="#83BDF7" strokeWidth="1.6" />
          <circle cx="18" cy="22" r="9" fill="#FFFFFF" stroke="#83BDF7" strokeWidth="1.6" />
          <circle cx="15" cy="21" r="1.2" fill="#30364D" />
          <circle cx="21" cy="21" r="1.2" fill="#30364D" />
          <circle cx="18" cy="23.5" r="1.2" fill="#FFA8CE" />
        </svg>
      );
    case 'cat':
      return (
        <svg viewBox="0 0 36 36" fill="none" className="w-[72%] h-[72%]" aria-hidden="true">
          <path d="M9 17L10 9L16 14H20L26 9L27 17" fill="#FFFFFF" stroke="#FFA8CE" strokeWidth="1.6" strokeLinejoin="round" />
          <circle cx="18" cy="21" r="9" fill="#FFFFFF" stroke="#FFA8CE" strokeWidth="1.6" />
          <circle cx="15" cy="20" r="1.2" fill="#30364D" />
          <circle cx="21" cy="20" r="1.2" fill="#30364D" />
          <path d="M16.5 23C17.5 24 18.5 24 19.5 23" stroke="#30364D" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
      );
    default:
      return <CloudIllustration className="w-[74%] h-[74%]" />;
  }
};

export const AVATAR_PRESETS: Array<{ id: string; label: string; bg: string; accent: string; emoji: React.ReactNode }> = [
  { id: 'cloud', label: 'Awan Biru', bg: '#DCEEFF', accent: '#83BDF7', emoji: <AvatarGlyph id="cloud" /> },
  { id: 'blossom', label: 'Bunga Pink', bg: '#FFE0EF', accent: '#FFA8CE', emoji: <AvatarGlyph id="blossom" /> },
  { id: 'star', label: 'Bintang', bg: '#E6F2FF', accent: '#83BDF7', emoji: <AvatarGlyph id="star" /> },
  { id: 'ribbon', label: 'Hati Pastel', bg: '#FFE8F3', accent: '#FFA8CE', emoji: <AvatarGlyph id="ribbon" /> },
  { id: 'bunny', label: 'Kelinci', bg: '#DCEEFF', accent: '#FFA8CE', emoji: <AvatarGlyph id="bunny" /> },
  { id: 'cat', label: 'Kucing', bg: '#FFE0EF', accent: '#83BDF7', emoji: <AvatarGlyph id="cat" /> },
];

export const UserAvatar: React.FC<{
  preset: string;
  customUrl?: string | null;
  name: string;
  sizeClass?: string;
}> = ({ preset, customUrl, name, sizeClass = 'w-11 h-11 text-lg' }) => {
  const found = AVATAR_PRESETS.find((p) => p.id === preset) ?? AVATAR_PRESETS[0];

  if (customUrl) {
    return (
      <img
        src={customUrl}
        alt={name}
        referrerPolicy="no-referrer"
        className={`${sizeClass} rounded-2xl object-cover border border-[#83BDF7]/40 dark:border-[#83BDF7]/30 shrink-0 bg-[#DCEEFF]`}
      />
    );
  }

  return (
    <div
      className={`${sizeClass} rounded-2xl flex items-center justify-center shrink-0 border border-[#83BDF7]/40 dark:border-[#83BDF7]/30 select-none overflow-hidden`}
      style={{
        background: `linear-gradient(135deg, ${found.bg} 0%, ${found.accent}55 100%)`,
      }}
      aria-label={name}
    >
      <AvatarGlyph id={found.id} />
    </div>
  );
};
