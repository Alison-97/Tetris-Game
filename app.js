// Append 200 squares, 10 base, 20 first line
let grid = document.getElementsByClassName("grid")[0]

for (let i=0; i<200; i++){
    grid.appendChild(document.createElement("div"));
}

for (let i = 0; i < 10; i++){
    let baseSquare = document.createElement("div");
    baseSquare.classList.add('base');
    grid.appendChild(baseSquare);
}

for (let i = 0; i < 20; i++){
    let firstLine = document.createElement("div");
    firstLine.classList.add('hide');
    grid.insertBefore(firstLine, grid.children[0]);
}


//declare variables needed
let squares = Array.from(document.querySelectorAll(".grid div"));
let colorClassMini = ['redMini', 'orangeMini', 'yellowMini', 'greenMini', 'blueMini', 'violetMini', 'purpleMini']
let colorClassTet = ['redTet', 'orangeTet', 'yellowTet', 'greenTet', 'blueTet', 'violetTet', 'purpleTet']
let colorClassFixed = ['redFixed', 'orangeFixed', 'yellowFixed', 'greenFixed', 'blueFixed', 'violetFixed', 'purpleFixed']
let colorClassShadow = ['redShadow', 'orangeShadow', 'yellowShadow', 'greenShadow', 'blueShadow', 'violetShadow', 'purpleShadow']
let timerId
let score = document.getElementById('player_score')
let level = document.getElementById('player_level')
let totalScore = 0
let currentSpeed = 1000
let gameOverMode = false

let gridArr = []
for(let i= 0; i < 230; i++){
    gridArr.push(i)
}

let miniGridArr = []
for (i=0;i<25;i++){
    miniGridArr.push(i)
}

// FOR PAUSE SCREEN, RESUME SCREEN & GAME OVER SCREEN, INSTRUCTION SCREEN
let container = document.getElementsByClassName('container')[0]
let body = document.getElementsByTagName('body')[0]
let mini_grid = document.getElementById("mini-grid")
let hold_grid = document.getElementById("hold-grid")
let resume_btn = document.getElementById('resume')
let start_btn = document.getElementById('start')
let restart_btn = document.getElementById('restart')
let howToPlay_btn = document.getElementById('howToPlay')
let popUp = document.getElementById('level-up-pop-up')

// Tet & miniTet setting
let randomTet // = Math.floor(Math.random() * 7);
let randomDisplay //= Math.floor(Math.random() * 7);
let current //= theTetrominoes[randomTet][currentRotation];
let nextTetDisplay //= smallTetromino[randomDisplay][0]





// At start screen
gridArr.forEach(index => squares[index].style.backgroundColor = 'var(--dark-grid)')
let write = word => document.getElementsByClassName('word')[0].innerHTML = word;
write('TETRIS')

// START, PAUSE, RESTART BUTTON
let idleMode = true
let playMode = false
let instructionMode = false

function start(){
    if(idleMode && !instructionMode){
        playMode = true
        idleMode = false
        write('')
        start_btn.style.visibility = "hidden"
        restart_btn.style.visibility = "hidden"
        howToPlay_btn.style.visibility = "hidden"
        container.style.backgroundColor = 'var(--normal-container)'
        body.style.color = 'var(--normal-font)'
        mini_grid.style.backgroundColor = 'var(--normal-grid)'
        hold_grid.style.backgroundColor = 'var(--normal-grid)'
        miniGridArr.forEach(index => mini_squares[index].style.backgroundColor = '')
        miniGridArr.forEach(index => hold_squares[index].classList.remove(...colorClassMini))
        miniGridArr.forEach(index => hold_squares[index].classList.remove('pauseColorMini'))
        miniGridArr.forEach(index => hold_squares[index].style.backgroundColor = '')
        gridArr.forEach(index => squares[index].style.backgroundColor = '')
        randomTet = Math.floor(Math.random() * 7);
        randomDisplay = Math.floor(Math.random() * 7);
        current = theTetrominoes[randomTet][currentRotation];
        nextTetDisplay = smallTetromino[randomDisplay][0]
        draw()
        setSpeed(currentSpeed)
    }
}

function setSpeed(speed){
    clearInterval(timerId)
    timerId = setInterval(moveDown,(speed))
}

function pauseAndPlay(){
    if(!gameOverMode && !idleMode){
        if(playMode){
            clearInterval(timerId)
            pauseScreen()
            playMode = false
        } else if (!playMode){
            resumeScreen()
            setSpeed(currentSpeed)
            closeInstruction()      //if it is opened
            playMode = true
        }
    }
}

for (let i=0; i<25; i++){
    mini_grid.appendChild(document.createElement("div"));
    hold_grid.appendChild(document.createElement("div"));
}
let mini_squares = Array.from(document.querySelectorAll("#mini-grid div"));
let hold_squares = Array.from(document.querySelectorAll("#hold-grid div"));

