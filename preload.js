const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('ghostTimer', {
  onToggleTimer: (callback) => {
    ipcRenderer.on('toggle-timer', callback);
  },
  onAdjustTime: (callback) => {
    ipcRenderer.on('adjust-time', (event, seconds) => callback(seconds));
  }
});
