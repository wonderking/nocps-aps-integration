<?php
require_once('include/nocps_api.php');

/* Make a connection to the NOC-PS server, with the default credentials listed in include/nocps_api.php */
$api = new nocps_api();


/* Retrieve a list of profiles (items 0 to 1000) */
$result       = $api->getProfileNames(0, 1000);
echo $result;
$profile_data = $result['data'];
echo "Total profiles on server ".$result['total']."<p>\n";

echo "<h1>Available installation profiles</h1>\n";
echo "<table border>\n";
echo "<th>ID<th>Name<th>Architecture\n";

foreach ($profile_data as $row)
{
	echo '<tr><td>'.htmlentities($row['id']).'<td>'.htmlentities($row['name']).'<td>'.htmlentities($row['arch'])."\n";
}
echo "</table><p>\n";



/* Retrieve a list of subnets (items 0 to 1000) */
$result       = $api->getSubnets(0, 1000);
$subnet_data  = $result['data'];

echo "<h1>Subnets</h1>\n";
echo "<table border>\n";
echo "<th>Subnet<th>Netmask<th>Gateway<th>Description\n";

foreach ($subnet_data as $row)
{
	echo '<tr><td>'.htmlentities($row['subnet']).'<td>'.htmlentities($row['netmask']).'<td>'.htmlentities($row['gw']).'<td>'.htmlentities($row['descr'])."\n";
}
echo "</table><p>\n";


/* For each subnet retrieve the list of host (maximum 100 hosts per subnet) */
foreach ($subnet_data as $subnet_row)
{
	$subnet = $subnet_row['subnet'];
	echo "Hosts of subnet ".htmlentities($subnet)."<p>";

	$result = $api->getHosts($subnet, 0, 100);
	$host_data = $result['data'];

	echo "<table border>\n";
	echo "<th>MAC address<th>IP address<th>Hostname<th>IPMI IP-address<th>Additional IP-addresses (space seperated)<th>Description<th>\n";
	foreach ($host_data as $row)
	{
		echo '<tr><td>'.htmlentities($row['mac']).'<td>'.htmlentities($row['ip']).'<td>'.htmlentities($row['hostname']).'<td>'.htmlentities($row['ipmi_ip']).'<td>'.htmlentities($row['add_ips']).'<td>'.htmlentities($row['descr'])."\n";
	}
	echo "</table><p>\n";
}


/* Retrieve the provisioning status */
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
