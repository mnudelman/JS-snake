/**
 * Created by michael on 17.07.15.
 */
function GameEvent() {
    this.onKeyAct = function(objId,game) {
        $('#'+objId).keyup(function(event){
            game.onKeyPressed(event.keyCode,
                              event.altKey,
                              event.ctrlKey) ;
        }) ;
    } ;
    this.onKeyDeAct = function(objId) {
        $('#'+objId).unbind('keyup') ;
    } ;
}