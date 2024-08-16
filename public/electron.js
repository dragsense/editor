const { app, BrowserWindow, webContents, ipcMain, shell, dialog, session } = require('electron')
const path = require('path')
const url = require('url');
const Store = require('electron-store')

// Initialize the electron-store instance
const store = new Store();

let mainWindow;
let argv = [];
const customProtocol = 'autocode-editor';

// Remove the app as the default protocol client
app.removeAsDefaultProtocolClient(customProtocol);

// Set the app as the default protocol client based on the environment
if (process.defaultApp) {
  if (process.argv.length >= 2) {
    app.setAsDefaultProtocolClient(customProtocol, process.execPath, [path.resolve(process.argv[1])])
  }
} else {
  argv = process.argv;
  app.setAsDefaultProtocolClient(customProtocol)
}

// Define prefixes based on the environment
const prefix = app.isPackaged ? '__' : '';
const prefixSecure = app.isPackaged ? 'Secure-' : '';
const prefixHost = app.isPackaged ? 'Host-' : '';

// Function to set the session
const setSession = (argUrl) => {
  try {
    const url = new URL(argUrl);
    const queryParams = new URL(url).searchParams;
    const cookies = JSON.parse(decodeURIComponent(queryParams.get('cookies')));

    const sessionToken = cookies[prefix + prefixSecure + 'next-auth.session-token'];
    const callbackUrl = cookies[prefix + prefixSecure + 'next-auth.callback-url'];
    const csrfToken = cookies[prefix + prefixHost + 'next-auth.csrf-token'];


    const info = JSON.parse(decodeURIComponent(queryParams.get('info')));

    const projectId = info['projectId'];
    const pageId = info['pageId'];
    const pageType = info['pageType'];
    const userName = info['userName'];
    const apiUrl = info['url'];

    // Store the session information
    store.set('projectId', projectId || null);
    store.set('pageId', pageId || null);
    store.set('pageType', pageType || null);
    store.set('userName', userName || null);
    store.set('apiUrl', apiUrl || 'http://localhost:3000');

    const ses = session.defaultSession;
    ses.clearCache(() => {
      console.log('Cache cleared!')
  })
    ses.clearStorageData();

    ses.webRequest.onBeforeSendHeaders((details, callback) => {
      details.requestHeaders['ngrok-skip-browser-warning'] = 'true';  // Set the custom header
      callback({ cancel: false, requestHeaders: details.requestHeaders });
    });


    if (sessionToken && csrfToken && callbackUrl) {

      ses.cookies.set({ url: apiUrl, name: prefixSecure + 'next-auth.session-token', value: sessionToken });
      ses.cookies.set({ url: apiUrl, name: prefixSecure + 'Secure-next-auth.callback-url', value: callbackUrl });
      ses.cookies.set({ url: apiUrl, name: prefixHost + 'Host-next-auth.csrf-token', value: csrfToken });
      webContents.getAllWebContents().forEach((contents) => {
        contents.send('session-update', { projectId, pageId, pageType, userName, session: true });
      });
    } else {
      webContents.getAllWebContents().forEach((contents) => {
        contents.send('session-update', { userName: 'Guset', session: false });
      });
    }
  } catch (error) {
    console.error('Error setting session:', error);
  }
}

// Check if the app has the single instance lock
const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    // Someone tried to run a second instance, we should focus our window.
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
    }

    const argUrl = commandLine.find(arg => arg.startsWith('autocode-editor://'));

    if (argUrl)
      setSession(argUrl)

    

    const options = {
      type: 'info',
      title: 'Success',
      message: 'Welcome Back',
      buttons: ['OK'],
      defaultId: 0,
    };

    dialog.showMessageBox(null, options);

  })

  // Create mainWindow, load the rest of the app, etc...
  app.whenReady().then(() => {
    createWindow();
    mainWindow.maximize();
  })

  app.on('browser-window-created', (event, window) => {

    window.webContents.on('did-finish-load', () => {

      if (argv?.length >= 2 && argv[1]?.startsWith('autocode-editor://')) {
        const customProtocolUrl = argv[1];

        setSession(customProtocolUrl)
      } else
        webContents.getAllWebContents().forEach((contents) => {
          contents.send('session-update', { userName: 'Guest', session: false });
        });
    });
  });

  app.on('open-url', (event, url) => {
    dialog.showErrorBox('Welcome Back', `You arrived from: ${url}`)
  })

}

// Function to create the main window
function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    title: 'Autocode Editor',
    width: 800,
    height: 600,
    autoHideMenuBar: true,
    
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      webSecurity: true,
      devTools: app.isPackaged ? false : true,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, 'favicon.ico'),
  })

  const appURL = app.isPackaged ? 'https://editor.dragsense.com'
  : 'http://localhost:3002'

  mainWindow.loadURL(appURL);

}

// Function to handle API requests
ipcMain.handle('makeApiRequest', async (event, apiEndpoint) => {
  try {
    const apiUrl = store.get('apiUrl');
    const ses = session.defaultSession;
    const cookies = await ses.cookies.get({ url: apiUrl });

    const cookieString = cookies
      .map((cookie) => `${prefix}${cookie.name}=${cookie.value}`)
      .join('; ');

    const projectId = store.get('projectId');


    const response = await fetch(`${apiUrl}/api/projects/` + projectId, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Cookie: cookieString,
      },
    });

    if (!response.ok) {
      throw new Error('API request failed');
    }
    const responseData = await response.json();
    return responseData;

  } catch (error) {
    // Handle errors
    console.error('Error fetching data:', error.message);
    return {};
  }
});

// Function to get the store values
ipcMain.handle('getStore', async (event, apiEndpoint) => {

  try {
    // Get all values stored in the electron-store instance

    const projectId = store.get("projectId");
    const pageId = store.get("pageId");
    const pageType = store.get("pageType");
    const userName = store.get("userName");

    return {
      projectId,
      pageId,
      pageType,
      userName
    };
  } catch (error) {
    // Handle errors
    console.error('Error getting store values:', error);
    return {};
  }

});

// Function to prompt the user to save changes
ipcMain.handle('prompt-to-save', async (event) => {
  const response = await dialog.showMessageBox({
    type: 'warning',
    message: 'You have unsaved changes. Do you want to save before closing?',
    buttons: ['Save', 'Don’t Save', 'Cancel'],
  });

  return response.response; // Return true if "Save" is selected
});

// Quit the app when all windows are closed
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// Handle window controls via IPC
ipcMain.on('shell:open', () => {
  const pageDirectory = __dirname.replace('app.asar', 'app.asar.unpacked')
  const pagePath = path.join('file://', pageDirectory, 'index.html')
  shell.openExternal(pagePath)
})