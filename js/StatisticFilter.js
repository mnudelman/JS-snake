/**
 * Параметры вывода ститистики
 */
function StatisticFilter(infoObj) {
    var statisticForm = infoObj.statisticForm ;  // объект вывода статистики
    var ajaxExecute = paramSet.ajaxExecute ;
   this.init = function() {
       $('#stat-recordsFilter').spinner({
           min: 10,
           max: 100,
           step: 10,
           numberFormat: 'n',
           change: function (event, ui) {
                statisticForm.setFilter('records',+$(event.target).val()) ;
           }
       });

       $('#stat-pointsFilter').spinner({
           min: 10,
           max: 100,
           step: 10,
           numberFormat: 'n',
           change: function (event, ui) {
               statisticForm.setFilter('points',+$(event.target).val()) ;
           }
       });
       $('#stat-totalFilter').spinner({
           min: 0,
           max: 500,
           step: 50,
           numberFormat: 'n',
           change: function (event, ui) {
               statisticForm.setFilter('total',+$(event.target).val()) ;
           }
       });

       $("#stat-nameFilter").autocomplete({
           source: function (request, response) {
               var nameFilter = {typ: 'nameList', name: request.term};
               statisticForm.setFilter('name',request.term) ;
               ajaxExecute.getData(nameFilter);
               var tmpTimer = setInterval(function () {
                   var nameList = ajaxExecute.getRequestResult();
                   if (false !== nameList) {
                       clearInterval(tmpTimer);
                       response(nameList);

                   }
               }, 300)
           },
           minLength: 0
       });

       $('#stat-gameStatistic-bt').click(function(){
           statisticForm.setFilter('name',$("#stat-nameFilter").val()) ;
           statisticForm.init() ;
       }) ;


   } ;








}