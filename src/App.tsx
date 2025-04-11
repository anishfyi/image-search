import React, { Suspense } from 'react';
import { SearchProvider } from './context/SearchContext';
import MainLayout from './components/layout/MainLayout';
import LoadingSpinner from './components/common/LoadingSpinner';
import { AuthProvider } from './context/AuthContext';
import { BrowserRouter as Router } from 'react-router-dom';

// Lazy load pages
const SearchPage = React.lazy(() => import('./pages/SearchPage'));
const ResultsPage = React.lazy(() => import('./pages/ResultsPage'));

// Loading fallback component
const PageLoader: React.FC = () => (
  <div className="flex items-center justify-center min-h-screen">
    <LoadingSpinner size="lg" />
  </div>
);

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <SearchProvider>
          <MainLayout>
            <Suspense fallback={<PageLoader />}>
              <SearchPage />
              <ResultsPage />
            </Suspense>
          </MainLayout>
        </SearchProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
