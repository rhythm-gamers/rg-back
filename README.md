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
nvm install
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
