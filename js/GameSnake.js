/**
 * Created by michael on 06.07.15.
 */
function GameSnake(gameId) {
    var gameName = 'Snake_' + gameId;
    var globalId = (new Date()).getTime() ;
    var objects = {
        GAME: 'game',
        SNAKE: 'snake',
        TARGET: 'target'
    };
    // действия, порождаемые во аремя игры
    var actions = {
        NEW_GAME: {name: 'newGame', obj: objects['GAME']},
        UP: {name: 'moveUp', obj: objects['SNAKE']},
        DOWN: {name: 'moveDown', obj: objects['SNAKE']},
        LEFT: {name: 'moveLeft', obj: objects['SNAKE']},
        RIGHT: {name: 'moveRight', obj: objects['SNAKE']},
        REVERSE_R: {name: 'roundRight', obj: objects['SNAKE']},
        REVERSE_L: {name: 'roundLeft', obj: objects['SNAKE']},
        ADD_TAIL: {name: 'addTail', obj: objects['SNAKE']},
        ADD_TARGET : {name:'newTarget', obj: objects['TARGET']},
        SPEED_INCREASE : {name:'speedIncrease', obj: objects['GAME']},
        SPEED_DECREASE : {name:'speedDecrease', obj: objects['GAME']}
    };
    // кнопки управления игрой
    var buttons = {
        BT_NEW_GAME: {name: 'newGame', action: 'NEW_GAME', key: 'alt+N'},
        BT_LEFT: {name: 'left', action: 'LEFT', key: 'left',hide:'START,END'},
        BT_UP: {name: 'up', action: 'UP', key: 'up',hide:'START,END'},
        BT_RIGHT: {name: 'right', action: 'RIGHT', key: 'right',hide:'START,END'},
        BT_DOWN: {name: 'down', action: 'DOWN', key: 'down',hide:'START,END'},
        BT_REVERSE_LEFT: {name: 'ReverseLeft', action: 'REVERSE_L', key: 'alt+left',hide:'START,END'},
        BT_REVERSE_RIGHT: {name: 'ReverseRight', action: 'REVERSE_R', key: 'alt+right',hide:'START,END'},
        BT_SPEED_INCR: {name: 'accelerate', action: 'SPEED_INCREASE', key: 'alt+X',hide:'START,END'},
        BT_SPEED_DECR: {name: 'slowDown', action: 'SPEED_DECREASE', key: 'alt+Y',hide:'START,END'}
    };
    // клавиши управления игрой
    var keys = {
        KEY_ALT_N: {action: 'NEW_GAME', keyCode: 78, alt: true},
        KEY_LEFT: {action: 'LEFT', keyCode: 37},
        KEY_RIGHT: {action: 'RIGHT', keyCode: 39},
        KEY_UP: {action: 'UP', keyCode: 38},
        KEY_DOWN: {action: 'DOWN', keyCode: 40},
        KEY_REVERSE_L: {action: 'REVERSE_L', keyCode: 37, alt: true},
        KEY_REVERSE_R: {action: 'REVERSE_R', keyCode: 39, alt: true},
        KEY_ALT_T: {action: 'ADD_TAIL', keyCode: 84, alt: true},
        KEY_ALT_S: {action: 'ADD_TARGET', keyCode: 83, alt: true},
        KEY_ALT_X: {action: 'SPEED_INCREASE', keyCode: 219, alt: true},
        KEY_ALT_Y: {action: 'SPEED_DECREASE', keyCode: 89, alt: true}
    };

    var timers = {
        MOVE_TIMER: new Timer()
    } ;
    var infoForm = new InfoForm() ;
    var matrixArea;        // матрица игры
    var commands;          // кнопки управления игрой
    var commandsName = '';
    var variant = 0;
    var difficultyLevel = 0;

    var areaCols;           // число столбцов матрицы
    var areaRows;           //


    var currentCourse;      // текущий курс перемещения
    var tmpTimer = -1  ;
    //    объекты игры
    var snake = new Snake();      // змейка
    var target = new Target() ;   // цель для поглощения

    var gameEvent = new GameEvent() ;         // события игры
    var _this = this;
    //---------------------------------------------//
    this.create = function () {
        infoForm.init(_this) ;
        infoShow() ;
    };
    this.gameGo = function() {   // запускается кнопкой
        if (!infoForm.isNameNotEmpty()) {     // форма не заполнена
            return false ;
        }
        infoForm.btGameGoDisable() ;   // выкл кнопки

        areaCols = paramSet.params['COLS_NUMBER'];
        areaRows = paramSet.params['ROWS_NUMBER'];
        matrixArea = new MatrixArea(gameId, areaRows, areaCols);
        var cellWidth = paramSet.CELL_WIDTH ;
        var cellHeight = paramSet.CELL_HEIGHT ;
        matrixArea.setCellSize(cellHeight,cellWidth);

        commands = new Commands(gameName);
        matrixArea.setCommands(commands.init(buttons));

        matrixArea.create();
        commands.onClickBt(_this);
        commands.setHide('START') ;
    } ;
    var infoShow = function() {            // начальные параметры игры
        infoForm.setGameId(globalId) ;
        var vMin = 1000/paramSet.params['SNAKE_MOVE_DELAY'] ;
        infoForm.setCurrentSpeed(vMin) ;
        infoForm.setCurrentTime(0) ;
        var maxSpeed = Math.floor(1000/ paramSet.params['SNAKE_MOVE_DELAY_MIN']) ;
        infoForm.setMaxSpeed(maxSpeed) ;
        infoForm.setTotalTime(paramSet.params['GAME_LIFETIME']) ;
    } ;
    this.onClickCommands = function (clickId) {   // клавиши управления игрой
        var arr = clickId.split('-');
        var btKey = getButtonByName(arr[1]);
        var bt = buttons[btKey];
        var actKey = bt['action'];
        actionDo(actKey);
    };

    this.onKeyPressed = function (keyCode, altFlag, ctrlFlag) {   // от клавиатуры
        var ky = getKeyByCode(keyCode, altFlag, ctrlFlag);
        if (false == ky) {
            return
        }
        var actKey = keys[ky]['action'];
        actionDo(actKey);
    };

    var actionDo = function (actKey) {
        var actName = actions[actKey]['name'];
        var actObjName = actions[actKey]['obj'];
        switch (actObjName) {
            case objects['GAME'] :
            {
                eval(actName)();
                break;
            }
            case objects['SNAKE'] :
            {
                if (',LEFT,UP,RIGHT,DOWN,REVERSE_L,REVERSE_R,'.indexOf(',' + actKey + ',') >= 0) {
                    if (',REVERSE_L,REVERSE_R,'.indexOf(',' + actKey + ',') >= 0) {
                        stepReverse(actKey);
                    } else {
                        if (currentCourse != actKey) {
                            stepSimple(actKey);
                        }
                    }
                } else if ('ADD_TAIL' == actKey) {
                    addTail();

                }
                break;
            }
            case objects['TARGET'] : {
                if (actKey == 'ADD_TARGET') {
                    newTarget() ;
                }
                break ;
            }
        }
    };

    var newTarget = function(n) {    // порождение новой цели
        n = (n == undefined) ? 1 : n ;
        for (var i = 0 ; i < n ; i++)  {
            var cell = getFreeCell();
            target.newTarget(cell);
        }
    } ;

    var getFreeCell = function() {
        do {
            var coord = randomRowCol() ;
            var iRow = coord[0] ;
            var jCol = coord[1] ;
            var cell = matrixArea.getCellByRowCol(iRow,jCol,true) ; // только свободные
            if(cell) {
                return cell ;
            }
        } while (true) ;
    } ;

    var randomRowCol = function() {
       var iRowMax = paramSet.params['ROWS_NUMBER'] ;
       var jColMax = paramSet.params['COLS_NUMBER'] ;
       var iRow = Math.floor(Math.random()*iRowMax) ;
       var jCol = Math.floor(Math.random()*jColMax) ;
       return [iRow,jCol] ;
    } ;

    var getKeyByCode = function (keyCode, altFlag, ctrlFlag) {
        for (var ky in keys) {
            var kCode = keys[ky]['keyCode'];
            var altF = keys[ky]['alt'];
            altF = (altF == undefined) ? false : altF;
            if (kCode == keyCode && altFlag == altF) {
                return ky;
            }
        }
        return false;
    };
    var stepSimple = function (course) {    // простое движение по курсу на 1 шаг
        currentCourse = course ;
        var newH = makeNewHead(course);
        if (false == newH) {
            return false ;
        }
        if ( !newH.isFree() ) {
            whyBlock(newH) ;          // может освободить ячейку(напр, захват)
        }
        if ( newH.isFree() ) {
            headCell = newH;
            snake.setCourse(course, newH);
        }
    } ;
    var stepReverse = function (course) { // боевой разворот
        var nSteps = 0 ;
        var dMove = [];
        switch (currentCourse) {
            case 'UP' :
            {
                dMove = (course == 'REVERSE_L') ? ['LEFT', 'DOWN'] : ['RIGHT', 'DOWN'];
                break;
            }
            case 'DOWN' :
            {
                dMove = (course == 'REVERSE_L') ? ['RIGHT', 'UP'] : ['LEFT', 'UP'];
                break;
            }
            case 'LEFT' :
            {
                dMove = (course == 'REVERSE_L') ? ['DOWN', 'RIGHT'] : ['UP', 'RIGHT'];
                break;
            }
            case 'RIGHT' :
            {
                dMove = (course == 'REVERSE_L') ? ['UP', 'LEFT'] : ['DOWN', 'LEFT'];
                break;
            }
        }
        var headCell = snake.getHead() ;
        var coord = headCell.getRowCol();
        var iRow = coord[0];
        var jCol = coord[1];
        for (var i = 0; i < 2; i++) {    // выполняем сразу
            var course = dMove[i];
            var newH = newCellByRowCol(course, iRow, jCol);
            if (false == newH) {
                continue ;
            }
            if ( !newH.isFree() ) {
                whyBlock(newH) ;
            }
            if ( newH.isFree() ) {
                headCell = newH;
                currentCourse = dMove[i];
                snake.setCourse(currentCourse, headCell);
                var coord = newH.getRowCol();
                var iRow = coord[0];
                var jCol = coord[1];
                nSteps++ ;
            }else {
                break ;
            }
        }
        return nSteps ;
    };

    var whyBlock = function(cell) {
        if (false !== target.setTarget(cell)) {    // цель захвачена
            var pnts = target.getPoints() ;
            var img  = target.getImgFile() ;
            target.delTarget() ;
            addTail(img) ;
            infoForm.addPoints(pnts) ;
            newTarget(1) ;   // создать новую цель
            return true ;
        }

    } ;

    var addTail = function (imgFile) {       // нарастить хвост
        var lastCell = snake.getEndOfTail();
        var coord = lastCell.getRowCol();
        var iRow = coord[0];
        var jCol = coord[1];
        var course = ['LEFT', 'UP', 'RIGHT', 'DOWN']; // хвост в любую сторону
        for (var i = 0; i < 4; i++) {
            var cell = newCellByRowCol(course[i], iRow, jCol);
            if (false == cell) {
                continue ;
            }
            if (cell.isFree()) {
                snake.addTail(cell,imgFile);
                break;
            }
        }
    };


    var newCellByRowCol = function (course, iRow, jCol) {
        var dy = (course == 'UP') ? -1 : ( (course == 'DOWN') ? +1 : 0 );
        var dx = (course == 'LEFT') ? -1 : ( (course == 'RIGHT') ? +1 : 0 );
        var newRow = iRow + dy;
        var newCol = jCol + dx;
        //var freeFlag = true;
        return matrixArea.getCellByRowCol(newRow, newCol);
    };

    var makeNewHead = function (course) {   // возможность передвинуть голову
        currentCourse = course;
        var headCell = snake.getHead() ;
        var coord = headCell.getRowCol();
        var iRow = coord[0];
        var jCol = coord[1];
        return newCellByRowCol(course, iRow, jCol);
    };
    var getButtonByName = function (clickName) {
        for (var key in buttons) {
            var name = buttons[key]['name'];
            if (name == clickName) {
                return key;
            }
        }
    };
    var newGame = function () {
        timersStop() ;
        commands.setHide('GAME') ;
        matrixArea.matrixClear();
        target.clear() ;
        gameEvent.onKeyAct(matrixArea.getMatrixName(),_this) ; // события по нажатию кнопки
        var headCell = matrixArea.getCellByRowCol(1, 5);
        var bodyCells = [matrixArea.getCellByRowCol(1, 6), matrixArea.getCellByRowCol(1, 7)];

        infoForm.setTimeStart((new Date()).getTime()) ;
        infoForm.setButtonsGameStart() ;
        infoForm.clearPoints() ;
        infoShow() ;
        currentCourse = 'LEFT';
        snake.create(headCell, bodyCells, currentCourse);
        timers['MOVE_TIMER'].delay = paramSet.params['SNAKE_MOVE_DELAY'];
        timers['MOVE_TIMER'].lifetime = paramSet.params['GAME_LIFETIME'];
        timers['MOVE_TIMER'].start();

        newTarget(paramSet.params['TARGET_NUMBER']) ;

        timers['MOVE_TIMER'].id = setInterval(autoMove, paramSet.params['SNAKE_MOVE_DELAY']);
    } ;
    var gameOver = function() {
        timersStop() ;
        commands.setHide('END') ;

        infoForm.setButtonsGameOver() ;
        gameEvent.onKeyDeAct(matrixArea.getMatrixName()) ;
        alert('gameOver!') ;

    } ;
    var timersStop = function() {   // закрыть все таймеры
       for (var key in timers) {
           var tm = timers[key] ;
           tm.stop() ;
       }
    } ;
    var autoMove = function() {
        infoForm.setCurrentTime() ;
        if (timers['MOVE_TIMER'].isTimeOver()) {
            timersStop() ;
            gameOver() ;
        }else {
           var n=  target.exceededLifetime() ;  // превышено время жмзни
          n = Math.min(n,paramSet.params['TARGET_NUMBER']) ;
          if (n > 0) {
               newTarget(n) ; // зажечь новые
           }
           if (false == stepSimple(currentCourse) ) {  // нет возможности двигаться
               var arr = ( Math.random()  > 0.5) ? ['REVERSE_L'] :
                                                   ['REVERSE_R'] ;
               for (var i = 0 ; i < 2; i++) {
                   if (stepReverse(arr[i]) > 0 ) {
                       break ;
                   }
               }
           }
        }
    } ;

    var speedClc = function(incrSign) {
        incrSign = (incrSign == undefined) ? +1 : incrSign ;
        var timer =  timers['MOVE_TIMER'] ;
        var currentDelay = timer.delay ;
        var currentSpeed = 1000/currentDelay ;
        var speedIncr = paramSet.params['SNAKE_SPEED_INCREASE'] ;
        var maxSpeed = 1000/paramSet.params['SNAKE_MOVE_DELAY_MIN'] ;
        var newSpeed = currentSpeed +incrSign * speedIncr * maxSpeed ;
        newSpeed = Math.min(newSpeed,maxSpeed) ;
        newSpeed = Math.max(newSpeed,speedIncr) ;
        var newDelay = 1000/newSpeed ;
        timer.delay = newDelay ;
        timer.stop() ;
        timer.id = setInterval(autoMove, timer.delay);
        infoForm.setCurrentSpeed(newSpeed) ;

    } ;
    var speedIncrease = function() {
        speedClc(+1) ;
    } ;
    var speedDecrease = function() {
        speedClc(-1) ;

    } ;
}