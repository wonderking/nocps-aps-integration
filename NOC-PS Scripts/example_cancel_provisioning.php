<?php
require_once('include/nocps_api.php');
	
/* Make a connection to the NOC-PS server, with the default credentials listed in include/nocps_api.php */
$api = new nocps_api();


/* Cancel provisioning of MAC */
if ( count($_POST) )
{
	$result = $api->cancelProvisioning($_POST["mac"]);
	echo "<b>Cancelled!</b>";
}

/* Output a list of hosts currencly being provisioned */
$result       = $api->getProvisioningStatus(0, 1000);
$status_data = $result['data'];

echo "<h1>Provisioning status</h1>\n";
echo "<table border>\n";
echo "<th>MAC address<th>Hostname<th>Profile ID number<th>Profile name<th>Status message\n";

foreach ($status_data as $row)
{
	echo '<tr><td>'.htmlentities($row['host']).'<td>'.htmlentities($row['hostname']).'<td>'.htmlentities($row['profile']).'<td>'.htmlentities($row['profilename']).'<td>'.htmlentities($row['statusmsg']);
}
echo "</table><p>\n";
?>


<h1>Cancel provisioning</h1>

<form method="post">
<table>
	<tr>
		<td>MAC-address of server
		<td><input type="text" name="mac">
	<tr>
		<td>&nbsp;
		<td><input type="submit" value="Cancel">
</table>
</form>

