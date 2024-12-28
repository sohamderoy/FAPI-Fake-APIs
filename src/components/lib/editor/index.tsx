import { Editor as MonacoEditor } from "@monaco-editor/react";
import { EditorProps } from "./types";

const Editor = ({ value, onChange }: EditorProps) => {
  const modernIDEThemeOptions = {
    base: "vs-dark",
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

  return (
    <div className="relative h-full">
      <div
        className="absolute inset-0 rounded-lg p-[1px] bg-gradient-to-r from-[#3B82F6] via-[#528BFF] to-[#5DE4C7] opacity-50"
        style={{ pointerEvents: "none" }}
      />

      {/* Main editor container */}
      <div className="relative h-full rounded-lg overflow-hidden bg-[#0D1117]">
        <MonacoEditor
          defaultLanguage="json"
          theme="modernIDETheme"
          beforeMount={(monaco) => {
            try {
              monaco.editor.defineTheme(
                "modernIDETheme",
                modernIDEThemeOptions
              );
            } catch (error) {
              console.error("Error defining theme:", error);
              console.log("Falling back to default vs-dark theme");
            }
          }}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          height="100%"
          options={{
            fontSize: 16,
            lineHeight: 1.6,
            padding: { top: 12, bottom: 12 },
            minimap: {
              enabled: true,
              scale: 2,
              renderCharacters: true,
            },
            scrollBeyondLastLine: false,
            lineNumbers: "on",
            roundedSelection: false,
            wordWrap: "on",
            automaticLayout: true,
            fontFamily: "'JetBrains Mono', Consolas, 'Courier New', monospace",
            fontLigatures: true,
            scrollbar: {
              verticalScrollbarSize: 6,
              horizontalScrollbarSize: 6,
              vertical: "visible",
              horizontal: "visible",
              verticalHasArrows: false,
              horizontalHasArrows: false,
              useShadows: true,
            },
            cursorBlinking: "smooth",
            cursorSmoothCaretAnimation: "on",
            cursorWidth: 2,
          }}
          onMount={(editor, monaco) => {
            editor.layout();
          }}
        />
      </div>
    </div>
  );
};

export default Editor;
