import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Dashboard from "./views/Dashboard/Dashboard";
// import History from "./views/History/History";
// import { Web3Context } from "./web3";

const Routes = () => {
  // const { account, isOwner } = useContext(Web3Context);

  // const [auth, setAuth] = useState(false);

  // useEffect(() => {
  //   isOwner().then(resp => {
  //     setAuth(resp)
  //   });
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [account])

  return (
    <>
      <BrowserRouter>
        <Switch> 
          {/* {auth && <Route exact path="/mint-nft" component={Dashboard}/>} */}

          <Route exact path="/" component={Dashboard}/>
          {/* <Route exact path="/history" component={History}/> */}
          
          <Route exact component={Dashboard}/>
        </Switch>
      </BrowserRouter>
    </>
  );
}

export default Routes;
