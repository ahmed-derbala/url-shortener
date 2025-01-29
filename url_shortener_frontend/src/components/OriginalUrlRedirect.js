import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getOriginalUrl } from '../services/api';

const OriginalUrlRedirect = () => {
  const { shortId } = useParams();
  const [originalUrl, setOriginalUrl] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOriginalUrl = async () => {
      let result = await getOriginalUrl(shortId);

      if (result) {
        setOriginalUrl(result);
        if (!/^https?:\/\//i.test(result)) {
          result = "https://" + result;
      }
         window.location.href = result; // Redirect to original URL

      } else {
        setError('URL not found');
      }
    };

    fetchOriginalUrl();
  }, [shortId]);

  if (error) {
    return <p>{error}</p>;
  }

};

export default OriginalUrlRedirect;
