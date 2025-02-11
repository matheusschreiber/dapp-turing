// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract Turing is ERC20 {
    uint256 public constant maxSaTurings = 2 * 10 ** 18;

    address public immutable ownerDeploy;
    address public immutable professora;

    bool public isVotingOn = true;

    mapping(string => address) public nameToAddress;
    mapping(address => bool) public authorizedUsers;
    mapping(address => mapping(string => bool)) public hasVoted;

    string[19] public names;

    constructor() ERC20("Turing", "TUR") {
        ownerDeploy = msg.sender;
        professora = 0x502542668aF09fa7aea52174b9965A7799343Df7;

        address[19] memory addresses = [
            0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266, // owner (hardhat for testing)
            0x70997970C51812dc3A010C7d01b50e0d17dc79C8,
            0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC,
            0x90F79bf6EB2c4f870365E785982E1f101E93b906,
            0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65,
            0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc,
            0x976EA74026E726554dB657fA54763abd0C3a0aa9,
            0x14dC79964da2C08b23698B3D3cc7Ca32193d9955,
            0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f,
            0xa0Ee7A142d267C1f36714E4a8F75612F20a79720,
            0xBcd4042DE499D14e55001CcbB24a551F3b954096,
            0x71bE63f3384f5fb98995898A86B02Fb2426c5788,
            0xFABB0ac9d68B0B445fB7357272Ff202C5651694a,
            0x1CBd3b2770909D4e10f157cABC84C7264073C9Ec,
            0xdF3e18d64BC6A983f673Ab319CCaE4f1a57C7097,
            0xcd3B766CCDd6AE721141F452C550Ca635964ce71,
            0x2546BcD3c84621e976D8185a91A922aE77ECEc30,
            0xbDA5747bFD65F08deb54cb465eB87D40e51B197E,
            0xdD2FD4581271e230360230F9337D5c0430Bf44C0
        ];

        names = [
            "owner", "nome1", "nome2", "nome3", "nome4", "nome5", "nome6",
            "nome7", "nome8", "nome9", "nome10", "nome11", "nome12",
            "nome13", "nome14", "nome15", "nome16", "nome17", "nome18"
        ];

        for (uint256 i = 0; i < 19; i++) {
            nameToAddress[names[i]] = addresses[i];
            if (i > 0) {
                authorizedUsers[addresses[i]] = true;
            }
        }
    }

    // ####################### MODIFIERS ###########################

    modifier onlyOwnerOrProfessora() {
        require(msg.sender == professora || msg.sender == ownerDeploy, "Nao autorizado");
        _;
    }

    modifier onlySelectedAddresses(string memory _codinome) {
        require(nameToAddress[_codinome] != address(0), "Codinome invalido");
        _;
    }

    modifier onlyAuthorized() {
        require(authorizedUsers[msg.sender], "Nao autorizado");
        _;
    }

    modifier onlyValidAmount(uint256 _saTuringAmount) {
        require(_saTuringAmount > 0, 
            string(
                abi.encodePacked(
                    "Valor (", Strings.toString(_saTuringAmount), " saTurings) abaixo do minimo (0 saTurings)"
                )
            )
        );
        require(_saTuringAmount <= maxSaTurings, 
            string(
                abi.encodePacked(
                    "Valor (", Strings.toString(_saTuringAmount), " saTurings) acima do maximo (", Strings.toString(maxSaTurings), " saTurings)"
                )
            )
        );
        _;
    }

    modifier onlyVotingOn() {
        require(isVotingOn, "Votacao desligada");
        _;
    }

    modifier onlyVoteInOthers(string memory _codinome) {
        require(msg.sender != nameToAddress[_codinome], "Nao pode votar em si mesmo");
        _;
    }

    // ####################### EVENTS ##############################
    
    event DataUpdated();


    // ####################### FUNCTIONS ###########################

    function issueToken(string memory _codinome, uint256 _saTuringAmount)
        external
        onlyOwnerOrProfessora()
        onlySelectedAddresses(_codinome)
    {
        _mint(nameToAddress[_codinome], _saTuringAmount);

        emit DataUpdated();
    }

    function vote(string memory _codinome, uint256 _saTuringAmount)
        external
        onlyOwnerOrProfessora
        onlyValidAmount(_saTuringAmount)
        onlyAuthorized
        onlyVotingOn
        onlySelectedAddresses(_codinome)
        onlyVoteInOthers(_codinome)
    {
        require(!hasVoted[msg.sender][_codinome], "Ja votou para esse codinome");

        hasVoted[msg.sender][_codinome] = true;

        _mint(nameToAddress[_codinome], _saTuringAmount);
        _mint(msg.sender, 2 * 10 ** 17);
        
        emit DataUpdated();
    }

    function votingOn() external onlyOwnerOrProfessora {
        isVotingOn = true;
    }

    function votingOff() external onlyOwnerOrProfessora {
        isVotingOn = false;
    }

    function votingStatus() external view returns (bool) {
        return isVotingOn;
    }

    function getBalances() public view returns (string[19] memory, uint256[19] memory) {
        uint256[19] memory balances;
        for (uint256 i = 0; i < names.length; i++) {
            balances[i] = balanceOf(nameToAddress[names[i]]);
        }
        return (names, balances);
    }
}
