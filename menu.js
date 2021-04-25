const { app, Menu, shell, ipcMain, BrowserWindow, globalShortcut, dialog } = require("electron");
const fs = require("fs");

const template = [
    {
        label: "File",
        submenu: [
            {
               label: "Open",
               accelerator: "CommandOrControl+O",
               click(){
                  openFile();
               }
            },
            {
                label: "Save",
                accelerator: "CommandOrControl+S",
                click(){
                    saveFile();
                }
            }
        ]
    },
    {
        role: 'help',
        submenu: [
            {
                label: "About editor component",
                click() {
                    shell.openExternal('https://simplemde.com/')
                }
            }
        ]
    },
    {
        label: "Format",
        submenu: [
            {
                label: "Toogle Bold",
                click() {
                    const win = BrowserWindow.getFocusedWindow();
                    win.webContents.send(
                        'editor-reply',
                        'toggle-bold'
                    )
                }
            }
        ]
    }
];

if (process.platform === "win32") {
    template.unshift({
        label: app.getName(),
        submenu: [
            { role: 'about' },
            { type: 'separator' },
            { role: 'quit' }
        ]
    })
}

if (process.env.DEBUG) {
    template.push({

        label: "Debugging",
        submenu: [
            {
                label: 'DevTools',
                role: 'toggleDevTools'
            },
            {
                type: "separator"
            },
            {
                role: "reload",
                accelerator: "Alt + R"
            }
        ]

    })
}

const menu = Menu.buildFromTemplate(template);

ipcMain.on('editor-reply', (event, arg) => {
    console.log(`Received reply from web page: ${arg}`);

});

app.on("ready", () => {
    globalShortcut.register('CommandOrControl+S', () => {
        saveFile();
    });

    globalShortcut.register('CommandOrControl+O', () => {
        openFile();
    });
})

function saveFile() {
    console.log("saving file");
    const win = BrowserWindow.getFocusedWindow();
    win.webContents.send("editor-reply", "save");
}

function openFile() {
    const win = BrowserWindow.getFocusedWindow();
    const options = {
        title: 'Pick a markdown file',
        filters: [
            { name: 'Markdown files', extensions: ['md'] },
            { name: 'Text files', extensions: ['txt'] }
        ]


    }

    dialog.showOpenDialog(win, options).then((result) => {
        if (result && result.filePaths.length > 0) {
            const content = fs.readFileSync(result.filePaths[0]).toString();
            console.log(content);
            win.webContents.send('load', content);
        }
    })
        .catch(err => console.log(err));
}

ipcMain.on('save', (event, arg) => {

    const win = BrowserWindow.getFocusedWindow();
    const options = {
        title: 'Save markdown file',
        filters: [
            {
                name: "MyFile",
                extensions: ['md']
            }

        ]
    }

    dialog.showSaveDialog(win, options).then((result) => {
        console.log(result);
        fs.writeFileSync(result.filePath, arg, (err) => {
            if (err) {
                console.log(err);
            }
            else {
                console.log("bien")
            }
        })
    }).catch(err => console.log(err));
})

module.exports = menu;


// if(filename){
//     console.log(filename);
//     fs.writeFileSync(filename, arg);
//    }
//    else{
//        console.log("nada por aqui")
//    }