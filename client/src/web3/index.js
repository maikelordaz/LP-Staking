import React, { useReducer, useCallback, createContext, useEffect } from "react";

import { Web3Reducer } from "./reducer";

// WEB3 CONNECTION PACKAGES
import Web3 from "web3";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Torus from "@toruslabs/torus-embed";
import Authereum from "authereum";

import LPStaking from '../utils/abi/LPStaking_Implementation.json';

import {CONTRACT_ADDRESS, CURRENT_NETWORK, DEPLOY_BLOCK} from './constants';

let web3 = null;

const initialState = {
    loading: true,
    connected: false,
    account: null,
    contracts: {},
    networkId: null
};

export const Web3Context = createContext(initialState);

export const Web3Provider = ({ children }) => {
    const [state, dispatch] = useReducer(Web3Reducer, initialState);

    const setLoading = (loading) => {
        dispatch({
            type: "SET_LOADING",
            payload: loading,
        });
    };

    const setConected = (conected) => {
        dispatch({
            type: "SET_CONECTED",
            payload: conected,
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
            window.lpstaking = lpstaking;

            const networkId = await web3.givenProvider.networkVersion;
            setNetworkId(networkId);
            
            const acc = await web3.eth.getAccounts();
            setAccount(acc[0]);

            setConected(true);
            setLoading(false);
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

            setLoading(false);
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
        if(state.account){
            try {
                await state.contracts.lpstaking.methods.swapAddLiquidityAndStakeLP().send({
                    from: state.account,
                    value: web3.utils.toWei(ammount)
                });
            } catch (error) {
                console.log(`error`, error)
            }
        }
    }
    
    const claimRewardsContract = async (cant) => {
        console.log('cant', cant)
        if(state.account){
            try {
                await state.contracts.lpstaking.methods.getReward().send({
                    from: state.account,
                    value: 0
                });
            } catch (error) {
                console.log(`error`, error)
            }
        }
    }
    
    const stakeLPContract = async (amount) => {
        if(state.account){
            console.log('amount', amount)
            try {
                await state.contracts.lpstaking.methods.stakeLPWithoutPermit(amount).send({
                    from: state.account,
                    value: 0
                });
            } catch (error) {
                console.log(`error`, error)
            }
        }
    }
    
    const withdrawContract = async (amount) => {
        if(state.account){
            try {
                await state.contracts.lpstaking.methods.withdraw(amount).send({
                    from: state.account,
                    value: 0
                });
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

    const rewardRate = async () => {
        if(state.account){
            try {
                const testeo = await state.contracts.lpstaking.methods
                .rewardRate()
                .call((err, res) => {
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
                    return res;
                });

                return{balance}
            } catch (error) {
                console.log(`error`, error)
            }
        }
    }

    const getEventLPStaked = async () => {
        if(state.account){
            let myLPSateked = await state.contracts.lpstaking
            .getPastEvents('LPStaked', {fromBlock: DEPLOY_BLOCK, toBlock: 'latest'});
            let events = [];
            for (const element of myLPSateked) {
              let x = element.returnValues;
              x.eventType = "LP Staked"
                  events.push(x);
            }
            console.log('events', events)
            return events;
        }
    }

    const getEventRewardClaimed = async () => {
        if(state.account){
            let myRewardClaimed = await state.contracts.lpstaking
            .getPastEvents('RewardClaimed', {fromBlock: DEPLOY_BLOCK, toBlock: 'latest'});
            let events = [];
            for (const element of myRewardClaimed) {
              let x = element.returnValues;
              x.eventType = "Reward Claimed"
              if(x.account === state.account){
                  events.push(x);
              }
            }
            console.log('events', events)
            return events;
        }
    }

    const getEventRewardClaimedGlobal = async () => {
        if(state.account){
            let myRewardClaimed = await state.contracts.lpstaking
            .getPastEvents('RewardClaimed', {fromBlock: DEPLOY_BLOCK, toBlock: 'latest'});
            let events = [];
            for (const element of myRewardClaimed) {
              let x = element.returnValues;
              x.eventType = "Reward Global Claimed"
                  events.push(x);
            }
            console.log('events', events)
            return events;
        }
    }

    const getEventETHAdded = async () => {
        if(state.account){
            let myETHAdded = await state.contracts.lpstaking
            .getPastEvents('ETHAdded', {fromBlock: DEPLOY_BLOCK, toBlock: 'latest'});
            let events = [];
            for (const element of myETHAdded) {
              let x = element.returnValues;
              x.eventType = "ETH added"
                  events.push(x);
            }
            console.log('events', events)
            return events;
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
                claimRewardsContract,
                stakeLPContract,
                withdrawContract,
                getRewards,
                totalSupply,
                rewardRate,
                balances,
                getEventRewardClaimed,
                getEventLPStaked,
                getEventRewardClaimedGlobal,
                getEventETHAdded
            }}
        >
            {children}
        </Web3Context.Provider>
    );
};
