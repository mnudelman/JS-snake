<?php
$name = $_POST['name'];
$score = $_POST['score'];

$gameId = $_POST['gameId'] ;
$gamerName = $_POST['gamerName'] ;
$points = $_POST['points'] ;
$text = 'gameId:'.$gameId.';gamerName:'.$gamerName.';points:'.$points ;
if ($f = fopen('results.txt', 'a+')) {
    fwrite($f, $text. "\n");
    fclose($f);
    echo 'OK!:RESULT_SAVE-ok!' ;
}else {
    echo 'ERROR:RESULT_SAVE!' ;
}

//$f = fopen('results.txt', 'a+');
//fwrite($f, $name . ":" . $score . "\n");
//fclose($f);