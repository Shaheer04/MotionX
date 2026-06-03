"use client";
import { useState, useEffect } from "react";

const UNHINGED_FACTS = [
  "Did you know? The human brain processes video 60,000 times faster than text. We're practically meat-based GPUs.",
  "Adding video to your landing page can boost conversions by 86%. Or you could just keep your plain text and cry. Your call.",
  "Viewers retain 95% of a message when they watch it in a video, compared to 10% when reading it. Read that again. See? You already forgot.",
  "By 2025, videos will make up 82% of all consumer internet traffic. The other 18% is just people trying to figure out how to exit vim.",
  "Emails with the word 'video' in the subject line get opened 19% more often. It's like a cheat code for human curiosity.",
  "A one-minute video is worth 1.8 million words. We just saved you from writing a novel.",
  "Your competitors are already generating videos while you read this. Don't let them win."
];

export default function Home() {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState("idle"); // idle, processing, success, error
  const [jobId, setJobId] = useState("");
  const [factIndex, setFactIndex] = useState(0);
  const [videoResult, setVideoResult] = useState<any>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (status === "processing") {
      interval = setInterval(() => {
        setFactIndex((prev) => (prev + 1) % UNHINGED_FACTS.length);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [status]);

  useEffect(() => {
    if (status === "processing" && jobId) {
      const pollInterval = setInterval(async () => {
        try {
          // Adjust backend URL to match your actual FastAPI port
          const res = await fetch(`http://localhost:8000/api/jobs/${jobId}/status`);
          const data = await res.json();
          if (data.status === "success") {
            setStatus("success");
            setVideoResult(data.result);
            clearInterval(pollInterval);
          } else if (data.status === "failed") {
            setStatus("error");
            clearInterval(pollInterval);
          }
        } catch (e) {
          console.error(e);
        }
      }, 3000);
      return () => clearInterval(pollInterval);
    }
  }, [status, jobId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    setStatus("processing");
    try {
      const res = await fetch("http://localhost:8000/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url })
      });
      const data = await res.json();
      setJobId(data.job_id);
    } catch (e) {
      console.error(e);
      setStatus("error");
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-neutral-950 text-white">
      <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm flex flex-col gap-8">
        <h1 className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
          MotionX
        </h1>
        <p className="text-xl text-neutral-400">Generate high-converting SaaS marketing motion graphics videos from a single URL.</p>

        {status === "idle" && (
          <form onSubmit={handleSubmit} className="w-full max-w-xl mt-8 flex flex-col gap-4">
            <input 
              type="url" 
              placeholder="https://your-saas.com" 
              className="w-full p-4 rounded-xl bg-neutral-900 border border-neutral-800 focus:outline-none focus:border-purple-500 text-lg"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
            <button type="submit" className="w-full p-4 rounded-xl bg-white text-black font-bold text-lg hover:bg-gray-200 transition-colors">
              Generate Video ✨
            </button>
          </form>
        )}

        {status === "processing" && (
          <div className="w-full max-w-2xl mt-12 flex flex-col items-center text-center p-8 border border-neutral-800 rounded-2xl bg-neutral-900/50">
            <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-8"></div>
            <h2 className="text-2xl font-bold mb-4">Cooking your video...</h2>
            <div className="min-h-[100px] flex items-center justify-center transition-all duration-500">
              <p className="text-xl text-neutral-300 italic">"{UNHINGED_FACTS[factIndex]}"</p>
            </div>
          </div>
        )}

        {status === "success" && (
          <div className="w-full max-w-4xl mt-8 flex flex-col gap-8 items-center">
            <h2 className="text-3xl font-bold text-green-400">Video Generation Complete!</h2>
            {videoResult && (
              <div className="w-full p-6 bg-neutral-900 rounded-2xl border border-neutral-800">
                <video src={videoResult.video_url} controls className="w-full rounded-xl" />
                <a href={videoResult.video_url} download className="block mt-6 w-full p-4 text-center rounded-xl bg-purple-600 hover:bg-purple-700 font-bold text-white transition-colors">
                  Download Video ⬇️
                </a>
              </div>
            )}
            <button onClick={() => setStatus("idle")} className="text-neutral-400 hover:text-white underline">
              Generate another one
            </button>
          </div>
        )}

        {status === "error" && (
          <div className="text-red-500 text-xl font-bold">Something went wrong. Please try again.</div>
        )}
      </div>
    </main>
  );
}
