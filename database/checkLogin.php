<?php
require_once 'dbConnect.php';
header('Content-Type: application/json');
global $jdb;
$data = array();
$result = "";
$username = "";

//Grab our authorization cookie array
$cookie = $_COOKIE['theGoodfellasAuth'];

//Set our user and authID variables
$user = $cookie['user'];
$authID = $cookie['authID'];

/*
 * If the cookie values are empty, we redirect to login right away;
 * otherwise, we run the login check.
 */
if ( !empty ( $cookie ) ) {

        //Query the database for the selected user
        $table = 'users';
        $sql = "SELECT * FROM $table WHERE USER_NAME = '" . $user . "'";
        $results = $jdb->select($sql);

        //Kill the script if the submitted username doesn't exit
        if (!$results) {
                die('Bruger navnet findes ikke!');
        }

        //Fetch our results into an associative array
        $results = mysql_fetch_assoc( $results );

        //The registration date of the stored matching user
        $stoReg = $results['USER_REGISTERED'];

        //The hashed password of the stored matching user
        $stoPass = $results['USER_PASS'];

        //Rehash password to see if it matches the value stored in the cookie
        $authNonce = md5('cookie-' . $user . $stoReg . AUTH_SALT);
        $stoPass = $jdb->hash_password($stoPass, $authNonce);

        if ( $stoPass == $authID ) {
                $result = true;
                $username = utf8_encode($user);
        } else {
                $result = false;
        }
} else {
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------                                            
//                                              ændre så der ikke står man er logged ind
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//				//Build our redirect
//				$url = "http" . ((!empty($_SERVER['HTTPS'])) ? "s" : "") . "://".$_SERVER['SERVER_NAME'].$_SERVER['REQUEST_URI'];
//				$redirect = str_replace('index.php', 'login.php', $url);
//				
//				//Redirect to the home page
//				header("Location: $redirect?msg=login");
//				exit;
}

$data[] = array('result' => $result,
                'username' => $username);
echo json_encode($data);
