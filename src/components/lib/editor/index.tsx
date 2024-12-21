import { Editor as MonacoEditor } from "@monaco-editor/react";
import { EditorProps } from "./types";

const Editor = ({ value, onChange }: EditorProps) => {
  return (
    <div className="w-full flex-1 border border-gray-900 rounded-lg overflow-hidden">
      <MonacoEditor
        defaultLanguage="json"
        theme="vs-dark"
        value={value}
        onChange={onChange}
        height="500px"
        options={{
          minimap: { enabled: true },
          fontSize: 14,
          scrollBeyondLastLine: false,
          lineNumbers: "on",
          roundedSelection: false,
          padding: { top: 8 },
          wordWrap: "on",
          automaticLayout: true,
          fontFamily: "Consolas, 'Courier New', monospace",
          suggest: {
            showWords: false,
          },
        }}
      ></MonacoEditor>
    </div>
  );
};

export default Editor;
