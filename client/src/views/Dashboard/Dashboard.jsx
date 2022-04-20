import React, { useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import HeaderStats from "../../components/HeaderStats";
import MyStake from "../../components/MyStake";
import NavbarHead from "../../components/Navbar";
import PoolCard from "../../components/PoolCard";
import Rewards from "../../components/Rewards";

// COMPONENTS
import Sidebar from "../../components/Sidebar";
import DashboardLogic from "./DashboardLogic";

const Dashboard = () => {
    const { getData, pools } = DashboardLogic();

    useEffect(() => {
        getData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="main-container">
            <NavbarHead />
            <HeaderStats />
            {/* <Sidebar/> */}
            <MyStake />
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
