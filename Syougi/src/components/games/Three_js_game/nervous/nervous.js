import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
//import { MeshLine, MeshLineMaterial, MeshLineRaycast } from "three.meshline";
export default class Nervous {

  constructor(scene,camera,renderer) { //事前定義
    //トップファイルから3D空間を渡す。
    this.scene=scene;

    //トップファイルからカメラを渡す。
    this.camera = camera;

    //トップファイルからレンダラーを渡す。
    this.renderer=renderer;

    //GLTFLoaderのインスタンスを格納するプロパティ
    this.loader = null;

    //GLTFモデルデータの定義
    //ステージ
    this.stage=null;
    //カード
    this.clover1 = null;
    this.clover2 = null;
    this.clover3 = null;
    this.clover4 = null;
    this.clover5 = null;
    this.clover6 = null;
    this.clover7 = null;
    this.clover8 = null;
    this.clover9 = null;
    this.clover10 = null;
    this.clover11 = null;
    this.clover12 = null;
    this.diamond1 = null;
    this.diamond2 = null;
    this.diamond3 = null;
    this.diamond4 = null;
    this.diamond5 = null;
    this.diamond6 = null;
    this.diamond7 = null;
    this.diamond8 = null;
    this.diamond9 = null;
    this.diamond10 = null;
    this.diamond11 = null;
    this.diamond12 = null;

    //リザルトで使うテキスト
    this.playerWinTxt = null;
    this.CPUWinTxt = null;
    this.DrawTxt = null;

    this.playersTurnTxt = null;
    this.CPUsTurnTxt = null;

    //カードを格納する配列の定義
    this.cards=[];

    //一枚目のカードの定義
    this.itimaimeCard=null;

    //ゲームプレイ中かどうかのフラグ
    this.game_play = false;

    //マウスイベントの設定
    //this.setupMouseEvents();

    //クリックイベントの設定
    window.addEventListener('click',this.onclick.bind(this),false);

    //マウスの座標を格納するプロパティ
    this.mouse = new THREE.Vector2();

    //Raycasterのインスタンスを格納するプロパティ
    this.raycaster = new THREE.Raycaster();
    
    //カードのグループの定義
    this.group = new THREE.Group();

    //フェーズ宣言
    this.phase=null;

    //遷移前フェーズ宣言
    this.prePhase=null;

    //プレイヤーのスコア宣言
    this.yourScore=null;

    //CPUのスコア宣言
    this.CPUsScore=null;

    //ターン数宣言
    this.Turn=null;

    //カード操作可能フラグ宣言
    this.operable=null;

    //タイマー宣言
    this.time=null;

    this.intersects = null;
    this.obj = null;
    this.nowNumber = null;

    this.timer = null;
    this.timeCounting = null;
    this.timerPhase = null;

    this.remainCardsIndex = [];
    this.primaryCPUSelectedCardIndex = null;

    this.noRepeat = null;

    function delay(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

  }
  
  async nervous_setup(scene){ //神経衰弱の初期セットアップ
    this.game_play = true;

    //GLTF形式のモデルデータの読み込み
    this.loader = new GLTFLoader();

    //GLTFファイルのパス指定
    //ステージ
    this.stage_glb = await this.loader.loadAsync("../assets/games/Concentration/models/stage.glb");
    //カード
    this.clover1_glb = await this.loader.loadAsync("../assets/games/Concentration/models/clovers/clover1.glb");
    this.clover2_glb = await this.loader.loadAsync("../assets/games/Concentration/models/clovers/clover2.glb");
    this.clover3_glb = await this.loader.loadAsync("../assets/games/Concentration/models/clovers/clover3.glb");
    this.clover4_glb = await this.loader.loadAsync("../assets/games/Concentration/models/clovers/clover4.glb");
    this.clover5_glb = await this.loader.loadAsync("../assets/games/Concentration/models/clovers/clover5.glb");
    this.clover6_glb = await this.loader.loadAsync("../assets/games/Concentration/models/clovers/clover6.glb");
    this.clover7_glb = await this.loader.loadAsync("../assets/games/Concentration/models/clovers/clover7.glb");
    this.clover8_glb = await this.loader.loadAsync("../assets/games/Concentration/models/clovers/clover8.glb");
    this.clover9_glb = await this.loader.loadAsync("../assets/games/Concentration/models/clovers/clover9.glb");
    this.clover10_glb = await this.loader.loadAsync("../assets/games/Concentration/models/clovers/clover10.glb");
    this.clover11_glb = await this.loader.loadAsync("../assets/games/Concentration/models/clovers/clover11.glb");
    this.clover12_glb = await this.loader.loadAsync("../assets/games/Concentration/models/clovers/clover12.glb");
    this.clover13_glb = await this.loader.loadAsync("../assets/games/Concentration/models/clovers/clover13.glb");
    this.diamond1_glb = await this.loader.loadAsync("../assets/games/Concentration/models/diamonds/diamond1.glb");
    this.diamond2_glb = await this.loader.loadAsync("../assets/games/Concentration/models/diamonds/diamond2.glb");
    this.diamond3_glb = await this.loader.loadAsync("../assets/games/Concentration/models/diamonds/diamond3.glb");
    this.diamond4_glb = await this.loader.loadAsync("../assets/games/Concentration/models/diamonds/diamond4.glb");
    this.diamond5_glb = await this.loader.loadAsync("../assets/games/Concentration/models/diamonds/diamond5.glb");
    this.diamond6_glb = await this.loader.loadAsync("../assets/games/Concentration/models/diamonds/diamond6.glb");
    this.diamond7_glb = await this.loader.loadAsync("../assets/games/Concentration/models/diamonds/diamond7.glb");
    this.diamond8_glb = await this.loader.loadAsync("../assets/games/Concentration/models/diamonds/diamond8.glb");
    this.diamond9_glb = await this.loader.loadAsync("../assets/games/Concentration/models/diamonds/diamond9.glb");
    this.diamond10_glb = await this.loader.loadAsync("../assets/games/Concentration/models/diamonds/daimond10.glb");
    this.diamond11_glb = await this.loader.loadAsync("../assets/games/Concentration/models/diamonds/diamond11.glb");
    this.diamond12_glb = await this.loader.loadAsync("../assets/games/Concentration/models/diamonds/diamond12.glb");
    this.diamond13_glb = await this.loader.loadAsync("../assets/games/Concentration/models/diamonds/diamond13.glb");
    this.heart1_glb = await this.loader.loadAsync("../assets/games/Concentration/models/hearts/heart1.glb");
    this.heart2_glb = await this.loader.loadAsync("../assets/games/Concentration/models/hearts/heart2.glb");
    this.heart3_glb = await this.loader.loadAsync("../assets/games/Concentration/models/hearts/heart3.glb");
    this.heart4_glb = await this.loader.loadAsync("../assets/games/Concentration/models/hearts/heart4.glb");
    this.heart5_glb = await this.loader.loadAsync("../assets/games/Concentration/models/hearts/heart5.glb");
    this.heart6_glb = await this.loader.loadAsync("../assets/games/Concentration/models/hearts/heart6.glb");
    this.heart7_glb = await this.loader.loadAsync("../assets/games/Concentration/models/hearts/heart7.glb");
    this.heart8_glb = await this.loader.loadAsync("../assets/games/Concentration/models/hearts/heart8.glb");
    this.heart9_glb = await this.loader.loadAsync("../assets/games/Concentration/models/hearts/heart9.glb");
    this.heart10_glb = await this.loader.loadAsync("../assets/games/Concentration/models/hearts/heart10.glb");
    this.heart11_glb = await this.loader.loadAsync("../assets/games/Concentration/models/hearts/heart11.glb");
    this.heart12_glb = await this.loader.loadAsync("../assets/games/Concentration/models/hearts/heart12.glb");
    this.heart13_glb = await this.loader.loadAsync("../assets/games/Concentration/models/hearts/heart13.glb");
    this.spade1_glb = await this.loader.loadAsync("../assets/games/Concentration/models/spades/spade1.glb");
    this.spade2_glb = await this.loader.loadAsync("../assets/games/Concentration/models/spades/spade2.glb");
    this.spade3_glb = await this.loader.loadAsync("../assets/games/Concentration/models/spades/spade3.glb");
    this.spade4_glb = await this.loader.loadAsync("../assets/games/Concentration/models/spades/spade4.glb");
    this.spade5_glb = await this.loader.loadAsync("../assets/games/Concentration/models/spades/spade5.glb");
    this.spade6_glb = await this.loader.loadAsync("../assets/games/Concentration/models/spades/spade6.glb");
    this.spade7_glb = await this.loader.loadAsync("../assets/games/Concentration/models/spades/spade7.glb");
    this.spade8_glb = await this.loader.loadAsync("../assets/games/Concentration/models/spades/spade8.glb");
    this.spade9_glb = await this.loader.loadAsync("../assets/games/Concentration/models/spades/spade9.glb");
    this.spade10_glb = await this.loader.loadAsync("../assets/games/Concentration/models/spades/spade10.glb");
    this.spade11_glb = await this.loader.loadAsync("../assets/games/Concentration/models/spades/spade11.glb");
    this.spade12_glb = await this.loader.loadAsync("../assets/games/Concentration/models/spades/spade12.glb");
    this.spade13_glb = await this.loader.loadAsync("../assets/games/Concentration/models/spades/spade13.glb");
    this.joker1_glb = await this.loader.loadAsync("../assets/games/Concentration/models/joker.glb");
    this.joker2_glb = await this.loader.loadAsync("../assets/games/Concentration/models/joker.glb");
    
    this.playerWinTxt_glb = await this.loader.loadAsync("../assets/games/Concentration/models/PlayerWonText.glb");
    this.CPUWinTxt_glb = await this.loader.loadAsync("../assets/games/Concentration/models/CPUWonText.glb");
    this.DrawTxt_glb = await this.loader.loadAsync("../assets/games/Concentration/models/DrawText.glb");

    this.playersTurnTxt_glb = await this.loader.loadAsync("../assets/games/Concentration/models/playersTurnText.glb");
    this.CPUsTurnTxt_glb = await this.loader.loadAsync("../assets/games/Concentration/models/CPUsTurnText.glb");
    
    //読み込み後に3D空間に追加
    //ステージ
    this.stage=this.stage_glb.scene;
    //カード
    this.clover1=this.clover1_glb.scene;
    this.clover2=this.clover2_glb.scene;
    this.clover3=this.clover3_glb.scene;
    this.clover4=this.clover4_glb.scene;
    this.clover5=this.clover5_glb.scene;
    this.clover6=this.clover6_glb.scene;
    this.clover7=this.clover7_glb.scene;
    this.clover8=this.clover8_glb.scene;
    this.clover9=this.clover9_glb.scene;
    this.clover10=this.clover10_glb.scene;
    this.clover11=this.clover11_glb.scene;
    this.clover12=this.clover12_glb.scene;
    this.clover13=this.clover13_glb.scene;
    this.diamond1=this.diamond1_glb.scene;
    this.diamond2=this.diamond2_glb.scene;
    this.diamond3=this.diamond3_glb.scene;
    this.diamond4=this.diamond4_glb.scene;
    this.diamond5=this.diamond5_glb.scene;
    this.diamond6=this.diamond6_glb.scene;
    this.diamond7=this.diamond7_glb.scene;
    this.diamond8=this.diamond8_glb.scene;
    this.diamond9=this.diamond9_glb.scene;
    this.diamond10=this.diamond10_glb.scene;
    this.diamond11=this.diamond11_glb.scene;
    this.diamond12=this.diamond12_glb.scene;
    this.diamond13=this.diamond13_glb.scene;
    this.heart1=this.heart1_glb.scene;
    this.heart2=this.heart2_glb.scene;
    this.heart3=this.heart3_glb.scene;
    this.heart4=this.heart4_glb.scene;
    this.heart5=this.heart5_glb.scene;
    this.heart6=this.heart6_glb.scene;
    this.heart7=this.heart7_glb.scene;
    this.heart8=this.heart8_glb.scene;
    this.heart9=this.heart9_glb.scene;
    this.heart10=this.heart10_glb.scene;
    this.heart11=this.heart11_glb.scene;
    this.heart12=this.heart12_glb.scene;
    this.heart13=this.heart13_glb.scene;
    this.spade1=this.spade1_glb.scene;
    this.spade2=this.spade2_glb.scene;
    this.spade3=this.spade3_glb.scene;
    this.spade4=this.spade4_glb.scene;
    this.spade5=this.spade5_glb.scene;
    this.spade6=this.spade6_glb.scene;
    this.spade7=this.spade7_glb.scene;
    this.spade8=this.spade8_glb.scene;
    this.spade9=this.spade9_glb.scene;
    this.spade10=this.spade10_glb.scene;
    this.spade11=this.spade11_glb.scene;
    this.spade12=this.spade12_glb.scene;
    this.spade13=this.spade13_glb.scene;
    this.joker1=this.joker1_glb.scene;
    this.joker2=this.joker2_glb.scene;

    this.playerWinTxt = this.playerWinTxt_glb.scene;
    this.CPUWinTxt = this.CPUWinTxt_glb.scene;
    this.DrawTxt = this.DrawTxt_glb.scene;

    this.playersTurnTxt = this.playersTurnTxt_glb.scene;
    this.CPUsTurnTxt = this.CPUsTurnTxt_glb.scene;

    //モデルの大きさを調整
    this.stage.scale.set(300,100,300);
    //x座標：カードの厚み,y座標：カードの縦幅,z座標：カードの横幅
    this.clover1.scale.set(10, 6, 5);
    this.clover2.scale.set(10, 6, 5);
    this.clover3.scale.set(10, 6, 5);
    this.clover4.scale.set(10, 6, 5);
    this.clover5.scale.set(10, 6, 5);
    this.clover6.scale.set(10, 6, 5);
    this.clover7.scale.set(10, 6, 5);
    this.clover8.scale.set(10, 6, 5);
    this.clover9.scale.set(10, 6, 5);
    this.clover10.scale.set(10, 6, 5);
    this.clover11.scale.set(10, 6, 5);
    this.clover12.scale.set(10, 6, 5);
    this.clover13.scale.set(10, 6, 5);
    this.diamond1.scale.set(10, 6, 5);
    this.diamond2.scale.set(10, 6, 5);
    this.diamond3.scale.set(10, 6, 5);
    this.diamond4.scale.set(10, 6, 5);
    this.diamond5.scale.set(10, 6, 5);
    this.diamond6.scale.set(10, 6, 5);
    this.diamond7.scale.set(10, 6, 5);
    this.diamond8.scale.set(10, 6, 5);
    this.diamond9.scale.set(10, 6, 5);
    this.diamond10.scale.set(10, 6, 5);
    this.diamond11.scale.set(10, 6, 5);
    this.diamond12.scale.set(10, 6, 5);
    this.diamond13.scale.set(10, 6, 5);
    this.heart1.scale.set(10, 6, 5);
    this.heart2.scale.set(10, 6, 5);
    this.heart3.scale.set(10, 6, 5);
    this.heart4.scale.set(10, 6, 5);
    this.heart5.scale.set(10, 6, 5);
    this.heart6.scale.set(10, 6, 5);
    this.heart7.scale.set(10, 6, 5);
    this.heart8.scale.set(10, 6, 5);
    this.heart9.scale.set(10, 6, 5);
    this.heart10.scale.set(10, 6, 5);
    this.heart11.scale.set(10, 6, 5);
    this.heart12.scale.set(10, 6, 5);
    this.heart13.scale.set(10, 6, 5);
    this.spade1.scale.set(10, 6, 5);
    this.spade2.scale.set(10, 6, 5);
    this.spade3.scale.set(10, 6, 5);
    this.spade4.scale.set(10, 6, 5);
    this.spade5.scale.set(10, 6, 5);
    this.spade6.scale.set(10, 6, 5);
    this.spade7.scale.set(10, 6, 5);
    this.spade8.scale.set(10, 6, 5);
    this.spade9.scale.set(10, 6, 5);
    this.spade10.scale.set(10, 6, 5);
    this.spade11.scale.set(10, 6, 5);
    this.spade12.scale.set(10, 6, 5);
    this.spade13.scale.set(10, 6, 5);
    this.joker1.scale.set(10, 6, 5);
    this.joker2.scale.set(10, 6, 5);

    this.playerWinTxt.scale.set(100, 100, 100);
    this.CPUWinTxt.scale.set(100, 100, 100);
    this.DrawTxt.scale.set(100, 100, 100);

    this.playersTurnTxt.scale.set(40, 40, 40);
    this.CPUsTurnTxt.scale.set(40, 40, 40);

    //モデル９０度回転
    //ステージ
    this.stage.rotation.set(Math.PI/2,0,0);
    //カード
    this.clover1.rotation.set(0,Math.PI/2,0);
    this.clover2.rotation.set(0,Math.PI/2,0);
    this.clover3.rotation.set(0,Math.PI/2,0);
    this.clover4.rotation.set(0,Math.PI/2,0);
    this.clover5.rotation.set(0,Math.PI/2,0);
    this.clover6.rotation.set(0,Math.PI/2,0);
    this.clover7.rotation.set(0,Math.PI/2,0);
    this.clover8.rotation.set(0,Math.PI/2,0);
    this.clover9.rotation.set(0,Math.PI/2,0);
    this.clover10.rotation.set(0,Math.PI/2,0);
    this.clover11.rotation.set(0,Math.PI/2,0);
    this.clover12.rotation.set(0,Math.PI/2,0);
    this.clover13.rotation.set(0,Math.PI/2,0);
    this.diamond1.rotation.set(0,Math.PI/2,0);
    this.diamond2.rotation.set(0,Math.PI/2,0);
    this.diamond3.rotation.set(0,Math.PI/2,0);
    this.diamond4.rotation.set(0,Math.PI/2,0);
    this.diamond5.rotation.set(0,Math.PI/2,0);
    this.diamond6.rotation.set(0,Math.PI/2,0);
    this.diamond7.rotation.set(0,Math.PI/2,0);
    this.diamond8.rotation.set(0,Math.PI/2,0);
    this.diamond9.rotation.set(0,Math.PI/2,0);
    this.diamond10.rotation.set(0,Math.PI/2,0);
    this.diamond11.rotation.set(0,Math.PI/2,0);
    this.diamond12.rotation.set(0,Math.PI/2,0);
    this.diamond13.rotation.set(0,Math.PI/2,0);
    this.heart1.rotation.set(0,Math.PI/2,0);
    this.heart2.rotation.set(0,Math.PI/2,0);
    this.heart3.rotation.set(0,Math.PI/2,0);
    this.heart4.rotation.set(0,Math.PI/2,0);
    this.heart5.rotation.set(0,Math.PI/2,0);
    this.heart6.rotation.set(0,Math.PI/2,0);
    this.heart7.rotation.set(0,Math.PI/2,0);
    this.heart8.rotation.set(0,Math.PI/2,0);
    this.heart9.rotation.set(0,Math.PI/2,0);
    this.heart10.rotation.set(0,Math.PI/2,0);
    this.heart11.rotation.set(0,Math.PI/2,0);
    this.heart12.rotation.set(0,Math.PI/2,0);
    this.heart13.rotation.set(0,Math.PI/2,0);
    this.spade1.rotation.set(0,Math.PI/2,0);
    this.spade2.rotation.set(0,Math.PI/2,0);
    this.spade3.rotation.set(0,Math.PI/2,0);
    this.spade4.rotation.set(0,Math.PI/2,0);
    this.spade5.rotation.set(0,Math.PI/2,0);
    this.spade6.rotation.set(0,Math.PI/2,0);
    this.spade7.rotation.set(0,Math.PI/2,0);
    this.spade8.rotation.set(0,Math.PI/2,0);
    this.spade9.rotation.set(0,Math.PI/2,0);
    this.spade10.rotation.set(0,Math.PI/2,0);
    this.spade11.rotation.set(0,Math.PI/2,0);
    this.spade12.rotation.set(0,Math.PI/2,0);
    this.spade13.rotation.set(0,Math.PI/2,0);
    this.joker1.rotation.set(0,Math.PI/2,0);
    this.joker2.rotation.set(0,Math.PI/2,0);


    //ステージに名前を設定
    this.stage.name="stage";
    //カードに数字を設定
    this.clover1.name='1';
    this.clover2.name='2';
    this.clover3.name='3';
    this.clover4.name='4';
    this.clover5.name='5';
    this.clover6.name='6';
    this.clover7.name='7';
    this.clover8.name='8';
    this.clover9.name='9';
    this.clover10.name='10';
    this.clover11.name='11';
    this.clover12.name='12';
    this.clover13.name='13';
    this.diamond1.name='1';
    this.diamond2.name='2';
    this.diamond3.name='3';
    this.diamond4.name='4';
    this.diamond5.name='5';
    this.diamond6.name='6';
    this.diamond7.name='7';
    this.diamond8.name='8';
    this.diamond9.name='9';
    this.diamond10.name='10';
    this.diamond11.name='11';
    this.diamond12.name='12';
    this.diamond13.name='13';
    this.heart1.name='1';
    this.heart2.name='2';
    this.heart3.name='3';
    this.heart4.name='4';
    this.heart5.name='5';
    this.heart6.name='6';
    this.heart7.name='7';
    this.heart8.name='8';
    this.heart9.name='9';
    this.heart10.name='10';
    this.heart11.name='11';
    this.heart12.name='12';
    this.heart13.name='13';
    this.spade1.name='1';
    this.spade2.name='2';
    this.spade3.name='3';
    this.spade4.name='4';
    this.spade5.name='5';
    this.spade6.name='6';
    this.spade7.name='7';
    this.spade8.name='8';
    this.spade9.name='9';
    this.spade10.name='10';
    this.spade11.name='11';
    this.spade12.name='12';
    this.spade13.name='13';
    this.joker1.name='joker';
    this.joker2.name='joker';

    //cards配列にカードを格納
    this.cards[0]=this.clover1;
    this.cards[1]=this.clover2;
    this.cards[2]=this.clover3;
    this.cards[3]=this.clover4;
    this.cards[4]=this.clover5;
    this.cards[5]=this.clover6;
    this.cards[6]=this.clover7;
    this.cards[7]=this.clover8;
    this.cards[8]=this.clover9;
    this.cards[9]=this.clover10;
    this.cards[10]=this.clover11;
    this.cards[11]=this.clover12;
    this.cards[12]=this.clover13;
    this.cards[13]=this.diamond1;
    this.cards[14]=this.diamond2;
    this.cards[15]=this.diamond3;
    this.cards[16]=this.diamond4;
    this.cards[17]=this.diamond5;
    this.cards[18]=this.diamond6;
    this.cards[19]=this.diamond7;
    this.cards[20]=this.diamond8;
    this.cards[21]=this.diamond9;
    this.cards[22]=this.diamond10;
    this.cards[23]=this.diamond11;
    this.cards[24]=this.diamond12;
    this.cards[25]=this.diamond13;
    this.cards[26]=this.heart1;
    this.cards[27]=this.heart2;
    this.cards[28]=this.heart3;
    this.cards[29]=this.heart4;
    this.cards[30]=this.heart5;
    this.cards[31]=this.heart6;
    this.cards[32]=this.heart7;
    this.cards[33]=this.heart8;
    this.cards[34]=this.heart9;
    this.cards[35]=this.heart10;
    this.cards[36]=this.heart11;
    this.cards[37]=this.heart12;
    this.cards[38]=this.heart13;
    this.cards[39]=this.spade1;
    this.cards[40]=this.spade2;
    this.cards[41]=this.spade3;
    this.cards[42]=this.spade4;
    this.cards[43]=this.spade5;
    this.cards[44]=this.spade6;
    this.cards[45]=this.spade7;
    this.cards[46]=this.spade8;
    this.cards[47]=this.spade9;
    this.cards[48]=this.spade10;
    this.cards[49]=this.spade11;
    this.cards[50]=this.spade12;
    this.cards[51]=this.spade13;
    this.cards[52]=this.joker1;
    this.cards[53]=this.joker2;

    arrayShuffle(this.cards);//カードをシャッフル

    for(let i = 0; i < 54; i++){
      this.cards[i].index = i;
    }
    //console.log(this.cards[34].index);

    //カードのポジション設定
    for(let i=0;i<6;i++){
      const tate=i*120;
      for(let j=0;j<9;j++){
        const yoko=j*120;
        this.cards[i*9+j].position.set(
          -600+yoko,
          -300+tate,
          0
        );
        this.group.add(this.cards[i*9+j]);
      }
    }
    //ステージのポジション設定
    this.stage.position.set(0,0,-10);

    scene.add(this.stage,this.group);

    // camera
    this.camera.position.set(-150,0, 980);
    this.camera.rotation.set(0,0,0);
    //this.camera.lookAt(new THREE.Vector3(0, 0, 0));

    // 配列シャッフル
    function arrayShuffle(array) {
      for(let i = (array.length - 1); 0 < i; i--){
    
        // 0〜(i+1)の範囲で値を取得
        let r = Math.floor(Math.random() * (i + 1));
    
        // 要素の並び替えを実行
        let tmp = array[i];
        array[i] = array[r];
        array[r] = tmp;
      }
      return array;
    }
    
    //フェーズ初期化
    this.phase = 1;

    this.operable = true;

    this.timer = 0;
    this.timeCounting = false;
    this.timerPhase = "";

    this.noRepeat = false;

    //リザルトのテキストの位置
    //(960, 540)
    this.playerWinTxt.position.set(-100, -100, -100);
    this.CPUWinTxt.position.set(-100, -100, -100);
    this.DrawTxt.position.set(-100, -100, -100);
    this.playerWinTxt.rotation.set(Math.PI/2, 0, 0);
    this.CPUWinTxt.rotation.set(Math.PI/2, 0, 0);
    this.DrawTxt.rotation.set(Math.PI / 2, 0, 0);
    scene.add(this.playerWinTxt);
    scene.add(this.CPUWinTxt);
    scene.add(this.DrawTxt);

    this.playersTurnTxt.position.set(-100, -100, -100);
    this.CPUsTurnTxt.position.set(-100, -100, -100);
    this.playersTurnTxt.rotation.set(Math.PI/2, 0, 0);
    this.CPUsTurnTxt.rotation.set(Math.PI/2, 0, 0);
    scene.add(this.playersTurnTxt);
    scene.add(this.CPUsTurnTxt);
  }

  //Loopイベント
  nervous_loop(camera,canvas){ //描画し続ける
    //this.controls = new OrbitControls(camera,canvas);
    //console.log(this.phase);
    //console.log("Current timerPhase : " + this.timerPhase);

    //タイマーのカウントアップ機能 : this.timeCounting = true; とすればカウント開始
    if(this.timeCounting == true){
      this.timer++;
    } else {
      this.timer = 0;
    }

    if (this.timer >= 360) {
      this.timeCounting = false;
      this.timer = 0;
      switch (this.timerPhase){
        case "comboJudge":
          if(this.phase == 3){
            this.playerComboJudge();
          } else if(this.phase == 5){
            this.CPUComboJudge();
          }
          break;
        
        case "CPUSelect":
          if(this.phase == 4 || this.phase == 5){
            let finalSelect = false;
            let CPUSelectedCardsIndex = null;
            while (finalSelect == false) {
              CPUSelectedCardsIndex = Math.floor(Math.random() * 54);
              //console.log("CPU selected : " + CPUSelectedCardsIndex);
              if (this.remainCardsIndex[CPUSelectedCardsIndex] == 1) {
                if (this.primaryCPUSelectedCardIndex == null) {
                  finalSelect = true;
                  this.primaryCPUSelectedCardIndex = CPUSelectedCardsIndex;
                } else if (this.primaryCPUSelectedCardIndex != CPUSelectedCardsIndex) {
                  finalSelect = true;
                  this.primaryCPUSelectedCardIndex = null;
                }
              }
            }
            this.obj = this.cards[CPUSelectedCardsIndex];
            //console.log("cards index CPU selected : " + this.obj.index);
            this.CPUSelectCard();
          }
          break;

        case "":
          break;

        default:
          break;
      }
    }

    //ターン表示
    if(this.phase == 2){
      if(this.noRepeat == false){
        console.log("Player's Turn");
        this.playersTurnTxt.position.set(-700, -380, 0);
        this.noRepeat = true;
      }
    } else if(this.phase == 4){
      if (this.noRepeat == false) {
        console.log("CPU's Turn");
        this.CPUsTurnTxt.position.set(-700, -380, 0);
        this.noRepeat = true;
      }
    }
    
    
    switch (this.phase){ //フェーズスイッチング
      case 1: // ゲームスタート
        this.gameStart();

      case 2: // プレイヤーの1枚目ターン
        this.playersTurn_1();

      case 3: // プレイヤーの2枚目ターン
        this.playersTurn_2();

      case 4: // CPUの1枚目ターン
        this.CPUsTurn_1();

      case 5: // CPUの2枚目ターン
        this.CPUsTurn_2();

      case 6: //終了・結果
        this.result();
    }
    

    /*
    gameStart(){
      //ゲームスタート
      //カード全106枚を並べる

      //スコアリセット
      yourScore = 0;
      CPUsScore = 0;

      //ターン数リセット
      Turn = 0;

      //プレイヤーのターンへ
      prePhase=1;
      phase=2;

    }

    playersTurn_1(){
      //プレイヤーの1枚目ターンを記述
      //タイマー動作開始
      time = 10;

      if(prePhase == 4 || prePhase == 5){//遷移前フェーズがCPUのターンだったら...
        //ターン数カウントアップ
        Turn++;
      }
    
      //カード操作可能フラグを立てる
      operable = true;

      if(true){//1枚目のカードを選択したら...
        // 2枚目ターンへ
        // prePhase = 2;
        // phase = 3;

      } else if(time <= 0){//タイマーが0になったら...
        //CPUの1枚目ターンへ
        operable = false;
        prePhase = 2;
        phase = 5;

      }
    }

    playersTurn_2(){
      //プレイヤーの2枚目ターンを記述
      //タイマー動作開始
      time = 10;

      if(true){//2枚目のカードを選択したら...
        //継続判定へ
        // comboJudge(phase,prePhase,yourScore,CPUsScore);

      } else if(time <= 0){//タイマーが0になったら...
        //CPUの1枚目ターンへ
        operable = false;
        prePhase = 3;
        phase = 5;

      }
    }

    CPUsTurn_1(){
      //CPUの1枚目ターンを記述
    }

    CPUsTurn_2(){
      //CPUの2枚目ターンを記述
    }

    result(){
      //終了、結果の記述
    }

    
    function comboJudge(phase,prePhase,yourScore,CPUsScore){
      //継続判定
      if(true){//1枚目のカードと同じなら...
        //スコア加算、ターン継続
        if(phase == 3){//プレイヤーのターンのとき
          yourScore++;
          prePhase = 3;
          phase = 2;

        } else if(phase == 5){//CPUのターンのとき
          CPUsScore++;
          prePhase = 5;
          phase = 4;

        }
      } else {
        if(phase == 3){//プレイヤーのターンのとき
          //CPUの1枚目ターンへ
          prePhase = 3;
          phase = 4;

        } else if(phase == 5){//CPUのターンのとき
          //プレイヤーの1枚目ターンへ
          prePhase = 5;
          phase = 2;
          
        }
      }
    }
    */
  }

  gameStart() {
    //ゲームスタート
    //カード全106枚を並べる

    //スコアリセット
    this.yourScore = 0;
    this.CPUsScore = 0;

    //ターン数リセット
    this.Turn = 0;

    //残りカードのインデックス配列
    for(let i = 0; i < 54; i++){
      this.remainCardsIndex[i] = 1;
    }

    //プレイヤーのターンへ
    this.prePhase = 1;
    this.phase = 2;

  }

  playersTurn_1() {
    //プレイヤーの1枚目ターンを記述
    //タイマー動作開始
    this.time = 10;

    if (this.prePhase == 4 || this.prePhase == 5) {//遷移前フェーズがCPUのターンだったら...
      //ターン数カウントアップ
      //this.Turn++;
    }

    //カード操作可能フラグを立てる
    //this.operable = true;

    if (true) {//1枚目のカードを選択したら...
      // 2枚目ターンへ
      // prePhase = 2;
      // phase = 3;

    } else if (this.time <= 0) {//タイマーが0になったら...
      //CPUの1枚目ターンへ
      this.operable = false;
      this.prePhase = 2;
      this.phase = 5;

    }
  }

  playersTurn_2() {
    //プレイヤーの2枚目ターンを記述
    //タイマー動作開始
    this.time = 10;

    if (true) {//2枚目のカードを選択したら...
      //継続判定へ
      // comboJudge(phase,prePhase,yourScore,CPUsScore);

    } else if (this.time <= 0) {//タイマーが0になったら...
      //CPUの1枚目ターンへ
      this.operable = false;
      this.prePhase = 3;
      this.phase = 5;

    }
  }

  CPUsTurn_1() {
    //CPUの1枚目ターンを記述
  }

  CPUsTurn_2() {
    //CPUの2枚目ターンを記述
  }

  result() {
    //終了、結果の記述
  }

  /*
  function comboJudge(phase,prePhase,yourScore,CPUsScore){
    //継続判定
    if(true){//1枚目のカードと同じなら...
      //スコア加算、ターン継続
      if(phase == 3){//プレイヤーのターンのとき
        yourScore++;
        prePhase = 3;
        phase = 2;

      } else if(phase == 5){//CPUのターンのとき
        CPUsScore++;
        prePhase = 5;
        phase = 4;

      }
    } else {
      if(phase == 3){//プレイヤーのターンのとき
        //CPUの1枚目ターンへ
        prePhase = 3;
        phase = 4;

      } else if(phase == 5){//CPUのターンのとき
        //プレイヤーの1枚目ターンへ
        prePhase = 5;
        phase = 2;
        
      }
    }
  }
  */
  
  //入力イベント
  onclick(event){ //カードを選択した時の処理
    if(!(this.game_play)){return;}
    const canvasBounds = this.renderer.domElement.getBoundingClientRect();
    // マウス位置の正規化
    this.mouse.x = ((event.clientX - canvasBounds.left)/ 960) * 2 - 1;
    this.mouse.y = -((event.clientY - canvasBounds.top)/ 540) * 2 + 1;
    // raycasterの更新
    this.raycaster.setFromCamera(this.mouse, this.camera);
    // 交差判定
    //const intersects = this.raycaster.intersectObjects(this.scene.children);
    this.intersects = this.raycaster.intersectObjects(this.scene.children);

    //交差しているオブジェクトがある場合
    if (this.intersects.length > 0 && (this.intersects[0].object != this.itimaimeCard || this.itimaimeCard == null) && this.timeCounting == false && this.operable == true){
      // 交差しているオブジェクトを取得
      this.obj = this.intersects[0].object;

      if (this.obj.parent.name == "stage") {
        return;
      }
      this.playerselectCard();
      /*
      // 交差しているオブジェクトを取得
      //let obj=intersects[0].object;
      this.obj=this.intersects[0].object;
      
      if(this.obj.parent.name=="stage"){
        return;
      }

      //カードを裏返す
      //obj.rotation.set(0,Math.PI,0);
      this.obj.rotation.set(0,Math.PI,0);
      //let nowNumber=obj.parent.name;
      this.nowNumber=this.obj.parent.name;
      //console.log(nowNumber);
      if(this.phase == 2){
        console.log("Player's Turn");
      } else if (this.phase == 4){
        console.log("CPU's Turn");
      }
      console.log(this.nowNumber);

      //選んだカードが1枚目の場合
      if(this.itimaimeCard==null && (this.phase == 2 || this.phase == 4)){
        this.itimaimeCard = this.obj;
        // console.log("1枚目");
        // console.log(this.itimaimeCard.parent.name);
        if(this.phase == 2){
          this.prePhase = 2;
          this.phase = 3;
        } else {
          this.prePhase = 4;
          this.phase = 5;
        }
        return;
      }

      //選んだカードが２枚目の場合
      //カードを裏返した状態でディレイ(1秒)をかけて、プレイヤーに何のカードだったか開示する
      //setTimeout(function(){console.log("delay 2000ms");}, 2000);
      const comboJudge = "judge and 2000ms";
      //this.delay(comboJudge);
      this.timerPhase = "comboJudge";
      this.timeCounting = true;

      */
      /*
      //一致の場合
      if(this.itimaimeCard.parent.name == this.nowNumber && this.itimaimeCard != this.obj && (this.phase == 3 || this.phase == 5)){
        console.log("2枚目一致");
        this.itimaimeCard.visible=false;
        this.obj.visible=false;
        this.itimaimeCard=null;
        //ターン継続
        if(this.phase == 3){//プレイヤーのターンのとき
          this.yourScore++;
          this.prePhase = 3;
          this.phase = 2;

        } else if(this.phase == 5){//CPUのターンのとき
          this.CPUsScore++;
          this.prePhase = 5;
          this.phase = 4;

        }
      }
      //不一致の場合
      else{
        console.log("2枚目不一致");

        //カードを元に戻す
        this.itimaimeCard.rotation.y+=Math.PI;
        this.obj.rotation.y+=Math.PI;
        */

        /*
        if(2*Math.PI>this.itimaimeCard.rotation.y && 2*Math.PI>obj.rotation.y){
          console.log("回す");
          this.itimaimeCard.rotation.y += 0.01;
          obj.rotation.y += 0.01; 
        }
        */
        //animate(this.itimaimeCard,obj);
        
        /*
        //選択状態をリセット
        this.itimaimeCard=null;

        if(this.phase == 3){//プレイヤーのターンのとき
          //CPUの1枚目ターンへ
          this.prePhase = 3;
          this.phase = 4;

        } else if(this.phase == 5){//CPUのターンのとき
          //プレイヤーの1枚目ターンへ
          this.prePhase = 5;
          this.phase = 2;
          
        }
      }
      */
      /*
      function animate(itimaimeCard,obj){
        requestAnimationFrame(animate);
        
          console.log("回す");
          itimaimeCard.rotation.y += 0.01;
          obj.rotation.y += 0.01; 
        
       
      }*/
    }
  }

  delay(S){// それぞれの状況に応じてディレイをかける
    switch (S) {
      case "judge and 2000ms":
        setTimeout(this.comboJudge(), 2000);
    }
  }

  playerselectCard(){
    //カードを裏返す
    this.obj.rotation.set(0, Math.PI, 0);
    this.nowNumber = this.obj.parent.name;
    //console.log("Cards number : " + this.nowNumber);

    //選んだカードが1枚目の場合
    if (this.itimaimeCard == null) {
      this.itimaimeCard = this.obj;
      // console.log("1枚目");
      // console.log(this.itimaimeCard.parent.name);
      this.operable = true;
      this.prePhase = 2;
      this.phase = 3;
      return;
    }

    //選んだカードが２枚目の場合
    this.timerPhase = "comboJudge";
    this.timeCounting = true;
  }

  CPUSelectCard() {
    //カードを裏返す
    this.obj.rotation.y += Math.PI;
    this.nowNumber = this.obj.name;
    //console.log("Cards number : " + this.nowNumber);

    //選んだカードが1枚目の場合
    if (this.itimaimeCard == null) {
      this.itimaimeCard = this.obj;
      // console.log("1枚目");
      // console.log(this.itimaimeCard.parent.name);
      this.operable = false;
      this.timerPhase = "CPUSelect";
      this.timeCounting = true;
      this.prePhase = 4;
      this.phase = 5;
      return;
    }

    //選んだカードが２枚目の場合
    this.timerPhase = "comboJudge";
    this.timeCounting = true;
  }
  
  playerComboJudge(){
    //一致の場合
    if(this.itimaimeCard.parent.name == this.nowNumber && this.itimaimeCard != this.obj && (this.phase == 3 || this.phase == 5)){
      console.log("Correct");
      // this.itimaimeCard.visible=false;
      // this.obj.visible=false;
      this.itimaimeCard.position.set(-100, -100, -100);
      this.obj.position.set(-100, -100, -100);
      //console.log("Primaly cards index : " + this.itimaimeCard.parent.index);
      //console.log("Secondary cards index : " + this.obj.parent.index);
      this.remainCardsIndex[this.itimaimeCard.parent.index] = 0;
      this.remainCardsIndex[this.obj.parent.index] = 0;
      this.itimaimeCard=null;
      this.obj = null;
      //ターン継続
      let finish = true;
      for(let i = 0; i < 54; i++){
        if(this.remainCardsIndex[i] != 0){
          finish = false;
        }
      }
      
      if(this.phase == 3){//プレイヤーのターンのとき
        this.yourScore++;
        this.operable = true;
        this.timerPhase = "";
        this.timeCounting = false;
        this.playersTurnTxt.position.set(-100, -100, -100);
        this.CPUsTurnTxt.position.set(-100, -100, -100);
        this.noRepeat = false;
        this.prePhase = 3;
        this.phase = 2;

      }/* else if(this.phase == 5){//CPUのターンのとき
        this.CPUsScore++;
        this.operable = false;
        this.timerPhase = "CPUSelect";
        this.timeCounting = true;
        this.noRepeat = false;
        this.prePhase = 5;
        this.phase = 4;

      }*/
      if (finish == true) {//盤面上にカードが1つもないとき
        this.phase = 6;
      }
    }
    //不一致の場合
    else{
      console.log("Incorrect");

      //カードを元に戻す
      /*
      if(this.itimaimeCard != this.obj){
        this.itimaimeCard.rotation.y += Math.PI;
      }
      */
      this.itimaimeCard.rotation.y+=Math.PI;
      this.obj.rotation.y+=Math.PI;

      //選択状態をリセット
      this.itimaimeCard=null;
      this.obj = null;

      if(this.phase == 3){//プレイヤーのターンのとき
        //CPUの1枚目ターンへ
        this.operable = false;
        this.timerPhase = "CPUSelect";
        this.timeCounting = true;
        this.playersTurnTxt.position.set(-100, -100, -100);
        this.CPUsTurnTxt.position.set(-100, -100, -100);
        this.noRepeat = false;
        this.prePhase = 3;
        this.phase = 4;

      }/* else if(this.phase == 5){//CPUのターンのとき
        //プレイヤーの1枚目ターンへ
        this.operable = true;
        this.timerPhase = "";
        this.timeCounting = false;
        this.noRepeat = false;
        this.prePhase = 5;
        this.phase = 2;
      }*/
    }
    console.log("CPU : " + this.CPUsScore);
    console.log("Player : " + this.yourScore);
    /*
    console.log("Remain : " + this.remainCardsIndex[0] + ", " + this.remainCardsIndex[1] + ", " + this.remainCardsIndex[2] + ", " + this.remainCardsIndex[3]
                     + ", " + this.remainCardsIndex[4] + ", " + this.remainCardsIndex[5] + ", " + this.remainCardsIndex[6] + ", " + this.remainCardsIndex[7]
                     + ", " + this.remainCardsIndex[8] + ", " + this.remainCardsIndex[9] + ",");
    console.log("Remain : " + this.remainCardsIndex[10] + ", " + this.remainCardsIndex[11] + ", " + this.remainCardsIndex[12] + ", " + this.remainCardsIndex[13]
                     + ", " + this.remainCardsIndex[14] + ", " + this.remainCardsIndex[15] + ", " + this.remainCardsIndex[16] + ", " + this.remainCardsIndex[17]
                     + ", " + this.remainCardsIndex[18] + ", " + this.remainCardsIndex[19] + ",");
    console.log("Remain : " + this.remainCardsIndex[20] + ", " + this.remainCardsIndex[21] + ", " + this.remainCardsIndex[22] + ", " + this.remainCardsIndex[23]
                     + ", " + this.remainCardsIndex[24] + ", " + this.remainCardsIndex[25] + ", " + this.remainCardsIndex[26] + ", " + this.remainCardsIndex[27]
                     + ", " + this.remainCardsIndex[28] + ", " + this.remainCardsIndex[29] + ",");
    console.log("Remain : " + this.remainCardsIndex[30] + ", " + this.remainCardsIndex[31] + ", " + this.remainCardsIndex[32] + ", " + this.remainCardsIndex[33]
                     + ", " + this.remainCardsIndex[34] + ", " + this.remainCardsIndex[35] + ", " + this.remainCardsIndex[36] + ", " + this.remainCardsIndex[37]
                     + ", " + this.remainCardsIndex[38] + ", " + this.remainCardsIndex[39] + ",");
    console.log("Remain : " + this.remainCardsIndex[40] + ", " + this.remainCardsIndex[41] + ", " + this.remainCardsIndex[42] + ", " + this.remainCardsIndex[43]
                     + ", " + this.remainCardsIndex[44] + ", " + this.remainCardsIndex[45] + ", " + this.remainCardsIndex[46] + ", " + this.remainCardsIndex[47]
                     + ", " + this.remainCardsIndex[48] + ", " + this.remainCardsIndex[49] + ",");
    console.log("Remain : " + this.remainCardsIndex[50] + ", " + this.remainCardsIndex[51] + ", " + this.remainCardsIndex[52] + ", " + this.remainCardsIndex[53]);
    */
    //console.log(this.timer);
    console.log("");
    if(this.phase == 6){//結果の判定
      if(this.CPUsScore > this.yourScore){
        console.log("CPU Won!");
        this.CPUWinTxt.position.set(-150, 0, 0);
      } else if (this.CPUsScore == this.yourScore){
        console.log("DRAW!!");
        this.DrawTxt.position.set(-150, 0, 0);
      } else {
        console.log("Player Won!!");
        this.playerWinTxt.position.set(-150, 0, 0);
      }
    }
    return;
  }

  CPUComboJudge() {
    //一致の場合
    if (this.itimaimeCard.name == this.nowNumber && this.itimaimeCard != this.obj && this.phase == 5) {
      console.log("Correct");
      this.itimaimeCard.position.set(-100, -100, -100);
      this.obj.position.set(-100, -100, -100);
      //console.log("Primaly cards index : " + this.itimaimeCard.parent.index);
      //console.log("Secondary cards index : " + this.obj.parent.index);
      this.remainCardsIndex[this.itimaimeCard.index] = 0;
      this.remainCardsIndex[this.obj.index] = 0;
      this.itimaimeCard = null;
      this.obj = null;
      //ターン継続
      let finish = true;
      for (let i = 0; i < 54; i++) {
        if (this.remainCardsIndex[i] != 0) {
          finish = false;
        }
      }

      this.CPUsScore++;
      this.operable = false;
      this.timerPhase = "CPUSelect";
      this.timeCounting = true;
      this.playersTurnTxt.position.set(-100, -100, -100);
      this.CPUsTurnTxt.position.set(-100, -100, -100);
      this.noRepeat = false;
      this.prePhase = 5;
      this.phase = 4;

      if (finish == true) {//盤面上にカードが1つもないとき
        this.phase = 6;
      }
    }
    //不一致の場合
    else {
      console.log("Incorrect");

      this.itimaimeCard.rotation.y += Math.PI;
      this.obj.rotation.y += Math.PI;

      //選択状態をリセット
      this.itimaimeCard = null;
      this.obj = null;

      this.operable = true;
      this.timerPhase = "";
      this.timeCounting = false;
      this.playersTurnTxt.position.set(-100, -100, -100);
      this.CPUsTurnTxt.position.set(-100, -100, -100);
      this.noRepeat = false;
      this.prePhase = 5;
      this.phase = 2;

    }
    console.log("CPU : " + this.CPUsScore);
    console.log("Player : " + this.yourScore);
    /*
    console.log("Remain : " + this.remainCardsIndex[0] + ", " + this.remainCardsIndex[1] + ", " + this.remainCardsIndex[2] + ", " + this.remainCardsIndex[3]
      + ", " + this.remainCardsIndex[4] + ", " + this.remainCardsIndex[5] + ", " + this.remainCardsIndex[6] + ", " + this.remainCardsIndex[7]
      + ", " + this.remainCardsIndex[8] + ", " + this.remainCardsIndex[9] + ",");
    console.log("Remain : " + this.remainCardsIndex[10] + ", " + this.remainCardsIndex[11] + ", " + this.remainCardsIndex[12] + ", " + this.remainCardsIndex[13]
      + ", " + this.remainCardsIndex[14] + ", " + this.remainCardsIndex[15] + ", " + this.remainCardsIndex[16] + ", " + this.remainCardsIndex[17]
      + ", " + this.remainCardsIndex[18] + ", " + this.remainCardsIndex[19] + ",");
    console.log("Remain : " + this.remainCardsIndex[20] + ", " + this.remainCardsIndex[21] + ", " + this.remainCardsIndex[22] + ", " + this.remainCardsIndex[23]
      + ", " + this.remainCardsIndex[24] + ", " + this.remainCardsIndex[25] + ", " + this.remainCardsIndex[26] + ", " + this.remainCardsIndex[27]
      + ", " + this.remainCardsIndex[28] + ", " + this.remainCardsIndex[29] + ",");
    console.log("Remain : " + this.remainCardsIndex[30] + ", " + this.remainCardsIndex[31] + ", " + this.remainCardsIndex[32] + ", " + this.remainCardsIndex[33]
      + ", " + this.remainCardsIndex[34] + ", " + this.remainCardsIndex[35] + ", " + this.remainCardsIndex[36] + ", " + this.remainCardsIndex[37]
      + ", " + this.remainCardsIndex[38] + ", " + this.remainCardsIndex[39] + ",");
    console.log("Remain : " + this.remainCardsIndex[40] + ", " + this.remainCardsIndex[41] + ", " + this.remainCardsIndex[42] + ", " + this.remainCardsIndex[43]
      + ", " + this.remainCardsIndex[44] + ", " + this.remainCardsIndex[45] + ", " + this.remainCardsIndex[46] + ", " + this.remainCardsIndex[47]
      + ", " + this.remainCardsIndex[48] + ", " + this.remainCardsIndex[49] + ",");
    console.log("Remain : " + this.remainCardsIndex[50] + ", " + this.remainCardsIndex[51] + ", " + this.remainCardsIndex[52] + ", " + this.remainCardsIndex[53]);
    */
    //console.log(this.timer);
    console.log("");
    if (this.phase == 6) {//結果の判定
      this.playersTurnTxt.position.set(-100, -100, -100);
      this.CPUsTurnTxt.position.set(-100, -100, -100);
      if (this.CPUsScore > this.yourScore) {
        console.log("CPU Won!");
        this.CPUWinTxt.position.set(-150, 0, 0);
      } else if (this.CPUsScore == this.yourScore) {
        console.log("DRAW!!");
        this.DrawTxt.position.set(-150, 0, 0);
      } else {
        console.log("Player Won!!");
        this.playerWinTxt.position.set(-150, 0, 0);
      }
    }
    return;
  }
}
