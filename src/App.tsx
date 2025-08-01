import { Routes, Route } from 'react-router-dom';
import {
  Header,
  Main,
  Footer,
  NotFound,
  About,
  CharactersPage,
} from './components';

import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import './App.css';
import { useEffect } from 'react';
import { useUIStore } from './stores/useUIStore';
const App = () => {
  const theme = useUIStore((state) => state.theme);
  useEffect(() => {
    document.body.className = theme;
  }, [theme]);
  return (
    <ErrorBoundary>
      <Header title="Rick and Morty API" />
      <Main>
        <Routes>
          <Route path="/" element={<CharactersPage />} />
          <Route path="/:page" element={<CharactersPage />} />
          <Route path="/:page/:characterId" element={<CharactersPage />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Main>
      <Footer />
    </ErrorBoundary>
  );
};

export default App;
