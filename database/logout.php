<?php
header('Content-Type: application/json');
$data = array();
$result = "";
//Expire our auth coookie to log the user out
$idOut = setcookie('theGoodfellasAuth[authID]', '', -3600, '', '', '', true);
$userOut = setcookie('theGoodfellasAuth[user]', '', -3600, '', '', '', true);

if ( $idOut == true && $userOut == true ) {
        $result = utf8_encode(true);
} else {
        $result = utf8_encode(false);
}
$data[] = array('result' => $result);
echo json_encode($data);
