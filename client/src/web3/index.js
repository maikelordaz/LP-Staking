import React, { useReducer, useCallback, createContext, useEffect } from "react";

import { Web3Reducer } from "./reducer";

// WEB3 CONNECTION PACKAGES
import Web3 from "web3";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Torus from "@toruslabs/torus-embed";
import Authereum from "authereum";

import LPStaking from '../utils/abi/LPStaking_Implementation.json';

import {CONTRACT_ADDRESS, CURRENT_NETWORK} from './constants';

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

  const setLoadin = (account) => {
    dispatch({
      type: "SET_LOADING",
      payload: false,
    });
  };

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
            networkId: 4, // optional
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
      setContracts({...state.contracts, lpstaking});
      console.log('lpstaking', lpstaking);

      window.lpstaking = lpstaking;
      console.log('window.lpstaking', window.lpstaking)

      const networkId = await web3.givenProvider.networkVersion;
      setNetworkId(networkId);
      console.log(`networkId`, networkId)
      
      const acc = await web3.eth.getAccounts();
      setAccount(acc[0]);
      setLoadin()
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
      setContracts({...state.contracts, lpstaking});
      window.lpstaking = lpstaking;

      const networkId = await web3.givenProvider.networkVersion;
      setNetworkId(networkId);
      console.log(`networkId`, networkId);
    } catch (error) {
      console.log(error);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // window.ethereum.on('accountsChanged', (data) =>
  //   console.log(`data`, data)
  // );
  //FUNCTION
  const addLiquidityAndReturnLP = async (ammount) => {
      console.log(state.account);
    if(state.account){
      try {
        await state.contracts.lpstaking.methods.swapAddLiquidityAndStakeLP().send({from: state.account, value: web3.utils.toWei(ammount)});
      } catch (error) {
        console.log(`error`, error)
      }
    }
  }

  const getRewards = async () => {
    if(state.account){
      try {
        const rw = await state.contracts.lpstaking.methods
        .rewards(state.account)
        .call((err, res) => {
          return res;
        });
        return(rw)
      } catch (error) {
        console.log(`error`, error)
      }
    }
  }

  const lastUpdateTime = async () => {
    if(state.account){
      try {
        const time = await state.contracts.lpstaking.methods
        .lastUpdateTime()
        .call((err, res) => {
            return res;
        });
        return(time)
      } catch (error) {
        console.log(`error`, error)
      }
    }
  }

  const rewardPerTokenStored = async () => {
      console.log(state);
    if(state.account){
      try {
        const rewarPTS = await state.contracts.lpstaking.methods
        .rewardPerTokenStored()
        .call((err, res) => {
            return res;
        });
        return(rewarPTS)
      } catch (error) {
        console.log(`error`, error)
      }
    }
  }

  const totalSupply = async () => {
    if(state.account){
      try {
        const ts = await state.contracts.lpstaking.methods
        .totalSupply()
        .call((err, res) => {
          return res;
          });
        return(ts)
      } catch (error) {
        console.log(`error`, error)
      }
    }
  }

  const userRewardPerTokenPaid = async () => {
    if(state.account){
      try {
        const userRPTP = await state.contracts.lpstaking.methods
        .userRewardPerTokenPaid(state.account)
        .call((err, res) => {
            return res;
        });
        return(userRPTP)
      } catch (error) {
        console.log(`error`, error)
      }
    }
  }

  const rewardRate = async () => {
    if(state.account){
      try {
        const testeo = await state.contracts.lpstaking.methods
        .rewardRate()
        .call((err, res) => {
          console.log(res);
          return res;
          });
          return(testeo)
      } catch (error) {
        console.log(`error`, error)
      }
    }
  }

  const balances = async () => {
    if(state.account){
      try {
        const balance = await state.contracts.lpstaking.methods
        .balances(state.account)
        .call((err, res) => {
            console.log(res);
            return res;
        });
        return{balance}
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
        addLiquidityAndReturnLP,
        getRewards,
        lastUpdateTime,
        rewardPerTokenStored,
        totalSupply,
        userRewardPerTokenPaid,
        rewardRate,
        balances
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};
