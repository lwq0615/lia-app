const { app, BrowserWindow } = require('electron');
const path = require('path');
let mainWindow = null;
//判断命令行脚本的第二参数是否含--debug
const debug = /debug/.test(process.argv[2]);
function makeSingleInstance() {
    if (process.mas) return;
    app.requestSingleInstanceLock();
    app.on('second-instance', () => {
        if (mainWindow) {
            if (mainWindow.isMinimized()) mainWindow.restore()
            mainWindow.focus()
        }
    })
}


function createWindow() {
    const windowOptions = {
        width: 1200,
        height: 700,
        frame: false,
        // 主窗口透明
        transparent: true,
        webPreferences: {
            // 是否集成 Nodejs
            nodeIntegration: true,
            //preload.js 文件路径
            preload: path.resolve(__dirname, './preload.js'),
            //官方文档默认为true
            contextIsolation: false,
            //开启electron.remote
            enableRemoteModule: true
        }
    };
    mainWindow = new BrowserWindow(windowOptions);
    if (debug) {
        mainWindow.loadURL("http://localhost:3000/");
    }else{
        mainWindow.loadURL(path.join('file://', __dirname, './build/index.html'));
    }
    //接收渲染进程的信息
    const ipc = require('electron').ipcMain;
    ipc.on('min', function () {
        mainWindow.minimize();
    });
    ipc.on('max', function () {
        if (mainWindow.isMaximized()) {
            mainWindow.unmaximize();
        } else {
            mainWindow.maximize();
        }
    });
    ipc.on('close', function () {
        mainWindow.close();
    });
    //
    mainWindow.on('maximize', function () {
        mainWindow.webContents.send('max');
    })
    mainWindow.on('unmaximize', function () {
        mainWindow.webContents.send('unmax');
    })
    mainWindow.on('resize', function () {
        mainWindow.webContents.send('unmax');
    })
    //如果是--debug 打开开发者工具
    if (debug) {
        mainWindow.webContents.openDevTools();
    }
    mainWindow.on('closed', () => {
        mainWindow = null
    })
}


makeSingleInstance();
//app主进程的事件和方法
app.on('ready', () => {
    createWindow();
});
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
});
app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});
module.exports = mainWindow;