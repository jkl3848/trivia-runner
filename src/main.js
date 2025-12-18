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

// Theme schema for validation
const themeSchema = {
  type: "object",
  required: [
    "name",
    "description",
    "colors",
    "typography",
    "animations",
    "layout",
  ],
  properties: {
    name: {
      type: "string",
      minLength: 1,
      maxLength: 50,
    },
    description: {
      type: "string",
      maxLength: 200,
    },
    colors: {
      type: "object",
      required: ["background", "text", "categories", "answer", "progressBar"],
      properties: {
        background: {
          type: "object",
          required: ["type"],
          properties: {
            type: {
              type: "string",
              enum: ["gradient", "solid"],
            },
            gradient: {
              type: "object",
              properties: {
                from: {
                  type: "string",
                  pattern: "^#[0-9A-Fa-f]{3,6}$|^rgba?\\(",
                },
                via: {
                  type: "string",
                  pattern: "^#[0-9A-Fa-f]{3,6}$|^rgba?\\(",
                },
                to: {
                  type: "string",
                  pattern: "^#[0-9A-Fa-f]{3,6}$|^rgba?\\(",
                },
                direction: { type: "string" },
              },
            },
            solid: {
              type: "string",
              pattern: "^#[0-9A-Fa-f]{3,6}$|^rgba?\\(",
            },
          },
        },
        text: {
          type: "object",
          required: ["primary", "secondary"],
          properties: {
            primary: { type: "string" },
            secondary: { type: "string" },
          },
        },
        categories: {
          type: "object",
          required: ["main", "sub", "subsub"],
          properties: {
            main: {
              type: "object",
              required: ["bg", "text", "border"],
              properties: {
                bg: { type: "string" },
                text: { type: "string" },
                border: { type: "string" },
              },
            },
            sub: {
              type: "object",
              required: ["bg", "text", "border"],
              properties: {
                bg: { type: "string" },
                text: { type: "string" },
                border: { type: "string" },
              },
            },
            subsub: {
              type: "object",
              required: ["bg", "text", "border"],
              properties: {
                bg: { type: "string" },
                text: { type: "string" },
                border: { type: "string" },
              },
            },
          },
        },
        answer: {
          type: "object",
          required: ["text", "border"],
          properties: {
            bg: {
              oneOf: [
                { type: "string" },
                {
                  type: "object",
                  properties: {
                    type: { const: "gradient" },
                    gradient: { type: "object" },
                  },
                },
              ],
            },
            text: { type: "string" },
            border: { type: "string" },
          },
        },
        progressBar: {
          type: "object",
          required: ["background", "fill"],
          properties: {
            background: { type: "string" },
            fill: {
              oneOf: [
                { type: "string" },
                {
                  type: "object",
                  properties: {
                    type: { const: "gradient" },
                    gradient: { type: "object" },
                  },
                },
              ],
            },
          },
        },
        shapes: {
          type: "array",
          items: {
            type: "object",
            required: ["color", "opacity", "position", "size"],
            properties: {
              color: { type: "string" },
              opacity: { type: "number", minimum: 0, maximum: 1 },
              position: {
                type: "string",
                enum: [
                  "top-left",
                  "top-right",
                  "bottom-left",
                  "bottom-right",
                  "center",
                ],
              },
              size: {
                type: "string",
                enum: ["small", "medium", "large"],
              },
            },
          },
        },
      },
    },
    typography: {
      type: "object",
      required: ["title", "question", "answer", "category"],
      properties: {
        title: {
          type: "object",
          required: ["size", "weight"],
          properties: {
            size: { type: "string" },
            weight: { type: "string" },
          },
        },
        question: {
          type: "object",
          required: ["size", "weight"],
          properties: {
            size: { type: "string" },
            weight: { type: "string" },
          },
        },
        answer: {
          type: "object",
          required: ["size", "weight"],
          properties: {
            size: { type: "string" },
            weight: { type: "string" },
          },
        },
        category: {
          type: "object",
          required: ["main", "sub", "subsub"],
          properties: {
            main: {
              type: "object",
              required: ["size", "weight"],
              properties: {
                size: { type: "string" },
                weight: { type: "string" },
              },
            },
            sub: {
              type: "object",
              required: ["size", "weight"],
              properties: {
                size: { type: "string" },
                weight: { type: "string" },
              },
            },
            subsub: {
              type: "object",
              required: ["size", "weight"],
              properties: {
                size: { type: "string" },
                weight: { type: "string" },
              },
            },
          },
        },
      },
    },
    animations: {
      type: "object",
      required: ["enabled", "shapes", "transitions"],
      properties: {
        enabled: { type: "boolean" },
        shapes: {
          type: "object",
          required: ["enabled", "speed"],
          properties: {
            enabled: { type: "boolean" },
            speed: {
              type: "string",
              enum: ["slow", "normal", "fast"],
            },
          },
        },
        transitions: {
          type: "object",
          required: ["enabled", "duration"],
          properties: {
            enabled: { type: "boolean" },
            duration: { type: "number", minimum: 0 },
          },
        },
      },
    },
    layout: {
      type: "object",
      required: ["spacing", "borderRadius"],
      properties: {
        spacing: {
          type: "object",
          required: ["question", "categories", "answer"],
          properties: {
            question: { type: "string" },
            categories: { type: "string" },
            answer: { type: "string" },
          },
        },
        borderRadius: {
          type: "object",
          required: ["categories", "answer"],
          properties: {
            categories: { type: "string" },
            answer: { type: "string" },
          },
        },
      },
    },
    backgroundImage: {
      type: "object",
      properties: {
        path: {
          type: "string",
          description:
            "Relative path to image file from themes folder (e.g., 'images/bg.jpg')",
        },
        opacity: {
          type: "number",
          minimum: 0,
          maximum: 1,
          default: 1,
          description: "Opacity of the background image (0-1)",
        },
        size: {
          type: "string",
          enum: ["cover", "contain", "auto"],
          default: "cover",
          description: "CSS background-size value",
        },
        position: {
          type: "string",
          default: "center",
          description: "CSS background-position value",
        },
      },
    },
  },
};

