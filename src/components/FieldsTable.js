import { React } from 'react'
import { Button, Form, Table } from 'react-bootstrap'

function FieldsTable () {
  const originalFields = [
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
  ]
  const targetFields = [
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
  ]
  const formats = [
    'text',
    'integer',
    'date (YYYY/MM/DD o YYYY/MM/DD HH:mm:SS)'
  ]

  return (
    <div>
      <Button variant='success'>Agregar campo combinado</Button>
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
                <Form.Select>
                  {targetFields.map((tf, indextf) => (
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
    </div>
  )
}

export default FieldsTable
