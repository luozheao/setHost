let axios = require('./node_modules/axios')
const fs = require('fs')
let pathContent = process.argv[2] || 'C:\\Windows\\System32\\drivers\\etc'

const path = require('path')
function exec(cmd) {
    return require('child_process')
        .execSync(cmd)
        .toString()
        .trim()
}

const getUrlIp = async () => {
    let res = await axios.get('https://github.com.ipaddress.com/')
    let val = res.data.match(/(?<=\.com\/ipv4\/)[\d\.]+/g)
    return [val[0], 'github.com']
}

// 2. 获取github域名查询
const getDomainIp = async () => {
    let res = await axios.get('https://fastly.net.ipaddress.com/github.global.ssl.fastly.net')
    let val = res.data.match(/(?<=\.com\/ipv4\/)[\d\.]+/g)
    return [val[0], 'github.global.ssl.fastly.net']
}
// 3. 获取github静态资源ip
const getStaticIp = async () => {
    let res = await axios.get('https://github.com.ipaddress.com/assets-cdn.github.com')
    let val = res.data.match(/(?<=\.com\/ipv4\/)[\d\.]+/g)
    return [...new Set(val)].map((item) => {
        return [item, 'assets-cdn.github.com']
    })
}

// 4. 生成内容
Promise.all([getUrlIp(), getDomainIp(), getStaticIp()]).then((res) => {
    let val = [res[0], res[1], ...res[2]]
    let str = copyHost(val)
    console.log(str)
    writeHost(str)
})

// 5. 拼接
const copyHost = (val) => {
    let str = ''
    val.forEach((item) => {
        str += item[0] + ' ' + item[1] + '\n'
    })
    return str
}

// 6. 写入到host文件中

const writeHost = (str) => {
    let pathUrl = path.join(pathContent, 'hosts')
    let val = fs.readFileSync(pathUrl, 'utf-8') // 已有的
    let newStr = str
    let replaceStr = `
#tag_start
${str}
#tag_end
    `
    if (val.indexOf('#tag_start') > -1) {
        newStr = val.replace(/#tag_start[\s\S]+#tag_end/gi, replaceStr)
    } else {
        newStr = val + replaceStr
    }

    fs.writeFile(pathUrl, newStr, (err) => {
        let execRes = ''
        if (!err) {
            execRes = exec('ipconfig /flushdns')
        } else {
            console.log(err)
        }
        //测试码云公钥是否设置成功
        console.error(execRes ? '修改host文件并刷新dns成功' : '刷新dns失败')
    })
}

