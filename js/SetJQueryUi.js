/**
 * Created by michael on 23.07.15.
 */
/**
 * Сервис, обслуживающий обращения к jQueryUi
 */
function setJQueryUi(infoObj) {
    var dbData = infoObj.dbData ;    // объект для работы с БД
    var statisticForm  = infoObj.statisticForm ;    //  вывод статистики
    // --- объекты jQuery ввода пароля
    var $loginElem = $('#login') ;
    var $passwordElem = $('#password') ;
    var $messageText = $('#massageText') ;
    var _this = this ;
    // атрибуты авторизации
    var authorizationVect = {
        login : '' ,
        password : '' ,
        newName : false ,
        guest : false
    } ;
    $('#enterDialog').dialog({
        title: 'game "Snake"',
        width:500,
        modal:true,
        buttons: [
            {
                text: "guest",
                click: function() {
                    authorizationVect['guest'] = true ;
                    paramSet.setUser(authorizationVect) ;
                    $( this ).dialog( "close" );
                }
            },
            {
                text: "enter",
                click: function() {
                    authorizationVect['newName'] = false ;
                    authorizationVect['login'] = $loginElem.val() ;
                    authorizationVect['password'] = $passwordElem.val() ;
                    authorizationVect['newName'] = false ;
                    var answVect = dbData.authorization(authorizationVect) ;
                    if (answVect['successful'] == true ) {
                        paramSet.setUser(authorizationVect) ;
                        $( this ).dialog( "close" );
                    }else {
                        var message  = answVect['message'] ;
                        $('#messageText').empty() ;
                        $('#messageText').append(message) ;
                    }
                }
            },
            {
                text: "new name",
                click: function() {
                    authorizationVect['newName'] = true ;
                    authorizationVect['login'] = $loginElem.val() ;
                    authorizationVect['password'] = $passwordElem.val() ;
                    authorizationVect['newName'] = false ;
                    var answVect = dbData.authorization(authorizationVect) ;
                    if (answVect['successful'] == true ) {
                        paramSet.setUser(authorizationVect) ;
                        $( this ).dialog( "close" );
                    }else {
                        var message  = answVect['message'] ;
                        $('#messageText').empty() ;
                        $('#messageText').append(message) ;
                    }

                }
            }


        ]
    }) ;

    $("#login").autocomplete({
        source: dbData.getNameList( trim($loginElem.val()) )
    });








    $('#tabs').tabs();
    $('#tabs').animate({height: "show"}, 1000);








    sliderGameSetup('gameTime', 30, 30, 300, 30, 'sec');
    sliderGameSetup('matrixSize', 20, 10, 40, 5, 'cells',infoObj);
    sliderGameSetup('targetsNumber', 1, 1, 5, 1, 'units');
    sliderGameSetup('targetLifetime', 30, 3, 30, 3, 'sec');



    sliderGameSetup('cellSize', 20, 10, 40, 5, 'px',infoObj);
    sliderGameSetup('maxSpeed', 10, 10, 20, 2, 'steps/sec');


    $('#stat-recordsFilter').spinner({
        min: 10,
        max: 100,
        step: 10,
        numberFormat: 'n',
        change: function (event, ui) {

        }
    });

    $('#stat-pointsFilter').spinner({
        min: 10,
        max: 100,
        step: 10,
        numberFormat: 'n',
        change: function (event, ui) {

        }
    });

    $("#stat-nameFilter").autocomplete({
        source: infoObj.getNameList()
    });

    $('#about').accordion({
        heightStyle:"content",
        collapsible:true

    }) ;
}
function sliderGameSetup(elemName,val,minVal,maxVal,step,unitName,infoObj) {
    $('#slider-'+elemName).slider({
        value: val ,
        min: minVal,
        max: maxVal,
        step:step,
        slide:function(event,ui) {
            $('#game-'+elemName).val(ui.value+' '+unitName) ;
            setupUpdate(elemName,ui.value,infoObj) ;
        }
    }) ;
    $( '#game-'+elemName).val( $('#slider-'+elemName).slider( "value" )+' '+unitName );
}

function setupUpdate(parName,parValue,infoObj) {
    var newGameAreaFlag = false ;
    switch (parName) {
        case 'gameTime' : {
            paramSet.params['GAME_LIFETIME'] = parValue*1000 ;
            $('#totalTime').attr('value',parValue+' sec') ;
            break ;
        }
        case 'matrixSize' : {
            var curRows = paramSet.params['ROWS_NUMBER'] ;
            var curCols = paramSet.params['COLS_NUMBER'] ;
            if (curRows !== parValue || curCols !== parValue) {
                paramSet.params['ROWS_NUMBER'] = parValue ;
                paramSet.params['COLS_NUMBER'] = parValue ;
                newGameAreaFlag = true ;
            }

            break ;
        }
        case 'cellSize' : {
            var curWidth = paramSet.params['CELL_WIDTH'] ;
            var curHeight = paramSet.params['CELL_HEIGHT'] ;
            if (curWidth !== parValue || curHIeight !== parValue) {
                paramSet.params['CELL_WIDTH'] = parValue ;
                paramSet.params['CELL_HEIGHT'] = parValue ;
                newGameAreaFlag = true ;
            }
            paramSet.CELL_WIDTH = parValue ;
            paramSet.CELL_HEIGHT = parValue ;
            break ;

        }
        case 'maxSpeed' : {
            var delay = 1000/parValue ;
            paramSet.params['SNAKE_MOVE_DELAY_MIN'] = delay ;
            $('#maxSpeed').attr('value',parValue+'steps/sec') ;
            break ;
        }
        case 'targetsNumber' : {
            paramSet.params['TARGET_NUMBER'] = parValue ;
            break ;

        }
        case 'targetLifetime' : {
            paramSet.params['TARGET_LIFETIME'] = parValue  ;
            break ;

        }
    }
    if (newGameAreaFlag) {
        infoObj.setBtBegin() ;
    }

}