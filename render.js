// render.js

// 由 preload.js 注入的 window.bridge 对象
if (window.bridge) {
  console.log('versions: ', window.bridge.versions)

  const func = async () => {
    const response = await window.bridge.invoke('webLoaded', { data: 'render success!' })
    console.log(response) // prints out { data: 'success' }
  }

  func()
}
