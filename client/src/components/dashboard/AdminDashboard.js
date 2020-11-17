import React, { useEffect, useState } from 'react'
import { Container, Row, Col} from 'react-bootstrap'
import Base from '../core/Base'
import { getCurrentUser } from './helper/apiUser'

function AdminDashboard() {

    const [values,setValues] = useState({})

    const preload = () => {
        getCurrentUser()
            .then(data => {
                setValues(data)
            })
    }

    useEffect(()=>{
        preload()
    },[])
    return (
        <Base title="Admin Dashboard">
            <Container>
                <Row className="justify-content-md-center">
                    <Col md="5">
                        <table className="table table-striped">
                                <tr>
                                    <th>Name</th>
                                    <td>{values.name}</td>
                                </tr>
                                <tr>
                                    <th>Email</th>
                                    <td>{values.email}</td>
                                </tr>
                                <tr>
                                    <th>Role</th>
                                    <td>Admin</td>
                                </tr>
                        </table>
                    </Col>
                </Row>
            </Container>
        </Base>
    )
}

export default AdminDashboard
