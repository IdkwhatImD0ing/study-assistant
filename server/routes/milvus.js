const {DataType, MetricType} = require('@zilliz/milvus2-sdk-node')

const addToMilvus = async (instance, milvusData) => {
  // Check if there is any data to process
  if (milvusData.length === 0) {
    return
  }

  // Get the repoUUID from the first item
  const userUUID = milvusData[0].userUUID

  const fields = milvusData.map((data) => {
    const {fileUUID, vector} = data
    return {
      fileUUID,
      vector,
      userUUID,
    }
  })

  const data = {
    collection_name: 'Speech',
    fields_data: fields,
  }

  const response = await instance.insert(data)
  return response
}

const queryMilvus = async (instance, vector, userUUID) => {
  const searchParams = {
    anns_field: 'vector',
    topk: 2,
    metric_type: MetricType.L2,
    params: JSON.stringify({nprobe: 16}),
  }

  const query = {
    collection_name: 'Speech',
    vectors: [vector],
    search_params: searchParams,
    vector_type: DataType.FloatVector,
    expr: `userUUID == "${userUUID}"`,
    output_fields: ['fileUUID'],
  }

  const response = await instance.search(query)
  return response.results
}

module.exports = {addToMilvus, queryMilvus}
