// [Model] "ピースの順番を管理する配列" を用意する
var ordersModel = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25];

// [Model] 空白ピース基準で、移動が許されるピースの order を格納する
var movableOrdersModel = [21, 22, 24, 25];

// 移動回数を管理する変数
var moveCount = 0;

// Model → View への反映部分を作成する (そのような処理を通称 "コンポーネント" と呼ぶ)
function component() {
  var views = document.querySelectorAll(".item");

  for (var index = 0; index < views.length; index = index + 1) {
    // Model の内容を、対応する View に反映する
    // 今回であれば、あるピースの順番を、CSS の order に反映する
    views[index].style.order = ordersModel[index];
  }
}

function shufflePieces() {
  // Model を _.shuffle でシャッフルし、シャッフル結果を再度代入する
  // 参考 → https://lodash.com/docs/4.17.15#shuffle
  ordersModel = _.shuffle(ordersModel);

  // シャッフル後にコンポーネントを更新する
  component();

  // 移動回数をリセットする
  moveCount = 0;
  updateMoveCount();

  // 所定の位置に来た時の色を更新する
  updatePieceColor();
}

// 空白ピースに対して、上下左右のピースに対応する order 番号を求める
function findAdjacentOfEmpty() {
  // 全体の order を管理する Model の、25 番目が空白ピースの order
  var emptyOrder = ordersModel[24];

  movableOrdersModel = [
    emptyOrder - 5,
    emptyOrder + 5,
  ];

  // 左端の order でないなら、-1 の order を左隣として考えることができる
  if (emptyOrder % 5 !== 1) {
    movableOrdersModel.push(emptyOrder - 1);
  }

  // 右端の order でないなら、+1 の order を右隣として考えることができる
  if (emptyOrder % 5 !== 0) {
    movableOrdersModel.push(emptyOrder + 1);
  }

  // 1 以上の order 番号を残す処理
  movableOrdersModel = movableOrdersModel.filter(x => 1 <= x);

  // 25 以下の order 番号を残す処理
  movableOrdersModel = movableOrdersModel.filter(x => x <= 25);
}

function initializeTapOperations() {
  var elements = document.querySelectorAll(".item");

  // 事前に、タップされた時に行ってほしいことを関数として用意しておく
  // 引数には Event が起こった時の詳細な情報が渡される
  function onTapped(event) {
    findAdjacentOfEmpty();

    // タップされたピースの order を取得
    const tappedOrder = Number(event.target.style.order);

    // タップされたピースの番号を取得
    const tappedPiece = Number(event.target.innerHTML) - 1;

    // タップされたピースの order が、movableOrdersModel 配列に含まれるかを調べる
    if (movableOrdersModel.includes(tappedOrder)) {
      const temp = ordersModel[24];
      ordersModel[24] = tappedOrder;
      ordersModel[tappedPiece] = temp;

      component();

      // 数字が順番に並んでいるかの判定を行う
      if (String(ordersModel) === '1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25') {
        setTimeout(() => alert('クリア！'), 0);
      }

      // 移動回数を増やす
      moveCount++;
      updateMoveCount();

      // 所定の位置に来た時の色を更新する
      updatePieceColor();
    }
  }

  // elements 変数 (配列) の中身を for 文でひとつずつ取り出す
  for (var elem of elements) {
    // Event とは "なんらかの物事"
    // 物事が起こった時だけ処理を行う仕組みが addEventListener
    // 処理の登録は、事前に作成した関数を渡すことで行う
    elem.addEventListener('click', onTapped);
  }
}

function updateMoveCount() {
  var moveCountElement = document.getElementById('move-count');
  moveCountElement.textContent = '移動回数: ' + moveCount;
}

function updatePieceColor() {
  var views = document.querySelectorAll(".item");

  for (var index = 0; index < views.length; index = index + 1) {
    if (ordersModel[index] === index + 1) {
      views[index].classList.add('correct-position');
    } else {
      views[index].classList.remove('correct-position');
    }
  }
}

function initialize() {
  initializeTapOperations();
  shufflePieces();
  updateMoveCount();

  // リセットボタンのクリックイベントを設定
  var resetButton = document.getElementById('reset-button');
  resetButton.addEventListener('click', function () {
    shufflePieces();
  });
}

window.addEventListener('load', initialize);
