// Application State
const defaultState = {
    theme: 'dark',
    currentProfileId: 'default',
    profiles: {
        'default': {
            name: 'Default Profile',
            lighting: {
                effect: 'solid',
                color: '#E0230E',
                brightness: 100,
                speed: 5
            },
            performance: {
                pollingRate: 1000,
                actuationPoint: 2.0,
                rapidTrigger: false,
                rapidSensitivity: 0.2
            },
            keymap: {}, // Custom mappings: { 'KeyA': { type: 'key', value: 'B' } }
            keyColors: {} // Per-key custom colors
        }
    },
    macros: [] // { id: 1, name: 'Macro 1', sequence: ['Ctrl','C'], delay: 50 }
};

let appState = loadState();

// Keyboard Layout Definition (75% Layout)
const keyboardLayout = [
    // Row 1
    [{ code: 'Escape', label: 'Esc' }, { width: 1 }, { code: 'F1', label: 'F1' }, { code: 'F2', label: 'F2' }, { code: 'F3', label: 'F3' }, { code: 'F4', label: 'F4' }, { width: 0.5 }, { code: 'F5', label: 'F5' }, { code: 'F6', label: 'F6' }, { code: 'F7', label: 'F7' }, { code: 'F8', label: 'F8' }, { width: 0.5 }, { code: 'F9', label: 'F9' }, { code: 'F10', label: 'F10' }, { code: 'F11', label: 'F11' }, { code: 'F12', label: 'F12' }, { code: 'Delete', label: 'Del' }],
    // Row 2
    [{ code: 'Backquote', label: '`' }, { code: 'Digit1', label: '1' }, { code: 'Digit2', label: '2' }, { code: 'Digit3', label: '3' }, { code: 'Digit4', label: '4' }, { code: 'Digit5', label: '5' }, { code: 'Digit6', label: '6' }, { code: 'Digit7', label: '7' }, { code: 'Digit8', label: '8' }, { code: 'Digit9', label: '9' }, { code: 'Digit0', label: '0' }, { code: 'Minus', label: '-' }, { code: 'Equal', label: '=' }, { code: 'Backspace', label: 'Backspace', width: 2 }, { code: 'Home', label: 'Home' }],
    // Row 3
    [{ code: 'Tab', label: 'Tab', width: 1.5 }, { code: 'KeyQ', label: 'Q' }, { code: 'KeyW', label: 'W' }, { code: 'KeyE', label: 'E' }, { code: 'KeyR', label: 'R' }, { code: 'KeyT', label: 'T' }, { code: 'KeyY', label: 'Y' }, { code: 'KeyU', label: 'U' }, { code: 'KeyI', label: 'I' }, { code: 'KeyO', label: 'O' }, { code: 'KeyP', label: 'P' }, { code: 'BracketLeft', label: '[' }, { code: 'BracketRight', label: ']' }, { code: 'Backslash', label: '\\', width: 1.5 }, { code: 'PageUp', label: 'PgUp' }],
    // Row 4
    [{ code: 'CapsLock', label: 'Caps', width: 1.75 }, { code: 'KeyA', label: 'A' }, { code: 'KeyS', label: 'S' }, { code: 'KeyD', label: 'D' }, { code: 'KeyF', label: 'F' }, { code: 'KeyG', label: 'G' }, { code: 'KeyH', label: 'H' }, { code: 'KeyJ', label: 'J' }, { code: 'KeyK', label: 'K' }, { code: 'KeyL', label: 'L' }, { code: 'Semicolon', label: ';' }, { code: 'Quote', label: "'" }, { code: 'Enter', label: 'Enter', width: 2.25 }, { code: 'PageDown', label: 'PgDn' }],
    // Row 5
    [{ code: 'ShiftLeft', label: 'Shift', width: 2.25 }, { code: 'KeyZ', label: 'Z' }, { code: 'KeyX', label: 'X' }, { code: 'KeyC', label: 'C' }, { code: 'KeyV', label: 'V' }, { code: 'KeyB', label: 'B' }, { code: 'KeyN', label: 'N' }, { code: 'KeyM', label: 'M' }, { code: 'Comma', label: ',' }, { code: 'Period', label: '.' }, { code: 'Slash', label: '/' }, { code: 'ShiftRight', label: 'Shift', width: 1.75 }, { code: 'ArrowUp', label: '↑' }, { code: 'End', label: 'End' }],
    // Row 6
    [{ code: 'ControlLeft', label: 'Ctrl', width: 1.25 }, { code: 'MetaLeft', label: 'Win', width: 1.25 }, { code: 'AltLeft', label: 'Alt', width: 1.25 }, { code: 'Space', label: '', width: 6.25 }, { code: 'AltRight', label: 'Alt', width: 1.25 }, { code: 'Fn', label: 'Fn', width: 1.25 }, { code: 'ControlRight', label: 'Ctrl', width: 1.25 }, { code: 'ArrowLeft', label: '←' }, { code: 'ArrowDown', label: '↓' }, { code: 'ArrowRight', label: '→' }]
];

