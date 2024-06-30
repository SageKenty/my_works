import * as THREE from "three";
import { update } from "three/examples/jsm/libs/tween.module.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { MeshLine, MeshLineMaterial, MeshLineRaycast } from "three.meshline";
import SyougiAI from "./syougiAI";
import { forEachChild } from "typescript";
export default class Syougi {

  constructor(scene, camera, renderer) {
    //トップファイルから3D空間を渡す。
    this.scene = scene;
    //トップファイルからカメラを渡す。
    this.camera = camera;
    //トップファイルからレンダラーを渡す。
    this.renderer = renderer;
    //GLTFLoaderのインスタンスを格納するプロパティ
    this.loader = null;
    //将棋盤のGLTFモデルデータの定義
    this.board = null;
    //駒置きのモデルデータの定義
    this.komaoki = null;
    //ゲームプレイ中かどうかのフラグ
    this.game_play = false;

    /*イベントリスナーの設定*/
    //キー入力のイベントを設定
    window.addEventListener('keydown', this.onKeyDown.bind(this), false);
    //ポインターを動かした際の設定
    window.addEventListener('pointermove', this.onPointerMove.bind(this), false);
    //マウスクリックを離した際の設定
    window.addEventListener('mouseup', this.onMouseUp.bind(this), false);
    //マウスを押した際のイベントを設定
    window.addEventListener('mousedown', this.onMouseDown.bind(this), false);
    //マウスを押し、動かした際のイベントを設定
    window.addEventListener('mousemove', this.onMouseMove.bind(this), false);

    //マウスの座標を格納するプロパティ
    this.mouse = new THREE.Vector2();
    //マウスのボタンが押されたかどうかのフラグ
    this.mouse_down = false;
    //Raycasterのインスタンスを格納するプロパティ
    this.raycaster = new THREE.Raycaster()
    //intersectsプロパティの定義
    this.intersects = null;
    //選ばれたオブジェクトの情報を格納するプロパティ
    this.selected_piece = null;
    //将棋の駒グループの定義
    this.pieces = new THREE.Group();
    //将棋の駒の配置を示す行列
    this.kind_map = [];
    //将棋駒を選択した際の処理
    this.piece_hover = this.piece_hover.bind(this);
    //一時的に表れるものを格納する配列
    this.temp = new THREE.Group();
    //将棋AIの格納
    this.syougiAI = null;
    //フェーズの定義
    this.phase = 0
    //フェーズのフレーム数
    this.phase_frame = 0
  }

  async syougi_setup(scene) {
    this.game_play = true;
    //GLTF形式のモデルデータの読み込み
    this.loader = new GLTFLoader();
    //GLTFファイルのパス指定
    //将棋盤のモデルデータを読み込む
    this.board_glb = await this.loader.loadAsync("../assets/games/Shogi/models/board.glb");
    //駒置きのモデルデータを読み込む
    this.komaoki_glb = await this.loader.loadAsync("../assets/games/Shogi/models/Komadai.glb");
    //ステージのモデルデータを読みこむ
    this.stage_glb = await this.loader.loadAsync("../assets/games/Shogi/models/stage.glb");
    //読み込み後に3D空間に追加
    this.board = this.board_glb.scene
    //駒置きのモデルデータをコピー
    this.komaoki = new THREE.Group();
    //ステージのモデルデータをコピー
    this.stage = this.stage_glb.scene;
    //駒置きのモデルを定義
    for (let i = 0; i < 2; i++) {
      const komaoki_part = this.komaoki_glb.scene.clone();
      komaoki_part.scale.set(20, 20, 20);
      komaoki_part.position.set((1 - 2 * i) * 100, 0, 50 * (1 - 2 * i));
      komaoki_part.name = "komaoki";
      komaoki_part.userData = { pieces: [] }
      this.komaoki.add(komaoki_part);
    }
    //将棋盤の大きさを調整
    this.board.scale.set(400, 400, 400);
    //ステージの大きさを調整
    this.stage.scale.set(250, 10, 250);
    //ステージの位置を調整
    this.stage.position.set(0, -20, 0);
    //将棋盤に名前を設定
    this.board.name = "board";
    //シーンに将棋盤を追加
    scene.add(this.board);
    //カメラの初期位置を設定
    //position:  x: 16 y: 155 z: 104 
    this.camera.position.set(16, 155, 104);
    //rotation: x:-1.0 y: 0 z: 0
    this.camera.rotation.set(-1.0, 0, 0);
    //盤面テスト用のカメラ位置
    //this.camera.position.set(0, 189, 17);
    //this.camera.rotation.set(-1.5, 0, 0);
    //将棋駒の初期配置
    this.piece_setup(scene);
    //将棋盤をシーンに追加
    scene.add(this.pieces);
    scene.add(this.komaoki);
    scene.add(this.stage);
  }

  syougi_loop() {
    if (this.phase == 2 && this.phase_frame == 0) {
      //AIのオブジェクト
      this.syougiAI = new SyougiAI(this.kind_map, this.pieces, this.scene, this.komaoki.children[1])
      this.syougiAI.judge()
    }
    this.phase_frame++
    this.phase = 1
  }

