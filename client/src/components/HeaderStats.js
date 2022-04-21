import React from "react";
import { Row, Col } from "react-bootstrap";
const HeaderStats = () => {
  return (
      <Row className='stats-container'>
        <Col className="super-center border-r">
          <div className="quantity-stats">
            <div className="super-center">
              --
            </div>
            <div className="tittle-stats">Total Liquidity</div>
          </div>
        </Col>
        <Col className="super-center border-r">
          <div className="quantity-stats">
            <div className="super-center">
              --
            </div>
            <div className="tittle-stats">Token Price</div>
          </div>
        </Col>
        <Col className="super-center" >
          <div className="quantity-stats">
            <div className="super-center">
              --
            </div>
            <div className="tittle-stats">Total Token Staked</div>
          </div>
        </Col>
      </Row>
  );
}

export default HeaderStats;