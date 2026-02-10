"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { fetchMarkets, fetchTopicInfo, fetchSubtopics, Market, Topic, SubtopicInfo } from "@/lib/api";
import { BacktestForm } from "@/components/backtest";

export default function SubtopicPage() {
  const params = useParams();
  const topic = decodeURIComponent(params.topic as string);
  const subtopic = decodeURIComponent(params.subtopic as string);

  const [topicInfo, setTopicInfo] = useState<Topic | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [markets, setMarkets] = useState<Market[]>([]);

  // For group view (showing periods)
  const [isGroupView, setIsGroupView] = useState(false);
  const [periods, setPeriods] = useState<{ period: number; fullName: string }[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        // First, fetch all subtopics to determine if this is a group or specific subtopic
        const subtopicsResponse = await fetchSubtopics(topic);

        // Parse subtopics to check if current subtopic is a group name
        const parseSubtopic = (subtopicName: string): { group: string; period: number | null } => {
          const match = subtopicName.match(/^(.+?)\s+(\d+)$/);
          if (match) {
            return { group: match[1].trim(), period: parseInt(match[2], 10) };
          }
          return { group: subtopicName, period: null };
        };

        // Check if subtopic matches a group name
        const matchingPeriods: { period: number; fullName: string; continuous: boolean }[] = [];
        let isContinuous = false;

        for (const st of subtopicsResponse.subtopics) {
          const { group, period } = parseSubtopic(st.subtopic);
          if (group === subtopic && period !== null) {
            matchingPeriods.push({ period, fullName: st.subtopic, continuous: st.continuous });
            isContinuous = st.continuous;
          }
        }

        if (matchingPeriods.length > 0) {
          // This is a group view - show periods
          setIsGroupView(true);
          setPeriods(matchingPeriods.sort((a, b) => a.period - b.period));
          setTopicInfo({ name: topic, continuous: isContinuous, created_at: "", subtopic: null });
        } else {
          // This is a specific subtopic - show backtest form or markets
          setIsGroupView(false);
          const info = await fetchTopicInfo(topic, subtopic);
          setTopicInfo(info);

          // For non-continuous, fetch markets filtered by subtopic
          if (info && !info.continuous) {
            const data = await fetchMarkets(topic, subtopic);
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
  }, [topic, subtopic]);

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

  // If this is a group view, show period selection
  if (isGroupView) {
    return (
      <main className="min-h-screen bg-bg-primary">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="mb-10">
            <Link
              href={`/topics/${encodeURIComponent(topic)}`}
              className="inline-flex items-center text-text-tertiary hover:text-pink-400 text-sm mb-4 transition-colors"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Groups
            </Link>
            <h1 className="font-[family-name:var(--font-chakra)] text-3xl md:text-4xl font-bold text-pink-50 mb-3">
              {topic} - {subtopic}
            </h1>
            <p className="text-text-secondary text-lg">
              Select a period to run backtest
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {periods.map((periodInfo, i) => (
              <Link
                key={periodInfo.fullName}
                href={`/topics/${encodeURIComponent(topic)}/${encodeURIComponent(periodInfo.fullName)}`}
                className="group bg-bg-secondary rounded-xl border border-border p-6 card-hover animate-fade-in-up"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="w-14 h-14 rounded-xl bg-bullish/10 text-bullish flex items-center justify-center mb-4 group-hover:bg-bullish/20 transition-colors">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="font-[family-name:var(--font-chakra)] text-xl font-semibold text-pink-50 mb-2">
                  Period {periodInfo.period}
                </h2>
                <p className="text-text-tertiary text-sm mb-2">
                  {periodInfo.fullName}
                </p>
                <div className="mt-4 flex items-center text-bullish text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Run Backtest
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

  // For continuous markets, use BacktestForm with subtopic
  if (topicInfo?.continuous) {
    return (
      <BacktestForm
        mode="continuous"
        topic={topic}
        subtopic={subtopic}
        backLink={{
          href: `/topics/${encodeURIComponent(topic)}`,
          label: "Back to Subtopics",
        }}
        title={`${topic} - ${subtopic}`}
        subtitle="Continuous Market - Backtest across multiple sequential markets"
      />
    );
  }

  // For non-continuous, show market selection (similar to existing code)
  return (
    <main className="min-h-screen bg-bg-primary">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-10">
          <Link
            href={`/topics/${encodeURIComponent(topic)}`}
            className="inline-flex items-center text-text-tertiary hover:text-pink-400 text-sm mb-4 transition-colors"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Subtopics
          </Link>
          <h1 className="font-[family-name:var(--font-chakra)] text-3xl md:text-4xl font-bold text-pink-50 mb-3">
            {topic} - {subtopic}
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
            <p className="text-text-tertiary">This subtopic doesn&apos;t have any markets yet</p>
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
