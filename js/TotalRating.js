/**
 * расчет обобщенной оцеки
 */
function TotalRating() {
    var baseValue = {
        BASE_TIME : 30 ,    // sec - время игры
        BASE_SIZE : 20,     // cells - размер игрового поля
        BASE_POINTS : 50 ,  // points - набранных очков
        BASE_TARGETS : 1,   // unit - целей на поле
        BASE_LIFETIME : 3 , // sec - время жизни цели
        BASE_RATING : 100
    } ;
    // -  текущие параметры
    var currentValue = {
        currentTime : paramSet.params['GAME_LIFETIME']/1000 ,
        currentTargetsNumber : paramSet.params['TARGET_NUMBER'] ,
        currentLifetime : paramSet.params['TARGET_LIFETIME'],
        currentSize : paramSet.params['ROWS_NUMBER'],
        currentPoints : +$('#points').val()
    } ;
    var rule = {
       baseRating : {exp: '100' ,subst:'',value: 0} ,
       kGameTime : {exp : 'BASE_TIME / currentTime', subst: '' , value: 0},
       kTargets : {exp : 'BASE_TARGETS / currentTargetsNumber', subst: '' , value: 0},
       kTargetLifetime : {exp : '1 + ( BASE_LIFETIME / currentLifetime ) *0.5', subst: '' , value: 0},
       kMatrixSize : {exp : '0.96 + 0.002 * currentSize', subst: '' , value: 0},
       kPoints : {exp : 'currentPoints / BASE_POINTS', subst: '' , value: 0}
    } ;
    var _this = this ;

   this.calculateTotal = function(currVal) {
       if (currVal == undefined) {
           currentValue['currentPoints'] = +$('#points').val() ;
           currVal = currentValue ;
       }

       substExe(currVal) ;
      var result = 1 ;
      for (key in rule) {
          result *= rule[key]['value'] ;
      }
      return result.toFixed(3) ;
   } ;
   this.getRule = function() {
      return rule ;
   } ;
   var substDo = function(sourceArr,substArr) {
       for (var key in substArr) {
           var i = sourceArr.indexOf(key) ;
           if (i >= 0 ) {
               sourceArr[i] = substArr[key] ;
           }
       }
       return sourceArr ;

   } ;
    var substExe = function(currentValue) {
       for (var ruleKey in rule) {
           var expArr = (rule[ruleKey]['exp']).split(' ') ;
           expArr = substDo(expArr,baseValue) ;
           expArr = substDo(expArr,currentValue) ;
           var expSubst = expArr.join(' ') ;
           rule[ruleKey]['subst'] = expSubst ;
           var value = eval(expSubst) ;
           rule[ruleKey]['value'] = value ;
       }


   }
}