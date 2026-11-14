import React from 'react';
import { SetorawonProvider, useSetorawon } from './context/SetorawonContext';
import { Layout } from './components/Layout';
import { HomePage } from './components/HomePage';
import { ChatPage } from './components/ChatPage';
import { VoiceCallPage } from './components/VoiceCallPage';
import { VideoCallPage } from './components/VideoCallPage';
import { FileSharingPage } from './components/FileSharingPage';
import { SettingsPage } from './components/SettingsPage';
import { AboutPage } from './components/AboutPage';
import { NavRoute } from './types/app';

const SetorawonRouter: React.FC = () => {
  const { route } = useSetorawon();

  return (
    <Layout>
      {route === NavRoute.HOME && <HomePage />}
      {route === NavRoute.CHAT && <ChatPage />}
      {route === NavRoute.VOICE_CALL && <VoiceCallPage />}
      {route === NavRoute.VIDEO_CALL && <VideoCallPage />}
      {route === NavRoute.FILE_SHARING && <FileSharingPage />}
      {route === NavRoute.SETTINGS && <SettingsPage />}
      {route === NavRoute.ABOUT && <AboutPage />}
    </Layout>
  );
};

export default function App() {
  return (
    <SetorawonProvider>
      <SetorawonRouter />
    </SetorawonProvider>
  );
}
