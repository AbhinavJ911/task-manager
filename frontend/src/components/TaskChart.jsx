import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

export default function TaskChart({ tasks }) {
  // Data for Status
  const statusData = [
    { name: "Done", value: tasks.filter((t) => t.status === "done" || t.completed).length, color: "#10b981" }, // Emerald 500
    { name: "In Progress", value: tasks.filter((t) => t.status === "in-progress").length, color: "#3b82f6" }, // Blue 500
    { name: "Todo", value: tasks.filter((t) => t.status === "todo").length, color: "#f59e0b" }, // Amber 500
  ].filter(d => d.value > 0);

  // Data for Priority
  const priorityData = [
    { name: "High", value: tasks.filter((t) => t.priority === "high").length, color: "#f43f5e" }, // Rose 500
    { name: "Medium", value: tasks.filter((t) => t.priority === "medium").length, color: "#f97316" }, // Orange 500
    { name: "Low", value: tasks.filter((t) => t.priority === "low").length, color: "#34d399" }, // Emerald 400
  ].filter(d => d.value > 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Status Chart */}
      <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 flex flex-col items-center">
        <h3 className="text-lg font-bold text-gray-800 mb-4 w-full text-left">Task Status</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusData}
                dataKey="value"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                stroke="none"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Priority Chart */}
      <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 flex flex-col items-center">
        <h3 className="text-lg font-bold text-gray-800 mb-4 w-full text-left">Priority Breakdown</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={priorityData}
                dataKey="value"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {priorityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
