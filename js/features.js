function getLives() {
    var elLives = document.querySelector('.lives');
    elLives.innerText = '';
    for (var i = 0; i < gLives; i++) {
        elLives.innerText += '❤';
    }
}

function getHints() {
    var elHints = document.querySelector('.hints');
    elHints.innerText = '';
    for (var i = 0; i < gHints; i++) {
        elHints.innerHTML += `<span onclick="useHint()" class="light-${i}">💡</span>`;
    }
}

function useHint() {
    if (gHintSwitch >= 1) {
        gHintIsOn = true;
        gHints--;
        getHints();
    } else {
        var elModal = document.getElementById('myModal');
        var elModalP = document.querySelector('#myModal p');
        elModal.style.display = 'block';
        elModalP.innerText = 'Must start the game first to use hints';
        window.onclick = function (event) {
            if (event.target == elModal) {
                elModal.style.display = 'none';
            }
        };
    }
}

function showHintNeighbors(elCell, cellI, cellJ) {
    var cellsToShow = [];
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i > gBoard.length - 1 || i < 0) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j > gBoard[0].length - 1 || j < 0) continue;
            var cell = gBoard[i][j];
            if (cell.isMarked) continue;
            if (cell.isShown) continue;
            // if (cell === gBoard[cellI][cellJ]) continue;
            var elCellNeigh = document.getElementById(`${i}-${j}`);
            cellsToShow.push(getCellCoord(elCellNeigh.id));
        }
    }
    if (cellsToShow.length) {
        for (var i = 0; i < cellsToShow.length; i++) {
            var neighCell = gBoard[cellsToShow[i].i][cellsToShow[i].j];
            var elNeigh = document.getElementById(
                `${cellsToShow[i].i}-${cellsToShow[i].j}`
            );
            neighCell.isShown = true;
            if (neighCell.isShown) {
                if (neighCell.isMine) {
                    elNeigh.innerHTML =
                        '<img src="stylesheets/imgs/mines.ico"></img>';
                    elNeigh.classList.add('hint-shown');
                    console.log('shown is mine');
                } else {
                    elNeigh.classList.add('hint-shown');
                    elNeigh.innerText = neighCell.minesAroundCount;
                }
            }
            if (neighCell.minesAroundCount === 0) {
                elNeigh.innerText = '';
            }
            setTimeout(function () {
                hideHints(elCell, cellsToShow);
            }, 1500);
        }
    }
}

function hideHints(elCell, cellsToShow) {
    for (var i = 0; i < cellsToShow.length; i++) {
        var neighCell = gBoard[cellsToShow[i].i][cellsToShow[i].j];
        var elNeigh = document.getElementById(
            `${cellsToShow[i].i}-${cellsToShow[i].j}`
        );
        neighCell.isShown = false;
        elNeigh.classList.remove('hint-shown');
        elNeigh.innerText = '';
        // console.log('hi from timeout.. show neighcells -', neighCell);
    }
    gHintIsOn = false;
    elCell.classList.remove('marked-hint');
}

function getSafeClicks() {
    var elHints = document.querySelector('.safe-click');
    elHints.innerText = 'Safe Click';
    elHints.innerText += `(${gSafeClicks})`;
}

function safeClick() {
    if (!gSafeClicks) return;
    if (gHintSwitch >= 1) {
        var emptyCells = findEmptyCellCount();
        var randomNum = getRandomInt(0, emptyCells.length - 1);
        var safeClickCoords = emptyCells.splice(randomNum, 1);
        var elSafeClickCell = document.getElementById(
            `${safeClickCoords[0].i}-${safeClickCoords[0].j}`
        );
        var safeClickCell = gBoard[safeClickCoords[0].i][safeClickCoords[0].j];
        if (!safeClickCell.isMine) {
            elSafeClickCell.classList.add('hint-cell');
            elSafeClickCell.innerText = safeClickCell.minesAroundCount;
        }
        setTimeout(function () {
            elSafeClickCell.classList.remove('hint-cell');
            elSafeClickCell.innerText = '';
        }, 1500);
        gSafeClicks--;
        getSafeClicks();
    } else {
        var elModal = document.getElementById('myModal');
        var elModalP = document.querySelector('#myModal p');
        elModal.style.display = 'block';
        elModalP.innerText = 'Must start the game first to use safe click';
        window.onclick = function (event) {
            if (event.target == elModal) {
                elModal.style.display = 'none';
            }
        };
    }
}

function closeModal() {
    var elModal = document.getElementById('myModal');
    elModal.style.display = 'none';
}

// ==== NEED TO REFACTURE MODEL AND DOM RENDERS TO MAKE UNDO :(

// function cloneMatrix(board){
//     var mat1 = [];
//     for(var i = 0; i<board.length; i++){
//         mat1[i] = [];
//         for(var j = 0; j<board[0].length; j++){
//             mat1[i][j] = {...board[i][j]}
//         }
//     }
//     return mat1
// }

// function undo(){
//     gBoard = cloneMatrix(gBoardBefore);
//         var elTbody = document.querySelector('tbody');
//         var strHtml = '';
//         for (var i = 0; i < gLevel.size[gMode]; i++) {
//             strHtml += '<tr>';
//             for (var j = 0; j < gLevel.size[gMode]; j++) {
//                 strHtml += `<td class="border highlight mark`
//                 if(gBoard[i][j].isMarked) strHtml += ' flag'
//                 if (gBoard[i][j].isShown) strHtml += ' marked'
//                 strHtml += `" id="${i}-${j}" oncontextmenu="toggleFlag(this, ${i}, ${j});return false;"
//             onclick="cellClicked(this, ${i}, ${j})">`
//                 if (gBoard[i][j].isShown) strHtml += gBoard[i][j].minesAroundCount
//                 else if (gBoard[i][j].isShown && gBoard[i][j].isMine) strHtml += `<img src='stylesheets/imgs/touched-mine.ico'></img>`;
//             strHtml +=  '</td>';
//             }
//             strHtml += '</tr>';
//         }
//         elTbody.innerHTML = strHtml;
// }