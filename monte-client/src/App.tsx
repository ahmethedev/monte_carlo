
import { Outlet } from 'react-router-dom';
import { GlobalStateProvider } from './contexts/GlobalStateContext';
import { useGlobalState } from './hooks/useGlobalState';
import Loading from './components/Loading';

const AppContent = () => {
  const { isLoading } = useGlobalState();

  return (
    <>
      {isLoading && <Loading />}
      <Outlet />
    </>
  );
};

function App() {
  return (
    <GlobalStateProvider>
      <AppContent />
    </GlobalStateProvider>
  );
}

export default App;