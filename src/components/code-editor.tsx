"use client";

import { memo, useCallback } from "react";
import Editor from "react-simple-code-editor";
import Prism from "prismjs";

import "prismjs/components/prism-bash";
import "prismjs/components/prism-go";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-json";
import "prismjs/components/prism-python";
import "prismjs/components/prism-ruby";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-typescript";

const languageAliases: Record<string, string> = {
  typescript: "tsx",
  javascript: "jsx",
  python: "python",
  ruby: "ruby",
  go: "go"
};

const CodeEditor = memo(function CodeEditor({
  value,
  onChange,
  language
}: {
  value: string;
  onChange: (value: string) => void;
  language: string;
}) {
  const highlight = useCallback(
    (code: string) => {
      const prismLanguage = languageAliases[language] ?? language;
      const grammar = Prism.languages[prismLanguage] ?? Prism.languages.tsx;
      return Prism.highlight(code, grammar, prismLanguage);
    },
    [language]
  );

  return (
    <div className="code-editor" style={{ padding: 16 }}>
      <Editor
        value={value}
        onValueChange={onChange}
        highlight={highlight}
        padding={16}
        textareaId="coding-companion-editor"
        textareaClassName="editor-textarea"
        preClassName="editor-pre"
        style={{
          fontFamily: '"JetBrains Mono", "Fira Code", "SFMono-Regular", Menlo, monospace',
          fontSize: 14,
          lineHeight: 1.6,
          minHeight: 360,
          color: "#e2e8f0"
        }}
      />
    </div>
  );
});

export default CodeEditor;
