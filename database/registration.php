<?php
require_once('dbConnect.php');
header('Content-Type: application/json');
global $jdb;
$data = array();
$result = "";

//Check to make sure the form submission is coming from our script
//The full URL of our registration page
$current = 'http://localhost/thegoodfellas/index.html';

//The full URL of the page the form was submitted from
$referrer = $_SERVER['HTTP_REFERER'];
/*
 * Check to see if the $_POST array has date (i.e. our form was submitted) and if so,
 * process the form data.
 */
if ( !empty ( $_POST ) ) {

        /* 
         * Here we actually run the check to see if the form was submitted from our
         * site. Since our registration from submits to itself, this is pretty easy. If
         * the form submission didn't come from the register.php page on our server,
         * we don't allow the data through.
         */
        if ( $referrer == $current ) {

                //Require our database class


                //Set up the variables we'll need to pass to our insert method
                //This is the name of the table we want to insert data into
                $table = 'users';

                //These are the fields in that table that we want to insert data into
                $fields = array('USER_NAME', 'USER_PASS', 'USER_EMAIL', 'USER_REGISTERED');

                //These are the values from our registration form... cleaned using our clean method
                $values = $jdb->clean($_POST);

                //Now, we're breaking apart our $_POST array, so we can storely our password securely
                $username = $_POST['username'];
                $userpass = $_POST['password'];
                $useremail = $_POST['email'];
                $userreg = time();

                //We create a NONCE using the action, username, timestamp, and the NONCE SALT
                $nonce = md5('registration-' . $username . $userreg . NONCE_SALT);

                //We hash our password
                $userpass = $jdb->hash_password($userpass, $nonce);

                //Recompile our $value array to insert into the database
                $values = array(
                                        'username' => $username,
                                        'password' => $userpass,
                                        'email' => $useremail,
                                        'date' => $userreg
                                );
                $link = $jdb->getLink();
                //And, we insert our data
                $insert = $jdb->insert($link, $table, $fields, $values);

                if ( $insert == TRUE ) {
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------                                            
//                                              ændre så der står i registrings from at din account er blevet lavet log ind vent 5 sek +- 5 sek og så luk vindue
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
                    $result = utf8_encode(true);
                } else{
                    $result = utf8_encode(false);
                }
        } else {
                die('Your form submission did not come from the correct page. Please check with the site administrator.');
        }
        $data[] = array('result' => $result);
        echo json_encode($data);
}
		