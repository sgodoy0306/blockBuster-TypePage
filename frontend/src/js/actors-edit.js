document.addEventListener("DOMContentLoaded", function() {
    const apiURL = "http://localhost:3001/api/actors";
    const apiURLSingle = "http://localhost:3001/api/actor";
    const form = document.getElementById("edit-actor-form");
    const message = document.getElementById("message");
    const actorSelect = document.getElementById("select-actor");

    async function loadActors() {
        try {
            const res = await fetch(apiURL);
            const actors =  await res.json();

            actorSelect.innerHTML = '<option value=""> --Select an actor --</option>';

            actors.forEach((actor) => {
                const option = document.createElement("option");
                option.value = actor.id;
                option.textContent = `${actor.name}`;
                actorSelect.appendChild(option);
            });

            console.log(`${actors.length} actors loaded`);


        } catch(error) {
            message.textContent = "ERROR: Can't load actors";
            message.classList.add("text-red-500");
            console.error("ERROR: Can't load actors");

        }
    }

    actorSelect.addEventListener("change", async () => {
        const id = actorSelect.value;
        console.log(id)

        if(!id){
            document.getElementById("name-actor").value = "";
            message.textContent = "";
            message.classList.remove = ("text-red-500", "text-green-500");

            return;
        }

        try{
            console.log("Loading actor name");
            const res = await fetch(`${apiURLSingle}/${id}`);
            const actor = await res.json();
            
            console.log(actor);

            document.getElementById("name-actor").value = actor.name;
            message.textContent = "";
            message.classList.remove("text-red-500", "text-green-500");

        }catch(error){
            message.textContent = "ERROR: Can't load actor data";
            message.classList.remove("text-green-500");
            message.classList.add("text-red-500");
            console.error("ERROR: Can't load actor data");

            document.getElementById("name-actor").value = "";
        }

        
    });

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const id = actorSelect.value;
        const name = document.getElementById("name-actor").value.trim();

        if(!id){
            message.textContent = "Please, select an actor";
            message.classList.remove("text-green-500");
            message.classList.add("text-red-500");
            return;
        }

        if(!name){
            message.textContent = "The actor name is obligatory";
            message.classList.remove("text-green-500");
            message.clasList.add("text-red-500");
            return;
        }

        message.textContent = "Saving updates...";
        message.classList.remove("text-red-500", "text-green-500");
        message.classList.add("text-yellow-500");

        try{
            const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
            const response = await fetch(`${apiURLSingle}/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token ? `Bearer ${token}` : "",
                },
                body: JSON.stringify({
                    name
                }),
            });
            
            if (response.ok) {
                const result = await response.json();
            
                message.textContent = "Actor updated successfully";
                message.classList.remove("text-red-500");
                message.classList.add("text-green-500");
            
                console.log("Actor updated", result);

                const selectedOption = actorSelect.querySelector(
                    `option[value="${id}"]`
                );
                loadActors();
                document.getElementById("name-actor").value = "";

                if(selectedOption) {
                    selectedOption.textContent = `${name}`;
                }
            } else{
                const errorData = await response.json();
                message.textContent = "ERROR: Can't update the actor";
                message.classList.remove("text-green-500");
                message.classList.add("text-red-500");
                console.error("Server error" + error);

            }                                
        }catch(error){
            console.log(response);
            console.log(id);
            message.textContent = "Conection error check the server status";
            message.classList.remove("text-green-500");
            message.classList.add("text-red-500");
            console.error("Server erorr" ,error);
        }

    });
    loadActors();
});