  //キー入力を受けとる。
  onKeyDown(event) {
    if (this.game_play == false) {
      return;
    }
    if (event.key == 's') {
      this.camera.position.y -= 1;
    }
    if (event.key == 'w') {
      this.camera.position.y += 1;
    }
    if (event.key == 'a') {
      this.camera.position.x += 1;
    }
    if (event.key == 'd') {
      this.camera.position.x -= 1;
    }
    if (event.key == 'r') {
      this.camera.position.z -= 1;
    }
    if (event.key == 'f') {
      this.camera.position.z += 1;
    }
    if (event.key == 'u') {
      this.camera.rotation.x += 0.1;
    }
    if (event.key == 'j') {
      this.camera.rotation.x -= 0.1;
    }
    if (event.key == 'h') {
      this.camera.rotation.y += 0.1;
    }
    if (event.key == 'k') {
      this.camera.rotation.y -= 0.1;
    }
    if (event.key == 'b') {
      console.log(this.kind_map)
      //console.log(this.scene)
      console.log(this.pieces)
    }


    /*console.log("position: " + " x: " + this.camera.position.x + " y: " +
      this.camera.position.y + " z: " + this.camera.position.z + " rotationx: " + this.camera.rotation.x +
      " rotationy: " + this.camera.rotation.y + " rotationz: " + this.camera.rotation.z);
      */
  }
  //マウスイベントの設定
  onMouseDown(event) {
    if (!this.game_play) {
      return;
    }
    this.intersects = this.raycaster.intersectObjects(this.scene.children);

    if (this.intersects[0].object.parent.name != "board"
      && this.intersects[0].object.parent.parent.name != "komaoki" &&
      this.intersects[0].object.parent.parent.userData.player == true) {
      this.selected_piece = this.intersects[0].object;
    }
    //最後にmouse_downをtrueにする。
    this.mouse_down = true;
  }

  onMouseMove(event) {
    if (!(this.game_play && this.mouse_down)) { return; }
    //PARENTに選択された駒の親の親オブジェクトを格納
    const PARENT = this.selected_piece.parent.parent;
    if (PARENT.userData.player == true) {
      //y座標はオブジェクトの値に固定とする。
      this.intersects[0].point.y = PARENT.position.y;
      if (PARENT.name != "huhyo") {
        //歩兵じゃない場合
        this.intersects[0].point.z += 5; //z座標を少しずらす
      }
      //マウスポインタの位置を駒の位置とする。
      PARENT.position.copy(this.intersects[0].point);
    }
  }
  onMouseUp(event) {
    if (this.mouse_down) {
      this.piece_moved(this.selected_piece, this.scene);
    }
    this.mouse_down = false;
    this.dispose_temp();
  }

  //マウスポインタの取得関数
  onPointerMove(event) {
    if (!this.game_play) {
      //ゲームプレイ中でない場合は、処理を終了
      return;
    }
    const canvasBounds = this.renderer.domElement.getBoundingClientRect();
    // マウス位置の正規化
    this.mouse.x = ((event.clientX - canvasBounds.left) / 960) * 2 - 1;
    this.mouse.y = -((event.clientY - canvasBounds.top) / 540) * 2 + 1;
    // raycasterの更新
    this.raycaster.setFromCamera(this.mouse, this.camera);
    // 交差判定
    this.intersects = this.raycaster.intersectObjects(this.scene.children);
    //駒を選択している時間。
    let hover_time = 0;
    // 交差しているオブジェクトが存在する場合。
    if (this.intersects.length >= 6) {
      //選択された駒
      if (!this.mouse_down) { this.selected_piece = this.intersects[0].object; }
      console.log(this.selected_piece.parent.parent)
      // 交差しているオブジェクトを取得
      this.piece_hover(this.selected_piece, this.scene, hover_time);
      hover_time++;
    }
    else {
      //一時的に表示された線を削除
      this.dispose_temp();
    }
  }


  /*自作関数*/

  //一次ファイルの削除
  dispose_temp() {
    this.temp.children.forEach(child => {
      child.geometry.dispose();
      child.material.dispose();
      this.temp.remove(child);
    });
  }

