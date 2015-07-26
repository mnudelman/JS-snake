<?php
/**
 * Сохранить результат игры
 */
session_start();
ini_set('display_errors', 1);
//error_reporting(E_ALL) ;
error_reporting(E_ALL ^ E_NOTICE);
header('Content-type: text/html; charset=utf-8');
include_once __DIR__ . '/local.php';
/////////////////////////////////////////////////////////////////////////////////////////
class Db_saveResult extends Db_base
{
    private $GAME_SNAKE_ID = 1;

    public function putResult($gameId, $gamerName, $points, $total) {
        $userId = $this->getUserId($gamerName) ;
        if (false === $userId) {
           $this->msg->addMessage('ERROR:не найден  userLogin:'.$gamerName) ;
           return false ;
        }
        $sql = 'INSERT INTO results (gid,userid,timeid,points,rating) VALUES
                       (:gId , :userId, :gameId, :points, :rating) ' ;
        $subst = [
            'gId' => $this->GAME_SNAKE_ID,
            'userId' => $userId,
            'gameId' => $gameId,
            'points' => $points,
            'rating' => $total ] ;
        return $this->sqlExecute($sql,$subst,__METHOD__) ; // id добавленной записи
    }
    public function putGameAttr($rId,$attrName,$value) {
        $attrId = $this->getAttrId($attrName) ;
        if (false === $attrId) {
            return false ;
        }
        $sql = 'INSERT INTO gameattr (rid,attrid,attrvalue) VALUES
                           (:rId, :attrId, :val ) ' ;
        $subst = [
            'rId' => $rId,
            'attrId' => $attrId,
            'val' => $value] ;
        return $this->sqlExecute($sql,$subst,__METHOD__) ; // id добавленной записи
    }
    private function getAttrId($attrName) {
        $sql = 'SELECT attrid
                FROM attributes
                WHERE gid = :gId AND
                      attrname = :attrName' ;
       $subst = [
           'gId' => $this->GAME_SNAKE_ID,
           'attrName' => $attrName] ;
        $rows = $this->sqlExecute($sql,$subst,__METHOD__) ;
        if (false === $rows) {
            return false ;
        }
        $row = $rows[0] ;
        if (!empty($row)){
            return $row['attrid'] ;
        }else {
            return false ;
        }

    }
    private function getUserId($userLogin) {
        // $userPassw = [] ;  // ['login' => login, 'password' => $password ]
        $sql = 'SELECT userid FROM users WHERE login = :login' ;
        $subst = ['login' => $userLogin] ;
        $rows = $this->sqlExecute($sql,$subst,__METHOD__) ;
        if (false === $rows) {
            return false ;
        }
        $row = $rows[0] ;
        if (!empty($row)){
            return $row['userid'] ;
        }else {
            return false ;
        }
    }
}
function saveResult()
{
//    typ: 'saveResult',
//            gameId : gameId ,
//            gamerName : $('#gamerName').val() ,
//            points : $('#points').val(),
//            total: $('#totalRating').val(),
//            matrixSize : paramSet.params['ROWS_NUMBER'],
//            targetsNumber : paramSet.params['TARGET_NUMBER'],
//            targetLifetime : paramSet.params['TARGET_LIFETIME']
//        } ;
    $msg = Message::getInstace();
    $db = new Db_saveResult();

    $gameId = $_GET['gameId'];
    $gamerName = $_GET['gamerName'];
    $points = $_GET['points'];
    $total = $_GET['total'];
    $rId = $db->putResult($gameId, $gamerName, $points, $total);
    if (false == $rId) {
        $msg->addMessage('ERROR:Ошибка добавления результата. ');
        return ['successful' => false,
            'message' => $msg->getMessages()];
    }
    $matrixSize = $_GET['matrixSize'];
    $targetsNumber = $_GET['targetsNumber'];
    $targetLifetime = $_GET['targetLifetime'];
    $gameLength = $_GET['gameLength'];


    $res = $db->putGameAttr($rId, 'gameLength', $gameLength);
    if (false == $res) {
        $txt = 'ERROR:Ошибка добавления атрибута.gameLength ' . $msg->getMessages();
        return ['successful' => false,
            'message' => $msg->getMessages()];
    }

    $res = $db->putGameAttr($rId, 'matrixSize', $matrixSize);
    if (false == $res) {
        $txt = 'ERROR:Ошибка добавления атрибута.matrixSize ' . $msg->getMessages();
        return ['successful' => false,
            'message' => $msg->getMessages()];
    }
    $res = $db->putGameAttr($rId, 'targetsNumber', $targetsNumber);
    if (false == $res) {
        $txt = 'ERROR:Ошибка добавления атрибута.targetsNumber ' . $msg->getMessages();
        return ['successful' => false,
            'message' => $msg->getMessages()];
    }
    $res = $db->putGameAttr($rId, 'targetLifetime', $targetLifetime);
    if (false == $res) {
        $txt = 'ERROR:Ошибка добавления атрибута.targetLifetime ' . $msg->getMessages();
        return ['successful' => false,
            'message' => $msg->getMessages()];
    }
    return ['successful' => true,
        'message' => 'oK!: результат сохранен'];
}