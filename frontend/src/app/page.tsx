"use client";

import Link from "next/link";
import Image from "next/image";

  return (
    <main className="min-h-screen bg-bg-primary sakura-pattern relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Gradient Orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-purple-500/15 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-pink-400/10 rounded-full blur-3xl animate-float-slow"></div>

        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f0a_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f0a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>
      </div>
      {/* Hero Section */}
      <section className="pt-16 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-500/10 border border-pink-500/20 mb-8 animate-fade-in-up">
              <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse-soft"></span>
              <span className="text-pink-400 text-sm font-medium">Now in Beta</span>
            </div>

            {/* Main Heading */}
            <h1 className="font-[family-name:var(--font-chakra)] text-5xl md:text-7xl font-bold mb-6 animate-fade-in-up stagger-1">
              <span className="text-pink-50">The Future of</span>
              <br />
              <span className="bg-gradient-to-r from-pink-400 via-pink-500 to-pink-600 bg-clip-text text-transparent">
                Prediction Markets
              </span>
              <br />
              <span className="text-pink-50">Backtesting</span>
            </h1>

            {/* Subtitle */}
            <p className="text-text-secondary text-lg md:text-xl max-w-2xl mx-auto mb-10 animate-fade-in-up stagger-2">
              Test your trading strategies with historical data from prediction markets.
              Analyze performance, optimize parameters, and trade with confidence.
            </p>

            {/* Built by SuperSmartPeople */}
            <div className="mb-10 animate-fade-in-up stagger-2">
              <a
                href="https://supersmartpeople.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-text-tertiary/50 hover:text-pink-400/80 transition-all duration-300 tracking-widest uppercase hover:drop-shadow-[0_0_8px_rgba(255,71,133,0.4)]"
              >
                built by <span className="font-semibold text-text-tertiary/70 hover:text-pink-400 drop-shadow-[0_0_6px_rgba(255,71,133,0.15)]">superSmartPeople</span>
              </a>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up stagger-3">
              <Link
                href="/topics"
                className="group inline-flex items-center gap-3 bg-pink-500 hover:bg-pink-400 text-white px-7 py-3.5 rounded-xl font-medium text-base transition-all duration-200 hover:shadow-[0_0_24px_rgba(255,71,133,0.5)]"
              >
                Get Started
                <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <a
                href="https://predictback.gitbook.io/predictback-docs"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-transparent border border-border hover:border-pink-500/50 text-text-primary hover:text-pink-400 px-7 py-3.5 rounded-xl font-medium text-base transition-all duration-200 hover:bg-bg-tertiary"
              >
                Learn More
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>

            {/* Demo Video */}
            <div className="mt-10 animate-fade-in-up stagger-4">
              <video
                className="w-full max-w-3xl mx-auto rounded-2xl border border-border shadow-2xl"
                src="/li.mp4"
                controls
                playsInline
                preload="metadata"
              />
            </div>
          </div>

          {/* Hero Visual */}
          <div className="mt-20 relative animate-fade-in-up stagger-4">
            <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-transparent to-transparent z-10"></div>
            <div className="bg-bg-secondary rounded-2xl border border-border overflow-hidden shadow-2xl">
              <div className="bg-bg-tertiary px-4 py-3 flex items-center gap-2 border-b border-border">
                <div className="w-3 h-3 rounded-full bg-bearish"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-bullish"></div>
                <span className="text-text-tertiary text-sm ml-4 font-[family-name:var(--font-mono)]">
                  Backtest Results
                </span>
              </div>
              <div className="p-6">
                {/* Mock Chart Preview */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                  {[
                    { label: "Total Return", value: "+1.64%", color: "text-bullish" },
                    { label: "Win Rate", value: "76.54%", color: "text-pink-400" },
                    { label: "Total Trades", value: "162", color: "text-text-primary" },
                    { label: "Max Drawdown", value: "-0.93%", color: "text-bearish" },
                  ].map((stat, i) => (
                    <div key={i} className="bg-bg-tertiary rounded-lg p-4">
                      <div className="text-text-tertiary text-sm mb-1">{stat.label}</div>
                      <div className={`font-[family-name:var(--font-mono)] text-2xl font-semibold ${stat.color}`}>
                        {stat.value}
                      </div>
                    </div>
                  ))}
                </div>
                {/* Mock Chart */}
                <div className="h-48 bg-bg-tertiary rounded-lg flex items-end justify-around px-4 pb-4">
                  {[65, 45, 78, 52, 88, 70, 55, 82, 60, 95, 48, 72, 58, 85, 40, 68, 75, 90, 62, 50].map((height, i) => (
                    <div
                      key={i}
                      className="w-3 rounded-t bg-gradient-to-t from-pink-600 to-pink-400"
                      style={{ height: `${height}%` }}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-[family-name:var(--font-chakra)] text-3xl md:text-4xl font-bold text-pink-50 mb-4">
              Powerful Features
            </h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              Everything you need to test and optimize your prediction market strategies
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                ),
                title: "Multiple Strategies",
                description: "Test Grid and Momentum strategies with customizable parameters"
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ),
                title: "Real-Time Results",
                description: "Get instant backtest results with detailed statistics and visualizations"
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                ),
                title: "Historical Data",
                description: "Access historical market data from various prediction market topics"
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="bg-bg-secondary border border-border rounded-xl p-6 card-hover"
              >
                <div className="w-14 h-14 rounded-xl bg-pink-500/10 text-pink-400 flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="font-[family-name:var(--font-chakra)] text-xl font-semibold text-pink-50 mb-2">
                  {feature.title}
                </h3>
                <p className="text-text-secondary">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-6 bg-bg-secondary/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-[family-name:var(--font-chakra)] text-3xl md:text-4xl font-bold text-pink-50 mb-4">
              How It Works
            </h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              Get started in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Select a Topic",
                description: "Choose from available prediction market categories like elections or BTC price movements"
              },
              {
                step: "02",
                title: "Pick a Market",
                description: "Browse markets within your selected topic and choose one to backtest"
              },
              {
                step: "03",
                title: "Run Backtest",
                description: "Configure your strategy parameters and get instant results with detailed analytics"
              },
            ].map((item, i) => (
              <div key={i} className="relative">
                <div className="text-6xl font-[family-name:var(--font-chakra)] font-bold text-pink-500/10 absolute -top-4 -left-2">
                  {item.step}
                </div>
                <div className="relative pt-8">
                  <h3 className="font-[family-name:var(--font-chakra)] text-xl font-semibold text-pink-50 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-text-secondary">
                    {item.description}
                  </p>
                </div>
                {i < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-px bg-gradient-to-r from-pink-500/50 to-transparent"></div>
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/topics"
              className="group inline-flex items-center gap-3 bg-pink-500 hover:bg-pink-400 text-white px-7 py-3.5 rounded-xl font-medium text-base transition-all duration-200 hover:shadow-[0_0_24px_rgba(255,71,133,0.5)]"
            >
              Start Backtesting
              <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Data Analysis Section */}
      <section className="py-24 px-6 relative overflow-hidden bg-bg-primary">
        {/* Pink particles */}
        {[
          { left: "8%",  size: 4,  delay: 0,   dur: 7,  drift: "30px"  },
          { left: "18%", size: 3,  delay: 1.5, dur: 9,  drift: "-25px" },
          { left: "27%", size: 5,  delay: 0.7, dur: 8,  drift: "20px"  },
          { left: "36%", size: 3,  delay: 2.3, dur: 11, drift: "-30px" },
          { left: "45%", size: 6,  delay: 0.3, dur: 6,  drift: "15px"  },
          { left: "54%", size: 4,  delay: 1.8, dur: 10, drift: "-20px" },
          { left: "63%", size: 3,  delay: 0.9, dur: 8,  drift: "35px"  },
          { left: "72%", size: 5,  delay: 2.6, dur: 7,  drift: "-15px" },
          { left: "81%", size: 4,  delay: 1.2, dur: 9,  drift: "25px"  },
          { left: "90%", size: 3,  delay: 0.5, dur: 12, drift: "-28px" },
          { left: "13%", size: 2,  delay: 3.1, dur: 8,  drift: "18px"  },
          { left: "58%", size: 2,  delay: 2.0, dur: 10, drift: "-22px" },
          { left: "77%", size: 3,  delay: 3.8, dur: 7,  drift: "12px"  },
          { left: "42%", size: 2,  delay: 4.2, dur: 9,  drift: "-35px" },
          { left: "23%", size: 4,  delay: 3.5, dur: 11, drift: "28px"  },
        ].map((p, i) => (
          <div
            key={i}
            className="data-particle"
            style={{
              left: p.left,
              bottom: "0%",
              width: p.size,
              height: p.size,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.dur}s`,
              ["--drift" as string]: p.drift,
              opacity: 0,
            }}
          />
        ))}

        {/* Glow orb */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Left: text */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/20 mb-6">
                <svg className="w-3.5 h-3.5 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span className="text-pink-400 text-xs font-semibold font-[family-name:var(--font-chakra)] uppercase tracking-wider">Market Research</span>
              </div>
              <h2 className="font-[family-name:var(--font-chakra)] text-3xl md:text-4xl font-bold text-pink-50 mb-4 leading-tight">
                Deep Dive into<br />
                <span className="bg-gradient-to-r from-pink-400 to-pink-600 bg-clip-text text-transparent">Market Microstructure</span>
              </h2>
              <p className="text-text-secondary text-lg mb-8 leading-relaxed">
                Explore maker vs. taker dynamics, calibration bias, longshot effects, and win-rate patterns across Kalshi prediction markets — backed by real trade data.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/data-analysis"
                  className="group inline-flex items-center gap-3 bg-pink-500 hover:bg-pink-400 text-white px-6 py-3 rounded-xl font-medium text-sm transition-all duration-200 hover:shadow-[0_0_20px_rgba(255,71,133,0.5)]"
                >
                  Explore Analytics
                  <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Right: stats preview */}
            <div className="bg-bg-secondary border border-border rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-2.5 h-2.5 rounded-full bg-pink-500 animate-pulse-soft" />
                <span className="font-[family-name:var(--font-chakra)] text-sm font-semibold text-pink-50">Live Insights</span>
                <span className="ml-auto bg-pink-500/10 text-pink-400 text-xs font-semibold font-[family-name:var(--font-chakra)] px-2 py-0.5 rounded-full uppercase tracking-wide">Kalshi</span>
              </div>
              {[
                { label: "Maker Avg Return",   value: "+8.3%",   sub: "vs taker –4.1%",    color: "text-bullish"   },
                { label: "Longshot Bias",       value: "Detected", sub: "overpriced at <10¢", color: "text-pink-400"  },
                { label: "Calibration Drift",   value: "±6.2pp",  sub: "across price buckets",color: "text-text-primary"},
                { label: "Peak Trading Hour",   value: "14:00 UTC",sub: "highest VWAP spread", color: "text-pink-400"  },
              ].map((stat, i) => (
                <div key={i} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                  <div>
                    <div className="text-xs text-text-tertiary font-[family-name:var(--font-mono)] mb-0.5">{stat.label}</div>
                    <div className="text-xs text-text-tertiary/60">{stat.sub}</div>
                  </div>
                  <span className={`font-[family-name:var(--font-mono)] font-semibold text-sm ${stat.color}`}>{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-20 px-6 bg-bg-secondary/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-[family-name:var(--font-chakra)] text-3xl md:text-4xl font-bold text-pink-50 mb-4">
              About Us
            </h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              Built by traders and developers who understand the market
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* TJ Profile */}
            <div className="bg-bg-secondary border border-border rounded-xl p-8 card-hover">
              <div className="flex flex-col items-center text-center">
                <div className="relative w-32 h-32 rounded-full overflow-hidden mb-6 ring-2 ring-pink-500/20">
                  <Image
                    src="/tj.jpeg"
                    alt="TJ"
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="font-[family-name:var(--font-chakra)] text-2xl font-bold text-pink-50 mb-2">
                  TJ
                </h3>
                <div className="text-pink-400 font-medium mb-4">
                  Co-Founder (Ex-COO, Product)
                </div>
                <p className="text-text-secondary leading-relaxed">
                  Former COO and product leader who scaled institutional trading operations and infrastructure. Focused on turning real trading workflows into opinionated, usable tools for research and execution.
                </p>
              </div>
            </div>

            {/* JP Profile */}
            <div className="bg-bg-secondary border border-border rounded-xl p-8 card-hover">
              <div className="flex flex-col items-center text-center">
                <div className="relative w-32 h-32 rounded-full overflow-hidden mb-6 ring-2 ring-pink-500/20">
                  <Image
                    src="/jp.jpeg"
                    alt="JP"
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="font-[family-name:var(--font-chakra)] text-2xl font-bold text-pink-50 mb-2">
                  JP
                </h3>
                <div className="text-pink-400 font-medium mb-4">
                  Quant-Dev
                </div>
                <p className="text-text-secondary leading-relaxed">
                  Quantitative developer with experience at two hedge funds, building systematic strategies and trading systems. Winner of the BasedLATAM hackathon with Bondi Finance, blending research rigor with fast prototyping.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 px-6 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-6">
            <div className="flex items-center gap-2">
              <div className="relative w-7 h-7">
                <Image
                  src="/logo.png"
                  alt="PredictBack Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="font-[family-name:var(--font-chakra)] font-semibold text-pink-50">
                PredictBack
              </span>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-6">
              <a
                href="https://x.com/PredictBack"
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-tertiary hover:text-pink-400 transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                <span className="text-sm hidden sm:inline">Twitter</span>
              </a>
              <a
                href="https://predictback.gitbook.io/predictback-docs"
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-tertiary hover:text-pink-400 transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                </svg>
                <span className="text-sm hidden sm:inline">Docs</span>
              </a>
            </div>
          </div>

          <div className="text-center pt-6 border-t border-border">
            <p className="text-text-tertiary text-sm">
              © 2026 PredictBack. Built for the future of prediction markets.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
