document.addEventListener("DOMContentLoaded", () => {

  // DELETE BUTTONS
  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.dataset.id;
      if (!confirm('Are you sure you want to delete this bus?')) return;

      try {
        const res = await fetch(`/api/admin/bus/${id}`, {
          method: 'DELETE',
        });

        if (res.ok) {
          alert('Bus deleted successfully!');
          location.reload();
        } else {
          const text = await res.text();
          console.error('Delete failed', res.status, text);
          alert('Delete failed');
        }
      } catch (err) {
        console.error('Network error:', err);
        alert('Network error');
      }
    });
  });

  // LIVE BUTTONS 
  document.querySelectorAll('.live-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      window.location.href = `/api/admin/bus/location/${id}`;
    });
  });

  // ADD BUS FORM 
  const form = document.getElementById("addBusForm");
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const driverName = document.getElementById("busDriver").value.trim();
      const busNumber = document.getElementById("busNumber").value.trim();
      const route = document.getElementById("route").value.trim();

      try {
        const res = await fetch("/api/admin/bus", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ driverName, busNumber, route }),
        });

        if (res.ok) {
          alert("Bus added successfully!");
          location.reload();
        } else {
          const text = await res.text();
          console.error("Add bus failed", res.status, text);
          alert("Failed to add bus");
        }
      } catch (err) {
        console.error("Network error:", err);
        alert("Network error");
      }
    });
  }

  // LOGOUT button (attach to header button)
  const logoutBtn = document.querySelector('header button');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      // remove cookie and redirect to login
      // ensure cookie path matches how you set it on server
      document.cookie = "token=; Max-Age=0; path=/;";
      window.location.href = "/api/admin/login";
    });
  }

});
