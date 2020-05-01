import React, { memo, useState } from 'react'

import { Set } from 'immutable'
import { useUndoState } from '../../react-hooks'

import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'

import { InputLabel } from '@material-ui/core';
import { FormLabel } from '@material-ui/core';
import Divider from '@material-ui/core/Divider';
import SearchIcon from '@material-ui/icons/Search';
import AddBoxIcon from '@material-ui/icons/AddBox';

const validate = (form = {}) => {
  const { title, description } = form

  const attributes = Set(form.attributes)

  const errors = {}

  if (typeof title !== 'string') {
    errors.title = 'Title must be string'
  } else if (title.trim() === '') {
    errors.title = 'Title must not be empty'
  }

  if (description !== undefined && typeof description !== 'string') {
    errors.description = 'Description must be string'
  }

  if (attributes.isEmpty()) {
    errors.attributes = 'Attributes cannot be empty'
  }

  return errors
}

export default props => {
  const { form = {}, attributes = [], onCancel, onSave } = props

  const { state, setState, ...rest } = useUndoState(Set(form.attributes))

  const [title, setTitle] = useState(form.title || '')
  const [description, setDescription] = useState(form.description || '')

  const errors = validate({ title, description, attributes: state })

  const [submitted, setSubmitted] = useState(false)

  const [textFieldFocus, setTexFieldFocus] = useState(false)

  return (
    
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        maxHeight: '100%',
        padding: 20,
        boxSizing: 'border-box',
        ...props.style,
      }}
    >

      <TextField
        autoFocus
        required
        fullWidth
        label="Enter a Title"
        variant="outlined"
        style={{ marginBottom: 20 }}
        value={title}
        error={submitted && errors.title !== undefined}
        helperText={submitted ? errors.title : undefined}
        onChange={e => setTitle(e.target.value)}
      />

      <FormLabel stule={{padding: 20}}> Classification </FormLabel>
      
      <TextField
        fullWidth
        rows={2}
        multiline
        variant="outlined"
        label="Description"
        style={{ marginBottom: 30 }}
        value={description}
        onChange={e => setDescription(e.target.value)}
      />
      <Divider variant="middle" />
      <div  style={{display : 'flex'}}>
        <TextField label="Search Attribute"
         defaultValue="Enter BE Number, WKT, Target Text..."  
         onFocus={() => {setTexFieldFocus(true)}}
         onBlur={() => {setTexFieldFocus(false)}} 
         display="inline"> 
        </TextField>
        <Button>
          {(textFieldFocus) ? 
           <SearchIcon></SearchIcon>
           :
           <AddBoxIcon variant="primary" display="inline"/>
          }
        </Button>
      </div>
      

      <div
        style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20 }}
      >
        <Button variant="outlined" color="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <div style={{ width: 10, display: 'inline-block' }} />
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            if (Object.keys(errors).length === 0) {
              const resultForm = {
                id: form.id,
                title,
                description,
                attributes: state.toJSON(),
              }
              onSave(resultForm)
            } else {
              setSubmitted(true)
            }
          }}
        >
          Save
        </Button>
      </div>
    </div>
  )
}
