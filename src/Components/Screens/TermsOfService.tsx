import { useEffect } from 'react';

const TermsOfService: React.FC = () => {
  useEffect(() => {
    window.location.href = '/terms-of-service.html';
  }, []);
  return null;
};

export default TermsOfService;
