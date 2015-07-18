<?php
function makeJSElem($index,$line) {
    $line = trim($line) ;
    $arr = explode(';',$line) ;
    $line = '' ;
    foreach ($arr as $elem) {
        $arr1 = explode(':',$elem) ;
        $key = $arr1[0] ;
        $value = $arr1[1] ;
        $line = $line.((empty($line)) ? '' : ',').
            '"'.$key.'":"'.$value.'"' ;
    }
    return '"'.$index.'" : { '.$line.' }' ;
}


if ($handle = fopen('results.txt',"r") ) {
    $n= 0 ;
    $jSon = '' ;
    while($r = fgets($handle)) {
        $jSon = $jSon.((empty($jSon)) ? '': ',').makeJSElem($n++,$r) ;
    }
    fclose($handle) ;
    echo '{'.$jSon.'}' ;
  //  echo '{ "line_0" : { "gameId":"1436789099602","gamerName":"Ivan","points":"20" } }' ;
}else {
    echo 'ERROR:fileOpen("results.txt")' ;
}
