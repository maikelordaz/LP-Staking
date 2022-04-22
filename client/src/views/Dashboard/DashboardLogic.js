import { useContext, useEffect, useState} from "react";
import { Web3Context } from "../../web3";

const DashboardLogic = () => {
    const {
        web3,
        addLiquidityAndReturnLP,
        claimRewardsContract,
        stakeLPContract,
        withdrawContract,
        getRewards,
        rewardRate,
        balances,
        loading,
        totalSupply
    } = useContext(Web3Context);
    
    const [rewards, setRewards] = useState();
    const [tSupply, setTSupply] = useState();
    const [rRate, setRRate] = useState();
    const [bal, setBal] = useState();


    const sendEth = async (ammount) => {
        if(web3){
            let resp = await addLiquidityAndReturnLP(ammount);
            getBalances()
            console.log('resp', resp)
        }
    }
    
    const claimRewards = async () => {
        if(web3){
            await claimRewardsContract();
        }
    }
    
    const stakeLP = async () => {
        if(web3){
            await stakeLPContract();
        }
    }
    
    const withdraw = async () => {
        if(web3){
            await withdrawContract();
        }
    }

    const getR = async () => {
        if(web3){
            let resp = await getRewards();
            setRewards(resp)
        }
    }
  
    const getTotalSupply = async () => {
        let resp = await totalSupply();
        setTSupply(resp)
    }

    const getRewardRate = async () => {
        let resp = await rewardRate();
        setRRate(resp)
    }

    const getBalances = async () => {
        let resp = await balances();
        setBal(resp)
    }

    useEffect(() => {
        if(web3 && !loading){
            getR();
            getTotalSupply();
            getRewardRate();
            getBalances();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [web3, loading])

    return {
        sendEth,
        claimRewards,
        stakeLP,
        withdraw,
        getBalances,
        rewards,
        tSupply,
        rRate,
        bal
    }
}

export default DashboardLogic;