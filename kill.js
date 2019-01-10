var child_process = require('child_process')
var psList = require('ps-list')

psList().then(data => {
    data.forEach(data => {
        if (data.name === 'QQ' || data.name === 'WeChat') {
            child_process.execSync(`kill ${data.pid}`)
        }
    })
})