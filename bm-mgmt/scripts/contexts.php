<?php

	require "aps/2/runtime.php";
	require_once('include/nocps_api.php');

	/**
	* @type("http://readyspace.com/bm-mgmt/context/1.0")
	* @implements("http://aps-standard.org/types/core/resource/1.0")
	*/

	class contexts extends \APS\ResourceBase
	{
		/**
		 * @link("http://readyspace.com/bm-mgmt/bmcloud/1.0")
		 * @required
		 */
		public $bmcloud;

		/**
		 * @link("http://aps-standard.org/types/core/subscription/1.0")
		 * @required
		 */
		public $subscription;

		/**
		 * @link("http://aps-standard.org/types/core/account/1.0")
		 * @required
		 */
		public $account;


		/**
		 * @type("string")
		 * @title("Context ID")
		 * @readonly
		 */
		public $contextid;

		/**
		 * @type("string")
		 * @title("Context Password")
		 * @readonly
		 * @encrypted
		 */
		public $contextpass;

		/**
		 * @link("http://readyspace.com/bm-mgmt/bms/1.0[]")
		 */
		public $bmses;

		/**
		 * @link("http://readyspace.com/bm-mgmt/offer/1.0")
		 */
		public $offers;

		/**
		 * @verb(POSt)
		 * @path("/profilename")
		 * @param(string,query)
		 * @return(text)
		 */
		public function profilename($id){
			$apsc = clone \APS\Request::getController();
			$cloud = $apsc->getResource($this->bmcloud->aps->id);
			$api = new nocps_api($cloud->nocpsURL,$cloud->nocpsUser,$cloud->nocpsPass);

			$result = $api->getProfile($id);

			$name = $result['data'];
			
			//$answer = new stdClass();
			//$answer->name=$name['name'];
			//$json = json_encode($answer);

			return $name['name'];
		}

		/**
		 * @verb(GET)
		 * @path("/profiles")
		 * @return(string,text/json)
		 */
		public function profiles(){
			$apsc = clone \APS\Request::getController();
			$cloud = $apsc->getResource($this->bmcloud->aps->id);
			$api = new nocps_api($cloud->nocpsURL,$cloud->nocpsUser,$cloud->nocpsPass);
			$result = $api->getProfileNames(0,99999);

			$obj = $result['data'];
			$answer = array();
			array_push($answer,array('id'=>0,'label'=>"Please select an OS"));

			foreach ($obj as $profile){
				array_push($answer,array('id'=>$profile['id'],'label'=>$profile['name']));
			}

			$json = json_encode($answer);
			return $json;
		}


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