  //駒選択時の処理。
  piece_hover(obj, scene, hover_time) {
    this.dispose_temp();
    const PLAYER = obj.parent.parent.userData.player;
    if (obj.parent.name != "board" && obj.parent.parent.name != "komaoki") {
      //交差しているオブジェクトのplayerステータスoがtrueの場合
      if (PLAYER == true) {
        //盤上での位置を取得
        const MAP_X = obj.parent.parent.userData.map_x;
        const MAP_Y = obj.parent.parent.userData.map_y;
        //駒の親オブジェクトのユーザーデータを取得
        const DATA = obj.parent.parent.userData;
        //駒の種類を取得
        const KIND = obj.parent.parent.userData.kind;
        //駒の座標を取得
        const POS = obj.parent.parent.position;
        /*駒の種類と位置に応じて移動可能範囲を線で示す。*/
        if (hover_time == 0) {
          DATA.movables = [];
          DATA.removables = [];
          DATA.setables = [];
          if (DATA.komaoki_map > 0) {
            this.stockable_judge(DATA)
          }
          if (DATA.komaoki_map == 0) {
            this.judge_movables(KIND, MAP_X, MAP_Y, DATA);
          }
          //移動可能範囲を示す線を描画
          DATA.movables.forEach(index => {
            const points = [];
            //線の座標を格納
            points.push(new THREE.Vector3(MAP_X * 14.5 - 73, 6.75, MAP_Y * 15.0 - 83 + DATA.pos_debuff + 1.5 * (9 - MAP_Y)));
            points.push(new THREE.Vector3(index[0] * 14.5 - 73, 6.75, index[1] * 15.0 - 83 + DATA.pos_debuff + 1.5 * (9 - index[1])));
            //線のジオメトリを定義
            const geometry = new THREE.BufferGeometry().setFromPoints(points);
            //線を描画するためのMeshLineMaterialを定義
            const line = new MeshLine();
            //線のジオメトリを設定
            line.setGeometry(geometry);
            //線のパラメータを設定
            const material = new MeshLineMaterial({
              color: 0xff0000,
              lineWidth: 1.5,
              opacity: 1.0,
            });
            //線を描画
            const line_mesh = new THREE.Mesh(line, material);
            //線を一時的に格納
            this.temp.add(line_mesh)
          });
          DATA.removables.forEach(index => {
            //円のジオメトリを定義
            const circle = new THREE.Mesh(
              new THREE.CircleGeometry(DATA.size / 2, 200),
              new THREE.MeshLambertMaterial({
                color: 0xff0000,
                opacity: 0.6,
              }));

            circle.position.set(index[0] * 14.5 - 72 - (2 * MAP_X / 9), 10.0, index[1] * 15.0 - 81 + 1.5 * (9 - index[1]));
            //点を一時的に格納
            circle.rotation.set(-1.6, 0, 0);
            this.temp.add(circle);
          }
          );

          DATA.setables.forEach(setting => {
            const circle = new THREE.Mesh(
              new THREE.CircleGeometry(2.5, 200),
              new THREE.MeshLambertMaterial({
                color: 0xff0000,
                opacity: 0.6,
              }));

            circle.position.set(setting[0] * 14.5 - 72 - (2 * MAP_X / 9), 10.0, setting[1] * 15.0 - 81 + 1.5 * (9 - setting[1]));
            //点を一時的に格納
            circle.rotation.set(-1.6, 0, 0);
            this.temp.add(circle);
          });
          //要素を追加。
          scene.add(this.temp);
        }
        //console.log(DATA)
      }
    }
  }
  stockable_judge(DATA) {
    //駒が盤上にない場合
    let count = 0
    /*行単位で一列づつ参照*/
    for (let j = 1; j < 10; j++) {
      let column_count = 0 //その列の駒の数をカウント
      let double_huhyou = false

      for (let i = 1; i < 10; i++) {
        if (this.kind_map[i][j] == 7 && DATA.kind == 7) {
          //取ろうとしてる駒の種類が歩かつ、その列に負があるかの判定
          double_huhyou = true
        }
        if (this.kind_map[i][j] == null) {
          DATA.setables[count] = [j, i]
          column_count++
          count++;
        }
      }
      if (double_huhyou == true) {
        //その列に歩が2つある場合
        const remove_label = count - column_count
        DATA.setables.splice(remove_label, column_count)
      }
    }
  }

