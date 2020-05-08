import React, { memo, useState } from 'react'

import { Set } from 'immutable'
import { useUndoState } from '../../react-hooks'

import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'

import { FormLabel } from '@material-ui/core';
import Divider from '@material-ui/core/Divider';
import SearchIcon from '@material-ui/icons/Search';
import AddBoxIcon from '@material-ui/icons/AddBox';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import BlankTarget from './blank-target'
import gql from 'graphql-tag'
import { useQuery } from '@apollo/react-hooks'
import ClassificationColors from './classification-colors';

const getEnums = gql`query securityClassification {
  metacardTypes{
   enums
 }
}`



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

export const TargetEditor =  props => {
  const { form = {}, attributes = [], onCancel, securityClassification ,loading } = props


  const { state, setState, ...rest } = useUndoState(Set(form.attributes))

  const [title, setTitle] = useState(form.title || '')
  const [description, setDescription] = useState(form.description || '')

  const errors = validate({ title, description, attributes: state })

  const [submitted, setSubmitted] = useState(false)

  const [textFieldFocus, setTexFieldFocus] = useState(false)


  const [createTargetList, setCreateTargetList] = useState(false)

  const [classification, setClassification] = useState('U')



  return (
    
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '150%',
        maxHeight: '200%',
        padding: 20,
        boxSizing: 'border-box',
        ...props.style,
      }}
    >
      <Button>
        <ArrowDropDownIcon></ArrowDropDownIcon>
      </Button>
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

     <div >
      <FormLabel stule={{padding: 20, marginBottom : 20}}> Classification </FormLabel>
      <span style={{'background-color' : ClassificationColors[classification]}}>{classification}</span>
      <br />
      </div>
      <TextField
        fullWidth
        rows={6}a
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
         defaultValue="Enter an Attribute...."  
         onFocus={() => {setTexFieldFocus(true)}}
         onBlur={() => {setTexFieldFocus(false)}} 
         display="inline"> 
        </TextField>
        <Button>
          {(textFieldFocus) ? 
           <SearchIcon></SearchIcon>
           :
           <AddBoxIcon variant="primary"  display="inline" onClick={()=>{setCreateTargetList(true)}}></AddBoxIcon>
          }
        </Button>
      </div>
      <div>
        { (createTargetList) ? <BlankTarget></BlankTarget> : <div></div>}
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
          onClick={() => {}
          }
        >
          Save
        </Button>
      </div>
    </div>
  )

  
}

const determineClassifications = (enumValue) => {

  if(enumValue.includes('TS')){
    return { U: 0, C: 1, S: 2, TS: 3 };
  }
  else if(enumValue.includes('S')){
    return { U: 0, C: 1, S: 2 }
  }
  else if(enumValue.includes('C')){
    return { U: 0, C: 1 } 
  }

  return {U : 0};
}
export default props => {

  const { data,loading,error } = useQuery(getEnums);
  let securityClassification = '';
  if(!loading){

    const enumValues = data.metacardTypes.map((metacardType)=> {return metacardType.enums}); 

    let allEnumValues = [];
    
    for(let index in enumValues){

      if(enumValues[index]){
        allEnumValues = allEnumValues.concat(enumValues[index]);
      }
    securityClassification = determineClassifications(allEnumValues);
 
    }
  
  }
  return <TargetEditor securityClassification={securityClassification} loading={loading}></TargetEditor>
}
