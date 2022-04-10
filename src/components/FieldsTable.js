import { React, useState } from 'react'
import { Alert, Button, Col, Form, Row, Table } from 'react-bootstrap'

function FieldsTable({ targetAppfields, originalFields, setOriginalFields, columns, data, separator }) {
  const [line, setLine] = useState('')
  const [error, setError] = useState('')
  const [errorFieldName, setErrorFieldName] = useState('')
  const [checkError, setCheckError] = useState('')
  const [editing, setEditing] = useState(true)
  const [showCustomField, setShowCustomField] = useState(false)
  const [customField, setCustomField] = useState('')
  const [variant, setVariant] = useState('default_value')
  const [defaultValue, setDefaultValue] = useState('')
  const [partialFields, setPartialFields] = useState([])
  const [partialFieldErrors, setPartialFieldErrors] = useState([])
  const [partialFieldValue, setPartialFieldValue] = useState([])
  const [showPartialFields, setShowPartialFields] = useState([])
  const [chosenTargetFields, setchosenTargetFields] = useState({})
  const [configurations, setConfigurations] = useState({})
  const formats = [
    'text',
    'integer',
    'date (YYYY/MM/DD o YYYY/MM/DD HH:mm:SS)'
  ]

  const pattern = () => (separator === 'comma') ? /,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/ : /;(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/

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

  const checkFields = () => {
    setEditing(false)
    setCheckError('falta validación')
  }

  const handleExport = () => {
    checkFields()
    alert('Exportar')
  }

  const handleSubmit = () => {
    checkFields()
    alert('Enviar')
  }

  const handleFieldChange = (e, index) => {
    const configs = configurations
    configs[originalFields[index]].field = e.target.value
    setConfigurations({ ...configs })

    const chosentfs = chosenTargetFields
    chosentfs[index] = e.target.value
    setchosenTargetFields({ ...chosentfs })
  }

  const handleClickCustomField = () => setShowCustomField(true)

  const hideCustomField = () => {
    setCustomField('')
    setDefaultValue('')
    setPartialFieldValue('')
    setErrorFieldName('')
    setPartialFields([])
    setShowCustomField(false)
  }

  const handleCustomFieldChange = e => setCustomField(e.target.value)

  const handleDefaultValueChange = e => setDefaultValue(e.target.value)

  const handleSaveField = () => {
    if (customField === '') {
      setErrorFieldName('El campo está vacío')
    } else {
      const fields = originalFields
      if (!fields.includes(customField)) {
        fields.push(customField)
        setOriginalFields([...fields])
        setShowCustomField(false)
        setCustomField('')
        setDefaultValue('')
        setPartialFieldValue('')
        setErrorFieldName('')
        setPartialFields([])
        const configs = configurations
        configs[customField].value = (variant === 'default_value' ? defaultValue : (partialFields.map(item => item.variant === 'default_value' ? item.value : `<${item.variant}>`).join(variant === 'concat_dash' ? '-' : ' ')))
        setConfigurations({ ...configs })
      } else {
        setErrorFieldName('El campo ya existe')
      }
    }
  }

  const handleFieldVariantChange = e => {
    if ((e.target.value === 'concat') || (e.target.value === 'concat_dash')) {
      setPartialFields([{
        variant: 'default_value',
        value: ''
      }, {
        variant: 'default_value',
        value: ''
      }])
      setShowPartialFields([true, true])
    }
    setVariant(e.target.value)
  }

  const handlePartiaFieldChange = (e, index) => {
    const fields = partialFields
    fields[index].variant = e.target.value
    setPartialFields([...fields])
    const shows = showPartialFields
    shows[index] = (e.target.value === 'default_value')
    setShowPartialFields([...shows])
  }

  const handleCustomFieldConcatChange = (e, index) => {
    if (e.target.value === '') {
      const errors = partialFieldErrors
      errors[index] = 'El valor está vacío'
      setPartialFieldErrors([...errors])
      const fields = partialFields
      fields[index].value = e.target.value
      setPartialFields([...fields])
      return
    }
    const regex = /^[a-z0-9]+$/i
    if (regex.test(e.target.value)) {
      const fields = partialFields
      fields[index].value = e.target.value
      setPartialFields([...fields])
      const errors = partialFieldErrors
      errors[index] = ''
      setPartialFieldErrors([...errors])
    } else {
      const errors = partialFieldErrors
      errors[index] = 'Solo valores alfanumericos'
      setPartialFieldErrors([...errors])
    }
  }

  return (
    <div>
      {targetAppfields.length > originalFields.length && <Alert variant='warning'>Hay más campos destino que campos en el dataset. Agregue campos personalizados o borre campos destino.</Alert>}
      {showCustomField
        ? (
          <Row>
            <Col className='md-4'>
              <Form.Group className='mb-3 needs-validation'>
                <Form.Label>Campo personalizado</Form.Label>
                <div className='invalid-feedback d-block'>
                  {errorFieldName}
                </div>
                <Form.Control className={(errorFieldName === '') ? ((customField !== '') && 'is-valid') : 'is-invalid'} value={customField} onChange={handleCustomFieldChange} type='text' placeholder='Ingrese un nombre de campo...' />
                <Form.Label>Variante</Form.Label>
                <Form.Select onChange={handleFieldVariantChange}>
                  <option value='default_value'>Valor por defecto</option>
                  <option value='concat'>Concatenado (con espacios)</option>
                  <option value='concat_dash'>Concatenado (con guiones)</option>
                </Form.Select>
                {variant === 'default_value'
                  ? (
                    <>
                      <Form.Label>Valor por defecto</Form.Label>
                      <Form.Control value={defaultValue} onChange={handleDefaultValueChange} type='text' placeholder='Ingrese un valor por defecto...' />
                    </>)
                  : (
                    <>
                      {partialFields.map((it, index) => (
                        <div key={`part-${index}`}>
                          <Form.Label>Campo {index + 1}</Form.Label>
                          <Form.Select onChange={e => handlePartiaFieldChange(e, index)}>
                            <option value='default_value'>Valor por defecto</option>
                            {
                              originalFields.map((item, indexof) =>
                                <option key={`custom-${index}-${indexof}`} value={item}>{item}</option>
                              )
                            }
                          </Form.Select>
                          {showPartialFields[index] && (
                            <>
                              <Form.Label>Valor por defecto</Form.Label>
                              <Form.Control value={partialFields[index].value} onChange={e => handleCustomFieldConcatChange(e, index)} type='text' placeholder='Ingrese un valor por defecto...' />
                              <div className='invalid-feedback d-block'>
                                {partialFieldErrors[index]}
                              </div>
                            </>)}
                        </div>
                      ))}
                    </>)}
                <Form.Control disabled value={(variant === 'default_value' ? defaultValue : (partialFields.map(item => item.variant === 'default_value' ? item.value : `<${item.variant}>`).join(variant === 'concat_dash' ? '-' : ' ')))} />
                <Button className='mt-3' onClick={handleSaveField} variant='success'>Agregar</Button>
                <Button className='mt-3' onClick={hideCustomField} variant='secondary'>Cancelar</Button>
              </Form.Group>
            </Col>
            <Col className='md-8'> </Col>
          </Row>)
        : <Button className='button mb-3' onClick={handleClickCustomField} variant='success'>Agregar campo personalizado</Button>}
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
                <Form.Select value={chosenTargetFields[indexof]} disabled={targetAppfields.length === 0} onChange={e => handleFieldChange(e, indexof)}>
                  {(targetAppfields.length === 0)
                    ? <option>No hay campos</option>
                    : <option key='null'>Anular campo</option>}
                  {targetAppfields.map((tf, indextf) => (
                    <option key={`${indexof}-${indextf}`} value={tf}>{tf}</option>
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
          {(checkError !== '')
            ? <Alert variant='danger'>Estado: {checkError}</Alert>
            : editing
              ? <Alert variant='warning'>Estado: editando</Alert>
              : <Alert variant='success'>Estado: correcto</Alert>}
          <Button onClick={checkFields} className='button mb-3 me-3 btn-block' variant='warning'>Validar</Button>
          <Button onClick={handleExport} className='button mb-3 btn-block center' variant='success'>Exportar archivo</Button>
          <Button onClick={handleSubmit} className='button mb-3 float-end btn-block' variant='danger'>Enviar a la aplicación</Button>
        </Col>
      </Row>
    </div>
  )
}

export default FieldsTable
