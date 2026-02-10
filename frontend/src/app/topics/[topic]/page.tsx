"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { fetchMarkets, fetchTopicInfo, fetchSubtopics, Market, Topic, SubtopicInfo } from "@/lib/api";
import { BacktestForm } from "@/components/backtest";

export default function MarketsPage() {
  const params = useParams();
  const topic = decodeURIComponent(params.topic as string);

  // Common state
  const [topicInfo, setTopicInfo] = useState<Topic | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for non-continuous (market selection)
  const [markets, setMarkets] = useState<Market[]>([]);

  // State for subtopics
  const [subtopics, setSubtopics] = useState<SubtopicInfo[]>([]);
  const [hasSubtopics, setHasSubtopics] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        // First, check if this topic has subtopics
        const subtopicsResponse = await fetchSubtopics(topic);

        if (subtopicsResponse.count > 0) {
          // Has subtopics - show subtopic selection
          setHasSubtopics(true);
          setSubtopics(subtopicsResponse.subtopics);
        } else {
          // No subtopics - show original behavior
          const info = await fetchTopicInfo(topic);
          setTopicInfo(info);

          // If not continuous, also fetch markets
          if (info && !info.continuous) {
            const data = await fetchMarkets(topic);
            setMarkets(data.markets);
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [topic]);


  // Render loading state
  if (loading) {
    return (
      <main className="min-h-screen bg-bg-primary">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="bg-bg-secondary rounded-xl border border-border p-5">
                <div className="skeleton h-5 w-96 rounded mb-2"></div>
                <div className="skeleton h-4 w-24 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  // Render error state
  if (error) {
    return (
      <main className="min-h-screen bg-bg-primary">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="bg-bearish/10 border border-bearish/20 rounded-xl p-6 text-center">
            <p className="text-bearish mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="btn-secondary"
            >
              Try Again
            </button>
          </div>
        </div>
      </main>
    );
  }

  // If has subtopics, parse and group them
  if (hasSubtopics) {
    // Parse subtopics to extract groups
    // Example: "High Vol 1" → { group: "High Vol", period: 1 }
    const parseSubtopic = (subtopic: string): { group: string; period: number | null } => {
      // Match pattern: "Text Number" at the end
      const match = subtopic.match(/^(.+?)\s+(\d+)$/);
      if (match) {
        return { group: match[1].trim(), period: parseInt(match[2], 10) };
      }
      // If no number, treat whole string as group
      return { group: subtopic, period: null };
    };

    // Group subtopics by their base name
    const groupedSubtopics = subtopics.reduce((acc, subtopicInfo) => {
      const { group, period } = parseSubtopic(subtopicInfo.subtopic);
      if (!acc[group]) {
        acc[group] = {
          groupName: group,
          periods: [],
          continuous: subtopicInfo.continuous,
        };
      }
      if (period !== null) {
        acc[group].periods.push({ period, fullName: subtopicInfo.subtopic });
      }
      return acc;
    }, {} as Record<string, { groupName: string; periods: { period: number; fullName: string }[]; continuous: boolean }>);

    const groups = Object.values(groupedSubtopics).map(g => ({
      ...g,
      periods: g.periods.sort((a, b) => a.period - b.period),
    }));

    return (
      <main className="min-h-screen bg-bg-primary">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="mb-10">
            <Link
              href="/topics"
              className="inline-flex items-center text-text-tertiary hover:text-pink-400 text-sm mb-4 transition-colors"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Topics
            </Link>
            <h1 className="font-[family-name:var(--font-chakra)] text-3xl md:text-4xl font-bold text-pink-50 mb-3">
              {topic} - Select Group
            </h1>
            <p className="text-text-secondary text-lg">
              Choose a market condition group
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groups.map((group, i) => (
              <Link
                key={group.groupName}
                href={`/topics/${encodeURIComponent(topic)}/${encodeURIComponent(group.groupName)}`}
                className="group bg-bg-secondary rounded-xl border border-border p-6 card-hover animate-fade-in-up"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="w-14 h-14 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-4 group-hover:bg-purple-500/20 transition-colors">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                  </svg>
                </div>
                <h2 className="font-[family-name:var(--font-chakra)] text-xl font-semibold text-pink-50 mb-2">
                  {group.groupName}
                </h2>
                <div className="flex items-center gap-2 text-text-tertiary text-sm mb-2">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    group.continuous
                      ? "bg-bullish/10 text-bullish"
                      : "bg-pink-500/10 text-pink-400"
                  }`}>
                    {group.continuous ? "Continuous" : "Event-based"}
                  </span>
                  <span className="text-xs text-text-tertiary">
                    {group.periods.length} period{group.periods.length !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="mt-4 flex items-center text-purple-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  View Periods
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    );
  }

  // For continuous markets, use the shared BacktestForm component
  if (topicInfo?.continuous) {
    return (
      <BacktestForm
        mode="continuous"
        topic={topic}
        backLink={{
          href: "/topics",
          label: "Back to Topics",
        }}
        title={topic}
        subtitle="Continuous Market - Backtest across multiple sequential markets"
      />
    );
  }

  // Render non-continuous (market selection) - original behavior
  return (
    <main className="min-h-screen bg-bg-primary">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-10">
          <Link
            href="/topics"
            className="inline-flex items-center text-text-tertiary hover:text-pink-400 text-sm mb-4 transition-colors"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Topics
          </Link>
          <h1 className="font-[family-name:var(--font-chakra)] text-3xl md:text-4xl font-bold text-pink-50 mb-3">
            {topic}
          </h1>
          <p className="text-text-secondary text-lg">
            Select a market to run backtests
          </p>
        </div>

        <div className="space-y-3">
          {markets.map((market, i) => (
            <Link
              key={market.clob_token_id}
              href={`/backtest/${encodeURIComponent(market.clob_token_id)}`}
              className="group flex items-center justify-between bg-bg-secondary rounded-xl border border-border p-5 card-hover animate-fade-in-up"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className="flex-1 min-w-0">
                <div className="text-text-primary text-sm pr-4">
                  {market.question}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-pink-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  Run Backtest
                </span>
                <div className="w-10 h-10 rounded-lg bg-bg-tertiary group-hover:bg-pink-500/10 flex items-center justify-center transition-colors">
                  <svg className="w-5 h-5 text-text-tertiary group-hover:text-pink-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {markets.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-bg-secondary border border-border mx-auto mb-4 flex items-center justify-center">
              <svg className="w-8 h-8 text-text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h3 className="text-text-primary text-lg font-medium mb-2">No markets available</h3>
            <p className="text-text-tertiary">This topic doesn&apos;t have any markets yet</p>
          </div>
        )}

        {markets.length > 0 && (
          <div className="mt-8 text-center text-text-tertiary text-sm">
            Showing {markets.length} market{markets.length !== 1 ? "s" : ""}
          </div>
        )}
      </div>
    </main>
  );
}
