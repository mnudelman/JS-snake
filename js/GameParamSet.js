/**
 * Created by michael on 07.07.15.
 */
function GameParamSet() {
    var variant = 0 ;
    var difficultyLevel = 0 ;
    this.params = {
       ROWS_NUMBER : 25,               // число ячеек матрицы по высоте
       COLS_NUMBER : 25,               // число ячеек матрицы по ширине
       GAME_DELAY : -1 ,
       GAME_LIFETIME : 30000 ,           // время игры 30 sec
       SNAKE_MOVE_DELAY : 600 ,          // задает нач скорость 1000/600 = 1.6 steps/sec
       SNAKE_SPEED_INCREASE : 0.1 ,      // % от max скорости при изменении скорости
       SNAKE_MOVE_DELAY_MIN : 100 ,      // мин задержка (корость 10 steps/sec)
       TARGET_LIFETIME : 30 ,            // время жизни цели
       TARGET_NUMBER : 1 ,
       TARGET_BLINKING: -1,
       MAIN_TARGET_LIFETIME : -1           // время жизни главной цели
    } ;
    this.CELL_WIDTH = 20 ; //30 ;                 // ширина клетки матрицы(px)
    this.CELL_HEIGHT = 20; //30 ;                // высота

    this.ONE_POINT = 10 ;  // цена одного поглощения цели


    this.winLocation ;           // относительный адрес директории запуска
    this.windowLocationHost ;    // http - адрес для доступа к php-модулям БД
    this.dirImages ;

    this.ajaxExecute ;   // исполнитель запросов к БД

    this.user = {
        login : 'guest',
        password : '',
        status : 5 ,
        successfulEnter : false
    } ;
    /** статус определяет функциональные возможности */
    this.USER_STAT_ADMIN = 99;  // создание новых разделов, групповое добавление картинок
    this.USER_STAT_USER = 10;        // добавление картинок по одной
    this.USER_STAT_GUEST = 5;      // только просмотр




    this.STATISTIC_NUMBER = 15 ;     // число выводимых строк в статистике
    var _this = this ;
    var cellClassList = ['.cell','.cellDefault','.cellNewStart','.cellOldStart',
            '.cellWinner','.headLeft','.headRight','.headUp','.headDown','.snakeBody',
        '.target'] ;
    var _this = this ;

     this.init = function(currentVar,currentLevel) {
        variant = currentVar ;
        difficultyLevel = currentLevel ;
        // параметры варианта и уровня //
        var arr = window.location.pathname.split('/') ;
        var path = '' ;
        for (var i = 1; i < arr.length - 1; i++) {
            path += '/'+arr[i] ;
        }
        _this.winLocation = path ;
        var str = window.location.href ;
        _this.windowLocationHost = str.replace('/index.html','') ;
        var url = _this.windowLocationHost+'/ajaxHost' ;
        _this.ajaxExecute = new AjaxExecutor(url) ;
        _this.dirImages = _this.winLocation+'/images'

    } ;
    this.cellResize = function() {
      for (var i = 0; i < cellClassList.length; i++) {
          var className = cellClassList[i] ;
          $(className).css({width: _this.CELL_WIDTH, height: _this.CELL_WIDTH}) ;
      }
    } ;
    this.setUser = function(userVect) {
        _this.user['login'] = userVect['login'] ;
        _this.user['password'] = userVect['password'] ;
        _this.user['successfulEnter'] = userVect['successful'] ;
        _this.user['status'] = (_this.user['successfulEnter']) ?
                               _this.USER_STAT_USER : _this.USER_STAT_GUEST ;

    }

}