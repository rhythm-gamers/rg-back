export const getSearchPostsSchema = [
  [
    {
      id: 2,
      title: "예제 제목입니다",
      views: 12,
      createdAt: "2024-09-01T06:20:26.710Z",
      updatedAt: "2024-09-01T06:20:26.710Z",
      user: {
        id: 10,
        nickname: "리붕쿤",
      },
      commentCount: 3,
    },
    {
      id: 7,
      title: "예제 제목입니다2",
      views: 14,
      createdAt: "2024-09-01T06:30:26.710Z",
      updatedAt: "2024-09-01T06:40:26.710Z",
      user: {
        id: 10,
        nickname: "리붕쿤",
      },
      commentCount: 3,
    },
  ],
  10,
];

export const getPagenatedPostsSchema = [
  [
    {
      id: 83,
      title: "string123914450326857",
      views: 0,
      createdAt: "2024-08-31T03:56:47.859Z",
      updatedAt: "2024-08-31T03:56:47.859Z",
      user: {
        id: 1,
        nickname: "admin",
      },
      commentsCount: 0,
    },
    {
      id: 82,
      title: "string12391440326857",
      views: 0,
      createdAt: "2024-08-31T03:56:46.240Z",
      updatedAt: "2024-08-31T03:56:46.240Z",
      user: {
        id: 1,
        nickname: "admin",
      },
      commentsCount: 0,
    },
  ],
  9,
];

export const getPostSchema = {
  id: 67,
  title: "string",
  content: "string",
  views: 0,
  createdAt: "2024-08-30T22:14:31.265Z",
  updatedAt: "2024-08-30T22:14:31.265Z",
  user: {
    id: 6,
    nickname: "admin11",
  },
  comments: [
    {
      id: 11,
      content: "string",
      parentId: 0,
      createdAt: "2024-08-30T22:53:58.004Z",
      updatedAt: "2024-08-30T22:53:58.004Z",
      user: {
        id: 1,
        nickname: "admin",
      },
      likeList: [],
      children: [
        {
          id: 15,
          content: "ㅁㄴㅇㄻㄴㅇㄹ123",
          parentId: 11,
          createdAt: "2024-08-31T04:12:42.925Z",
          updatedAt: "2024-08-31T04:12:42.925Z",
          user: {
            id: 1,
            nickname: "admin",
          },
          likeList: [],
          children: [],
        },
        {
          id: 16,
          content: "ㅁㄴㅇㄻㄴㅇㄹ123",
          parentId: 13,
          createdAt: "2024-08-31T04:12:46.122Z",
          updatedAt: "2024-08-31T04:12:46.122Z",
          user: {
            id: 1,
            nickname: "admin",
          },
          likeList: [],
          children: [],
        },
      ],
    },
    {
      id: 22,
      content: "ㅁㄴㅇㄻㄴㅇㄹ1234561117",
      parentId: 0,
      createdAt: "2024-08-31T04:19:48.287Z",
      updatedAt: "2024-08-31T04:19:48.287Z",
      user: {
        id: 1,
        nickname: "admin",
      },
      likeList: [],
      children: [],
    },
  ],
  commentsCount: 11,
};