function restart(){
    if(!playMode && !instructionMode){
        idleMode = true
        currentLevel = 1
        level.innerHTML = currentLevel
        totalScore = 0
        score.innerHTML = totalScore
        currentSpeed = 1000
        currentPosition = 24
        gridArr.forEach(index => squares[index].classList.remove('fixed', 'pauseColor', 'pauseColorFixed'))
        gridArr.forEach(index => squares[index].classList.remove(...colorClassFixed,...colorClassShadow,...colorClassTet))
        miniGridArr.forEach(index => mini_squares[index].classList.remove(...colorClassMini, 'pauseColorMini'))
        start()
        write('')
        playMode = true
        gameOverMode = false
        resume_btn.style.visibility = "hidden"
    }
}







// PAUSE, GAME OVER, RESUME, HOW-TO-PLAY SCREEN
function pauseScreen(){
    gridArr.forEach(index => squares[index].classList.add('pauseColor'))
    let pauseFixed = gridArr.filter(index => squares[index].classList.contains('fixed'))
    pauseFixed.forEach(index => squares[index].classList.add('pauseColorFixed'))
    container.style.backgroundColor = 'var(--dark-container)'
    body.style.color = 'var(--dark-font)'
    mini_grid.style.backgroundColor = 'var(--dark-grid)'
    hold_grid.style.backgroundColor = 'var(--dark-grid)'
    function changeColorMini(color){
        let containMini = miniGridArr.filter(index => mini_squares[index].classList.contains(color))
        containMini.forEach(index => mini_squares[index].classList.add('pauseColorMini'))
    }
    function changeColorHold(color){
        let containHold = miniGridArr.filter(index => hold_squares[index].classList.contains(color))
        containHold.forEach(index => hold_squares[index].classList.add('pauseColorMini'))
    }
    colorClassMini.forEach(changeColorMini)
    colorClassMini.forEach(changeColorHold)
    write('PAUSE')
    resume_btn.style.visibility = "visible"
    restart_btn.style.visibility = "visible"
    howToPlay_btn.style.visibility = "visible"
    restart_btn.style.top = "63%"
    howToPlay_btn.style.top = "73%"
}

function gameOverScreen(){
    container.style.backgroundColor = 'var(--gameover-container)';
    body.style.color = 'var(--gameover-font)';
    mini_grid.style.backgroundColor = 'var(--gameover-grid)'
    hold_grid.style.backgroundColor = 'var(--gameover-grid)'
    gridArr.forEach(index => squares[index].style.backgroundColor = 'var(--gameover-grid)')
    let gameoverFixed = gridArr.filter(index => squares[index].classList.contains('fixed'))
    gameoverFixed.forEach(index => squares[index].style.backgroundColor = 'var(--gameover-fixed-color)')
    function changeColorMini(color){
        let containMini = miniGridArr.filter(index => mini_squares[index].classList.contains(color))
        containMini.forEach(index => mini_squares[index].style.backgroundColor = 'var(--gameover-fixed-color)')
    }
    function changeColorHold(color){
        let containHold = miniGridArr.filter(index => hold_squares[index].classList.contains(color))
        containHold.forEach(index => hold_squares[index].style.backgroundColor = 'var(--gameover-fixed-color)')
    }
    colorClassMini.forEach(changeColorMini)
    colorClassMini.forEach(changeColorHold)
    write('GAME OVER')
    restart_btn.style.visibility = "visible"
    restart_btn.style.top = "55%"
}

function resumeScreen(){
    gridArr.forEach(index => squares[index].classList.remove('pauseColor','pauseColorFixed'))
    container.style.backgroundColor = 'var(--normal-container)'
    body.style.color = 'var(--normal-font)'
    mini_grid.style.backgroundColor = 'var(--normal-grid)'
    hold_grid.style.backgroundColor = 'var(--normal-grid)'
    miniGridArr.forEach(index => mini_squares[index].classList.remove('pauseColorMini'))
    miniGridArr.forEach(index => hold_squares[index].classList.remove('pauseColorMini'))
    write('')
    resume_btn.style.visibility = "hidden"
    restart_btn.style.visibility = "hidden"
    howToPlay_btn.style.visibility = "hidden"
}

function howToPlayScreen(){
    document.getElementById('instructions').style.visibility = 'visible';
    instructionMode = true
    playMode = false
}

function closeInstruction(){
    document.getElementById('instructions').style.visibility = 'hidden'
    instructionMode = false
    playMode = true
}









