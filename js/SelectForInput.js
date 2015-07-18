/**
 * Created by michael on 15.07.15.
 */
function SelectForInput() {
    var generalList = ['pit','jon','michel','ivan'] ;    // отсортированный список
    var currentValue ;
    var jQueryBlockElem ;
    var jQueryInputElem ;
    var jQuerySelect ;
    var jQueryInputId ;
    var indexValue ;  // max index, при котором generalList[i].indexOf(value) == 0
    var jQuerySelectActiv = false ;
    var jQueryInputActiv = false ;
    var _this = this ;
    this.setGeneralList = function(list) {
        generalList = list ;
    } ;
    this.setJQueryElem = function(elemId) {
        jQueryBlockElem = $('#' + elemId);
        jQueryInputElem = jQueryBlockElem.find('input');
        jQueryInputId = jQueryInputElem.attr('id');
        var jInputSelect = $('inputSelect-name');

        jQueryInputElem.focus(function () {
            jQueryInputActiv = true;
        });
        jQueryInputElem.blur(function () {
            jQueryInputActiv = false;
        });
        jQueryInputElem.keyup(
            function(event) {
                var key = event.keyCode;
                onNewValue(this.value) ;
            }) ;
        _this.inputGo() ;
    } ;
    this.inputGo  = function() {
        // выключить
        jQueryBlockElem.unbind('focusin') ;

        jQueryInputElem.focus() ;
        var timer = setInterval(
            function(){
            if ( !(jQueryInputActiv || jQuerySelectActiv) ) {
                clearInterval(timer) ;
                jQuerySelect.empty() ;
                jQuerySelect.hide() ;
                jQueryBlockElem.focusin(function(){ // включить на выходе
                    _this.inputGo() ;
                }) ;
            }
        },300) ;
        makeSelect() ;
    } ;
     var onNewValue = function(value) {
       if (value == currentValue) {
     //      return true ;
       }
         jQuerySelect.show() ;
       currentValue = value ;
        indexValue = -1 ;
        for (var i = 0 ; i < generalList.length; i++){
            var id = makeOptionId(i) ;

            if (generalList[i].indexOf(currentValue) !== 0) {
                $('#'+id).hide() ;
              continue ;
           }
           indexValue = i ;
           $('#'+id).show() ;

       }
    } ;
    var makeSelectId = function() {
        return jQueryInputId+'-select' ;
    } ;
    var makeOptionId = function(i) {
        return jQueryInputId + '-option-'+i ;
    } ;
    var makeSelect = function() {
        var selectId = makeSelectId() ;
        if (jQuerySelect == undefined ) {
            var tagSelect =
                '<select name="inputSelect" id="' + selectId + '" ' +
                ' class="inputSelect" size="5"></select>';
            jQueryBlockElem.append(tagSelect);
            jQuerySelect = $('#' + selectId);
            jQuerySelect.focus(function () {
                jQuerySelectActiv = true;
            });
            jQuerySelect.blur(function () {
                jQuerySelectActiv = false;
            });

            jQuerySelect.dblclick(function(eventObject){
                // проверить значение
                var value = $(this.selectedOptions).attr('value') ;
                setValueFromSelect(value) ;
            }) ;
            jQuerySelect.keyup(function(eventObject){
                if (eventObject.keyCode== 32 || eventObject.keyCode == 13) {
                    var value = $(this.selectedOptions).attr('value') ;
                    setValueFromSelect(value) ;
                }else {
                    jQueryInputElem.val(jQuerySelect.val()) ;
                }
            }) ;
            jQuerySelect.click(function(eventObject){
                jQueryInputElem.val(jQuerySelect.val()) ;
            }) ;
            jQuerySelect.hide();
        }
        var options = '' ;
        for (var i = 0 ; i < generalList.length; i++) {
            options += '<option value="'+generalList[i]+'"' +
            ' id="'+makeOptionId(i) +'"  >'+generalList[i]+'</option>' ;
        }
        jQuerySelect.append(options) ;


     } ;
    var setValueFromSelect = function(value) {
        jQueryInputElem.val(value) ;
        jQuerySelect.hide() ;
        jQueryInputElem.focus() ;

    } ;
    this.inputClose = function() {
        jQueryInputActiv = false ;
        alert('isFucus:'+jQuerySelectActiv) ;

        //jQuerySelect.empty() ;
        //jQuerySelect.hide() ;
    }
}
