import React from "react";
import { Row, Col } from "react-bootstrap";
const MyStake = () => {
  return (
      <Row className='stats-container border-custom'>
        <Col md={12}>
          <div className="quantity-stats">
            <div className="tittle-card">
              My Stake
            </div>
          </div>
        </Col>
        <hr/>
        <Col>
          <div className="quantity-stats">
            <div className="tittle-stats">Protected Value</div>
            <div className="tittle-stats">--</div>
          </div>
        </Col>
        <Col>
          <div className="quantity-stats">
            <div className="tittle-stats">Claimable Value</div>
            <div className="tittle-stats">--</div>
          </div>
        </Col>
        <Col >
          <div className="quantity-stats">
            <div className="tittle-stats">Total Fees</div>
            <div className="tittle-stats">--</div>
          </div>
        </Col>
      </Row>
  );
}

export default MyStake;