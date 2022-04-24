# LP Staking 
A DApp created in Solidity with the funcionality of a LP Stacking in the Ethereum blockchain. <br/>
This project is for academic purposes only. <br/>

## :rocket: Walkthrough: 

1. Clone the main branch into your local repository. <br/>
2. Open a terminal and navigate to the local repository. <br/>
3. Run the command  `npm install`  to install all dependencies. <br/>
4. Create an .env file with 5 variables, "INFURA_URL", wich we will obtain the URL for deployment in Rinkeby, "PRIVATE_KEY" corresponding to your address private key. <br/>
"ALCHEMY_KEY" for the mainnet forking, ETHERSCAN_API_KEY for verify the contract if you deploy in some public net and COIN_MARKET_CAP_API_KEY for gas calculation in tests.<br/>
You can check the .env.sample file <br/>
5. Run the script "compile" with `run npm compile` for compile the Hardhat project with Solidity 0.8.4 or greater. <br/>
6. Run the script "test" with `run npm test` for start all project´s tests. <br/>
7. You can run the script "coverage" with `npm run coverage` to check the test stats. <br/>

## :electric_plug: Optional: 

1. You can run the script "deploy" with `npm run deploy` to deploy in Rinkeby testnet. If you choose to deploy remember to initialize your contract, for this: <br/>
    1. Run the script "verify" with `npm run verify` this way you can interact with you contract on etherscan. <br/>
    2. Go to rinkeby etherscan and look for your contract with the corresponding adress <br/>
    3. Look for the "Contract" tab, and then on "Write Contract" <br/>
    4. Connect your wallet.
    5. Look for the "Initialize" function and enter the corresponding values. <br/>
2. Run inside the client folder `yarn && yarn start` <br/>

## :desktop_computer: Web App

You can check the web App for this Staking contract in [here](https://lpstaking-ac.netlify.app/)
<br/>
