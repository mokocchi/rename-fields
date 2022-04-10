import { React, useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import FieldsTable from '../components/FieldsTable'
import Header from '../components/Header'

function Home () {
  const [targetAppfields, setTargetAppfields] = useState([])
  const [originalFields, setOriginalFields] = useState([])
  const [data, setData] = useState([])
  const [separator, setSeparator] = useState('comma')
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
                setData={setData} separator={separator} setSeparator={setSeparator}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              {(data.length > 0) &&
                <FieldsTable
                  targetAppfields={targetAppfields} originalFields={originalFields}
                  data={data} separator={separator} setOriginalFields={setOriginalFields}
                />}
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  )
}

export default Home