// Create the seven tetrominoes (I, O, T, S, Z, J, and L)
let iTet = [[0, 1, 2, 3], [-18, -8, 2, 12], [0, 1, 2, 3], [-18, -8, 2, 12]]
let oTet = [[0, 1, 10, 11], [0, 1, 10, 11], [0, 1, 10, 11], [0, 1, 10, 11]]
let tTet = [[0, 1, 2, 11], [-9, 0, 1, 11], [-9, 0, 1, 2], [-9, 1, 2, 11]]
let sTet = [[1, 2, 10, 11], [-10, 0, 1, 11], [1, 2, 10, 11], [-10, 0, 1, 11]]
let zTet = [[0, 1, 11, 12], [-8, 1, 2, 11], [0, 1, 11, 12], [-8, 1, 2, 11]]
let jTet = [[0, 1, 2, 12], [-9, 1, 10, 11], [0, 10, 11, 12], [-9, -8, 1, 11]]
let lTet = [[0, 1, 2, 10], [-10, -9, 1, 11], [2, 10, 11, 12], [-9, 1, 11, 12]]
let theTetrominoes = [iTet, oTet, tTet, sTet, zTet, jTet, lTet];

// for the tet on small grid
let smallTetromino = [
    [[11, 12, 13, 14], [2, 7, 12, 17], [11, 12, 13, 14], [2, 7, 12, 17]],
    [[6, 7, 11, 12], [6, 7, 11, 12], [6, 7, 11, 12], [6, 7, 11, 12]],
    [[11, 12, 13, 17], [7,11,12,17], [7, 11, 12, 13], [7, 12, 13, 17]],
    [[12, 13, 16, 17], [6, 11, 12, 17], [12, 13, 16, 17], [6, 11, 12, 17]],
    [[11, 12, 17, 18], [8, 12, 13, 17], [11, 12, 17, 18], [8, 12, 13, 17]],
    [[11, 12, 13, 18], [7, 12, 16, 17], [11, 16, 17, 18], [7, 8, 12, 17]],
    [[11, 12, 13, 16], [6, 7, 12, 17], [13, 16, 17, 18], [7, 12, 17, 18]]
]

let currentPosition = 24;
let currentRotation = 0;



//assign functions to keyCodes
function control(e) {
    if (e.keyCode === 37) {moveLeft()} 
    if (e.keyCode === 38) {rotate()} 
    if (e.keyCode === 39) {moveRight()} 
    if (e.keyCode === 40 && playMode) {moveDown()}
    if (e.keyCode === 27) {pauseAndPlay()} 
    if (e.keyCode === 32) {hardDrop()} 
    if (e.keyCode === 16 && playMode) {
        if(!holding){
            hold()
        } else switchTet()
    } 
    if (e.keyCode === 13){
        if(idleMode){
            start()
        } else restart()
    }

}
document.addEventListener('keydown', control)



// draw tet & its shadow
function draw(){
    display()
    current.forEach(index => squares[currentPosition + index].classList.add(colorClassTet[randomTet]))
    shadow(colorClassShadow[randomTet])

    function shadow(shadowColor){
        let i = 0;
        let shadowLandBase, shadowLandFixed
        while(!shadowLandBase && !shadowLandFixed){
            let shadow = current.map(index => currentPosition + index + i)
            shadowLandBase = shadow.some(index => squares[index + 10].classList.contains('base'))
            shadowLandFixed = shadow.some(index => squares[index + 10].classList.contains('fixed'))
            if(shadowLandBase||shadowLandFixed){
                shadow.forEach(index => squares[index].classList.add(shadowColor))
            }
            i+=10
        } 
    }
}

// display next Tet (mini)
function display(){
    miniGridArr.forEach(index => mini_squares[index].classList.remove(...colorClassMini))
    function miniDisplayColor(color){
        smallTetromino[randomDisplay][0].forEach(index => mini_squares[index].classList.add(color))
    }
    miniDisplayColor(colorClassMini[randomDisplay])
}


function undraw(){
    current.forEach(index => {squares[currentPosition + index].classList.remove(...colorClassTet)})
    gridArr.forEach(index => squares[index].classList.remove(...colorClassShadow))
}

function moveDown() {
    called = false
    freeze()
    if(!idleMode && !called){ 
        undraw()
        currentPosition += 10
        draw()
    }
}


/* hardDrop: making shadow into fixed
   softdrop: making tet into fixed */

let drop    //bcm true if hardDrop is called
let called  //dont execute the rest of moveDown if nextRandom is called
function freeze(){
    let landBase = current.some(index => squares[currentPosition + index + 10].classList.contains('base'))
    let landFixed = current.some(index => squares[currentPosition + index + 10].classList.contains('fixed'))
    if ((landBase || landFixed) && !drop) {
        //remove moving tet, make it a fixed one, add color class
        current.forEach(index => squares[currentPosition + index].classList.remove(...colorClassTet))
        current.forEach(index => squares[currentPosition + index].classList.add('fixed'))
        current.forEach(index => squares[currentPosition + index].classList.add(colorClassFixed[randomTet]))
    }
    
    if (landBase || landFixed || drop){
        deductLine()
        callNextRandom()
        currentRotation = 0
        draw()
        called = true
    }

    let thirdLine = [20,21,22,23,24,25,26,27,28,29]
    let gameOver = thirdLine.some(index => squares[index].classList.contains('fixed'))
    if (gameOver){
        gameOverMode = true
        clearInterval(timerId)
        playMode = false
        gameOverScreen()
    }
}


