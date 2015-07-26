//
// Создание матрицы.
//

//var gameList  ;
var paramSet ;

$(document).ready(function(){
    $('#tabs').hide();
    paramSet = new GameParamSet();
    paramSet.init() ;
    game = new GameSnake(0) ;
    game.create() ;
    //newG.create() ;
    //gameList  =new GameList() ;
    //gameList.newGame('GameSnake') ;
    //$(document).on('keyup',function(event){
    //    var keyCode = event.keyCode ;
    //    var altFlag = event.altKey ;
    //    var ctrlFlag = event.ctrlKey ;
    //    var game = gameList.getCurrentGame() ;
    //    game.onKeyPressed(keyCode,altFlag,ctrlFlag) ;
    //})
} ) ;

