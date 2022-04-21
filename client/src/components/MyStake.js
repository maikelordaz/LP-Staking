import React, {useState} from "react";
import { Row, Col, Modal, Form, Button } from "react-bootstrap";
const MyStake = ({sendEth}) => {
  const [show, setShow] = useState(false);
  const [eth, setEth] = useState(0);


  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
      <Row className='stats-container border-custom'>
        <Col md={12}>
          <div className="quantity-stats super-center" style={{justifyContent:'space-between'}}>
            <div className="tittle-card">
              My Stake
            </div>
            <div>
              <Button variant="primary" style={{marginRight:'1em'}} onClick={handleShow}>Send ETH</Button>
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
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title className="quantity-stats">SEND ETH</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label className="tittle-card">Claimable Rewards</Form.Label>
                <Form.Control type="number" placeholder="0 tokens" onChange={(e)=>setEth(e.target.value)}/>
              </Form.Group>
            </Form>
            <div className="d-grid gap-2">
              <Button variant="primary" size="lg" style={{marginBottom:'1em', width:'100%'}} onClick={()=>sendEth(eth)}>
                Send ETH
              </Button>
            </div>
          </Modal.Body>
      </Modal>
      </Row>
  );
}

export default MyStake;