const PlainSerializer = require('./PlainSerializer')
const DataSerializer = require('./DataSerializer')
const SLDSerializer = require('./SLDSerializer')

module.exports = {
  plain: PlainSerializer,
  data: DataSerializer,
  sld: SLDSerializer
}
