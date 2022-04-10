import { React } from 'react'
import { Button, Col, Form, Row, Table } from 'react-bootstrap'

function FieldsTable ({ targetAppfields, originalFields, columns, data }) {
  const formats = [
    'text',
    'integer',
    'date (YYYY/MM/DD o YYYY/MM/DD HH:mm:SS)'
  ]

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
              <td>
                <Form.Select disabled={targetAppfields.length === 0}>
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