let selectedKey = null;
let activePanel = 'lighting';

// DOM Elements
const elements = {
    keyboard: document.getElementById('keyboard'),
    themeToggle: document.getElementById('themeToggle'),
    navItems: document.querySelectorAll('.nav-item'),
    panels: document.querySelectorAll('.panel'),
    // Lighting
    effectBtns: document.querySelectorAll('.effect-btn'),
    colorPicker: document.getElementById('colorPicker'),
    brightness: document.getElementById('brightness'),
    brightnessValue: document.getElementById('brightnessValue'),
    effectSpeed: document.getElementById('effectSpeed'),
    speedValue: document.getElementById('speedValue'),
    // Performance
    pollingBtns: document.querySelectorAll('.polling-btn'),
    responseTime: document.getElementById('responseTime'),
    actuationPoint: document.getElementById('actuationPoint'),
    actuationValue: document.getElementById('actuationValue'),
    rapidTrigger: document.getElementById('rapidTrigger'),
    rapidTriggerSettings: document.getElementById('rapidTriggerSettings'),
    rapidSensitivity: document.getElementById('rapidTriggerSensitivity'),
    rapidSensitivityValue: document.getElementById('rapidSensitivityValue'),
    // Remapping
    remapInterface: document.getElementById('remapInterface'),
    currentKeyDisplay: document.getElementById('currentKey'),
    keySelect: document.getElementById('keySelect'),
    applyRemap: document.getElementById('applyRemap'),
    cancelRemap: document.getElementById('cancelRemap'),
    resetKey: document.getElementById('resetKey'),
    // Macros
    createMacroBtn: document.getElementById('createMacro'),
    macroList: document.getElementById('macroList'),
    macroEditor: document.getElementById('macroEditor'),
    macroName: document.getElementById('macroName'),
    macroSequence: document.getElementById('macroSequence'),
    macroDelay: document.getElementById('macroDelay'),
    saveMacroBtn: document.getElementById('saveMacro'),
    cancelMacroBtn: document.getElementById('cancelMacro'),
    // Profiles
    profileName: document.getElementById('profileName'),
    saveProfileBtn: document.getElementById('saveProfile'),
    profileList: document.getElementById('profileList'),
    exportProfileBtn: document.getElementById('exportProfile'),
    importProfileInput: document.getElementById('importProfile'),
    resetToDefaultBtn: document.getElementById('resetToDefault')
};

// --- Initialization ---

function init() {
    renderKeyboard();
    setupEventListeners();
    updateUI();
    applyTheme(appState.theme);

    // Auto-save loop
    setInterval(saveState, 30000);
}

function loadState() {
    const saved = localStorage.getItem('fgg_config_v1');
    if (saved) {
        return { ...defaultState, ...JSON.parse(saved) };
    }
    return JSON.parse(JSON.stringify(defaultState));
}

function saveState() {
    localStorage.setItem('fgg_config_v1', JSON.stringify(appState));
}

function getCurrentProfile() {
    return appState.profiles[appState.currentProfileId];
}

// --- Rendering ---