//keep changing falling tet
function callNextRandom(){
    randomTet = randomDisplay
    current = theTetrominoes[randomTet][0];
    currentPosition = 24
    randomDisplay = Math.floor(Math.random() * 7)
}

function moveLeft(){
    if(playMode && !idleMode){
        undraw()
        currentPosition--
        let touchLeftEdge = current.some(index => (currentPosition + index + 1) % 10 == 0)
        if (touchLeftEdge){currentPosition++}
        let touchLeftFixed = current.some(index => squares[currentPosition + index].classList.contains('fixed'))
        if (touchLeftFixed){currentPosition++}
        draw()
    }
}

function moveRight(){
    if(playMode && !idleMode){
        undraw()
        currentPosition++
        let touchRightEdge = current.some(index => (currentPosition + index - 1) % 10 == 9)
        if (touchRightEdge){currentPosition--}
        let touchRightFixed = current.some(index => squares[currentPosition + index].classList.contains('fixed'))
        if (touchRightFixed){currentPosition--}
        draw()
    }
}


function rotate(){
    if(playMode && !idleMode){
        undraw()
        currentRotation++
        if(currentRotation == 4){
            currentRotation = 0;
        }
    
        // check rotated position for iTet only
        if(randomTet == 0){
            iTet_pushFromEdge()
            iTet_pushFromFixed()
            iTet_pushFromBaseAndFixedBottom()
            iTet_finalCheck()
        } else {
    
        // check rotated position for others
            horizontalStuck()
            pushFromEdge()
            pushFromFixed()
            pushFromBaseAndFixedBottom()
            finalCheck()
        }
        current = theTetrominoes[randomTet][currentRotation]; 
        draw()
    }
}

function horizontalStuck(){
    let toBeDrawn = theTetrominoes[randomTet][currentRotation].map(index => currentPosition + index)
    let nextContainFixed = toBeDrawn.some(index => squares[index].classList.contains('fixed'))
    let nextOutsideRightEdge = toBeDrawn.some(index => (index) % 10 == 0)
    let nextOutsideLeftEdge = toBeDrawn.some(index => (index) % 10 == 9)

    // two fixed blocks
    let stuckByRight = current.some(index => squares[currentPosition + index + 1].classList.contains('fixed'))
    let stuckByLeft = current.some(index => squares[currentPosition + index - 1].classList.contains('fixed'))
    if(stuckByRight && stuckByLeft && nextContainFixed){
        if(currentRotation == 0){   // avoid it from becoming -1
            currentRotation = 3
            return true     // true means the rotation has ald been revert
        } else {
            currentRotation--
            return true
        }
    }
    
    // edge & block left
    let touchLeftEdge = current.some(index => (currentPosition + index) % 10 == 0)
    let stuckByRightAndEdge = current.some(index => squares[currentPosition + index + 1].classList.contains('fixed'))
    if((touchLeftEdge && stuckByRightAndEdge && nextContainFixed) || (touchLeftEdge && stuckByRightAndEdge && nextOutsideLeftEdge)){
        if(currentRotation == 0){
            currentRotation = 3
            return true
        } else {
            currentRotation--
            return true
        }
    }

    //edge & block right
    let touchRightEdge = current.some(index => (currentPosition + index) % 10 == 9)
    let stuckByLeftAndEdge = current.some(index => squares[currentPosition + index - 1].classList.contains('fixed'))
    if((touchRightEdge && stuckByLeftAndEdge && nextContainFixed) || (touchRightEdge && stuckByLeftAndEdge && nextOutsideRightEdge)){
        if(currentRotation == 0){
            currentRotation = 3
            return true
        } else {
            currentRotation--
            return true
        }
    }
    else return false
}


function pushFromEdge(){
    // if horizontalStuck valid, rotation is reverted, otherwise it is as stated in rotate()
    let toBeDrawn = theTetrominoes[randomTet][currentRotation].map(index => currentPosition + index)

    // push from right
    let touchRightEdge = current.some(index => (currentPosition + index) % 10 == 9)
    let pushAwayFromRight = toBeDrawn.some(index => index % 10 == 0)
    let noSpaceForRightPush = toBeDrawn.some(index => squares[index - 1].classList.contains('fixed'))

    if(touchRightEdge && pushAwayFromRight && !noSpaceForRightPush){
        currentPosition--
        return true
    }

    // push from left
    let pushAwayFromLeft = toBeDrawn.some(index => index % 10 == 9)
    let touchLeftEdge = current.some(index => (currentPosition + index) % 10 == 0)
    let noSpaceForLeftPush = toBeDrawn.some(index => squares[index + 1].classList.contains('fixed'))
    
    if(pushAwayFromLeft && touchLeftEdge && !noSpaceForLeftPush){
        currentPosition++
        return true
    }
    else return false
}

