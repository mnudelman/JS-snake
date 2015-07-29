/**
 * Created by michael on 14.07.15.
 */
function StatisticForm(infoForm) {
    var sourceData ;
    var ajaxExecute = paramSet.ajaxExecute ;
    var calculateForm ;
    var _this = this ;
    var sortField = '' ;
    var currentSort = 0 ;
    var SYMB_INCR = String.fromCharCode(8657) ;
    var SYMB_DECR = String.fromCharCode(8659) ;
    var sourceIndex = [];
    var captIdList =
        ['statTable-gameId','statTable-gamerName','statTable-points','statTable-total'] ;
    var caption = {
        gameId : {id : "statTable-gameId",sort : 0,sortDefault : -1},
        gamerName : {id : "statTable-gamerName",sort : 0,sortDefault : +1},
        points : {id : "statTable-points",sort : 0,sortDefault : -1},
        total : {id : "statTable-total",sort : 0,sortDefault : -1}
    } ;
    var filter = {
        typ: 'statistic' ,
        records : paramSet.STATISTIC_NUMBER,
        name : '' ,
        points : 0,
        total : 0
    } ;
    this.setFilter = function(filterKey,value) {
       filter[filterKey] = value ;
    } ;
    this.init = function() {
        calculateForm = infoForm.calculateForm ;
        sortField = 'gameId' ;
        var sort  = caption[sortField]['sort'] ;
        currentSort = (sort == 0) ? caption[sortField]['sortDefault'] : -1 * sort ;
        caption[sortField]['sort'] = currentSort ;
        getDataFromDb() ;
    } ;
    var getDataFromDb = function() {
        ajaxExecute.getData(filter);
        var tmpTimer = setInterval(function () {
            var data = ajaxExecute.getRequestResult();
            if (false !== data) {
                clearInterval(tmpTimer);
                sourceData = data ;
                sourceIndex = [] ;
                var i =0 ;
                for (var key in sourceData) {
                    sourceIndex[i++] = key ;
                }
                currentSort = 0 ;
                makeTable() ;
            }
        }, 300)
    } ;
    var tableTeg = function() {
       return '<table id="statisticTable"></table>';
    } ;

    var makeTable = function() {
        var tg = tableTeg();
        var statElDoc = $('#statistic');
        statElDoc.empty().append(tg);
        var statTab = $('#statisticTable');
        statTab.append(makeCaption());
        var tabBody = '';
        for (var i = 0; i < sourceIndex.length; i++) {
            var key = sourceIndex[i];
            tabBody += makeRow(key, sourceData[key]);
        }
        statTab.append(tabBody);
        setOnClickCaption();
        onClickCalculation();
    }
    var makeCaption = function() {
        var capt = '' ;
        for(key in caption) {
            capt += '<th id="statTable-'+key+'">'+captionName(key)+'</th>' ;

        }
        capt += '<th>&nbsp;</th>' ;
        return capt ;
    } ;
    var captionName = function(captKey) {
        var sortSymb = '' ;
        if (captKey == sortField ) {
            sortSymb = (currentSort == +1) ? SYMB_INCR : SYMB_DECR ;

        }
        return (sortSymb+' '+captKey).trim() ;
    } ;
    var makeRow = function(ind,row) {
       var rowDoc = '<tr>' ;
        for (var key in row) {
            rowDoc += '<td>'+row[key]+'</td>' ;
       }
        var id = row['gameId'] ;
        rowDoc += '<td id="td-'+id+'" title="calculation" ><span class="ui-icon ui-icon-triangle-1-e" ></span></td>' ;

        rowDoc += '</tr>' ;
        return rowDoc ;
    } ;
    var onClickCalculation = function() {
        for (var i = 0; i < sourceIndex.length ; i++) {
            var key = sourceIndex[i] ;
            var gameId = sourceData[key]['gameId']  ;

            $('#td-'+gameId).off().on('click', function (ev) {
                calculateForm.calculateExec(this.id) ;
            });
        }
    } ;
    var setOnClickCaption = function() {
        for (var i = 0; i < captIdList.length ; i++) {
            var captID = captIdList[i] ;
            $('#' + captID).off() ;
            $('#' + captID).on('click', function (ev) {
                _this.onClickCaption(this.id);
            });
        }
    } ;
    this.onClickCaption = function(captId) {
        sortField = captId.split('-')[1] ;
        var sort  = caption[sortField]['sort'] ;
        currentSort = (sort == 0) ? caption[sortField]['sortDefault'] : -1 * sort ;
        caption[sortField]['sort'] = currentSort ;
        makeSort() ;
        makeTable() ;
    };

    var makeSort = function() {
        sourceIndex.sort(fieldCompare) ;
    } ;
    var fieldCompare = function(key1,key2) {
        var el1 = sourceData[key1] ;
        var el2 = sourceData[key2] ;
        var sgn = currentSort ;
        switch (sortField) {
            case 'gameId' : {
                var id1  = +el1['gameId'] ;
                var id2 =  +el2['gameId'] ;


                break ;
            }
            case 'gamerName' : {
                var id1  = el1['gamerName'] ;
                var id2 =  el2['gamerName'] ;

                break ;
            }
            case 'points' : {
                var id1  = +el1['points'] ;
                var id2 =  +el2['points'] ;

                break ;

            }
            case 'total' : {
                var id1  = +el1['total'] ;
                var id2 =  +el2['total'] ;
                break ;
            }

        }
        return ((id1 > id2) ? sgn :( (id1 < id2) ? -sgn: 0 )  ) ;
    } ;
}