function renderKeyboard() {
    elements.keyboard.innerHTML = '';
    const profile = getCurrentProfile();

    keyboardLayout.forEach(row => {
        row.forEach(key => {
            if (key.width === 0.5) {
                // Spacer
                const spacer = document.createElement('div');
                spacer.style.width = '20px'; // Approx gap
                elements.keyboard.appendChild(spacer);
                return;
            }

            const keyEl = document.createElement('div');
            keyEl.className = 'key';
            keyEl.dataset.code = key.code;
            keyEl.textContent = key.label;

            // Width handling
            if (key.width) {
                // Calculate span based on width (standard unit approx 60px)
                // Grid layout: we used grid-template-columns: repeat(15, 1fr)
                // We need to approximation classes or inline styles
                // Simplification for CSS grid: we use classes key-1.25 etc or inline grid-column
                // Let's rely on the classes I defined in CSS for common sizes, or add style
                if (key.width === 1.25) keyEl.style.gridColumn = 'span 2'; // Roughly, CSS grid is 15 cols, so exact span is tricky.
                // Let's use flex styles or simpler grid in future, but for now rely on mapped classes or style:
                // Actually my CSS had key-1-5, key-2, key-space. Let's fix this dynamic logic.
                // Better approach: use Style grid-column end
                if (key.code === 'Space') keyEl.className += ' key-space';
                else if (key.width >= 2) keyEl.className += ' key-2';
                else if (key.width >= 1.5) keyEl.className += ' key-1-5';
            }

            // Apply RGB Color
            const keyColor = profile.keyColors[key.code] || (profile.lighting.effect === 'solid' ? profile.lighting.color : null);

            if (keyColor) {
                keyEl.style.color = keyColor;
                keyEl.style.borderColor = keyColor;
                // Add glow effect
                keyEl.style.boxShadow = `0 0 10px ${keyColor}40`;
            }

            // Remap indicator
            if (profile.keymap[key.code]) {
                keyEl.classList.add('remapped');
            }

            keyEl.addEventListener('click', () => handleKeyClick(key));
            elements.keyboard.appendChild(keyEl);
        });
    });

    applyLightingEffects();
}

function updateUI() {
    const profile = getCurrentProfile();
    const perf = profile.performance;
    const light = profile.lighting;

    // Lighting
    elements.colorPicker.value = light.color;
    elements.brightness.value = light.brightness;
    elements.brightnessValue.textContent = `${light.brightness}%`;
    elements.effectSpeed.value = light.speed;
    elements.speedValue.textContent = light.speed;

    elements.effectBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.effect === light.effect);
    });

    // Performance
    elements.pollingBtns.forEach(btn => {
        btn.classList.toggle('active', parseInt(btn.dataset.rate) === perf.pollingRate);
    });
    elements.responseTime.textContent = calculateResponseTime(perf.pollingRate);

    elements.actuationPoint.value = perf.actuationPoint;
    elements.actuationValue.textContent = `${perf.actuationPoint}mm`;

    if (elements.rapidTrigger) {
        elements.rapidTrigger.checked = perf.rapidTrigger;
        elements.rapidTriggerSettings.style.display = perf.rapidTrigger ? 'flex' : 'none';

        // Element might be missing if I had a typo in DOM map, checking safety
        const rapidSens = document.getElementById('rapidTriggerSensitivity');
        if (rapidSens) {
            rapidSens.value = perf.rapidSensitivity;
            // fixed ID reference in map above might be needed
        }
        if (elements.rapidSensitivityValue) {
            elements.rapidSensitivityValue.textContent = `${perf.rapidSensitivity}mm`;
        }
    }

    // Profiles
    elements.profileName.value = profile.name;
    renderProfileList();
    renderMacroList();
}

// --- Event Listeners ---

