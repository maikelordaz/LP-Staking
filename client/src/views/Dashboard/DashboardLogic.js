import { useState, useEffect, useContext } from "react";
import { Web3Context } from "../../web3";

const DashboardLogic = () => {
  const { account, web3, addLiquidityAndReturnLP } = useContext(Web3Context);

  //state
  const [pools, setPools] = useState([]);

  const sendEth = async (ammount) => {
    if(web3){
      let resp = await addLiquidityAndReturnLP(ammount);
      console.log('resp', resp)
    }
  }

  // useEffect(() => {
  //   if(web3) getData();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [account, web3])

  return {
    // getData,
    pools,
    addLiquidityAndReturnLP,
    sendEth
  }
}

export default DashboardLogic;