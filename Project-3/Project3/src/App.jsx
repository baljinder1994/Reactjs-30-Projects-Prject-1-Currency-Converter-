import React, { useRef, useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const DEFAULT_MD = `# Welcome to Markdown Previewer

Type your markdown on the left and see live preview on the right.

## Features
- Real-time preview
- **Bold**, _italic_, \`inline code\`
- Code blocks
\`\`\`js
// example
console.log("hello world");
\`\`\`
- Tables

| Name | Age |
|------|-----|
| Alice| 25  |
| Bob  | 30  |

- Task list
- [x] Item 1
- [ ] Item 2

> Quote example

[OpenAI](https://openai.com)
`;

export default function App() {
  const [md, setMd] = useState(DEFAULT_MD);
  const [autoScroll, setAutoScroll] = useState(true);
  const editorRef = useRef(null);
  const previewRef = useRef(null);

  // sync scrolling: when typing in editor, scroll preview to same relative position
  useEffect(() => {
    if (!autoScroll) return;
    const editor = editorRef.current;
    const preview = previewRef.current;
    if (!editor || !preview) return;

    const sync = () => {
      const ratio = editor.scrollTop / (editor.scrollHeight - editor.clientHeight || 1);
      preview.scrollTop = ratio * (preview.scrollHeight - preview.clientHeight || 1);
    };

    // sync on input (already handled by onChange), but also on editor scroll
    const onScroll = () => {
      const ratio = editor.scrollTop / (editor.scrollHeight - editor.clientHeight || 1);
      preview.scrollTop = ratio * (preview.scrollHeight - preview.clientHeight || 1);
    };
    editor.addEventListener("scroll", onScroll);
    // cleanup
    return () => editor.removeEventListener("scroll", onScroll);
  }, [autoScroll]);

  const handleInsert = (before, after = "") => {
    const el = editorRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = md.slice(start, end);
    const newText = md.slice(0, start) + before + selected + after + md.slice(end);
    setMd(newText);

    // restore selection inside inserted text
    const pos = start + before.length + selected.length + after.length;
    // small timeout to let textarea update
    setTimeout(() => {
      el.focus();
      el.selectionStart = el.selectionEnd = pos;
    }, 0);
  };

  const copyHtml = async () => {
    // convert markdown to simple HTML using markdown renderer in a hidden container
    // We'll create a temporary div and use ReactMarkdown to render into it then copy innerHTML
    const temp = document.createElement("div");
    temp.style.position = "fixed";
    temp.style.left = "-99999px";
    document.body.appendChild(temp);
    // render (simple synchronous render approach)
    temp.innerHTML = ""; // just to be safe
    // use a small React render to fill it
    // But to keep things simple and avoid extra rendering, we can wrap markdown in a basic conversion:
    // For trusted local usage, copying the preview innerHTML is OK:
    const preview = previewRef.current;
    if (preview) {
      try {
        await navigator.clipboard.writeText(preview.innerHTML);
        alert("Preview HTML copied to clipboard!");
      } catch (err) {
        alert("Copy failed. Try selecting and copying manually.");
      }
    }
    document.body.removeChild(temp);
  };

  const downloadHtml = () => {
    const preview = previewRef.current;
    if (!preview) return;
    const html = `<!doctype html>
<html>
<head><meta charset="utf-8"><title>Markdown Export</title></head>
<body>${preview.innerHTML}</body>
</html>`;
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "markdown-preview.html";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <header className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold">Markdown Previewer — Live</h1>
          <div className="flex items-center space-x-3">
            <label className="flex items-center space-x-2 text-sm">
              <input type="checkbox" checked={autoScroll} onChange={(e) => setAutoScroll(e.target.checked)} />
              <span>Sync scroll</span>
            </label>
            <button
              onClick={() => { setMd(DEFAULT_MD); }}
              className="px-3 py-1 bg-gray-200 rounded"
            >
              Reset
            </button>
            <button onClick={copyHtml} className="px-3 py-1 bg-blue-600 text-white rounded">Copy Preview HTML</button>
            <button onClick={downloadHtml} className="px-3 py-1 bg-green-600 text-white rounded">Download HTML</button>
          </div>
        </header>

        <div className="grid md:grid-cols-2 gap-4">
          {/* Editor */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-semibold">Editor</h2>
              <div className="flex space-x-2">
                <button onClick={() => handleInsert("**", "**")} className="px-2 py-1 bg-gray-200 rounded text-sm">Bold</button>
                <button onClick={() => handleInsert("_", "_")} className="px-2 py-1 bg-gray-200 rounded text-sm">Italic</button>
                <button onClick={() => handleInsert("`", "`")} className="px-2 py-1 bg-gray-200 rounded text-sm">Code</button>
                <button onClick={() => handleInsert("\n```\n", "\n```\n")} className="px-2 py-1 bg-gray-200 rounded text-sm">Code Block</button>
                <button onClick={() => handleInsert("\n> ", "")} className="px-2 py-1 bg-gray-200 rounded text-sm">Quote</button>
                <button onClick={() => handleInsert("\n- ", "")} className="px-2 py-1 bg-gray-200 rounded text-sm">List</button>
              </div>
            </div>
            <textarea
              ref={editorRef}
              value={md}
              onChange={(e) => setMd(e.target.value)}
              className="h-[60vh] md:h-[70vh] w-full p-3 border rounded resize-none font-mono"
            />
          </div>

          {/* Preview */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-semibold">Preview</h2>
              <div className="text-sm text-gray-500">Rendered via <code>react-markdown</code></div>
            </div>
            <div
              ref={previewRef}
              className="prose prose-sm p-4 h-[60vh] md:h-[70vh] overflow-auto bg-white border rounded"
            >
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{md}</ReactMarkdown>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
