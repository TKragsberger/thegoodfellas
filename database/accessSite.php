<?php
// Our main class
require_once('dbConnect.php');
if(!class_exists('AccessSite')){
	class AccessSite {
		
		function register($redirect) {
			global $jdb;
		
			//Check to make sure the form submission is coming from our script
			//The full URL of our registration page
			$current = 'http://' . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];

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
					$userName = $_POST['username'];
					$userPass = $_POST['password'];
					$userEmail = $_POST['email'];
					$userReg = $_POST['date'];
					
					//We create a NONCE using the action, username, timestamp, and the NONCE SALT
					$nonce = md5('registration-' . $userName . $userReg . NONCE_SALT);
					
					//We hash our password
					$userpass = $jdb->hash_password($userPass, $nonce);
					
					//Recompile our $value array to insert into the database
					$values = array(
								'username' => $userLogin,
								'password' => $userPass,
								'email' => $userEmail,
								'date' => $userReg
							);
					
					//And, we insert our data
					$insert = $jdb->insert($link, $table, $fields, $values);
					
					if ( $insert == TRUE ) {
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------                                            
//                                              ændre så der står i registrings from at din account er blevet lavet log ind vent 5 sek +- 5 sek og så luk vindue
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//
//						$url = "http" . ((!empty($_SERVER['HTTPS'])) ? "s" : "") . "://".$_SERVER['SERVER_NAME'].$_SERVER['REQUEST_URI'];
//						$aredirect = str_replace('register.php', $redirect, $url);
//						
//						header("Location: $redirect?reg=true");
//						exit;
					}
				} else {
					die('Your form submission did not come from the correct page. Please check with the site administrator.');
				}
			}
		}
		
		function login($redirect) {
			global $jdb;
		
			if ( !empty ( $_POST ) ) {
				
				//Clean our form data
				$values = $jdb->clean($_POST);

				//The username and password submitted by the user
				$subName = $values['userName'];
				$subPass = $values['passWord'];

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
					
					//Build our redirect
					$url = "http" . ((!empty($_SERVER['HTTPS'])) ? "s" : "") . "://".$_SERVER['SERVER_NAME'].$_SERVER['REQUEST_URI'];
					$redirect = str_replace('login.php', $redirect, $url);
					
					//Redirect to the home page
					header("Location: $redirect");
					exit;	
				} else {
					return 'invalid';
				}
			} else {
				return 'empty';
			}
		}
		
		function logout() {
			//Expire our auth coookie to log the user out
			$idOut = setcookie('theGoodfellasAuth[authID]', '', -3600, '', '', '', true);
			$userOut = setcookie('theGoodfellasAuth[user]', '', -3600, '', '', '', true);
			
			if ( $idOut == true && $userOut == true ) {
				return true;
			} else {
				return false;
			}
		}
		
		function checkLogin() {
			global $jdb;
		
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
				$stoReg = $results['user_registered'];

				//The hashed password of the stored matching user
				$stoPass = $results['user_pass'];

				//Rehash password to see if it matches the value stored in the cookie
				$authNonce = md5('cookie-' . $user . $stoReg . AUTH_SALT);
				$stoPass = $jdb->hash_password($stoPass, $authNonce);
				
				if ( $stoPass == $authID ) {
					$results = true;
				} else {
					$results = false;
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
			
			return $results;
		}
	}
}

//Instantiate our database class
$j = new AccessSite;
?>