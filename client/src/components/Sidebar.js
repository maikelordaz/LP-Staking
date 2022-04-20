import React, { useState, useEffect, useContext } from "react";
import { Row, Col, Button } from "react-bootstrap";
import { Link } from 'react-router-dom';

import { Web3Context } from "../web3";

export default function Header(props) {
  const { connectWeb3, account, logout, isOwner, lotteryToWaitingPhase, requestWinnerToBePicked } = useContext(Web3Context);
  
  const [auth, setAuth] = useState(false);

  useEffect(() => {
    isOwner().then(resp => {
      setAuth(resp)
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account])

  return (
    <Row className='sidebar-container'>
      <Col sm={12} className="m-0 p-0">
        <Link to="/" style={{textDecoration: 'none', color: "black"}}>
          <Row className={`sidebar-option ${window.location.pathname === "/" ? "active" : ""}`}>
            <Col sm={3} className="text-center">
              <i className="fas fa-home" style={{fontSize: 25}}></i>
            </Col>
            <Col sm={9}>
              Dashboard
            </Col>
          </Row>
        </Link>

        <Link to="/history" style={{textDecoration: 'none', color: "black"}}>
          <Row className={`sidebar-option ${window.location.pathname === "/history" ? "active" : ""}`}>
            <Col sm={3} className="text-center">
            <i className="fas fa-clipboard-list" style={{fontSize: 25}}></i>
            </Col>
            <Col sm={9}>
              History
            </Col>
          </Row>
        </Link>

        {auth && 
          <Row className={`sidebar-option ${window.location.pathname === "/a" ? "active" : ""}`} onClick={requestWinnerToBePicked}>
            <Col sm={3} className="text-center">
            <i className="fas fa-clipboard-list" style={{fontSize: 25}}></i>
            </Col>
            <Col sm={9}>
              Request Winner
            </Col>
          </Row>
        }

        {auth && 
          <Row className={`sidebar-option ${window.location.pathname === "/a" ? "active" : ""}`} onClick={lotteryToWaitingPhase}>
            <Col sm={3} className="text-center">
            <i className="fas fa-clipboard-list" style={{fontSize: 25}}></i>
            </Col>
            <Col sm={9}>
              Lottery To Waiting Phase
            </Col>
          </Row>
        }
      </Col>

      <Col sm={12} className="super-center m-0 p-0" style={{alignItems: 'flex-end'}}>
        {account ? 
          <div className='text-center'>
            <p className="w-100">
              Connected:{" "}
              <a
                href={`https://etherscan.io/address/${account}`}
                target="_blank"
                className="account-link"
                rel="noreferrer"
              >
                {account.substring(0, 4) +
                  "..." +
                  account.substring(38, 42)}
              </a>
            </p>
            <Button
              className="rounded-pill mb-4"
              size="md"
              variant="outline-secondary"
              onClick={logout}
            >
              Logout
            </Button>
          </div>
        :
          <Button
            className="rounded-pill mb-4"
            size="md"
            variant="outline-secondary"
            onClick={connectWeb3}
          >
            Connect Web3
          </Button>
        }
      </Col>

    </Row>
  );
}
