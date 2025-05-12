// DOM Elements
const themeToggle = document.getElementById('checkbox');
const animationBox = document.getElementById('animationBox');
const colorOptions = document.querySelectorAll('.color-option');
const animationSelect = document.getElementById('animationSelect');
const transitionSpeed = document.getElementById('transitionSpeed');
const speedValue = document.getElementById('speedValue');
const saveButton = document.getElementById('savePreferences');
const resetButton = document.getElementById('resetPreferences');

// Default preferences
const defaultPreferences = {
    darkMode: false,
    accentColor: '#e74c3c',
    animation: 'bounce',
    transitionSpeed: 0.4
};

/**
 * Load preferences from localStorage
 * If preferences exist, apply them
 * If not, use default preferences
 */
function loadPreferences() {
    const savedPreferences = localStorage.getItem('themePreferences');
    
    if (savedPreferences) {
        // If we have saved preferences, parse and apply them
        const preferences = JSON.parse(savedPreferences);
        applyPreferences(preferences);
    } else {
        // Otherwise use default preferences
        applyPreferences(defaultPreferences);
    }
}

/**
 * Save current preferences to localStorage
 */
function savePreferences() {
    const preferences = {
        darkMode: themeToggle.checked,
        accentColor: document.querySelector('.color-option.selected').dataset.color,
        animation: animationSelect.value,
        transitionSpeed: parseFloat(transitionSpeed.value)
    };
    
    localStorage.setItem('themePreferences', JSON.stringify(preferences));
    
    // Show a confirmation animation
    animationBox.textContent = 'Saved!';
    playAnimation();
    setTimeout(() => {
        animationBox.textContent = 'Click Me!';
    }, 2000);
}

/**
 * Apply preferences to the UI
 * @param {Object} preferences - User preferences object
 */
function applyPreferences(preferences) {
    // Apply dark mode
    themeToggle.checked = preferences.darkMode;
    document.body.classList.toggle('dark-theme', preferences.darkMode);
    
    // Apply accent color
    document.documentElement.style.setProperty('--accent-color', preferences.accentColor);
    
    // Update color palette selection
    colorOptions.forEach(option => {
        option.classList.toggle('selected', option.dataset.color === preferences.accentColor);
    });
    
    // Set animation type
    animationSelect.value = preferences.animation;
    
    // Set transition speed
    transitionSpeed.value = preferences.transitionSpeed;
    speedValue.textContent = preferences.transitionSpeed + 's';
    document.documentElement.style.setProperty('--transition-speed', preferences.transitionSpeed + 's');
}

/**
 * Reset all preferences to default values
 */
function resetToDefaults() {
    localStorage.removeItem('themePreferences');
    applyPreferences(defaultPreferences);
    
    // Show a confirmation animation
    animationBox.textContent = 'Reset!';
    playAnimation();
    setTimeout(() => {
        animationBox.textContent = 'Click Me!';
    }, 2000);
}

/**
 * Play the selected animation on the animation box
 */
function playAnimation() {
    const animationType = animationSelect.value;
    
    // Remove any existing animation classes
    animationBox.classList.remove('bounce', 'pulse', 'shake', 'spin');
    
    // Force a reflow to restart the animation
    void animationBox.offsetWidth;
    
    // Add the selected animation class
    animationBox.classList.add(animationType);
}

// Event Listeners
themeToggle.addEventListener('change', () => {
    document.body.classList.toggle('dark-theme', themeToggle.checked);
});

animationBox.addEventListener('click', playAnimation);

colorOptions.forEach(option => {
    option.addEventListener('click', () => {
        // Remove selected class from all options
        colorOptions.forEach(opt => opt.classList.remove('selected'));
        
        // Add selected class to clicked option
        option.classList.add('selected');
        
        // Apply the selected color
        document.documentElement.style.setProperty('--accent-color', option.dataset.color);
    });
});

transitionSpeed.addEventListener('input', () => {
    const value = transitionSpeed.value;
    speedValue.textContent = value + 's';
    document.documentElement.style.setProperty('--transition-speed', value + 's');
});

saveButton.addEventListener('click', savePreferences);
resetButton.addEventListener('click', resetToDefaults);

// Initialize
document.addEventListener('DOMContentLoaded', loadPreferences);