  judge_movables(KIND, MAP_X, MAP_Y, DATA) {
    let count = 0
    switch (KIND) {
      case 0:
        if (MAP_Y - 1 > 0) {
          //上
          if (this.kind_map[MAP_Y - 1][MAP_X] == null) { DATA.movables[0] = ([MAP_X, MAP_Y - 1]) }
          else if (this.kind_map[MAP_Y - 1][MAP_X] > 7) { DATA.removables[0] = ([MAP_X, MAP_Y - 1]) }
        }
        if (MAP_Y + 1 < 10) {
          //下
          if (this.kind_map[MAP_Y + 1][MAP_X] == null) { DATA.movables[1] = ([MAP_X, MAP_Y + 1]) }
          else if (this.kind_map[MAP_Y + 1][MAP_X] > 7) { DATA.removables[1] = [MAP_X, MAP_Y + 1] }
        }
        if (MAP_X - 1 > 0) {
          //左
          if (this.kind_map[MAP_Y][MAP_X - 1] == null) { DATA.movables[2] = ([MAP_X - 1, MAP_Y]) }
          else if (this.kind_map[MAP_Y][MAP_X - 1] > 7) { DATA.removables[2] = [MAP_X - 1, MAP_Y] }
        }
        if (MAP_X + 1 < 10) {
          //右
          if (this.kind_map[MAP_Y][MAP_X + 1] == null) { DATA.movables[3] = ([MAP_X + 1, MAP_Y]) }
          else if (this.kind_map[MAP_Y][MAP_X + 1] > 7) { DATA.removables[3] = [MAP_X + 1, MAP_Y] }
        }
        if (MAP_Y - 1 > 0 && MAP_X - 1 > 0) {
          //左上
          if (this.kind_map[MAP_Y - 1][MAP_X - 1] == null) { DATA.movables[4] = ([MAP_X - 1, MAP_Y - 1]) }
          else if (this.kind_map[MAP_Y - 1][MAP_X - 1] > 7) { DATA.removables[4] = ([MAP_X - 1, MAP_Y - 1]) }
        }
        if (MAP_Y + 1 < 10 && MAP_X - 1 > 0) {
          //左下
          if (this.kind_map[MAP_Y + 1][MAP_X - 1] == null) { DATA.movables[5] = ([MAP_X - 1, MAP_Y + 1]) }
          else if (this.kind_map[MAP_Y + 1][MAP_X - 1] > 7) { DATA.removables[5] = [MAP_X - 1, MAP_Y + 1] }
        }
        if (MAP_Y - 1 > 0 && MAP_X + 1 < 10) {
          //右上
          if (this.kind_map[MAP_Y - 1][MAP_X + 1] == null) { DATA.movables[6] = ([MAP_X + 1, MAP_Y - 1]) }
          else if (this.kind_map[MAP_Y - 1][MAP_X + 1] > 7) { DATA.removables[6] = [MAP_X + 1, MAP_Y - 1] }

        }
        if (MAP_Y + 1 < 10 && MAP_X + 1 < 10) {
          //右下
          if (this.kind_map[MAP_Y + 1][MAP_X + 1] == null) { DATA.movables[7] = ([MAP_X + 1, MAP_Y + 1]) }
          else if (this.kind_map[MAP_Y + 1][MAP_X + 1] > 7) { DATA.removables[7] = [MAP_X + 1, MAP_Y + 1] }
        }
        break;

      case 1:
        //飛車の場合
        let UP_Y = MAP_Y, DOWN_Y = MAP_Y, LEFT_X = MAP_X, RIGHT_X = MAP_X
        count = 0
        //移動可能範囲を計算
        //上
        while (UP_Y - 1 > 0 && this.kind_map[UP_Y - 1][MAP_X] == null) {
          UP_Y--
          DATA.movables[count] = [MAP_X, UP_Y]
          count++
        }
        if (this.kind_map[UP_Y - 1][MAP_X] > 7) { DATA.removables[0] = [MAP_X, UP_Y - 1] }
        //下
        while (DOWN_Y + 1 < 10 && this.kind_map[DOWN_Y + 1][MAP_X] == null) {
          DOWN_Y++
          DATA.movables[count] = [MAP_X, DOWN_Y]
          count++
        }
        if (this.kind_map[DOWN_Y + 1][MAP_X] > 7) { DATA.removables[1] = [MAP_X, DOWN_Y + 1] }

        //左
        while (LEFT_X - 1 > 0 && this.kind_map[MAP_Y][LEFT_X - 1] == null) {
          LEFT_X--
          DATA.movables[count] = [LEFT_X, MAP_Y]
          count++
        }
        if (this.kind_map[MAP_Y][LEFT_X - 1] > 7) { DATA.removables[2] = [LEFT_X - 1, MAP_Y] }
        //右
        while (RIGHT_X + 1 < 10 && this.kind_map[MAP_Y][RIGHT_X + 1] == null) {
          RIGHT_X++
          DATA.movables[count] = [RIGHT_X, MAP_Y]
          count++
        }
        if (this.kind_map[MAP_Y][RIGHT_X + 1] > 7) { DATA.removables[3] = [RIGHT_X + 1, MAP_Y] }
        //龍王であれば斜めも移動可能
        if (DATA.turned == true) {
          if (MAP_Y - 1 > 0 && MAP_X - 1 > 0) {
            //左上
            if (this.kind_map[MAP_Y - 1][MAP_X - 1] == null) { DATA.movables[count] = ([MAP_X - 1, MAP_Y - 1]) }
            else if (this.kind_map[MAP_Y - 1][MAP_X - 1] > 7) { DATA.removables[4] = ([MAP_X - 1, MAP_Y - 1]) }
            count++
          }
          if (MAP_Y + 1 < 10 && MAP_X - 1 > 0) {
            //左下
            if (this.kind_map[MAP_Y + 1][MAP_X - 1] == null) { DATA.movables[count] = ([MAP_X - 1, MAP_Y + 1]) }
            else if (this.kind_map[MAP_Y + 1][MAP_X - 1] > 7) { DATA.removables[5] = [MAP_X - 1, MAP_Y + 1] }
            count++
          }
          if (MAP_Y - 1 > 0 && MAP_X + 1 < 10) {
            //右上
            if (this.kind_map[MAP_Y - 1][MAP_X + 1] == null) { DATA.movables[count] = ([MAP_X + 1, MAP_Y - 1]) }
            else if (this.kind_map[MAP_Y - 1][MAP_X + 1] > 7) { DATA.removables[6] = [MAP_X + 1, MAP_Y - 1] }
            count++
          }
          if (MAP_Y + 1 < 10 && MAP_X + 1 < 10) {
            //右下
            if (this.kind_map[MAP_Y + 1][MAP_X + 1] == null) { DATA.movables[count] = ([MAP_X + 1, MAP_Y + 1]) }
            else if (this.kind_map[MAP_Y + 1][MAP_X + 1] > 7) { DATA.removables[7] = [MAP_X + 1, MAP_Y + 1] }
            count++
          }
        }
        break;

      case 2:
        //角行の場合
        let RU = [MAP_X, MAP_Y], RD = [MAP_X, MAP_Y], LU = [MAP_X, MAP_Y], LD = [MAP_X, MAP_Y];
        count = 0;
        //右上
        while (RU[0] + 1 < 10 && RU[1] - 1 > 0 && this.kind_map[RU[1] - 1][RU[0] + 1] == null) {
          RU[0]++;
          RU[1]--;
          DATA.movables[count] = [RU[0], RU[1]];
          count++;
        }
        if (this.kind_map[RU[1] - 1][RU[0] + 1] > 7) { DATA.removables[0] = [RU[0] + 1, RU[1] - 1] }

        //右下
        while (RD[0] + 1 < 10 && RD[1] + 1 < 10 && this.kind_map[RD[1] + 1][RD[0] + 1] == null) {
          RD[0]++;
          RD[1]++;
          DATA.movables[count] = [RD[0], RD[1]];
          count++;
        }
        if (this.kind_map[RD[1] + 1][RD[0] + 1] > 7) { DATA.removables[1] = [RD[0] + 1, RD[1] + 1] }

        //左下
        while (LU[0] - 1 > 0 && LU[1] + 1 < 10 && this.kind_map[LU[1] + 1][LU[0] - 1] == null) {
          LU[0]--;
          LU[1]++;
          DATA.movables[count] = [LU[0], LU[1]];
          count++;
        }
        if (this.kind_map[LU[1] + 1][LU[0] - 1] > 7) { DATA.removables[2] = [LU[0] - 1, LU[1] + 1] }

        //左上
        while (LD[0] - 1 > 0 && LD[1] - 1 > 0 && this.kind_map[LD[1] - 1][LD[0] - 1] == null) {
          LD[0]--;
          LD[1]--;
          DATA.movables[count] = [LD[0], LD[1]];
          count++;
        }
        if (this.kind_map[LD[1] - 1][LD[0] - 1] > 7) { DATA.removables[3] = [LD[0] - 1, LD[1] - 1] }
        //竜馬であれば直進も可能
        if (DATA.turned == true) {
          if (MAP_Y - 1 > 0) {
            //上
            if (this.kind_map[MAP_Y - 1][MAP_X] == null) { DATA.movables[count] = ([MAP_X, MAP_Y - 1]) }
            else if (this.kind_map[MAP_Y - 1][MAP_X] > 7) { DATA.removables[4] = ([MAP_X, MAP_Y - 1]) }
            count++
          }
          if (MAP_Y + 1 < 10) {
            //下
            if (this.kind_map[MAP_Y + 1][MAP_X] == null) { DATA.movables[count] = ([MAP_X, MAP_Y + 1]) }
            else if (this.kind_map[MAP_Y + 1][MAP_X] > 7) { DATA.removables[5] = [MAP_X, MAP_Y + 1] }
            count++
          }
          if (MAP_X - 1 > 0) {
            //左
            if (this.kind_map[MAP_Y][MAP_X - 1] == null) { DATA.movables[count] = ([MAP_X - 1, MAP_Y]) }
            else if (this.kind_map[MAP_Y][MAP_X - 1] > 7) { DATA.removables[6] = [MAP_X - 1, MAP_Y] }
            count++
          }
          if (MAP_X + 1 < 10) {
            //右
            if (this.kind_map[MAP_Y][MAP_X + 1] == null) { DATA.movables[count] = ([MAP_X + 1, MAP_Y]) }
            else if (this.kind_map[MAP_Y][MAP_X + 1] > 7) { DATA.removables[7] = [MAP_X + 1, MAP_Y] }
            count++
          }
        }
        break;

      case 3:
        //金将の場合
        if (MAP_Y - 1 > 0) {
          //上
          if (this.kind_map[MAP_Y - 1][MAP_X] == null) { DATA.movables[0] = ([MAP_X, MAP_Y - 1]) }
          else if (this.kind_map[MAP_Y - 1][MAP_X] > 7) { DATA.removables[0] = ([MAP_X, MAP_Y - 1]) }
        }
        if (MAP_Y + 1 < 10) {
          //下
          if (this.kind_map[MAP_Y + 1][MAP_X] == null) { DATA.movables[1] = ([MAP_X, MAP_Y + 1]) }
          else if (this.kind_map[MAP_Y + 1][MAP_X] > 7) { DATA.removables[1] = [MAP_X, MAP_Y + 1] }
        }
        if (MAP_X - 1 > 0) {
          //左
          if (this.kind_map[MAP_Y][MAP_X - 1] == null) { DATA.movables[2] = ([MAP_X - 1, MAP_Y]) }
          else if (this.kind_map[MAP_Y][MAP_X - 1] > 7) { DATA.removables[2] = [MAP_X - 1, MAP_Y] }
        }
        if (MAP_X + 1 < 10) {
          //右
          if (this.kind_map[MAP_Y][MAP_X + 1] == null) { DATA.movables[3] = ([MAP_X + 1, MAP_Y]) }
          else if (this.kind_map[MAP_Y][MAP_X + 1] > 7) { DATA.removables[3] = [MAP_X + 1, MAP_Y] }
        }
        if (MAP_Y - 1 > 0 && MAP_X - 1 > 0) {
          //左上
          if (this.kind_map[MAP_Y - 1][MAP_X - 1] == null) { DATA.movables[4] = ([MAP_X - 1, MAP_Y - 1]) }
          else if (this.kind_map[MAP_Y - 1][MAP_X - 1] > 7) { DATA.removables[4] = ([MAP_X - 1, MAP_Y - 1]) }
        }
        if (MAP_Y - 1 > 0 && MAP_X + 1 < 10) {
          //右上
          if (this.kind_map[MAP_Y - 1][MAP_X + 1] == null) { DATA.movables[5] = ([MAP_X + 1, MAP_Y - 1]) }
          else if (this.kind_map[MAP_Y - 1][MAP_X + 1] > 7) { DATA.removables[5] = [MAP_X + 1, MAP_Y - 1] }
        }
        break;

      case 4:
        //銀将の場合
        if (MAP_Y - 1 > 0) {
          //上
          if (this.kind_map[MAP_Y - 1][MAP_X] == null) { DATA.movables[0] = ([MAP_X, MAP_Y - 1]) }
          else if (this.kind_map[MAP_Y - 1][MAP_X] > 7) { DATA.removables[0] = ([MAP_X, MAP_Y - 1]) }
        }
        if (MAP_Y - 1 > 0 && MAP_X - 1 > 0) {
          //左上
          if (this.kind_map[MAP_Y - 1][MAP_X - 1] == null) { DATA.movables[1] = ([MAP_X - 1, MAP_Y - 1]) }
          else if (this.kind_map[MAP_Y - 1][MAP_X - 1] > 7) { DATA.removables[1] = ([MAP_X - 1, MAP_Y - 1]) }
        }
        if (MAP_Y + 1 < 10 && MAP_X - 1 > 0) {
          //左下
          if (this.kind_map[MAP_Y + 1][MAP_X - 1] == null) { DATA.movables[2] = ([MAP_X - 1, MAP_Y + 1]) }
          else if (this.kind_map[MAP_Y + 1][MAP_X - 1] > 7) { DATA.removables[2] = [MAP_X - 1, MAP_Y + 1] }
        }
        if (MAP_Y - 1 > 0 && MAP_X + 1 < 10) {
          //右上
          if (this.kind_map[MAP_Y - 1][MAP_X + 1] == null) { DATA.movables[3] = ([MAP_X + 1, MAP_Y - 1]) }
          else if (this.kind_map[MAP_Y - 1][MAP_X + 1] > 7) { DATA.removables[3] = [MAP_X + 1, MAP_Y - 1] }

        }
        if (MAP_Y + 1 < 10 && MAP_X + 1 < 10) {
          //右下
          if (this.kind_map[MAP_Y + 1][MAP_X + 1] == null) { DATA.movables[4] = ([MAP_X + 1, MAP_Y + 1]) }
          else if (this.kind_map[MAP_Y + 1][MAP_X + 1] > 7) { DATA.removables[4] = [MAP_X + 1, MAP_Y + 1] }
        }
        break;

      case 5:
        //桂馬の場合
        if (MAP_Y - 2 > 0) {
          if (MAP_X - 1 > 0) {
            if (this.kind_map[MAP_Y - 2][MAP_X - 1] == null) { DATA.movables[0] = [MAP_X - 1, MAP_Y - 2] }
            if (this.kind_map[MAP_Y - 2][MAP_X - 1] > 7) { DATA.removables[0] = [MAP_X - 1, MAP_Y - 2] }
          }
          if (MAP_X + 1 < 10) {
            if (this.kind_map[MAP_Y - 2][MAP_X + 1] == null) { DATA.movables[1] = [MAP_X + 1, MAP_Y - 2] }
            if (this.kind_map[MAP_Y - 2][MAP_X + 1] > 7) { DATA.removables[1] = [MAP_X + 1, MAP_Y - 2] }
          }
        }
        break;

      case 6:
        //香車の場合
        let upable = MAP_Y;
        if (DATA.player) {
          while (upable - 1 > 0 && this.kind_map[upable - 1][MAP_X] == null) {
            //駒の存在しない地点をwhileループで探る
            upable--;
            DATA.movables[count] = [MAP_X, upable];
            count++;
          }
          if (this.kind_map[upable - 1][MAP_X] > 7) {
            //そのあとはおそらく空白でないので駒の数が7より上であれば取り除ける駒に指定
            DATA.removables[0] = [MAP_X, upable - 1];
          }
        }
        break;

      case 7:
        //歩兵の場合
        //線が引かれる座標を格納する配
        //盤上での位置を取得
        if (MAP_Y - 1 > 0) {
          if (this.kind_map[MAP_Y - 1][MAP_X] == null) { DATA.movables[0] = ([MAP_X, MAP_Y - 1]); }
          else if (this.kind_map[MAP_Y - 1][MAP_X] > 7) { DATA.removables[0] = [MAP_X, MAP_Y - 1] }
        }
    }
  }
  //駒を動かした際の処理
  piece_moved(obj, scene) {
    //選択された駒の親オブジェクトがboardでない場合
    const DATA = obj.parent.parent.userData;
    //盤上での位置を取得
    const MAP_X = obj.parent.parent.userData.map_x;
    const MAP_Y = obj.parent.parent.userData.map_y;
    //駒の種類を取得
    const KIND = obj.parent.parent.userData.kind;
    //プレイヤーかどうかを取得
    const PLAYER = obj.parent.parent.userData.player;
    //駒の座標を取得
    const POS = obj.parent.parent.position;
    //駒に動きがあったかどうかのフラグ
    //選択された駒のplayerステータスがtrueの場合
    /*this.piece_posset(可動範囲（消去範囲）を示す配列,駒の現在位置(=マウス位置),
    ユーザーデータ,リムーブ動作かどうか,シーン);*/
    this.piece_posset(DATA.movables, DATA.removables, DATA.setables, POS, DATA, obj.parent.parent);
    //既に表示された線を削除
    this.dispose_temp();
  }

