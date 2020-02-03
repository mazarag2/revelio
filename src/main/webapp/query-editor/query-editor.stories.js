import { SearchFormEditor as QueryEditor } from './editor'
import { action } from '@connexta/ace/@storybook/addon-actions'
import React from 'react'
import { storiesOf } from '../@storybook/react'
import { SelectionProvider } from '../react-hooks/use-selection-interface'
import useState from '../@storybook/use-state'
import { defaultFilter } from '../query-builder/filter/filter-utils'
import QueryBuilder from '../query-builder/query-builder'
import { BasicSearchQueryBuilder } from '../basic-search'
import { fromFilterTree } from '../basic-search-helper'
const { set } = require('immutable')
import Box from '@material-ui/core/Box'

const stories = storiesOf('Query Editor', module)

const startingForms = [
  {
    id: '1',
    title: 'Title 1',
    modified: new Date().toISOString(),
    filterTree: {
      type: 'AND',
      filters: [{ ...defaultFilter }],
    },
  },
  {
    id: '2',
    title: 'Title 2',
    modified: new Date().toISOString(),
  },
]

stories.add('Basic', () => {
  const [form, setForm] = useState(
    set(
      startingForms[0],
      'filterTree',
      fromFilterTree(startingForms[0].filterTree)
    )
  )

  const queryBuilder = () => {
    return (
      <Box
        style={{
          width: '100%',
          overflow: 'auto',
          height: '100%',
          boxSizing: 'border-box',
        }}
        display="flex"
        flexDirection="column"
      >
        <BasicSearchQueryBuilder
          {...form}
          setFilterTree={filterTree => {
            setForm(set(form, 'filterTree', filterTree))
          }}
        />
      </Box>
    )
  }
  return (
    <SelectionProvider>
      <div style={{ height: '100vh' }}>
        <QueryEditor
          queryBuilder={queryBuilder()}
          onSearch={() => action('onSearch')(form)}
          onCancel={action('onCancel')}
          onSave={action('onSave')}
        />
      </div>
    </SelectionProvider>
  )
})
stories.add('Advanced', () => {
  const [form, setForm] = useState(
    set(
      startingForms[0],
      'filterTree',
      fromFilterTree(startingForms[0].filterTree)
    )
  )

  const queryBuilder = () => {
    return <QueryBuilder form={form} onChange={form => setForm(form)} />
  }
  return (
    <SelectionProvider>
      <div style={{ height: '100vh' }}>
        <QueryEditor
          queryBuilder={queryBuilder()}
          onSearch={() => action('onSearch')(form)}
          onCancel={action('onCancel')}
          onSave={action('onSave')}
        />
      </div>
    </SelectionProvider>
  )
})
// <BasicSearch />
