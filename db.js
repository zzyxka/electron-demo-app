const { app } = require('electron')
const path = require('path')
const sqlite3 = require('sqlite3').verbose()
const { open } = require('sqlite')

let db = null
async function dbConn() {
  if (db) {
    return db
  }
  // 软件缓存/db地址
  // mac:/Users/xxx/Library/Application Support/xxx
  const appData = path.join(app.getPath('userData')) // Electron 应用安装目录
  console.log('appData: ', appData)
  const sqlFile = path.join(appData, 'test.db')
  // eslint-disable-next-line no-new
  new sqlite3.Database(sqlFile)
  db = await open({
    filename: sqlFile,
    driver: sqlite3.Database
  })
  try {
    const res = await db.get('SELECT * FROM  "demo_table"')
    console.log('res: ', res)
  } catch (e) {
    await db.exec('CREATE TABLE demo_table (hello VARCHAR)')
  }
  return db
}

module.exports = dbConn
