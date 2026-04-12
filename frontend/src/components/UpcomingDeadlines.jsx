import { format, isAfter, isBefore, addDays } from "date-fns";
import { Clock, AlertTriangle } from "lucide-react";
import clsx from "clsx";

export default function UpcomingDeadlines({ tasks }) {
    const today = new Date();
    const nextWeek = addDays(today, 7);

    const upcomingTasks = tasks
        .filter((task) => {
            if (!task.deadline || task.status === "done" || task.completed) return false;
            const deadline = new Date(task.deadline);
            return isAfter(deadline, today) && isBefore(deadline, nextWeek);
        })
        .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
        .slice(0, 5); // Show top 5

    if (upcomingTasks.length === 0) {
        return (
            <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 h-full">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Upcoming Deadlines</h3>
                <div className="flex flex-col items-center justify-center h-40 text-gray-400">
                    <Clock size={40} className="mb-2 opacity-50" />
                    <p>No upcoming deadlines this week.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 h-full">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <AlertTriangle size={20} className="text-amber-500" />
                Due Soon
            </h3>

            <div className="space-y-3">
                {upcomingTasks.map((task) => (
                    <div key={task._id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100 hover:border-indigo-200 transition-colors">
                        <div className="flex-1 min-w-0 pr-4">
                            <p className="font-medium text-gray-900 truncate">{task.title}</p>
                            <div className="flex items-center gap-2 mt-1">
                                <span className={clsx("text-xs px-2 py-0.5 rounded-full capitalize",
                                    task.priority === 'high' ? 'bg-rose-100 text-rose-700' :
                                        task.priority === 'medium' ? 'bg-orange-100 text-orange-700' :
                                            'bg-emerald-100 text-emerald-700')}>
                                    {task.priority || 'medium'}
                                </span>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-bold text-gray-700">{format(new Date(task.deadline), "MMM d")}</p>
                            <p className="text-xs text-gray-500">{format(new Date(task.deadline), "EEE")}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
