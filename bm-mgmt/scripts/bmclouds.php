<?php

	
	require "aps/2/runtime.php";	

	/**
	* @type("http://readyspace.com/bm-mgmt/bmcloud/1.0")
	* @implements("http://aps-standard.org/types/core/application/1.0")
	*/

	class bmclouds extends \APS\ResourceBase
	{
		/**
		 * @link("http://readyspace.com/bm-mgmt/context/1.0[]")
		 */
		public $contexts;
		
		/**
		 * @type("string")
		 * @title("AppHost")
		 * @description("Endpoint Server IP/Domain Name")
		 */
		public $apphost;
		
		/**
		 * @type("string")
		 * @title("Endpoint Server Admin Username")
		 * @description("Endpoint Server Administrator Username")
		 */
		public $endpointadmin;
		
		/**
		 * @type("string")
		 * @title("Endpoint Server Admin Password")
		 * @description("Endpoint Server Administrator Password")
		 * @encrypted
		 */
		public $endpointpass;


		/**
		 * @type("string")
		 * @title("NOC-PS Deployment URL")
		 * @description("NOC-PS Deployment URL")
		 */
		public $nocpsURL;

		/**
		 * @type("string")
		 * @title("NOC-PS Username")
		 * @description("NOC-PS Username")
		 */
		public $nocpsUser;

		/**
		 * @type("string")
		 * @title("NOC-PS Password")
		 * @description("NOC-PS Password")
		 * @encrypted
		 */
		public $nocpsPass;
		
		/**
		 * @link("http://readyspace.com/bm-mgmt/offer/1.0[]")
		 */
		public $offers;
		
		/*
		public function provision(){

		}

		public function retrieve(){

		}

		public function upgrade(){

		}

		public function unprovision(){

		}
		*/

		
	}
?>
