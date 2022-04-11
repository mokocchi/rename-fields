import { React, useState } from 'react'
import { Button, Col, Form, Row, Spinner } from 'react-bootstrap'
import Settings from './Settings'

function Header ({
  targetAppfields, setTargetAppfields, setOriginalFields, setData, separator, setSeparator,
  setLoadConfigurations, setConfigurations, configurations,
  setChosenTargetFields, chosenTargetFields
}) {
  const [fileName, setFileName] = useState('')
  const [file, setFile] = useState()
  const [loading, setLoading] = useState(false)
  const [encoding, setEncoding] = useState('utf-8')

  const pattern = () => (separator === 'comma') ? /,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/ : /;(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/

  const processData = dataString => {
    const dataStringLines = dataString.split(/\r\n|\n/)
    const headers = dataStringLines[0].split(pattern())
    setOriginalFields(headers)
    setData(dataStringLines)
    setLoading(false)
    setLoadConfigurations(true)
  }

  const handleSelect = e => {
    setFile(e.target.files[0])
    setFileName(e.target.files[0].name)
  }

  const handleFileUpload = () => {
    setLoading(true)
    const reader = new FileReader()
    reader.onload = event => processData(event.target.result)
    reader.readAsText(file, encoding)
  }

  const handleSeparator = e => setSeparator(e.target.value)

  const handleEncoding = e => setEncoding(e.target.value)

  return (
    <Row>
      <Col className='md'>
        <Form.Group controlId='formFile' className='mb-3'>
          <Row>
            <Col className='md'>
              <Form.Label>Subir CSV</Form.Label>
              <Form.Select className='mt3' onChange={handleSeparator}>
                <option value='comma'>Separado por comas (,)</option>
                <option value='semicolon'>Separado por punto y coma (;)</option>
              </Form.Select>
              <Form.Select className='mt3' onChange={handleEncoding}>
                <option value='UTF-8'>Unicode</option>
                <option value='ISO-8859-3'>Latino 3</option>
              </Form.Select>
              <Form.Control className='mt3' type='file' accept='.csv' onChange={handleSelect} />
              {(fileName !== '') &&
                (loading
                  ? (
                    <Button className='mt-3 float-end' variant='secondary'>
                      <Spinner title='Procesando' animation='border' role='status' />
                    </Button>)
                  : <Button onClick={handleFileUpload} className='mt-3 float-end' variant='primary'>Procesar</Button>
                )}
            </Col>
          </Row>
        </Form.Group>
      </Col>
      <Col>
        <Settings
          targetAppfields={targetAppfields} setTargetAppfields={setTargetAppfields}
          setConfigurations={setConfigurations} configurations={configurations}
          setChosenTargetFields={setChosenTargetFields} chosenTargetFields={chosenTargetFields}
        />
      </Col>
    </Row>
  )
}

export default Header