  //駒が効果範囲内にドラッグされているかの判定
  piece_posset(movables, removables, setables, POS, DATA, PARENT) {
    let MAP_X = DATA.map_x
    let MAP_Y = DATA.map_y
    let KOMAOKI_MAP = this.komaoki.children[0].userData.pieces
    let moved = false
    let removed = false
    let setted = false
    movables.forEach(move => {
      if ((POS.x < move[0] * 14.5 - 70 && POS.x > move[0] * 14.5 - 76)
        && (POS.z < move[1] * 15.0 - 70 + DATA.pos_debuff + 1.5 * (9 - move[1]) &&
          POS.z > move[1] * 15.0 - 86 + DATA.pos_debuff + 1.5 * (9 - move[1]))) {
        //マップ上の元の位置から駒を取り除く
        //駒の位置ステータスを更新
        DATA.map_y = move[1];
        DATA.map_x = move[0];
        //マップ上の新しい位置に駒を配置
        this.kind_map[MAP_Y][MAP_X] = null;
        this.kind_map[move[1]][move[0]] = DATA.kind;
        //駒の位置を更新
        POS.set(move[0] * 14.5 - 73, 6.75, move[1] * 15.0 - 78 + DATA.pos_debuff + 1.5 * (9 - move[1]));
        moved = true
      }
    });
    //リムーブ（駒を取り除く動作の場合）
    removables.forEach(remove => {
      if ((POS.x < remove[0] * 14.5 - 70 && POS.x > remove[0] * 14.5 - 76)
        && (POS.z < remove[1] * 15.0 - 70 + DATA.pos_debuff + 1.5 * (9 - remove[1]) &&
          POS.z > remove[1] * 15.0 - 86 + DATA.pos_debuff + 1.5 * (9 - remove[1]))) {
        let obj
        //リムーブ（駒を取り除く動作の場合）
        //取り除く駒の特定
        this.pieces.children.forEach(piece => {
          if (piece.userData.map_x == remove[0] && piece.userData.map_y == remove[1]) {
            obj = piece
          }
        });
        if (obj === undefined) {
          console.log("駒がない。危機感持った方がいい")
          return;
        }
        //駒の位置ステータスを更新
        DATA.map_y = remove[1];
        DATA.map_x = remove[0];
        //マップ上の新しい位置に駒を配置
        this.kind_map[MAP_Y][MAP_X] = null;
        let count = 1
        while (KOMAOKI_MAP[count] != null) {
          //駒置きのどこに駒を置くのか
          count++
        }
        KOMAOKI_MAP[count] = obj.userData.kind
        this.kind_map[remove[1]][remove[0]] = DATA.kind
        obj.rotation.set(-1.57, -1.57, 0)
        obj.userData.player = true //駒をプレイヤーの物にする
        obj.userData.kind -= 8 //プレイヤー向けに種類の値を更新
        obj.userData.komaoki_map = count //駒置き上での位置の更新
        obj.userData.map_x = 0, obj.userData.map_y = 0
        obj.position.set((count % 3) * 12.0 + 86, 9, Math.trunc(count / 3) * 12.0 + 40 + obj.userData.pos_debuff)

        //成っていればそれを解除
        if (obj.userData.turned == true) {
          if (obj.name == "ginsho") {
            obj.userData.kind = 4
          }
          else if (obj.name == "keima") {
            obj.userData.kind = 5
          }
          else if (obj.name == "kyosha") {
            obj.userData.kind = 6
          }
          else if (obj.name == "huhyo") {
            obj.userData.kind = 7
          }
          obj.userData.turned = false
        }

        //駒の位置を更新
        POS.set(remove[0] * 14.5 - 73, 6.75, remove[1] * 15.0 - 78 + DATA.pos_debuff + 1.5 * (9 - remove[1]));
        if (obj.name == "gyoku") {
          alert("YOU WIN!!")
          location.reload()
        }
        removed = true
      }
    });

    //セット（駒を配置する動作の場合）
    setables.forEach(setting => {
      if ((POS.x < setting[0] * 14.5 - 70 && POS.x > setting[0] * 14.5 - 76)
        && (POS.z < setting[1] * 15.0 - 70 + DATA.pos_debuff + 1.5 * (9 - setting[1]) &&
          POS.z > setting[1] * 15.0 - 86 + DATA.pos_debuff + 1.5 * (9 - setting[1]))) {
        console.log(setting)
        //駒の位置ステータスを更新
        DATA.map_y = setting[1];
        DATA.map_x = setting[0];
        console.log("MAP_X" + DATA.map_x + " " + " MAP_Y" + DATA.map_y)
        //マップ上の新しい位置に駒を配置
        this.kind_map[setting[1]][setting[0]] = DATA.kind
        //駒置き上の将棋の情報を削除
        this.komaoki.children[0].userData.pieces[DATA.komaoki_map] = null
        //成っていれば駒のステータスを変更


        //駒の位置を更新
        POS.set(setting[0] * 14.5 - 73, 6.75, setting[1] * 15.0 - 78 + DATA.pos_debuff + 1.5 * (9 - setting[1]));
        /*もしくは駒に駒置き上の位置を記憶させるか。（駒が置かれてなかったら0か-1
        を設定すればonboardのようなパラメータをそのまま使える）*/
        //console.log(this.komaoki.children[0].userData.pieces)
        setted = true
      }
    });

    if (DATA.komaoki_map == 0 && (!moved && !removed)) {
      POS.set(MAP_X * 14.5 - 73, 6.75, MAP_Y * 15.0 - 78 + DATA.pos_debuff + 1.5 * (9 - MAP_Y))
    }

    if (setted == true) {
      DATA.komaoki_map = 0
      DATA.setables = []
    }

    if (moved || removed) {
      if (DATA.map_y <= 3 && DATA.kind != 0 && DATA.kind != 3) {
        DATA.turned = true //成る
        PARENT.rotation.set(-1.57, 1.57, 0) //駒をひっくり返す
        if (DATA.kind >= 4 && DATA.kind <= 7) {
          DATA.kind = 3 //桂馬、香車、銀将、歩兵である場合駒の種類を金にする。
        }
        //盤上のマップを更新
        this.kind_map[DATA.map_y][DATA.map_x] = DATA.kind
      }
    }

    if (moved || removed || setted) {
      //駒が何かしらの形で動いたとき
      this.phase = 2
      this.phase_frame = 0
    }
  }

