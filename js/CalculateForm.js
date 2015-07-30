/**
 * Вывод расчета TotalRating по строке
 */
function CalculateForm(infoForm) {
    var statisticForm;
    var totalRating;
    var ajaxExecute = paramSet.ajaxExecute ;
    var currentTotal ;
    var currentGameId ;
    var fieldRuleTable = {
        calc_base : 'baseRating',
        calc_gameTime : 'kGameTime',
        calc_matrixSize    : 'kMatrixSize',
        calc_targetsNumber : 'kTargets',
        calc_targetLifetime: 'kTargetLifetime',
        calc_points : 'kPoints'
    } ;

    var parameterForTotalRating = {   // параметр для расчета на основе запроса БД
        currentTime:  'gameTime',
        currentSize    : 'matrixSize',
        currentTargetsNumber : 'targetsNumber',
        currentLifetime: 'targetLifetime' ,
        currentPoints : 'points'
    } ;
    var ruleTable ;    // таблица - результат из totalRating

    var _this = this;
    $('#calculateDialog').hide();


    this.init = function () {
        statisticForm = infoForm.statisticForm;
        totalRating = infoForm.totalRating;
    };
    this.calculateExec = function (gameId) {
        if (gameId.indexOf('-') > 0 ) {
            var arr = gameId.split('-') ;
            gameId =arr[1] ;
        }
        currentGameId = gameId ;
        var requestVect = {
            typ: 'getGameAttr',
            gameId : gameId
        } ;

        ajaxExecute.getData(requestVect);
        var tmpTimer = setInterval(function () {
            var answFromDb = ajaxExecute.getRequestResult();
            if (false == answFromDb || undefined == answFromDb) {
                message = 'ERROR:Нет ответа от БД';
                ready = false;
            } else {
                clearInterval(tmpTimer);
                if (answFromDb['successful'] == true) {
                    fieldFill(answFromDb);
                } else {
                    ready = false;
                    message = answ['message'];
                }
            }
        },300) ;


        $('#calculateDialog').dialog({
            title: 'total calculate',
            width: 450,
            modal: false,
            buttons: [
                {
                    text: "oK!",
                    click: function () {
                        $(this).dialog("close");
                    }
                }
            ]
        });

    } ;
    var fieldFill = function(answFromDb) {
        $('#calc_gameId').val(currentGameId) ;
        var ruleTable = ruleTableClc(answFromDb) ;

        for (var key in fieldRuleTable) {   // соответствие полей формы и ruleTab
            var formField = key ;
            var ruleField = fieldRuleTable[key] ;
            var formFieldExp = formField+'Exp' ;
            var formFieldValue = formField+'Value' ;
            $('#' + formFieldExp).val(ruleTable[ruleField]['subst']) ;
            $('#' + formFieldValue).val(ruleTable[ruleField]['value']) ;

        }
        $('#calc_totalExp').val('100*k1*k2*k3*k4') ;
        $('#calc_totalValue').val(currentTotal) ;
    } ;
    var ruleTableClc = function(answVect) {
        //answVect = {gameTime: , matrixSize: , targetsNumber: , targetLifetime }
        //  вектор-параметр для totalRating

        var parVect = [] ;
        for (var key in parameterForTotalRating) {
            var keyPar  = parameterForTotalRating[key] ;
            var value = answVect[keyPar];
            value = (value == null) ? 0 : value ;
            parVect[key] = value ;
        }
        currentTotal  = totalRating.calculateTotal(parVect) ;    // расчет по текущим параметрам
        ruleTable = totalRating.getRule() ;
        return ruleTable ;
    }
}