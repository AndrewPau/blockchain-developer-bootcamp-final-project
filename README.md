# blockchain-developer-bootcamp-final-project
## Overview
For my final project, I will mint an ERC20 token (called Pau token) on deploy, and allow users to purchase the token from the contract.

# Running the Project
The front end is run as a webpage by opening `src/index.html`

The backend smart contract can be run via truffle.

To run the smart contracts, first download [truffle](https://www.trufflesuite.com/docs/truffle/getting-started/installation). Afterwards. you can run a local blockchain on port 9545 via:
```
truffle develop
...
truffle(develop)> migrate
```

After deploying the contracts to your local blockchain, edit `src/app.js` and replace your address with `contractAddress`.

You can run the unit tests via:
```
truffle develop
...
truffle(develop)> test
```

To interact with the blockchain with your local Metamask, you'll need to import the blockchain. You can do so by adding a new network, where the RPC URL is `http://127.0.0.1:9545` and the Chain ID is `1337`. You can then import a key that truffle provides for you to interact with this locally.

# Video Recording
A video walkthrough of the project can be found on [Google Drive](https://drive.google.com/file/d/1RjW0gbClT8rdzR0s-BGbIl4C_VbBp0e2/view?usp=sharing)

# Web Hosting
My dapp is hosted on https://pautoken.netlify.app/

# Ethereum Address
My public ethereum address is 0x34b7cBf509AD4cD00eA94383457c9611f89be26B
