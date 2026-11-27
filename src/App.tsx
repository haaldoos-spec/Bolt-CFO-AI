import { useApp } from './store/AppContext';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { Background, Confetti, Toast } from './components/ui';
import { SessionFlow } from './components/SessionFlow';
import { PassBuilder, PassDraftPill } from './components/PassBuilder';
import { ExerciseEditor } from './components/ExerciseEditor';
import { Home } from './views/Home';
import { Places } from './views/Places';
import { Training } from './views/Training';
import { Profile } from './views/Profile';
import { Mamma } from './views/Mamma';
import { Login } from './views/Login';
import { useAuth } from './lib/auth';

export default function App() {
  const { status } = useAuth();
  if (status.state === 'loading') return <Background />;
  if (status.state === 'anon') return (<><Background /><Login /></>);
  return status.role === 'mamma' ? <MammaApp /> : <OwnerApp />;
}

// Mammas avskalade app: bara Mamma-vyn, inga andra flikar eller overlays.
function MammaApp() {
  return (
    <>
      <Background />
      <div className="mx-auto min-h-[100dvh] max-w-lg px-4 pb-10 pt-[calc(env(safe-area-inset-top)+24px)]">
        <Mamma />
      </div>
    </>
  );
}

function OwnerApp() {
  const { tab } = useApp();
  return (
    <>
      <Background />
      <div className="mx-auto min-h-[100dvh] max-w-lg pb-[calc(env(safe-area-inset-bottom)+110px)]">
        <Header />
        <main key={tab} className="page-in px-4 pt-5">
          {tab === 'home' && <Home />}
          {tab === 'map' && <Places />}
          {tab === 'training' && <Training />}
          {tab === 'profile' && <Profile />}
          {tab === 'mamma' && <Mamma />}
        </main>
      </div>
      <BottomNav />
      <SessionFlow />
      <PassBuilder />
      <PassDraftPill />
      <ExerciseEditor />
      <Toast />
      <Confetti />
    </>
  );
}
