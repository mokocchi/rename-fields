import { React, useState } from 'react'
import { Col, Form, Row } from 'react-bootstrap'
import Settings from './Settings'

function Header ({ targetAppfields, setTargetAppfields }) {
  const [fileName, setFileName] = useState('Subir CSV')
  return (
    <Row>
      <Col>
        <Form.Group controlId='formFile' className='mb-3'>
          <Form.Label>{fileName}</Form.Label>
          <Form.Control type='file' onChange={(e) => setFileName(e.target.files[0].name)} />
        </Form.Group>
      </Col>
      <Col>
        <Settings targetAppfields={targetAppfields} setTargetAppfields={setTargetAppfields} />
      </Col>
    </Row>
  )
}

export default Header
