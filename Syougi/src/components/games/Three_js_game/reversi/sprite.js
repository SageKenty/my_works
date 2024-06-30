export class Stone{
    constructor(x,y,glb){
        // 盤面上の位置
        this.x = x;
        this.y = y;
        // 石の状態
        this.status = -1; // -1: 非表示, 0: 黒, 1白
        // 石のモデル
        this.stone = glb;
        this.stone.x = x;
        this.stone.y = y;
        // 石の名前
        this.stone.name = "stone";
        // 空間上の座標
        this.posX = 47.8*x - 166.8;
        this.posY = 47.8*y - 166.8;
        // サイズ
        this.stone.scale.set(20, 15, 20); // 倍のサイズで表示される...
        // 位置
        this.stone.position.set(47.8*x - 166.8 ,47.8*(7-y) - 166.8 ,30);
        // 回転
        this.stone.rotation.x = Math.PI/2;

        // turn()
        this.turnFlg = false;
        this.turnFrame = 0;

        // setColor()
        this.setColorFlg = false;
        this.setColorFrame = 0;
    }
    turn(delay){
        /* 石を回転させる */
        this.turnFlg = true;
        this.turnFrame = -delay;
        // this.status 書き換え
        switch(this.status){
            case -1:
                console.log(`error! x=${this.x}, y=${this.y} は非表示状態です．`);
                break;
            case 0:
                this.status = 1;
                break;
            case 1:
                this.status = 0;
                break;
        }
    }
    turnUpdate(){
        /* 石を回転させる(この関数は外から呼び出さない) */
        let MoveRange = 100; // 縦の移動量
        let UpTime = 20; // 上昇時間
        let lotateTime = 30;
        let DownTime = 30;
        if(this.turnFrame < 0){
            /* 遅延処理 */ 
        } else if(this.turnFrame < UpTime){
            /* 上昇 */
            this.stone.position.z +=  MoveRange/UpTime;
        } else if(this.turnFrame < UpTime+DownTime){
            /* 下降, 回転 */
            if(this.turnFrame < UpTime+lotateTime){
                this.stone.rotation.x += Math.PI/lotateTime;
            }
            this.stone.position.z -=  MoveRange/DownTime;
        } else {
            // 回転終了
            this.turnFlg = false;
        }
        this.turnFrame += 1;
    }
    setColor(color){
        if(color==0){
            this.status=0;
            this.stone.rotation.x = Math.PI/2;
            this.stone.visible = true;
        } else if(color==1){
            this.status=1;
            this.stone.rotation.x = -Math.PI/2;
            this.stone.visible = true;
        }
        this.setColorFlg = true;
        this.setColorFrame = 0;
    }
    setColorUpdate(){
        let MoveRange = 500;
        let MoveTime = 60;
        if(this.setColorFrame==0){
            this.stone.position.z += MoveRange;
        }
        if(this.setColorFrame < MoveTime){
            this.stone.position.z -= MoveRange/MoveTime;
        }else{
            this.setColorFlg = false;
        }
        this.setColorFrame++;
    }
    update(){
        // 回転
        if(this.turnFlg){
            this.turnUpdate();
        }
        // 配置
        if(this.setColorFlg){
            this.setColorUpdate();
        }
    }
}