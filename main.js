const { app, BrowserWindow, ipcMain, Notification, Tray, nativeImage } = require('electron')
const path = require('path')
const log = require('electron-log')
const dbConn = require('./db')
const logConfig = require('./log-config')

function showNotification({ title, body }) {
  new Notification({ title, body }).show()
}

// eslint-disable-next-line no-new
const icon = nativeImage.createFromPath('public/icon.png')

const createWindow = () => {
  dbConn()
  logConfig()
  log.info('app start')
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    icon,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  win.loadFile('index.html')
  // win.loadURL('https://www.electronjs.org/')
}

/**
 * You typically listen to Node.js events by using an emitter's .on function.
 * like: app.on('ready', () => { ... })
 * However, Electron exposes app.whenReady() as a helper specifically
 * for the ready event to avoid subtle pitfalls with directly listening to that event in particular.
 * See electron/electron#21972 for details.
 */
app.whenReady().then(() => {
  ipcMain.handle('webLoaded', (event, args) => {
    console.log(args) // print out { data: 'render success!' }
    showNotification({
      title: 'webLoaded',
      body: args.data
    })
    return { data: 'success' }
  })
  createWindow()

  const tray = new Tray(icon.resize({ width: 16, height: 16 }))
  tray.setToolTip('Hi, I am a tray icon.')
  tray.setTitle('Electron App')

  if (process.platform === 'darwin') {
    app.dock.setIcon(icon.resize({ width: 32, height: 32 }))
  }

  // Open a window if none are open (macOS)
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit the app when all windows are closed (Windows & Linux)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
