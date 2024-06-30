import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { Stone } from "@components/games/Three_js_game/reversi/sprite.js";
import {get_ai_place_coord, get_placeable_position, get_reverse_scores, get_table} from "@components/games/Three_js_game/reversi/reversiAi.js";
export default class Reversi {
  constructor(scene,camera,renderer) {
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
    this.geometry = new THREE.BoxGeometry(500, 500, 500);
    this.material1 = new THREE.MeshStandardMaterial({ color: "rgb(255, 0, 0)"});
    this.box = new THREE.Mesh(this.geometry, this.material1);
    this.size = [8,8];
    this.lastMoveStonePos = [0,0];
    this.mouse = new THREE.Vector2();
    this.raycaster = new THREE.Raycaster();
    this.mouseClickPos = [];
    
    // 石
    this.stones = new Array(this.size[1]);
    for(let i=0; i<this.size[1]; i++){
      this.stones[i] = new Array(this.size[0]);
    }

    // キーダウンイベントのリスナーを設定。
    window.addEventListener('click',this.onClick.bind(this),false);
    this.game_play = false;

    // ゲームステータス
    this.statusObj = {
      loading: "loading", // ロード中
      p1turn: "p1turn",
      p1move: "p1move", // p1の手を反映させる
      p2turn: "p2turn",
      p2move: "p2move", // p2の手を反映させる
    };
    this.status = this.statusObj.loading;
  }
  
  async reversi_setup(){
    this.scene.background = new THREE.Color( 0x888888 );
    // GLTF形式のモデルデータの読み込み
    this.loader = new GLTFLoader();
    // GLTFファイルのパス指定
    let stoneGlb = await this.loader.loadAsync("../assets/games/Othello/models/white-blackStone.glb");
    let stageGlb = await this.loader.loadAsync("../assets/games/Othello/models/board.glb");
    // ステージ設置
    this.stage = stageGlb.scene.clone();
    this.stage.scale.set(200,20,200);
    this.stage.position.set(0,0,20);
    this.stage.rotation.x = Math.PI/2;
    this.scene.add(this.stage);
    // 石の設置
    for(let i=0; i<this.size[1]; i++){
      for(let j=0; j<this.size[0]; j++){
        this.stones[i][j] = new Stone(j, i, stoneGlb.scene.clone());
        this.scene.add(this.stones[i][j].stone);
        this.stones[i][j].stone.visible = false;
      }
    }
    // 石の初期配置
    // 黒
    this.stones[3][3].stone.visible = true;
    this.stones[3][3].status = 0;
    this.stones[4][4].stone.visible = true;
    this.stones[4][4].status = 0;

    // 白
    this.stones[3][4].stone.visible = true;
    this.stones[3][4].stone.rotation.x = -Math.PI/2;
    this.stones[3][4].status = 1;
    this.stones[4][3].stone.visible = true;
    this.stones[4][3].stone.rotation.x = -Math.PI/2;
    this.stones[4][3].status = 1;

    // camera
    this.camera.position.set(0,-400, 600);
    this.camera.lookAt(new THREE.Vector3(0, 0, 0)); // 原点方向を見る

    // status 設定
    this.status = this.statusObj.p1turn;
    /* オセロで最初に実行する処理 */
    this.game_play = true;
  }

