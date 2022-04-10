import { React, useState } from 'react'
import { Button, Col, Form, Row, Spinner } from 'react-bootstrap'
import Settings from './Settings'
import { read, utils } from 'xlsx'

function Header ({ targetAppfields, setTargetAppfields, setOriginalFields, setColumns, setData }) {
  const [fileName, setFileName] = useState('')
  const [file, setFile] = useState()
  const [loading, setLoading] = useState(false)

  const processData = dataString => {
    const dataStringLines = dataString.split(/\r\n|\n/)
    const headers = dataStringLines[0].split(/,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/)
    setOriginalFields(headers)
    setLoading(false)
  }

  const handleSelect = e => {
    setFile(e.target.files[0])
    setFileName(e.target.files[0].name)
  }

  const handleFileUpload = () => {
    setLoading(true)
    const reader = new FileReader()
    reader.onload = (evt) => {
      /* Parse data */
      const bstr = evt.target.result
      const wb = read(bstr, { type: 'binary' })
      /* Get first worksheet */
      const wsname = wb.SheetNames[0]
      const ws = wb.Sheets[wsname]
      /* Convert array of arrays */
      const data = utils.sheet_to_csv(ws, { header: 1 })
      processData(data)
    }
    reader.readAsBinaryString(file)
  }
  return (
    <Row>
      <Col>
        <Form.Group controlId='formFile' className='mb-3'>
          <Form.Label>Subir CSV</Form.Label>
          <Form.Control type='file' accept='.csv' onChange={handleSelect} />
          {(fileName !== '') &&
            (loading
              ? (
                <Button className='mt-3 float-end' variant='secondary'>
                  <Spinner title='Procesando' animation='border' role='status' />
                </Button>)
              : <Button onClick={handleFileUpload} className='mt-3 float-end' variant='primary'>Procesar</Button>
            )}
        </Form.Group>
      </Col>
      <Col>
        <Settings targetAppfields={targetAppfields} setTargetAppfields={setTargetAppfields} />
      </Col>
    </Row>
  )
}

export default Header
