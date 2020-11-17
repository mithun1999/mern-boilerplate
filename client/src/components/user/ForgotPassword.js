import React, {useState} from 'react'
import {Link,Redirect} from "react-router-dom";
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap'
import Base from '../core/Base'
import { forgotPassword } from '../auth/helper';

function ForgotPassword() {

    const [values,setValues] = useState({
        email: "deadslayer40@gmail.com",
        error: "",
        success: false,
        loading: false,
        message: ""
    })

    const {email,error,success,loading,message} = values

    const handleChange = event => {
        setValues({...values, email:event.target.value})
    }

    const onSubmit = (event) => {
        event.preventDefault()
        setValues({...values, loading: true})
        forgotPassword({email})
            .then(response => {
                console.log(response)
                if(response.error){
                    setValues({...values, loading:false, error: response.error})
                }else{
                    setValues({...values, loading:false, success: true, message: response.message})
                }
            })
    }

    const errorMessage = () => (
        <Container style={{display: error?"":"none"}}>
            <Row className="justify-content-md-center">
                <Col md="6">
                    <Alert variant="danger">{error}</Alert>
                </Col>
            </Row>
        </Container>
    )

    const loadingMessage = () => (
        <Container style={{display: loading?"":"none"}}>
            <Row className="justify-content-md-center">
                <Col md="6">
                    <Alert variant="primary">Loading...</Alert>
                </Col>
            </Row>
        </Container>
    )

    const successMessage = () => (
        <Container style={{display: success?"":"none"}}>
            <Row className="justify-content-md-center">
                <Col md="6">
                    <Alert variant="success">{message}</Alert>
                </Col>
            </Row>
        </Container>
    )

    const forgotForm = () => (
        <Container>
        <Row className="justify-content-md-center">
            <Col md="6">
                <Form>
                    <Form.Group controlId="emailrow">
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control type="text" placeholder="Enter your email address" onChange={handleChange} value={email} />
                    </Form.Group>
                    <Button className="btn-grad" onClick={onSubmit}>Submit</Button>
                </Form>
            </Col>
        </Row>
    </Container>
    )

    return (
        <Base title="Forgot Password?">
            {errorMessage()}
            {successMessage()}
            {loadingMessage()}
            {forgotForm()}
        </Base>
    )
}

export default ForgotPassword
