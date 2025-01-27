import React, { useState } from 'react';

const UrlForm = ({ onSubmit }) => {
  const [originalUrl, setoriginalUrl] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(originalUrl);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name='originalUrl'
        type="text"
        value={originalUrl}
        onChange={(e) => setoriginalUrl(e.target.value)}
        placeholder="Enter long URL"
      />
      <button type="submit">Shorten</button>
    </form>
  );
};

export default UrlForm;
