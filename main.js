const { app, BrowserWindow, globalShortcut, ipcMain, screen } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width: screenWidth } = primaryDisplay.workAreaSize;

  const windowWidth = 220;
  const windowHeight = 120;
  const margin = 20;

  mainWindow = new BrowserWindow({
    width: windowWidth,
    height: windowHeight,
    x: screenWidth - windowWidth - margin,
    y: margin,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    skipTaskbar: true,
    resizable: false,
    hasShadow: false,
    focusable: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  // Key feature: prevent screen capture/mirroring
  mainWindow.setContentProtection(true);

  // Ensure it stays on top even over fullscreen apps
  mainWindow.setAlwaysOnTop(true, 'floating', 1);
  mainWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });

  mainWindow.loadFile('index.html');

  // Register global shortcut for backtick key
  globalShortcut.register('`', () => {
    mainWindow.webContents.send('toggle-timer');
  });

  // Up arrow to increase time
  globalShortcut.register('Up', () => {
    mainWindow.webContents.send('adjust-time', 30);
  });

  // Down arrow to decrease time
  globalShortcut.register('Down', () => {
    mainWindow.webContents.send('adjust-time', -30);
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  globalShortcut.unregisterAll();
  app.quit();
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
