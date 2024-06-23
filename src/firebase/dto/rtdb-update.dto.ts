export interface RtdbUpdateDto {
  [key: number]: Record<string, number | string>;
}

/* 이런식으로 사용 가능
const data: RtdbUpdateDto = {
  common: {
    djmax: true,
    ex2on: true,
  },
  epic: {
    wot: true,
    r6s: true,
  },
  legendary: {
    carro: true,
    ts: true,
  }
};
*/
