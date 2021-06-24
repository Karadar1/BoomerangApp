const { v4: uuidv4, validate: uuidValidate } = require('uuid')
exports.validateString = validateString = (string) => {
  if (string === undefined || string === null) return false
  return true
}
exports.validateId = validateId = (id) => {
  if (id === undefined || id === null) return false
  return uuidValidate(id)
}
