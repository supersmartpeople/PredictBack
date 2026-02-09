"use client";

import { useState } from "react";
import { strategyTemplates, type StrategyTemplate } from "../templates/strategyTemplates";

interface TemplateSelectorProps {
  onLoadTemplate: (template: StrategyTemplate) => void;
}

export function TemplateSelector({ onLoadTemplate }: TemplateSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = [
    { id: "all", label: "All Templates", icon: "📚" },
    { id: "trend", label: "Trend Following", icon: "📈" },
    { id: "momentum", label: "Momentum", icon: "⚡" },
    { id: "volatility", label: "Volatility", icon: "🌊" },
  ];

  const difficulties = {
    beginner: { label: "Beginner", color: "text-bullish" },
    intermediate: { label: "Intermediate", color: "text-yellow-500" },
    advanced: { label: "Advanced", color: "text-bearish" },
  };

  const filteredTemplates = selectedCategory && selectedCategory !== "all"
    ? strategyTemplates.filter((t) => t.category === selectedCategory)
    : strategyTemplates;

  const handleLoadTemplate = (template: StrategyTemplate) => {
    if (confirm(`Load "${template.name}" template? This will replace your current workflow.`)) {
      onLoadTemplate(template);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 text-xs text-text-secondary hover:text-pink-400 transition-colors px-2 py-1"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        Templates
      </button>

      {/* Template Modal */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Modal Content */}
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-4xl max-h-[80vh] bg-bg-secondary border border-border rounded-xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <div>
                <h2 className="text-xl font-[family-name:var(--font-chakra)] font-bold text-pink-50">
                  Strategy Templates
                </h2>
                <p className="text-sm text-text-secondary mt-1">
                  Get started quickly with pre-built strategies
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-text-tertiary hover:text-text-primary transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Category Filter */}
            <div className="px-6 py-4 border-b border-border bg-bg-tertiary">
              <div className="flex items-center gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedCategory === cat.id || (selectedCategory === null && cat.id === "all")
                        ? "bg-pink-500 text-white"
                        : "bg-bg-secondary text-text-secondary hover:text-text-primary hover:bg-bg-elevated"
                    }`}
                  >
                    <span className="mr-2">{cat.icon}</span>
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Templates Grid */}
            <div className="p-6 overflow-y-auto max-h-[calc(80vh-200px)]">
              <div className="grid md:grid-cols-2 gap-4">
                {filteredTemplates.map((template) => (
                  <div
                    key={template.id}
                    className="bg-bg-tertiary border border-border rounded-lg p-5 hover:border-pink-500/50 transition-all cursor-pointer group"
                    onClick={() => handleLoadTemplate(template)}
                  >
                    {/* Template Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-[family-name:var(--font-chakra)] font-semibold text-pink-50 group-hover:text-pink-400 transition-colors">
                          {template.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-xs font-medium ${difficulties[template.difficulty].color}`}>
                            {difficulties[template.difficulty].label}
                          </span>
                          <span className="text-xs text-text-tertiary">•</span>
                          <span className="text-xs text-text-tertiary capitalize">
                            {template.category}
                          </span>
                        </div>
                      </div>
                      <svg
                        className="w-5 h-5 text-text-tertiary group-hover:text-pink-400 transition-colors flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </div>

                    {/* Template Description */}
                    <p className="text-sm text-text-secondary leading-relaxed">
                      {template.description}
                    </p>

                    {/* Template Stats */}
                    <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border">
                      <div className="flex items-center gap-1.5 text-xs text-text-tertiary">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                        </svg>
                        {template.workflow.nodes.length} nodes
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-text-tertiary">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        {template.workflow.edges.length} connections
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredTemplates.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-4xl mb-4">📭</div>
                  <p className="text-text-secondary">No templates found in this category</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
