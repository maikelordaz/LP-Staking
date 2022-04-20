import React, {useState} from "react";
import { Row, Col, Button, Modal, Form } from "react-bootstrap";
const Rewards = () => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
      <Row className='stats-container border-custom'>
        <Col md={12}>
          <div className="quantity-stats super-center" style={{justifyContent:'space-between'}}>
            <div className="tittle-card">
              Rewards
            </div>
            <div>
              <Button variant="primary" style={{marginRight:'1em'}} onClick={handleShow}>Claim</Button>
              <Button variant="secondary">Stake</Button>
            </div>
          </div>
        </Col>
        <hr/>
        <Col>
          <div className="quantity-stats">
            <div className="tittle-stats">Total Rewards to Date</div>
            <div className="tittle-stats">--</div>
          </div>
        </Col>
        <Col>
          <div className="quantity-stats">
            <div className="tittle-stats">Claimable Rewards</div>
            <div className="tittle-stats">--</div>
          </div>
        </Col>
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title className="quantity-stats">Claim Rewards</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label className="tittle-card">Claimable Rewards</Form.Label>
                <Form.Control type="number" placeholder="0 tokens" />
              </Form.Group>
            </Form>
            <div className="d-grid gap-2">
              <Button variant="primary" size="lg" style={{marginBottom:'1em'}}>
                Stake my Rewards
              </Button>
              <Button variant="secondary" size="lg" style={{marginBottom:'1em'}}>
                Withdraw Rewards
              </Button>
            </div>
          </Modal.Body>
      </Modal>
      </Row>
  );
}

export default Rewards;