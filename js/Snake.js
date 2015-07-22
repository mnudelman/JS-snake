/**
 * Created by michael on 08.07.15.
 */
function Snake() {
    var headSnakeCell ;
    var bodySnakeCells = [] ;
    var course ;
    var bodyMinLength = 2 ;
    var bodyMaxLength ;
    var headClass = {
        UP : 'headUp' ,
        DOWN : 'headDown',
        LEFT : 'headLeft' ,
        RIGHT: 'headRight'
    } ;
    var imageIndex = 0 ;
    var bodyClass = 'snakeBody'  ;
    var bodyFixedPart = 2 ; // две ячейки всегда
    var DELTA_SIZE = 3 ; // % уменьшения размера к хвосту
    var SIZE_MIN = 30 ;    // %
    _this = this ;

    this.create = function(hCell,bCells,crse) {
        bodyFixedPart = bCells.length ;   // первоначальная длина - фикс часть
        course = crse ;
        bodySnakeCells = [] ;
        var hClass = headClass[course] ;
        headSnakeCell = newSnakeElem(hCell,hClass) ;
        for (var i = 0 ; i < bCells.length ;i++) {
            bodySnakeCells[i] = newSnakeElem(bCells[i],bodyClass) ;
        }
    };


    this.setCourse = function(crs,newHeadCell) {
       course = crs ;
        var currentCell = headSnakeCell ;
        headSnakeCell = newSnakeElem(newHeadCell,headClass[course]) ;
        for (var i = 0 ; i < bodySnakeCells.length; i++) {
            var tmp = bodySnakeCells[i] ;
            bodySnakeCells[i] = currentCell ;
            bodySnakeCells[i].copyFromOther(tmp) ;
            bodySnakeCells[i].show() ;
            currentCell = tmp ;
        }
        currentCell.matrixCell.clear() ;
        // !! currentCell - это последний элемент - убрать
    } ;
    this.addTail = function(newCell,imgFile) {
       var n =  bodySnakeCells.length ;
       var size = 100 - (n+1 - bodyFixedPart) * DELTA_SIZE ;
       size = Math.max(SIZE_MIN,size) ;
       bodySnakeCells[n] = newSnakeElem(newCell,bodyClass,imgFile,size) ;
    } ;
    this.cutTail = function() {     // отрезать хвост
        var n = bodySnakeCells.length ;
        if (n > bodyFixedPart) {
            bodySnakeCells[n-1].matrixCell.clear() ;
            bodySnakeCells.pop()  ;
        }
    } ;
    this.getEndOfTail= function() {
        var n =  bodySnakeCells.length ;
        return bodySnakeCells[n-1].matrixCell ;
    } ;
    this.getHead = function() {
       return headSnakeCell.matrixCell ;
    } ;

    var newSnakeElem = function(matrCell,cssClass,pictFile,size) {
        var snakeEl = new snakeElem() ;
        snakeEl.matrixCell = matrCell ;
        snakeEl.cssClass = cssClass ;
        snakeEl.pictureFile = pictFile ;
        snakeEl.imageSize = size ;
        matrCell.setClass(cssClass,size) ;
        if (pictFile !== undefined) {
            matrCell.setImage(pictFile,size) ;
        }
        return snakeEl ;
    } ;

    function snakeElem() {
      this.matrixCell ;
      this.cssClass ;
      this.pictureFile ;
      this.imageSize ;
      var _this = this ;
      this.show = function() {
          _this.matrixCell.setClass(_this.cssClass,_this.imageSize) ;
          if (_this.pictureFile != undefined) {
              _this.matrixCell.setImage(_this.pictureFile,_this.imageSize) ;
          }

      } ;
      this.clear = function() {
          _this.matrixCell.clear() ;
      } ;
      this.copyFromOther = function(otherEl) {
          _this.cssClass = otherEl.cssClass ;
          _this.pictureFile = otherEl.pictureFile ;
          _this.imageSize = otherEl.imageSize ;
      }
    }
}