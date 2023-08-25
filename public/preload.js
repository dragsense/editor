// preload.js
const { contextBridge, ipcRenderer, dialog } = require('electron');
const Store = require('electron-store');
const store = new Store();

// Expose the custom function to the renderer process
contextBridge.exposeInMainWorld('autocode', {
   
    checkUnsavedChanges: async (unsavedChanges) => {
        if (unsavedChanges) {
            const userResponse = await ipcRenderer.invoke('prompt-to-save');
            return userResponse;
        }
        return false;
    },

    getStore: async () => {
        try {
            // Invoke the IPC communication with the main process
            const responseData = await ipcRenderer.invoke('getStore');
            return responseData;
        } catch (error) {
            // Handle errors
            console.error('Error fetching data:', error);
            return {};
        }
    },
    onSessionUpdate: (callback) => {
        ipcRenderer.on('session-update', (_, sessionData) => {

            callback(sessionData);
        });
    },
    removeSessionUpdateListener: () => {
        ipcRenderer.removeAllListeners('session-update');
    },
    makeApiRequest: async () => {
        try {
            // Invoke the IPC communication with the main process
            const responseData = await ipcRenderer.invoke('makeApiRequest');
            return responseData;
        } catch (error) {
            // Handle errors
            console.error('Error fetching data:', error);
            return {};
        }
    },


});