export function get_ai_place_coord(self_color, table) {
	// AIが実際にどこに石を置くのかを決定する
	// 引数: self_color -> 自身の色
	// 返り値: [y,x]
	// 置ける場所がない場合: [-1,-1]
	let placeable = get_placeable_position(self_color, table);
	placeable.sort();
	if (placeable.length == 0) {
		return [-1, -1];
	} else {
		// 置けるマスの中で最も開放度の低いマスに置く
		return placeable[0][1];
	}
}

export function get_placeable_position(self_color, table) {
	// 置ける場所とその開放度を返す
	// 引数: self_color -> 自身の色
	// 返り値: [[開放度1, [y1,x1]], [開放度2, [y1,x1]], ...]

	// 置ける場所とその開放度
	let reverseable = [];
	for (let y = 0; y < 8; y++) {
		for (let x = 0; x < 8; x++) {
			let pair_openness_coord = get_reverse_scores(self_color, y, x, table);
			// そのマスに石を置いた時の開放度
			var openness = pair_openness_coord[0];

			if (openness == -1) {
				// pass;
			} else {
				reverseable.push([openness, [y, x]]);
			}
		}
	}
	return reverseable;
}

export function get_reverse_scores(self_color, sy, sx, table) {
	// そのマスに置いたときの開放度とひっくり返すマスの座標群を返す
	// 引数: self_color -> 自身の色, sy,sx -> 石を置く場所
	// 返り値: [開放度, [[y1,x1], [y2,x2], ...]
	// 置けない場合は[-1, []]を返す

	// すでにそのマスに自身もしくは相手の石が置かれている場合は返す
    /*
	if (table[sy][sx] != -1) {
		return [-1, []];
	}*/
	// 一旦実装のためtableに変更を加える
	let before_color = table[sy][sx];
	table[sy][sx] = self_color;

	// 8方向に移動
	const direction = [
		[1, 0],
		[1, 1],
		[0, 1],
		[-1, 1],
		[-1, 0],
		[-1, -1],
		[0, -1],
		[1, -1]
	];
	var total_openness = 0;
	var place_coords = []

	// 全ての方向について、条件を満たす間移動し続ける
	for (let d=0; d<direction.length; d++) {
		let dx = direction[d][0];
		let dy = direction[d][1];
		var dir_openness = 0;
		var dir_place_coords = [];
		var py = sy;
		var	px = sx;

		var is_reverseable = true;
		while (is_reverseable) {
			py += dy
			px += dx
			if ((0 <= py && py < 8) && (0 <= px && px < 8)) {
				// pass;
			} else {
				is_reverseable = false;
				break;
			}

			// 進行先が相手の石であれば、その座標をリストに加える
			if ((table[py][px] != self_color) && (table[py][px] != -1)) {
				dir_place_coords.push([py, px]);
				// そのマス周辺の開放度を計算する
				// →互いに独立なので空きマスであればそのまま開放度をインクリメントする
				for (let i = -1; i < 2; i++) {
					for (let j = -1; j < 2; j++) {
						var ay = py + i;
						var ax = px + j;
						if ((0 <= ay && ay < 8) && (0 <= ax && ax < 8)) {
							if (table[ay][ax] == -1) {
								dir_openness += 1;
							}
						}
					}
				}
			} else if ((table[py][px] == self_color) && (dir_place_coords.length >= 1)) {
				// 進行先が自分の石かつ相手の石が1つ以上挟まっていればbreakする
				break;
			} else {
				is_reverseable = false;
				break;
			}
		}

		// その方向にひっくり返せるのであれば、その方向の開放度と座標を全体に加える
		if (is_reverseable) {
			total_openness += dir_openness;
			place_coords = place_coords.concat(dir_place_coords);
		}
	}
	// tableに一時的に加えた変更を元に戻す
	table[sy][sx] = before_color;

	// 返せる石が1つ以上あるならそれを返す
	if (place_coords.length >= 1) {
		return [total_openness, place_coords];
	} else {
		return [-1, []];
	}
}

export function get_table(stones){
    // stones から tableを作成する
    var table = new Array(8);
    for(let i=0; i<8; i++){
        table[i] = new Array(8);
        for(let j=0; j<8; j++){
            table[i][j] = stones[i][j].status;
        }
    }
    return table;
}