  //将棋駒の初期配置
  async piece_setup() {
    this.kind_map = [
      [],
      [, 14, 13, 12, 11, 8, 11, 12, 13, 14],
      [, , 9, , , , , , 10,],
      [, 15, 15, 15, 15, 15, 15, 15, 15, 15],
      [, , , , , , , , ,],
      [, , , , , , , , ,],
      [, , , , , , , , ,],
      [, 7, 7, 7, 7, 7, 7, 7, 7, 7],
      [, , 2, , , , , , 1,],
      [, 6, 5, 4, 3, 0, 3, 4, 5, 6],
      []
    ];

    //オブジェクトの初期値を定義して、piecesに格納
    let loaded = [false, false, false, false, false, false, false, false];
    let glbs = [];
    for (let i = 1; i <= 9; i++) {
      for (let j = 1; j <= 9; j++) {
        if (this.kind_map[i][j] != null) {
          //駒の種類によってモデルを読み込む
          //モデルの名前を格納する変数
          let name;
          let size;
          let debuff;
          const kind = this.kind_map[i][j];
          const map_x = j;
          const map_y = i;
          let glb_kind;
          //プレイヤーかどうかのフラグ
          const player = (map_y >= 7) ? true : false;
          if (player == true) {
            glb_kind = kind;
          }
          else {
            glb_kind = kind - 8;
          }
          switch (glb_kind) {
            //kindの値によってモデルのパスを読み込む
            case 0:
              if (!loaded[0]) { glbs[0] = await this.loader.loadAsync("../assets/games/Shogi/models/osho.glb"); }
              name = "gyoku"
              size = 5
              loaded[0] = true
              debuff = 3.4
              break;
            case 1:
              if (!loaded[1]) { glbs[1] = await this.loader.loadAsync("../assets/games/Shogi/models/hisha.glb"); }
              name = "hisya"
              size = 5;
              loaded[1] = true;
              debuff = 3.4
              break;
            case 2:
              if (!loaded[2]) { glbs[2] = await this.loader.loadAsync("../assets/games/Shogi/models/kakugyo.glb"); }
              name = "kakugyo"
              size = 5;
              loaded[2] = true;
              debuff = 3.4
              break;
            case 3:
              if (!loaded[3]) { glbs[3] = await this.loader.loadAsync("../assets/games/Shogi/models/kinsho.glb"); }
              name = "kinsho"
              size = 4.8;
              loaded[3] = true;
              debuff = 2.7
              break;
            case 4:
              if (!loaded[4]) { glbs[4] = await this.loader.loadAsync("../assets/games/Shogi/models/ginsho.glb"); }
              name = "ginsho"
              size = 4.8;
              loaded[4] = true;
              debuff = 2.7
              break;
            case 5:
              if (!loaded[5]) { glbs[5] = await this.loader.loadAsync("../assets/games/Shogi/models/keima.glb"); }
              name = "keima"
              size = 4.6;
              loaded[5] = true;
              debuff = 2.4
              break;
            case 6:
              if (!loaded[6]) { glbs[6] = await this.loader.loadAsync("../assets/games/Shogi/models/kyosha.glb"); }
              name = "kyosha"
              size = 4.6;
              loaded[6] = true;
              debuff = 2.4
              break;
            case 7:
              if (!loaded[7]) { glbs[7] = await this.loader.loadAsync("../assets/games/Shogi/models/huhyo.glb"); }
              name = "huhyo"
              size = 4.3;
              loaded[7] = true;
              debuff = -0.8
              break;
          }
          //モデルを読み込んで、3D空間に追加
          const model = glbs[glb_kind].scene.clone();
          //モデルの名前を駒の名前に設定
          model.name = name;
          //モデルの大きさを調整
          model.scale.set(size, size, size);
          //モデルのuserDataに駒の情報を格納
          model.userData =
          {
            map_x: map_x, map_y: map_y, kind: kind, player: player,
            komaoki_map: 0, //駒置きのどこにあるか。駒置きになければ0
            size: size,
            turned: false,//（成ったかどうか）
            pos_debuff: debuff,//駒の位置の調整（大きさ）
            movables: [], //可動範囲
            removables: [], //駒をとれる範囲
            setables: [] //駒を置ける範囲
          };
          //モデルの位置を調整
          if (player == true) {
            model.position.set(map_x * 14.5 - 73, 6.75, map_y * 15.0 - 78 + debuff + 1.5 * (9 - map_y));
            model.rotation.set(-1.57, -1.57, 0)
          }
          if (player == false) {
            model.position.set(map_x * 14.5 - 73, 6.75, map_y * 15.0 - 69 - debuff - 1.5 * map_y);
            model.rotation.set(1.57, 1.57, 0)
          }
          //駒のデータをpiecesに格納。
          this.pieces.add(model);
        }
      }
    }
  }
}