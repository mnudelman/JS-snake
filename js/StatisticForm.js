/**
 * Created by michael on 14.07.15.
 */
function StatisticForm() {
    var sourceData ;
    var STAT_NUMBER = paramSet.STATISTIC_NUMBER ; // кол-во выводимых строк
    var parentDocElemId ;
    var _this = this ;
    var sortField = '' ;
    var currentSort = 0 ;
    var SYMB_INCR = String.fromCharCode(8657) ;
    var SYMB_DECR = String.fromCharCode(8659) ;
    var sourceIndex = [];
    var caption = {
        gameId : {id : "statTable-gameId",sort : 0,sortDefault : -1},
        gamerName : {id : "statTable-gamerName",sort : 0,sortDefault : +1},
        points : {id : "statTable-points",sort : 0,sortDefault : -1}
    } ;
    var filter = {
        records : paramSet.STATISTIC_NUMBER,
        name : '' ,
        pointsMin : 0
    } ;
    this.init = function(data) {
        sourceData = data ;
        var i =0 ;
        for (var key in sourceData) {
            sourceIndex[i++] = key ;
        }
        makeCurrentFilter() ;
        makeTable() ;
    } ;
    var makeCurrentFilter = function() { // собирает фильтр из панели   setup
        var curRecords = $('#stat-recordsFilter').val() ;
        var curName = $('#stat-nameFilter').val() ;
        var curPoints = $('#stat-pointsFilter').val() ;
        if (+curRecords > 0) {
            filter['records'] = +curRecords ;
        }
        if (curName.length > 0) {
            filter['name'] = curName ;
        }
        if (+curPoints > 0) {
            filter['pointsMin'] = +curPoints ;
        }

    } ;
    var tableTeg = function() {
       return '<table id="statisticTable"></table>';
    } ;

    var makeTable = function() {
        var tg = tableTeg() ;
        var statElDoc = $('#statistic')  ;
        statElDoc.empty().append(tg);
        var statTab = $('#statisticTable') ;
        statTab.append(makeCaption()) ;
        var tabBody = '' ;
        var iMax = Math.min(sourceIndex.length,filter['records']) ;
        var k = 0 ;
        for (var i = 0; i < sourceIndex.length ; i++) {
            var key = sourceIndex[i] ;
            if (isFilter(sourceData[key]) ){
                if (k++ > iMax) {
                    break ;
                }
                var rw = makeRow(key,sourceData[key]) ;
                tabBody += rw ;
            }


        }
        statTab.append(tabBody) ;
        setOnClickCaption() ;
    } ;
    var isFilter = function(row) {
        var rowName = row['gamerName'] ;
        var rowPoints = +row['points'] ;
        var flag = true ;
        if (filter['name'].length > 0) {
            flag  = (flag && rowName.indexOf(filter['name']) >= 0 ) ;
        }
        if (+filter['pointsMin'] > 0) {
            flag  = (flag && +rowPoints >= +filter['pointsMin'] ) ;
        }
        return flag ;
    } ;
    var makeCaption = function() {
        var capt = '' ;
        for(key in caption) {
            capt += '<th id="statTable-'+key+'">'+captionName(key)+'</th>' ;

        }
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
        rowDoc += '</tr>' ;
        return rowDoc ;
    } ;
    setOnClickCaption = function() {
        var captIdList = ['statTable-gameId','statTable-gamerName','statTable-points'] ;
        for (var i = 0; i < captIdList.length ; i++) {
            var captID = captIdList[i] ;
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
        }
        return ((id1 > id2) ? sgn :( (id1 < id2) ? -sgn: 0 )  ) ;
    } ;
}