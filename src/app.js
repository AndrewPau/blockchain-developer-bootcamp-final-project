// TODO: Add .env, link with node as the backend rather than directly injecting script
var contract;
var address;

const mmConnect = this.document.getElementById("mm-connect");
const remainingSupply = this.document.getElementById("remaining-supply");
const purchaseButton = this.document.getElementById("purchase-token");
const purchaseQuantity = this.document.getElementById("purchase-quantity");

var contractAddress = '0xBbf25fC22864132c1c029A4B01D8015c7309F212';
var abi = [
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_startingPrice",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_purchaseLimit",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_initialSupply",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "GenerateToken",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "addr",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "PurchaseToken",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "initialSupply",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "purchaseLimit",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "remainingSupply",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "startingPrice",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "purchasePresaleToken",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    }
  ];

window.addEventListener('load', function() {
    let mmDetected = this.document.getElementById('mm-detected');
    if (window.ethereum !== undefined) {
        mmDetected.innerHTML = "Metamask has been detected!";

        web3 = new Web3(window.ethereum);
        contract =  new web3.eth.Contract(abi, contractAddress);
        // TODO: Set up ganache and connect to it
        contract.setProvider(window.ethereum);
        //contract.setProvider("ws://localhost:9545")
    } else {
        mmDetected.innerHTML = "Metamask not found!";
        mmConnect.disabled = true;
    }
});

mmConnect.onclick = async () => {
    await ethereum.request({ 
        method: 'eth_requestAccounts'
    });
    let mmAddress = this.document.getElementById("mm-address")
    let addressPromise = await ethereum.request({ method: 'eth_accounts'})
    address = addressPromise[0]
    mmAddress.innerHTML = "address: " + address

    let mmBalance = this.document.getElementById("mm-balance")
    let balance = await ethereum.request({
        method: 'eth_getBalance', 
        params: [address],
    });
    etherBalance = web3.utils.fromWei(balance);
    mmBalance.innerHTML = "balance: " + etherBalance + " ETH";

    purchaseButton.hidden = false;
    purchaseButton.disabled = false;
    purchaseQuantity.hidden = false;
    purchaseQuantity.disabled = false;

    updateRemainingSupply();
}

purchaseButton.onclick = async() => {
    console.log("Purchase!");
    quantity = purchaseQuantity.value
    await contract.methods.purchasePresaleToken(quantity).send(
        {
            from: address,
            to: contractAddress,
            value: quantity * 10000,
        }
    )
    updateRemainingSupply();

    // await contract.methods.method_name(value).send({from: ethereum.selectedAddress})
}


async function updateRemainingSupply() {
    remaining = await contract.methods.remainingSupply().call();
    remainingSupply.innerHTML = "Remaining Supply " + remaining;
}
