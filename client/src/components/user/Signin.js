import React, {useState} from 'react'
import {Link,Redirect} from "react-router-dom";
import { useDispatch } from "react-redux"
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap'
import Base from '../core/Base'
import { setAuthUser } from '../../actions/userAction'
import {signin,authenticate,isAuthenticated, sendGoogleToken, sendFacebookToken} from '../auth/helper'
import { GoogleLogin } from 'react-google-login'
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import './User.css'

function Signin() {
    const dispatch = useDispatch()
    const googleAPI = process.env.REACT_APP_GOOGLE_CLIENT
    const facebookAPI = process.env.REACT_APP_FACEBOOK_CLIENT

    const [values, setValues] = useState({
        email: "",
        password: "",
        success: false,
        loading: false,
        error: "",
        didRedirect: false
    })

    const {email, password, success, loading, error, didRedirect} = values

    const handleChange = name => event => {
        setValues({...values, error:"", [name]:event.target.value})
    }

    const onSubmit = (event) => {
        event.preventDefault();
        setValues({...values, loading: true})
        signin({email,password})
            .then(response => {
                if(response.error){
                    setValues({...values, loading:false, error:response.error})
                }
                else{
                    dispatch(setAuthUser(response))
                    authenticate(response,()=>{
                        setValues({...values, loading:false, email:"", password:"", didRedirect:true})
                    })
                    //setValues({...values, loading:false, didRedirect:true})
                }
            })
            .catch(err => {
                console.log(err)
            })

    }

    const responseGoogle = (response) => {
        sendGoogleToken(response.tokenId)
        .then(data => {
            console.log(data)
            if(data.error){
                setValues({...values, error: data.error})
            }
            else{
                dispatch(setAuthUser(data))
                authenticate(data,()=>{
                    setValues({...values, loading:false, email:"", password:"", didRedirect:true})
                })
            }
        })
    }

    const responseFacebook = (response) => {
        //console.log(response)
        sendFacebookToken(response.userID, response.accessToken)
        .then(data => {
            //console.log(data)
            if(data.error){
                setValues({...values, error: data.error})
            }
            else{
                dispatch(setAuthUser(data))
                authenticate(data,()=>{
                    setValues({...values, loading:false, email:"", password:"", didRedirect:true})
                })
            }
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
                    <Alert variant="success">Loading...</Alert>
                </Col>
            </Row>
        </Container>
    )

    const performRedirect = ()=>{
/*         if(didRedirect){
            return(<Redirect to="/dashboard" />)
        } */
        if(isAuthenticated() && isAuthenticated().user.role == 0){
            return <Redirect to="/dashboard" />;
        }
        if(isAuthenticated() && isAuthenticated().user.role == 1){
            return <Redirect to="/admin/dashboard" />;
        }
    }

    const socialLoginButton = () => (
        <Container>
            <Row className="justify-content-md-center">
                <Col md="5">
                <GoogleLogin
                  clientId={`${googleAPI}`}
                  onSuccess={responseGoogle}
                  onFailure={responseGoogle}
                  cookiePolicy={'single_host_origin'}
                  render={renderProps => (
                    <a className="btn btn-grad" onClick={renderProps.onClick} disabled={renderProps.disabled}><i className="fa fa-google"></i>&nbsp; &nbsp; Sign in with Google</a>
                  )}
                  /><br/>
                </Col>
            </Row>
            <Row className="justify-content-md-center">
                <Col md="5">
                <FacebookLogin
                  appId={`${facebookAPI}`}
                  autoLoad={false}
                  callback={responseFacebook}
                  render={renderProps => (
                    <a className="btn btn-grad" onClick={renderProps.onClick}><i className="fa fa-facebook"></i>&nbsp; &nbsp; Sign in with Facebook</a>
                  )}
                  />
                  <br/>
                </Col>
            </Row>
        </Container>
    )

    const signInForm = () => (
        <Container>
            <Row className="justify-content-md-center">
                <Col md="5">
                    <Form>
                        <Form.Group controlId="emailrow">
                            <Form.Label>Email Address</Form.Label>
                            <Form.Control type="text" placeholder="Enter your email address" onChange={handleChange("email")} value={email} />
                        </Form.Group>
                        <Form.Group controlId="passwordrow">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="Enter your password" onChange={handleChange("password")} value={password} />
                        </Form.Group>
                        <Button className="btn-grad" onClick={onSubmit}>Sign In</Button>
                    </Form><br/>
                    <Link className="underline-none" to="/forgotpassword">Forgot Password? Click here</Link>
                </Col>
            </Row>
        </Container>
    )

    return (
        <Base title="Sign In">
            {errorMessage()}
            {loadingMessage()}
            {socialLoginButton()}
            {signInForm()}
            {performRedirect()}
        </Base>
    )
}

export default Signin