function pushFromFixed(){
    let toBeDrawn = theTetrominoes[randomTet][currentRotation].map(index => currentPosition + index)
    let needPush = toBeDrawn.some(index => squares[index].classList.contains('fixed'))
    let noSpaceForLeftPush = toBeDrawn.some(index => squares[index + 1].classList.contains('fixed'))
    let noSpaceForRightPush = toBeDrawn.some(index => squares[index - 1].classList.contains('fixed'))
    let tetAndRotToBePushFromRight = (
        (randomTet == 2 && currentRotation == 2) ||
        (randomTet == 3 && currentRotation == 0) ||
        (randomTet == 3 && currentRotation == 2) ||
        (randomTet == 5 && currentRotation == 2) ||
        (randomTet == 6 && currentRotation == 2)
    )
    if(tetAndRotToBePushFromRight && needPush && !noSpaceForRightPush){
        currentPosition--
        return true
    }
    let tetAndRotToBePushFromLeft = (
        (randomTet == 2 && currentRotation == 0) ||
        (randomTet == 4 && currentRotation == 0) ||
        (randomTet == 4 && currentRotation == 2) ||
        (randomTet == 5 && currentRotation == 0) ||
        (randomTet == 6 && currentRotation == 0)
    )
    if(tetAndRotToBePushFromLeft && needPush && !noSpaceForLeftPush){
        currentPosition++
        return true
    }
    else return false
}

function pushFromBaseAndFixedBottom() {
    // only t-tet applies
    let toBeDrawn = theTetrominoes[randomTet][currentRotation].map(index => currentPosition + index)
    let pushFromBase = toBeDrawn.some(index => squares[index].classList.contains('base'))
    let pushFromFixed = toBeDrawn.some(index => squares[index].classList.contains('fixed'))
    let noSpaceToPushUp = toBeDrawn.some(index => squares[index-10].classList.contains('fixed'))
    if ((randomTet == 2 && currentRotation == 3) && (pushFromBase || pushFromFixed) && !noSpaceToPushUp) {
        currentPosition -= 10
        return true
    }
    else return false
}

function finalCheck(){
    let toBeDrawn = theTetrominoes[randomTet][currentRotation].map(index => currentPosition + index)
    let noSpaceCzFixed = toBeDrawn.some(index => squares[index].classList.contains('fixed'))

    let touchRightEdge = current.some(index => (currentPosition + index) % 10 == 9)
    let pushAwayFromRight = toBeDrawn.some(index => index % 10 == 0)
    let noSpaceCzEdgeRight = touchRightEdge && pushAwayFromRight

    let touchLeftEdge = current.some(index => (currentPosition + index) % 10 == 0)
    let pushAwayFromLeft = toBeDrawn.some(index => index % 10 == 9)
    let noSpaceCzEdgeLeft = touchLeftEdge && pushAwayFromLeft

    if ((noSpaceCzFixed || noSpaceCzEdgeLeft || noSpaceCzEdgeRight) && horizontalStuck()==false && pushFromEdge()==false && pushFromFixed()==false && pushFromBaseAndFixedBottom()==false){
        if(currentRotation == 0){
            currentRotation = 3
        } else currentRotation--
    } 
}


function iTet_pushFromEdge(){
    let toBeDrawn = theTetrominoes[randomTet][currentRotation].map(index => currentPosition + index)
    if (currentRotation == 0 || currentRotation == 2){

        // push from edge with edge touched (for left & right)
        let touchLeftEdge = current.every(index => (currentPosition + index) % 10 == 0)
        let noSpaceForLeftPush = toBeDrawn.some(index => squares[index + 2].classList.contains('fixed'))
        if(touchLeftEdge && !noSpaceForLeftPush){
            currentPosition += 2
            return true
        }
        let touchRightEdge = current.every(index => (currentPosition + index) % 10 == 9)
        let noSpaceForRightPush = toBeDrawn.some(index => squares[index - 1].classList.contains('fixed'))
        if(touchRightEdge && !noSpaceForRightPush){
            currentPosition --
            return true
        }

        // push from edge without edge touched (left only)
        let inSecondColumn = current.every(index => (currentPosition + index) % 10 == 1)
        let noSpaceForLeftPush_LeftOnly = toBeDrawn.some(index => squares[index + 1].classList.contains('fixed'))
        if (inSecondColumn && !noSpaceForLeftPush_LeftOnly){
            currentPosition++
            return true
        } else return false
    } else return false
}


