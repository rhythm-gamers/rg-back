import SteamAuth from "node-steam-openid";

export const steam = new SteamAuth({
  realm: process.env.STEAM_REALM,
  returnUrl: process.env.STEAM_RETURN_URL,
  apiKey: process.env.STEAM_API_KEY,
});
export const museDashId = 774171;
export const rhythmDoctorId = 774181;
export const djMaxId = 960170;
export const adofaiId = 977950;
export const ez2onRebootRId = 1477590;
export const sixtarGateId = 1802720;
export type UserObject = {
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
