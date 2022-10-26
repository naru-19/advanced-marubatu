//----------- init --------------
var turn = 0;
var pickup_state = 0;
var current_size = 0;
var current_id = 0;
var current_team = 0;
var team_str = ["red", "blue"];
var size_info = [
  ["", ""],
  ["s", "S"],
  ["m", "M"],
  ["l", "L"],
];
const turn_info = document.getElementById("turn");
turn_info.style.color = "red";
var board_state = [
  [[0, 2]],
  [[0, 3]],
  [[0, 4]],
  [[0, 5]],
  [[0, 6]],
  [[0, 7]],
  [[0, 8]],
  [[0, 9]],
  [[0, 10]],
];
var fromboard = false;
//-----------------------------
const wait = (wait_sec=20) => {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, wait_sec);
  });
};
// 勝利判定
async function judge() {
  var lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (var i = 0; i < lines.length; i++) {
    if (
      board_state[lines[i][0]][board_state[lines[i][0]].length - 1][1] ==
      board_state[lines[i][1]][board_state[lines[i][1]].length - 1][1]
    ) {
      if (
        board_state[lines[i][0]][board_state[lines[i][0]].length - 1][1] ==
        board_state[lines[i][2]][board_state[lines[i][2]].length - 1][1]
      ) {
        for (var j = 0; j < 3; j++) {
          var grid = document.getElementById("button-" + String(lines[i][j]));
          var team_color = ["red", "blue"];
          grid.style.border =
            "5px solid " +
            team_color[
              board_state[lines[i][0]][board_state[lines[i][0]].length - 1][1]
            ];
        }
        var team_name = ["赤チーム", "青チーム"];
        await wait();
        alert(
          team_name[
            board_state[lines[i][0]][board_state[lines[i][0]].length - 1][1]
          ] + "の勝利です!!!"
        );
      }
    }
  }
}

// ターン終了時イベント
function turn_end() {
  document.getElementById("hold-info").innerHTML = "&nbsp;";
  turn += 1;
  turn_info.style.color = team_str[turn % 2];
  judge();
  fromboard = false;
}

// ボード上に駒を置くイベント処理
function put_item_board(x, size, team, sudo = false) {
  if (size > board_state[x][board_state[x].length - 1][0] || sudo) {
    var target_area = document.getElementById(x);
    var target_piece = document.getElementById(String(x) + "-grid");
    target_area.classList.remove(...target_area.classList);
    target_piece.classList.remove(...target_piece.classList);
    target_piece.innerHTML = size_info[size][1];
    target_piece.classList.add("piece", team_str[team % 2]);
    target_area.classList.add(size_info[size][0]);

    if (!sudo) {
      board_state[x][board_state[x].length] = [size, team];
      pickup_state += 1;
      turn_end();
    } else {
      judge();
    }
  } else {
    alert("そこには置けません!!!");
  }
}

// ベンチから駒を持ち上げるイベント
function pickup(size, idx, team) {
  if (team != turn % 2) {
    alert("あなたのターンではありません");
    return;
  }
  if (pickup_state % 2 != 0) {
    return;
  }
  // もし盤面上の全てのマスにコマがある場合sは盤面上に出せない。
  if (size == 1) {
    var flag = false;
    for (var i = 0; i < 9; i++) {
      if (board_state[i][board_state[i].length - 1][0] < 1) {
        flag = true;
      }
    }
    if (flag == false) {
      alert("そのコマは動かせません!");
      return;
    }
  }
  fromboard = false;
  // 表示処理
  document.getElementById(
    String(team) + "-" + String(size) + "-" + String(idx)
  ).disabled = true;
  document.getElementById(
    String(team) + "-" + String(size) + "-" + String(idx)
  ).style.color = "white";
  document.getElementById(
    String(team) + "-" + String(size) + "-" + String(idx)
  ).children[0].style.color = "white";
  document.getElementById(
    String(team) + "-" + String(size) + "-" + String(idx)
  ).children[0].style.border = "solid 1px white";
  current_size = size;
  current_id = idx;
  current_team = team;
  pickup_state += 1;
  document.getElementById("hold-info").innerHTML =
    size_info[size][1] + "を持っています";
  document.getElementById("hold-info").style.color = team_str[current_team % 2];
}

// 盤面上に触れるイベント処理、駒を置くor拾う
function touch_board(x) {
  console.log(pickup_state);
  if (pickup_state % 2 == 0) {
    pickup_from_board(x);
  } else {
    put_item_board(x, current_size, current_team);
  }
}

// 盤面上に駒を置くイベント処理
function pickup_from_board(x) {
  if (board_state[x].length > 1) {
    fromboard = true;
    current_team = board_state[x][board_state[x].length - 1][1];
    current_size = board_state[x][board_state[x].length - 1][0];
    if (current_team != turn % 2) {
      alert("あなたのターンではありません");
      return;
    }
    pickup_state += 1;
    document.getElementById("hold-info").innerHTML =
      size_info[current_size][1] + "を持っています";

    document.getElementById("hold-info").style.color =
      team_str[current_team % 2];
    board_state[x].pop();
    if (board_state[x].length > 1) {
      var top_size = board_state[x][board_state[x].length - 1][0];
      var top_team = board_state[x][board_state[x].length - 1][1];
      put_item_board(x, top_size, top_team, true);
    } else {
      var target_area = document.getElementById(x);
      var target_piece = document.getElementById(String(x) + "-grid");
      target_area.classList.remove(...target_area.classList);
      target_piece.classList.remove(...target_piece.classList);
      target_piece.innerHTML = "";
    }
  }
}

function reset() {
  location.reload();
}

// 持ち上げた駒のキャンセル(ベンチからの持ち上げ時のみ)
function cancel() {
  if (pickup_state % 2 != 1) return;
  if (!fromboard) {
    document.getElementById("hold-info").innerHTML = "&nbsp;";
    pickup_state -= 1;
    document.getElementById(
      String(current_team) +
        "-" +
        String(current_size) +
        "-" +
        String(current_id)
    ).disabled = false;
    document.getElementById(
      String(current_team) +
        "-" +
        String(current_size) +
        "-" +
        String(current_id)
    ).style.color = team_str[current_team];
    document.getElementById(
      String(current_team) +
        "-" +
        String(current_size) +
        "-" +
        String(current_id)
    ).children[0].style.color = team_str[current_team];
    document.getElementById(
      String(current_team) +
        "-" +
        String(current_size) +
        "-" +
        String(current_id)
    ).children[0].style.border = "solid 2px " + team_str[current_team];
  }
}
