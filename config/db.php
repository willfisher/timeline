<?php
	$host = "ec2-107-22-224-154.compute-1.amazonaws.com";
	$user = "bnbjsdoifhumwq";
	$password = "a86af9b4de2d0137ab6f19b603570d88eaad4c87b95840bff478600f3347a9d0";
	$dbname = "d1kpssit0ob9i4";
	$port = "5432";

	try{
		//Set DSN data source name
		$dsn = "pgsql:host=" . $host . ";port=" . $port .";dbname=" . $dbname . ";user=" . $user . ";password=" . $password . ";";


		//create a pdo instance
		$conn = new PDO($dsn, $user, $password);
		$conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE,PDO::FETCH_OBJ);
		$conn->setAttribute(PDO::ATTR_EMULATE_PREPARES,false);
		$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	} catch (PDOException $e) {
		echo 'Connection failed: ' . $e->getMessage();
		die();
	}
?>