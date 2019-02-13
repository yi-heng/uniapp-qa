var textfile = require('textfile')
var path = require('path')
var { get, SIGNATURE } = require('./index')

var plistPath = path.join(__dirname, 'TKAutoReplyModels.plist')
var usernamePath = path.join(__dirname, 'username')
var weixinUsernamePath = path.join(__dirname, 'weixin')
var userPlistPath = `/Users/%username%/Library/Containers/com.tencent.qq/Data/Documents/TKQQPlugin/TKAutoReplyModels.plist`
var weixinPlistPath = ''
var username
var plist
var DELAY_TIME = 5

function encode(string) {
    var codes = ['&', '>', '<', '‘', '“']
    var texts = ['&amp;', '&gt;', '&lt;', '&apos;', '&quot;']
    return codes.reduce((string, code, index) => {
        return string.replace(new RegExp(code, 'g'), texts[index])
    }, string)
}

get()
    .then(data => {
        var array = ''
        console.log(`问题个数 ${data.length} 开始验证...`)
        data.forEach(item => {
            var {
                questions,
                answer,
                keys
            } = item
            var key = keys.join('|')
            if (questions) {
                questions.forEach(question => {
                    if (!new RegExp(key).test(question)) {
                        throw new Error(`question test error: ${question}`)
                    }
                })
            }
            answer += `\n${SIGNATURE}`
            array += `<dict><key>delayTime</key><integer>${DELAY_TIME}</integer><key>enable</key><true/><key>enableDelay</key><true/><key>enableGroupReply</key><true/><key>enableRegex</key><true/><key>enableSingleReply</key><true/><key>keyword</key><string>${encode(key)}</string><key>replyContent</key><string>${encode(answer)}</string></dict>`
        })
        console.log(`验证完毕`)
        plist = `<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd"><plist version="1.0"><array>${array}</array></plist>`
        return textfile.read(usernamePath, 'string')
    })
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