var { Menu, Tray, ipcMain } = require('electron')

var tray = null,
    contextMenu = null,
    hideInTray = false,
    isServerRunning = false

module.exports = function (options = {}) {

    ipcMain.on('start', function (e, options) {
        isServerRunning = true
        resetMenu(isServerRunning)
    })

    ipcMain.on('stop', function (e, options) {
        isServerRunning = false
        resetMenu(isServerRunning)
    })

    var icon = __dirname + '/../assets/logo.png'
    if (process.platform === 'darwin') {
        var icon = __dirname + '/../assets/logo_16x16.png'
    }
    tray = new Tray(icon)
    contextMenu = Menu.buildFromTemplate([
        {
            label: 'Open/Hide', click: () => {
                if (hideInTray) {
                    options.window.show()
                    hideInTray = false
                } else {
                    options.window.hide()
                    hideInTray = true
                }
            }
        },
        {
            label: 'Start/Stop',
            click: () => {
                if (isServerRunning) {
                    ipcMain.emit('stop');
                } else {
                    ipcMain.emit('start');
                }
            }
        },
        {
            label: 'New Window', click: () => {
                if (isServerRunning) {
                    options.openClient()
                }
            },
            enabled: isServerRunning
        },
        { type: 'separator' },
        { label: 'Quit', click: () => { void options.app.quit(); } },
    ]);
    tray.setContextMenu(contextMenu)
    tray.setToolTip('Open Stage Control')

    return tray

}

function resetMenu(isServerRunning) {
    contextMenu.items.forEach(item => {
        if (item.label === 'New Window') {
            item.enabled = isServerRunning
        }
    })
    tray.setContextMenu(contextMenu)
}