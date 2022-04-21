import React from "react";
import HeaderStats from "../../components/HeaderStats";
import MyStake from "../../components/MyStake";
import NavbarHead from "../../components/Navbar";
import Rewards from "../../components/Rewards";

// COMPONENTS
import DashboardLogic from "./DashboardLogic";

const Dashboard = () => {
    const { sendEth } = DashboardLogic();

    // useEffect(() => {
    //     getData();
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, []);

    return (
        <div className="main-container">
            <NavbarHead />
            <HeaderStats />
            {/* <Sidebar/> */}
            <MyStake sendEth={sendEth} />
            <Rewards />
            {/* <div className='app-container super-center'>
                  <Row className="data-container">
                    {pools?.map((lottery, index) => (
                      <Col sm={6} key={index}>
                        <PoolCard lottery={lottery}/>
                      </Col>
                    ))}
                  </Row>
                </div> */}
        </div>
    );
};

export default Dashboard;
