/**
 * Created by michael on 11.07.15.
 */
function Timer() {
    this.id = -1 ;
    this.delay = 1000 ;
    this.timeStart = 0 ;
    this.lifetime =10000 ;
    var _this = this ;
    this.start = function() {
        _this.timeStart = (new Date()).getTime() ;
    } ;
    this.isTimeOver= function() {
        var currentTime = (new Date()).getTime() ;
        return (_this.timeStart + _this.lifetime < currentTime) ;
    } ;
    this.stop = function() {
        if (_this.id >= 0) {
            clearInterval(_this.id);
        }
        _this.id = -1 ;
    }
}