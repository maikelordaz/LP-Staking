import { useState, useEffect, useContext } from "react";
import { Web3Context } from "../../web3";

const DashboardLogic = () => {
  const { account, web3, getLotteries } = useContext(Web3Context);

  //state
  const [pools, setPools] = useState([]);

  const getData = async () => {
    if(web3){
      let resp = await getLotteries();
      console.log('resp', resp)
      setPools(resp)
    }
  }

  useEffect(() => {
    if(web3) getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, web3])

  return {
    getData,
    pools
  }
}

export default DashboardLogic;