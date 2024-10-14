let goals = [];

function checkPassword(event) {
    event.preventDefault(); // Prevent the form from submitting normally
    const password = document.getElementById('password-input').value;
    if (password === "parentpassword") { // Replace with a secure password
        document.getElementById('password-prompt').style.display = 'none';
        document.getElementById('content').style.display = 'block';
        loadGoals();
    } else {
        alert("Incorrect password. Access denied.");
    }
    return false; // Prevent the form from submitting
}

function loadGoals() {
    const savedGoals = localStorage.getItem('goals');
    if (savedGoals) {
        goals = JSON.parse(savedGoals);
    }
    updateGoalsList();
}

function updateGoalsList() {
    const goalsList = document.getElementById('goals');
    goalsList.innerHTML = '';
    
    goals.forEach((goal, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span class="goal-text">${goal.text}</span>
            <div class="goal-buttons">
                <input type="number" min="1" max="10" value="${goal.rewardValue || 1}" onchange="updateRewardValue(${index}, this.value)">
                <button onclick="editGoal(${index})">Edit</button>
                <button onclick="deleteGoal(${index})">Delete</button>
                ${goal.completed ? 
                    `<button onclick="toggleApproval(${index})" class="approve-btn">${goal.approved ? 'Unapprove' : 'Approve'}</button>` : 
                    ''}
            </div>
        `;
        if (goal.completed) {
            li.classList.add('completed');
        }
        if (goal.approved) {
            li.classList.add('approved');
        }
        goalsList.appendChild(li);
    });
}

function addGoal() {
    const newGoalInput = document.getElementById('new-goal');
    const goalText = newGoalInput.value.trim();
    
    if (goalText) {
        goals.push({ text: goalText, completed: false, approved: false, rewardValue: 1 });
        newGoalInput.value = '';
        updateGoalsList();
        saveGoals();
    }
}

function editGoal(index) {
    const newText = prompt("Edit goal:", goals[index].text);
    if (newText !== null && newText.trim() !== "") {
        goals[index].text = newText.trim();
        updateGoalsList();
        saveGoals();
    }
}

function deleteGoal(index) {
    if (confirm("Are you sure you want to delete this goal?")) {
        goals.splice(index, 1);
        updateGoalsList();
        saveGoals();
    }
}

function toggleApproval(index) {
    goals[index].approved = !goals[index].approved;
    updateGoalsList();
    saveGoals();
}

function updateRewardValue(index, value) {
    goals[index].rewardValue = parseInt(value, 10);
    saveGoals();
}

function saveGoals() {
    localStorage.setItem('goals', JSON.stringify(goals));
}

// Initial setup
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('password-prompt').style.display = 'block';
    document.getElementById('content').style.display = 'none';
    
    // Add event listener for the form submission
    document.getElementById('password-form').addEventListener('submit', checkPassword);
});
