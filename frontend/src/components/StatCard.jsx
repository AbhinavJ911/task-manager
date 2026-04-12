import clsx from "clsx";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

export default function StatCard({ title, value, icon: Icon, trend, color, description }) {
    const colors = {
        indigo: "bg-indigo-50 text-indigo-600",
        green: "bg-emerald-50 text-emerald-600",
        orange: "bg-orange-50 text-orange-600",
        red: "bg-rose-50 text-rose-600",
    };

    const themeClass = colors[color] || colors.indigo;

    return (
        <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500">{title}</p>
                    <h3 className="mt-2 text-3xl font-bold text-gray-900 tracking-tight">{value}</h3>
                </div>
                <div className={clsx("rounded-xl p-3", themeClass)}>
                    <Icon size={24} />
                </div>
            </div>

            {description && (
                <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                    <span>{description}</span>
                </div>
            )}
        </div>
    );
}
