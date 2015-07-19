/**
 * Created by michael on 18.07.15.
 */
function setJQueryUi(nameList) {
    $('#tabs').tabs() ;
    sliderGameSetup('gameTime',30,30,300,30,'sec') ;
    sliderGameSetup('matrixSize',20,10,40,5,'cells') ;
    sliderGameSetup('cellSize',20,10,40,5,'px') ;
    sliderGameSetup('maxSpeed',10,10,20,2,'steps/sec') ;
    sliderGameSetup('targetsNumber',1,1,5,1,'units') ;
    sliderGameSetup('targetLifetime',30,3,30,3,'sec') ;


    $('#stat-recordsFilter').spinner({
        min:10,
        max:100,
        step:10,
        numberFormat:'n' ,
        change: function(event,ui) {

        }
    }) ;

    $('#stat-pointsFilter').spinner({
        min:10,
        max:100,
        step:10,
        numberFormat:'n' ,
        change: function(event,ui) {

        }
    }) ;

 $( "#stat-nameFilter" ).autocomplete({source: nameList});


}
function sliderGameSetup(elemName,val,minVal,maxVal,step,unitName) {
    $('#slider-'+elemName).slider({
        value: val ,
        min: minVal,
        max: maxVal,
        step:step,
        slide:function(event,ui) {
            $('#game-'+elemName).val(ui.value+' '+unitName) ;
            setupUpdate(elemName,ui.value) ;
        }
    }) ;
    $( '#game-'+elemName).val( $('#slider-'+elemName).slider( "value" )+' '+unitName );
}

function setupUpdate(parName,parValue) {
    switch (parName) {
        case 'gameTime' : {
          paramSet.params['GAME_LIFETIME'] = parValue*1000 ;
            $('#totalTime').attr('value',parValue+' sec') ;
            break ;
        }
        case 'matrixSize' : {
            paramSet.params['ROWS_NUMBER'] = parValue ;
            paramSet.params['COLS_NUMBER'] = parValue ;
            break ;
        }
        case 'cellSize' : {
            paramSet.CELL_WIDTH = parValue ;
            paramSet.CELL_HEIGHT = parValue ;
            break ;

        }
        case 'maxSpeed' : {
             var delay = 1000/parValue ;
            paramSet.params['SNAKE_MOVE_DELAY_MIN'] = delay ;
            $('#maxSpeed').attr('value',parValue+'steps/sec') ;
            break ;
        }
        case 'targetsNumber' : {
            paramSet.params['TARGET_NUMBER'] = parValue ;
            break ;

        }
        case 'targetLifetime' : {
            paramSet.params['TARGET_LIFETIME'] = parValue  ;
            break ;

        }
    }


}