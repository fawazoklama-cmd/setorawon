import React from 'react';
import { Database, ExternalLink, Lock, Radio } from 'lucide-react';
import { useSetorawon } from '../context/SetorawonContext';
import {
  CloudIllustration,
  FlowerIllustration,
  HeartIllustration,
  SetorawonLogo,
  SparklesIllustration,
  StarIllustration,
} from './CuteIllustrations';

export const AboutPage: React.FC = () => {
  const { t } = useSetorawon();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Credits Hero Card */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#DCEEFF] via-[#FFFFFF] to-[#FFE0EF] dark:from-[#1D2B45] dark:via-[#1B2032] dark:to-[#352038] border border-[#83BDF7]/40 dark:border-[#83BDF7]/20 p-6 sm:p-10 text-center space-y-6">
        <div className="flex items-center justify-center gap-4">
          <CloudIllustration className="w-16 h-12" />
          <SetorawonLogo className="w-16 h-16" />
          <FlowerIllustration className="w-12 h-12" />
        </div>

        <div className="space-y-2">
          <h2 className="font-display text-3xl font-bold text-[#30364D] dark:text-white tracking-tight">
            {t.app.name}
          </h2>
          <p className="text-base font-medium text-[#4B5472] dark:text-[#C5CDE3]">
            {t.app.tagline}
          </p>
        </div>

        <div className="max-w-md mx-auto bg-white/80 dark:bg-[#151A2A]/85 backdrop-blur-md rounded-2xl border border-[#DCEEFF] dark:border-[#2C3654] p-5 space-y-3 text-left text-sm">
          <div className="flex items-center justify-between gap-4 py-1 border-b border-[#DCEEFF]/60 dark:border-[#28304A]">
            <span className="text-xs font-medium text-[#646D8A] dark:text-[#9AA5C4]">
              {t.about.appLabel}
            </span>
            <span className="font-display font-bold text-[#30364D] dark:text-white">
              SETORAWON
            </span>
          </div>

          <div className="flex items-center justify-between gap-4 py-1 border-b border-[#DCEEFF]/60 dark:border-[#28304A]">
            <span className="text-xs font-medium text-[#646D8A] dark:text-[#9AA5C4]">
              {t.about.developerLabel}
            </span>
            <span className="font-mono font-semibold text-[#2B6CB0] dark:text-[#83BDF7]">
              @wazzz.dotcom
            </span>
          </div>

          <div className="flex items-center justify-between gap-4 py-1 border-b border-[#DCEEFF]/60 dark:border-[#28304A]">
            <span className="text-xs font-medium text-[#646D8A] dark:text-[#9AA5C4]">
              {t.about.instagramLabel}
            </span>
            <a
              href="https://instagram.com/wazzz.dotcom"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-mono font-semibold text-[#C2457D] dark:text-[#FFA8CE] hover:underline"
            >
              <span>@wazzz.dotcom</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="flex items-center justify-between gap-4 py-1">
            <span className="text-xs font-medium text-[#646D8A] dark:text-[#9AA5C4]">
              {t.about.requestedByLabel}
            </span>
            <span className="font-display font-bold text-[#30364D] dark:text-white">
              mandaa
            </span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-3 pt-1">
          <StarIllustration className="w-6 h-6" />
          <p className="font-display text-base font-semibold text-[#30364D] dark:text-[#FFD6E8]">
            {t.about.madeWithLove}
          </p>
          <HeartIllustration className="w-6 h-6" />
          <SparklesIllustration className="w-6 h-6" />
        </div>
      </section>

      {/* Architecture Transparency */}
      <section className="space-y-4">
        <h3 className="font-display text-lg font-bold text-[#30364D] dark:text-white">
          {t.about.techTitle}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-3xl bg-white dark:bg-[#1B2032] border border-[#DCEEFF] dark:border-[#28304A] space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#DCEEFF] dark:bg-[#23324E] text-[#30364D] dark:text-[#DCEEFF] flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <h4 className="font-display text-sm font-bold text-[#30364D] dark:text-white">
              {t.about.noDbTitle}
            </h4>
            <p className="text-xs text-[#5A6382] dark:text-[#A4B0D1] leading-relaxed">
              {t.about.noDbDesc}
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-[#1B2032] border border-[#DCEEFF] dark:border-[#28304A] space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#FFE0EF] dark:bg-[#3A2338] text-[#30364D] dark:text-[#FFD6E8] flex items-center justify-center">
              <Radio className="w-5 h-5" />
            </div>
            <h4 className="font-display text-sm font-bold text-[#30364D] dark:text-white">
              {t.about.webrtcTitle}
            </h4>
            <p className="text-xs text-[#5A6382] dark:text-[#A4B0D1] leading-relaxed">
              {t.about.webrtcDesc}
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-[#1B2032] border border-[#DCEEFF] dark:border-[#28304A] space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#E5F1FF] dark:bg-[#24324E] text-[#30364D] dark:text-[#DCEEFF] flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <h4 className="font-display text-sm font-bold text-[#30364D] dark:text-white">
              {t.about.privacyTitle}
            </h4>
            <p className="text-xs text-[#5A6382] dark:text-[#A4B0D1] leading-relaxed">
              {t.about.privacyDesc}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
