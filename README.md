# 개발 서버 실행

## 1. node 버전 변경

### 1.1. nvm 설치 (설치 되어있다면 다음 단계)

#### Window

> 아래의 링크에서 nvm-setup.exe를 다운 및 실행
>
> https://github.com/coreybutler/nvm-windows/releases

#### WSL

```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
```

#### MAC

```
brew install nvm
```

### 1.2. node 버전 변경 및 bun 설치

```
nvm install 20.10.0 // 우리는 20.10.0을 사용한다.
nvm use
npm i -g bun
```

---

## 2. 의존성 설치

```
bun i
```

---

## 3. 서버 실행

```
cd server
pm2 start "bun start"
```

### 3.1. 서버 재실행
```
pm2 restart "bun start"
```
---


## 4. Env 설정

### 4.1. env 파일 생성
```
touch .env
```

### 4.2. env 파일 수정
```
# Steam
STEAM_REALM=<실제 서비스 하는 도메인>
STEAM_RETURN_URL=<실제 서비스 하는 도메인>/auth/steam/authenticate
STEAM_API_KEY=<issued_steam_id>
AFTER_REDIRECT_URL=<프론트엔드 도메인>

ENCRYPT_TYPE=aes-256-ecb
ENCRYPT_PASSWORD=***
ENCRYPT_SALT=ne**************me

# Databse
DATABASE_HOST=<database_host> # 실제 데이터베이스 주소. 개발시에는 localhost
DATABASE_PORT=<database_port> # 데이터베이스 접속 포트. 기본은 3306, 설정에 따라 다름
DATABASE_USER=<database_user> # 데이터베이스에 로그인 하는 유저의 id. 대부분 root
DATABASE_PASS=<database_password> # 데이터베이스에 로그인 하는 유저의 password.
DATABASE_DATABASE=<database_name> # 접속하려는 데이터베이스의 이름.

IS_DEVELOPE=dev # 개발시에는 dev, 서비스시에는 prod

# Comment Limit
COMMENT_LIMIT=20

# AWS S3
AWS_S3_BUCKET_REGION=ap-northeast-2 # S3 버킷이 있는 지역
AWS_S3_ACCESS_KEY_ID=<access_key> # IAM에서 발급한 버킷 접근 Key
AWS_S3_SECRET_ACCESS_KEY=<secret_access_key> # IAM에서 발급한 버킷 접근 Secret Accecc Key
AWS_S3_BUCKET_NAME=<bucket_name> # S3 버킷 이름
AWS_S3_BUCKER_URL=<bucket_url> # S3 버킷 주소

# token
JWT_SECRET="ivno********njkn"
ACCESS_TOKEN_EXPIRE="2h"
REFRESH_TOKEN_EXPIRT="7d"

# firebase realtime database
# firebase console → service account → create new secret key
FIREBASE_TYPE=<type>
FIREBASE_PROJECT_ID=<project_id>
FIREBASE_PRIVATE_KEY_ID=<private_key_id>
FIREBASE_PRIVATE_KEY="<private_key>"
FIREBASE_CLIENT_EMAIL=<client_email>
FIREBASE_CLIENT_ID=<client_id>
FIREBASE_AUTH_URI=<auth_uri>
FIREBASE_TOKEN_URI=<token_uri>
FIREBASE_AUTH_PROVIDER_X509_CERT_URL=<auth_provider_x509_cert_url>
FIREBASE_CLIENT_X509_CERT_URL=<client_x509_cert_url>
FIREBASE_UNIVERSE_DOMAIN=<universe_domain>
FIREBASE_RTDB_URL=<YOUR_REALTIME_DATABASE_URL>
```

# 메모

## Entity 관련

### CASCADE 설정

e.g.) 
```ts
@OneToOne(() => Practice, (practice) => practice.pattern_info, {
  nullable: true,
  onDelete: 'CASCADE',
})
@JoinColumn()
```

1:n의 관계 - `@OneToMany()/@ManyToOne()`
> many인 쪽에 `onDelete: 'CASCADE'`

> one인 쪽에 `cascade: true`

1:1의 관계 - `@OneToMany()`
> @JoinColumn() 사용한 쪽에 `onDelete: 'CASCADE'`

> 사용하지 않은 쪽에 `cascade: true`


## S3 관련

### 초기화

```ts
s3 = new S3Client({
  region: AWS_S3_BUCKET_REGION,
  credentials: {
    accessKeyId: AWS_S3_ACCESS_KEY_ID,
    secretAccessKey: AWS_S3_SECRET_ACCESS_KEY,
  },
});

s3.send(command);
```

### Command
대부분 `Put(upload or modify)/Get(download)/Delete/Deletes/Copy` 로 해결된다.
```ts
const command = new PutObjectCommand({
  Bucket: '버킷 이름',
  Key: '파일 이름. 디렉터리 경로 포함',
  Body: '파일 그 자체. 업로드에만 필요',
  ContentType?: '파일의 타입. 이미지인가? 압축 파일인가?',
})

const command = new GetObjectCommand({
  Bucket: '버킷 이름',
  Key: '파일 이름. 디렉터리 경로 포함',
})

const command = new CopyObjectCommand({
  Bucket: '버킷 이름',
  Key: '파일 이름. 디렉터리 경로 포함',
  CopySource: '복사할 파일 원본 경로.',
})

const command = new DeleteObjectCommand({
  Bucket: '버킷 이름'
  Key: '파일 이름. 디렉터리 경로 포함',
})

const command = new DeleteObjectsCommand({
  Bucket: '버킷 이름',
  Delete: {
    Objects: [
      { Key: '파일 이름', }, { Key: '파일 이름', }, ..
    ]
  },
})

s3.send(command); // 커맨드 전송
```

## 인가 관련

`@Roles()` 를 통한 인가 기능 추가. 만약 더 추가하고싶은 역할이 있다면 `token-payload.obj.ts`의 enum에 추가하고 `TokenPayload` 클래스의 constructor만 수정해주세용

※ 단, constructor 수정 시 `roles.guard.ts` 로직 수정 필요. 현재는 Admin과 User 2개만 있다 가정하고 만들었음

```ts
1. 권한을 부여하지 않는 경우
  이 경우는 @Roles() 데코레이션을 사용하지 않거나, @Roles() 데코레이터 안에 아무것도 쓰지 않으면 된다.
  e.g.)
  1)
    @Roles()
    async fetchSometing()
  2)
    async fetchSomething()

2. 권한을 부여하는 경우
 이 경우는 @Roles() 데코레이터 안에 원하는 권한을 넣으면 된다.
  e.g.)
    @Roles(Role.Admin)
    async postSomething()

    @Roles(Role.User)
    async fetchSomething()
```
