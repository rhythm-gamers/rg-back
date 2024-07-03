export interface RtdbUpdateDto {
  [key: number]: Record<string, number | string> | string;
}

/* 이런식으로 사용 가능
const data: RtdbUpdateDto = {
  common: {
    djmax: "2/10",
    ex2on: 40,
  },
  epic: {
    wot: true,
    r6s: true,
  },
  legendary: {
    carro: true,
    ts: true,
  }
  temperator: "qwer",
};
*/
