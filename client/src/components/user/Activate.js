import React, { useEffect, useState } from 'react'
import {useHistory} from "react-router-dom"
import { Container, Row, Col, Button, Alert } from 'react-bootstrap'
import jwt from 'jsonwebtoken'
import { activateAccount } from '../auth/helper'
import Base from '../core/Base'
import './User.css'

function Activate({match}) {
    const history = useHistory()
    const token = match.params.token

    const [values, setValues] = useState({
        name: "",
        error: "",
        success: false
    })

    const {name, error, success} = values

    const preload = () =>{
        const {name} = jwt.decode(token)
        setValues({...values, name: name})
    }

    const activate = () => {
        activateAccount({token})
            .then(response => {
                if(response.error){
                    setValues({...values, error: response.error})
                }
                else{
                    setValues({...values, error:"", success: true})
                }
            })
    }

    useEffect(()=>{
        preload()
        activate()
    },[])

    const successMessage = () => (
        <Container style={{display: success?"":"none"}}>
            <Row className="justify-content-md-center">
                <Col md="6">
                    <h3 className="text-center">Your account has been activated.</h3>
                </Col>
            </Row>
            <Row className="justify-content-md-center">
                <Col md="2">
                <Button className="btn-grad" onClick={()=>history.push('/signin')}>Sign In</Button>
                </Col>
            </Row>
        </Container>
    )

    const errorMessage = () => (
        <Container style={{display: error?"":"none"}}>
            <Row className="justify-content-md-center">
                <Col md="6">
                    <Alert variant="danger">{error}</Alert>
                </Col>
            </Row>
            <Row className="justify-content-md-center">
                <Col md="2">
                <Button className="btn-grad" onClick={()=>history.push('/signup')}>Sign Up</Button>
                </Col>
            </Row>
        </Container>
    )

    return (
        <Base title={`Account Activation`}>
            {successMessage()}
            {errorMessage()}
        </Base>
    )
}

export default Activate
