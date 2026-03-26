import { useEffect, useRef } from 'react';
import { loginWithMicrosoft } from '../../services/loginApi';
import { msalInstance, msalReady } from '../../services/msalinstance';

export default function MicrosoftCallback() {
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const handle = async () => {
      await msalReady;
      // If loaded inside a popup, MSAL handles it automatically — just return
      if (window.opener) {
        await msalInstance.handleRedirectPromise();
        return; // popup closes itself, parent gets the token ✅
      }
      // Redirect flow (Edge/Safari)
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