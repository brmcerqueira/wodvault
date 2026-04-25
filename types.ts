export enum WebSocketMessageKind {
  Observe,
  Character,
}

export type WebSocketMessage<T> = { kind: WebSocketMessageKind; data: T };

export type DiscordToken = {
  access_token: string;
  refresh_token: string;
  scope: string;
  token_type: string;
  expires_at: Date;
};

export type DiscordUser = {
  id: string;
  username: string;
  avatar: string;
  discriminator: string;
  public_flags: number;
  flags: number;
  banner: string;
  accent_color: string;
  global_name: string;
  avatar_decoration_data: string;
  collectibles: string;
  display_name_styles: string;
  banner_color: string;
  clan: string;
  primary_guild: string;
  mfa_enabled: boolean;
  locale: string;
  premium_type: number;
  email: string;
  verified: boolean;
};

export const discordClientId = "584804926488707083";