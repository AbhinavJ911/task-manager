import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

export default function TaskChart({ tasks }) {
  const completed = tasks.filter(t => t.completed).length;
  const pending = tasks.length - completed;

  const data = [
    { name: "Completed", value: completed },
    { name: "Pending", value: pending },
  ];

  const COLORS = ["#22c55e", "#6366f1"];

  return (
    <div className="rounded-2xl bg-white p-6 shadow-md">
      <h3 className="text-lg font-semibold mb-4">
        Task Overview
      </h3>

      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={5}
            >
              {data.map((_, index) => (
                <Cell key={index} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 flex justify-around text-sm">
        <span className="text-green-600 font-medium">
          ✓ Completed: {completed}
        </span>
        <span className="text-indigo-600 font-medium">
          ⏳ Pending: {pending}
        </span>
      </div>
    </div>
  );
}
