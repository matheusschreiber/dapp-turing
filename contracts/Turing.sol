// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Turing is ERC20{
    address dono=0x78eaaE5dE26E7D4855Da96Bb1463eAf8f1137496;
    address professora=0x502542668aF09fa7aea52174b9965A7799343Df7;
    bool isVotingOn = true;
    uint256 maxSaTurings = 2 * 10 ** 18;

    mapping(string => address) public nameToAddress;
    mapping(address => bool) public authorizedUsers;
    mapping(address => mapping(string => bool)) public hasVoted;

    constructor() ERC20("Turing", "TUR") {
        nameToAddress["nome1"] = 0x70997970C51812dc3A010C7d01b50e0d17dc79C8;
        nameToAddress["nome2"] = 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC;
        nameToAddress["nome3"] = 0x90F79bf6EB2c4f870365E785982E1f101E93b906;
        nameToAddress["nome4"] = 0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65;
        nameToAddress["nome5"] = 0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc;
        nameToAddress["nome6"] = 0x976EA74026E726554dB657fA54763abd0C3a0aa9;
        nameToAddress["nome7"] = 0x14dC79964da2C08b23698B3D3cc7Ca32193d9955;
        nameToAddress["nome8"] = 0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f;
        nameToAddress["nome9"] = 0xa0Ee7A142d267C1f36714E4a8F75612F20a79720;
        nameToAddress["nome10"] = 0xBcd4042DE499D14e55001CcbB24a551F3b954096;
        nameToAddress["nome11"] = 0x71bE63f3384f5fb98995898A86B02Fb2426c5788;
        nameToAddress["nome12"] = 0xFABB0ac9d68B0B445fB7357272Ff202C5651694a;
        nameToAddress["nome13"] = 0x1CBd3b2770909D4e10f157cABC84C7264073C9Ec;
        nameToAddress["nome14"] = 0xdF3e18d64BC6A983f673Ab319CCaE4f1a57C7097;
        nameToAddress["nome15"] = 0xcd3B766CCDd6AE721141F452C550Ca635964ce71;
        nameToAddress["nome16"] = 0x2546BcD3c84621e976D8185a91A922aE77ECEc30;
        nameToAddress["nome17"] = 0xbDA5747bFD65F08deb54cb465eB87D40e51B197E;
        nameToAddress["nome18"] = 0xdD2FD4581271e230360230F9337D5c0430Bf44C0;
        nameToAddress["nome19"] = 0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199;

        authorizedUsers[nameToAddress["nome1"]] = true;
        authorizedUsers[nameToAddress["nome2"]] = true;
        authorizedUsers[nameToAddress["nome3"]] = true;
        authorizedUsers[nameToAddress["nome4"]] = true;
        authorizedUsers[nameToAddress["nome5"]] = true;
        authorizedUsers[nameToAddress["nome6"]] = true;
        authorizedUsers[nameToAddress["nome7"]] = true;
        authorizedUsers[nameToAddress["nome8"]] = true;
        authorizedUsers[nameToAddress["nome9"]] = true;
        authorizedUsers[nameToAddress["nome10"]] = true;
        authorizedUsers[nameToAddress["nome11"]] = true;
        authorizedUsers[nameToAddress["nome12"]] = true;
        authorizedUsers[nameToAddress["nome13"]] = true;
        authorizedUsers[nameToAddress["nome14"]] = true;
        authorizedUsers[nameToAddress["nome15"]] = true;
        authorizedUsers[nameToAddress["nome16"]] = true;
        authorizedUsers[nameToAddress["nome17"]] = true;
        authorizedUsers[nameToAddress["nome18"]] = true;
        authorizedUsers[nameToAddress["nome19"]] = true;
    }

    function issueToken(string memory _codinome, uint256 saTuringAmount) public {
        require(msg.sender!=professora && msg.sender!=dono, "Nao autorizado");
        require(saTuringAmount > 0, "Valor minimo");
        _mint(nameToAddress[_codinome], saTuringAmount);
    }

    function vote(string memory _codinome, uint256 saTuringAmount) public {
        require(authorizedUsers[msg.sender], "Nao autorizado");
        require(saTuringAmount * 10 ** 18 < maxSaTurings, "Max saTurings");
        require(isVotingOn, "Votacao desligada");
        require(msg.sender != nameToAddress[_codinome], "Nao pode votar em si mesmo");

        require(!hasVoted[msg.sender][_codinome], "Ja votou para esse codinome");
        hasVoted[msg.sender][_codinome] = true;

        _mint(nameToAddress[_codinome], saTuringAmount);
        _mint(msg.sender, 2 * 10 ** 17);
    }

    function votingOn() public {
        // require(msg.sender!=professora && msg.sender!=dono, "Nao autorizado");
        isVotingOn = true;
    }

    function votingOff() public {
        require(msg.sender!=professora && msg.sender!=dono, "Nao autorizado");
        isVotingOn = false;
    }

}

