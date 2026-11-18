import { useApp } from './store/AppContext';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { Background, Confetti, Toast } from './components/ui';
import { SessionFlow } from './components/SessionFlow';
import { Home } from './views/Home';
import { Places } from './views/Places';
import { Training } from './views/Training';
import { Profile } from './views/Profile';

export default function App() {
  const { tab } = useApp();
  return (
    <>
      <Background />
      <div className="mx-auto min-h-[100dvh] max-w-lg pb-[calc(env(safe-area-inset-bottom)+110px)]">
        <Header />
        <main key={tab} className="animate-fade px-4 pt-5">
          {tab === 'home' && <Home />}
          {tab === 'map' && <Places />}
          {tab === 'training' && <Training />}
          {tab === 'profile' && <Profile />}
        </main>
      </div>
      <BottomNav />
      <SessionFlow />
      <Toast />
      <Confetti />
    </>
  );
}
