export const metadataProperty = (
  id: number,
  title: string,
  mustread: boolean,
) => {
  return {
    id: { type: "integer", example: id },
    title: { type: "string", example: title },
    mustRead: { type: "boolean", example: mustread },
  };
};

export const metadataKeyProperty = (
  id: number,
  title: string,
  mustread: boolean,
) => {
  return {
    type: "array",
    items: {
      type: "object",
      properties: metadataProperty(id, title, mustread),
    },
  };
};

export const metadataOkProperty = () => {
  return {
    mustread: metadataKeyProperty(10, "asdf", true),
    a: {
      type: "array",
      items: {
        oneOf: [
          {
            type: "object",
            properties: metadataProperty(10, "abcd", true),
          },
          {
            type: "object",
            properties: metadataProperty(4, "asdf", false),
          },
        ],
      },
    },
    ㄱ: metadataKeyProperty(2, "가나다라라", false),
  };
};

export const wikiProperties = () => {
  return {
    title: { type: "string", example: "test" },
    mustRead: { type: "boolean", example: false },
    content: { type: "string", example: "테스트용 입니다" },
  };
};

export const wikiCreateProperties = () => {
  return {
    title: { type: "string", example: "abcdefg" },
    letter: { type: "string", example: "a" },
    content: { type: "string", example: "테스트용" },
    mustRead: { type: "boolean", example: true },
    id: { type: "number", example: 8 },
  };
};
