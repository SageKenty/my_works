import Syougi from './syougi.js'
export default class SyougiAI {
    //とりあえず現段階では適当に動くくそ雑魚AIを定義。時間の余裕があれば改良する
    //とりあえず適当なものを完成させたい。
    constructor(map, pieces, scene, komaoki) {
        this.kind_map = map
        this.pieces = pieces
        this.scene = scene
        this.komaoki = komaoki
        this.syougi = new Syougi()
    }
    // AIの手を返す
    judge() {
        let actables = []
        this.pieces.children.forEach(piece => {
            const DATA = piece.userData
            const KIND = DATA.kind
            const MAP_X = DATA.map_x
            const MAP_Y = DATA.map_y
            let count = 0
            DATA.movables = []
            DATA.removables = []
            DATA.stockables = []
            if (DATA.player == false) {
                if (DATA.komaoki_map == 0) {
                    switch (KIND) {
                        case 8:
                            if (MAP_Y + 1 > 0) {
                                //上
                                if (this.kind_map[MAP_Y + 1][MAP_X] == null) { DATA.movables[0] = ([MAP_X, MAP_Y + 1]) }
                                else if (this.kind_map[MAP_Y + 1][MAP_X] < 8) { DATA.removables[0] = ([MAP_X, MAP_Y + 1]) }
                            }
                            if (MAP_Y + 1 < 10) {
                                //下
                                if (this.kind_map[MAP_Y + 1][MAP_X] == null) { DATA.movables[1] = ([MAP_X, MAP_Y + 1]) }
                                else if (this.kind_map[MAP_Y + 1][MAP_X] < 8) { DATA.removables[1] = [MAP_X, MAP_Y + 1] }
                            }
                            if (MAP_X - 1 > 0) {
                                //左
                                if (this.kind_map[MAP_Y][MAP_X - 1] == null) { DATA.movables[2] = ([MAP_X - 1, MAP_Y]) }
                                else if (this.kind_map[MAP_Y][MAP_X - 1] < 8) { DATA.removables[2] = [MAP_X - 1, MAP_Y] }
                            }
                            if (MAP_X + 1 < 10) {
                                //右
                                if (this.kind_map[MAP_Y][MAP_X + 1] == null) { DATA.movables[3] = ([MAP_X + 1, MAP_Y]) }
                                else if (this.kind_map[MAP_Y][MAP_X + 1] < 8) { DATA.removables[3] = [MAP_X + 1, MAP_Y] }
                            }
                            if (MAP_Y - 1 > 0 && MAP_X - 1 > 0) {
                                //左上
                                if (this.kind_map[MAP_Y - 1][MAP_X - 1] == null) { DATA.movables[4] = ([MAP_X - 1, MAP_Y - 1]) }
                                else if (this.kind_map[MAP_Y - 1][MAP_X - 1] < 8) { DATA.removables[4] = ([MAP_X - 1, MAP_Y - 1]) }
                            }
                            if (MAP_Y + 1 < 10 && MAP_X - 1 > 0) {
                                //左下
                                if (this.kind_map[MAP_Y + 1][MAP_X - 1] == null) { DATA.movables[5] = ([MAP_X - 1, MAP_Y + 1]) }
                                else if (this.kind_map[MAP_Y + 1][MAP_X - 1] < 8) { DATA.removables[5] = [MAP_X - 1, MAP_Y + 1] }
                            }
                            if (MAP_Y - 1 > 0 && MAP_X + 1 < 10) {
                                //右上
                                if (this.kind_map[MAP_Y - 1][MAP_X + 1] == null) { DATA.movables[6] = ([MAP_X + 1, MAP_Y - 1]) }
                                else if (this.kind_map[MAP_Y - 1][MAP_X + 1] < 8) { DATA.removables[6] = [MAP_X + 1, MAP_Y - 1] }

                            }
                            if (MAP_Y + 1 < 10 && MAP_X + 1 < 10) {
                                //右下
                                if (this.kind_map[MAP_Y + 1][MAP_X + 1] == null) { DATA.movables[7] = ([MAP_X + 1, MAP_Y + 1]) }
                                else if (this.kind_map[MAP_Y + 1][MAP_X + 1] < 8) { DATA.removables[7] = [MAP_X + 1, MAP_Y + 1] }
                            }
                            break;
                        case 9:
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
                            if (this.kind_map[UP_Y - 1][MAP_X] < 8 && UP_Y - 1 < 0) { DATA.removables[0] = [MAP_X, UP_Y - 1] }
                            //下
                            while (DOWN_Y + 1 < 10 && this.kind_map[DOWN_Y + 1][MAP_X] == null) {
                                DOWN_Y++
                                DATA.movables[count] = [MAP_X, DOWN_Y]
                                count++
                            }
                            if (this.kind_map[DOWN_Y + 1][MAP_X] < 8) { DATA.removables[1] = [MAP_X, DOWN_Y + 1] }

                            //左
                            while (LEFT_X - 1 > 0 && this.kind_map[MAP_Y][LEFT_X - 1] == null) {
                                LEFT_X--
                                DATA.movables[count] = [LEFT_X, MAP_Y]
                                count++
                            }
                            if (this.kind_map[MAP_Y][LEFT_X - 1] < 8) { DATA.removables[2] = [LEFT_X - 1, MAP_Y] }

                            //右
                            while (RIGHT_X + 1 < 10 && this.kind_map[MAP_Y][RIGHT_X + 1] == null) {
                                RIGHT_X++
                                DATA.movables[count] = [RIGHT_X, MAP_Y]
                                count++
                            }
                            if (this.kind_map[MAP_Y][RIGHT_X + 1] < 8) { DATA.removables[3] = [RIGHT_X + 1, MAP_Y] }
                            //龍王であれば斜めも移動可能
                            if (DATA.turned == true) {
                                if (MAP_Y - 1 > 0 && MAP_X - 1 > 0) {
                                    //左上
                                    if (this.kind_map[MAP_Y - 1][MAP_X - 1] == null) { DATA.movables[count] = ([MAP_X - 1, MAP_Y - 1]) }
                                    else if (this.kind_map[MAP_Y - 1][MAP_X - 1] < 8) { DATA.removables[4] = ([MAP_X - 1, MAP_Y - 1]) }
                                    count++
                                }
                                if (MAP_Y + 1 < 10 && MAP_X - 1 > 0) {
                                    //左下
                                    if (this.kind_map[MAP_Y + 1][MAP_X - 1] == null) { DATA.movables[count] = ([MAP_X - 1, MAP_Y + 1]) }
                                    else if (this.kind_map[MAP_Y + 1][MAP_X - 1] < 8) { DATA.removables[5] = [MAP_X - 1, MAP_Y + 1] }
                                    count++
                                }
                                if (MAP_Y - 1 > 0 && MAP_X + 1 < 10) {
                                    //右上
                                    if (this.kind_map[MAP_Y - 1][MAP_X + 1] == null) { DATA.movables[count] = ([MAP_X + 1, MAP_Y - 1]) }
                                    else if (this.kind_map[MAP_Y - 1][MAP_X + 1] < 8) { DATA.removables[6] = [MAP_X + 1, MAP_Y - 1] }
                                    count++
                                }
                                if (MAP_Y + 1 < 10 && MAP_X + 1 < 10) {
                                    //右下
                                    if (this.kind_map[MAP_Y + 1][MAP_X + 1] == null) { DATA.movables[count] = ([MAP_X + 1, MAP_Y + 1]) }
                                    else if (this.kind_map[MAP_Y + 1][MAP_X + 1] < 8) { DATA.removables[7] = [MAP_X + 1, MAP_Y + 1] }
                                    count++
                                }
                            }
                            break

                        case 10:
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
                            if (this.kind_map[RU[1] - 1][RU[0] + 1] < 8) { DATA.removables[0] = [RU[0] + 1, RU[1] - 1] }

                            //右下
                            while (RD[0] + 1 < 10 && RD[1] + 1 < 10 && this.kind_map[RD[1] + 1][RD[0] + 1] == null) {
                                RD[0]++;
                                RD[1]++;
                                DATA.movables[count] = [RD[0], RD[1]];
                                count++;
                            }
                            if (this.kind_map[RD[1] + 1][RD[0] + 1] < 8) { DATA.removables[1] = [RD[0] + 1, RD[1] + 1] }

                            //左下
                            while (LU[0] - 1 > 0 && LU[1] + 1 < 10 && this.kind_map[LU[1] + 1][LU[0] - 1] == null) {
                                LU[0]--;
                                LU[1]++;
                                DATA.movables[count] = [LU[0], LU[1]];
                                count++;
                            }
                            if (this.kind_map[LU[1] + 1][LU[0] - 1] < 8) { DATA.removables[2] = [LU[0] - 1, LU[1] + 1] }

                            //左上
                            while (LD[0] - 1 > 0 && LD[1] - 1 > 0 && this.kind_map[LD[1] - 1][LD[0] - 1] == null) {
                                LD[0]--;
                                LD[1]--;
                                DATA.movables[count] = [LD[0], LD[1]];
                                count++;
                            }
                            if (this.kind_map[LD[1] - 1][LD[0] - 1] < 8) { DATA.removables[3] = [LD[0] - 1, LD[1] - 1] }
                            //竜馬であれば直進も可能
                            if (DATA.turned == true) {
                                if (MAP_Y - 1 > 0) {
                                    //上
                                    if (this.kind_map[MAP_Y - 1][MAP_X] == null) { DATA.movables[count] = ([MAP_X, MAP_Y - 1]) }
                                    else if (this.kind_map[MAP_Y - 1][MAP_X] < 8) { DATA.removables[4] = ([MAP_X, MAP_Y - 1]) }
                                    count++
                                }
                                if (MAP_Y + 1 < 10) {
                                    //下
                                    if (this.kind_map[MAP_Y + 1][MAP_X] == null) { DATA.movables[count] = ([MAP_X, MAP_Y + 1]) }
                                    else if (this.kind_map[MAP_Y + 1][MAP_X] < 8) { DATA.removables[5] = [MAP_X, MAP_Y + 1] }
                                    count++
                                }
                                if (MAP_X - 1 > 0) {
                                    //左
                                    if (this.kind_map[MAP_Y][MAP_X - 1] == null) { DATA.movables[count] = ([MAP_X - 1, MAP_Y]) }
                                    else if (this.kind_map[MAP_Y][MAP_X - 1] < 8) { DATA.removables[6] = [MAP_X - 1, MAP_Y] }
                                    count++
                                }
                                if (MAP_X + 1 < 10) {
                                    //右
                                    if (this.kind_map[MAP_Y][MAP_X + 1] == null) { DATA.movables[count] = ([MAP_X + 1, MAP_Y]) }
                                    else if (this.kind_map[MAP_Y][MAP_X + 1] < 8) { DATA.removables[7] = [MAP_X + 1, MAP_Y] }
                                    count++
                                }
                            }
                            break;
                        case 11:
                            //金将の場合
                            if (MAP_Y - 1 > 0) {
                                //上
                                if (this.kind_map[MAP_Y - 1][MAP_X] == null) { DATA.movables[0] = ([MAP_X, MAP_Y - 1]) }
                                else if (this.kind_map[MAP_Y - 1][MAP_X] < 8) { DATA.removables[0] = ([MAP_X, MAP_Y - 1]) }
                            }
                            if (MAP_Y + 1 < 10) {
                                //下
                                if (this.kind_map[MAP_Y + 1][MAP_X] == null) { DATA.movables[1] = ([MAP_X, MAP_Y + 1]) }
                                else if (this.kind_map[MAP_Y + 1][MAP_X] < 8) { DATA.removables[1] = [MAP_X, MAP_Y + 1] }
                            }
                            if (MAP_X - 1 > 0) {
                                //左
                                if (this.kind_map[MAP_Y][MAP_X - 1] == null) { DATA.movables[2] = ([MAP_X - 1, MAP_Y]) }
                                else if (this.kind_map[MAP_Y][MAP_X - 1] < 8) { DATA.removables[2] = [MAP_X - 1, MAP_Y] }
                            }
                            if (MAP_X + 1 < 10) {
                                //右
                                if (this.kind_map[MAP_Y][MAP_X + 1] == null) { DATA.movables[3] = ([MAP_X + 1, MAP_Y]) }
                                else if (this.kind_map[MAP_Y][MAP_X + 1] < 8) { DATA.removables[3] = [MAP_X + 1, MAP_Y] }
                            }
                            if (MAP_Y + 1 < 10 && MAP_X - 1 > 0) {
                                //左上
                                if (this.kind_map[MAP_Y + 1][MAP_X - 1] == null) { DATA.movables[4] = ([MAP_X - 1, MAP_Y + 1]) }
                                else if (this.kind_map[MAP_Y + 1][MAP_X - 1] < 8) { DATA.removables[4] = ([MAP_X - 1, MAP_Y + 1]) }
                            }
                            if (MAP_Y + 1 < 10 && MAP_X + 1 < 10) {
                                //右上
                                if (this.kind_map[MAP_Y + 1][MAP_X + 1] == null) { DATA.movables[5] = ([MAP_X + 1, MAP_Y + 1]) }
                                else if (this.kind_map[MAP_Y + 1][MAP_X + 1] < 8) { DATA.removables[5] = [MAP_X + 1, MAP_Y + 1] }
                            }
                            break;
                        case 12:
                            //銀将の場合
                            if (MAP_Y + 1 < 10) {
                                //上
                                if (this.kind_map[MAP_Y + 1][MAP_X] == null) { DATA.movables[0] = ([MAP_X, MAP_Y + 1]) }
                                else if (this.kind_map[MAP_Y + 1][MAP_X] < 8) { DATA.removables[0] = ([MAP_X, MAP_Y + 1]) }
                            }
                            if (MAP_Y - 1 > 0 && MAP_X - 1 > 0) {
                                //左上
                                if (this.kind_map[MAP_Y - 1][MAP_X - 1] == null) { DATA.movables[1] = ([MAP_X - 1, MAP_Y - 1]) }
                                else if (this.kind_map[MAP_Y - 1][MAP_X - 1] < 8) { DATA.removables[1] = ([MAP_X - 1, MAP_Y - 1]) }
                            }
                            if (MAP_Y + 1 < 10 && MAP_X - 1 > 0) {
                                //左下
                                if (this.kind_map[MAP_Y + 1][MAP_X - 1] == null) { DATA.movables[2] = ([MAP_X - 1, MAP_Y + 1]) }
                                else if (this.kind_map[MAP_Y + 1][MAP_X - 1] < 8) { DATA.removables[2] = [MAP_X - 1, MAP_Y + 1] }
                            }
                            if (MAP_Y - 1 > 0 && MAP_X + 1 < 10) {
                                //右上
                                if (this.kind_map[MAP_Y - 1][MAP_X + 1] == null) { DATA.movables[3] = ([MAP_X + 1, MAP_Y - 1]) }
                                else if (this.kind_map[MAP_Y - 1][MAP_X + 1] < 8) { DATA.removables[3] = [MAP_X + 1, MAP_Y - 1] }

                            }
                            if (MAP_Y - 1 > 0 && MAP_X + 1 < 10) {
                                //右下
                                if (this.kind_map[MAP_Y - 1][MAP_X + 1] == null) { DATA.movables[4] = ([MAP_X + 1, MAP_Y - 1]) }
                                else if (this.kind_map[MAP_Y - 1][MAP_X + 1] < 8) { DATA.removables[4] = [MAP_X + 1, MAP_Y - 1] }
                            }
                            break;
                        case 13:
                            //桂馬の場合
                            if (MAP_Y + 2 < 10) {
                                if (MAP_X - 1 > 0) {
                                    if (this.kind_map[MAP_Y + 2][MAP_X - 1] == null) { DATA.movables[0] = [MAP_X - 1, MAP_Y + 2] }
                                    if (this.kind_map[MAP_Y + 2][MAP_X - 1] < 8) { DATA.removables[0] = [MAP_X - 1, MAP_Y + 2] }
                                }
                                if (MAP_X + 1 < 10) {
                                    if (this.kind_map[MAP_Y + 2][MAP_X + 1] == null) { DATA.movables[1] = [MAP_X + 1, MAP_Y + 2] }
                                    if (this.kind_map[MAP_Y + 2][MAP_X + 1] < 8) { DATA.removables[1] = [MAP_X + 1, MAP_Y + 2] }
                                }
                            }
                            break;
                        case 14:
                            //香車の場合
                            let upable = MAP_Y;
                            if (DATA.player) {
                                while (upable + 1 < 10 && this.kind_map[upable + 1][MAP_X] == null) {
                                    //駒の存在しない地点をwhileループで探る
                                    upable++;
                                    DATA.movables[count] = [MAP_X, upable];
                                    count++;
                                }
                                if (this.kind_map[upable + 1][MAP_X] < 8) {
                                    //そのあとはおそらく空白でないので駒の数が7より上であれば取り除ける駒に指定
                                    DATA.removables[0] = [MAP_X, upable + 1];
                                }
                            }
                            break;
                        case 15:
                            //歩兵の場合
                            //線が引かれる座標を格納する配
                            //盤上での位置を取得
                            if (MAP_Y + 1 > 0) {
                                if (this.kind_map[MAP_Y + 1][MAP_X] == null) { DATA.movables[0] = ([MAP_X, MAP_Y + 1]) }
                                else if (this.kind_map[MAP_Y + 1][MAP_X] < 8) { DATA.removables[0] = [MAP_X, MAP_Y + 1] }
                            }
                    }
                }
                else {
                    //駒が盤上にない場合
                    //setable_judgeを一時的に移植
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
            }
        })

        let removable_exist = false, setable_exist = false //取り除ける駒、駒を置ける場所が存在するか
        this.pieces.children.forEach(piece => {
            const ID = piece.id
            const MAP_X = piece.userData.map_x
            const MAP_Y = piece.userData.map_y

            piece.userData.removables.forEach(remove => {
                actables.push([ID, MAP_X, MAP_Y, remove[0], remove[1], 2])
                removable_exist = true
            })
            piece.userData.movables.forEach((move => {
                actables.push([ID, MAP_X, MAP_Y, move[0], move[1], 1])
            }))
            piece.userData.setables.forEach(set => {
                actables.push([ID, 0, 0, set[0], set[1], 3])
            })

        })
        const action = actables[Math.floor(Math.random() * actables.length)]
        this.action(action)
    }

    action(action) {
        const ID = action[0]
        const MAP_X = action[1]
        const MAP_Y = action[2]
        const MAP_X2 = action[3]
        const MAP_Y2 = action[4]
        const TYPE = action[5]

        //console.log(TYPE)
        const PIECE = this.scene.getObjectByProperty('id', ID)
        if (TYPE == 3) {
            this.komaoki.userData.pieces[PIECE.userData.komaoki_map] = 0
            PIECE.userData.komaoki_map = 0
            PIECE.userData.setables = []

            //成っていれば駒のステータスを変更
            if (DATA.turned == true) {
                if (PIECE.name == "ginsho") {
                    DATA.kind = 12
                }
                else if (PIECE.name == "keima") {
                    DATA.kind = 13
                }
                else if (PIECE.name == "kyosha") {
                    DATA.kind = 14
                }
                else if (PIECE.name == "huhyo") {
                    DATA.kind = 15
                }
                DATA.turned = false
            }
        }
        if (TYPE == 2) {
            let obj = null
            this.pieces.children.forEach(piece => {
                if (MAP_X2 == piece.userData.map_x && MAP_Y2 == piece.userData.map_y) {
                    obj = piece
                }
            })
            if (obj.name == "gyoku") {
                alert("YOU LOSE...")
                location.reload()
            }
            let count = 0
            while (this.komaoki.userData.pieces[count] != null) {
                count++
                obj.userData.komaoki_map = count
            }
            console.log(obj)
            this.komaoki.userData.pieces.push(obj.userData.kind)
            obj.rotation.set(1.57, 1.57, 0);
            obj.userData.player = false //駒を敵の物にする
            obj.userData.kind += 8 //   敵AI向けに種類の値を更新
            const KOMAOKI_MAP = obj.userData.komaoki_map
            obj.position.set((KOMAOKI_MAP % 3) * (-12.0) - 86, 9, Math.trunc(KOMAOKI_MAP / 3) * -12.0 - 40 + obj.userData.pos_debuff)
        }

        PIECE.userData.map_x = MAP_X2
        PIECE.userData.map_y = MAP_Y2
        this.kind_map[MAP_Y][MAP_X] = null
        this.kind_map[MAP_Y2][MAP_X2] = PIECE.userData.kind
        PIECE.position.set(MAP_X2 * 14.5 - 73, 6.75, MAP_Y2 * 15.0 - 69 - PIECE.userData.pos_debuff - 1.5 * MAP_Y2);

        if (PIECE.userData.map_y >= 7 && PIECE.userData.kind != 8 && PIECE.userData.kind != 11) {
            PIECE.userData.turned = true //成る
            PIECE.rotation.set(1.57, -1.57, 0) //駒をひっくり返す
            if (PIECE.userData.kind >= 12 && PIECE.userData.kind <= 15) {
                PIECE.userData.kind = 11 //桂馬、香車、銀将、歩兵である場合駒の種類を金にする。
            }
        }
        //console.log(PIECE)
    }
}