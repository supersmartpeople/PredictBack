export const metadata = {
  title: "Data Analysis | PredictBack",
  description: "Prediction market analytics, calibration, and market microstructure insights.",
};

export default function DataAnalysisPage() {
  return (
    <div className="h-[calc(100vh-4rem)] w-full">
      <iframe
        src="/charts.html"
        className="w-full h-full border-0"
        title="Prediction Market Data Analysis"
      />
    </div>
  );
}
