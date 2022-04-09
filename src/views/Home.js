import { React } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import FieldsTable from '../components/FieldsTable'
import UploadFile from '../components/UploadFile'

const Home = () => (
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
            <UploadFile />
          </Col>
        </Row>
        <Row>
          <Col>
            <FieldsTable />
          </Col>
        </Row>
      </Col>
    </Row>
  </Container>
)

export default Home
