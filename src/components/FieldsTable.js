import { React, useState } from 'react'
import { Button, Col, Form, Row, Table } from 'react-bootstrap'

function FieldsTable ({ targetAppfields, originalFields, columns, data, separator }) {
  const [line, setLine] = useState('')
  const [error, setError] = useState('')
  const formats = [
    'text',
    'integer',
    'date (YYYY/MM/DD o YYYY/MM/DD HH:mm:SS)'
  ]

  const pattern = () => (separator === 'comma') ? /,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/ : /;(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/

  const handleLine = (e) => {
    setLine(e.target.value)
  }

  const handleLineChange = e => {
    if (e.target.value === '') {
      setError('')
      setLine('')
      return
    }
    if (isNaN(Number(e.target.value))) {
      setError('No es un número')
      setLine(e.target.value)
      return
    }
    if (e.target.value < 1) {
      setError('La línea tiene que ser mayor a 1')
      setLine(e.target.value)
      return
    }
    if ((e.target.value > (data.length - 1))) {
      setError(`Fuera de rango: el archivo tiene ${data.length} líneas`)
      setLine(e.target.value)
      return
    }
    setLine(e.target.value)
    setError('')
  }

  const handleKeyDown = e => e.target.code === 'Enter' && handleLineChange()

  return (
    <div>
      <Button className='button mb-3' variant='success'>Agregar campo combinado</Button>
      <Table bordered>
        <thead>
          <tr>
            <th>
              Campo original
            </th>
            <th>
              <Form.Group className='mb-3 needs-validation'>
                <Form.Label>Datos</Form.Label>
                <div className='invalid-feedback d-block'>
                  {error}
                </div>
                <Form.Control className={(error === '') ? ((line !== '') && 'is-valid') : 'is-invalid'} onKeyDown={handleKeyDown} value={line} onChange={handleLineChange} type='text' placeholder='Ingrese un número de línea...' />
              </Form.Group>
            </th>
            <th>
              Campo corregido
            </th>
            <th>
              Formato
            </th>
          </tr>
        </thead>
        <tbody>
          {originalFields.map((of, indexof) => (
            <tr key={indexof}>
              <td>{of}</td>
              <td>{(data.length === 1) ? 'No hay datos' : ((error === '') && (line !== '') ? data[Math.floor(Number(line))].split(pattern())[indexof] : '')}</td>
              <td>
                <Form.Select disabled={targetAppfields.length === 0} onChange={handleLine}>
                  {(targetAppfields.length === 0) &&
                    <option>No hay campos</option>}
                  {targetAppfields.map((tf, indextf) => (
                    <option key={`${indexof}-${indextf}`}>{tf}</option>
                  ))}
                </Form.Select>
              </td>
              <td>
                <Form.Select>
                  {formats.map((format, indexformat) => (
                    <option key={`${indexof}-${indexformat}`}>{format}</option>
                  ))}
                </Form.Select>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Row>
        <Col className='md-9-3'>
          <Button className='button mb-3 btn-block' variant='success'>Exportar archivo</Button>
          <Button className='button mb-3 float-end btn-block' variant='danger'>Enviar a la aplicación</Button>
        </Col>
      </Row>
    </div>
  )
}

export default FieldsTable
