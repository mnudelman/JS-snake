/**
 * Управление редактированием и отображением параметров игры
 */
function InfoForm() {
    var gameObj ;    // объект - игра
    var totalPoints = 0 ;
    var  currentSpeed ;
    var gamerName ;
    var gameId ;
    var currentTime ;
    var totalTime ;
    var maxSpeed ;
    var timeStart ;
    var btList = ['gameCreator-bt','gameSave-bt','gameStatistic-bt'] ;
    this.statisticForm ; // форма вывода статистики
    this.ajaxExecute = paramSet.ajaxExecute ;
    // формы отображения и редактирования атрибутов
    this.enterForm ;         // авторизация
    this.setupForm;          // параметры игры
    this.statisticFilter ;   // фильтр для вывода статистики
    this.calculateForm ;     // форма вывода расчета по строке таблицы статистики
    this.totalRating ;
    var _this = this ;

    this.init = function(game) {
        gameObj = game ;
        _this.statisticForm = new StatisticForm(_this) ; // форма вывода статистики
        _this.enterForm = new EnterForm(_this) ;         // авторизация
        _this.setupForm = new SetupForm(_this);          // параметры игры
        _this.statisticFilter = new StatisticFilter(_this) ;   // фильтр для вывода статистики
        _this.calculateForm = new CalculateForm(_this) ;
        _this.totalRating = new TotalRating() ;
        setButtonsOnClick(game) ;
        _this.setBtBegin() ;         // положение(видимость кнопок)

        _this.enterForm.init() ;         // авторизация
        _this.setupForm.init();          // параметры игры
        _this.statisticFilter.init() ;   // фильтр для вывода статистики
        _this.calculateForm.init() ;     //

        $('#about').accordion({
            heightStyle: "content",
            collapsible: true

        });


        var $tabs = $('#tabs') ;
        $tabs.tabs();
        $tabs.animate({height: "show"}, 1000);
   } ;

    this.isNameNotEmpty = function() {       // проверка имени
        var name = $('#gamerName').val() ;
        name = name.trim() ;
        if (name.length == 0) {
            alert('the "name" must be filled !') ;
            return false ;
        }
        return true ;
    };
    // ----- начальные назначения ------ ///
    this.setGameId = function(gId) {
       gameId = gId ;
        $('#gameId').attr('value',gameId) ;
    } ;
    this.clearPoints = function() {
        totalPoints = 0 ;
        $('#points').attr('value',totalPoints) ;
    } ;

    this.clearSetup = function() {             // убрать доступ к размеру метрицы и ячейки
        $('#slider-matrixSize').empty() ;
        $('#slider-cellSize').empty() ;

    } ;
    this.setTotalTime = function(totTime) {
        totalTime = totTime ;
        var text = Math.floor(totalTime/1000) +' sec' ;
        $('#totalTime').attr('value',text) ;
    } ;
    this.setMaxSpeed = function(mSpeed) {
        maxSpeed = mSpeed ;
        $('#maxSpeed').attr('value',mSpeed+'steps/sec') ;

    } ;

    //--- процесс игры  ----- //
    this.addPoints = function(points) {
        totalPoints += points ;
        $('#points').attr('value',totalPoints) ;
    } ;

    this.setTimeStart = function(tStart) {
       timeStart =  tStart ;
    } ;
    this.setCurrentTime = function(curTime) {
        if (curTime == undefined) {
            curTime = (new Date()).getTime() ;
        }
       currentTime = curTime ;
       var alpha = (currentTime - timeStart)/totalTime ;
       var totWidth = parseInt( $('#currentTime').css('width') );
       var width = (curTime == 0) ? 0 : Math.floor(alpha * totWidth) ;
       var $elem = $('#timeMarker') ;
       $elem.css('width',''+width) ;
        var dTime = ((currentTime - timeStart)/1000 );

        dTime = (isNaN(dTime)) ? 0 : dTime.toFixed(3) ;
        dTime = (dTime < 0  ) ? 0 : dTime ;
        $elem.find('.markerText')[0].textContent = dTime ;
    } ;
    this.setCurrentSpeed = function(curSpeed) {
        currentSpeed = curSpeed ;
        var alpha = currentSpeed/maxSpeed ;
        var totWidth = parseInt( $('#currentSpeed').css('width') );
        var width =  Math.floor(alpha * totWidth) ;
        var $elem = $('#speedMarker') ;
        $elem.css('width',''+width) ;
        $elem.find('.markerText')[0].textContent = curSpeed.toFixed(3) ;
    } ;
    //------- управление кнопками ------- ///
    this.btGameGoDisable = function() {   // скрыть после запуска игры
        $('#gameCreator-bt').animate({height: "hide"}, 1000);
    };


    this.setBtBegin = function() {
        $('#gameCreator-bt').animate({height: "show"}, 1000);
        $('#gameSave-bt').animate({height: "hide"}, 1000);
        $('#gameStatistic-bt').animate({height: "hide"}, 1000);

    };

    this.setButtonsGameStart = function() {
        $('#gameCreator-bt').animate({height: "hide"}, 1000);
        $('#gameSave-bt').animate({height: "hide"}, 1000);
        $('#gameStatistic-bt').animate({height: "hide"}, 1000);

    };
    this.setButtonsGameOver = function() {
        $('#gameSave-bt').animate({height: "show"}, 1000);
        $('#gameStatistic-bt').animate({height: "show"}, 1000);
    };

    this.getResult = function() {
        return {
            typ: 'saveResult',
            gameId : gameId ,
            gameTime:  paramSet.params['GAME_LIFETIME']/1000,
            gamerName : paramSet.user['login'] ,
            points : +$('#points').val(),
            total: +$('#totalRating').val(),
            matrixSize : paramSet.params['ROWS_NUMBER'],
            targetsNumber : paramSet.params['TARGET_NUMBER'],
            targetLifetime : paramSet.params['TARGET_LIFETIME']
        } ;


    } ;
    this.setGameOver = function() {
        _this.setButtonsGameOver() ;
        var total = _this.totalRating.calculateTotal() ;
        $('#totalRating').val(total) ;
    } ;
    var setButtonsOnClick = function() {
        for (var i = 0; i < btList.length ; i++) {
            var btId = btList[i] ;
            $('#' + btId).on('click', function (ev) {
                onClickCommands(this.id) ;
            });
        }
    };
    var onClickCommands = function(btId) {
        //['gameCreator-bt','gameSave-bt','gameStatistic-bt'] ;
        switch (btId) {
            case 'gameCreator-bt' : {
                gameObj.gameGo() ;
                break ;
            }
            case 'gameSave-bt' : {
                if (paramSet.user['status'] < paramSet.USER_STAT_USER) {
                    _this.enterForm.init() ;
                }else {
                    var result = _this.getResult() ;
                    var answ = _this.ajaxExecute.sendResult(result) ;
                    $('#gameSave-bt').animate({height: "hide"}, 1000); // нажал и исчез
                }

                break ;
            }
            case 'gameStatistic-bt' : {        //  вывести статистику игры
                 _this.statisticForm.init() ;
                break ;
            }
        }
    } ;

    this.setGamerName = function(name) {
        $('#gamerName').val(name) ;
    }
 }