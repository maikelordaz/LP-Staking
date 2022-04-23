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
        totalSupply,
        loading,
        getEventRewardClaimed,
        getEventRewardClaimedGlobal,
        getEventLPStaked,
        getEventETHAdded
    } = useContext(Web3Context);
    
    const [rewards, setRewards] = useState();
    const [tSupply, setTSupply] = useState();
    const [rRate, setRRate] = useState();
    const [bal, setBal] = useState();

    //events
    const [rewardClaimed, setRewadClaimed] = useState();
    const [rewardClaimedGlobal, setRewadClaimedGlobal] = useState();
    const [myETHAdded, setMyETHAdded] = useState();
    const [myLPStaking, setMyLPStaking] = useState();

    //events
    const [loadingApp, setLoadingApp] = useState(false);


    const sendEth = async (ammount) => {
        setLoadingApp(true)
        if(web3){
            let resp = await addLiquidityAndReturnLP(ammount);
            getBalances()
            setLoadingApp(false)
            console.log('resp', resp)
        }
    }
    
    const claimRewards = async (cant) => {
        setLoadingApp(true)
        if(web3){
            await claimRewardsContract(cant);
            reGet()
            setLoadingApp(false)
        }
    }
    
    const stakeLP = async (lp) => {
        setLoadingApp(true)
        if(web3){
            await stakeLPContract(lp);
            reGet()
            setLoadingApp(false)
        }
    }
    
    const withdraw = async (amount) => {
        setLoadingApp(true)
        if(web3){
            await withdrawContract(amount);
            reGet()
            setLoadingApp(false)
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

    //get events
        const getRewardClaimed = async () => {
            let resp = await getEventRewardClaimed();
            setRewadClaimed(resp)
            console.log('My R C', resp)
        }

        const getRewardClaimedGlobal = async () => {
            let resp = await getEventRewardClaimedGlobal();
            setRewadClaimedGlobal(resp)
            console.log('global R C', resp)
        }

        const getMyETHAdded = async () => {
            let resp = await getEventETHAdded();
            setMyETHAdded(resp)
            console.log('eth added', resp)
        }

        const getMyLPStaking = async () => {
            let resp = await getEventLPStaked();
            setMyLPStaking(resp)
            console.log('LP Staking', resp)
        }

    //get events

    const reGet = () =>{
        if(web3 && !loading){
            getR();
            getTotalSupply();
            getRewardRate();
            getBalances();
            getRewardClaimed();
            getRewardClaimedGlobal();
            getMyETHAdded();
            getMyLPStaking();
        }
    }
    useEffect(() => {
        if(web3 && !loading){
            getR();
            getTotalSupply();
            getRewardRate();
            getBalances();
            getRewardClaimed();
            getRewardClaimedGlobal();
            getMyETHAdded();
            getMyLPStaking();
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
        bal,
        loadingApp,
        rewardClaimed,
        rewardClaimedGlobal,
        myETHAdded,
        myLPStaking
    }
}

export default DashboardLogic;