const API_URL = "http://localhost:3001/api/actors"
document.addEventListener("DOMContentLoaded", function (){
    const form = document.getElementById("add-actor-form");
    const message = document.getElementById("message");
    form.addEventListener("submit", async function(e) {
        e.preventDefault();
        const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
        const formData = {
            name: document.getElementById("name").value
        };
        try {
            const response = await fetch(`${API_URL}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token ? `Bearer ${token}` : ""
                },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                const result = await response.json();
                message.textContent = "The Actor was added successfully";
                message.classList.remove("text-red-500");
                message.classList.add("text-green-500");
                form.reset();
                console.log(result);
            } else {
                const error = await response.json();
                message.textContent = "Error saving the actor " +
                (error.error || "Unknown error"); 
                message.classList.remove("text-green-500");
                message.classList.add("text-red-500");
            }
        } catch (error) {
            console.error("Error: ", error);
            message.textContent = "Internal server error";
            message.classList.remove("text-green-500");
            message.classList.add("text-red-500");
        }
        setTimeout(async () => {
                message.textContent = "";
            }, 2000);

    });
});
