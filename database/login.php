<?php
require_once('dbConnect.php');
global $jdb;

if ( !empty ( $_POST ) ) {

        //Clean our form data
        $values = $jdb->clean($_POST);

        //The username and password submitted by the user
        $subName = $values['username'];
        $subPass = $values['password'];

        //The name of the table we want to select data from
        $table = 'users';

        /*
         * Run our query to get all data from the users table where the user 
         * login matches the submitted login.
         */
        
        $sql = "SELECT * FROM $table WHERE USER_NAME = '" . $subName . "'";
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
        
        //Recreate our NONCE used at registration
        $nonce = md5('registration-' . $subName . $stoReg . NONCE_SALT);

        //Rehash the submitted password to see if it matches the stored hash
        $subPass = $jdb->hash_password($subPass, $nonce);

        //Check to see if the submitted password matches the stored password
        
        if ( $subPass == $stoPass ) {

                //If there's a match, we rehash password to store in a cookie
                $authNonce = md5('cookie-' . $subName . $stoReg . AUTH_SALT);
                $authID = $jdb->hash_password($subPass, $authNonce);

                //Set our authorization cookie
                setcookie('theGoodfellasAuth[user]', $subName, 0, '', '', '', true);
                setcookie('theGoodfellasAuth[authID]', $authID, 0, '', '', '', true);
                
        } else {
                die('invalid');
        }
} else {
        die('empty');
}

