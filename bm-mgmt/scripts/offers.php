<?php

	require "aps/2/runtime.php";


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
	* @type("http://readyspace.com/bm-mgmt/offer/1.0")
	* @implements("http://aps-standard.org/types/core/resource/1.0")
	*/

	class offers extends \APS\ResourceBase
	{
		/**
		 * @link("http://readyspace.com/bm-mgmt/bmcloud/1.0")
		 * @required
		 */
		public $cloud;

		/**
		 * @link("http://readyspace.com/bm-mgmt/bms/1.0[]")
		 */
		public $bmses;

		/**
		 * @link("http://readyspace.com/bm-mgmt/context/1.0")
		 */
		public $context;

		/**
		 * @type("string")
		 * @title("Offer Name")
		 */
		public $name;

		/**
		 * @type("string")
		 * @title("Offer Description")
		 */
		public $description;

		/**
		 * @type("Hardware")
		 * @title("Hardware")
		 * @description("Server Hardware")
		 */
		public $hardware;

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