function setupEventListeners() {
    // Theme
    elements.themeToggle.addEventListener('click', toggleTheme);

    // Navigation
    elements.navItems.forEach(item => {
        item.addEventListener('click', () => switchPanel(item.dataset.panel));
    });

    // Lighting Controls
    elements.effectBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            getCurrentProfile().lighting.effect = btn.dataset.effect;
            updateUI();
            renderKeyboard();
            saveState();
        });
    });

    elements.colorPicker.addEventListener('input', (e) => {
        getCurrentProfile().lighting.color = e.target.value;
        if (selectedKey) {
            // Per key coloring if supported/selected, but for 'solid' mode primarily
            // If in per-key mode:
            // getCurrentProfile().keyColors[selectedKey.code] = e.target.value;
        }
        updateUI();
        renderKeyboard(); // Re-render to show color change immediately
    });

    elements.brightness.addEventListener('input', (e) => {
        getCurrentProfile().lighting.brightness = e.target.value;
        updateUI();
    });

    // Performance Controls
    elements.pollingBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            getCurrentProfile().performance.pollingRate = parseInt(btn.dataset.rate);
            updateUI();
            saveState();
        });
    });

    elements.actuationPoint.addEventListener('input', (e) => {
        getCurrentProfile().performance.actuationPoint = e.target.value;
        updateUI();
    });

    if (elements.rapidTrigger) {
        elements.rapidTrigger.addEventListener('change', (e) => {
            getCurrentProfile().performance.rapidTrigger = e.target.checked;
            updateUI();
        });
    }

    const rapidSens = document.getElementById('rapidTriggerSensitivity');
    if (rapidSens) {
        rapidSens.addEventListener('input', (e) => {
            getCurrentProfile().performance.rapidSensitivity = e.target.value;
            updateUI();
        });
    }

    // Key Remapping
    elements.applyRemap.addEventListener('click', applyKeyRemap);
    elements.cancelRemap.addEventListener('click', () => {
        elements.remapInterface.style.display = 'none';
        selectedKey = null;
        renderKeyboard(); // Clear selection
    });
    elements.resetKey.addEventListener('click', () => {
        if (selectedKey) {
            delete getCurrentProfile().keymap[selectedKey.code];
            elements.remapInterface.style.display = 'none';
            selectedKey = null;
            renderKeyboard();
            saveState();
        }
    });

    // Macros
    elements.createMacroBtn.addEventListener('click', () => {
        elements.macroEditor.style.display = 'block';
        elements.macroName.value = '';
        elements.macroSequence.value = '';
        elements.macroDelay.value = 50;
    });

    elements.cancelMacroBtn.addEventListener('click', () => {
        elements.macroEditor.style.display = 'none';
    });

    elements.saveMacroBtn.addEventListener('click', saveMacro);

    // Profiles
    elements.saveProfileBtn.addEventListener('click', () => {
        getCurrentProfile().name = elements.profileName.value;
        saveState();
        renderProfileList();
        alert('Profile saved!');
    });

    elements.exportProfileBtn.addEventListener('click', exportProfile);
    elements.importProfileInput.addEventListener('change', importProfile);
    elements.resetToDefaultBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to reset all settings?')) {
            localStorage.removeItem('fgg_config_v1');
            location.reload();
        }
    });
}

// --- Logic Functions ---

function toggleTheme() {
    appState.theme = appState.theme === 'dark' ? 'light' : 'dark';
    applyTheme(appState.theme);
    saveState();
}

function applyTheme(theme) {
    document.body.className = theme === 'dark' ? 'dark-mode' : '';
}

function switchPanel(panelId) {
    activePanel = panelId;

    // Update Nav
    elements.navItems.forEach(item => {
        item.classList.toggle('active', item.dataset.panel === panelId);
    });

    // Update Panels
    elements.panels.forEach(panel => {
        panel.classList.toggle('active', panel.id === `panel-${panelId}`);
    });

    // Clear selection when switching
    selectedKey = null;
    elements.remapInterface.style.display = 'none';
    renderKeyboard();
}

function handleKeyClick(key) {
    selectedKey = key;

    // Visual selection
    const allKeys = document.querySelectorAll('.key');
    allKeys.forEach(k => k.classList.remove('selected'));
    const clickedEl = document.querySelector(`.key[data-code="${key.code}"]`);
    if (clickedEl) clickedEl.classList.add('selected');

    if (activePanel === 'lighting') {
        // In proper implementation, this would toggle per-key color
        // For now we assume global effect unless mode is 'custom' (which I mapped to 'random' or 'zone' loosely)
        // Let's allow setting the color of this key to current picker color
        getCurrentProfile().keyColors[key.code] = elements.colorPicker.value;
        renderKeyboard(); // update visual
    } else if (activePanel === 'keymapping') {
        elements.remapInterface.style.display = 'block';
        elements.currentKeyDisplay.textContent = key.label;
        elements.currentKeyDisplay.dataset.code = key.code;

        // Pre-select if already mapped
        const currentMap = getCurrentProfile().keymap[key.code];
        elements.keySelect.value = currentMap ? currentMap.value : '';
    }
}

