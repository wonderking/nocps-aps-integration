<?php
require_once('include/nocps_api.php');

/* Make a connection to the NOC-PS server, with the default credentials listed in include/nocps_api.php */
$api = new nocps_api();


/* Get a list of all profiles */
$result       = $api->getProfileNames(0, 999999);
$profile_data = $result['data'];

/* Get a list of all subnets */
$result       = $api->getSubnets(0, 999999);
$subnet_data  = $result['data'];

/* store all the servers from all subnets in this array (key = MAC address, value = hostname + MAC) */
$big_list_of_servers = array();

foreach ($subnet_data as $subnet_row)
{
	$subnet = $subnet_row['subnet'];
	$result = $api->getHosts($subnet, 0, 999999);
	$host_data = $result['data'];

	foreach ($host_data as $row)
	{
		if ($row['mac'][2] == ':')
			$big_list_of_servers[$row['mac']] = $row['mac'].' ('.$row['hostname'].')';
	}
}



/* If form is submitted, provision host */
if (count($_POST))
{
	$result = $api->provisionHost(array(
		"mac"           => $_POST["mac"],
		"hostname"		=> $_POST["hostname"],
		"profile"       => $_POST["profile"],
		"rootpassword"  => $_POST["rootpassword"],
		"rootpassword2" => $_POST["rootpassword2"],
		"adminuser"	    => $_POST["adminuser"],
		"userpassword"  => $_POST["userpassword"],
		"userpassword2" => $_POST["userpassword2"]
	));
	if ($result['success'])
	{
		echo "<b>Provisioning server!</b>";
	}
	else
	{
		echo "<b>Error(s): </b><pre>";
		print_r( $result['errors'] );
		echo "</pre>";
	}
}

?>


<h1>Provision servers</h1>

<form method="post">
<table>
	<tr>
		<td>MAC-address of server
		<td><select name="mac">
<?php
foreach($big_list_of_servers as $mac => $name)
{
	echo '<option value="'.htmlentities($mac).'">'.htmlentities($name).'</option>';
}
?>
		</select>
	<tr>
		<td>Profile number
		<td><select name="profile">
<?php
foreach($profile_data as $profile)
{
	echo '<option value="'.$profile['id'].'">'.$profile['id'].' ('.htmlentities($profile['name']).') </option>';
}
?>
		</select>
	<tr>
		<td>New hostname
		<td><input type="text" name="hostname">
	<tr>
		<td>Root password
		<td><input type="password" name="rootpassword">
	<tr>
		<td>Repeat root password
		<td><input type="password" name="rootpassword2">
	<tr>
		<td>Normal username (optional)
		<td><input type="text" name="adminuser">
	<tr>
		<td>Normal user password (optional)
		<td><input type="password" name="userpassword">
	<tr>
		<td>Repeat normal user password
		<td><input type="password" name="userpassword2">
	<tr>
		<td>&nbsp;
		<td><input type="submit" value="Provision host">
</table>
</form>