function iTet_pushFromFixed(){
    if ((currentRotation == 0 || currentRotation == 2) && iTet_pushFromEdge()==false){
        let toBeDrawn = theTetrominoes[randomTet][currentRotation].map(index => currentPosition + index)
        let needPush = toBeDrawn.some(index => squares[index].classList.contains('fixed'))

        // push from fixed without fixed touched (left only)
        let fixedInLeftLeft = current.some(index => squares[currentPosition + index - 2].classList.contains('fixed'))
        let noSpaceForLeftPush_LeftOnly = toBeDrawn.some(index => squares[index + 1].classList.contains('fixed'))
        let crossRightEdge_LeftOnly = toBeDrawn.some(index => (index + 1) % 10 == 0)
        if(fixedInLeftLeft && needPush && !noSpaceForLeftPush_LeftOnly && !crossRightEdge_LeftOnly){
            currentPosition++
        }
        
        // push from fixed with fixed touched (for left & right)
        let touchLeftFixed = current.some(index => squares[currentPosition + index - 1].classList.contains('fixed'))
        let noSpaceForLeftPush = toBeDrawn.some(index => squares[index + 2].classList.contains('fixed'))
        let crossRightEdge = toBeDrawn.some(index => (index + 2) % 10 == 0)
        if(touchLeftFixed && needPush && !noSpaceForLeftPush && !crossRightEdge){
            currentPosition += 2
        }
        let touchRightFixed = current.some(index => squares[currentPosition + index + 1].classList.contains('fixed'))
        let noSpaceForRightPush = toBeDrawn.some(index => squares[index - 1].classList.contains('fixed'))
        let crossLeftEdge = toBeDrawn.some(index => (index - 1) % 10 == 9)
        if(touchRightFixed && needPush && !noSpaceForRightPush && !crossLeftEdge){
            currentPosition --
        } else return false
    } else return false
}

function iTet_pushFromBaseAndFixedBottom() {
    let toBeDrawn = theTetrominoes[randomTet][currentRotation].map(index => currentPosition + index)
    let pushFromBase = toBeDrawn.some(index => squares[index].classList.contains('base'))
    let pushFromFixed = current.some(index => squares[currentPosition + index + 10].classList.contains('fixed'))
    let needPush = toBeDrawn.some(index => squares[index].classList.contains('fixed'))
    if((currentRotation == 1 || currentRotation == 3) && (pushFromBase || pushFromFixed && needPush)){
        let noSpaceToPushUp = toBeDrawn.some(index => squares[index-10].classList.contains('fixed'))
        if (!noSpaceToPushUp) {
            currentPosition -= 10
            return true
        } 
    } else return false
}

function iTet_finalCheck(){
    let toBeDrawn = theTetrominoes[randomTet][currentRotation].map(index => currentPosition + index)
    let noSpaceCzFixed = toBeDrawn.some(index => squares[index].classList.contains('fixed'))
    let noSpaceCzEdge = toBeDrawn.some(index => index % 10 == 9) && toBeDrawn.some(index => index % 10 == 0)

    if ((noSpaceCzFixed || noSpaceCzEdge) && iTet_pushFromEdge()==false && iTet_pushFromFixed()==false && iTet_pushFromBaseAndFixedBottom()==false){
        if(currentRotation == 0){
            currentRotation = 3
        } else currentRotation--
    }
}


let holding = false
let onHold = []
function hold(){
    smallTetromino[randomTet][currentRotation].forEach(index => hold_squares[index].classList.add(colorClassMini[randomTet]))
    onHold = [randomTet, currentRotation]
    undraw()
    callNextRandom()
    //currentRotation = 0
    draw()
    called = true
    holding = true
}


function switchTet(){
    let toBeSwitch = theTetrominoes[onHold[0]][onHold[1]].map(index => index + currentPosition)
    let containFixed = toBeSwitch.some(index => squares[index].classList.contains('fixed'))
    let crossEdge = toBeSwitch.some(index => index % 10 == 9) && toBeSwitch.some(index => index % 10 == 0)
    let containBase = toBeSwitch.some(index => squares[index].classList.contains('base'))
    let collide = containFixed || crossEdge || containBase
    let isITetVerOnHold = onHold[0]==0 && onHold[1]==1
    let isITetVerCurrent = current.every(index => [-18, -8, 2, 12].includes(index))
    let touchRightEdge = current.some(index => (currentPosition + index) % 10 == 9)
    let touchLeftEdge = current.some(index => (currentPosition + index) % 10 == 0)

    let specialCon = isITetVerOnHold && touchRightEdge && toBeSwitch.every(index => index % 10 == 0)
    let specialCon2 = isITetVerCurrent && touchLeftEdge && toBeSwitch.some(index => index % 10 == 9 && !crossEdge)
    if(specialCon){
        undraw()
        currentPosition--
        canSwitch()
    } else if (specialCon2){
        undraw()
        currentPosition+=2
        canSwitch()
    } else if (!collide){
        undraw()
        canSwitch()
    } else if(!current.every(index => [-18, -8, 2, 12].includes(index))){
        checkNoCollision()
    } else checkITetVer()
}

