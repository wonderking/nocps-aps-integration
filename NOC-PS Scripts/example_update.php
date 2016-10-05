<?php
/* Example updating the description of a host */

require_once('include/nocps_api.php');
	
/* Make a connection to the NOC-PS server, with the default credentials listed in include/nocps_api.php */
$api = new nocps_api();

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

/* If form is submitted, update host */
if (count($_POST))
{
    /* Get all existing info first */    
    $host_info = $api->getHost($_POST['mac']);
    
    /* Set new description in array with existing info */
    $host_info['descr'] = $_POST['description'];
    
    /* Call updateHost with all information */
    $result = $api->updateHost($host_info);
    
    if ($result['success'])
    {
            echo "<b>Updated host!</b>";
    }
    else
    {
            echo "<b>Error(s): </b><pre>";
            print_r( $result['errors'] );
            echo "</pre>";
    }	
}
?>

<h1>Update description of server</h1>

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
                <td>New description
                <td><input type="text" name="description">
	<tr>
		<td>&nbsp;
		<td><input type="submit" value="Update host">
</table>
</form>
