<?php
require_once('include/nocps_api.php');

$api = new nocps_api("<NOC-PS IP","NOC-PS Username","NOC-PS Password"); //Server IP, Username, Password

$result = $api->getPools();

echo '<pre>';
print_r($result);
echo '</pre>';

 ?>
