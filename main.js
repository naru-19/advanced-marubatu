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
// document.getElementById("pieces_"+team_str[1]).style.display ="none";
// document.getElementById("pieces_"+team_str[1]+"_margin").style.display ="none";
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
var formboard = false;
//-----------------------------
const wait = () => {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, 20);
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
        var team_str = ["赤チーム", "青チーム"];
        await wait();
        alert(
          team_str[
            board_state[lines[i][0]][board_state[lines[i][0]].length - 1][1]
          ] + "の勝利です!!!"
        );
      }
    }
  }
}

function turn_end() {
  document.getElementById("hold-info").innerHTML = "&nbsp;";
  turn += 1;
  turn_info.style.color = team_str[turn % 2];
//   document.getElementById("pieces_"+team_str[turn%2]).style.display ="";
//   if(turn%2==1){
//     document.getElementById("pieces_blue_margin").style.display ="";
//   }
//   else{
//     document.getElementById("pieces_blue_margin").style.display ="none";
//   }
//   document.getElementById("pieces_"+team_str[(1+turn)%2]).style.display ="none";
  
  judge();
  formboard = false;
}

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

function pickup(size, idx, team) {
  if (team != turn % 2) {
    alert("あなたのターンではありません");
    return;
  }
  if (pickup_state % 2 != 0) {
    return;
  }
  // もし盤面上の全てのマスにコマがある場合sは移動できない．
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
  formboard = false;
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

function put_board(x) {
  console.log(pickup_state);
  if (pickup_state % 2 == 0) {
    pickup_from_board(x);
  } else {
    put_item_board(x, current_size, current_team);
  }
}

function pickup_from_board(x) {
  if (board_state[x].length > 1) {
    formboard = true;
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

function cancel() {
  if (pickup_state % 2 != 1) return;
  if (!formboard) {
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
