import { useState } from 'react'
import { Button, Modal, ListGroup, ListGroupItem, Form, Row, Col } from 'react-bootstrap'

function Settings ({ targetAppfields, setTargetAppfields }) {
  const [show, setShow] = useState(false)
  const [newField, setNewField] = useState('')
  const [showInput, setShowInput] = useState(false)
  const [showAddButton, setShowAddButton] = useState(true)

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  const handleClick = () => {
    setShowAddButton(false)
    setShowInput(true)
  }

  const handleSave = () => {
    if ((newField !== undefined) && newField !== '') {
      const fields = targetAppfields
      fields.push(newField)
      setTargetAppfields(fields)
      setShowInput(false)
      setShowAddButton(true)
      setNewField('')
    }
  }

  const handleDelete = (index) => {
    const fields = targetAppfields
    fields.splice(index, 1)
    setTargetAppfields([...fields])
  }

  const handleChange = (event) => setNewField(event.target.value)

  const fillDefaultFields = () => {
    setTargetAppfields([
      'causa',
      'rol',
      'tipo',
      'sexo',
      'edad',
      'mes',
      'periodo',
      'fecha',
      'hora',
      'lugar_hecho',
      'direccion_normalizada',
      'tipo_calle',
      'direccion_normalizada_arcgis',
      'calle1',
      'altura',
      'calle2',
      'codigo_calle',
      'codigo_cruce',
      'geocodificacion',
      'semestre',
      'x',
      'y',
      'geom',
      'cantidad_victimas',
      'comuna',
      'geom_3857',
      'tipo_colision1',
      'participantes_victimas',
      'participantes_acusados'
    ])
  }

  return (
    <>
      <Form.Group className='mb-3'>
        <Form.Label>Configuración</Form.Label>
        <Form.Control as='button' variant='warning' onClick={handleShow}>
          Administrar campos
        </Form.Control>
      </Form.Group>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Administrar campos</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ListGroup>
            {targetAppfields.map((item, index) => (
              <ListGroupItem key={index}>
                <Row>
                  <Col>
                    {item}
                  </Col>
                  <Col>
                    <Button onClick={() => handleDelete(index)} className='float-end' size='sm' variant='danger'>X</Button>
                  </Col>
                </Row>
              </ListGroupItem>
            ))}
          </ListGroup>
          {showInput &&
            <>
              <Form.Group className='mb-3'>
                <Form.Label>Campo</Form.Label>
                <Form.Control value={newField} onChange={handleChange} type='text' placeholder='Ingrese un campo nuevo...' />
              </Form.Group>
              <Button onClick={handleSave} variant='success'>Guardar</Button>
            </>}
          {showAddButton &&
            <Button onClick={handleClick} variant='success'>Agregar nuevo campo</Button>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant='warning' onClick={fillDefaultFields}>
            Cargar campos por defecto
          </Button>
          <Button variant='secondary' onClick={handleClose}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default Settings
