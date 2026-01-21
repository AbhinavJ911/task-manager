import { useEffect, useState } from "react";
import axios from "../api/axios";
import Navbar from "../components/Navbar";
import TaskCard from "../components/TaskCard";
import TaskChart from "../components/TaskChart";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [search, setSearch] = useState("");

  const fetchTasks = async () => {
    const res = await axios.get("/tasks");
    setTasks(res.data);
  };

  const addTask = async () => {
    if (!title.trim()) return;

    await axios.post("/tasks", {
      title,
      description,
      deadline,
    });

    setTitle("");
    setDescription("");
    setDeadline("");
    fetchTasks();
  };

  const deleteTask = async (id) => {
    await axios.delete(`/tasks/${id}`);
    fetchTasks();
  };

  const toggleTask = async (id) => {
    await axios.patch(`/tasks/${id}/toggle`);
    fetchTasks();
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-100">
        <div className="mx-auto max-w-6xl px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT SIDE */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-3xl font-bold">Your Tasks</h2>

            {/* Add Task */}
            <div className="rounded-2xl bg-white p-6 shadow-md space-y-4">
              <input
                className="w-full rounded-lg border px-4 py-3"
                placeholder="Task title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <textarea
                className="w-full rounded-lg border px-4 py-3"
                placeholder="Description (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              <input
                type="date"
                className="w-full rounded-lg border px-4 py-3"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />

              <button
                onClick={addTask}
                className="rounded-lg bg-indigo-600 px-6 py-3 text-white font-semibold hover:bg-indigo-700"
              >
                + Add task
              </button>
            </div>

            {/* Search */}
            <input
              type="text"
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border px-4 py-3"
            />

            {/* Task List */}
            <div className="space-y-4">
              {filteredTasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onDelete={deleteTask}
                  onToggle={toggleTask}
                />
              ))}
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="space-y-6">
            <TaskChart tasks={tasks} />

            <div className="rounded-2xl bg-white p-6 shadow-md">
              <h3 className="font-semibold mb-2">Productivity</h3>
              <p className="text-sm text-gray-500">
                Stay consistent. Small wins compound.
              </p>
            </div>
          </div>

        </div>
      </main>
    </>
  );
}
