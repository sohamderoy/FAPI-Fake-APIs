import { Editor as MonacoEditor } from "@monaco-editor/react";
import { EditorProps } from "./types";
import {
  MODERN_IDE_THEME_OPTIONS,
  EDITOR_OPTIONS,
  EDITOR_THEME_NAME,
  EDITOR_DEFAULT_LANGUAGE,
} from "./data";

const Editor = ({ value, onChange }: EditorProps) => {

  return (
    <div className="relative h-full">
      <div
        className="absolute inset-0 rounded-lg p-[1px] bg-gradient-to-r from-[#3B82F6] via-[#528BFF] to-[#5DE4C7] opacity-50"
        style={{ pointerEvents: "none" }}
      />

      {/* Main editor container */}
      <div className="relative h-full rounded-lg overflow-hidden bg-[#0D1117]">
        <MonacoEditor
          defaultLanguage={EDITOR_DEFAULT_LANGUAGE}
          theme={EDITOR_THEME_NAME}
          beforeMount={(monaco) => {
            try {
              monaco.editor.defineTheme(
                EDITOR_THEME_NAME,
                MODERN_IDE_THEME_OPTIONS
              );
            } catch (error) {
              console.error("Error defining theme:", error);
              console.log("Falling back to default vs-dark theme");
            }
          }}
          value={value}
          onChange={onChange}
          height="100%"
          options={EDITOR_OPTIONS}
          onMount={(editor, monaco) => {
            editor.layout();
          }}
        />
      </div>
    </div>
  );
};

export default Editor;
