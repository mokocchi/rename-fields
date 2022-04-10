import { React, useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import FieldsTable from '../components/FieldsTable'
import Header from '../components/Header'

function Home () {
  const [targetAppfields, setTargetAppfields] = useState([])
  const [originalFields, setOriginalFields] = useState([])
  const [columns, setColumns] = useState([])
  const [data, setData] = useState([])
  return (
    <Container>
      <Row>
        <Col>
          <h2>
            Página principal
          </h2>
        </Col>
      </Row>
      <Row>
        <Col style={{ border: '1px solid black', padding: '2em' }}>
          <Row>
            <Col>
              <Header
                targetAppfields={targetAppfields} setTargetAppfields={setTargetAppfields}
                originalFields={originalFields} setOriginalFields={setOriginalFields}
                setColumns={setColumns} setData={setData}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <FieldsTable targetAppfields={targetAppfields} originalFields={originalFields} columns={columns} data={data} />
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  )
}

export default Home
