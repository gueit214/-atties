# Atties - Frontend

## Links

### [Ver 1.0 Github](https://github.com/Att-ies)
### [Ver 2.0 서비스 링크](https://atties.vercel.app/)


# Atties Ver.2.0 리팩토링 및 성능 개선
## 1. 렌더링 최적화

- `React.memo`를 활용하여 이전에 렌더링한 결과를 메모이징하고, 이후 동일한 props로 렌더링 되는 경우 재사용하여 렌더링을 최적화하였습니다.
- 또한, react-query의 기본 옵션인 `refetchOnWindowFocus`를 해제하여 브라우저 클릭 시 다시 렌더링되는 현상을 해결하였습니다.
- 기존 서비스(좌), 리팩토링 후 서비스(우)
![Jun-15-2023 11-35-12](https://github.com/guesung/atties-ver2.0/assets/62178788/fee8f644-32e8-43ea-9300-1246c36929f4)


## 2. Server Side에서 Data 받아오기

|기존서비스|리팩토링 후 서비스|
|:-----|-----:|
|<img width="862" alt="스크린샷 2023-06-14 오후 7 04 21" src="https://github.com/guesung/atties-ver2.0/assets/62178788/9004ea11-f1ba-4538-9ae0-371faf9400a3"> | <img width="864" alt="스크린샷 2023-06-14 오후 7 03 43" src="https://github.com/guesung/atties-ver2.0/assets/62178788/658c3676-6ec6-4c89-8e24-2cdde1f896d2"> |

- 서버로부터 HTML을 받아온 이후에, 데이터를 동기적으로 가져오는 기존의 방식(CSR)을 개선하였습니다.
- 서버에서 먼저 데이터를 불러와 HTML을 생성하고, 이를 클라이언트에 전달하는 서버 사이드 렌더링(SSR) 방식을 사용합니다.
- 홈 화면과 프로필 페이지 같은 페이지가 자주 변경되지 않는 부분에 대해서는, 클라이언트에서 데이터를 받아오는 것보다 서버에서 미리 데이터를 받아오는 방식이 더 적합하다고 판단하였습니다.

## 3. 토큰 저장 위치 변경

- 기존에는 localStorage에 Access Token과 Refresh Token을 저장하는 방식을 사용했으나, 이 방식은 XXR 공격에 대해 매우 취약하다는 결정적인 단점이 있었습니다.
- 이를 보완하기 위해, Access Token과 Refresh Token을 http only Cookie에 저장하도록 방식을 개선하였습니다.
- [이러한 고민의 흔적](https://github.com/guesung/atties-ver2.0/issues/11)

## 4. 반응형 개선

|기존서비스|리팩토링 후 서비스|
|:-----|-----:|
|<img  src="https://github.com/guesung/atties-ver2.0/assets/62178788/32eb94f1-c2c3-4e8c-b2e1-de4fbe18ffb3" /> |<img  src="https://github.com/guesung/atties-ver2.0/assets/62178788/f48ef3d5-28d6-4f94-ad75-3dd20e9657a1" /> |

- px 단위를 rem으로 변경하고, `휴대폰 가로 사이즈`에 맞게 화면을 보여주기 위해 반응형 디자인을 구현하였습니다.

---

# 성능 향상 결과

### 기존 LCP 3.5초 → 1.1초로 향상

|기존서비스|리팩토링 후 서비스|
|:-----|-----:|
|<img  src="https://github.com/guesung/atties-ver2.0/assets/62178788/d2333521-5ce5-408b-8002-10883fad8097" /> |<img  src="https://github.com/guesung/atties-ver2.0/assets/62178788/bca19442-d8e1-4abb-b234-4437ef71b0f9" /> |


### 기존 로그인 로딩 시간 7초 → 3초로 향상
|기존서비스|리팩토링 후 서비스|
|:-----|-----:|
|<video  autoplay src="https://github.com/guesung/atties-ver2.0/assets/62178788/64c2c2eb-7481-4503-85b4-3f426338d7b5"></video> | <video  autoplay src="https://github.com/guesung/atties-ver2.0/assets/62178788/0a4cbdb5-9249-4e79-a5fe-6dff77ea9cfa"></video>|


---

# Atties Team 문서

## 컨밴션 🌈

[📄 네이밍 컨벤션](https://www.notion.so/guesung/f6bf625c22514d8a8a9793d551935a10?pvs=4)

[📄 타입스크립트 컨밴션](https://www.notion.so/guesung/typescript-convention-e335832c4c0e420f85a9f7de6b5d0db1?pvs=4)

[📄 Git 컨밴션](https://www.notion.so/guesung/PR-59399896b4504c4ea5703b8c3ac2b874)

## 프로젝트 기술스택 🛠

![](https://i.imgur.com/KN4SEfW.png)

- **Language :** [Typescript](https://www.typescriptlang.org/)
- **Framework :** [Next.js](https://nextjs.org/)
- **Package Manager :** [yarn-berry](https://yarnpkg.com/)
- **State Management :** [React Query](https://react-query.tanstack.com/), [Redux Toolkit](https://redux-toolkit.js.org/)
- **Styling :** [TailwindCSS](https://tailwindcss.com/), [tailwind-styled-components](https://www.npmjs.com/package/tailwind-styled-components), [HeadlessUI](https://headlessui.com/), [Swiper](https://swiperjs.com/react)
- **Forms :** [React Hook Form](https://react-hook-form.com/)
- **Formatter :** [ESLint](https://eslint.org/), [Prettier](https://prettier.io/)
- **Library :** [axios](https://axios-http.com/), [sockJS](https://github.com/sockjs/sockjs-client), [momentJS](https://momentjs.com/)

## 우리의 성장기

[🗝️ 카카오, 네이버 소셜 로그인](https://www.notion.so/guesung/social-login-4d9321791dec42a6a98590cf18a0dbb5?pvs=4)

[🧿 axios instance로 api 요청 전후 및 error 핸들링](https://www.notion.so/guesung/Axios-instance-53e9a3c00f354b8c92b44728f9987b3c?pvs=4)

[💧 react-query 제대로 알고 사용하기 ](https://www.notion.so/guesung/react-query-e32b280a1b184cd7b5ba699286a20604?pvs=4)

[🐽 Intersection Observer API와 react-query 사용하여 무한스크롤 구현](https://www.notion.so/guesung/Intersection-Observer-API-react-query-7e95dd67a0aa4830be0685e74e8093f0)

[🎨 tailwind-styled-component](https://www.notion.so/guesung/tailwind-styled-components-e8b95344e93d4ca88979b702deb7027e)

[💬 채팅, stompjs, socketjs](https://www.notion.so/guesung/Stomp-Soket-js-51dfc4ba27f94026bec470da0170ea01?pvs=4)

[🧡 스토리북 in nextjs and tailwind](https://www.notion.so/guesung/story-book-with-nextjs-and-tailwind-280f912916084649ad8d73e4e7b75abf?pvs=4)

[👣 @types 폴더에서 전역 type 정의](https://www.notion.so/guesung/types-type-7aeefdf592894c0d9a6f99993ba2a75e?pvs=4)

## 폴더 구조 📁

### 전체 구조

    ├── .yarn
    ├── .storybook              #
    ├── public                  #
    ├── src                     #
        ├── @types              #
        ├── apis                #
        ├── components          #
            ├── common          #
            ├── auction         #
            ├── auth            #
            └── ...             #
        ├── features            #
        ├── hooks               #
        ├── pages               #
        ├── stories             #
        ├── styles              #
        ├── utils               #
    ├── README.md               #
    └── ...

### apis

Api 요청과 관련한 함수들 입니다.

    .
    ├── apis
    │   ├── _axios
    │       └── instance.ts      # api instance를 만들어서 사용합니다.
    │   ├── admin                # api class를 만들고 비동기 함수들을 작성합니다.
    │   ├── artwork
    │   ├── aution
    └── ...

### components

공통 컴포넌트와 페이지 단위로 필요한 컴포넌트로 분리하여 관리합니다.

    .
    ├── ...
    ├── components
    │ ├── common
    │   ├── Button
    │   ├── Layout
    │   ├── Input
    │   ├── Modal
    │   └── ...
    │ ├── auction
    │ ├── chat
    │ ├── exhibition
    │ └── ...
    └── ...

### hooks

useQuery, useMutation으로 mapping한 query, mutation hook들과 개별 hook들을 작성합니다.

      .
    ├── ...
    ├── hooks
    │ ├── mutations
    │ ├── queries
    │ ├── useCountDown.ts
    │ ├── useInterval.ts
    │ └── ...
    └── ...
