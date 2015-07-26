/**
 * Created by michael on 22.07.15.
 */
/**
 * Обеспечивает взамодействие с БД
 * @constructor
 */
function DbData() {
    var nameList;
    var requestComplete = false ;
    var ajaxExec = paramSet.ajaxExecute;     // объект AjaxExecutor
    this.getNameList = function (name) {
        requestComplete = false ;
        name = (neme == undefined) ? '' : name ;
        var nameFilter = {name : name} ;
        ajaxExecute.getData();
        var tmpTimer = setInterval(function () {
            var statData = ajaxExecute.getRequestResult();
            if (false !== statData) {
                clearInterval(tmpTimer);
                for (var i = 0; i < sendAddr.length; i++) {
                    eval(sendAddr[i])(statData);
                }
            }
        }, 300);

    };
    this.isRequestComplete = function() {
       return requestComplete ;
    } ;
    this.saveResult = function (result) {

    };
    this.getData = function (statFilter) {

    };
    var getStatData = function (sendAddr) {
        ajaxExecute.getData();
        var tmpTimer = setInterval(function () {
            var statData = ajaxExecute.getRequestResult();
            if (false !== statData) {
                clearInterval(tmpTimer);
                for (var i = 0; i < sendAddr.length; i++) {
                    eval(sendAddr[i])(statData);
                }
            }
        }, 300);
    };

    var nameListFromDb = function () {
        ajaxExecute.getData();   // процесс чтения из БД
        var tmpTimer = setInterval(function () {
            statData = ajaxExecute.getRequestResult();
            if (false !== statData) {
                clearInterval(tmpTimer);
                nameListPrepare(statData);
                selectForInput.setJQueryElem('inputSelect-name');
                setJQueryUi(_this);
            }
        }, 300);
    };
    var nameListPrepare = function (statData) {  // список имен из общего массива данных
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
        selectForInput.setGeneralList(nameList);
    };
    this.getNameList = function () {
        return nameList;
    };
    this.authorization = function (queryVect) {
        var answerVect =
        {
            successful: false,
            message: ''
        };
        var login = queryVect['login'].trim();
        var password = queryVect['password'].trim();
        if (login.length == 0 || password.length == 0) {
            answerVect['message'] = 'ERROR: поля login,password должны быть заполнены.';
            return answerVect;
        }
        // отправить для анализа в БД
    };

}