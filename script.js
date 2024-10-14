let goals = [];

// Load goals from local storage when the page loads
function loadGoals() {
    const savedGoals = localStorage.getItem('goals');
    if (savedGoals) {
        goals = JSON.parse(savedGoals);
    }
    updateGoalsList();
    updateProgress();
}

// Save goals to local storage
function saveGoals() {
    localStorage.setItem('goals', JSON.stringify(goals));
}

function updateGoalsList() {
    const goalsList = document.getElementById('goals');
    goalsList.innerHTML = '';
    
    goals.forEach((goal, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <div class="goal-info">
                <span class="goal-text">${goal.text}</span>
                <span class="goal-stars">${getStars(goal.rewardValue || 1)}</span>
            </div>
            <div class="goal-buttons">
                <button onclick="toggleGoal(${index})" class="complete-btn">${goal.completed ? 'Undo' : 'Complete'}</button>
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

function getStars(value) {
    return '★'.repeat(value);
}

function toggleGoal(index) {
    goals[index].completed = !goals[index].completed;
    if (!goals[index].completed) {
        goals[index].approved = false;
    }
    updateGoalsList();
    updateProgress();
    saveGoals();
}

function updateProgress() {
    const progressBar = document.getElementById('progress-bar');
    progressBar.innerHTML = ''; // Clear existing progress segments

    const totalRewardValue = goals.reduce((sum, goal) => sum + (goal.rewardValue || 1), 0);
    let approvedProgress = 0;
    let completedProgress = 0;

    // First, add all approved segments
    goals.forEach((goal) => {
        if (goal.approved) {
            const segmentWidth = ((goal.rewardValue || 1) / totalRewardValue) * 100;
            const segment = document.createElement('div');
            segment.className = 'progress-segment approved';
            segment.style.width = `${segmentWidth}%`;
            progressBar.appendChild(segment);
            approvedProgress += segmentWidth;
        }
    });

    // Then, add all completed but not approved segments
    goals.forEach((goal) => {
        if (goal.completed && !goal.approved) {
            const segmentWidth = ((goal.rewardValue || 1) / totalRewardValue) * 100;
            const segment = document.createElement('div');
            segment.className = 'progress-segment completed';
            segment.style.width = `${segmentWidth}%`;
            progressBar.appendChild(segment);
            completedProgress += segmentWidth;
        }
    });

    const totalProgress = approvedProgress + completedProgress;

    if (totalProgress === 100) {
        alert('Congratulations! You\'ve completed all your quests!');
    }
}

// Load goals when the page loads
loadGoals();
