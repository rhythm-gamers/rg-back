export const museDashId = 774171;
export const rhythmDoctorId = 774181;
export const djMaxId = 960170;
export const adofaiId = 977950;
export const ez2onRebootRId = 1477590;
export const sixtarGateId = 1802720;

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
