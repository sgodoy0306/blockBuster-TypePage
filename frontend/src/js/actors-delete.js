document.addEventListener("DOMContentLoaded", function() {
    const form = document.querySelector("form");
    const actorSelect = document.getElementById("actor-select");
    const message = document.getElementById("message");

    const  API_URL_ACTORS = "http://localhost:3001/api/actors"
    const API_URL_ACTOR = "http://localhost:3001/api/actor"

    async function loadActors() {
        try{

        message.textContent = "Loading Actors..";
        message.className = "font-body text-center mt-2 text-blockbuster-500";

        const response = await fetch(API_URL_ACTORS);

        if(!response.ok){
            console.error("Error loading actors");
            return;
        }   

        const actors = await response.json();

        console.log("Actors loaded successfully");

        actorSelect.innerHTML = '<option value ="">-- Select an actor -- </option>'

        actors.forEach((actors) => {
            const option = document.createElement("option");
            option.value = actors.id;
            option.textContent = `${actors.name}`;
            actorSelect.appendChild(option);
        });

        message.textContent = "";
        message.className = "font-body text-center mt-2";
        
        }catch (error) {
            console.error("Error loading actors: ", error);
            message.textContent = "Error loading actors"
            message.className = "font-body text-center mt-2 text-red-500";
        }
    }
    form.addEventListener("submit", async function(e) {
        e.preventDefault();

        const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
        const id = actorSelect.value;

        if(!id){
            message.textContent = "Please, select an actor";
            message.classList = "font-body text-center mt-2 text-red-500";
            return;
        }

        try {
            const response = await fetch(`${API_URL_ACTOR}/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": token ? `Bearer ${token}` : ""
                },
            });

            let result;
            try {
                result = await response.json();
            } catch (jsonError) {
                if (response.status === 200 || response.status === 204) {
                    result = { status: "OK", message: "Actor deleted" };
                } else {
                    const errorText = await response.text();
                    message.textContent = `Error deleting the actor: ${errorText || response.statusText}`;
                    message.className = "font-body text-center mt-2 text-red-500";
                    return;
                }
            }

            if (!response.ok) {
                let errorMessage = `Error ${response.status}: ${response.statusText}`;
                console.log(errorMessage);
                message.textContent = errorMessage;
                message.className = "font-body text-center mt-2 text-red-500";
                return;
            }

            console.log("Actor deleted:", result);

            message.textContent = "Actor deleted successfully";
            message.className = "font-body text-center mt-2 text-red-500"; 

            actorSelect.value = "";

            // Espera 2 segundos antes de limpiar el mensaje y recargar la lista
            setTimeout(async () => {
                message.textContent = "";
                await loadActors();
            }, 2000);

        } catch (error) {
            console.error("Error deleting the actor:", error);
            message.textContent = "Error deleting the actor";
            message.className = "font-body text-center mt-2 text-red-500";
        }
    });

    loadActors();
});
