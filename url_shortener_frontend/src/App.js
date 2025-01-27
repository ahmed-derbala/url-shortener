import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UrlForm from './components/UrlForm';
import ShortUrl from './components/ShortUrl';
import OriginalUrlRedirect from './components/OriginalUrlRedirect';
import { shortenUrl } from './services/api';

const App = () => {
  const [shortUrl, setShortUrl] = useState('');

  const handleUrlSubmit = async (longUrl) => {
    const result = await shortenUrl(longUrl);
    setShortUrl(result);
  };

  return (
    <Router>
      <div>
        <h1>URL Shortener</h1>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <UrlForm onSubmit={handleUrlSubmit} />
                <ShortUrl shortUrl={shortUrl} />
              </>
            }
          />
          <Route path="/:shortId" element={<OriginalUrlRedirect />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
