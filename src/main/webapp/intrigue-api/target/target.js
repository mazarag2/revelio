import { geoToWKT }  from  '../../components/location/geo-to-wkt.tsx'
const ROOT = './internal/gsr/locations/targets';

const typeDefs = `
type Target {
    id : ID
    title : String
    description : String
    classification : String
}

extend type Query {
    createTarget: [Target]
}
`
const createTarget = async (parent,args,context,info) => {
    console.log(context)
    let res = '';
    try {
        res = await fetch(ROOT, {
          method: fromCreate === 'create' ? 'POST' : 'PUT',
          body: JSON.stringify(geoToWKT(data)),
        })
      } catch (error) {
        Announcement.announce({
          type: 'error',
          title: 'Failed to save target',
          message: error.message,
        })
      }
      console.log(res)
}

const resolvers = {
    Query : {
      createTarget
    }
}

module.exports = {
    typeDefs,
    resolvers
}