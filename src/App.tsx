import React, { useState } from 'react';
import MainLayout from './components/layout/MainLayout';
import SearchBar from './components/search/SearchBar';
import GoogleLogo from './components/common/GoogleLogo';

function App() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // TODO: Implement search functionality
    console.log('Searching for:', query);
  };

  return (
    <MainLayout>
      <div className="flex flex-col items-center space-y-8">
        <GoogleLogo size="lg" />
        <SearchBar onSearch={handleSearch} />
      </div>
    </MainLayout>
  );
}

export default App;
