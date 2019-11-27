import * as React from 'react'
import { geometry, coordinates as coordinateEditor } from 'geospatialdraw'
import EditorProps from './geo-editor'
import Tab from '@material-ui/core/Tab'
import Tabs from '@material-ui/core/Tabs'
import SpacedLinearContainer from '../spaced-linear-container'

type Props = {
  value: geometry.GeometryJSON
  onChange: (geo: geometry.GeometryJSON) => void
}

type OutputComponent = React.SFC<Props>
type EditorComponent = React.ComponentType<EditorProps>

const tabMap: coordinateEditor.CoordinateUnit[] = [
  coordinateEditor.LAT_LON,
  coordinateEditor.LAT_LON_DMS,
  coordinateEditor.USNG,
  coordinateEditor.UTM,
]

const defaultTab = 0

const withCoordinateUnitTabs = (Editor: EditorComponent): OutputComponent => ({
  value,
  onChange,
}) => {
  const [tab, setTab] = React.useState(defaultTab)
  return (
    <SpacedLinearContainer direction="column" spacing={1}>
      <Tabs
        value={tab}
        onChange={(_, index) => setTab(index)}
        indicatorColor="primary"
        textColor="primary"
        variant="fullWidth"
      >
        <Tab label="Lat / Lon (DD)" />
        <Tab label="Lat / Lon (DMS)" />
        <Tab label="USNG / MGRS" />
        <Tab label="UTM / UPS" />
      </Tabs>
      <Editor value={value} onChange={onChange} coordinateUnit={tabMap[tab]} />
    </SpacedLinearContainer>
  )
}

export default withCoordinateUnitTabs
