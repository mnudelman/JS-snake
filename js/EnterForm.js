/**
 *  форма входа (авторизации)
 */

function EnterForm(infoForm) {
    var dbData = infoForm.dbData;    // обращение к БД
    var ajaxExecute = paramSet.ajaxExecute ;
    // --- объекты jQuery ввода пароля
    var $loginElem = $('#login');
    var $passwordElem = $('#password');
    var $messageText = $('#messageText');

    var USER_TYP_GUEST = 'guest';
    var USER_TYP_USER = 'user';
    var _this = this;

    // атрибуты авторизации
    var authorizationVect = {
        typ: 'userLogin' ,
        login: '',
        password: '',
        newName: false,
        guest: false,
        successful: false
    };
    // открыть
    // ---------------------
    this.init = function () {
        $('#enterDialog').dialog({
            title: 'game "Snake"',
            width: 500,
            modal: true,
            buttons: [
                {
                    text: "guest",
                    click: function () {
                        EnterFormClick(false, true, USER_TYP_GUEST);
                    }
                },
                {
                    text: "enter",
                    click: function () {
                        EnterFormClick(false, false, USER_TYP_USER);
                    }
                },
                {
                    text: "new name",
                    click: function () {
                        EnterFormClick(true, false, USER_TYP_USER);
                    }
                }
            ]
        });

        $("#login").autocomplete({
            source: function(request,response) {
                var nameFilter = {typ: 'nameList', name : request.term} ;
                ajaxExecute.getData(nameFilter);
                var tmpTimer = setInterval(function () {
                    var nameList = ajaxExecute.getRequestResult();
                    if (false !== nameList) {
                        clearInterval(tmpTimer);
                       response(nameList) ;

                    }
                }, 300);
            } ,
            minLength : 0
        });
    };

    var EnterFormClick = function (newNameFlag, guestFlag, userTyp) {
        authorizationVect['newName'] = newNameFlag;
        authorizationVect['guest'] = guestFlag;
        authorizationVect['login'] = $loginElem.val();
        authorizationVect['password'] = $passwordElem.val();
        var message = '' ;
        var ready = true ;
        if (userTyp == USER_TYP_GUEST) {
            paramSet.setUser(authorizationVect);
            infoForm.setGamerName(authorizationVect['login'] + ' - ' + userTyp);
        }else {
            ajaxExecute.getData(authorizationVect);
            var tmpTimer = setInterval(function () {
                var answ = ajaxExecute.getRequestResult();
                if (false == answ || undefined == answ) {
                    message = 'ERROR:Нет ответа от БД' ;
                    ready = false ;
                }else {
                    clearInterval(tmpTimer);
                    if (answ['successful'] == true) {
                        authorizationVect['successful'] = true;
                        paramSet.setUser(authorizationVect);
                        infoForm.setGamerName(authorizationVect['login'] + ' - ' + userTyp);
                        message = answ['message'];
                    } else {
                        ready = false;
                        message = answ['message'];
                    }
                }
                $messageText.empty();
                $messageText.append(message);

            }, 300);
        }
        if (ready) {
  //          $('#enterDialog').dialog("close");
        }
    }
}

