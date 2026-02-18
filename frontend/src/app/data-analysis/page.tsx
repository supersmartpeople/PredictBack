export const metadata = {
  title: "Data Analysis | PredictBack",
  description: "Prediction market analytics, calibration, and market microstructure insights.",
};

export default function DataAnalysisPage() {
  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] w-full">
      {/* Attribution banner */}
      <div className="flex-shrink-0 px-6 py-2.5 bg-bg-secondary border-b border-border text-sm text-text-secondary text-center">
        Data Analysis provided by{" "}
        <a
          href="https://www.jbecker.dev/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-pink-400 hover:text-pink-300 transition-colors font-medium"
        >
          Jonathan Becker
        </a>
        . Not associated with PredictBack, but we thank him!
      </div>

      {/* Charts iframe */}
      <iframe
        src="/charts.html"
        className="flex-1 w-full border-0"
        title="Prediction Market Data Analysis"
      />
    </div>
  );
}
