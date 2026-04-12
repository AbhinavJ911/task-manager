import { useEffect, useState } from "react";
import axios from "../api/axios";
import Layout from "../components/Layout";
import TaskCard from "../components/TaskCard";
import StatCard from "../components/StatCard";
import {
  CheckCircle2,
  Clock,
  Filter,
  LayoutGrid,
  List,
  Plus,
  Search,
  AlertCircle,
  Download,
  Crown
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import TaskChart from "../components/TaskChart";
import UpcomingDeadlines from "../components/UpcomingDeadlines";
import clsx from "clsx";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid"); // 'grid' | 'list'
  const [plan, setPlan] = useState("free");
  const navigate = useNavigate();

  // Filter States
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");

  // New Task Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    deadline: "",
    priority: "medium",
    status: "todo",
    tags: ""
  });

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/tasks");
      setTasks(res.data);
    } catch (error) {
      console.error("Failed to fetch tasks", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
    const fetchPlan = async () => {
      try {
        const res = await axios.get("/subscription/status");
        setPlan(res.data.plan || "free");
      } catch (err) {
        console.error("Failed to fetch plan", err);
      }
    };
    fetchPlan();
  }, []);

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;

    try {
      const payload = {
        ...newTask,
        tags: newTask.tags ? newTask.tags.split(",").map(t => t.trim()).filter(Boolean) : []
      };
      await axios.post("/tasks", payload);
      setNewTask({ title: "", description: "", deadline: "", priority: "medium", status: "todo", tags: "" });
      setIsFormOpen(false);
      fetchTasks();
    } catch (error) {
      console.error("Failed to add task", error);
      if (error.response?.data?.limitReached) {
        alert(error.response.data.message);
      }
    }
  };

  const deleteTask = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await axios.delete(`/tasks/${id}`);
      fetchTasks();
    } catch (error) {
      console.error("Failed to delete task", error);
    }
  };

  const toggleTask = async (id) => {
    try {
      await axios.patch(`/tasks/${id}/toggle`);
      fetchTasks();
    } catch (error) {
      console.error("Failed to toggle task", error);
    }
  };

  const handleExportCSV = () => {
    if (plan !== 'advanced') {
       navigate("/pricing");
       return;
    }
    const headers = ["Title", "Description", "Status", "Priority", "Deadline", "Tags"];
    const rows = tasks.map(t => [
      `"${t.title.replace(/"/g, '""')}"`,
      `"${t.description?.replace(/"/g, '""') || ''}"`,
      t.status,
      t.priority,
      t.deadline ? new Date(t.deadline).toLocaleDateString() : '',
      `"${(t.tags || []).join(", ")}"`
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "tasks_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Derived State
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all"
      ? true
      : statusFilter === "done"
        ? (task.status === "done" || task.completed)
        : task.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === "done" || t.completed).length,
    pending: tasks.filter(t => t.status !== "done" && !t.completed).length,
    highPriority: tasks.filter(t => t.priority === "high" && t.status !== "done" && !t.completed).length
  };

  return (
    <Layout>
      <div className="space-y-10">

        {/* Header & Stats */}
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
              Welcome back!
            </h1>
            <p className="text-gray-500 mt-2 text-lg font-medium">Here's an overview of your productivity.</p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total Tasks"
              value={stats.total}
              icon={LayoutGrid}
              color="indigo"
              description="All tracked tasks"
            />
            <StatCard
              title="Pending"
              value={stats.pending}
              icon={Clock}
              color="orange"
              description="Needing attention"
            />
            <StatCard
              title="Completed"
              value={stats.completed}
              icon={CheckCircle2}
              color="green"
              description="Tasks finished"
            />
            <StatCard
              title="High Priority"
              value={stats.highPriority}
              icon={AlertCircle}
              color="rose"
              description="Urgent pending tasks"
            />
          </div>
        </div>

        {/* Insights Section */}
        <div className="relative">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Insights & Deadlines</h2>
          <div className={clsx("transition-all duration-500", plan === "free" ? "filter blur-sm opacity-60 pointer-events-none select-none" : "")}>
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                   <TaskChart tasks={tasks} />
                </div>
                <div>
                   <UpcomingDeadlines tasks={tasks} />
                </div>
             </div>
          </div>
          {plan === "free" && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center">
               <div className="bg-white/80 backdrop-blur-md p-6 rounded-3xl shadow-xl text-center border border-white max-w-sm">
                  <div className="h-16 w-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Crown size={32} className="text-indigo-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Unlock Insights</h3>
                  <p className="text-sm text-gray-500 mt-2 mb-6">Upgrade to Basic or Advanced to view detailed analytics and upcoming deadlines.</p>
                  <button onClick={() => navigate("/pricing")} className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 w-full">Upgrade Now</button>
               </div>
            </div>
          )}
        </div>

        {/* Filters & Actions */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between premium-glass p-5 rounded-2xl shadow-sm border border-gray-200/60 sticky top-24 z-20">
          <div className="relative flex-1 max-w-lg">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search through tasks..."
              className="w-full rounded-xl border border-gray-200 py-3 pl-12 pr-4 bg-white focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex bg-gray-100/80 p-1.5 rounded-xl border border-gray-200/50">
              <button
                onClick={() => setViewMode("grid")}
                className={clsx("p-2 rounded-lg transition-all", viewMode === "grid" ? "bg-white shadow border border-gray-200/50 text-indigo-600 scale-105" : "text-gray-500 hover:text-gray-700 hover:bg-gray-200")}
              >
                <LayoutGrid size={20} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={clsx("p-2 rounded-lg transition-all", viewMode === "list" ? "bg-white shadow border border-gray-200/50 text-indigo-600 scale-105" : "text-gray-500 hover:text-gray-700 hover:bg-gray-200")}
              >
                <List size={20} />
              </button>
            </div>

            <select
              className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-bold text-gray-700 focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all appearance-none pr-10 cursor-pointer"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 fill=%27none%27 viewBox=%270 0 20 20%27%3e%3cpath stroke=%27%236b7280%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%271.5%27 d=%27M6 8l4 4 4-4%27/%3e%3c/svg%3e")', backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}
            >
              <option value="all">All Status</option>
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>

            <button
              onClick={handleExportCSV}
              className={clsx(
                "flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-3 text-sm font-bold transition-all shadow-sm group",
                plan === 'advanced' ? "bg-white text-gray-700 hover:bg-gray-50" : "bg-gray-50 text-gray-400"
              )}
            >
              <Download size={18} className={clsx(plan === 'advanced' ? "text-gray-500 group-hover:text-indigo-600" : "")} />
              Export
              {plan !== 'advanced' && <Crown size={14} className="text-amber-500 ml-1" />}
            </button>

            <button
              onClick={() => setIsFormOpen(true)}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-3 text-sm font-bold text-white hover:from-indigo-500 hover:to-indigo-600 transition-all shadow-lg shadow-indigo-200 hover:shadow-indigo-300 hover:-translate-y-0.5"
            >
              <Plus size={20} />
              New Task
            </button>
          </div>
        </div>

        {/* Task Grid/List */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 text-gray-400 gap-4">
            <div className="h-10 w-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            <p className="font-medium text-lg">Loading your workflow...</p>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="text-center py-28 bg-white/50 backdrop-blur-sm rounded-3xl border-2 border-dashed border-gray-200/80 premium-shadow">
            <div className="h-20 w-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle size={32} className="text-indigo-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No tasks available</h3>
            <p className="text-gray-500 max-w-sm mx-auto mb-6">There are no tasks matching your filters right now. Try adjusting your search term or create a new one.</p>
            <button onClick={() => setIsFormOpen(true)} className="text-indigo-600 font-bold bg-indigo-50 px-6 py-3 rounded-xl hover:bg-indigo-100 transition-colors">Start Creating</button>
          </div>
        ) : (
          <div className={clsx(
            "grid gap-6",
            viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1 max-w-4xl mx-auto"
          )}>
            {filteredTasks.map((task, index) => (
              <div key={task._id} className="animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both" style={{ animationDelay: `${index * 50}ms` }}>
                <TaskCard task={task} onDelete={deleteTask} onToggle={toggleTask} />
              </div>
            ))}
          </div>
        )}

        {/* Create Task Modal Overlay with Glassmorphism */}
        {isFormOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setIsFormOpen(false)}></div>
            <div className="relative w-full max-w-lg bg-white rounded-[2rem] shadow-2xl p-8 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-extrabold text-gray-900">Create Task</h2>
                  <p className="text-gray-500 font-medium text-sm mt-1">Fill out the details below.</p>
                </div>
                <div className="h-12 w-12 bg-indigo-50 rounded-2xl flex items-center justify-center">
                  <Plus size={24} className="text-indigo-600" />
                </div>
              </div>

              <form onSubmit={handleAddTask} className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Task Title</label>
                  <input
                    required
                    placeholder="e.g., Prepare quarterly report"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 bg-gray-50 focus:bg-white focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium"
                    value={newTask.title}
                    onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Description <span className="text-gray-400 font-normal">(Optional)</span></label>
                  <textarea
                    placeholder="Add more details about this task..."
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 bg-gray-50 focus:bg-white focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium resize-none"
                    rows={3}
                    value={newTask.description}
                    onChange={e => setNewTask({ ...newTask, description: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="text-sm font-bold text-gray-700 mb-1.5 flex items-center gap-2">
                       Priority 
                       {plan !== 'advanced' && <Crown size={14} className="text-amber-500" title="Advanced feature" />}
                    </label>
                    <select
                      disabled={plan !== 'advanced'}
                      className={clsx(
                        "w-full rounded-xl border px-4 py-3 font-bold appearance-none transition-all cursor-pointer",
                        plan === 'advanced' 
                          ? "bg-gray-50 focus:bg-white border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10" 
                          : "bg-gray-100 text-gray-400 border-gray-100 opacity-80"
                      )}
                      value={newTask.priority}
                      onChange={e => setNewTask({ ...newTask, priority: e.target.value })}
                      style={{ backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 fill=%27none%27 viewBox=%270 0 20 20%27%3e%3cpath stroke=%27%236b7280%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%271.5%27 d=%27M6 8l4 4 4-4%27/%3e%3c/svg%3e")', backgroundPosition: 'right 1rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}
                    >
                      <option value="low">Low Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="high">High Priority</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">Deadline</label>
                    <input
                      type="date"
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 bg-gray-50 focus:bg-white focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium text-gray-700"
                      value={newTask.deadline}
                      onChange={e => setNewTask({ ...newTask, deadline: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-bold text-gray-700 mb-1.5 flex items-center gap-2">
                     Task Tags <span className="text-gray-400 font-normal text-xs">(comma separated)</span>
                     {plan !== 'advanced' && <Crown size={14} className="text-amber-500" title="Advanced feature" />}
                  </label>
                  <input
                    disabled={plan !== 'advanced'}
                    placeholder={plan === 'advanced' ? "e.g., Marketing, Q3, Urgent" : "Upgrade to Advanced to use tags"}
                    className={clsx(
                      "w-full rounded-xl border px-4 py-3 transition-all font-medium",
                      plan === 'advanced' 
                        ? "bg-gray-50 focus:bg-white border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10" 
                        : "bg-gray-100 text-gray-400 border-gray-100 opacity-80 cursor-not-allowed"
                    )}
                    value={newTask.tags}
                    onChange={e => setNewTask({ ...newTask, tags: e.target.value })}
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="flex-1 rounded-xl px-4 py-3.5 text-sm font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 px-4 py-3.5 text-sm font-bold text-white hover:from-indigo-500 hover:to-indigo-600 transition-all shadow-md shadow-indigo-200"
                  >
                    Create Task
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </Layout>
  );
}
