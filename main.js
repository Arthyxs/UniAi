const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { exec } = require('child_process');

// The nircmd.exe utility must be in the system's PATH or in the same directory as the executable.
// It is used to turn the monitor off.
const turnMonitorOff = () => {
  exec('nircmd.exe monitor off', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing nircmd: ${error.message}`);
      // Notify the user that nircmd is needed. This will be visible in the console.
      console.error("Please ensure nircmd.exe is available in your system's PATH.");
      return;
    }
    if (stderr) {
      console.error(`nircmd stderr: ${stderr}`);
      return;
    }
    console.log(`nircmd stdout: ${stdout}`);
  });
};

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    fullscreen: true,
    kiosk: true, // Kiosk mode prevents exiting fullscreen
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // For development, you might load from a local server.
  // For production, you load the index.html file.
  // This example assumes a production build in a 'dist' folder.
  // Since we are in a dev environment that serves index.html at root, we do this:
  mainWindow.loadFile('index.html');

  // Open DevTools - remove for production
  // mainWindow.webContents.openDevTools();
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});


// IPC Handlers
ipcMain.on('screen-control', (event, command) => {
  if (command === 'off') {
    console.log('Received request to turn screen off.');
    turnMonitorOff();
  }
});

ipcMain.on('relaunch-app', () => {
    console.log('Relaunching the application...');
    app.relaunch();
    app.exit();
});
