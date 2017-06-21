const electron = require('electron');
const { app, BrowserWindow, Menu, ipcMain } = electron;

let mainWindow;
let addWindow;


app.on('ready', () => {
    mainWindow = new BrowserWindow({});
    mainWindow.loadURL(`file://${__dirname}/index.html`);
    const mainMenu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(mainMenu);
    mainMenu.on('closed', () => app.quit());
});

function createAddWindow() {
    addWindow = new BrowserWindow({
        width: 200,
        height: 100,
        title: 'Add new Todo'
    });
    addWindow.loadURL(`file://${__dirname}/add.html`);
    addWindow.on('close',()=> addWindow = null);
}

  


ipcMain.on('todo:add', (event, todo)=>{
    mainWindow.webContents.send('todo:add', todo);
    addWindow.close();
})


const menuTemplate = [
    {
        label: 'File',
        submenu: [
            {
                label: 'New Todo',
                click() {
                    createAddWindow();
                },
                accelerator: process.platform === 'darwin' ? 'Command+N' : 'Ctrl+N'
            },
            {
                label: 'Clear List',
                click(){
                    mainWindow.webContents.send('todo:clear')
             },
                accelerator: process.platform === 'darwin' ? 'Command+C' : 'Ctrl+C'
            },
            {
                label: 'Quit',
                click() {
                    app.quit();
                },
                accelerator: process.platform === 'darwin' ? 'Command+Q' : 'Ctrl+Q',
            }
        ]
    }
];
if (process.platform === 'darwin') {
    menuTemplate.unshift({});
}

if (process.env.NODE_ENV !== 'production') {
    //  'production'// 'development'// 'staging'// 'test'
    menuTemplate.push({
        label: 'Boobs',
        submenu: [
            {
                role: 'reload'
            },
            {
            label: 'DevTools',
            click(item, focusedWindow) {
                focusedWindow.toggleDevTools();
            },
            accelerator: process.platform === 'darwin' ? 'Command+Alt+I' : 'Ctrl+Shift+I'
        }]
    });
}