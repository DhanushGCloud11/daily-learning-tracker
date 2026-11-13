// Daily Learning Tracker - JavaScript Logic

// Initialize the application
function init() {
    // Load existing topics from localStorage
    loadTopics();
    
    // Setup form submission
    const topicForm = document.getElementById('topic-form');
    topicForm.addEventListener('submit', addTopic);
}

// Load topics from localStorage
function loadTopics() {
    const topics = JSON.parse(localStorage.getItem('learningTopics')) || [];
    renderTopics(topics);
    updateStats(topics);
}

// Save topics to localStorage
function saveTopics(topics) {
    localStorage.setItem('learningTopics', JSON.stringify(topics));
}

// Add a new topic
function addTopic(e) {
    e.preventDefault();
    
    const topicInput = document.getElementById('topic-input');
    const topicText = topicInput.value.trim();
    
    if (topicText) {
        const topics = JSON.parse(localStorage.getItem('learningTopics')) || [];
        
        const newTopic = {
            id: Date.now(),
            text: topicText,
            completed: false,
            date: new Date().toLocaleDateString()
        };
        
        topics.push(newTopic);
        saveTopics(topics);
        
        renderTopics(topics);
        updateStats(topics);
        
        // Clear the input
        topicInput.value = '';
        
        // Focus back on input for better UX
        topicInput.focus();
    }
}

// Render topics to the DOM
function renderTopics(topics) {
    const topicsList = document.getElementById('topics-list');
    
    // Clear existing topics
    topicsList.innerHTML = '';
    
    if (topics.length === 0) {
        topicsList.innerHTML = '<div class="empty-message">No topics added yet. Add your first learning topic above!</div>';
        return;
    }
    
    // Create topic elements
    topics.forEach(topic => {
        const topicElement = document.createElement('div');
        topicElement.className = `topic-item ${topic.completed ? 'completed' : ''}`;
        topicElement.innerHTML = `
            <div class="topic-content">
                <div class="topic-text">${topic.text}</div>
                <div class="topic-date">Added: ${topic.date}</div>
                <span class="topic-status ${topic.completed ? 'completed' : 'pending'}">
                    ${topic.completed ? 'Completed' : 'Pending'}
                </span>
            </div>
            <div class="topic-actions">
                <button class="btn ${topic.completed ? 'btn-pending' : 'btn-complete'}" 
                        onclick="toggleTopicStatus(${topic.id})">
                    ${topic.completed ? 'Mark Pending' : 'Mark Complete'}
                </button>
                <button class="btn btn-delete" onclick="deleteTopic(${topic.id})">Delete</button>
            </div>
        `;
        topicsList.appendChild(topicElement);
    });
}

// Update dashboard statistics
function updateStats(topics) {
    const totalTopics = topics.length;
    const completedTopics = topics.filter(topic => topic.completed).length;
    const pendingTopics = totalTopics - completedTopics;
    const completionPercentage = totalTopics > 0 ? (completedTopics / totalTopics) * 100 : 0;
    
    // Update stat values
    document.getElementById('total-topics').textContent = totalTopics;
    document.getElementById('completed-topics').textContent = completedTopics;
    document.getElementById('pending-topics').textContent = pendingTopics;
    
    // Update progress bar
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');
    
    progressFill.style.width = `${completionPercentage}%`;
    progressText.textContent = `${completionPercentage.toFixed(1)}%`;
}

// Toggle topic completion status
function toggleTopicStatus(id) {
    const topics = JSON.parse(localStorage.getItem('learningTopics')) || [];
    
    const topicIndex = topics.findIndex(topic => topic.id === id);
    if (topicIndex !== -1) {
        topics[topicIndex].completed = !topics[topicIndex].completed;
        saveTopics(topics);
        renderTopics(topics);
        updateStats(topics);
    }
}

// Delete a topic
function deleteTopic(id) {
    const topics = JSON.parse(localStorage.getItem('learningTopics')) || [];
    
    const filteredTopics = topics.filter(topic => topic.id !== id);
    saveTopics(filteredTopics);
    renderTopics(filteredTopics);
    updateStats(filteredTopics);
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', init);