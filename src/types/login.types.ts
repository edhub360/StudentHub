export interface User {
  user_id: string;
  email: string;
  name?: string;
  subscription_tier?: string | null;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  user: User;
  is_first_login: boolean;
}

export interface LoginFormValues {
  email: string;
  password: string;
}

export interface LoginScreenProps {
  onLoginSuccess?: (
    token: string,
    userId: string,
    hasSubscription: boolean
  ) => void;
  onSwitchToRegister?: () => void;
}

export interface GoogleLoginButtonProps {
  onGoogleSuccess: (data: LoginResponse) => void;
  onError: (error: string) => void;
  disabled?: boolean;
}
