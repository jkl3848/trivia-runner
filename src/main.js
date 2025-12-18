const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");
const fs = require("fs").promises;
const Ajv = require("ajv");

// Trivia schema for validation
const triviaSchema = {
  type: "object",
  required: ["questions"],
  properties: {
    questions: {
      type: "array",
      minItems: 1,
      items: {
        type: "object",
        required: ["id", "question", "answer", "category"],
        properties: {
          id: { type: "number" },
          question: { type: "string", minLength: 1 },
          answer: { type: "string", minLength: 1 },
          category: {
            type: "object",
            required: ["main", "sub", "subsub"],
            properties: {
              main: { type: "string", minLength: 1 },
              sub: { type: "string", minLength: 1 },
              subsub: { type: "string", minLength: 1 },
            },
          },
        },
      },
    },
  },
};

const ajv = new Ajv();
const validate = ajv.compile(triviaSchema);

// Trivia utility functions
function validateTriviaData(data) {
  const valid = validate(data);
  return {
    valid,
    errors: validate.errors || [],
  };
}

async function loadTriviaFile(filePath) {
  try {
    const fileContent = await fs.readFile(filePath, "utf-8");
    const data = JSON.parse(fileContent);

    const validation = validateTriviaData(data);

    if (!validation.valid) {
      return {
        success: false,
        error: `Invalid trivia file format: ${JSON.stringify(validation.errors)}`,
      };
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      error: `Failed to load trivia file: ${error.message}`,
    };
  }
}

async function getTriviaFiles(baseDir) {
  try {
    const triviaDir = path.join(baseDir, "trivia_configs");
    const files = await fs.readdir(triviaDir);

    return files
      .filter((file) => file.endsWith(".json"))
      .map((file) => path.join(triviaDir, file));
  } catch (error) {
    console.error("Error reading trivia directory:", error);
    return [];
  }
}

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window - Vertical 1080p (9:16 aspect ratio)
  const mainWindow = new BrowserWindow({
    width: 1080,
    height: 1920,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`)
    );
  }

  // Open the DevTools in development.
  if (process.env.NODE_ENV === "development") {
    mainWindow.webContents.openDevTools();
  }
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// IPC Handlers for trivia functionality

// Get list of available trivia files
ipcMain.handle("get-trivia-files", async () => {
  try {
    const appPath = app.getAppPath();
    const files = await getTriviaFiles(appPath);

    // Return just the filenames for display
    return files.map((filePath) => ({
      path: filePath,
      name: path.basename(filePath, ".json"),
    }));
  } catch (error) {
    console.error("Error getting trivia files:", error);
    return [];
  }
});

// Load a specific trivia file
ipcMain.handle("load-trivia-file", async (event, filePath) => {
  try {
    const result = await loadTriviaFile(filePath);
    return result;
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
});

// Open file dialog to select a trivia file
ipcMain.handle("select-trivia-file", async () => {
  try {
    const result = await dialog.showOpenDialog({
      properties: ["openFile"],
      filters: [
        { name: "JSON Files", extensions: ["json"] },
        { name: "All Files", extensions: ["*"] },
      ],
    });

    if (result.canceled || result.filePaths.length === 0) {
      return { success: false, canceled: true };
    }

    const filePath = result.filePaths[0];
    const loadResult = await loadTriviaFile(filePath);

    if (loadResult.success) {
      return {
        success: true,
        data: loadResult.data,
        filePath: filePath,
        fileName: path.basename(filePath, ".json"),
      };
    } else {
      return loadResult;
    }
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
});
