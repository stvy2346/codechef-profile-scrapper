import { useState } from "react";
import axios from "axios";

function App() {
  const [username, setUsername] = useState("");
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchProfile = async () => {
    setLoading(true);
    setError("");
    setProfile(null);
    try {
      const response = await axios.get(
        `http://localhost:8080/profile/${username.trim()}`
      );
      setProfile(response.data);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          error.message ||
          "Something went wrong!"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 px-6 py-12">
      <div className="mx-auto max-w-xl bg-white rounded-2xl shadow-xl p-10 flex flex-col gap-6">
        <h1 className="text-4xl font-bold text-center text-gray-800">
          Competitive Programming Profile Scraper
        </h1>

        <p className="text-center text-gray-500">
          Enter your CodeChef username to fetch profile details
        </p>

        <input
          type="text"
          value={username}
          placeholder="CodeChef Username"
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
        />

        <button
          onClick={fetchProfile}
          className="w-full py-3 rounded-lg bg-orange-500 text-white font-semibold text-lg hover:bg-orange-600 active:scale-[0.98] transition"
        >
          {loading ? "Loading..." : "Fetch Profile"}
        </button>

        {error && <p className="text-red-500 text-center">{error}</p>}
      </div>

      {profile && (
        <div className="mx-auto mt-12 max-w-5xl bg-white rounded-2xl shadow-xl p-10 space-y-10">
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Profile Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                ["Name", profile.name],
                ["Username", profile.username],
                ["Affiliation", profile.affiliation],
                ["Country", profile.country],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex flex-col bg-slate-50 p-4 rounded-lg border"
                >
                  <span className="text-sm text-gray-500">{label}</span>
                  <span className="font-semibold text-gray-800">{value}</span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Ratings & Ranks
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                ["Current Rating", profile.currentRating],
                ["Highest Rating", profile.highestRating],
                ["Stars", profile.stars],
                ["Global Rank", `#${profile.globalRank}`],
              ].map(([title, value]) => (
                <div
                  key={title}
                  className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl text-center shadow-sm"
                >
                  <h3 className="text-sm font-medium text-gray-600">
                    {title}
                  </h3>
                  <div className="mt-2 text-2xl font-bold text-orange-600">
                    {value}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Problem Statistics
            </h2>
            <div className="bg-slate-50 p-6 rounded-xl border text-center">
              <h3 className="text-sm text-gray-500">Total Solved</h3>
              <div className="text-3xl font-bold text-gray-800 mt-2">
                {profile.totalSolved}
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Participation Summary
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                ["Total Contests", profile.totalContests],
                ["Learning Paths", profile.totalLearningPaths],
                ["Practice Paths", profile.totalPracticePaths],
              ].map(([title, value]) => (
                <div
                  key={title}
                  className="bg-slate-50 p-6 rounded-xl border text-center"
                >
                  <h3 className="text-sm text-gray-500">{title}</h3>
                  <div className="text-2xl font-bold text-gray-800 mt-2">
                    {value}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

export default App;
