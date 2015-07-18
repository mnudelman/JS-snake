/**
 * Created by michael on 06.07.15.
 */
function GameList() {
    var gameList = [] ;
    var currentId = -1 ;

    this.newGame = function(gameName) {
        currentId = gameList.length ;

        var newG = new GameSnake(currentId) ;
        gameList.push(newG) ;
        newG.create() ;
     //   focusManager() ;
    };
    this.getCurrentGame = function () {
        return gameList[currentId] ;
    };
    this.setCurrentId = function(gameId) {
        if (gameId >= 0 && gameId < gameList.length ) {
            currentId = gameId ;
        }
    };
    this.setCurrentByName = function(gameName) {
        var arr = gameName.split('_') ;
        currentId =  ( (arr[0] == 'game' ) ? arr[1] : -1 ) ;

        if (currentId >= 0) {
            focusManager() ;

            return gameList[currentId] ;
        }else {
            alert('ERROR:Имя игры неверно:'+gameName) ;
        }
    };
    var focusManager = function() {
        for (var i = 0; i < gameList.length ; i++ ){
            var game = gameList[i] ;
            game.setFocus((i == currentId) ) ;
        }
    };

}
