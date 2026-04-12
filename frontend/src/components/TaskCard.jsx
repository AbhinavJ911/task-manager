import clsx from "clsx";
import { format } from "date-fns";
import {
  Calendar,
  CheckCircle,
  Clock,
  MoreVertical,
  Tag,
  Trash2,
} from "lucide-react";

export default function TaskCard({ task, onDelete, onToggle }) {
  const isDone = task.status === "done" || task.completed;
  
  const priorityColors = {
    high: "bg-rose-100/80 text-rose-700 border-rose-200",
    medium: "bg-orange-100/80 text-orange-700 border-orange-200",
    low: "bg-emerald-100/80 text-emerald-700 border-emerald-200",
  };

  const statusColors = {
    todo: "bg-gray-100 text-gray-700",
    "in-progress": "bg-blue-100 text-blue-700",
    done: "bg-green-100 text-green-700",
  };

  return (
    <div 
      className={clsx(
        "group relative rounded-2xl p-6 transition-all duration-300 premium-shadow premium-shadow-hover bg-white flex flex-col justify-between",
        isDone 
          ? "border border-gray-100 opacity-80 hover:opacity-100 mix-blend-luminosity hover:mix-blend-normal" 
          : "border-l-4 border-y border-r border-y-transparent border-r-transparent border-l-red-500 shadow-[0_4px_20px_-4px_rgba(239,68,68,0.1)] hover:shadow-[0_8px_30px_-4px_rgba(239,68,68,0.15)]"
      )}
    >
      {/* Decorative pending dot if not done */}
      {!isDone && (
        <div className="absolute top-4 right-4 h-2 w-2 rounded-full bg-red-500 animate-pulse-soft"></div>
      )}

      <div className="flex items-start justify-between gap-4">
        <div className="flex gap-4">
          <button
            onClick={() => onToggle(task._id)}
            className={clsx(
              "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300",
              isDone
                ? "border-green-500 bg-green-500 text-white scale-110 shadow-sm shadow-green-200"
                : "border-gray-300 bg-white hover:border-red-500 hover:scale-110 text-transparent hover:text-red-500 hover:bg-red-50"
            )}
          >
            <CheckCircle size={16} className={clsx(!isDone && "opacity-0 group-hover:opacity-100")} />
          </button>

          <div className="flex-1">
            <h3 className={clsx("font-bold text-lg leading-tight transition-colors duration-300", isDone ? "line-through text-gray-400" : "text-gray-900")}>
              {task.title}
            </h3>
            <p className="mt-2 text-sm text-gray-500 line-clamp-2 leading-relaxed">
              {task.description}
            </p>

            <div className="mt-5 flex flex-wrap gap-2.5">
              {/* Priority Badge */}
              <span className={clsx("inline-flex items-center rounded-lg border px-2.5 py-1 text-xs font-bold uppercase tracking-wider", priorityColors[task.priority || 'medium'])}>
                {task.priority || 'medium'}
              </span>

              {/* Status Badge */}
              <span className={clsx("inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-bold uppercase tracking-wider", statusColors[task.status || (isDone ? 'done' : 'todo')])}>
                {task.status || (isDone ? 'done' : 'todo')}
              </span>

              {/* Deadline */}
              {task.deadline && (
                <span className={clsx(
                  "inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-bold uppercase tracking-wider",
                  isDone ? "bg-gray-50 text-gray-500 border-gray-200" : "bg-red-50 text-red-600 border-red-100"
                )}>
                  <Calendar size={14} />
                  {format(new Date(task.deadline), "MMM d, yyyy")}
                </span>
              )}

              {/* Tags */}
              {task.tags && task.tags.length > 0 && task.tags.map((tag, idx) => (
                <span key={idx} className="inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-bold bg-indigo-50 text-indigo-600 border-indigo-100 uppercase tracking-wider">
                  <Tag size={12} />
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

      </div>
      
      {/* Absolute delete button for cleaner default state */}
      <button
        onClick={() => onDelete(task._id)}
        className="absolute bottom-4 right-4 p-2 rounded-xl text-gray-300 opacity-0 transition-all duration-300 group-hover:opacity-100 hover:text-white hover:bg-red-500 group-hover:translate-x-0 translate-x-2"
        title="Delete Task"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
}
