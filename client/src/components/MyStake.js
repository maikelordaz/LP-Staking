import React, {useState} from "react";
import { Row, Col, Modal, Form, Button } from "react-bootstrap";
const MyStake = ({sendEth, stakeLP, withdraw, bal, totalStaked, totalAdded}) => {
    const [showAddLiquidity, setShowAddLiquidity] = useState(false);
    const [showStakeLP, setShowStakeLP] = useState(false);
    const [showWithdraw, setShowWithdraw] = useState(false);

    const [eth, setEth] = useState(0);
    const [lp, setLp] = useState(0);

    const handleCloseAddLiquidity = () => setShowAddLiquidity(false);
    const handleShowAddLiquidity = () => setShowAddLiquidity(true);

    const handleCloseStakeLP = () => setShowStakeLP(false);
    const handleShowStakeLP = () => setShowStakeLP(true);

    const handleCloseWithdraw = () => setShowWithdraw(false);
    const handleShowWithdraw = () => setShowWithdraw(true);
    
    return (
        <Row className='stats-container border-custom'>
            <Col md={12}>
                <div className="quantity-stats super-center" style={{justifyContent:'space-between'}}>
                    <div className="tittle-card">
                        My Stake
                    </div>

                    <div>
                        <Button variant="primary" style={{marginRight:'1em'}} onClick={handleShowAddLiquidity}>
                            Send ETH
                        </Button>
                    </div>
                    
                    <div>
                        <Button variant="primary" style={{marginRight:'1em'}} onClick={handleShowStakeLP}>
                            Stake LP
                        </Button>
                    </div>
                    
                    <div>
                        <Button variant="primary" style={{marginRight:'1em'}} onClick={handleShowWithdraw}>
                            Withdraw
                        </Button>
                    </div>
                </div>
            </Col>

            <hr/>

            <Col>
                <div className="quantity-stats">
                    <div className="tittle-stats">
                        Balance
                    </div>

                    <div className="tittle-stats">
                        {bal ? (bal.balance / 1000000000000000000).toFixed(3) : "--"}
                    </div>
                </div>
            </Col>

            <Col>
                <div className="quantity-stats">
                    <div className="tittle-stats">
                        Total LP Staked to Date
                    </div>

                    <div className="tittle-stats">
                        {totalStaked || "--"}
                    </div>
                </div>
            </Col>

            <Col>
                <div className="quantity-stats">
                    <div className="tittle-stats">
                        Total ETH Added to Date
                    </div>

                    <div className="tittle-stats">
                        {totalAdded || "--"}
                    </div>
                </div>
            </Col>

            <Modal show={showAddLiquidity} onHide={handleCloseAddLiquidity}>
                <Modal.Header closeButton>
                    <Modal.Title className="quantity-stats">
                        SEND ETH
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Control type="number" placeholder="0 eth" onChange={(e)=>setEth(e.target.value)}/>
                        </Form.Group>
                    </Form>
                    
                    <div className="d-grid gap-2">
                        <Button variant="primary" size="lg" style={{marginBottom:'1em', width:'100%'}} onClick={()=>sendEth(eth)}>
                            Send ETH
                        </Button>
                    </div>
                </Modal.Body>
            </Modal>
            
            <Modal show={showStakeLP} onHide={handleCloseStakeLP}>
                <Modal.Header closeButton>
                    <Modal.Title className="quantity-stats">
                        Stake LP
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Control type="number" placeholder="0 LP" onChange={(e)=>setLp(e.target.value)}/>
                        </Form.Group>
                    </Form>
                    
                    <div className="d-grid gap-2">
                        <Button variant="primary" size="lg" style={{marginBottom:'1em', width:'100%'}} onClick={()=>stakeLP(lp)}>
                            Stake
                        </Button>
                    </div>
                </Modal.Body>
            </Modal>
            
            <Modal show={showWithdraw} onHide={handleCloseWithdraw}>
                <Modal.Header closeButton>
                    <Modal.Title className="quantity-stats">
                        Withdraw LP
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Control type="number" placeholder="0 eth" onChange={(e)=>setLp(e.target.value)}/>
                        </Form.Group>
                    </Form>
                    
                    <div className="d-grid gap-2">
                        <Button variant="primary" size="lg" style={{marginBottom:'1em', width:'100%'}} onClick={()=>withdraw(lp)}>
                        Withdraw
                        </Button>
                    </div>
                </Modal.Body>
            </Modal>
        </Row>
    );
}

export default MyStake;