"use client";

import { useMemo, useState } from "react";
import clsx from "clsx";

import CodeEditor from "@/components/code-editor";
import { analyzeCode, DEFAULT_SAMPLE } from "@/lib/analyze-code";
import type { AnalysisResult } from "@/lib/analyze-code";

const languageOptions = [
  { label: "TypeScript", value: "typescript" },
  { label: "JavaScript", value: "javascript" },
  { label: "Python", value: "python" },
  { label: "Go", value: "go" },
  { label: "Ruby", value: "ruby" }
];

const actionTabs: { id: ActionView; label: string; description: string }[] = [
  { id: "summary", label: "Explain", description: "Generate an overview of intent and shape." },
  { id: "suggestions", label: "Improve", description: "Surface tactical improvements and lint-like catches." },
  { id: "tests", label: "Test Plan", description: "Draft scenarios that should be verified." },
  { id: "docstring", label: "Docs", description: "Bootstrap documentation and inline notes." },
  { id: "refactor", label: "Refactor", description: "Sequence next steps and guardrails." }
];

type ActionView = "summary" | "suggestions" | "tests" | "docstring" | "refactor";

type MetricBadgeProps = {
  label: string;
  value: string | number;
  emphasis?: "good" | "caution";
};

function MetricBadge({ label, value, emphasis }: MetricBadgeProps) {
  return (
    <div
      className={clsx("metric-badge", {
        "metric-badge--good": emphasis === "good",
        "metric-badge--caution": emphasis === "caution"
      })}
    >
      <span className="metric-label">{label}</span>
      <span className="metric-value">{value}</span>
    </div>
  );
}

function InsightList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="insight-list animate-fade-in">
      <h3>{title}</h3>
      <ul>
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

function Checklist({ items }: { items: AnalysisResult["checklist"] }) {
  return (
    <div className="checklist animate-fade-in">
      <h3>Delivery Checklist</h3>
      <ul>
        {items.map((item) => (
          <li key={item.label}>
            <span className={clsx("check", { checked: item.checked })}>{item.checked ? "✔" : "○"}</span>
            {item.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

function MetricsPanel({ analysis }: { analysis: AnalysisResult }) {
  const { metrics } = analysis;

  return (
    <div className="metrics-panel animate-fade-in">
      <h3>Complexity Snapshot</h3>
      <div className="metrics-grid">
        <MetricBadge label="Lines" value={metrics.linesOfCode} />
        <MetricBadge label="Branches" value={metrics.branches} />
        <MetricBadge label="Async" value={metrics.asyncOperations} />
        <MetricBadge
          label="Cyclomatic"
          value={metrics.cyclomaticSketch}
          emphasis={metrics.cyclomaticSketch > 12 ? "caution" : metrics.cyclomaticSketch < 6 ? "good" : undefined}
        />
        <MetricBadge
          label="Comments"
          value={`${Math.round(metrics.commentDensity * 100)}%`}
          emphasis={metrics.commentDensity > 0.12 ? "good" : undefined}
        />
        <MetricBadge label="Dependencies" value={metrics.externalDependencies.length} />
      </div>
      {metrics.externalDependencies.length > 0 && (
        <div className="dependency-list">
          <span className="label">External modules</span>
          <div className="chips">
            {metrics.externalDependencies.map((dep) => (
              <span className="chip" key={dep}>
                {dep}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ActivePanel({ analysis, view }: { analysis: AnalysisResult; view: ActionView }) {
  switch (view) {
    case "summary":
      return (
        <div className="summary-panel animate-fade-in">
          <p className="summary">{analysis.summary}</p>
          {analysis.functions.length > 0 && (
            <div className="function-table">
              <div className="function-table__header">
                <span>Callable</span>
                <span>Signature</span>
                <span>Notes</span>
              </div>
              {analysis.functions.map((fn) => (
                <div className="function-table__row" key={fn.name}>
                  <span>{fn.name}</span>
                  <span className="mono">{fn.signature}</span>
                  <span>{fn.description}</span>
                </div>
              ))}
            </div>
          )}
          <MetricsPanel analysis={analysis} />
        </div>
      );
    case "suggestions":
      return (
        <InsightList title="Polish & Guardrails" items={analysis.suggestions} />
      );
    case "tests":
      return <InsightList title="High-Value Scenarios" items={analysis.testIdeas} />;
    case "docstring":
      return (
        <div className="doc-panel animate-fade-in">
          <h3>Docstring Bootstrap</h3>
          <pre>
            <code>{analysis.docstring}</code>
          </pre>
          <p className="footnote">Adapt this scaffold to capture intent, constraints, and failure modes.</p>
        </div>
      );
    case "refactor":
      return (
        <div className="refactor-panel animate-fade-in">
          <h3>Next-Step Blueprint</h3>
          <ol>
            {analysis.refactorPlan.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ol>
          <Checklist items={analysis.checklist} />
        </div>
      );
    default:
      return null;
  }
}

export default function HomePage() {
  const [language, setLanguage] = useState<string>("typescript");
  const [code, setCode] = useState<string>(DEFAULT_SAMPLE);
  const [activeView, setActiveView] = useState<ActionView>("summary");

  const analysis = useMemo<AnalysisResult>(() => analyzeCode(code, language), [code, language]);

  return (
    <main>
      <div className="hero section-card">
        <div>
          <span className="badge">Coding Companion</span>
          <h1>Plan, polish, and explain your code with a single workspace.</h1>
          <p>
            Drop in a snippet, explore guided insights, and leave with a pragmatic plan for tests, refactors, and
            documentation.
          </p>
        </div>
        <div className="hero-stats">
          <div>
            <strong>{analysis.metrics.linesOfCode}</strong>
            <span>lines analysed</span>
          </div>
          <div>
            <strong>{analysis.suggestions.length}</strong>
            <span>suggested improvements</span>
          </div>
          <div>
            <strong>{analysis.testIdeas.length}</strong>
            <span>test ideas</span>
          </div>
        </div>
      </div>

      <div className="grid-responsive grid-two">
        <section className="workspace section-card">
          <div className="workspace-header">
            <div className="language-picker">
              <label htmlFor="language-select">Language</label>
              <select
                id="language-select"
                value={language}
                onChange={(event) => setLanguage(event.target.value)}
              >
                {languageOptions.map(({ label, value }) => (
                  <option value={value} key={value}>
                    {label}
                  </option>
                ))}
              </select>
              <span className="detected">Detected: {analysis.detectedLanguage}</span>
            </div>
            <div className="quick-wins">
              <h3>Quick wins</h3>
              <ul>
                {analysis.quickWins.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
          <CodeEditor language={language} value={code} onChange={setCode} />
        </section>

        <section className="insights section-card">
          <div className="actions">
            {actionTabs.map((action) => (
              <button
                key={action.id}
                type="button"
                className={clsx("action-btn", { active: activeView === action.id })}
                onClick={() => setActiveView(action.id)}
              >
                <span className="action-label">{action.label}</span>
                <span className="action-description">{action.description}</span>
              </button>
            ))}
          </div>
          <div className="insight-content section-card">
            <ActivePanel analysis={analysis} view={activeView} />
          </div>
        </section>
      </div>

      <section className="resources section-card">
        <h2>Resource shortcuts</h2>
        <div className="resource-grid">
          {analysis.resources.map((resource) => (
            <a key={resource.link} href={resource.link} target="_blank" rel="noreferrer" className="resource-card">
              <span className="resource-title">{resource.title}</span>
              <p>{resource.description}</p>
              <span className="resource-link">Open →</span>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
