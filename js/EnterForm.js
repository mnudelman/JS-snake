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
        guest: true,
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
            ],
            beforeClose: function(event,ui) {
                var name = authorizationVect['login'] ;
                if (name.length == 0 ) {
                    authorizationVect['login']  = 'noName';
                    authorizationVect['guest'] = true ;
                    paramSet.setUser(authorizationVect);
                    infoForm.setGamerName(authorizationVect['login']);
                }
            }
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
        var ready = false ;
        if (userTyp == USER_TYP_GUEST) {
            var name = authorizationVect['login'] ;
            name = (name.length == 0 ) ? 'noName' : name ;
            authorizationVect['login']  = name;
            paramSet.setUser(authorizationVect);
            infoForm.setGamerName(authorizationVect['login']);
        }else {
            var log = authorizationVect['login'] ;
            var passw = authorizationVect['password'] ;
            if (log.length == 0 || passw.length == 0) {
                $messageText.empty();
                $messageText.append('ERROR:поля login,password должны быть заполнены!');
                return ;
            }
            ajaxExecute.getData(authorizationVect,true);
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
                        infoForm.setGamerName(authorizationVect['login'] );
                        message = answ['message'];
                        ready = false;
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
            $('#enterDialog').dialog("close");
        }
    }
}

