import { geoToWKT }  from  '../../components/location/geo-to-wkt.tsx'
const ROOT = '/internal/gsr/locations/targets';

const typeDefs = `
type Target {
    id : ID
    title : String
    description : String
    classification : String
}

input AOI {
    classification : String
    color : String
    creationorigin : String
    description : String
    geo : Geo
    id : ID
    shape : String
    title : String
}



input Properties {
  buffer: Int,
  bufferUnit: String
  color: String
  id: ID
  shape: String
}


input Geo {

  type: String
  geometry: Geometry
  properties: Properties,
  bbox: [Float!]


}

input TargetInput { 
    id : ID
    title : String
    description : String
    classification : String
}

extend type Mutation {
    createTarget(    
        id : ID,
        fromCreate : String,
        AOIs : [AOI],
        type : String,
        coordinates : [Float],
        title : String,
        targets : [String],
        description : String,
        classification : String) : Target
}
`



const transformAOICreationOrigin = (AOIS) => {

    AOIS.map((AOI) => {
        AOI['creation-origin'] = AOI.creationorigin;
        delete AOI.creationorigin
        return AOI
    })


}

const createTarget = async (parent,args,{ fetch },info) => {
    
    let fromCreate = args.fromCreate;
    let res = '';
    const { fetch } = context;
    const id = args.id;
    const title = args.title;
    const description = args.description;
    const classification = args.classification;
    const AOIS = args.AOIs;
    const type = args.type;
    const coordinates = args.coordinates;

    transformAOICreationOrigin(AOIS);
    console.log(AOIS)
    const data = {
        type,
        id,
        title,
        description,
        classification,
        AOIs: AOIS,
        coordinates
      }
      console.log(data)
    let res = ''; 
    try {
        res = await fetch(ROOT, {
          method: fromCreate === "create" ? 'POST' : 'PUT',
          body: JSON.stringify(geoToWKT(data)),
        })
      } catch (error) {
        console.log(error)
        return error
      }
      console.log(res)
      return res;
}

const resolvers = {
    Mutation : {
      createTarget
    }
}

module.exports = {
    typeDefs,
    resolvers
}