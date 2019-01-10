var readYaml = require('read-yaml')
var textfile = require('textfile')
var path = require('path')

var configPath = path.join(__dirname, 'config.yml')
var plistPath = path.join(__dirname, 'TKAutoReplyModels.plist')
var usernamePath = path.join(__dirname, 'username')
var weixinUsernamePath = path.join(__dirname, 'weixin')
var userPlistPath = `/Users/%username%/Library/Containers/com.tencent.qq/Data/Documents/TKQQPlugin/TKAutoReplyModels.plist`
var weixinPlistPath = ''
var username
var DELAY_TIME = 30

function encode(string) {
    var codes = ['&', '>', '<', '‘', '“']
    var texts = ['&amp;', '&gt;', '&lt;', '&apos;', '&quot;']
    return codes.reduce((string, code, index) => {
        return string.replace(new RegExp(code, 'g'), texts[index])
    }, string)
}

readYaml(configPath, function(error, data) {
    if (error) {
        throw error
    }
    var array = ''
    data.forEach(item => {
        var {
            questions,
            answer,
            keys
        } = item
        if (Array.isArray(item)) {
            answer = item.pop()
            keys = item
        }
        if (questions) {
            questions.forEach(question => {
                var test
                for (let index = 0; index < keys.length; index++) {
                    if (new RegExp(keys[index]).test(question)) {
                        test = true
                        break
                    }
                }
                if (!test) {
                    throw new Error(`question test error: ${question}`)
                }
            })
        }
        answer += '\n--来自 uni-app 小助手'
        keys.forEach(key => {
            array += `<dict><key>delayTime</key><integer>${DELAY_TIME}</integer><key>enable</key><true/><key>enableDelay</key><false/><key>enableGroupReply</key><true/><key>enableRegex</key><true/><key>enableSingleReply</key><true/><key>keyword</key><string>${encode(key)}</string><key>replyContent</key><string>${encode(answer)}</string></dict>`
        })
    })
    var plist = `<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd"><plist version="1.0"><array>${array}</array></plist>`
    textfile.read(usernamePath, 'string')
        .then(string => {
            username = string && string.trim()
            if (username) {
                plistPath = userPlistPath.replace('%username%', username)
            }
            return textfile.write(plistPath, plist, 'string')
        })
        .then(() => {
            return textfile.read(weixinUsernamePath, 'string')
        })
        .then((string) => {
            var weixinUsername = string && string.trim()
            if (username && weixinUsername) {
                weixinPlistPath = `/Users/${username}/Library/Containers/com.tencent.xinWeChat/Data/Documents/TKWeChatPlugin/${weixinUsername}/TKAutoReplyModels.plist`
                return textfile.write(weixinPlistPath, plist, 'string')
            }
        })
        .then(() => {
            console.log(`build success:\n${plistPath}\n${weixinPlistPath}`)
        })
        .catch(error => {
            throw new Error(error)
        })
})