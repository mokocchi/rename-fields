import { React, useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import FieldsTable from '../components/FieldsTable'
import Header from '../components/Header'

function Home () {
  const [targetAppfields, setTargetAppfields] = useState([])
  const [originalFields, setOriginalFields] = useState([])
  const [loadConfigurations, setLoadConfigurations] = useState(false)
  const [data, setData] = useState([])
  const [separator, setSeparator] = useState('comma')
  const [configurations, setConfigurations] = useState({})
  const [chosenTargetFields, setChosenTargetFields] = useState([])
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
                setLoadConfigurations={setLoadConfigurations}
                setConfigurations={setConfigurations} configurations={configurations}
                chosenTargetFields={chosenTargetFields} setChosenTargetFields={setChosenTargetFields}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              {(data.length > 0) &&
                <FieldsTable
                  targetAppfields={targetAppfields} originalFields={originalFields}
                  data={data} separator={separator} setOriginalFields={setOriginalFields}
                  loadConfigurations={loadConfigurations} setLoadConfigurations={setLoadConfigurations}
                  setConfigurations={setConfigurations} configurations={configurations}
                  chosenTargetFields={chosenTargetFields} setChosenTargetFields={setChosenTargetFields}
                />}
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  )
}

export default Home
