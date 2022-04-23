import React from "react";
import HeaderStats from "../../components/HeaderStats";
import MyStake from "../../components/MyStake";
import NavbarHead from "../../components/Navbar";
import Rewards from "../../components/Rewards";

// COMPONENTS
import DashboardLogic from "./DashboardLogic";

const Dashboard = () => {
    const {
        sendEth,
        claimRewards,
        stakeLP,
        withdraw,
        rewards,
        tSupply,
        rRate,
        bal,
        loadingApp,
        rewardClaimed,
        rewardClaimedGlobal,
        myETHAdded,
        myLPStaking
    } = DashboardLogic();

    return (
        <div className="main-container">
            <NavbarHead />

            <HeaderStats bal={bal} tSupply={tSupply} rewards={rewards} />

            {/* <Sidebar/> */}
            <MyStake
                sendEth={sendEth}
                stakeLP={stakeLP}
                withdraw={withdraw}
                bal={bal}
                totalStaked={myLPStaking}
                totalAdded={myETHAdded}
                loading={loadingApp}
            />

            <Rewards
                claimRewards={claimRewards}
                rewards={rewards}
                totalRewards={"--"}
                rRate={rRate}
                rewardClaimed={rewardClaimed}
                rewardClaimedGlobal={rewardClaimedGlobal}
                loading={loadingApp}
            />
        </div>
    );
};

export default Dashboard;