function checkNoCollision(){
    let toBeSwitch = theTetrominoes[onHold[0]][onHold[1]].map(index => index + currentPosition)
    let containBase = toBeSwitch.some(index => squares[index].classList.contains('base'))
    let rightGotSpace = !toBeSwitch.every(index => squares[index + 1].classList.contains('fixed'))
    let leftGotSpace = !toBeSwitch.every(index => squares[index - 1].classList.contains('fixed'))
    let leftGotTwoSpace = !toBeSwitch.every(index => squares[index - 2].classList.contains('fixed'))
    //to make sure they're not on the other end
    let touchLeftEdge = current.some(index => (currentPosition + index) % 10 == 0)
    let leftGotFixed = current.some(index => squares[index + currentPosition - 1].classList.contains('fixed'))
    let rightGotFixed = current.some(index => squares[index + currentPosition + 1].classList.contains('fixed'))
    let touchRightEdge = current.some(index => (currentPosition + index) % 10 == 9)
    let nextCrossLeft = toBeSwitch.some(index => (index + 1) % 10 == 9) && toBeSwitch.some(index => (index + 1) % 10 == 0)
    let nextCrossRight = toBeSwitch.some(index => (index - 1) % 10 == 0) && toBeSwitch.some(index => (index -1) % 10 == 9)
    let nextCrossTwoRight = toBeSwitch.some(index => (index - 2) % 10 == 0) && toBeSwitch.some(index => (index - 2) % 10 == 9)
    let newContainFixed = toBeSwitch.some(index => squares[index + 1].classList.contains('fixed'))
    let newContainFixed2 = toBeSwitch.some(index => squares[index - 1].classList.contains('fixed'))
    let newContainFixed3 = toBeSwitch.some(index => squares[index - 2].classList.contains('fixed'))
    //if onhold is iTet hori
    let isITetHori = onHold[0]==0 && (onHold[1]==0 || onHold[1]==2)
    //let isITetVerOnHold = onHold[0]==0 && (onHold[1]==1 || onHold[1]==3)

    if(rightGotSpace && !nextCrossLeft && !newContainFixed && !containBase && (touchLeftEdge || leftGotFixed)){
        undraw()
        currentPosition++
        canSwitch()
    } else if(leftGotSpace && !nextCrossRight && !newContainFixed2 && !containBase && (touchRightEdge||rightGotFixed)){
        undraw()
        currentPosition--
        canSwitch()
    } else if(leftGotTwoSpace && !nextCrossTwoRight && !newContainFixed3 && !containBase && (touchRightEdge||rightGotFixed)){
        undraw()
        currentPosition-=2
        canSwitch()
    } else if(isITetHori && !newContainFixed2 && !nextCrossRight && !containBase){
        undraw()
        currentPosition--
        canSwitch()
    }
    //unsolved: still cannot pushFromBase & bottomFixed
}


function checkITetVer(){
    let toBeSwitch = theTetrominoes[onHold[0]][onHold[1]].map(index => index + currentPosition)
    let inFirstColumn = current.every(index => (index + currentPosition) % 10 == 0)
    //let crossEdge = toBeSwitch.some(index => index % 10 == 9) && toBeSwitch.some(index => index % 10 == 0)
    let nextCrossLeft = toBeSwitch.some(index => (index + 1) % 10 == 9) && toBeSwitch.some(index => (index + 1) % 10 == 0)
    let newContainFixed = toBeSwitch.some(index => squares[index + 1].classList.contains('fixed'))

    let nextCrossTwoLeft = toBeSwitch.some(index => (index + 2) % 10 == 0) && toBeSwitch.some(index => (index + 2) % 10 == 9)
    let newContainFixed4 = toBeSwitch.some(index => squares[index + 2].classList.contains('fixed'))

    let rightGotSpace = !toBeSwitch.every(index => squares[index + 1].classList.contains('fixed'))
    let leftGotFixed = current.some(index => squares[index + currentPosition - 1].classList.contains('fixed'))

    let inSecondColumn = current.every(index => (index + currentPosition) % 10 == 1)
    let leftLeftGotFixed = current.some(index => squares[index + currentPosition - 2].classList.contains('fixed'))

    let inLastColumn = current.every(index => (index + currentPosition) % 10 == 9)
    let newContainFixed2 = toBeSwitch.some(index => squares[index - 1].classList.contains('fixed'))


    let rightGotFixed = current.some(index => squares[index + currentPosition + 1].classList.contains('fixed'))
    if(inFirstColumn && !nextCrossLeft && !newContainFixed){
        undraw()
        currentPosition++
        canSwitch()
    } else if(inFirstColumn && !nextCrossTwoLeft && !newContainFixed4){ //for iTetHori
        undraw()
        currentPosition+=2
        canSwitch()
    } else if(leftGotFixed && rightGotSpace && !newContainFixed && !nextCrossLeft){
        undraw()
        currentPosition++
        canSwitch()
    } else if(leftGotFixed && !newContainFixed4 && !nextCrossTwoLeft){
        undraw()
        currentPosition+=2
        canSwitch()
    } else if(inSecondColumn && rightGotSpace  && !newContainFixed){
        undraw()
        currentPosition++
        canSwitch()
    } else if (leftLeftGotFixed && rightGotSpace && !nextCrossLeft && !newContainFixed){
        undraw()
        currentPosition++
        canSwitch()
    } else if ((inLastColumn||rightGotFixed) && !newContainFixed2){
        undraw()
        currentPosition--
        canSwitch()
    } 
}


