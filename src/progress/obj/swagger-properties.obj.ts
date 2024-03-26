const practiceProperty = (
  title: string,
  level: number,
  goalRate: string,
  keyNum: number,
) => {
  return {
    type: "object",
    properties: {
      currentRate: { type: "string", example: "90.11" },
      updatedAt: { type: "string", example: "2024-03-23T04:16:36.000Z" },
      practice: {
        type: "object",
        properties: {
          title: { type: "string", example: title },
          level: { type: "number", example: level },
          goalRate: { type: "string", example: goalRate },
          keyNum: { type: "number", example: keyNum },
        },
      },
    },
  };
};

const levelTestProperty = (title: string, level: number, keyNum: number) => {
  return {
    type: "object",
    properties: {
      currentRate: { type: "string", example: "90.11" },
      updatedAt: { type: "string", example: "2024-03-23T04:16:36.000Z" },
      levelTest: {
        type: "object",
        properties: {
          title: { type: "string", example: title },
          level: { type: "number", example: level },
          keyNum: { type: "number", example: keyNum },
        },
      },
    },
  };
};

const getAllOnesProperty = (type: string, keynum: number) => {
  return {
    type: "array",
    items: {
      oneOf:
        type === "practice"
          ? [
              practiceProperty("practice1", 4, "92.3", keynum),
              practiceProperty("practice2", 4, "92.6", keynum),
              practiceProperty("practice3", 4, "92.1", keynum),
            ]
          : [
              levelTestProperty("test1", 4, keynum),
              levelTestProperty("test1", 4, keynum),
            ],
    },
  };
};

export const getAllOnesPropertyWithKeynum = (type: string) => {
  return {
    type: "object",
    properties: {
      4: getAllOnesProperty(type, 4),
      5: getAllOnesProperty(type, 5),
    },
  };
};

const rankingProperty = (rate: string, updatedAt: string, name: string) => {
  return {
    type: "object",
    properties: {
      currentRate: { type: "string", example: rate },
      updatedAt: { type: "Date", example: updatedAt },
      user: {
        type: "object",
        properties: {
          nickname: { type: "string", example: name },
        },
      },
    },
  };
};

export const getRankingProperties = () => {
  return {
    type: "array",
    items: {
      oneOf: [
        rankingProperty("90.12", "2024-03-23T23:46:32.897Z", "admin"),
        rankingProperty("90.11", "2024-03-23T04:16:36.000Z", "John Doe"),
      ],
    },
  };
};
