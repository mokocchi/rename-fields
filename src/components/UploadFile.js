import { React, useState } from 'react'
import { Form } from 'react-bootstrap'

function UploadFile () {
  const [fileName, setFileName] = useState('Subir CSV')
  return (
    <div>
      <Form.Group controlId='formFile' className='mb-3'>
        <Form.Label>{fileName}</Form.Label>
        <Form.Control type='file' onChange={(e) => setFileName(e.target.files[0].name)} />
      </Form.Group>
    </div>
  )
}

export default UploadFile
