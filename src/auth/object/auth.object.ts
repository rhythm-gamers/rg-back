export type SteamUserObject = {
  _json: Record<string, any>;
  steamid: string;
  username: string;
  name: string;
  profile: string;
  avatar: {
    small: string;
    medium: string;
    large: string;
  };
};
