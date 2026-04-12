import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import {
    LayoutDashboard,
    LogOut,
    Menu,
    Plus,
    Settings,
    X,
    Star,
    Crown
} from "lucide-react";
import clsx from "clsx";

export default function Layout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [plan, setPlan] = useState("free");
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch current user plan
        const fetchStatus = async () => {
            try {
                const res = await axios.get("/subscription/status");
                setPlan(res.data.plan || "free");
            } catch (err) {
                console.error("Failed to fetch subscription status:", err);
            }
        };
        fetchStatus();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    const menuItems = [
        { icon: LayoutDashboard, label: "Dashboard", path: "/" },
        { icon: Star, label: "Pricing", path: "/pricing" },
        // Add more menu items here as needed
    ];

    return (
        <div className="flex h-screen bg-slate-50 font-sans text-gray-900">
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden transition-opacity"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={clsx(
                    "fixed inset-y-0 left-0 z-50 w-72 premium-glass border-r border-white/50 shadow-2xl lg:shadow-xl transition-all duration-300 lg:static lg:translate-x-0 flex flex-col",
                    sidebarOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                {/* Logo Area */}
                <div className="flex h-20 items-center justify-between px-8 border-b border-gray-100/50">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                            <Star size={20} className="fill-white/20" />
                        </div>
                        <span className="font-extrabold text-xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-900 to-indigo-600 tracking-tight">
                            Task Flow
                        </span>
                    </div>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden text-gray-400 hover:text-gray-900 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Nav Links */}
                <nav className="flex-1 space-y-2 px-4 py-8 overflow-y-auto no-scrollbar">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={clsx(
                                    "flex items-center gap-4 rounded-2xl px-5 py-3.5 text-sm font-semibold transition-all duration-200 group relative overflow-hidden",
                                    isActive
                                        ? "text-indigo-700 bg-indigo-50 shadow-sm border border-indigo-100/50"
                                        : "text-gray-500 hover:bg-white hover:text-gray-900 hover:shadow-sm"
                                )}
                            >
                                {isActive && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-indigo-600 rounded-r-md"></div>
                                )}
                                <Icon size={20} className={clsx("transition-transform group-hover:scale-110", isActive ? "text-indigo-600" : "text-gray-400")} />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom Plan / Action */}
                <div className="p-6 mt-auto">
                    {plan === "free" ? (
                        <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-700 text-white relative overflow-hidden shadow-xl shadow-indigo-200">
                            <div className="absolute -top-10 -right-10 opacity-20">
                                <Crown size={120} />
                            </div>
                            <h4 className="font-bold mb-1 relative z-10 text-lg">Go Premium</h4>
                            <p className="text-indigo-100 text-xs mb-4 relative z-10 font-medium">
                                Unlock unlimited tasks and analytics.
                            </p>
                            <Link
                                to="/pricing"
                                className="block text-center w-full bg-white text-indigo-600 py-2.5 rounded-xl text-sm font-bold shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
                            >
                                Upgrade Now
                            </Link>
                        </div>
                    ) : (
                        <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 flex items-center justify-between mb-4 shadow-sm">
                            <div className="flex items-center gap-3">
                                <Crown className="text-indigo-600" size={24} />
                                <div>
                                    <p className="text-xs text-indigo-600 font-bold uppercase tracking-wider">Current Plan</p>
                                    <p className="font-extrabold text-gray-900 capitalize">{plan}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="mt-4 pt-4 border-t border-gray-100/80">
                        <button
                            onClick={handleLogout}
                            className="flex w-full items-center gap-4 rounded-xl px-5 py-3.5 text-sm font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
                        >
                            <LogOut size={20} />
                            Logout
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex flex-1 flex-col overflow-hidden relative">
                {/* Subtle top decoration */}
                <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-indigo-50/50 to-transparent pointer-events-none"></div>

                {/* Topbar */}
                <header className="flex h-20 items-center justify-between border-b border-gray-100 bg-white/50 backdrop-blur-xl px-8 sticky top-0 z-30">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="lg:hidden p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <Menu size={24} />
                    </button>

                    <div className="flex items-center gap-5 ml-auto">
                        <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-700 font-extrabold border border-indigo-200 shadow-sm cursor-pointer hover:shadow-md transition-all hover:scale-105">
                            U
                        </div>
                    </div>
                </header>

                {/* Scrollable Content Area */}
                <main className="flex-1 overflow-y-auto no-scrollbar p-6 lg:p-10 relative z-10">
                    <div className="mx-auto max-w-[1400px] animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
