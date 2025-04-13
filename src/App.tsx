import React, { Suspense } from 'react';
import { SearchProvider } from './context/SearchContext';
import { ThemeProvider } from './context/ThemeContext';
import MainLayout from './components/layout/MainLayout';
import LoadingSpinner from './components/common/LoadingSpinner';
import { AuthProvider } from './context/AuthContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Lazy load pages
const SearchPage = React.lazy(() => import('./pages/SearchPage'));
const ResultImagesPage = React.lazy(() => import('./pages/ResultImagesPage'));

// Loading fallback component
const PageLoader: React.FC = () => (
  <div className="flex items-center justify-center min-h-screen">
    <LoadingSpinner size="lg" />
  </div>
);

const App: React.FC = () => {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <SearchProvider>
            <MainLayout>
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<SearchPage />} />
                  <Route path="/images" element={<ResultImagesPage />} />
                </Routes>
              </Suspense>
            </MainLayout>
          </SearchProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
};

export default App;
