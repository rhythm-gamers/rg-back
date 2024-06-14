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

export const rhythmGameList = [
  774171, // 뮤즈대시
  774171, // 리듬닥터
  960170, // 디맥
  977950, // 얼불춤
  1477590, // 투온
  1802720, // 식스타
];
