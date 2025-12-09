document.addEventListener("DOMContentLoaded", () =>{
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            const id = btn.dataset.id;
            if(!confirm('Are you sure you wan to delete this bus?')) return;
            try{
                const res = await fetch(`/api/admin/bus/${id}`,{ mehtod:'DELETE'});
                if(res.ok){
                    alert('bus deleted successfully!');
                    location.reload();
                }else{
                    console.error('delete failed', res.status);
                    alert('Delete Failed');
                }
            }catch(err){
                console.error('network error:', err);
            }
        });
    });

    document.querySelectorAll('.live-btn').forEach(btn => {
        btn.addEventListener('click', () =>{
            const id = btn.dataset.id;
            window.location.href = `/api/admin/bus/location/${id}`;
        });
    })
})