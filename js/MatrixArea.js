/**
 * Created by michael on 06.07.15.
 */

function MatrixArea(matrixId,rowNumber,colNumber)
{
    var CLASS_ACTIVE = 'matrixActiv' ;
    var CLASS_NO_ACTIVE = 'matrixNoActiv' ;
    var CELL_HEIGHT ;
    var CELL_WIDTH ;
   var matrixName = '' ;
    var docMatrixElem = false ;
    var cellList = [] ;
    var _this = this ;
    var commands ;         // командные клавиши
    var makeMatrixName = function() {
        var prefix = 'matrix_' ;
        return prefix+matrixId ;
    } ;
    this.getMatrixName = function() {
         return makeMatrixName() ;
    } ;
    this.create = function() {
        matrixName = makeMatrixName() ;
        var matrixAll = $('#matrixAll')[0];
        docMatrixElem = $('<div>').attr({'id' : matrixName, 'class' : 'matrix' })[0];
        $(matrixAll).append(docMatrixElem);

        var bodyId = makeBodyName() ;
        var docMatrixBody = $('<div>').attr({'id' : bodyId , 'class' : 'matrix'})[0];
        $(docMatrixElem).append(docMatrixBody);
        var w = colNumber * CELL_WIDTH - Math.floor(colNumber / 10 * 4);
        var h =  rowNumber * CELL_HEIGHT + Math.floor(rowNumber / 10 * 4);
        $(docMatrixBody).css({'width' : w , 'height' : h }) ;
        // ---------------------------------------------------
        addRows(docMatrixBody);
        $(docMatrixBody).append('<br>');

        $(docMatrixElem).append(commands);
    } ;
    this.getWidth = function() {
        return colNumber * CELL_WIDTH ;
    } ;
    var addRows = function(docMatrixBody) {

        for (var i = 0; i < rowNumber; i++ ) {
            var docRowElem = $('<div>').attr({'id' : matrixName+'-row_'+i ,'class' : 'row' })[0];
            $(docRowElem).css({'width' : colNumber * CELL_WIDTH ,'height': CELL_HEIGHT })
            $(docMatrixBody).append(docRowElem);
            addColumns(i,docRowElem) ;
        }
    } ;
    var addColumns = function(iRow,docRowElem) {
        for (var j = 0; j < colNumber ; j++) {
            var cell1 = new MatrixCell(matrixName,iRow,j) ;

            n = _this.getCellNum(iRow,j) ;
            cellList[n] = cell1 ;
            var docCellElem = cell1.create() ;
            $(docRowElem).append(docCellElem) ;
        }
    } ;
    this.setCellSize = function(height,width) {
         CELL_HEIGHT = height ;
         CELL_WIDTH  = width ;
    } ;
    this.setPoints = function(nPoints) {
        points = nPoints ;
    } ;
    this.setCommands = function(cmd) {
      commands = cmd ;
    };
    this.setTitle = function(t) {
        title = t ;
    }
    this.getCellList = function() {
        return cellList ;
    } ;
    this.getCellNum = function(iRow,jCol) {
        if (iRow < 0 || jCol < 0 || iRow >= rowNumber || jCol >= colNumber) {
            return false ;
        }
        return iRow  * colNumber + jCol ;
    } ;
    this.getCellByRowCol = function(iRow,jCol,freeFlag) {
        if (iRow < 0 || jCol < 0 || iRow >= rowNumber || jCol >= colNumber) {
            return false ;
        }
        var cell = cellList[iRow  * colNumber + jCol] ;
        if (freeFlag == undefined ) {
            return cell ;
        }else {
            if (cell.isFree() == freeFlag) {
                return cell;
            } else {
                return false;
            }
        }
    } ;
    this.matrixClear = function() {
        for (var i = 0; i < cellList.length ; i++) {
            cellList[i].clear() ;
        }
    } ;
    var makeBodyName = function() {
        return matrixName + '-body' ;
    } ;
    var makeTitle = function() {
        var h3 = $('<h3>').attr({'id' :matrixName+'-title'})[0] ;
        h3.textContent = 'GAME:' + matrixName+' ( '+rowNumber+' x '+colNumber+' )' ;
        h3.style.color="green" ;
        return h3 ;

    } ;
    this.setFocus = function(focusFlag) {
        var matrixBody = $('#'+makeBodyName())[0] ;
        matrixBody.className = (focusFlag) ? CLASS_ACTIVE : CLASS_NO_ACTIVE ;
    } ;
}
