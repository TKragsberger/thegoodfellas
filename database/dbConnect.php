<?php
// Our database class
require_once 'config.php';
if(!class_exists('TheGoodFellasDatabase')){
	class TheGoodFellasDatabase {
            
		/**
		 * Connects to the database server and selects a database
		 *
		 * PHP4 compatibility layer for calling the PHP5 constructor.
		 *
		 * @uses JoombaDatabase::__construct()
		 *
		 */	
		function TheGoodFellasDatabase() {
			return $this->construct();
		}
		
		/**
		 * Connects to the database server and selects a database
		 *
		 * PHP5 style constructor for compatibility with PHP5. Does
		 * the actual setting up of the connection to the database.
		 *
		 */
		function construct() {
                    
			$this->connect();
		}
                
                function getLink(){
                    return mysqli_connect('kragsberger.dk.mysql', DB_USER, DB_PASS, "users");
                }
	
		/**
		 * Connect to and select database
		 *
		 * @uses the constants defined in config.php
		 */	
		function connect() {
			$link = $this->getLink();

			if (!$link) {
				die('Could not connect: ' . mysqli_error());
			}

			$db_selected = mysqli_select_db($link, DB_NAME);

			if (!$db_selected) {
				die('Can\'t use ' . DB_NAME . ': ' . mysqli_error());
			}
                        
		}
		
		/**
		 * Clean the array using mysql_real_escape_string
		 *
		 * Cleans an array by array mapping mysql_real_escape_string
		 * onto every item in the array.
		 *
		 * @param array $array The array to be cleaned
		 * @return array $array The cleaned array
		 */
		function clean($array) {
			return array_map('mysql_real_escape_string', $array);
		}
		
		/**
		 * Create a secure hash
		 *
		 * Creates a secure copy of the user password for storage
		 * in the database.
		 *
		 * @param string $password The user's created password
		 * @param string $nonce A user-specific NONCE
		 * @return string $secureHash The hashed password
		 */
		function hash_password($password, $nonce) {
		  $secureHash = hash_hmac('sha512', $password . $nonce, SITE_KEY);
		  
		  return $secureHash;
		}
		
		/**
		 * Insert data into the database
		 *
		 * Does the actual insertion of data into the database.
		 *
		 * @param resource $link The MySQL Resource link
		 * @param string $table The name of the table to insert data into
		 * @param array $fields An array of the fields to insert data into
		 * @param array $values An array of the values to be inserted
		 */
		function insert($link, $table, $fields, $values) {
			$fields = implode(", ", $fields);
			$values = implode("', '", $values);
			$sql="INSERT INTO $table (id, $fields) VALUES ('', '$values')";

			if (!mysqli_query($link, $sql)) {
				die('Error: ' . mysqli_error());
			} else {
				return TRUE;
			}
		}
		
		/**
		 * Select data from the database
		 *
		 * Grabs the requested data from the database.
		 *
		 * @param string $table The name of the table to select data from
		 * @param string $columns The columns to return
		 * @param array $where The field(s) to search a specific value for
		 * @param array $equals The value being searched for
		 */
		function select($link, $sql) {
			$results = mysqli_query($link, $sql);
			
			return $results;
		}
	}
}

//Instantiate our database class
$jdb = new TheGoodFellasDatabase;
?>