import React, {useState} from 'react'
import {Link, useHistory} from "react-router-dom";
import { useDispatch } from "react-redux"
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap'
import Base from '../core/Base'
import { setAuthUser } from '../../actions/userAction'
import {signin,authenticate,isAuthenticated,signup} from '../auth/helper'
import './User.css'

function Signin() {
    const history = useHistory()


    const [values, setValues] = useState({
        name: "",
        email: "",
        password: "",
        loading: false,
        error: "",
        success: false
    })

    const {name, email, password, loading, error, success} = values

    const handleChange = name => event => {
        setValues({...values, error:"", [name]:event.target.value})
    }

    const onSubmit = (event) => {
        event.preventDefault();
        setValues({...values, loading: true})
        signup({name,email,password})
            .then(response => {
                if(response.error){
                    setValues({...values, loading:false, error:response.error})
                }
                else{
                    setValues({...values, name:"", email:"", password:"", loading:false, success:true})
                }
            })
            .catch(err => {
                console.log(err)
            })

    }

    const errorMessage = () => (
        <Container style={{display: error?"":"none"}}>
            <Row className="justify-content-md-center">
                <Col md="5">
                    <Alert variant="danger">{error}</Alert>
                </Col>
            </Row>
        </Container>
    )

    const loadingMessage = () => (
        <Container style={{display: loading?"":"none"}}>
            <Row className="justify-content-md-center">
                <Col md="5">
                    <Alert variant="primary">Loading...</Alert>
                </Col>
            </Row>
        </Container>
    )

    const successMessage = () => (
        <Container style={{display: success?"":"none"}}>
            <Row className="justify-content-md-center">
                <Col md="5">
                    <Alert variant="success">Activation Link sent to registered mail</Alert>
                </Col>
            </Row>
        </Container>
    )


    const signupForm = () => (
        <Container>
            <Row className="justify-content-md-center">
                <Col md="5">
                    <Form>
                        <Form.Group controlId="namerow">
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" placeholder="Enter your name" onChange={handleChange("name")} value={name} />
                        </Form.Group>
                        <Form.Group controlId="emailrow">
                            <Form.Label>Email Address</Form.Label>
                            <Form.Control type="text" placeholder="Enter your email address" onChange={handleChange("email")} value={email} />
                        </Form.Group>
                        <Form.Group controlId="passwordrow">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="Enter your password" onChange={handleChange("password")} value={password} />
                        </Form.Group>
                        <Button className="btn-grad" onClick={onSubmit}>Sign Up</Button>
                    </Form><br/>
                    <Link className="underline-none" to="/signin">Already have an account? Sign in</Link>
                </Col>
            </Row>
        </Container>
    )

    return (
        <Base title="Sign up">
            {errorMessage()}
            {successMessage()}
            {loadingMessage()}
            {signupForm()}
        </Base>
    )
}

export default Signin
