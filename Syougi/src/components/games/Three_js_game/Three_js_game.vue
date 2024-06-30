<script setup lang="js">
import * as THREE from "three";
import { onMounted } from "vue";
import { ref } from 'vue';
import Syougi from "./syougi/syougi"; //syougi.jsからSyougiクラスをインポート
import Reversi from "./reversi/reversi"; //reversi.jsからReversiクラスをインポート
import Nervous from "./nervous/nervous";  //nervous.jsからNervousクラスをインポート


/* コンポーネントがマウントされた後に実行 */
onMounted(() => {
  init();
});

const width = 960;
const height = 540;
// シーンを作成
const scene = new THREE.Scene();
// カメラを作成
const camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);

let game = ref(0);

async function init() {
  // レンダラーを作成(init以下(onMountedから呼び出し)じゃないと動かなかった)
  const canvas = document.querySelector(".myCanvasJS");
  const renderer = new THREE.WebGLRenderer({ canvas });
  //タイトルキャンバスの取得
  const title_canvas = document.querySelector(".myCanvas2D");
  const ctx = title_canvas.getContext('2d');
  let img = new Image();


  renderer.setSize(width, height);
  renderer.setPixelRatio(window.devicePixelRatio);

  // カメラの初期座標を設定（X座標:0, Y座標:0, Z座標:0）
  camera.position.set(0, 0, 1000);

  // 平行光源
  const light = new THREE.AmbientLight(0xffffff,2.0);
  light.intensity = 2; // 光の強さを倍に
  light.position.set(1, 1, 1); // ライトの方向
  // シーンに追加
  scene.add(light);

  //キー入力を受け取る
  let keyState = {};

  function keydownHandler(e) {
    keyState[e.code] = true;
  }

  function keyupHandler(e) {
    keyState[e.code] = false;
  }

  //キー入力を受け取るイベントを登録
  window.addEventListener('keydown', keydownHandler);
  window.addEventListener('keyup', keyupHandler);
  img.addEventListener("load", function() {
    ctx.drawImage(img, 0, 0, 300 ,150);
  }, false);

  img.src = "../assets/games/titleimg.PNG"

  //ゲームオブジェクト
  //リバーシオブジェクトを作成
  const reversi = new Reversi(scene,camera,renderer);
  //将棋オブジェクトを作成
  const syougi = new Syougi(scene,camera,renderer);
  //神経衰弱オブジェクトを作成
  const nervous = new Nervous(scene,camera,renderer);

  const tick = async () => {
    requestAnimationFrame(tick);
    await select(game);
    // レンダリング
    renderer.render(scene, camera);
  }
  await tick();

  async function select(game) {
    if (game.value == 0) {
      if (keyState['KeyA']) {
        //オセロゲーム開始
        game.value = 1;
        //オセロオブジェクトを作成
        await reversi.reversi_setup();
      }
      if (keyState['KeyB']) {
        //神経衰弱ゲーム開始
        game.value = 2;
        nervous.nervous_setup(scene);
      }
      if (keyState['KeyC']) {
        //将棋ゲーム開始
        syougi.syougi_setup(scene);
        game.value = 3;
      }
    }
    if(game.value != 0){
      ctx.clearRect(0, 0, 300, 150);
    }
    if(game.value == 1){
      reversi.reversi_loop();
    }
    if(game.value == 2){
      nervous.nervous_loop(camera,canvas);
    }
    if (game.value == 3) {
      syougi.syougi_loop(camera);
    }
  }
}
</script>

<template>
  <canvas class="myCanvasJS"></canvas>
  <canvas class="myCanvas2D"></canvas>
</template>

<style>
  template{
    position : relative;
  }
  canvas {
    position : absolute;
    top: 50;
    left: 50;
    width : 960px;
    height : 540px;
  }

</style>