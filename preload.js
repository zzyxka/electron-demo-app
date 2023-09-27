const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('bridge', {
  // 注入变量/函数到 window 对象中
  versions: {
    electron: process.versions.electron,
    node: process.versions.node,
    chrome: process.versions.chrome
  },
  // 为渲染进程注入与主进程 ipc 通信的函数
  invoke: (channel, data) => {
    switch (channel) {
      case 'webLoaded':
        return ipcRenderer.invoke(channel, data)
      default:
        console.error(`Unknown channel: ${channel}`)
        return `Unknown channel: ${channel}`
    }
  }
})
