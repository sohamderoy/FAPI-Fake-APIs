export const MODERN_IDE_THEME_OPTIONS = {
  base: "vs-dark" as const,
  inherit: true,
  rules: [
    { token: "string", foreground: "#5DE4C7" },
    { token: "number", foreground: "#FF875F" },
    { token: "boolean", foreground: "#FF5F87" },
    { token: "delimiter", foreground: "#87AFFF" },
    { token: "keyword", foreground: "#BD93F9" },
  ],
  colors: {
    "editor.background": "#0D1117",
    "editor.lineHighlightBackground": "#1B2028",
    "editor.lineHighlightBorder": "#2A2F3A",
    "editorLineNumber.foreground": "#3B4048",
    "editorLineNumber.activeForeground": "#528BFF",
    "editor.selectionBackground": "#2C313C",
    "editor.selectionHighlightBackground": "#2C313C80",
    "editor.wordHighlightBackground": "#34394750",
    "editorGutter.background": "#0D1117",
    "minimap.background": "#0D1117",
    "minimap.selectionHighlight": "#528BFF55",
  },
};

export const EDITOR_OPTIONS = {
  fontSize: 16,
  lineHeight: 1.6,
  padding: { top: 12, bottom: 12 },
  minimap: {
    enabled: true,
    scale: 2,
    renderCharacters: true,
  },
  scrollBeyondLastLine: false,
  lineNumbers: "on" as const,
  roundedSelection: false,
  wordWrap: "on" as const,
  automaticLayout: true,
  fontFamily: "var(--font-google-sans-code), Consolas, 'Courier New', monospace",
  fontLigatures: true,
  scrollbar: {
    verticalScrollbarSize: 6,
    horizontalScrollbarSize: 6,
    vertical: "visible" as const,
    horizontal: "visible" as const,
    verticalHasArrows: false,
    horizontalHasArrows: false,
    useShadows: true,
  },
  cursorBlinking: "smooth" as const,
  cursorSmoothCaretAnimation: "on" as const,
  cursorWidth: 2,
};

export const EDITOR_THEME_NAME = "modernIDETheme";
export const EDITOR_DEFAULT_LANGUAGE = "json";
