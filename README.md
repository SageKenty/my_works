## 制作物一覧

referencesディレクトリに制作物を動かした簡単な動画を入れています。

### Three.jsでの制作物

主にJavascriptとWebGLを用いたJavascriptライブラリ、Three.jsを用いて制作した将棋、オセロ、神経衰弱をひとつにまとめたゲームです。自分は将棋のプログラム部分全般を担当しました。他のゲームやグラフィックにはほとんど私は関与していません。また、全体の枠組みの一部も私が担当しました。

#### 将棋ゲーム
基本的にはコンピュータとプレイヤーが対戦を行い、王を取ったら勝ちでゲーム終了という単純な作りになっています。
コンピュータ(AI)に関しては、取れる手を全て探索してそこからランダムに選択して打つという単純なものにしています。基本的にマウスで操作し、ドラッグ&ドロップで駒を動かします。

実際に動作するにはNode.jsが必要です。Syougi_Gameディレクトリ直下で以下のコマンドを実行すると実際に動作します。

```bash
npm install
npm run dev
```

### シューティングゲーム

大学の授業の課題で制作したシューティングゲームです。Processingで制作しています。私がすべて制作しました。
詳細についてはreferenceディレクトリのShooting.pdfを参照してください。

#### 概要

基本的には敵の弾をよけながら弾を発射し、敵を倒すという操作性になっています。
操作はキーボードでの操作になります。

#### 動作環境

Processingで動作します。
