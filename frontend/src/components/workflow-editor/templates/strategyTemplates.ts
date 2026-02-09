import type { WorkflowGraph } from "../types/workflow";

export interface StrategyTemplate {
  id: string;
  name: string;
  description: string;
  category: "trend" | "momentum" | "volatility" | "custom";
  difficulty: "beginner" | "intermediate" | "advanced";
  workflow: WorkflowGraph;
}

export const strategyTemplates: StrategyTemplate[] = [
  {
    id: "sma-crossover",
    name: "SMA Crossover",
    description: "Classic trend-following strategy using fast and slow Simple Moving Averages. Buy when fast SMA crosses above slow SMA, sell when it crosses below.",
    category: "trend",
    difficulty: "beginner",
    workflow: {
      nodes: [
        {
          id: "node_0",
          type: "price-data",
          position: { x: 100, y: 200 },
          data: {
            nodeType: "price-data",
            label: "Price Data",
          },
        },
        {
          id: "node_1",
          type: "sma",
          position: { x: 300, y: 100 },
          data: {
            nodeType: "sma",
            label: "Fast SMA",
            outputName: "sma_fast",
            period: 10,
          },
        },
        {
          id: "node_2",
          type: "sma",
          position: { x: 300, y: 300 },
          data: {
            nodeType: "sma",
            label: "Slow SMA",
            outputName: "sma_slow",
            period: 30,
          },
        },
        {
          id: "node_3",
          type: "crossover",
          position: { x: 550, y: 150 },
          data: {
            nodeType: "crossover",
            label: "Golden Cross",
            direction: "above",
          },
        },
        {
          id: "node_4",
          type: "crossover",
          position: { x: 550, y: 250 },
          data: {
            nodeType: "crossover",
            label: "Death Cross",
            direction: "below",
          },
        },
        {
          id: "node_5",
          type: "buy-signal",
          position: { x: 750, y: 150 },
          data: {
            nodeType: "buy-signal",
            label: "Buy Signal",
          },
        },
        {
          id: "node_6",
          type: "sell-signal",
          position: { x: 750, y: 250 },
          data: {
            nodeType: "sell-signal",
            label: "Sell Signal",
          },
        },
      ],
      edges: [
        { id: "e0-1", source: "node_0", target: "node_1", sourceHandle: null, targetHandle: null },
        { id: "e0-2", source: "node_0", target: "node_2", sourceHandle: null, targetHandle: null },
        { id: "e1-3", source: "node_1", target: "node_3", sourceHandle: null, targetHandle: "input_a" },
        { id: "e2-3", source: "node_2", target: "node_3", sourceHandle: null, targetHandle: "input_b" },
        { id: "e1-4", source: "node_1", target: "node_4", sourceHandle: null, targetHandle: "input_a" },
        { id: "e2-4", source: "node_2", target: "node_4", sourceHandle: null, targetHandle: "input_b" },
        { id: "e3-5", source: "node_3", target: "node_5", sourceHandle: null, targetHandle: null },
        { id: "e4-6", source: "node_4", target: "node_6", sourceHandle: null, targetHandle: null },
      ],
      metadata: {
        name: "SMA Crossover Strategy",
        description: "Buy on golden cross (fast SMA > slow SMA), sell on death cross",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    },
  },
  {
    id: "rsi-overbought-oversold",
    name: "RSI Overbought/Oversold",
    description: "Momentum strategy using RSI indicator. Buy when RSI is oversold (<30), sell when overbought (>70).",
    category: "momentum",
    difficulty: "beginner",
    workflow: {
      nodes: [
        {
          id: "node_0",
          type: "price-data",
          position: { x: 100, y: 200 },
          data: {
            nodeType: "price-data",
            label: "Price Data",
          },
        },
        {
          id: "node_1",
          type: "rsi",
          position: { x: 300, y: 200 },
          data: {
            nodeType: "rsi",
            label: "RSI",
            outputName: "rsi",
            period: 14,
          },
        },
        {
          id: "node_2",
          type: "compare",
          position: { x: 500, y: 150 },
          data: {
            nodeType: "compare",
            label: "RSI < 30 (Oversold)",
            operator: "<",
            value: 30,
          },
        },
        {
          id: "node_3",
          type: "compare",
          position: { x: 500, y: 250 },
          data: {
            nodeType: "compare",
            label: "RSI > 70 (Overbought)",
            operator: ">",
            value: 70,
          },
        },
        {
          id: "node_4",
          type: "buy-signal",
          position: { x: 700, y: 150 },
          data: {
            nodeType: "buy-signal",
            label: "Buy Signal",
          },
        },
        {
          id: "node_5",
          type: "sell-signal",
          position: { x: 700, y: 250 },
          data: {
            nodeType: "sell-signal",
            label: "Sell Signal",
          },
        },
      ],
      edges: [
        { id: "e0-1", source: "node_0", target: "node_1", sourceHandle: null, targetHandle: null },
        { id: "e1-2", source: "node_1", target: "node_2", sourceHandle: null, targetHandle: null },
        { id: "e1-3", source: "node_1", target: "node_3", sourceHandle: null, targetHandle: null },
        { id: "e2-4", source: "node_2", target: "node_4", sourceHandle: null, targetHandle: null },
        { id: "e3-5", source: "node_3", target: "node_5", sourceHandle: null, targetHandle: null },
      ],
      metadata: {
        name: "RSI Overbought/Oversold",
        description: "Buy when RSI < 30 (oversold), sell when RSI > 70 (overbought)",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    },
  },
  {
    id: "bollinger-bounce",
    name: "Bollinger Band Bounce",
    description: "Mean reversion strategy using Bollinger Bands. Buy when price touches lower band, sell when it touches upper band.",
    category: "volatility",
    difficulty: "intermediate",
    workflow: {
      nodes: [
        {
          id: "node_0",
          type: "price-data",
          position: { x: 100, y: 250 },
          data: {
            nodeType: "price-data",
            label: "Price Data",
          },
        },
        {
          id: "node_1",
          type: "bollinger",
          position: { x: 300, y: 250 },
          data: {
            nodeType: "bollinger",
            label: "Bollinger Bands",
            outputName: "bb",
            period: 20,
            numStd: 2,
          },
        },
        {
          id: "node_2",
          type: "compare",
          position: { x: 550, y: 150 },
          data: {
            nodeType: "compare",
            label: "Price <= Lower Band",
            operator: "<=",
            compareToIndicator: "bb.lower",
          },
        },
        {
          id: "node_3",
          type: "compare",
          position: { x: 550, y: 350 },
          data: {
            nodeType: "compare",
            label: "Price >= Upper Band",
            operator: ">=",
            compareToIndicator: "bb.upper",
          },
        },
        {
          id: "node_4",
          type: "buy-signal",
          position: { x: 750, y: 150 },
          data: {
            nodeType: "buy-signal",
            label: "Buy Signal",
          },
        },
        {
          id: "node_5",
          type: "sell-signal",
          position: { x: 750, y: 350 },
          data: {
            nodeType: "sell-signal",
            label: "Sell Signal",
          },
        },
      ],
      edges: [
        { id: "e0-1", source: "node_0", target: "node_1", sourceHandle: null, targetHandle: null },
        { id: "e0-2", source: "node_0", target: "node_2", sourceHandle: null, targetHandle: "input_a" },
        { id: "e1-2", source: "node_1", target: "node_2", sourceHandle: "lower", targetHandle: "input_b" },
        { id: "e0-3", source: "node_0", target: "node_3", sourceHandle: null, targetHandle: "input_a" },
        { id: "e1-3", source: "node_1", target: "node_3", sourceHandle: "upper", targetHandle: "input_b" },
        { id: "e2-4", source: "node_2", target: "node_4", sourceHandle: null, targetHandle: null },
        { id: "e3-5", source: "node_3", target: "node_5", sourceHandle: null, targetHandle: null },
      ],
      metadata: {
        name: "Bollinger Band Bounce",
        description: "Buy at lower band, sell at upper band (mean reversion)",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    },
  },
  {
    id: "macd-momentum",
    name: "MACD Momentum",
    description: "Trend and momentum strategy using MACD indicator. Buy when MACD line crosses above signal line, sell when it crosses below.",
    category: "momentum",
    difficulty: "intermediate",
    workflow: {
      nodes: [
        {
          id: "node_0",
          type: "price-data",
          position: { x: 100, y: 200 },
          data: {
            nodeType: "price-data",
            label: "Price Data",
          },
        },
        {
          id: "node_1",
          type: "macd",
          position: { x: 300, y: 200 },
          data: {
            nodeType: "macd",
            label: "MACD",
            outputName: "macd",
            fastPeriod: 12,
            slowPeriod: 26,
            signalPeriod: 9,
          },
        },
        {
          id: "node_2",
          type: "crossover",
          position: { x: 550, y: 150 },
          data: {
            nodeType: "crossover",
            label: "MACD Cross Above",
            direction: "above",
          },
        },
        {
          id: "node_3",
          type: "crossover",
          position: { x: 550, y: 250 },
          data: {
            nodeType: "crossover",
            label: "MACD Cross Below",
            direction: "below",
          },
        },
        {
          id: "node_4",
          type: "buy-signal",
          position: { x: 750, y: 150 },
          data: {
            nodeType: "buy-signal",
            label: "Buy Signal",
          },
        },
        {
          id: "node_5",
          type: "sell-signal",
          position: { x: 750, y: 250 },
          data: {
            nodeType: "sell-signal",
            label: "Sell Signal",
          },
        },
      ],
      edges: [
        { id: "e0-1", source: "node_0", target: "node_1", sourceHandle: null, targetHandle: null },
        { id: "e1-2a", source: "node_1", target: "node_2", sourceHandle: "macd", targetHandle: "input_a" },
        { id: "e1-2b", source: "node_1", target: "node_2", sourceHandle: "signal", targetHandle: "input_b" },
        { id: "e1-3a", source: "node_1", target: "node_3", sourceHandle: "macd", targetHandle: "input_a" },
        { id: "e1-3b", source: "node_1", target: "node_3", sourceHandle: "signal", targetHandle: "input_b" },
        { id: "e2-4", source: "node_2", target: "node_4", sourceHandle: null, targetHandle: null },
        { id: "e3-5", source: "node_3", target: "node_5", sourceHandle: null, targetHandle: null },
      ],
      metadata: {
        name: "MACD Momentum Strategy",
        description: "Buy when MACD crosses above signal line, sell when it crosses below",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    },
  },
];

export function getTemplatesByCategory(category: StrategyTemplate["category"]) {
  return strategyTemplates.filter((t) => t.category === category);
}

export function getTemplatesByDifficulty(difficulty: StrategyTemplate["difficulty"]) {
  return strategyTemplates.filter((t) => t.difficulty === difficulty);
}

export function getTemplateById(id: string) {
  return strategyTemplates.find((t) => t.id === id);
}
