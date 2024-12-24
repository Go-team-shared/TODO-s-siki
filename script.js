
class RenderManager {
    list = new ListManager();
    submitButton = document.getElementById("addMission");
    clearAllButton = document.getElementById("clear-all");
    unFinishedConteiner = document.getElementById("unfinishedMissions")
    finishedConteiner = document.getElementById("finishedMissions")

    constructor() {
        this.submitButton.addEventListener("click", this.handleNewItem.bind(this));
        this.clearAllButton.addEventListener("click", () => {this.handleClearAll();});
    }

    render() {
        this.finishedConteiner.innerHTML = "";
        this.unFinishedConteiner.innerHTML = "";
        for(const miss of this.list.missions){
            const element = this.createMissionElement(miss);
            if(miss.is_finished){
                this.addMissionToFinished(element);
            }else{
                this.addMissionToUnfinished(element);
            }
        }
    }
 
    handleClearAll() {
        const confirmation = confirm("Are you sure about it?");
        if(confirmation){
            this.clearAllLists();
        }
    }

    clearAllLists() {
        this.finishedConteiner.innerHTML = "";
        this.unFinishedConteiner.innerHTML = "";
        this.list = [];
    }

    validateDate(inputDate) {
        const year = Number(inputDate.split('-')[0]);

        if(year < 2000 || year > 2030){
            alert("year must be in range [2000, 2030]");
            return false;
        }
        return true;
    }

    formatDateToDDMMYYYY(inputDate){
        const [year, month, day] = inputDate.split('-');
        return `${day}/${month}/${year}`;
    }


    handleNewItem() {
        const name = document.getElementById("missionName").value.trim();
        const date = document.getElementById("missionDate").value;

        if (!this.validateDate(date)){return;}
        
        if (!name || !date){
            alert("you need to fill both date and name!");
            return;
        }
        const formatDate = this.formatDateToDDMMYYYY(date);
        this.list.insertNewMision(name, formatDate);

        //this is clean the cell of name and date
        document.getElementById("missionName").value = "";
        document.getElementById("missionDate").value = "";

        this.render();
    }

    addMissionToUnfinished(mission) {
        this.unFinishedConteiner.appendChild(mission);
    }

    addMissionToFinished(mission) {
        this.finishedConteiner.appendChild(mission);
    }

    createMissionElement(mission) {
        const curDiv = document.createElement("div");
        curDiv.className = "mission-item";

        const missionText = document.createElement("span");
        missionText.innerHTML = `<strong>${mission.name}</strong> <br><br> date: ${mission.date}`;

        const buttonDiv = document.createElement("div");
        buttonDiv.className = "mission-item-button";


        const button = document.createElement("button");
        button.textContent = mission.is_finished? "unfinished" : "finished";

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.id = "delete-button"

        button.addEventListener("click", () =>
        {
            this.list.updateStatus(mission.id)
            this.render();
        });

        deleteButton.addEventListener("click", () => {
            this.list.deleteMission(mission.id);
            this.render();
        });

        buttonDiv.appendChild(button);
        buttonDiv.appendChild(deleteButton)

        curDiv.appendChild(missionText);
        curDiv.appendChild(buttonDiv);
        return curDiv;
    }

}

class ListManager{
    constructor(){
        this.missions = [];
    }

    insertNewMision(name, date){
        const item = new ListItem(name, date);
        this.missions.push(item);
    }

    updateStatus(missionID){
        for(const mission of this.missions){
            if(mission.id === missionID){
                mission.is_finished = !mission.is_finished;
            }
        }
    }

    deleteMission(missionID){
        let idx = 0;
        for(const mission of this.missions){
            if (mission.id === missionID){
                this.missions.splice(idx, 1);
                break
            }
            idx += 1;
        }
    }
}


class ListItem {
    constructor(name, date, is_finished=false) {
        this.id = crypto.randomUUID();
        this.name = name;
        this.date = date;
        this.is_finished = is_finished;
    }
}


const manager = new RenderManager();