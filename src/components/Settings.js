import { useState } from 'react'
import { Button, Modal, ListGroup, ListGroupItem, Form, Row, Col } from 'react-bootstrap'

function Settings ({
  targetAppfields, setTargetAppfields, setConfigurations, configurations,
  setChosenTargetFields, chosenTargetFields
}) {
  const [show, setShow] = useState(false)
  const [newField, setNewField] = useState('')
  const [error, setError] = useState('')
  const [showInput, setShowInput] = useState(false)
  const [showAddButton, setShowAddButton] = useState(true)

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  const handleClick = () => {
    setShowAddButton(false)
    setShowInput(true)
  }

  const handleSave = () => {
    if (newField === '') {
      setError('El campo está vacío')
    } else {
      const fields = targetAppfields
      if (!fields.includes(newField)) {
        fields.push(newField)
        setTargetAppfields([...fields])
        setShowInput(false)
        setShowAddButton(true)
        setNewField('')
      } else {
        setError('El campo ya existe')
      }
    }
  }

  const handleDelete = (index) => {
    const configs = configurations
    Object.keys(configurations).forEach(key => {
      const chosenFields = chosenTargetFields
      if (configurations[key].field === chosenFields[index]) {
        configurations[key].value = 'null'
        chosenFields[index] = 'null'
        setChosenTargetFields([...chosenTargetFields])
      }
    })
    setConfigurations({ ...configs })
    const fields = targetAppfields
    fields.splice(index, 1)
    setTargetAppfields([...fields])
  }

  const handleChange = (event) => {
    if (event.target.value === '') {
      setError('El campo está vacío')
    }
    if (!targetAppfields.includes(event.target.value)) {
      setError('')
    } else {
      setError('El campo ya existe')
    }
    setNewField(event.target.value)
  }

  const handleKeyDown = (event) => (event.key === 'Enter') && handleSave()

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
        <Button className='form-control' variant='warning' onClick={handleShow}>
          Administrar campos
        </Button>
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
              <Form.Group className='mb-3 needs-validation'>
                <Form.Label>Campo</Form.Label>
                <div className='invalid-feedback d-block'>
                  {error}
                </div>
                <Form.Control className={(error === '') ? ((newField !== '') && 'is-valid') : 'is-invalid'} autoFocus onKeyDown={handleKeyDown} value={newField} onChange={handleChange} type='text' placeholder='Ingrese un campo nuevo...' />
              </Form.Group>
              <Button onClick={handleSave} variant='success'>Guardar</Button>
            </>}
          {showAddButton &&
            <Button onClick={handleClick} className='mt-3' variant='success'>Agregar nuevo campo</Button>}
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
