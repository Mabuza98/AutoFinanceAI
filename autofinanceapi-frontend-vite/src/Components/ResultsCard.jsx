import React from "react";

export default function ResultsCard({ results, loading }) {
  if (loading) {
    return (
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl flex items-center justify-center">
        <p className="text-white text-lg animate-pulse">Analyzing... 🚀</p>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl flex items-center justify-center">
        <p className="text-white/70">Your results will appear here.</p>
      </div>
    );
  }

  // Determine risk color
  const riskColor = results["Risk Level"] === "Low"
    ? "bg-green-500/20 text-green-300"
    : results["Risk Level"] === "Medium"
    ? "bg-yellow-500/20 text-yellow-300"
    : "bg-red-500/20 text-red-300";

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl">
      <h3 className="text-xl font-semibold mb-6">Analysis Results</h3>

      {Object.entries(results).map(([key, value]) => {
        if (key === "Risk Level") {
          return (
            <div key={key} className="flex justify-between py-3">
              <span>{key}</span>
              <span className={`${riskColor} px-3 py-1 rounded-full text-sm`}>
                {value}
              </span>
            </div>
          );
        }
        if (key === "AI Advice") {
          return (
            <div key={key} className="mt-6 bg-blue-500/10 border border-blue-400/30 p-4 rounded-xl">
              <p className="text-blue-300 font-medium">{value}</p>
            </div>
          );
        }
        return (
          <div key={key} className="flex justify-between border-b border-white/20 py-3">
            <span>{key}</span>
            <span className="font-bold">{value}</span>
          </div>
        );
      })}
    </div>
  );
}