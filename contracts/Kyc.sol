pragma solidity ^0.6.9;

contract Kyc {
    // Customer Struct. It defines a customer and validating bank's details
    struct Customer {
        bytes32 userName;
        bytes32 dataHash;
        uint256 rating;
        uint8 upVotes;
        address bank;
    }

    // Bank Struct. It defines the bank details
    struct Bank {
        bytes32 name;
        address bank;
        uint256 rating;
        uint8 kycCount;
        bytes32 regNumber;
    }

    // KycRequest struct. It defines kyc request details of customers
    struct KycRequest {
        bytes32 userName;
        address bank;
        bytes32 dataHash;
        bool isAllowed;
    }

    // Mappings for custom data types of Customer, Bank and KycRequest
    mapping(bytes32 => Customer) public customers;
    mapping(address => Bank) public banks;
    mapping(bytes32 => KycRequest) public kycRequests;
    mapping(bytes32 => KycRequest) public customerKycReq;

    // Mappings to maintain banks to banks and customer votes respectively
    mapping(address => bytes32[]) internal bankToCustomerVotes;
    mapping(address => address[]) internal bankToBankVotes;

    // Mapping to maintain password list of customer to password
    mapping(bytes32 => bytes32) internal passwordList;

    // Arrays to maintain bank list, final customers list and customer requests dataHash list
    address[] public bankList;
    bytes32[] public finalCustomers;
    bytes32[] internal customerReqDataList;
    bytes32[] public customerReqList;
    bytes32[] public customerVerificationList;

    // State variables to define admin address and minimum acceptable rating for banks and customers
    address admin;
    uint256 minRating;

    /*
     * Set admin to one who deploy this contract
     * Set minRating of 50%
     */

    constructor() public {
        admin = msg.sender;
        minRating = (100 / 2);
    }

    // Modifiers

    // Checks whether the requestor is admin
    modifier isAdmin {
        require(
            admin == msg.sender,
            "Only admin is allowed to operate this functionality"
        );
        _;
    }

    // Checks whether bank has been validated and added by admin
    modifier isBankValid {
        require(
            banks[msg.sender].bank == msg.sender,
            "Unauthenticated requestor! Bank not been added by admin."
        );
        _;
    }

    // Authenticates the password
    modifier validatePassword(bytes32 customerName, bytes32 password) {
        require(
            passwordList[customerName] != password,
            "Authentication failed!"
        );
        _;
    }

    // Events
    event alreadyVoted(address bankAddress, string message);

    // ----- Bank Interface -----

    /*
     * Records new KYC request for customerName
     * @param {bytes32} customerName The user name of the customer for whom the request is to be raised
     * @param {bytes32} customerDataHash  The hash of the data or identification documents provided by the Customer
     * modifier isBankValid Checks whether bank has been validated and added by admin
     * @returns {uint8} Returns 1 if the execution is successful, 0 otherwise
     */
    function addKycRequest(bytes32 customerName, bytes32 customerDataHash)
        public
        isBankValid
        returns (uint8)
    {
        require(
            kycRequests[customerDataHash].bank == address(0),
            "This user already has a KYC request with same data in process."
        );

        kycRequests[customerDataHash].userName = customerName;
        kycRequests[customerDataHash].dataHash = customerDataHash;
        kycRequests[customerDataHash].bank = msg.sender;

        // Initialize isAllowed flag for request based on bank's minimum rating
        if (banks[msg.sender].rating <= minRating)
            kycRequests[customerDataHash].isAllowed = false;
        else kycRequests[customerDataHash].isAllowed = true;

        // Push customer request data to customerReqDataList array
        customerReqDataList.push(customerDataHash);
        customerReqList.push(customerName);

        banks[msg.sender].kycCount += 1;

        customerKycReq[customerName].userName = customerName;
        customerKycReq[customerName].dataHash = customerDataHash;
        customerKycReq[customerName].bank = msg.sender;

        return 1;
    }

    /*
     * Adds customer to customers mapping
     * Add the requestor's bank's vote and update the customer rating
     * @param {bytes32} customerName The user name of the customer for whom the request is made
     * @param {bytes32} customerDataHash  The hash of the data or identification documents provided by the Customer
     * modifier isBankValid Checks whether bank has been validated and added by admin
     * @returns {uint8} Returns 1 if the execution is successful, 0 otherwise
     */
    function addCustomer(bytes32 customerName, bytes32 customerDataHash)
        public
        isBankValid
        returns (uint8)
    {
        require(
            customers[customerName].bank == address(0),
            "This customer is already present, please call modifyCustomer to edit the customer data"
        );
        require(
            kycRequests[customerDataHash].userName == customerName,
            "Please raise KYC request before adding customers"
        );
        require(
            kycRequests[customerDataHash].isAllowed == true,
            "Not allowed to add customers"
        );

        customers[customerName].userName = customerName;
        customers[customerName].dataHash = customerDataHash;
        customers[customerName].bank = msg.sender;

        // Record bank's vote and update the vote and rating for the customer
        bankToCustomerVotes[msg.sender].push(customerName);
        customers[customerName].upVotes += 1;
        customers[customerName].rating =
            (customers[customerName].upVotes * 100) /
            bankList.length;

        customerVerificationList.push(customerName);

        // Remove KYC request once the customer is added to the lsit
        removeKycRequest(customerName, customerDataHash);

        // Initialize the customer password to '0'. Once customer needs data to be protected, bank can set the password for those customers.
        passwordList[customerName] = "0";

        return 1;
    }

    /*
     * Remove KYC request for the customer data
     * @param {bytes32} customerName The user name of the customer for whom the request is made
     * @param {bytes32} customerDataHash  The hash of the data or identification documents provided by the Customer
     * @returns {uint8} Returns 1 if the execution is successful, 0 otherwise
     */
    function removeKycRequest(bytes32 customerName, bytes32 customerDataHash)
        public
        isBankValid
        returns (uint8)
    {
        require(
            kycRequests[customerDataHash].userName == customerName,
            "This customer's KYC request doesn't exists"
        );

        delete kycRequests[customerDataHash];

        // Remove KYC request from the list
        // removeKycRequest(customerName, customerDataHash);
        for (uint256 i = 0; i < customerReqDataList.length; i++) {
            if (customerReqDataList[i] == customerDataHash) {
                for (uint256 j = i + 1; j < customerReqDataList.length; j++) {
                    customerReqDataList[j - 1] = customerReqDataList[j];
                }
                customerReqDataList.pop();
                return 1;
            }
        }

        return 1;
    }

    /*
     * Remove customer mapping
     * Remove customer from final customer list
     * Remove customer's vote given by the banks
     * Remove customer's password
     * @param {bytes32} customerName The user name of the customer for whom the request is made
     * @param {bytes32} customerDataHash  The hash of the data or identification documents provided by the Customer
     * modifier isBankValid Checks whether bank has been validated and added by admin
     * @returns {uint8} Returns 1 if the execution is successful, 0 otherwise
     */
    function removeCustomer(bytes32 customerName)
        external
        isBankValid
        returns (uint8)
    {
        require(
            customers[customerName].userName == customerName,
            "This customer doesn't exits"
        );

        delete customers[customerName];
        delete passwordList[customerName];

        // if customer is present in final customer list then remove customer from the final list and remove the votes given to the customer by the banks
        if (isCustomerPresent(customerName))
            removeAcceptedCustomer(customerName);

        return 1;
    }

    /*
     * View customer dataHash
     * @param {bytes32} customerName The user name of the customer for whom the request is made
     * @param {bytes32} password Password for the customer
     * modifier isBankValid Checks whether bank has been validated and added by admin
     * @modifier validatePassword Validate if the password is set for customer then its valid
     * @returns {bytes32} The hash of the data or identification documents of the customer
     */
    function viewCustomer(bytes32 customerName, bytes32 password)
        public
        view
        isBankValid
        validatePassword(customerName, password)
        returns (bytes32)
    {
        return customers[customerName].dataHash;
    }

    function viewCustomerDetails(bytes32 customerName)
        public
        view
        isBankValid
        returns (
            bytes32,
            address,
            bytes32,
            bool
        )
    {
        bytes32 customerDataHash = customerKycReq[customerName].dataHash;
        return (
            kycRequests[customerDataHash].userName,
            kycRequests[customerDataHash].bank,
            kycRequests[customerDataHash].dataHash,
            kycRequests[customerDataHash].isAllowed
        );
    }

    function viewPedingCustomerDetails(bytes32 customerName)
        public
        view
        isBankValid
        returns (
            bytes32,
            bytes32,
            uint256,
            uint8,
            address,
            bool
        )
    {
        if (customers[customerName].rating > minRating) {
            return (
                customers[customerName].userName,
                customers[customerName].dataHash,
                customers[customerName].rating,
                customers[customerName].upVotes,
                customers[customerName].bank,
                true
            );
        } else {
            return (
                customers[customerName].userName,
                customers[customerName].dataHash,
                customers[customerName].rating,
                customers[customerName].upVotes,
                customers[customerName].bank,
                false
            );
        }
    }

    // Get all the bank's customers who have raised the kyc requests
    function getRequestedCustomers(address bankAddress)
        public
        view
        isBankValid
        returns (bytes32[] memory)
    {
        bytes32[] memory customerList = new bytes32[](
            customerReqDataList.length
        );
        uint8 count = 0;

        // Get all the dataHash of the customer for which bank has raised a request
        for (uint256 i = 0; i < customerReqDataList.length; i++) {
            if (kycRequests[customerReqDataList[i]].bank == bankAddress) {
                customerList[count] = kycRequests[customerReqDataList[i]]
                    .userName;
                count = count + 1;
            }
        }
        return customerList;
    }

    // get all the verification requests of customer raised by a bank
    function getPendingCustomers()
        public
        view
        isBankValid
        returns (bytes32[] memory)
    {
        bytes32[] memory customerList = new bytes32[](
            customerVerificationList.length
        );
        uint8 count = 0;

        // Get all the dataHash of the customer for which bank has raised a request
        for (uint256 i = 0; i < customerVerificationList.length; i++) {
            // if (customers[customerVerificationList[i]].bank == bankAddress) {
            customerList[count] = customers[customerVerificationList[i]]
                .userName;
            count = count + 1;
            // }
        }
        return customerList;
    }

    function getVerifiedCustomers() public view returns (bytes32[] memory) {
        return finalCustomers;
    }

    function getAllBanks() public view returns (address[] memory) {
        return bankList;
    }

    /*
     * Allows a bank to cast an upvote for a customer
     * @param {bytes32} customerName The user name of the customer for whom the request is made
     * modifier isBankValid Checks whether bank has been validated and added by admin
     * @returns {uint8} Returns 1 if the execution is successful, 0 otherwise
     */
    function upVoteCustomer(bytes32 customerName)
        public
        isBankValid
        returns (uint8)
    {
        require(
            customers[customerName].userName == customerName,
            "This customer doesn't exists"
        );
        require(
            banks[msg.sender].bank == msg.sender,
            "Unauthenticated requestor! Bank not been added by admin."
        );

        // Check if bank has already voted for a customer
        for (uint256 i = 0; i < bankToCustomerVotes[msg.sender].length; i++) {
            if (bankToCustomerVotes[msg.sender][i] == customerName) {
                emit alreadyVoted(
                    msg.sender,
                    "Bank already voted for this customer"
                );
                return 0;
            }
        }

        // Add vote to the customer
        bankToCustomerVotes[msg.sender].push(customerName);

        // Evaluate customer's vote and rating based on current bank's vote
        customers[customerName].upVotes += 1;
        customers[customerName].rating =
            (customers[customerName].upVotes * 100) /
            bankList.length;

        // If customer satisfies minimum rating criteria, add the customer to final customer list
        if (customers[customerName].rating > minRating) {
            finalCustomers.push(customerName);
        }

        return 1;
    }

    /*
     * Modify customer details
     * @param {bytes32} customerName The user name of the customer for whom the request is made
     * @param {bytes32} password Password for the customer
     * @param {bytes32} customerDataHash  The hash of the data to be updated
     * modifier isBankValid Checks whether bank has been validated and added by admin
     * @modifier validatePassword Validate if the password is set for customer then its valid to update the customer details
     * @returns {uint8} Returns 1 if the execution is successful, 0 otherwise
     */
    function modifyCustomerData(
        bytes32 customerName,
        bytes32 password,
        bytes32 dataHash
    )
        public
        isBankValid
        validatePassword(customerName, password)
        returns (uint8)
    {
        require(
            customers[customerName].userName == customerName,
            "This customer doesn't exits"
        );

        // Validate whether same data is present for customer
        bytes32 savedDataHash = viewCustomer(customerName, password);
        require(
            customers[customerName].dataHash != savedDataHash,
            "This customer data is up to date"
        );

        // Update the customer dataHash and requestor bank
        customers[customerName].dataHash = dataHash;
        customers[customerName].bank = msg.sender;

        // Initialize new data's rating and upvote by banks to 0
        customers[customerName].rating = 0;
        customers[customerName].upVotes = 0;

        // If customer is present in final customer list then remove it.
        if (isCustomerPresent(customerName))
            removeAcceptedCustomer(customerName);

        // Remove all the votes customer got from the bank
        removeCustomerVotes(customerName);

        return 1;
    }

    /*
     * Fetch all the requests raised by the bank
     * @param {address} bankAddress Bank address
     * modifier isBankValid Checks whether bank has been validated and added by admin
     * @returns {bytes32[]} Returns all the data hash of customer for which bank has raised a request
     */
    function getBankRequests(address bankAddress)
        public
        view
        isBankValid
        returns (bytes32[] memory)
    {
        bytes32[] memory dataList = new bytes32[](customerReqDataList.length);
        uint8 count = 0;

        // Get all the dataHash of the customer for which bank has raised a request
        for (uint256 i = 0; i < customerReqDataList.length; i++) {
            if (kycRequests[customerReqDataList[i]].bank == bankAddress) {
                dataList[count] = customerReqDataList[i];
                count = count + 1;
            }
        }
        return dataList;
    }

    /*
     * Upvote a bank
     * @param {address} bankAddress Bank address to be upvoted
     * modifier isBankValid Checks whether bank has been validated and added by admin
     * @returns {uint8} Returns 1 if the execution is successful, 0 otherwise
     */
    function upVoteBank(address bankAddress)
        public
        isBankValid
        returns (uint8)
    {
        require(
            banks[bankAddress].bank == bankAddress,
            "This bank doesn't exists"
        );
        require(msg.sender != bankAddress, "Banks can't upvote their own bank");

        uint256 votesCount = 0;
        bool isTrustedBank = banks[bankAddress].rating > minRating;

        // Check whether bank as already voted for given bank
        for (uint256 i = 0; i < bankToBankVotes[msg.sender].length; i++) {
            if (bankToBankVotes[msg.sender][i] == bankAddress) {
                emit alreadyVoted(
                    msg.sender,
                    "Bank has already voted for the given bank"
                );
                return 0;
            }
        }

        bankToBankVotes[msg.sender].push(bankAddress);

        // calculate upvotes for the bank from bankToBankVotes mapping
        for (uint256 i = 0; i < bankList.length; i++) {
            for (uint256 j = 0; j < bankToBankVotes[bankList[i]].length; j++) {
                if (bankToBankVotes[bankList[i]][j] == bankAddress)
                    votesCount++;
            }
        }

        banks[bankAddress].rating = (votesCount * 100) / bankList.length;

        // Allow all the requests made by the bank if bank satisfy min criteria. Will run only once for a bank when it just cross min criteria
        if (isTrustedBank == false && banks[bankAddress].rating > minRating) {
            for (uint256 i = 0; i < customerReqDataList.length; i++) {
                if (kycRequests[customerReqDataList[i]].bank == bankAddress) {
                    kycRequests[customerReqDataList[i]].isAllowed = true;
                }
            }
        }

        return 1;
    }

    /*
     * Get customer rating
     * @param {bytes32} customerName The user name of the customer for whom the request is made
     * modifier isBankValid Checks whether bank has been validated and added by admin
     * @returns {uint256} Returns the rating for the customer
     */
    function getCustomerRating(bytes32 customerName)
        public
        view
        isBankValid
        returns (uint256)
    {
        return customers[customerName].rating;
    }

    /*
     * Get bank rating
     * @param {address} The address of bank for which the request is made
     * modifier isBankValid Checks whether bank has been validated and added by admin
     * @returns {uint256} Returns the rating for the bank
     */
    function getBankRating(address bankAddress)
        public
        view
        isBankValid
        returns (uint256)
    {
        return banks[bankAddress].rating;
    }

    /*
     * Get bank who has lately updated the customer details
     * @param {bytes32} customerName The user name of the customer for whom the request is made
     * modifier isBankValid Checks whether bank has been validated and added by admin
     * @returns {address} Returns the bank address
     */
    function lastUpdatedBy(bytes32 customerName)
        public
        view
        isBankValid
        returns (address)
    {
        return customers[customerName].bank;
    }

    /*
     * Set password for the customer data
     * @param {bytes32} customerName The user name of the customer for whom the request is made
     * @param {bytes32 password The password that need to be set for the customer data
     * modifier isBankValid Checks whether bank has been validated and added by admin
     * @returns {bool} Returns true if success, false otherwise
     */
    function setPassword(bytes32 customerName, bytes32 password)
        public
        isBankValid
        returns (bool)
    {
        passwordList[customerName] = password;
        return true;
    }

    /*
     * Get bank details
     * @param {address} The address of bank for which the request is made
     * modifier isBankValid Checks whether bank has been validated and added by admin
     * @returns {bytes32, address, uint256, uint8, bytes32} Returns bank details
     */
    function getBankDetails(address bankAddress)
        public
        view
        returns (
            bytes32,
            address,
            uint256,
            uint8,
            bytes32
        )
    {
        require(banks[bankAddress].bank == bankAddress, "Bank doesn't exists");

        return (
            banks[bankAddress].name,
            banks[bankAddress].bank,
            banks[bankAddress].rating,
            banks[bankAddress].kycCount,
            banks[bankAddress].regNumber
        );
    }

    // ----- Admin Interface -----

    /*
     * Add new bank
     * @param {bytes32} bankName The name of the bank
     * @param {address} bankAddress The address of the bankAddress
     * @param {bytes32} regNumber THe unique registration number of the bank
     * modifier isAdmin validate if only admin is able to make a request
     * @returns {bool} Returns true if success, false otherwise
     */
    function addBank(
        bytes32 bankName,
        address bankAddress,
        bytes32 regNumber
    ) public isAdmin returns (bool) {
        require(
            banks[bankAddress].bank != bankAddress,
            "Bank with same address already exists"
        );

        banks[bankAddress].name = bankName;
        banks[bankAddress].bank = bankAddress;
        banks[bankAddress].rating = 0;
        banks[bankAddress].kycCount = 0;
        banks[bankAddress].regNumber = regNumber;

        bankList.push(bankAddress);

        bankToBankVotes[bankAddress].push();
        bankToCustomerVotes[bankAddress].push();

        return true;
    }

    /*
     * Remove a bank from the list
     * @param {address} bankAddress The address of the bankAddress
     * modifier isAdmin validate if only admin is able to make a request
     * @returns {bool} Returns true if success, false otherwise
     */
    function removeBank(address bankAddress) public isAdmin returns (bool) {
        require(banks[bankAddress].bank == bankAddress, "Bank doesn't exists");

        removeBankFromList(bankAddress);

        delete banks[bankAddress];
        delete bankToBankVotes[bankAddress];
        delete bankToCustomerVotes[bankAddress];

        return true;
    }

    // ----- Helper functions -----

    // Function to validate if the customer is present in final customer list
    function isCustomerPresent(bytes32 customerName)
        internal
        view
        returns (bool)
    {
        for (uint256 i = 0; i < finalCustomers.length; i++) {
            if (finalCustomers[i] == customerName) return true;
        }
        return false;
    }

    // Function to remove the customer from final list and associated votes from bank
    function removeAcceptedCustomer(bytes32 customerName) internal {
        for (uint256 index = 0; index < finalCustomers.length; index++) {
            if (finalCustomers[index] == customerName) {
                for (uint256 j = index + 1; j < finalCustomers.length; j++) {
                    finalCustomers[j - 1] = finalCustomers[j];
                }
                finalCustomers.pop();
            }
        }
        removeCustomerVotes(customerName);
    }

    // Function to remove customer votes from all the bank
    function removeCustomerVotes(bytes32 customerName) internal {
        for (uint256 i = 0; i < bankList.length; i++) {
            for (
                uint256 j = 0;
                j < bankToCustomerVotes[bankList[i]].length;
                j++
            ) {
                if (bankToCustomerVotes[bankList[i]][j] == customerName) {
                    for (
                        uint256 k = j + 1;
                        k < bankToCustomerVotes[bankList[i]].length;
                        k++
                    ) {
                        bankToCustomerVotes[bankList[i]][k -
                            1] = bankToCustomerVotes[bankList[i]][k];
                    }
                    bankToCustomerVotes[bankList[i]].pop();
                }
            }
        }
    }

    // Function to remove bank from the list
    function removeBankFromList(address bankAddress) internal {
        for (uint256 i = 0; i < bankList.length; i++) {
            if (bankList[i] == bankAddress) {
                delete bankList[i];
                for (uint256 j = i + 1; j < bankList.length; j++) {
                    bankList[j - 1] = bankList[j];
                }
                bankList.pop();
            }
        }

        // remove bank votes from all the banks
        for (uint256 i = 0; i < bankList.length; i++) {
            for (uint256 j = 0; j < bankToBankVotes[bankList[i]].length; j++) {
                if (bankToBankVotes[bankList[i]][j] == bankAddress) {
                    for (
                        uint256 k = j + 1;
                        k < bankToBankVotes[bankList[i]].length;
                        k++
                    ) {
                        bankToBankVotes[bankList[i]][k -
                            1] = bankToBankVotes[bankList[i]][k];
                    }
                    bankToBankVotes[bankList[i]].pop();
                }
            }
        }
    }
}
