const { app } = require('electron')
const path = require('path')
const log = require('electron-log')
const fs = require('fs')
const { format, subDays } = require('date-fns')

// 遍历文件夹下的文件
function listFile(dir) {
  try {
    const list = []
    const arr = fs.readdirSync(dir)
    arr.forEach((item) => {
      const fullpath = path.join(dir, item)
      const stats = fs.statSync(fullpath)
      if (stats.isDirectory()) {
        // ...
      } else {
        list.push(fullpath)
      }
    })
    return list
  } catch (e) {
    log.error('[list-file] err', e)
    return []
  }
}

function logConfig() {
  const logPath = path.join(app.getPath('userData')) // 将日志文件放在用户数据目录下
  log.transports.file.maxSize = 1024 * 1024 * 100
  log.transports.file.resolvePath = () => `${logPath}/${format(new Date(), 'yyyy-MM-dd')}.log`

  // 为相关日志打印方法增加时间标识
  const logInfo = log.info
  const logError = log.error
  log.info = (...rest) => {
    global.logInfo += `\n${new Date().toLocaleString()}_${JSON.stringify(rest)}`
    logInfo(...rest)
  }
  log.error = (...rest) => {
    global.logInfo += `\n${new Date().toLocaleString()}_${JSON.stringify(rest)}`
    logError(...rest)
  }

  // 删除3天前的日志文件
  const list = listFile(logPath)
  for (let i = 0; i < list.length; i++) {
    const file = list[i]
    const fileName = file.split(logPath)[1].substring(1)
    if (fileName.length === 14 &&
      fileName.endsWith('.log') &&
      subDays(new Date(), 3) > new Date(fileName.split('.log')[0])) {
      console.log('remove history log file: ', fileName)
      fs.unlink(file, () => { })
    }
  }
}

module.exports = logConfig