function canSwitch(){
    miniGridArr.forEach(index => hold_squares[index].classList.remove(...colorClassMini))
    smallTetromino[randomTet][currentRotation].forEach(index => hold_squares[index].classList.add(colorClassMini[randomTet]))

    let newHold = [randomTet, currentRotation]
    //undraw()
    randomTet = onHold[0]
    currentRotation = onHold[1]
    current = theTetrominoes[randomTet][currentRotation]

    onHold = newHold
    draw()
}

/*
function checkSwitch(){
    let toBeSwitch = theTetrominoes[onHold[0]][onHold[1]].forEach(index => squares[index + currentPosition])
    let collision = toBeSwitch.classList.contains('fixed')
}

function checkPush(){
    let toBeSwitch = theTetrominoes[onHold[0]][onHold[1]].forEach(index => squares[index + currentPosition])
    
}
*/








// DEDUCT LINE
function deductLine(){
    let oneUnit = []
    for(let i = 0; i < 10; i++){
        oneUnit.push(i)
        //console.log(oneUnit)        // [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    }
    let lineCount = 0
    for(let i = 20; i < 220; i += 10){
        let tenArr = oneUnit.map(index => index + i)        // eg. i = 80, tenArr = [80,...,89]
        let fullLine = tenArr.every(index => squares[index].classList.contains('fixed'))
        
        if(fullLine){
            tenArr.forEach(index => squares[index].classList.remove('fixed'))
            tenArr.forEach(index => squares[index].classList.remove(...colorClassFixed))
            lineCount++
            let checkAbove = []
            for (let j = 20; j < i; j++){
                checkAbove.push(j)
            }

            dropDown('fixed')
            colorClassFixed.forEach(dropDown)
            function dropDown(fix){
                let containFix = checkAbove.filter(index => squares[index].classList.contains(fix))
                containFix.forEach(index => squares[index].classList.remove(fix))
                containFix.forEach(index => squares[index + 10].classList.add(fix))
            }
        }
    }
    if(lineCount==1){
        totalScore += 100
    }
    if(lineCount==2){
        totalScore+=400
    }
    if(lineCount==3){
        totalScore += 900
    }
    if(lineCount==4){
        totalScore+=2000
    }

    score.innerHTML = totalScore
    checkLevel()
}

let currentLevel = 1
function checkLevel(){
    let oldLevel = currentLevel
    if (totalScore > 1999){
        currentLevel = 2
        currentSpeed = 900
    }
    if (totalScore > 3999){
        currentLevel = 3
        currentSpeed = 800
    }
    if (totalScore > 5999){
        currentLevel = 4
        currentSpeed = 700
    }
    if (totalScore > 7999){
        currentLevel = 5
        currentSpeed = 600
    }
    if (totalScore > 9999){
        currentLevel = 6
        currentSpeed = 500
    }
    if (totalScore > 11999){
        currentLevel = 7
        currentSpeed = 400
    }
    if (totalScore > 13999){
        currentLevel = 8
        currentSpeed = 300
    }
    if (totalScore > 15999){
        currentLevel = 9
        currentSpeed = 250
    }
    if (totalScore > 17999){
        currentLevel = 10
        currentSpeed = 200
    }
    if (totalScore > 19999){
        currentLevel = 11
        currentSpeed = 150
    }
    if (totalScore > 21999){
        currentLevel = 12
        currentSpeed = 100

    }
    level.innerHTML = currentLevel
    setSpeed(currentSpeed)
    if(oldLevel !== currentLevel){
        levelUpEff()
    }
}


function levelUpEff(){
    grid.style.boxShadow = '0 0 18px rgb(0, 255, 166)';
    popUp.style.visibility = 'visible';
    document.getElementById('new-level').innerHTML = currentLevel;
    function black(){
        grid.style.boxShadow = '';
        popUp.style.visibility = 'hidden'
    }
    setTimeout(black, 800);
}


function hardDrop(){
    if(playMode && !idleMode){
        gridArr.forEach(index => squares[index].classList.remove(...colorClassTet))
        shadowToFixed(colorClassShadow[randomTet], colorClassFixed[randomTet])
        function shadowToFixed(shadowColor, fixedColor){
            let containShadow = gridArr.filter(index => squares[index].classList.contains(shadowColor))
            containShadow.forEach(index => squares[index].classList.remove(shadowColor))
            containShadow.forEach(index => squares[index].classList.add('fixed'))
            containShadow.forEach(index => squares[index].classList.add(fixedColor))
        }
        drop = true
        freeze()
        drop = false
    }    
}











/*
to do:
effect when deduct line
add score when tet drops
make tet 3d
toBeDrawn into toBeRotated
mini class color used by hold also
small bug: clicking on howToPlay-btn using mouse & hit enter (for start game) at the same time

fixed:
hold feature
effect when level up
small bug: current remains even after restarting - by putting current & randomTet into start() function
*/
