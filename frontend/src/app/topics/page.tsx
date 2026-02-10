"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchTopics, Topic } from "@/lib/api";

export default function TopicsPage() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadTopics() {
      try {
        const data = await fetchTopics();
        setTopics(data.topics);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load topics");
      } finally {
        setLoading(false);
      }
    }
    loadTopics();
  }, []);

  // Split topics: first 3 (BTC, ETH, SOL) go on a special row, rest in grid
  const cryptoTopics = topics.slice(0, 3);
  const remainingTopics = topics.slice(3);

  const renderTopicCard = (topic: Topic, i: number, compact = false) => (
    <Link
      key={topic.name}
      href={`/topics/${encodeURIComponent(topic.name)}`}
      className="group relative bg-bg-secondary rounded-x0 border border-border p-5 card-hover animate-fade-in-up"
      style={{ animationDelay: `${i * 0.05}s` }}
    >
      <div className="flex items-start gap-4">
        {topic.icon_url && topic.continuous && (
          <div
            className="w-12 h-12 rounded-xl flex-shrink-0"
            style={{
              backgroundImage: `url(${topic.icon_url})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        )}
        <div className="flex-1 min-w-0">
          <h2 className="font-[family-name:var(--font-chakra)] text-lg font-semibold text-pink-50 mb-1">
            {topic.name}
          </h2>
          <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
              topic.continuous
                ? "bg-bullish/10 text-bullish"
                : "bg-pink-500/10 text-pink-400"
            }`}>
              {topic.continuous ? "Continuous" : "Event-based"}
            </span>
            {topic.negrisk && (
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-orange-500/10 text-orange-400">
                Negrisk
              </span>
            )}
            {topic.subtopic_count && topic.subtopic_count > 0 && (
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-purple-500/10 text-purple-400">
                {topic.subtopic_count} subtopic{topic.subtopic_count !== 1 ? "s" : ""}
              </span>
            )}
          </div>
          {topic.date_range && (
            <p className="text-text-tertiary text-xs">
              {topic.date_range}
            </p>
          )}
        </div>
        <div className="flex-shrink-0 self-center">
          <svg className="w-5 h-5 text-text-tertiary group-hover:text-pink-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );

  return (
    <main className="min-h-screen bg-bg-primary">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-10">
          <h1 className="font-[family-name:var(--font-chakra)] text-3xl md:text-4xl font-bold text-pink-50 mb-3">
            Select a Topic
          </h1>
          <p className="text-text-secondary text-lg">
            Choose a prediction market category to explore available markets
          </p>
        </div>

        {loading ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-bg-secondary rounded-xl border border-border p-5">
                  <div className="flex items-start gap-4">
                    <div className="skeleton h-12 w-12 rounded-xl"></div>
                    <div className="flex-1">
                      <div className="skeleton h-5 w-24 rounded mb-2"></div>
                      <div className="skeleton h-4 w-32 rounded"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="bg-bg-secondary rounded-xl border border-border p-5">
                <div className="flex items-start gap-4">
                  <div className="skeleton h-12 w-12 rounded-xl"></div>
                  <div className="flex-1">
                    <div className="skeleton h-5 w-48 rounded mb-2"></div>
                    <div className="skeleton h-4 w-64 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-bearish/10 border border-bearish/20 rounded-xl p-6 text-center">
            <p className="text-bearish mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="btn-secondary"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Top row: BTC, ETH, SOL side by side */}
            {cryptoTopics.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {cryptoTopics.map((topic, i) => renderTopicCard(topic, i, true))}
              </div>
            )}

            {/* Remaining topics in a single column list */}
            {remainingTopics.map((topic, i) => renderTopicCard(topic, i + cryptoTopics.length))}
          </div>
        )}

        {!loading && !error && topics.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-bg-secondary border border-border mx-auto mb-4 flex items-center justify-center">
              <svg className="w-8 h-8 text-text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h3 className="text-text-primary text-lg font-medium mb-2">No topics available</h3>
            <p className="text-text-tertiary">Check back later for available prediction markets</p>
          </div>
        )}
      </div>
    </main>
  );
}
