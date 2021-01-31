# Faast

[![Package version](https://img.shields.io/badge/dynamic/json.svg?label=version&url=https%3A%2F%2Fraw.githubusercontent.com%2Fgo-faast%2Ffaast-web%2Fdevelop%2Fpackage.json&query=%24.version&colorB=blue&prefix=v)](https://github.com/citypayorg/faast-web/blob/develop/package.json)
[![GitHub license](https://img.shields.io/github/license/go-faast/faast-web.svg)](https://github.com/citypayorg/faast-web/blob/develop/LICENSE)
[![Build Status](https://travis-ci.com/go-faast/faast-web.svg?branch=develop)](https://travis-ci.com/go-faast/faast-web)
[![Netlify Status](https://api.netlify.com/api/v1/badges/66a9ab90-10e6-407b-a37d-f711bec26609/deploy-status)](https://app.netlify.com/sites/faast/deploys)

A decentralized cryptocurrency portfolio manager and exchange.
분산 된 암호 화폐 포트폴리오 관리자 및 거래소.

<https://defi.citypat.org>

This repository contains code for both the Faast [static website](https://defi.citypat.org) and [single page application](https://defi.citypat.org/app). Both are built using React.
이 저장소에는 Faast [정적 웹 사이트] (https://defi.citypat.org) 및 [단일 페이지 애플리케이션] (https://defi.citypat.org/app)에 대한 코드가 포함되어 있습니다. 둘 다 React를 사용하여 빌드되었습니다.

## Usage

### Prerequisites

[NPM](https://www.npmjs.com/) is required, please see the [website](https://docs.npmjs.com/getting-started/installing-node) for installation instructions.

### Running

This repository includes a prebuilt version of the application located in `dist`. To run it you'll need to install **local-web-server**:
이 저장소에는 'dist'에있는 애플리케이션의 사전 빌드 된 버전이 포함되어 있습니다. 실행하려면 ** local-web-server **를 설치해야합니다.

```bash
npm install local-web-server
```

Then start the application with:

```bash
npm start
```

Then open [https://localhost:8000](https://localhost:8000). To resolve the SSL warning follow [these steps](https://github.com/lwsjs/local-web-server/wiki/How-to-get-the-%22green-padlock%22-using-the-built-in-certificate) to install the certificate.

그런 다음 [https : // localhost : 8000] (https : // localhost : 8000)을 엽니 다. SSL 경고를 해결하려면 [다음 단계] (https://github.com/lwsjs/local-web-server/wiki/How-to-get-the-%22green-padlock%22-using-the-built- in-certificate) 인증서를 설치합니다.

### Building

To build the application, you will need to install all of the modules:

```bash
npm install
```

Build the app:

```bash
npm run build
```

Files will be built to the **dist** folder. They can be served from your machine with:
** dist ** 폴더에 파일이 빌드됩니다. 다음을 사용하여 컴퓨터에서 제공 할 수 있습니다.

```bash
npm start
```

## Contributing

### Development Server

The static website is built using react-static, which uses webpack under the hood. And the single page app is built directly with Webpack. For easier development, both can be run with webpack dev server. This allows live reloading on code changes. To start both dev servers behind a frontend proxy, run:

정적 웹 사이트는 내부적으로 웹팩을 사용하는 react-static을 사용하여 구축됩니다. 그리고 단일 페이지 앱은 Webpack으로 직접 빌드됩니다. 더 쉬운 개발을 위해 둘 다 웹팩 개발 서버로 실행할 수 있습니다. 이를 통해 코드 변경시 실시간으로 다시로드 할 수 있습니다. 프런트 엔드 프록시 뒤에서 두 개발 서버를 시작하려면 다음을 실행하세요.

```bash
npm run dev
```

Once compiled, open [http://localhost:8000](http://localhost:8080) in your browser.
컴파일이 완료되면 브라우저에서 [http : // localhost : 8000] (http : // localhost : 8080)을 엽니 다.

This concurrently runs the following:
동시에 다음이 실행됩니다.

- `npm run dev:site` -> Start dev server for static website at <http://localhost:3000>
- `npm run dev:app` -> Start dev server for single page app at <http://localhost:8080/app>
- `npm run dev:proxy` -> Provide a proxy to both dev servers at <http://localhost:8000>

#### HTTPS

To run the development server over https use `HTTPS=true npm run dev`
https를 통해 개발 서버를 실행하려면`HTTPS = true npm run dev`를 사용하십시오.

To resolve the SSL warning follow [these steps](https://github.com/lwsjs/local-web-server/wiki/How-to-get-the-%22green-padlock%22-using-the-built-in-certificate).
SSL 경고를 해결하려면 [다음 단계] (https://github.com/lwsjs/local-web-server/wiki/How-to-get-the-%22green-padlock%22-using-the-built- 인증서 내).

or on Google Chrome Browser visit [chrome://flags/#allow-insecure-localhost](chrome://flags/#allow-insecure-localhost) and set the property to `Enabled`.
또는 Google 크롬 브라우저에서 [chrome : // flags / # allow-insecure-localhost] (chrome : // flags / # allow-insecure-localhost)를 방문하여 속성을 '사용'으로 설정합니다.

#### Ngrok

For mobile development you can run the development server behind ngrok by running `npm run ngrok` in a separate terminal.
모바일 개발의 경우 별도의 터미널에서`npm run ngrok`를 실행하여 ngrok 뒤에서 개발 서버를 실행할 수 있습니다.

### Branches

The [OneFlow](http://endoflineblog.com/oneflow-a-git-branching-model-and-workflow) model will be followed as best as possible, with **develop** being the working branch and **master** pointing to the latest release tag.

[OneFlow] (http://endoflineblog.com/oneflow-a-git-branching-model-and-workflow) 모델은 ** develop **이 작업 브랜치이고 ** 마스터가되어 가능한 한 최선을 다할 것입니다. ** 최신 릴리스 태그를 가리 킵니다.

### Testing

Run:

```bash
npm run test
```

### New Currency Checklist

1. Implement the `Wallet` abstraction which specifies how to load balances, generate/sign transactions, etc. (see `src/services/Wallet/lib/Wallet.ts`)
1. 부하 분산, 트랜잭션 생성 / 서명 방법 등을 지정하는 '월렛'추상화를 구현합니다 ( 'src / services / Wallet / lib / Wallet.ts'참조).
    - If the currency is Bitcoin based and has bitcore support, you can implement `BitcoreWallet` instead. For an example refer to one of the existing implementations for Bitcoin/Litecoin.
    -통화가 비트 코인 기반이고 비트 코어를 지원하는 경우 대신 'BitcoreWallet'을 구현할 수 있습니다. 예를 들어 Bitcoin / Litecoin에 대한 기존 구현 중 하나를 참조하십시오.
1. Update `src/services/Wallet/lib/WalletSerializer.ts`
1.`src / services / Wallet / lib / WalletSerializer.ts` 업데이트
1. Update `src/utilities/walletIcon.js`
1.`src / utilities / walletIcon.js` 업데이트
1. Update `src/app/components/ConfirmTransactionModal/index.jsx`
1.`src / app / components / ConfirmTransactionModal / index.jsx` 업데이트
1. Update explorer URLs `src/config/index.js`
1. 탐색기 URL`src / config / index.js` 업데이트
1. If hardware wallet based:
    - Update `src/app/actions/connectHardwareWallet.js`
    - Add default derivation path `src/config/walletTypes.js`
    - If export flow differs from Bitcoin, add instruction override in `src/app/components/HardwareWalletModal/ConnectionInstructions.jsx`
1. 하드웨어 지갑 기반의 경우 :
    -`src / app / actions / connectHardwareWallet.js` 업데이트
    -기본 파생 경로`src / config / walletTypes.js` 추가
    -내보내기 흐름이 Bitcoin과 다른 경우`src / app / components / HardwareWalletModal / ConnectionInstructions.jsx`에 명령 재정의 추가
1. If not hardware wallet based:
    - Add new access tile `src/app/components/Access`
    - Create custom action to connect to the wallet `src/app/actions/access.js`
  1. 하드웨어 지갑 기반이 아닌 경우 :
    -새 액세스 타일`src / app / components / Access` 추가
    -지갑`src / app / actions / access.js`에 연결하기위한 커스텀 액션 생성

## Security

Faast is a fully client side application. Faast is never in control of user funds, and private keys never leave the browser, they are only used to sign transactions. This is similar to myetherwallet.com
Faast는 완전한 클라이언트 측 응용 프로그램입니다. Faast는 사용자 자금을 제어하지 않으며 개인 키는 브라우저를 떠나지 않으며 트랜잭션 서명에만 사용됩니다. 이것은 myetherwallet.com과 유사합니다.

Faast never stores, transmits or otherwise knows of private keys. If you are interesting in auditing this, you can find the wallet handling logic located in src/services/Wallet.
Faast는 개인 키를 저장, 전송 또는 알지 못합니다. 감사에 관심이 있다면 src / services / Wallet에있는 지갑 처리 로직을 찾을 수 있습니다.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
이 프로젝트는 MIT 라이선스에 따라 라이선스가 부여되었습니다. 자세한 내용은 [LICENSE] (LICENSE) 파일을 참조하세요.