const ajv = new Ajv();
const validate = ajv.compile(triviaSchema);
const validateTheme = ajv.compile(themeSchema);

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

// Theme utility functions
function validateThemeData(data) {
  const valid = validateTheme(data);
  return {
    valid,
    errors: validateTheme.errors || [],
  };
}

async function loadThemeFile(filePath) {
  try {
    const fileContent = await fs.readFile(filePath, "utf-8");
    const data = JSON.parse(fileContent);

    const validation = validateThemeData(data);

    if (!validation.valid) {
      console.warn(`Invalid theme file ${filePath}:`, validation.errors);
      return null;
    }

    return data;
  } catch (error) {
    console.error(`Failed to load theme file ${filePath}:`, error);
    return null;
  }
}

async function getThemeFiles() {
  try {
    // Check if app is packaged (asar bundle) or in development
    let themeDir;

    if (app.isPackaged) {
      // In production, themes are in the resources directory as an extra resource
      themeDir = path.join(process.resourcesPath, "themes");
    } else {
      // In development, themes are in the project root
      themeDir = path.join(app.getAppPath(), "themes");
    }

    // Ensure the themes directory exists
    try {
      await fs.access(themeDir);
    } catch {
      console.warn(`Themes directory not found at ${themeDir}`);
      return [];
    }

    const files = await fs.readdir(themeDir);
    const themeFiles = files.filter((file) => file.endsWith(".json"));
    const themes = [];

    for (const file of themeFiles) {
      const filePath = path.join(themeDir, file);
      const themeData = await loadThemeFile(filePath);

      if (themeData) {
        themes.push({
          id: path.basename(file, ".json"),
          name: themeData.name,
          description: themeData.description,
          path: filePath,
        });
      }
    }
    return themes;
  } catch (error) {
    console.error("Error reading themes directory:", error);
    return [];
  }
}

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window - Large enough for content box + controls
  const mainWindow = new BrowserWindow({
    width: 1600,
    height: 1000,
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

// IPC Handlers for theme functionality

// Get list of available themes
ipcMain.handle("get-themes", async () => {
  try {
    const themes = await getThemeFiles();
    return themes;
  } catch (error) {
    console.error("Error getting themes:", error);
    return [];
  }
});

// Load a specific theme file
ipcMain.handle("load-theme", async (event, filePath) => {
  try {
    const themeData = await loadThemeFile(filePath);
    if (themeData) {
      return {
        success: true,
        data: themeData,
      };
    } else {
      return {
        success: false,
        error: "Invalid theme file",
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
});

// Resolve background image path for a theme and return as data URL
ipcMain.handle("resolve-theme-image", async (event, themePath, imagePath) => {
  try {
    let fullImagePath;

    // Check if the path is absolute
    if (path.isAbsolute(imagePath)) {
      // Use the absolute path directly
      fullImagePath = imagePath;
    } else {
      // Relative path - resolve relative to theme directory
      const themeDir = path.dirname(themePath);
      fullImagePath = path.join(themeDir, imagePath);
    }

    // Check if the file exists and read it
    try {
      const imageBuffer = await fs.readFile(fullImagePath);

      // Determine MIME type based on file extension
      const ext = path.extname(fullImagePath).toLowerCase();
      let mimeType = "image/jpeg";
      if (ext === ".png") mimeType = "image/png";
      else if (ext === ".jpg" || ext === ".jpeg") mimeType = "image/jpeg";
      else if (ext === ".gif") mimeType = "image/gif";
      else if (ext === ".webp") mimeType = "image/webp";
      else if (ext === ".svg") mimeType = "image/svg+xml";
      else if (ext === ".bmp") mimeType = "image/bmp";

      // Convert to base64 data URL
      const base64Image = imageBuffer.toString("base64");
      const dataUrl = `data:${mimeType};base64,${base64Image}`;

      return {
        success: true,
        dataUrl: dataUrl,
      };
    } catch {
      return {
        success: false,
        error: `Background image not found: ${imagePath}`,
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
});
