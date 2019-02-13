const path = require('path')
const readYaml = require('read-yaml')

const configPath = path.join(__dirname, 'config.yml')
const SIGNATURE = '--来自 uni-app 小助手'

module.exports = {
    get: function() {
        return new Promise((resolve, reject) => {
            readYaml(configPath, function(error, data) {
                if (error) {
                    return reject(error)
                }
                resolve(data.map(item => {
                    if (Array.isArray(item)) {
                        let answer = item.pop()
                        let keys = item
                        return {
                            answer,
                            keys
                        }
                    }
                    return item
                }))
            })
        })
    },
    SIGNATURE
}
