import React, { useReducer, useCallback, createContext, useEffect } from "react";

import { Web3Reducer } from "./reducer";

// WEB3 CONNECTION PACKAGES
import Web3 from "web3";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Torus from "@toruslabs/torus-embed";
import Authereum from "authereum";

import Lottery from '../utils/abi/Lottery.json';
import IERC20 from '../utils/abi/IERC20.json';
import UNISWAP from '../utils/abi/IUniswapV2Router02.json';

import LPStaking from '../utils/abi/LPStaking.json';

import {CONTRACT_ADDRESS, CURRENT_NETWORK, DEPLOY_BLOCK, WETH_ADDRESS, DAI_ADDRESS, USDC_ADDRESS, USDT_ADDRESS} from './constants';

let web3 = null;

const initialState = {
  loading: true,
  connected: false,
  account: null,
  contracts: {},
  networkId: null,
  chainId: null,
};

export const Web3Context = createContext(initialState);

export const Web3Provider = ({ children }) => {
  const [state, dispatch] = useReducer(Web3Reducer, initialState);

  const setAccount = (account) => {
    dispatch({
      type: "SET_ACCOUNT",
      payload: account,
    });
  };

  const setNetworkId = (networkId) => {
    dispatch({
      type: "SET_NETWORK_ID",
      payload: networkId,
    });
  };

  const setContracts = (contracts) => {
    dispatch({
      type: "SET_CONTRACTS",
      payload: contracts,
    });
  };

  const logout = () => {
    setAccount(null);
    localStorage.setItem("defaultWallet", null);
  };

  const connectWeb3 = useCallback(async () => { 
    // Web3 Modal
    let host;
    let network;
    if(CURRENT_NETWORK === 'Rinkeby'){
      host = `https://rinkeby.infura.io/v3/${process.env.REACT_APP_INFURA_KEY}`;
      network = "rinkeby";
    }else{
      host = `https://mainnet.infura.io/v3/${process.env.REACT_APP_INFURA_KEY}`;
      network = "mainnet";
    }

    const providerOptions = {
      walletconnect: {
        package: WalletConnectProvider, // required
        options: {
          infuraId: process.env.REACT_APP_INFURA_KEY, // required
        },
      },
      torus: {
        package: Torus, // required
        options: {
          networkParams: {
            host, // optional
            networkId: 1, // optional
          },
          config: {
            buildEnv: "production", // optional
          },
        },
      },
      authereum: {
        package: Authereum,
      },
    };

    try {
      const web3Modal = new Web3Modal({
        network,
        cacheProvider: true, // optional
        providerOptions, // required
        theme: "light",
      });
      const provider = await web3Modal.connect();

      web3 = new Web3(provider);
      window.web3 = web3;

      const lpstaking = new web3.eth.Contract(LPStaking.abi, CONTRACT_ADDRESS);
      console.log('lpstaking', lpstaking)
      const lottery = new web3.eth.Contract(Lottery.abi, CONTRACT_ADDRESS);

      console.log('lpstaking', lpstaking)
      const dai = new web3.eth.Contract(IERC20.abi, DAI_ADDRESS);
      const usdc = new web3.eth.Contract(IERC20.abi, USDC_ADDRESS);
      const usdt = new web3.eth.Contract(IERC20.abi, USDT_ADDRESS);
      const uniswap = new web3.eth.Contract(UNISWAP.abi, "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D");
      setContracts({...state.contracts, lpstaking, lottery, dai, usdc, usdt, uniswap});
      window.lpstaking = lpstaking;
      console.log('window.lpstaking', window.lpstaking)
      window.lottery = lottery;
      window.dai = dai;
      window.usdc = usdc;
      window.usdt = usdt;
      window.uniswap = uniswap;

      const networkId = await web3.givenProvider.networkVersion;
      console.log(`networkId`, networkId)
      setNetworkId(networkId);
      
      const acc = await web3.eth.getAccounts();
      setAccount(acc[0]);
      console.log("Connected Account: ", acc[0]);

    } catch (error) {
      console.log(error);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const connectWeb3Lite = useCallback(async () => {
    // Web3 Modal
    let host;
    if(CURRENT_NETWORK === 'Rinkeby'){
      host = `https://rinkeby.infura.io/v3/${process.env.REACT_APP_INFURA_KEY}`;
    }else{
      host = `https://mainnet.infura.io/v3/${process.env.REACT_APP_INFURA_KEY}`;
    }

    try {

      web3 = new Web3(host);
      window.web3 = web3;

      const lpstaking = new web3.eth.Contract(LPStaking.abi, CONTRACT_ADDRESS);
      const lottery = new web3.eth.Contract(Lottery.abi, CONTRACT_ADDRESS);
      const dai = new web3.eth.Contract(IERC20.abi, DAI_ADDRESS);
      const usdc = new web3.eth.Contract(IERC20.abi, USDC_ADDRESS);
      const usdt = new web3.eth.Contract(IERC20.abi, USDT_ADDRESS);
      const uniswap = new web3.eth.Contract(UNISWAP.abi, "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D");
      setContracts({...state.contracts, lpstaking, lottery, dai, usdc, usdt, uniswap});
      window.lpstaking = lpstaking;
      window.lottery = lottery;
      window.dai = dai;
      window.usdc = usdc;
      window.usdt = usdt;
      window.uniswap = uniswap;

      const networkId = await web3.givenProvider.networkVersion;
      console.log(`networkId`, networkId)
      setNetworkId(networkId);

    } catch (error) {
      console.log(error);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  window.ethereum.on('accountsChanged', (data) =>
    console.log(`data`, data)
  );
   
  //EVENTS
  const depositLotteryEvents = async () => {
    try {
      // uint256 lotteryId,
      // address particpantAddress,
      // uint256 ticketBuyed,
      // uint256 totalAmmount
      let depositEvents = await state.contracts.lottery.getPastEvents('AddressEnterLottery', {fromBlock: DEPLOY_BLOCK, toBlock: 'latest'});
      let events = [];
      for (const element of depositEvents) {
        let x = element.returnValues;
        x.eventType = "Enter"
        events.push(x);
      }
      return events;
    } catch (error) {
      console.log(`error`, error)
    }
  }

  const withdrawLotteryEvents = async () => {
    try {
      // uint256 lotteryId,
      // address particpantAddress,
      // uint256 ammount
      let withdrawEvents = await state.contracts.lottery.getPastEvents('AddressWithdrawFrom', {fromBlock: DEPLOY_BLOCK, toBlock: 'latest'});
      let events = [];
      for (const element of withdrawEvents) {
        let x = element.returnValues;
        x.eventType = "Withdraw"
        events.push(x);
      }
      return events;
    } catch (error) {
      console.log(`error`, error)
    }
  }

  const winnerPickedEvents = async () => {
    try {
      // uint256 lotteryId,
      // address winner,
      let winnerPicked = await state.contracts.lottery.getPastEvents('WinnerPicked', {fromBlock: DEPLOY_BLOCK, toBlock: 'latest'});
      let events = [];
      for (const element of winnerPicked) {
        let x = element.returnValues;
        x.eventType = "Winner Picked"
        events.push(x);
      }
      return events;
    } catch (error) {
      console.log(`error`, error)
    }
  }

  const getAllEvents = async () => {
    try {
      let allEvents = [...await depositLotteryEvents(), ...await withdrawLotteryEvents(), ...await winnerPickedEvents()];
      return allEvents;
    } catch (error) {
      console.log(`error`, error)
    }
  }
  //EVENTS

  //FUNCTION
  const isOwner = async () => {
    if(state.account){
      return await state.contracts.lottery.methods.owner().call() === state.account;
    }
  }

  //   enum LotteryStatus {
  //     HasntStarted,        >>>> 0
  //     WaitingParticipants, >>>>>1
  //     GainingInterest, >>>>>>> 2
  //     waitingForRandom, >>>>>> 3
  //     Ended >>>>>>>> 4
  // }

  const lotteryInformation = async (id) => {
    try {
      let lotteryData = await state.contracts.lottery.methods.LotteriesHistory(id).call();
      switch (lotteryData.status) {
        case "0":
          lotteryData.status = "Has not Started"
          break;
        case "1":
          lotteryData.status = "Waiting Participants"
          break;
        case "2":
          lotteryData.status = "Gaining Interest"
          break;
        case "3":
          lotteryData.status = "picking winner"
          break;
        case "4":
          lotteryData.status = "Ended"
          break;
      
        default: lotteryData.status = "none"
          break;
      }

      lotteryData.id = id;      
      lotteryData.poolOfMony = web3.utils.fromWei(lotteryData.poolOfMony);
      lotteryData.statusChangeTime = new Date(Number(lotteryData.statusChangeTime+"000")).getTime();
      lotteryData.ticketPrice = web3.utils.fromWei(await ticketPrice(id));
      return lotteryData;
    } catch (error) {
      console.log(`error`, error)
    }
  }

  const getLotteries = async () => {
    try {
      let current = await state.contracts.lottery.methods.currentLottery().call();
      let lotteries = [];
      for (let i = 0; i <= Number(current); i++) {
        let x = await lotteryInformation(String(i));
        lotteries.push(x);
      }
      return lotteries;
    } catch (error) {
      console.log(`error`, error)
    }
  }

  const ticketPrice = async (id) => {
    try {
      return await state.contracts.lottery.methods.TickedAmmount().call();
    } catch (error) {
      console.log(`error`, error)
    }
  }

  const buyTokens = async (coin) => {
    let x;
    let amountToBuy;
    switch (coin) {
      case 1:
          x = await state.contracts.uniswap.methods.getAmountsOut(web3.utils.toWei("1"),[WETH_ADDRESS,DAI_ADDRESS]).call();
          amountToBuy = String(x[1]);
          await state.contracts.uniswap.methods.swapExactETHForTokens(amountToBuy,[WETH_ADDRESS,DAI_ADDRESS], state.account, 36000000000).send({from: state.account, value: web3.utils.toWei("1")});
        break;
      case 2:
          x = await state.contracts.uniswap.methods.getAmountsOut(web3.utils.toWei("1"),[WETH_ADDRESS,USDC_ADDRESS]).call();
          amountToBuy = String(x[1]);
          await state.contracts.uniswap.methods.swapExactETHForTokens(amountToBuy,[WETH_ADDRESS,USDC_ADDRESS], state.account, 36000000000).send({from: state.account, value: web3.utils.toWei("1")});
        break;
      case 3:
          x = await state.contracts.uniswap.methods.getAmountsOut(web3.utils.toWei("1"),[WETH_ADDRESS,USDT_ADDRESS]).call();
          amountToBuy = String(x[1]);
          await state.contracts.uniswap.methods.swapExactETHForTokens(amountToBuy,[WETH_ADDRESS,USDT_ADDRESS], state.account, 36000000000).send({from: state.account, value: web3.utils.toWei("1")});
        break;
    
      default:
        break;
    }
  }

  const enterLottery = async (method, amountToPay, tickets) => {
    try {
      console.log(method, amountToPay, tickets)
      if(method === 0){
        await state.contracts.lottery.methods.enterLottery(method, web3.utils.toWei(String(amountToPay)), web3.utils.toWei(String(tickets))).send({from: state.account, value: web3.utils.toWei(amountToPay)});
      }else{
        let allowance;
        switch (method) {
          case 1:
            allowance = await state.contracts.dai.methods.allowance(state.account, CONTRACT_ADDRESS).call();
            if(allowance < web3.utils.toWei(String(amountToPay))){
              await state.contracts.dai.methods.approve(CONTRACT_ADDRESS, web3.utils.toWei(String(Math.pow(2,53)-1))).send({from: state.account})
              await state.contracts.lottery.methods.enterLottery(method, web3.utils.toWei(String(amountToPay)), web3.utils.toWei(String(tickets))).send({from: state.account});
            }
            else{
              await state.contracts.lottery.methods.enterLottery(method, web3.utils.toWei(String(amountToPay)), web3.utils.toWei(String(tickets))).send({from: state.account});
            }
            break;
          case 2:
            allowance = await state.contracts.usdc.methods.allowance(state.account, CONTRACT_ADDRESS).call();
            if(allowance < web3.utils.toWei(String(amountToPay))){
              await state.contracts.usdc.methods.approve(CONTRACT_ADDRESS, web3.utils.toWei(String(Math.pow(2,53)-1))).send({from: state.account})
              await state.contracts.lottery.methods.enterLottery(method, web3.utils.toWei(String(amountToPay)), web3.utils.toWei(String(tickets))).send({from: state.account});
            }
            else{
              await state.contracts.lottery.methods.enterLottery(method, web3.utils.toWei(String(amountToPay)), web3.utils.toWei(String(tickets))).send({from: state.account});
            }
            break;
          case 3:
            allowance = await state.contracts.usdt.methods.allowance(state.account, CONTRACT_ADDRESS).call();
            if(allowance < web3.utils.toWei(String(amountToPay))){
              await state.contracts.usdt.methods.approve(CONTRACT_ADDRESS, web3.utils.toWei(String(Math.pow(2,53)-1))).send({from: state.account})
              await state.contracts.lottery.methods.enterLottery(method, web3.utils.toWei(String(amountToPay)), web3.utils.toWei(String(tickets))).send({from: state.account});
            }
            else{
              await state.contracts.lottery.methods.enterLottery(method, web3.utils.toWei(String(amountToPay)), web3.utils.toWei(String(tickets))).send({from: state.account});
            }
            break;
          default:
            break;
        }
      }
    } catch (error) {
      console.log(`error`, error)
    }
  }

  const withdrawLottery = async (id) => {
    try {
      await state.contracts.lottery.methods.WithdrawPending(id).send({from: state.account});
    } catch (error) {
      console.log(`error`, error)
    }
  }
  //FUNCTION

  //OWNER
  const lotteryToWaitingPhase = async () => {
    try {
      if(isOwner()) await state.contracts.lottery.methods.lotteryToWaitingPhase().send({from: state.account});
    } catch (error) {
      console.log(`error`, error)
    }
  }

  const requestWinnerToBePicked = async () => {
    try {
      if(isOwner()) await state.contracts.lottery.methods.requestWinnerToBePicked().send({from: state.account});
    } catch (error) {
      console.log(`error`, error)
    }
  }

  const OwnerWithdraw = async (id) => {
    try {
      if(isOwner()) await state.contracts.lottery.methods.OwnerWithdraw(id).send({from: state.account});
    } catch (error) {
      console.log(`error`, error)
    }
  }
  //OWNER

  //test staking
  const addLiquidityAndReturnLP = async (ammount) => {
    if(state.account){
      try {
        await state.contracts.lpstaking.methods.swapAddLiquidityAndReturnLP().send({from: state.account, value: web3.utils.toWei(ammount), gas: 39000});
      } catch (error) {
        console.log(`error`, error)
      }
    }
  }

  useEffect(() => {
    if(localStorage.getItem("WEB3_CONNECT_CACHED_PROVIDER")){
      connectWeb3();
    }else{
      connectWeb3Lite();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Web3Context.Provider
      value={{
        ...state,
        web3,
        connectWeb3,
        logout,
        isOwner,
        lotteryInformation,
        ticketPrice,
        depositLotteryEvents,
        withdrawLotteryEvents,
        winnerPickedEvents,
        getAllEvents,
        enterLottery,
        withdrawLottery,
        lotteryToWaitingPhase,
        requestWinnerToBePicked,
        OwnerWithdraw,
        getLotteries,
        buyTokens,
        addLiquidityAndReturnLP
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};
