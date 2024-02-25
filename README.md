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
bun start:dev
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

# Databse
DATABASE_HOST=<database_host> // 실제 데이터베이스 주소. 개발시에는 localhost
DATABASE_PORT=<database_port> // 데이터베이스 접속 포트. 기본은 3306, 설정에 따라 다름
DATABASE_USER=<database_user> // 데이터베이스에 로그인 하는 유저의 id. 대부분 root
DATABASE_PASS=<database_password> // 데이터베이스에 로그인 하는 유저의 password.
DATABASE_DATABASE=<database_name> // 접속하려는 데이터베이스의 이름.

IS_DEVELOPE=dev // 개발시에는 dev, 서비스시에는 prod
```