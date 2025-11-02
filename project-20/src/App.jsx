import React, { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

export default function App() {
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);

  // ✅ Read CSV file
  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => parseCSV(event.target.result);
    reader.readAsText(file);
  };

  // ✅ Simple CSV parser
  const parseCSV = (text) => {
    const lines = text.trim().split("\n");
    const headers = lines[0].split(",").map((h) => h.trim());
    const subjectNames = headers.slice(1);

    const data = lines.slice(1).map((line) => {
      const values = line.split(",").map((v) => v.trim());
      const name = values[0];
      const marks = subjectNames.map((s, i) => Number(values[i + 1]));
      const total = marks.reduce((a, b) => a + b, 0);
      const avg = total / marks.length;
      return { name, marks, total, avg };
    });

    const ranked = data
      .sort((a, b) => b.total - a.total)
      .map((s, i) => ({ ...s, rank: i + 1 }));

    setStudents(ranked);
    setSubjects(subjectNames);
  };

  // ✅ Subject averages
  const subjectAverages = subjects.map((sub, i) => {
    const avg =
      students.reduce((sum, s) => sum + (s.marks[i] || 0), 0) / students.length;
    return { subject: sub, avg: avg || 0 };
  });

  // ✅ Dashboard summary cards
  const topper = students[0];
  const avgScore =
    students.length > 0
      ? (students.reduce((sum, s) => sum + s.avg, 0) / students.length).toFixed(2)
      : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-center text-indigo-700">
          🎓 Student Performance Dashboard
        </h1>

        {/* Upload */}
        <div className="bg-white p-6 rounded-2xl shadow text-center">
          <label className="bg-indigo-600 text-white px-5 py-2 rounded-lg cursor-pointer hover:bg-indigo-700 transition">
            Upload Marks CSV
            <input
              type="file"
              accept=".csv"
              onChange={handleFile}
              className="hidden"
            />
          </label>
          <p className="text-sm text-gray-500 mt-2">
            Format: Name,Math,Science,English,...
          </p>
        </div>

        {/* Summary Cards */}
        {students.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl shadow p-4 text-center hover:shadow-md transition">
              <h3 className="text-gray-500 text-sm">Topper</h3>
              <p className="text-lg font-bold text-indigo-700">{topper?.name}</p>
              <p className="text-sm text-gray-600">{topper?.total} Marks</p>
            </div>
            <div className="bg-white rounded-xl shadow p-4 text-center hover:shadow-md transition">
              <h3 className="text-gray-500 text-sm">Average Score</h3>
              <p className="text-lg font-bold text-indigo-700">{avgScore}</p>
            </div>
            <div className="bg-white rounded-xl shadow p-4 text-center hover:shadow-md transition">
              <h3 className="text-gray-500 text-sm">Total Students</h3>
              <p className="text-lg font-bold text-indigo-700">{students.length}</p>
            </div>
          </div>
        )}

        {/* Table */}
        {students.length > 0 && (
          <div className="bg-white p-6 rounded-2xl shadow overflow-x-auto">
            <h2 className="font-semibold mb-3 text-indigo-700">📋 Detailed Scores</h2>
            <table className="min-w-full border text-sm">
              <thead className="bg-indigo-100">
                <tr>
                  <th className="p-2 border">Name</th>
                  {subjects.map((s) => (
                    <th key={s} className="p-2 border">
                      {s}
                    </th>
                  ))}
                  <th className="p-2 border">Total</th>
                  <th className="p-2 border">Average</th>
                  <th className="p-2 border">Rank</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s, idx) => (
                  <tr
                    key={s.name}
                    className={`text-center transition ${
                      idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } hover:bg-indigo-50`}
                  >
                    <td className="p-2 border font-medium">{s.name}</td>
                    {s.marks.map((m, i) => (
                      <td key={i} className="p-2 border">
                        {m}
                      </td>
                    ))}
                    <td className="p-2 border font-semibold">{s.total}</td>
                    <td className="p-2 border">{s.avg.toFixed(2)}</td>
                    <td
                      className={`p-2 border font-bold ${
                        s.rank === 1
                          ? "text-green-600"
                          : s.rank <= 3
                          ? "text-blue-600"
                          : "text-gray-600"
                      }`}
                    >
                      {s.rank}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Chart */}
        {students.length > 0 && (
          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="font-semibold mb-3 text-indigo-700">
              📊 Subject-wise Averages
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={subjectAverages}>
                <XAxis dataKey="subject" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="avg" fill="#6366F1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {students.length === 0 && (
          <p className="text-center text-gray-500 mt-6 animate-pulse">
            Upload a CSV file to view student statistics 📈
          </p>
        )}
      </div>
    </div>
  );
}
