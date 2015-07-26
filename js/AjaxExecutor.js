/**
 * Created by michael on 13.07.15.
 */
function AjaxExecutor(ajaxUrl) {
   var requestData = false ;                 // результат запроса
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
            ajaxUrl + '/index.php',
            sendObj,
            function(data,textStatus) {
                requestData  = data ;
            },
            "text"
        ).error(errorDefault);
    } ;
    this.getData = function(sendData) {
       ajaxComplete = false ;
       $.getJSON(ajaxUrl+'/index.php',
           sendData,
            function(data) {
                requestData  = data ;
            }
        ).error(errorDefault)
         .complete(completeDefault);

    } ;
    this.getRequestResult = function() {
        if (ajaxComplete) {
            return requestData;
        }else {
            return false ;
        }
    }
}
