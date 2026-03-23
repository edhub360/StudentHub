import { useEffect } from 'react';
import { loginWithMicrosoft } from '../../services/loginApi';
import { msalInstance } from '../../services/msalinstance';

export default function MicrosoftCallback() {
  useEffect(() => {
    const handle = async () => {
      await msalInstance.initialize();
      const result = await msalInstance.handleRedirectPromise();
      if (result?.accessToken) {
        try {
          const data = await loginWithMicrosoft(result.accessToken);
          localStorage.setItem('access_token', data.access_token);
          localStorage.setItem('refresh_token', data.refresh_token);
          window.location.href = '/';
        } catch {
          window.location.href = '/?error=microsoft_login_failed';
        }
      } else {
        window.location.href = '/';
      }
    };
    handle();
  }, []);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <p>Completing Microsoft sign-in...</p>
    </div>
  );
}
