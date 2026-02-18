"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const breadcrumbs: BreadcrumbItem[] = [{ label: "Home", href: "/" }];

  if (pathname === "/") {
    return [];
  }

  const segments = pathname.split("/").filter(Boolean);

  if (segments[0] === "topics") {
    breadcrumbs.push({ label: "Topics", href: "/topics" });
    if (segments[1]) {
      const topicName = decodeURIComponent(segments[1]);
      breadcrumbs.push({ label: topicName });
    }
  } else if (segments[0] === "backtest") {
    breadcrumbs.push({ label: "Topics", href: "/topics" });
    breadcrumbs.push({ label: "Backtest" });
  } else if (segments[0] === "data-analysis") {
    breadcrumbs.push({ label: "Data Analysis" });
  }

  return breadcrumbs;
}

const NAV_PARTICLES = [
  { left: "4%",  size: 3, delay: 0,   dur: 3.2, bottom: 2  },
  { left: "11%", size: 2, delay: 1.0, dur: 2.6, bottom: 6  },
  { left: "19%", size: 4, delay: 0.4, dur: 3.8, bottom: 0  },
  { left: "28%", size: 2, delay: 2.0, dur: 3.0, bottom: 8  },
  { left: "37%", size: 3, delay: 0.7, dur: 4.1, bottom: 3  },
  { left: "47%", size: 2, delay: 1.6, dur: 2.9, bottom: 5  },
  { left: "57%", size: 4, delay: 0.2, dur: 3.5, bottom: 1  },
  { left: "66%", size: 2, delay: 2.4, dur: 2.7, bottom: 7  },
  { left: "75%", size: 3, delay: 1.2, dur: 3.9, bottom: 2  },
  { left: "84%", size: 2, delay: 0.9, dur: 3.3, bottom: 4  },
  { left: "92%", size: 3, delay: 1.8, dur: 2.8, bottom: 0  },
  { left: "50%", size: 2, delay: 3.0, dur: 4.0, bottom: 9  },
];

export function GlobalNavbar() {
  const pathname = usePathname();
  const isLandingPage = pathname === "/";
  const isDataAnalysis = pathname === "/data-analysis";
  const breadcrumbs = generateBreadcrumbs(pathname);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        isLandingPage
          ? "bg-bg-primary/80 backdrop-blur-xl"
          : "bg-bg-secondary/95 backdrop-blur-xl"
      } border-b border-border`}
    >
      {/* Particles — always visible on data-analysis */}
      {isDataAnalysis && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {NAV_PARTICLES.map((p, i) => (
            <div
              key={i}
              className="nav-particle"
              style={{
                left: p.left,
                bottom: p.bottom,
                width: p.size,
                height: p.size,
                animationDelay: `${p.delay}s`,
                animationDuration: `${p.dur}s`,
                opacity: 0,
              }}
            />
          ))}
        </div>
      )}
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Left: Logo + Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-9 h-9 transition-transform group-hover:scale-105">
            <Image
              src="/logo.png"
              alt="PredictBack Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <span className="font-[family-name:var(--font-chakra)] font-bold text-xl text-pink-50 hidden sm:block">
            PredictBack
          </span>
        </Link>

        {/* Center: Breadcrumbs (only on inner pages) */}
        {breadcrumbs.length > 0 && (
          <div className="hidden md:flex items-center gap-2 text-sm absolute left-1/2 -translate-x-1/2">
            {breadcrumbs.map((crumb, index) => (
              <div key={index} className="flex items-center gap-2">
                {index > 0 && (
                  <svg
                    className="w-4 h-4 text-text-tertiary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                )}
                {crumb.href ? (
                  <Link
                    href={crumb.href}
                    className="text-text-secondary hover:text-pink-400 transition-colors"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-pink-400 font-medium">
                    {crumb.label}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Right: Nav links + Social + Launch App */}
        <div className="flex items-center gap-4">
          {/* Landing page nav links */}
          {isLandingPage && (
            <>
              <div className="hidden md:flex items-center gap-6">
                <a
                  href="#features"
                  className="text-sm text-text-secondary hover:text-pink-400 transition-colors"
                >
                  Features
                </a>
                <a
                  href="#how-it-works"
                  className="text-sm text-text-secondary hover:text-pink-400 transition-colors"
                >
                  How It Works
                </a>
                <div className="relative inline-flex items-center">
                  {/* Sparkle particles */}
                  {[
                    { top: -6,  left: 4,   size: 2.5, delay: 0    },
                    { top: -5,  left: 40,  size: 2,   delay: 0.6  },
                    { top: -4,  left: 72,  size: 2.5, delay: 1.2  },
                    { top:  4,  left: -4,  size: 2,   delay: 0.3  },
                    { top:  14, left: 20,  size: 2,   delay: 0.9  },
                    { top:  13, left: 60,  size: 2.5, delay: 1.5  },
                  ].map((s, i) => (
                    <span
                      key={i}
                      className="link-sparkle"
                      style={{
                        top: s.top,
                        left: s.left,
                        width: s.size,
                        height: s.size,
                        animationDelay: `${s.delay}s`,
                        animationDuration: "2.2s",
                      }}
                    />
                  ))}
                  <Link
                    href="/data-analysis"
                    className="text-sm text-pink-400 hover:text-pink-300 transition-colors font-medium"
                  >
                    Data Analysis
                  </Link>
                </div>
                <a
                  href="https://predictback.gitbook.io/predictback-docs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-text-secondary hover:text-pink-400 transition-colors"
                >
                  Docs
                </a>
              </div>

              {/* Social Links */}
              <div className="hidden sm:flex items-center gap-3 border-l border-border pl-4">
                <a
                  href="https://x.com/PredictBack"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text-tertiary hover:text-pink-400 transition-colors"
                  aria-label="X (Twitter)"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                <a
                  href="https://medium.com/@ssp-labs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text-tertiary hover:text-pink-400 transition-colors"
                  aria-label="Medium"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z"/>
                  </svg>
                </a>
                <a
                  href="https://predictback.gitbook.io/predictback-docs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text-tertiary hover:text-pink-400 transition-colors"
                  aria-label="Documentation"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                  </svg>
                </a>
              </div>

              {/* Launch App Button */}
              <Link
                href="/topics"
                className="inline-flex items-center gap-2 bg-pink-500 hover:bg-pink-400 text-white px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 hover:shadow-[0_0_16px_rgba(255,71,133,0.4)]"
              >
                Launch App
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </>
          )}

          {/* Inner page quick nav */}
          {!isLandingPage && (
            <>
              <Link
                href="/topics"
                className="hidden sm:flex items-center gap-1.5 text-sm text-text-secondary hover:text-pink-400 transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                  />
                </svg>
                Browse Topics
              </Link>
              <a
                href="https://predictback.gitbook.io/predictback-docs"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-text-secondary hover:text-pink-400 transition-colors"
              >
                Docs
              </a>
            </>
          )}

        </div>
      </div>
    </nav>
  );
}
