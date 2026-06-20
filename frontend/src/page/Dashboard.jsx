function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="page">
      <div className="card">
        <h1>Dashboard</h1>

        <p><b>Role:</b> {user?.role}</p>
        <p><b>User ID:</b> {user?.user_id}</p>

        {user?.role === "organization" && (
          <>
            <button onClick={() => (window.location.href = "/generate")}>
              Generate Certificate
            </button>

            <button onClick={() => (window.location.href = "/bulk-upload")}>
              Bulk Upload CSV
            </button>
          </>
        )}

        <button onClick={() => (window.location.href = "/verify")}>
          Verify / Download Certificate
        </button>

        <button
          onClick={() => {
            localStorage.clear();
            window.location.href = "/";
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Dashboard;