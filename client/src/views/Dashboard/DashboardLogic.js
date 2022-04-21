import { useContext, useEffect, useState} from "react";
import { Web3Context } from "../../web3";

const DashboardLogic = () => {
  const { web3, addLiquidityAndReturnLP, getRewards, lastUpdateTime, rewardPerTokenStored, userRewardPerTokenPaid, rewardRate, balances } = useContext(Web3Context);

  const [rewards, setRewards] = useState()
  const [updateTime, setUpdateTime] = useState()
  const [rewardTokenStored, setRewardTokenStored] = useState()
  const [tSupply, setTSupply] = useState()
  const [rewardPerTokenPaid, setRewardPerTokenPaid] = useState()
  const [rRate, setRRate] = useState()
  const [bal, setBal] = useState()


  const sendEth = async (ammount) => {
    if(web3){
      let resp = await addLiquidityAndReturnLP(ammount);
      console.log('resp', resp)
    }
  }

  const getR = async () => {
    if(web3){
      let resp = await getRewards();
      setRewards(resp)
    }
  }

  const getLastUpdateTime = async () => {
    if(web3){
      let resp = await lastUpdateTime();
      setUpdateTime(resp)
    }
  }

  const getRewardPerTokenStored = async () => {
    if(web3){
      let resp = await rewardPerTokenStored();
      setRewardTokenStored(resp)
    }
  }
  
  const getTotalSupply = async () => {
    if(web3){
      let resp = await rewardPerTokenStored();
      setTSupply(resp)
    }
  }

  const getUserRewardPerTokenPaid = async () => {
    if(web3){
      let resp = await userRewardPerTokenPaid();
      setRewardPerTokenPaid(resp)
    }
  }

  const getRewardRate = async () => {
    if(web3){
      let resp = await rewardRate();
      setRRate(resp)
    }
  }

  const getBalances = async () => {
    if(web3){
      let resp = await balances();
      setBal(resp)
      console.log('balances', resp)
    }
  }

  useEffect(() => {
    if(web3){
      getR();
      getLastUpdateTime();
      getRewardPerTokenStored();
      getTotalSupply();
      getUserRewardPerTokenPaid();
      getRewardRate();
      getBalances()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [web3])

  return {
    // getData,
    sendEth,
    addLiquidityAndReturnLP,
    rewards,
    updateTime,
    rewardTokenStored,
    tSupply,
    rewardPerTokenPaid,
    rRate,
    bal
  }
}

export default DashboardLogic;