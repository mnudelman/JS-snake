/**
 * расчет обобщенной оцеки
 */
function totalRating() {
    var BASE_TIME = 30; // sec - время игры
    var BASE_SIZE = 20; // cells - размер игрового поля
    var BASE_POINTS = 50 ; // points - набранных очков
    var BASE_TARGETS = 1 ; // unit - целей на поле
    var BASE_LIFETIME = 3 ; // sec - время жизни цели
    var BASE_RATING = 100 ;
    // -  текущие параметры
    var currentTime = paramSet.params['GAME_LIFETIME']/1000 ;
    var currentTargetNumber = paramSet.params['TARGET_NUMBER'] ;
    var currentLifetime = paramSet.params['TARGET_LIFETIME'] ;
    var currentSize = paramSet.params['ROWS_NUMBER'] ;
    var currentPoints = +$('#points').val() ;

    var totalRating = BASE_RATING *
        (BASE_TIME / currentTime) *
        (BASE_TARGETS / currentTargetNumber) *
        (1 + BASE_LIFETIME / currentLifetime) *
        (0.96 + 0.002 * currentSize) *
        (currentPoints / BASE_POINTS) ;
    totalRating = totalRating.toFixed(3) ;
    $('#totalRating').val(totalRating)  ;
    return totalRating ;
}