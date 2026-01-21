export default function Navbar() {
  return (
    <header className="sticky top-0 z-10 bg-white border-b">
      <div className="mx-auto max-w-4xl flex items-center justify-between px-6 py-4">
        <h1 className="text-xl font-bold">Task Manager</h1>

        <button
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/login";
          }}
          className="
            rounded-lg 
            bg-red-500 
            px-4 
            py-2 
            text-sm 
            font-semibold 
            text-white 
            shadow-sm
            hover:bg-red-700 
            active:bg-red-800
            transition
          "
        >
          Logout
        </button>
      </div>
    </header>
  );
}
