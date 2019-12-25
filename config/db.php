<?php
	$host = getenv('DATABASE_HOST')?: die('No "DATABASE_HOST" config var in found in env!');
	$user = getenv('DATABASE_USER')?: die('No "DATABASE_USER" config var in found in env!');
	$password = getenv('DATABASE_PASSWORD')?: die('No "DATABASE_PASSWORD" config var in found in env!');
	$dbname = getenv('DATABASE_NAME')?: die('No "DATABASE_NAME" config var in found in env!');
	$port = getenv('DATABASE_PORT')?: die('No "DATABASE_PORT" config var in found in env!');

	try{
		//Set DSN data source name
		$dsn = "pgsql:host=" . $host . ";port=" . $port .";dbname=" . $dbname . ";user=" . $user . ";password=" . $password . ";";


		//create a pdo instance
		$conn = new PDO($dsn, $user, $password);
		$conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE,PDO::FETCH_OBJ);
		$conn->setAttribute(PDO::ATTR_EMULATE_PREPARES,false);
		$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	} catch (\PDOException $e) {
		echo 'Connection failed: ' . $e->getMessage();
	}
?>