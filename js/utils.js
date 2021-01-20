'use strict'

function buildBoard() {
    var board = [];
    var mines = getRandomMineIdx(2)
    
    for (var i = 0; i < 4; i++) {
        board[i] = []
        for (var j = 0; j < 4; j++) {
            var cell =  {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: true
            }
            board[i][j] = cell;
            if (i === mines[0].i && j === mines[0].j) {
                cell.isMine = true;
                cell.minesAroundCount = null;
            } 
            if (i === mines[1].i && j === mines[1].j) {
                cell.isMine = true;
                cell.minesAroundCount = null;
            } 
        }
    }
    console.table(board)
    return board;
}

function renderBoard() {
    var elTbody = document.querySelector('tbody');
    var strHtml = '';
    for (var i = 0; i < 4; i++) {
        strHtml += '<tr>';
        for (var j = 0; j < 4; j++) {
            var cell = gBoard[i][j];
            cell.minesAroundCount = findNeighbors(i, j);
            strHtml += `<td class="border" id="${i}-${j}" oncontextmenu="toggleFlag(this, ${i}, ${j});return false;"
            onclick="cellClicked(this, ${i}, ${j})"></td>`;
        }
        strHtml += '</tr>';
    }
    elTbody.innerHTML = strHtml;
};


function renderCell(i, j, value) {
    // Select the elCell and set the value
    var elCell = document.querySelector(`.cell${location.i}-${location.j}`);
    elCell.innerHTML = value;
}

function stopWatch() {
    var elModalTimer = document.querySelector('.modal .timer');
    gGame.secsPassed += 0.01;
    var displayTime = gGame.secsPassed.toString();
    var lastTime = parseInt(displayTime);
    elModalTimer.innerText = lastTime;
}

function getCellCoord(strCellId) {
    var parts = strCellId.split('-');
    var coord = { i: +parts[0], j: +parts[1] };
    return coord;
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

