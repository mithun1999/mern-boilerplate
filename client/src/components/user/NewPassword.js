import React, {useState,useEffect} from 'react'
import {useHistory} from "react-router-dom";
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap'
import Base from '../core/Base'
import { resetPassword } from '../auth/helper';

function NewPassword({match}) {
    const history = useHistory()

    const [values,setValues] = useState({
        resetToken:"",
        newPassword:"",
        confirmPassword:"",
        error:"",
        success:false,
        loading:false,
        message:""
    })

    const {resetToken,newPassword,confirmPassword,error,success,loading,message} = values

    const preload = () => {
        setValues({...values, resetToken: match.params.token})
    }

    useEffect(()=>{
        preload()
    },[])

    const handleChange = name => event => {
        setValues({...values, error:"", [name]:event.target.value})
    }

    const onSubmit = (event) => {
        event.preventDefault()
        if(newPassword === confirmPassword){
            setValues({...values, loading: true})
            resetPassword({resetToken,newPassword})
            .then(response => {
                if(response.error){
                    setValues({...values, loading:false, error:response.error})
                }
                else{
                    setValues({...values, loading:false, message:response.message, success:true , newPassword:"", confirmPassword:""})
                    setTimeout(() => { 
                        history.push('/signin')
                    }, 5000)
                }
            })
        }
        else{
            setValues({...values, error:"Password and Confirm Password mismatch"})
        }
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

    const newPasswordForm = () => (
        <Container>
        <Row className="justify-content-md-center">
            <Col md="6">
                <Form>
                    <Form.Group controlId="pwdrow">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Enter your new password" onChange={handleChange("newPassword")} value={newPassword} />
                    </Form.Group>
                    <Form.Group controlId="confirmpwdrow">
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control type="password" placeholder="Re-enter your password" onChange={handleChange("confirmPassword")} value={confirmPassword} />
                    </Form.Group>
                    <Button className="btn-grad" onClick={onSubmit}>Submit</Button>
                </Form>
            </Col>
        </Row>
    </Container>
    )
    return (
        <Base title="Password Recovery">
            {errorMessage()}
            {successMessage()}
            {loadingMessage()}
            {newPasswordForm()}
        </Base>
    )
}

export default NewPassword
