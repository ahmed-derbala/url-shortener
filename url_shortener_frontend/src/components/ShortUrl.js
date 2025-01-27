import React from 'react';

const ShortUrl = ({ shortUrl }) => (
  <div>
    {shortUrl && (
      <p>
        Shortened URL: <a href={shortUrl}>{shortUrl}</a>
      </p>
    )}
  </div>
);

export default ShortUrl;
