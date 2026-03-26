import { useEffect, useRef } from 'react';
import { loginWithMicrosoft } from '../../services/loginApi';
import { msalInstance, msalReady } from '../../services/msalinstance';
import { setTokens } from '../../services/TokenManager';

export default function MicrosoftCallback() {
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const handle = async () => {
      try {
        await msalReady;
        const result = await msalInstance.handleRedirectPromise();
        if (result?.accessToken) {
          const data = await loginWithMicrosoft(result.accessToken);
          // Save tokens exactly like Google/Facebook do
          setTokens(data);
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('access_token', data.access_token);
          if (data.refresh_token) localStorage.setItem('refresh_token', data.refresh_token);
          localStorage.setItem('user', JSON.stringify(data.user));
          localStorage.setItem('subscription_tier', data.user.subscription_tier || '');
          localStorage.setItem('user_id', data.user.user_id);
          localStorage.setItem('userEmail', data.user.email);
          localStorage.setItem('userName', data.user.name || '');
          window.location.href = '/';
        } else {
          window.location.href = '/';
        }
      } catch {
        window.location.href = '/?error=microsoft_login_failed';
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