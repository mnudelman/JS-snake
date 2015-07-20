/**
 * Created by michael on 13.07.15.
 */
function AjaxExecutor(ajaxUrl) {
   var statisticData ;
   var ajaxComplete = false ;


    var successDefault = function(data,textStatus) {
        alert('gameSave:status-'+textStatus+' ; hostAnswer:'+data) ;
   } ;
    var errorDefault = function(event, XMLHttpRequest, ajaxOptions, thrownError) {
        var responseText = event.responseText ; // html - page
        var answ  = alert('ERROR: code :'+event.status +' (' + event.statusText+')') ;
    } ;
    var completeDefault = function() {
        ajaxComplete = true ;
    } ;
    this.sendResult = function(sendObj) {
        $.post(
            ajaxUrl + '/add.php',
            sendObj,
            successDefault,
            "text"
        ).error(errorDefault);
    } ;
    this.getStatistic = function(sendData) {
       ajaxComplete = false ;
       $.getJSON(ajaxUrl+'/get.php',
            {key:"000"},
            function(data) {
                var items = [];
          //      alert(data);
                statisticData  = data ;
            }
        ).error(errorDefault)
         .complete(completeDefault);

    } ;
    this.getStatData = function() {
        if (ajaxComplete) {
            return statisticData;
        }else {
            return false ;
        }
    }
}
