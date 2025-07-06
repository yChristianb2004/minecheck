export interface UsernameResult {
  username: string;
  isAvailable: boolean;
  isChecking: boolean;
  error?: string;
}

export interface MinecraftProfile {
  id: string;
  name: string;
}