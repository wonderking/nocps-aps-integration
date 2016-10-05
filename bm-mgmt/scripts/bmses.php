<?php

	require "aps/2/runtime.php";
	require_once('include/nocps_api.php');

	class CPU{
		/**
		 * @type("string")
		 * @title("Processor Specification")
		 * @description ("Processor Descriptions")
		 */
		public $description;

		/**
		 * @type("integer")
		 * @title("No. of CPU cores")
		 * @description("Number of CPU cores")
		 */
		public $number;
	}

	class OS{
		/**
		 * @type("string")
		 * @title("OS Id")
		 * @description ("NOC-PS OS Id")
		 */
		public $id;

		/**
		 * @type("string")
		 * @title("OS")
		 * @description("Operating System")
		 */
		public $name;
	}

	class Hardware{
		/**
		 * @type("integer")
		 * @title("RAM Size")
		 * @description("RAM Size in GB")
		 */
		public $memory;

		/**
		 * @type("integer")
		 * @title("Disk Space")
		 * @description("Disk Space in GB")
		 */
		public $diskspace;

		/**
		 * @type("CPU")
		 * @title("CPU")
		 * @description("Server CPU Parameter")
		 */
		public $CPU;
	}




	/**
	 * @type("http://readyspace.com/bm-mgmt/bms/1.0")
	 * @implements("http://aps-standard.org/types/core/resource/1.0")
	 * @implements("http://aps-standard.org/types/core/suspendable/1.0")
	 */
	class bmses extends \APS\ResourceBase
	{
		/**
		 * @link("http://readyspace.com/bm-mgmt/context/1.0")
		 * @required
		 */
		public $context;

		/**
		 * @type("string")
		 * @title("Name")
		 * @description("Server Name")
		 */
		public $name;

		/**
		 * @type("string")
		 * @title("Description")
		 * @description("Server Description")
		 */
		public $description;

		/**
		 * @type("string")
		 * @title("State")
		 * @description("Server State")
		 */
		public $state;

		/**
		 * @type("Hardware")
		 * @title("Hardware")
		 * @description("Server Hardware")
		 */
		public $hardware;

		/**
		 * @link("http://readyspace.com/bm-mgmt/offer/1.0")
		 * @required
		 */
		public $offer;

		/**
		 * @type("OS")
		 * @title("OS")
		 * @description("Operating System")
		 */
		public $OS;

		/**
		 * @type("string")
		 * @title("Pool ID (Origin)")
		 * @description("Pool ID for NOC-PS")
		 */
		public $poolIdfrom;

		/**
		 * @type("string")
		 * @title("Pool ID (Destination)")
		 * @description("Pool ID for NOC-PS")
		 */
		public $poolIddest;

		/**
		 * @type("string")
		 * @title("Mac Address")
		 */
		public $macAdd;

		/**
		 * @type("string")
		 * @title("IP Address")
		 */
		public $ipAdd;

		/**
		 * @type("string")
		 * @title("Host Name")
		 */
		public $hostname;
		

		/**
		 * @type("string")
		 * @title("Root Password")
		 * @encrypted
		 */
		public $rootpass;

		/**
		 * @type("string")
		 * @title("Admin Username")
		 */
		public $adminuser;

		/**
		 * @type("string")
		 * @title("Admin Password")
		 * @encrypted
		 */
		public $adminpass;

		/**
		 * @type("boolean")
		 * @title("Payment Status")
		 */
		public $paymentstatus;

		/**
		 * @type("string")
		 * @title("Provisioning Status")
		 */
		public $provisioningstatus;

		/**
		 * @verb(GET)
		 * @path("/provisionstatus")
		 */
		public function provisionstatus(){
			//Get APS Controller to update changes to APS Platform and DB
			$apsc = clone \APS\Request::getController();
			//Using APS Controller to retrieve Cloud Variables to form connection to NOC-PS
			$cloud = $apsc->getResource($this->context->bmcloud->aps->id);
			//Initialising NOC-PS API variable with Cloud Variables
			$api = new nocps_api($cloud->nocpsURL,$cloud->nocpsUser,$cloud->nocpsPass);
			//Retrieving of Server Provisioning Status by its Mac Address
			$status = $api->getProvisioningStatusByServer($this->macAdd);
			//Storing of Server Provisioning Status in local variable
			$this->provisioningstatus = $status['statusmsg'];
			//Using APS Controller to save the new update
			$apsc->updateResource($this);
		}

		/**
		 * @verb(POST)
		 * @path("/poweron")
		 * @return(string,text/json)
		 */
		public function poweron(){
			//Calling power method in this class
			$result = $this->power("on","Started");
			return $result;
		}

		/**
		 * @verb(POST)
		 * @path("/poweroff")
		 * @return(string,text/json)
		 */
		public function poweroff(){
			//Calling power method in this class
			$result = $this->power("off","Stopped");
			return $result;
		}

		/**
		 * @verb(POST)
		 * @path("/powerreset")
		 * @return(string,text/json)
		 */
		public function powerreset(){
			//Calling power method in this class
			$result = $this->power("reset","Started");
			return $result;
		}

		/**
		 * @verb(PUT)
		 * @path("/reprovision")
		 */
		public function reprovision(){
			//Get APS Controller to update changes to APS Platform and DB
			$apsc = clone \APS\Request::getController();
			//Using APS Controller to retrieve Cloud Variables to form connection to NOC-PS
			$cloud = $apsc->getResource($this->context->bmcloud->aps->id);
			//Initialising NOC-PS API variable with Cloud Variables
			$api = new nocps_api($cloud->nocpsURL,$cloud->nocpsUser,$cloud->nocpsPass);
			//Calling NOC-PS to Cancel Provisioning for a Particular Mac Address
			$api->cancelProvisioning($this->macAdd);
			//Calling NOC-PS to Power On the Server
			$api->powercontrol($this->macAdd,"on","","ipmi");
			//Calling NOC-PS to Provision Server
			$result = $api->provisionHost(array(
				"mac" => $this->macAdd,
				"hostname" => $this->name,
				"profile" => $this->OS->id,
				"rootpassword" => $this->rootpass,
				"rootpassword2" => $this->rootpass,
				"adminuser" => $this->adminuser,
				"userpassword" => $this->adminpass,
				"userpassword2" => $this->adminpass
			));
			//Calling NOC-PS to Reset the Server
			$api->powercontrol($this->macAdd,"reset","","ipmi");
			//Setting Local Variable: State to Started
			$this->state = "Started";
			//Checking if Provisioning is Successful
			if(!($result['success'])){
				//Unsuccessful, reset all the variables to null
				$this->name = null;
				$this->OS->id = null;
				$this->OS->name = null;
				$this->rootpass = null;
				$this->adminuser = null;
				$this->adminpass = null;
				//Updating to APS Platform and DB
				$apsc->updateResource($this);
				throw new \Exception("Provisioning failed. Please retry");
			}
			//Updating to APS Platform and DB
			$apsc->updateResource($this);
		}

		//Main PowerControl Method
		public function power($command,$status){
			//Get APS Controller to update changes to APS Platform and DB
			$apsc = clone \APS\Request::getController();
			//Using APS Controller to retrieve Cloud Variables to form connection to NOC-PS
			$cloud = $apsc->getResource($this->context->bmcloud->aps->id);
			//Initialising NOC-PS API variable with Cloud Variables
			$api = new nocps_api($cloud->nocpsURL,$cloud->nocpsUser,$cloud->nocpsPass);
			//Check if Client has paid his subscription before allowing him to control power
			if($this->paymentstatus) {
				//Calling NOC-PS to do power control operations on the Server
				$result = $api->powercontrol($this->macAdd, $command, "", "ipmi");
				//Setting Local Variable: State to Status
				$this->state = $status;
				//Updating to APS Platform and DB
				$apsc->updateResource($this);
				return $result;
			}else{
				throw new \Exception("Payment Uncleared. Please contact ReadySpace.");
			}
		}
		

		public function provision()
		{
			//Get APS Controller to update changes to APS Platform and DB
			$apsc = clone \APS\Request::getController();
			//Using APS Controller to retrieve Cloud Variables to form connection to NOC-PS
			$cloud = $apsc->getResource($this->context->bmcloud->aps->id);
			//Initialising NOC-PS API variable with Cloud Variables
			$api = new nocps_api($cloud->nocpsURL,$cloud->nocpsUser,$cloud->nocpsPass);

			//Set payment status to cleared
			$this->paymentstatus = true;

			//Check if it there is a Mac Address attached to resource
			if (empty($macAdd)) {
				//Assign Mac Address to resource
				$this->macAdd = $api->popFromPool($this->poolIdfrom, $this->poolIddest);
			}
			//Check if Mac Address is empty. If yes, means there is no available servers
			if (empty($this->macAdd)) {
				throw new \Exception("No server available.");
			} else {
				//Calling NOC-PS to retrieve server details
				$hostDetails = $api->getHost($this->macAdd);
				//Assigning IP Address to local resource
				$this->ipAdd = $hostDetails["ip"];
				//Calling NOC-PS to Power On the Server
				$api->powercontrol($this->macAdd,"on","","ipmi");
				//Calling NOC-PS to Provision Server
				$result = $api->provisionHost(array(
					"mac" => $this->macAdd,
					"hostname" => $this->name,
					"profile" => $this->OS->id,
					"rootpassword" => $this->rootpass,
					"rootpassword2" => $this->rootpass,
					"adminuser" => $this->adminuser,
					"userpassword" => $this->adminpass,
					"userpassword2" => $this->adminpass
				));
				//Calling NOC-PS to Reset the Server
				$api->powercontrol($this->macAdd,"reset","","ipmi");
				//Setting Local Variable: State to Started
				$this->state = "Started";
				//Checking if Provisioning is Successful
				if(!($result['success'])){
					//Unsuccessful, reset all the variables to null
					$this->name = null;
					$this->OS->id = null;
					$this->OS->name = null;
					$this->rootpass = null;
					$this->adminuser = null;
					$this->adminpass = null;
					//Updating to APS Platform and DB
					$apsc->updateResource($this);
					throw new \Exception("Provisioning failed. Please retry");
				}
				//Updating to APS Platform and DB
				$apsc->updateResource($this);
			}
		}

		public function enable(){
			//Get APS Controller to update changes to APS Platform and DB
			$apsc = \APS\Request::getController();
			//Setting Payment Status to Cleared
			$this->paymentstatus = true;
			//Updating to APS Platform and DB
			$apsc->updateResource($this);

		}

		public function disable(){
			//Get APS Controller to update changes to APS Platform and DB
			$apsc = \APS\Request::getController();
			//Setting Payment Status to Uncleared
			$this->paymentstatus = false;
			//Updating to APS Platform and DB
			$apsc->updateResource($this);

		}

		public function unprovision(){
			//Get APS Controller to update changes to APS Platform and DB
			$apsc = clone \APS\Request::getController();
			//Using APS Controller to retrieve Cloud Variables to form connection to NOC-PS
			$cloud = $apsc->getResource($this->context->bmcloud->aps->id);
			//Initialising NOC-PS API variable with Cloud Variables
			$api = new nocps_api($cloud->nocpsURL,$cloud->nocpsUser,$cloud->nocpsPass);
			//Calling NOC-PS to retrieve server details
			$hostDetails = $api->getHost($this->macAdd);
			//Update Server to Return to Origin Pool
			$hostDetails["pool"] = $this->poolIdfrom;
			//Update Server Name to Unused
			$hostDetails["hostname"] = "unused";
			//Update to NOC-PS
			$api->updateHost($hostDetails);
			$api->powercontrol($this->macAdd,"off","","ipmi");
		}
		/*
		public function retrieve(){

		}
		
		public function upgrade(){

		}
		*/
	}
?>
