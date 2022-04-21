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

import {CONTRACT_ADDRESS, CURRENT_NETWORK, DAI_ADDRESS, USDC_ADDRESS, USDT_ADDRESS} from './constants';

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
  //FUNCTION
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
        addLiquidityAndReturnLP
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};