function applyKeyRemap() {
    if (!selectedKey) return;

    const newVal = elements.keySelect.value;
    if (newVal) {
        getCurrentProfile().keymap[selectedKey.code] = {
            type: 'key',
            value: newVal
        };
        saveState();
        renderKeyboard(); // Show indicator
        elements.remapInterface.style.display = 'none';
        selectedKey = null;
    }
}

function saveMacro() {
    const name = elements.macroName.value;
    const seq = elements.macroSequence.value.split(',').map(s => s.trim()).filter(s => s);
    const delay = parseInt(elements.macroDelay.value);

    if (name && seq.length > 0) {
        appState.macros.push({
            id: Date.now(),
            name,
            sequence: seq,
            delay
        });
        saveState();
        renderMacroList();
        elements.macroEditor.style.display = 'none';
    } else {
        alert('Please enter a name and at least one key.');
    }
}

function renderMacroList() {
    elements.macroList.innerHTML = '';
    appState.macros.forEach(macro => {
        const div = document.createElement('div');
        div.className = 'macro-item';
        div.innerHTML = `
            <div class="macro-info">
                <h4>${macro.name}</h4>
                <p>${macro.sequence.length} actions • ${macro.delay}ms delay</p>
            </div>
            <div class="macro-actions">
                <button class="btn-danger" style="padding: 4px 8px; font-size: 12px;" onclick="deleteMacro(${macro.id})">Delete</button>
            </div>
        `;
        elements.macroList.appendChild(div);
    });
}

// Global scope for onclick
window.deleteMacro = function (id) {
    appState.macros = appState.macros.filter(m => m.id !== id);
    saveState();
    renderMacroList();
};

function renderProfileList() {
    elements.profileList.innerHTML = '';
    Object.entries(appState.profiles).forEach(([id, profile]) => {
        if (id === 'default') return; // Don't list default as deleteable

        const div = document.createElement('div');
        div.className = 'profile-item';
        div.innerHTML = `
            <h4>${profile.name}</h4>
            <div class="profile-actions">
                <button class="btn-secondary" onclick="loadProfileId('${id}')">Load</button>
                <button class="btn-danger" onclick="deleteProfile('${id}')">Delete</button>
            </div>
        `;
        elements.profileList.appendChild(div);
    });
}

window.loadProfileId = function (id) {
    appState.currentProfileId = id;
    saveState();
    updateUI();
    renderKeyboard();
}

window.deleteProfile = function (id) {
    if (confirm('Delete this profile?')) {
        delete appState.profiles[id];
        if (appState.currentProfileId === id) appState.currentProfileId = 'default';
        saveState();
        updateUI();
    }
}

function exportProfile() {
    const profile = getCurrentProfile();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(profile));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `${profile.name.replace(/\s+/g, '_')}_profile.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

function importProfile(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const profile = JSON.parse(e.target.result);
            const id = 'p_' + Date.now();
            appState.profiles[id] = profile;
            appState.currentProfileId = id;
            saveState();
            updateUI();
            renderKeyboard();
            alert('Profile imported successfully!');
        } catch (err) {
            alert('Error importing profile: Invalid JSON');
        }
    };
    reader.readAsText(file);
}

function calculateResponseTime(rate) {
    return (1000 / rate).toFixed(2) + 'ms';
}

function applyLightingEffects() {
    // Basic CSS animation simulation
    const profile = getCurrentProfile();
    const keys = document.querySelectorAll('.key');

    // Reset specific animations
    keys.forEach(k => {
        k.style.animation = 'none';
        if (profile.lighting.effect === 'breathing') {
            k.style.animation = `glow ${11 - profile.lighting.speed}s infinite alternate`;
        } else if (profile.lighting.effect === 'rainbow') {
            // Complex rainbow not easily done via inline styles without CSS vars or canvas
            // We'll simulate by setting style.transition directly here for simplicity if needed
        }
    });

    // We rely on CSS for 'glow' keyframe if we add it
    // Let's inject keyframes if not present
    if (!document.getElementById('dynamic-styles')) {
        const style = document.createElement('style');
        style.id = 'dynamic-styles';
        style.innerHTML = `
            @keyframes glow {
                from { opacity: 0.5; box-shadow: 0 0 5px currentColor; }
                to { opacity: 1; box-shadow: 0 0 20px currentColor; }
            }
        `;
        document.head.appendChild(style);
    }
}

// Start app
document.addEventListener('DOMContentLoaded', init);
