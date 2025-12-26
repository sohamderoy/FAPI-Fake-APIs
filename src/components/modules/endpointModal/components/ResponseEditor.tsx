import { Editor } from "@/components/lib";

interface ResponseEditorProps {
  value: string;
  onChange: (value: string | undefined) => void;
}

const ResponseEditor = ({ value, onChange }: ResponseEditorProps) => {
  return (
    <div className="flex-1 min-h-0 mb-1">
      <p className="text-gray-300 mb-2 text-sm">Response Body (JSON)</p>
      <div className="h-[calc(100%-40px)]">
        <Editor value={value} onChange={onChange} />
      </div>
    </div>
  );
};

export default ResponseEditor;
