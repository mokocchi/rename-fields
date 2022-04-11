import { React, useEffect, useState } from 'react'
import { Alert, Button, Col, Form, Row, Table } from 'react-bootstrap'

function FieldsTable({
  targetAppfields, originalFields, setOriginalFields,
  columns, data, separator, loadConfigurations, setLoadConfigurations,
  setConfigurations, configurations,
  setChosenTargetFields, chosenTargetFields
}) {
  const [line, setLine] = useState('')
  const [error, setError] = useState('')
  const [errorFieldName, setErrorFieldName] = useState('')
  const [checkError, setCheckError] = useState('')
  const [editing, setEditing] = useState(true)
  const [showCustomField, setShowCustomField] = useState(false)
  const [customField, setCustomField] = useState('')
  const [variant, setVariant] = useState('default_value')
  const [defaultValue, setDefaultValue] = useState('')
  const [defaultValueErrors, setDefaultValueErrors] = useState([])
  const [partialFields, setPartialFields] = useState([])
  const [partialFieldErrors, setPartialFieldErrors] = useState([])
  const [showPartialFields, setShowPartialFields] = useState([])
  const [fileUrl, setFileUrl] = useState()
  const [errorFilename, setErrorFilename] = useState('')
  const [newFilename, setNewFilename] = useState('')
  const [fileExtension, setFileExtension] = useState('')
  const [hideExport, setHideExport] = useState(false)
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

  useEffect(() => {
    if (loadConfigurations) {
      const configs = {}
      originalFields.forEach(item => {
        configs[item] = {
          field: null
        }
      })
      setConfigurations({ ...configs })
      const chosenFields = []
      targetAppfields.forEach(item => {
        chosenFields.push('null')
      })
      setChosenTargetFields(chosenFields)
      setLoadConfigurations(false)
    }
  }, [loadConfigurations, originalFields, setLoadConfigurations, setConfigurations, setChosenTargetFields, targetAppfields.length])

  const checkFields = () => {
    setEditing(false)
    // que todos los target fields estén ocupados
    const unusedTargetFields = targetAppfields.filter(
      (item) => (!originalFields.find(of => configurations[of].field === item))
    )
    // que al menos un campo no esté anulado
    const atLeastOneNotNullField = Object.keys(configurations).reduce((previousValue, currentValue) =>
      previousValue || (configurations[currentValue].field !== null), false)
    if (unusedTargetFields.length > 0) {
      setCheckError(`Hay campos destino sin usar: ${unusedTargetFields.join(', ')}`)
      return
    }
    if (!atLeastOneNotNullField) {
      setCheckError('Debe haber al menos un campo no anulado')
      return
    }
    setCheckError('')
    setHideExport(false)
  }

  const collectData = () => {
    const headers = {}

    Object.keys(configurations).forEach((key, index) => {
      if (configurations[key].field !== null) {
        headers[index] = {
          index: index,
          origin: key,
          target: configurations[key].field
        }
      }
    })

    const JSONData = []
    const csvRows = [Object.keys(headers).map(index => headers[index].target)]

    data.forEach((row, i) => {
      if (i > 0) {
        JSONData[i - 1] = {}
        csvRows[i] = []
        row.split(pattern()).forEach((cell, j) => {
          if (chosenTargetFields[j]) {
            JSONData[i - 1][chosenTargetFields[j]] = cell
            csvRows[i].push(cell)
          }
        })
      }
    })
    const csvData = csvRows.filter(item => item.length !== 0).map(item => item.join(',')).join('\n')
    return {
      json: JSONData,
      csv: csvData
    }
  }

  const outputFile = () => {
    const { csv } = collectData()
    const data = new Blob([csv], { type: 'text/plain' })

    const textFile = window.URL.createObjectURL(data);

    return textFile;
  }

  const handleExport = () => {
    checkFields()
    if (checkError === '') {
      setFileUrl(outputFile())
    }
    setEditing(true)
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
    setChosenTargetFields([...chosentfs])
  }

  const handleClickCustomField = () => setShowCustomField(true)

  const hideCustomField = () => {
    setCustomField('')
    setDefaultValue('')
    setErrorFieldName('')
    setPartialFields([])
    setShowCustomField(false)
  }

  const handleCustomFieldChange = e => setCustomField(e.target.value)

  const handleDefaultValueChange = e => {
    if (e.target.value.includes(',')) {
      setDefaultValueErrors('No se permiten comas')
    } else {
      setDefaultValue(e.target.value)
    }
  }

  const handleSaveField = () => {
    if (customField === '') {
      setErrorFieldName('El campo está vacío')
    } else if (customField === 'null') {
      setErrorFieldName('El campo no puede llamarse "null"')
    } else {
      const fields = originalFields
      if (!fields.includes(customField)) {
        fields.push(customField)
        setOriginalFields([...fields])
        setShowCustomField(false)
        setCustomField('')
        setDefaultValue('')
        setErrorFieldName('')
        setPartialFields([])
        const configs = configurations
        configs[customField] = {}
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

  const handleNewFilenameChange = e => {
    if (e.target.value === '') {
      setErrorFilename('El nombre está vacío')
    } else {
      const regex = /^[a-zñáéíóúüA-ZÑÁÉÍÓÚÜ0-9-_.]+$/
      if (!regex.test(e.target.value)) {
        setErrorFilename('El nombre tiene caracteres inválidos')
      } else {
        setErrorFilename('')
      }
    }
    setNewFilename(e.target.value)
  }

  const handleFileExtensionChange = e => {
    setFileExtension(e.target.value)
    if (e.target.value === 'csv') {
      setNewFilename('.csv')
    } else if (e.target.value === 'json') {
      setNewFilename('.json')
    }
  }

  const handleDownloadClick = () => {
    setFileExtension('')
    setNewFilename('')
    setHideExport(true)
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
                      <div className='invalid-feedback d-block'>
                        {defaultValueErrors}
                      </div>
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
                <Button className='mt-3 me-3' onClick={handleSaveField} variant='success'>Agregar</Button>
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
                <Form.Control className={(error === '') ? ((line !== '') && 'is-valid') : 'is-invalid'} value={line} onChange={handleLineChange} type='text' placeholder='Ingrese un número de línea...' />
              </Form.Group>
            </th>
            <th>
              Campo corregido
            </th>
            <th>
              Valor por defecto
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
                {configurations[of] ? configurations[of].value : '<No disponible>'}
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
        <Col className='col-md-9'>
          {(checkError !== '')
            ? <Alert variant='danger'>Estado: {checkError}</Alert>
            : editing
              ? <Alert variant='warning'>Estado: editando</Alert>
              : <Alert variant='success'>Estado: correcto</Alert>}
          <Button onClick={checkFields} className='button mb-3 me-3 btn-block' variant='warning'>Validar</Button>
          {(checkError === '') && (editing === false) && (!hideExport) &&
            <Button onClick={handleExport} className='button mb-3 btn-block center' variant='success'>Exportar archivo</Button>}
        </Col>
        <Col className='col-md-3'>
          <Button onClick={handleSubmit} disabled className='button mb-3 float-end btn-block' variant='danger'>Enviar a la aplicación</Button>
        </Col>
      </Row>
      <Row>
        <Col className='col-md-9'>
          {fileUrl &&
            <Form.Group>
              <Form.Select value={fileExtension} onChange={handleFileExtensionChange}>
                <option value=''>Elija un tipo de archivo...</option>
                <option value='csv'>CSV</option>
                <option value='json'>JSON</option>
              </Form.Select>
              {fileExtension !== '' && (
                <>
                  <Form.Label>Nombre de archivo</Form.Label>
                  <div className='invalid-feedback d-block'>
                    {errorFilename}
                  </div>
                  <Form.Control className={(errorFilename === '') ? ((newFilename !== '') && 'is-valid') : 'is-invalid'} autoFocus value={newFilename} onChange={handleNewFilenameChange} type='text' placeholder='Ingrese un nombre de archivo...' />
                </>)}
              {(errorFilename === '') && (newFilename !== '') && <Button as='a' href={fileUrl} onClick={handleDownloadClick} download={newFilename}>Descargar</Button>}
            </Form.Group>}
        </Col>
      </Row>
    </div>
  )
}

export default FieldsTable