  reversi_loop(){
    if(!this.game_play){return;} // reversi_setup() が終わってない場合何せず終了
    /* オセロで毎フレーム実行する処理 */
    switch(this.status){
      case this.statusObj.p1turn:
      case this.statusObj.p2turn:
        // player 入力待ち
        let stoneColor = this.status==this.statusObj.p1turn? 0: 1;
        if(this.status == this.statusObj.p2turn){
          let pos = get_ai_place_coord(stoneColor, get_table(this.stones));
          let scores = get_reverse_scores(stoneColor, pos[0], pos[1], get_table(this.stones));
          if(scores[1].length>0){
            this.stones[pos[0]][pos[1]].setColor(stoneColor); // 駒設置
            scores[1].forEach((_pos)=>{
              var t = Math.abs(_pos[0]-this.lastMoveStonePos[0])+Math.abs(_pos[1]-this.lastMoveStonePos[1]);
              this.stones[_pos[0]][_pos[1]].turn(5*t); // 設置場所からの距離に応じて時間差をつけて裏返す
            });
            this.status = this.status==this.statusObj.p1turn? this.statusObj.p1move: this.statusObj.p2move; // p1move に切り替え
            this.lastMoveStonePos = [pos[0], pos[1]];
            break;
          }
        } else {
          // プレイヤー操作
          if(this.mouseClickPos.length > 0){
            var obj = this.mouseClickPos.shift();
            switch(obj.name){
              case "stone":
                let scores = get_reverse_scores(stoneColor, obj.y, obj.x, get_table(this.stones));
                if(this.stones[obj.y][obj.x].status==-1 && scores[1].length>0){
                  // 非表示の駒かつ，ひっくり返す駒であるとき
                  this.stones[obj.y][obj.x].setColor(stoneColor); // 駒設置
                  
                  scores[1].forEach((pos)=>{
                    var t = Math.abs(pos[0]-this.lastMoveStonePos[0])+Math.abs(pos[1]-this.lastMoveStonePos[1]);
                    this.stones[pos[0]][pos[1]].turn(5*t); // 設置場所からの距離に応じて時間差をつけて裏返す
                  });

                  this.status = this.status==this.statusObj.p1turn? this.statusObj.p1move: this.statusObj.p2move; // p1move に切り替え
                  this.lastMoveStonePos = [obj.x, obj.y];
                }
            }
          }
        }
        break;
        
      case this.statusObj.p1move:
      case this.statusObj.p2move:
        // すべての動作が終わっているかを判定
        let flg = false; // 動作しているならTrue
        for(let i=0; i<8; i++){
          for(let j=0; j<8; j++){
            if(this.stones[i][j].turnFlg){
              flg = true;
              break;
            }
          }
        }
        if(!flg){
          this.status = this.status==this.statusObj.p1move? this.statusObj.p2turn: this.statusObj.p1turn; // ステータス切り替え
        }
        break;

      case this.statusObj.p2move:
        // player2 の処理の反映
        get_reverse_scores(1, this.lastMoveStonePos[1], this.lastMoveStonePos[0], get_table(this.stones))[1].forEach((pos)=>{
          var t = Math.abs(pos[0]-this.lastMoveStonePos[0])+Math.abs(pos[1]-this.lastMoveStonePos[1]);
          this.stones[pos[0]][pos[1]].turn(10*t);
        });
        console.log(get_reverse_scores(1, this.lastMoveStonePos[1], this.lastMoveStonePos[0], get_table(this.stones))[1])
        this.status = this.statusObj.p1turn;
        break;
    }
    for(let i=0; i<this.size[1]; i++){
      for(let j=0; j<this.size[0]; j++){
        this.stones[i][j].update();
      }
    }
  }
  onClick(event){
    const canvasBounds = this.renderer.domElement.getBoundingClientRect();
    // マウス位置の正規化
    this.mouse.x = ((event.clientX - canvasBounds.left) / 960) * 2 - 1;
    this.mouse.y = -((event.clientY - canvasBounds.top) / 540) * 2 + 1;
    // raycasterの更新
    this.raycaster.setFromCamera(this.mouse, this.camera);
    // 交差判定
    const intersects = this.raycaster.intersectObjects(this.scene.children);
    // 交差しているオブジェクトが存在する場合。
    if (intersects.length > 0) {
      // 交差しているオブジェクトを取得
      this.mouseClickPos.push(intersects[0].object.parent.parent);
    }
  }

  onKeyDown(event){
    if(this.game_play == false){
      return;
    }
    if(event.key == 'a'){
      console.log("aが押されました。");
    }
  }
}