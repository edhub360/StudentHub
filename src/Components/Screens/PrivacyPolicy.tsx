import { useEffect } from 'react';

const PrivacyPolicy: React.FC = () => {
  useEffect(() => {
    window.location.href = '/privacy-policy.html';
  }, []);
  return null;
};

export default PrivacyPolicy;
