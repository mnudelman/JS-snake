/**
 *  Клавиши управления игрой
 */
function Commands(gameName) {
    var buttons ;
    var _this = this ;
   //----------------------------------------//
    this.init = function(buttonSet) {
        buttons = buttonSet ;
        var commands = $('<div>').attr({'id' :makeCommandsName() , 'class' :'commands'})[0];
        for (var key in buttons) {
            var btName = buttons[key]['name'] ;
            var btKey = buttons[key]['key'] ;

            var bt = createButton(btName,btKey) ;
            $(commands).append(bt) ;
        }
        return commands ;
    } ;
    this.onClickBt = function(game) {
        for (var key in buttons) {
            var btId = makeBtId(buttons[key]['name']);
            $('#' + btId).on('click', function (ev) {
                game.onClickCommands(this.id) ;
            });
        }
    } ;
    var createButton = function(btName,btKey) {
        var name = btName ;
        if (btKey) {
            name = name +'<br>(<strong>'+btKey+'</strong>)' ;
        }
        return  '<button '+' id="'+makeBtId(btName)+'" class="bt '+ btName +'" >'+
                       name + '</buttton>' ;

    } ;
    var makeBtId = function(btName) {
        return gameName + '-' + btName ;
    } ;
    var makeCommandsName = function() {
        return gameName + '-commands' ;
    } ;

    this.getGameState = function(btName) {
        return btName ;
    } ;
    var btActiv = function(activFlag,btName,btNewName) {
        var bt = $('#'+makeBtId(btName))[0] ;
        bt.disabled = !activFlag ;

        if (btNewName) {
            bt.textContent = (bt.textContent == btNewName) ? btName : btNewName ;
        }else {
            bt.textContent =  btName  ;
        }

    } ;
    this.setHide = function(statName) {
        for (var key in buttons) {
            var btName = buttons[key]['name'] ;
            var btId = makeBtId(btName) ;

            var btHide= buttons[key]['hide'] ;
            if (btHide == undefined) {
                var hide = false ;
            }else {
                var hide = btHide.indexOf(statName) >= 0 ;
            }
            if (hide){
               $('#'+btId).hide() ;
            }else {
                $('#'+btId).show() ;
            }
        }
    } ;

}
