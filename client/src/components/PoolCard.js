import React, { useState, useContext } from "react";
import { Row, Col, Button, Modal, Form } from "react-bootstrap";

import { Web3Context } from "../web3";

export default function PoolCard({lottery}) {
  const { enterLottery, withdrawLottery, OwnerWithdraw, isOwner, buyTokens } = useContext(Web3Context);
  const coins = ["ETH", "DAI", "USDC", "USDT"];

  const [enterAmount, setEnterAmount] = useState("");
  const [enterAmountToPay, setEnterAmountToPay] = useState("");
  const [paymentType, setPaymentType] = useState(0);
  const [showEnterModal, setShowEnterModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  const invest = () => {
    enterLottery(paymentType, enterAmountToPay, Number(enterAmount)*Number(lottery.ticketPrice));
  }  
  
  const withdraw = async () => {
    if(await isOwner()){
      OwnerWithdraw(lottery.id);
    }else{
      withdrawLottery(lottery.id);
    }
  }

  return (
    <>
      <Row className='pool-card'>
        <Col sm={7} md={9}>
          <p><b>DAI lottery</b></p>
          <p>total tickets: {lottery.poolOfMony / lottery.ticketPrice}</p>
          <p>total amount: {lottery.poolOfMony} DAI</p>
          <p>ticket price: {lottery.ticketPrice} DAI</p>
        </Col>
        <Col sm={5} md={3} className="super-center">
          <Row>
            <Col sm={12} className="text-center">
              <Button variant="primary" className="my-1 w-100" onClick={()=>setShowEnterModal(true)}>Enter</Button>
            </Col>
            <Col sm={12} className="text-center">
              <Button variant="danger" className="my-1 w-100" onClick={withdraw}>Withdraw</Button>
            </Col>
          </Row>
        </Col>
      </Row>

      <Modal show={showEnterModal} onHide={()=>setShowEnterModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Enter to Lottery</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form.Control style={{marginBottom: '1rem'}} type="text" placeholder="Tickets to buy" value={enterAmount} onChange={e=>setEnterAmount(e.target.value)}/>
          <Form.Group>
            <Form.Control as="select" onChange={(e)=>{setPaymentType(Number(e.target.value))}}>
              <option value="0">ETH</option>
              <option value="1">DAI</option>
              <option value="2">USDC</option>
              <option value="3">USDT</option>
            </Form.Control>
          </Form.Group>
          <Form.Control type="text" placeholder={`${coins[paymentType]} to pay`} value={enterAmountToPay} onChange={e=>setEnterAmountToPay(e.target.value)}/>
        </Modal.Body>

        <Modal.Footer>
          {paymentType !== 0 && <Button variant="primary" onClick={()=>buyTokens(paymentType)}>Trade 1 ETH to {coins[paymentType]}</Button>}
          <Button variant="primary" onClick={invest}>Invest</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
