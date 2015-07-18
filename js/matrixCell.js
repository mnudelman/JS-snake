/**
 * Created by michael on 06.07.15.
 */
function MatrixCell(matrixName,iRow,jCol) {
    var CLASS_DEFAULT = 'cellDefault';
    var IMAGE_DEFAULT = 'images/stock_weather-fog.png' ;
    var docElem;
    var cellName = '';
    var free = true;
    var _this = this ;

    var makeCellName = function (matrixName, row, col) {
        return matrixName + '-' + 'r_' + row + '-c_' + col;
    };
    this.create = function () {
        cellName = makeCellName(matrixName, iRow, jCol);
        docElem = '<div id="' + cellName + '" class="' + CLASS_DEFAULT + '" >';
        return docElem;
    };
    this.clear = function () {
        var el = $('#' + cellName)[0] ;
        el.className = CLASS_DEFAULT;
        $(el).css({'background-image':'','background-size' : '100%'}) ;
        free = true;
    };

    this.setClass = function (classN,imgSize) {
        $('#' + cellName)[0].className = classN;
        free = false;
        if (imgSize != undefined) {
            _this.setImageSize(imgSize) ;
        }
    };
    this.setImage = function(imgFile,imgSize) {
        imgSize = (imgSize == undefined) ? '100%' : imgSize+'%' ;
        var url = 'url(' + imgFile + ')' ;
        var el = $('#' + cellName)[0] ;
        $(el).css({'background-image': url,'background-size': imgSize  }) ;

    } ;
    this.setImageSize = function(imgSize) {
        var el = $('#' + cellName)[0] ;
        $(el).css('background-size',imgSize+'%' ) ;
    } ;
    this.isFree = function () {
        return free;
    };

    this.getRowCol = function () {
        return [iRow, jCol];
    };

    this.showCell = function (rowCourse, colCourse) {
        docElem.className = getCssClass(rowCourse, colCourse);
    };

    var getCssClass = function (rowCourse, colCourse) {
        if (rowCourse != 0) {
            return ( (rowCourse > 0 ) ? CLASS_DOWN : CLASS_UP);
        }
        if (colCourse != 0) {
            return ( (colCourse > 0 ) ? CLASS_RIGHT : CLASS_LEFT );
        }
    };
}
