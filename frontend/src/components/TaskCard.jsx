export default function TaskCard({ task, onDelete, onToggle }) {
  const isOverdue =
    task.deadline &&
    new Date(task.deadline) < new Date() &&
    !task.completed;

  return (
    <div
      className={`flex items-center justify-between rounded-xl bg-white p-5 shadow-sm ${
        isOverdue ? "border-l-4 border-red-500" : ""
      }`}
    >
      <div className="flex gap-4">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task._id)}
          className="mt-1 h-5 w-5 accent-indigo-600"
        />

        <div>
          <h3
            className={`font-semibold ${
              task.completed ? "line-through text-gray-400" : ""
            }`}
          >
            {task.title}
          </h3>

          {task.description && (
            <p className="text-sm text-gray-500">{task.description}</p>
          )}

          {task.deadline && (
            <p
              className={`text-sm mt-1 ${
                isOverdue ? "text-red-600 font-semibold" : "text-gray-500"
              }`}
            >
              📅 Due: {new Date(task.deadline).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>

      <button
        onClick={() => onDelete(task._id)}
        className="rounded-lg bg-red-100 px-4 py-2 text-sm text-red-600 hover:bg-red-200"
      >
        Delete
      </button>
    </div>
  );
}
