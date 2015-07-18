/**
 * Created by michael on 10.07.15.
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
    var selectForInput = new SelectForInput() ;
    var statDataReady = false ;   // получение исходных данных от сервера
    var nameList ;                // список имен от сервера
    var statisticForm = new StatisticForm() ; // форма вывода статистики
    var ajaxExecute = paramSet.ajaxExecute ;
    var _this = this ;

    this.init = function(game) {
        gameObj = game ;
        _this.setBegin() ;
        _this.inputNameBegin() ;                // фокус на ввод имени
        setButtonsOnClick(game) ;
        setJQueryUi() ;
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
    this.setTotalTime = function(totTime) {
        totalTime = totTime ;
        var text = Math.floor(totalTime/1000) +' sec' ;
        $('#totalTime').attr('value',text) ;
    } ;
    this.setMaxSpeed = function(mSpeed) {
        maxSpeed = mSpeed ;
        var text = Math.floor(totalTime/1000) +' sec' ;
        $('#totalTime').attr('value',text) ;

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
        var dTime = Math.floor((currentTime - timeStart)/1000 );
        dTime = (isNaN(dTime)) ? 0 : dTime ;
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
        $elem.find('.markerText')[0].textContent = Math.floor(curSpeed) ;
    } ;
    //------- управление кнопками ------- ///
    this.btGameGoDisable = function() {   // скрыть после запуска игры
        $('#gameCreator-bt').animate({height: "hide"}, 1000);
    };
    this.setBegin = function() {
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

    this.gameSave = function() {

    } ;
    this.getStatistic = function() {

    } ;
    this.getResult = function() {
        var name = $('#gamerName').val() ;
        var points = $('#points').val() ;
        return {
            gameId : gameId ,
            gamerName : name ,
            points : points
        } ;

    } ;
    var nameKeyPressed = function() {

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
                var result = _this.getResult() ;
                var answ = ajaxExecute.sendResult(result) ;
                $('#gameSave-bt').animate({height: "hide"}, 1000); // нажал и исчез
                break ;
            }
            case 'gameStatistic-bt' : {        //  вывести статистику игры
                getStatData(['statisticForm.init']) ;
                break ;
            }
        }
    } ;
    var getStatData = function(sendAddr) {
        ajaxExecute.getStatistic() ;
        var tmpTimer = setInterval(function() {
            var statData = ajaxExecute.getStatData() ;
            if (false !== statData) {
                clearInterval(tmpTimer) ;
                for (var i = 0 ; i < sendAddr.length; i++) {
                    eval(sendAddr[i])(statData) ;
                }
            }
        },300) ;
    } ;

    this.inputNameBegin = function() {         // поле - ввод имени
        var jQueryInputElem = $('#inputSelect-name') ;
        jQueryInputElem.focusin(function(){
            selectForInput.inputGo() ;
        }) ;
        nameListFromDb() ;
    } ;
    var nameListFromDb = function() {
        ajaxExecute.getStatistic() ;   // процесс чтения из БД
        var tmpTimer = setInterval(function() {
            var statData = ajaxExecute.getStatData() ;
            if (false !== statData) {
                clearInterval(tmpTimer) ;
                nameListPrepare(statData) ;
                selectForInput.setJQueryElem('inputSelect-name') ;
            }
        },300) ;
    } ;
    var nameListPrepare = function(statData) {  // список имен из общего массива данных
        nameList = [];
        var i = 0;
        for (var key in  statData) {
            var newName = statData[key]['gamerName'];
            if (nameList.indexOf(newName) == -1) {
                nameList[i++] = newName;
            }
        }
        nameList.sort();
        statDataReady = true;
        selectForInput.setGeneralList(nameList) ;
    } ;

}