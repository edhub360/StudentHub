import { useEffect } from 'react';
import { PublicClientApplication } from '@azure/msal-browser';
import { MICROSOFT_CLIENT_ID } from '../../constants/login.constants';
import { loginWithMicrosoft } from '../../services/loginApi';

const msalInstance = new PublicClientApplication({
  auth: {
    clientId: MICROSOFT_CLIENT_ID,
    authority: 'https://login.microsoftonline.com/common',
    redirectUri: `${window.location.origin}/auth/microsoft`,
  },
  cache: { cacheLocation: 'sessionStorage' },
});

export default function MicrosoftCallback() {
  useEffect(() => {
    const handle = async () => {
      await msalInstance.initialize();
      const result = await msalInstance.handleRedirectPromise();
      if (result?.accessToken) {
        try {
          const data = await loginWithMicrosoft(result.accessToken);
          // Save tokens same way your app does after login
          localStorage.setItem('access_token', data.access_token);
          localStorage.setItem('refresh_token', data.refresh_token);
          window.location.href = '/';
        } catch {
          window.location.href = '/?error=microsoft_login_failed';
        }
      } else {
        // No token — redirect back to login
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
