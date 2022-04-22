import React from "react";
import { Row, Col } from "react-bootstrap";

const HeaderStats = ({bal, tSupply, rewards}) => {
    return (
        <Row className='stats-container'>
            <Col className="super-center border-r">
                <div className="quantity-stats">
                    <div className="super-center">
                        {bal ? (bal.balance / 1000000000000000000).toFixed(3) : "--"}
                    </div>

                    <div className="tittle-stats">Balance</div>
                </div>
            </Col>

            <Col className="super-center border-r">
                <div className="quantity-stats">
                    <div className="super-center">
                        {tSupply ? (tSupply / 1000000000000000000).toFixed(3) : "--"}
                    </div>

                    <div className="tittle-stats">Total Supply</div>
                </div>
            </Col>

            <Col className="super-center" >
                <div className="quantity-stats">
                    <div className="super-center">
                        {rewards ? (rewards / 1000000000000000000).toFixed(3) : "--"}
                    </div>

                    <div className="tittle-stats">Rewards</div>
                </div>
            </Col>
        </Row>
    );
}

export default HeaderStats;