/**
 * Created by michael on 18.07.15.
 */
function setJQueryUi() {
    $('#tabs').tabs() ;
    sliderGameSetup('gameTime',30,30,300,30,'sec') ;
    sliderGameSetup('matrixSize',20,10,40,5,'cells') ;
    sliderGameSetup('cellSize',20,10,40,5,'px') ;
    sliderGameSetup('maxSpeed',10,10,20,2,'steps/sec') ;
    sliderGameSetup('targetsNumber',1,1,5,1,'cells') ;
    sliderGameSetup('targetLifetime',30,3,30,3,'sec') ;
}
function sliderGameSetup(elemName,val,minVal,maxVal,step,unitName) {
    $('#slider-'+elemName).slider({
        value: val ,
        min: minVal,
        max: maxVal,
        step:step,
        slide:function(event,ui) {
            $('#game-'+elemName).val(ui.value+' '+unitName) ;
        }
    }) ;
    $( '#game-'+elemName).val( $('#slider-'+elemName).slider( "value" )+' '+unitName );
}