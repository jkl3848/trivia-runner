// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("versions", {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
});

contextBridge.exposeInMainWorld("trivia", {
  getTriviaFiles: () => ipcRenderer.invoke("get-trivia-files"),
  loadTriviaFile: (filePath) =>
    ipcRenderer.invoke("load-trivia-file", filePath),
  selectTriviaFile: () => ipcRenderer.invoke("select-trivia-file"),
});
