## Node.js のインストール

### Windows

#### Node.js バージョン管理ツール Volta を使う場合

```bash
winget install -h Volta.Volta -l インストール先ディレクトリ
volta install node
```

#### 素の Node.js を使う場合

```bash
winget install -h OpenJS.NodeJS.LTS -l インストール先ディレクトリ
```

### WSL
#### nvm(node.jsのバージョン管理ツールを使う場合)
WSLの場合だとnode.jsのバージョンが古くてastroが実行できないなんてことも発生するので、以下の手順を踏む。

##### 1.curlでnvmをインストール
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
```
一応、
```bash
command -v nvm
```
を実行して`nvm`と表示されたら成功。

##### 2.最新の安定バージョンをインストールし、それをデフォルトに設定。
```bash
nvm install stable --latest-npm
nvm alias default stable
```
これで一応astroは動くはず。

### その他OS
ググって

## 開発サーバーの実行

```bash
git clone git@github.com:PeaCH-ktq/PeaCH_Game_astro-vue.git
cd Peach_Game_astro-vue
#初回
npm install
npm run dev
#2回目から
npm run dev

表示されるURLを開くとブラウザでPreviewできる
```

## memo

### .gitignore

```
# VSCode
.vscode/
```

## 操作ログ

### init

```bash
npm create astro@latest
    Where should we create your new project?
        ./astro-proto
    How would you like to start your new project?
        Include sample files
    Do you plan to write TypeScript?
        Yes
    How strict should TypeScript be?
        Strict
    Install dependencies?
        Yes
    Initialize a new git repository?
        Yes
cd ./astro-proton
npx astro add vue
npx astro add mdx
npm install three
npm install --save-dev @types/three

# npm i -D typed-query-selector 未使用
```

### 本番環境

本番環境で動作するかざっくり確認する方法↓

※Dockerのインストールが必要
プロジェクトのルートディレクトリに以下の内容のDockerfileを作る
```
FROM node:lts-slim AS build
WORKDIR /app
COPY . .
RUN npm i
RUN npm run build

FROM httpd:2.4 AS runtime
COPY --from=build /app/dist /usr/local/apache2/htdocs/
EXPOSE 80
```
以下のコマンドを実行する
```
docker build -t peach_officialsite .
docker run -p 8080:80 peach_officialsite
```

ブラウザでlocalhost:8080にアクセス

### mkdir

- /public
  - /assets
    - /games
      - /vue_js_proto
        - /Concentration/models
        - Othello/models
        - Shogi/models
    - /vue_ts_proto
- /src/componets(既存)
  - /games
    - /vue_js_proto
    - /vue_ts_proto
- /content
  - /deliverables
  - /news
