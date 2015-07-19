/**
 * Created by michael on 09.07.15.
 */
function Target(targetNumber) {
    var images = [
        'star038.png',
        'star039.png',
        'star041.png',
        'star054.png',
        'star056.png',
        'star057.png',
        'star058.png',
        'star059.png',
        'star066.png',
        'star067.png',
        'star068.png',
        'star069.png'
    ] ;
    var DIR_IMAGES = paramSet.dirImages ;
    var CLASS_DEFAULT = 'target' ;
    var imageIndex = -1 ;
    var targetList = [] ;
    var currentId = 0 ;
    this.newTarget = function(cell) {
        var tg = new tag() ;
        tg.cell = cell ;
        tg.Id = currentId++ ;
        var n = targetList.length ;
        tg.cell.setClass(CLASS_DEFAULT) ;
        imageIndex++ ;
        imageIndex = (imageIndex >= images.length) ? 0 : imageIndex ;
        var imgFile = DIR_IMAGES + '/'+images[imageIndex] ;
        tg.imgFile = imgFile ;
        tg.cell.setImage(imgFile) ;
        tg.birthTime = (new Date()).getTime() ;
        tg.lifetime = paramSet.params['TARGET_LIFETIME'] ;
        targetList[n] = tg ;
    } ;
    //this.setImageDir = function(imgDir) {
    //    DIR_IMAGES = imgDir ;
    //} ;
    this.setTarget = function(cell) {    // проверка захвата цели
        for (var i = 0 ; i < targetList.length; i++ ) {
            if (cell == targetList[i].cell) {
                currentId = i ;
                return currentId ;
            }
        }
        return false ;
    } ;
    this.getPoints = function() {
       return targetList[currentId].points ;
    } ;
    this.getImgFile = function() {
        return targetList[currentId].imgFile ;
    } ;
    this.delTarget = function() {
        var newL =  targetList ;
        targetList = [] ;
        var j = 0 ;
        for (var i = 0; i < newL.length ; i++) {
            if (i == currentId) {
                continue ;
            }
            targetList[j++] = newL[i] ;
        }
        newL[currentId].cell.clear() ;
    } ;
    this.exceededLifetime = function()  {    // превышено время жизни
        var newL =  targetList ;
        targetList = [] ;
        var j = 0 ;
        var n = 0 ;
        for (var i =0 ; i < newL.length; i++) {
            var tg = newL[i] ;
            if (tg.timeOver()) {
                newL[i].cell.clear() ;
                n++ ;
                continue ;
            }
            targetList[j++] = newL[i] ;
        }
        return n ;

    } ;
    function tag() {
        this.Id ;
        this.cell ;
        this.points = 10 ;
        this.lifetime = 10 ;
        this.birthTiime ;
        this.imgFile ;
        _this = this ;
        this.timeOver = function() {
            var tm = (new Date()).getTime() ;
            return ( _this.birthTime + _this.lifetime*1000 < tm) ;
        }
    }
}