import { useEffect } from 'react';
import { useUiStore, useProgressStore } from './stores';
import { HomeScreen } from './components/screens/HomeScreen';
import { QuestListScreen } from './components/screens/QuestListScreen';
import { QuestPlayScreen } from './components/screens/QuestPlayScreen';
import { CollectionScreen } from './components/screens/CollectionScreen';
import { DailyChallengeScreen } from './components/screens/DailyChallengeScreen';

export function App() {
  const currentScreen = useUiStore((s) => s.currentScreen);
  const initProgress = useProgressStore((s) => s.initProgress);

  useEffect(() => {
    initProgress();
  }, [initProgress]);

  return (
    <div className="min-h-screen bg-gray-100">
      {currentScreen === 'home' && <HomeScreen />}
      {currentScreen === 'quest-list' && <QuestListScreen />}
      {currentScreen === 'quest-play' && <QuestPlayScreen />}
      {currentScreen === 'collection' && <CollectionScreen />}
      {currentScreen === 'daily-challenge' && <DailyChallengeScreen />}
    </div>
  );
}
