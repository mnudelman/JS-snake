<?php
$REQUEST_NAMELIST = 'nameList';
$REQUEST_STATISTIC = 'statistic';


function makeJSElem($index, $line)
{
    $line = trim($line);
    $arr = explode(';', $line);
    $line = '';
    $result = [];
    foreach ($arr as $elem) {
        $arr1 = explode(':', $elem);
        $key = $arr1[0];
        $value = $arr1[1];
        $result[$key] = $value;
    }
    return $result;
}

function makeNameList($handle,$nameValue)
{
    $result = [];
    while ($r = fgets($handle)) {
        $arr = explode(';',$r) ;
        $name = '' ;
        foreach ($arr as $key => $item) {
            $itemArr = explode(':',$item) ;
            $key1 = $itemArr[0] ;
            $value = $itemArr[1] ;
            if ($key1 == 'gamerName') {
                $name= $value ;
                break ;
            }
        }
        if (empty($name)) {
            continue ;
        }
        if (!empty($nameValue)) {
            if (false === stripos($name, $nameValue)) {
                continue;
            }
        }
        if (false === array_search($name, $result)) {
            $result[] = $name;
        }
    }
    return $result;
}



function makeStatistic($handle,$nameValue)
{
    $result = [];
    while ($r = fgets($handle)) {
        $arr = explode(';',$r) ;
        $currline = [] ;
        foreach ($arr as $key => $item) {
            $itemArr = explode(':',$item) ;
            $key1 = $itemArr[0] ;
            $value = $itemArr[1] ;
            $currline[$key1] = $value ;

        }
        $result[] = $currline ;
    }
    return $result;
}








$requestTyp = $_GET['typ'];
$nameValue = $_GET['name'];

//echo json_encode(['Jim','Jon','Jek']) ;
if (!($handle = fopen('results.txt', "r"))) {
    echo 'ERROR:fileOpen("results.txt")';
}else {
    switch ($requestTyp) {
        case $REQUEST_NAMELIST : {
            $jSonArr = makeNameList($handle, $nameValue);
            break ;
        }
        case $REQUEST_STATISTIC : {
            $jSonArr = makeStatistic($handle, $nameValue);
            break ;
        }
    }

    $jSon = json_encode($jSonArr);


    fclose($handle);
    echo $jSon;
}
