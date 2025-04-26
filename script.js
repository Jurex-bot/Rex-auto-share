// Server Definitions
const serverDefinitions = {
    server1: { name: "Server 1", url: 'https://server1-u9fw.onrender.com' },
    server2: { name: "Server 2", url: 'https://server-2-aggj.onrender.com' },
    server3: { name: "Server 3", url: 'https://server-3-p6lg.onrender.com' }
};

// Admin Code
const ADMIN_CODE = "admin123";

// DOM Elements
const authSection = document.getElementById('auth-section');
const appSection = document.getElementById('app-section');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const showSignup = document.getElementById('show-signup');
const showLogin = document.getElementById('show-login');
const signupProfile = document.getElementById('signup-profile');
const adminCodeContainer = document.getElementById('admin-code-container');
const submitButton = document.getElementById('submit-button');
const buttonText = submitButton.querySelector('.button-text');
const buttonIcon = submitButton.querySelector('.button-icon');
const serverSelectButton = document.getElementById('server-select-button');
const serverSelectButtonText = document.getElementById('server-select-button-text');
const selectedServerInput = document.getElementById('selectedServer');
const serverListContainer = document.getElementById('server-list');
const serverModal = document.getElementById('serverModal');
const responseModal = document.getElementById('responseModal');
const responseMessageElement = document.getElementById('responseMessage');
const responseModalIconElement = document.getElementById('modal-icon');
const developerModal = document.getElementById('developerModal');
const developerButton = document.getElementById('developer-button');
const adminButton = document.getElementById('admin-button');
const sideAdminButton = document.getElementById('side-admin-button');
const sideDeveloperButton = document.getElementById('side-developer-button');
const sideTerminalButton = document.getElementById('side-terminal-button');
const logoutButton = document.getElementById('logout-button');
const terminal = document.getElementById('terminal');
const terminalToggle = document.getElementById('terminal-toggle');
const terminalClose = document.getElementById('terminal-close');
const terminalContent = document.getElementById('terminal-content');
const form = document.getElementById('share-boost-form');
const menuButton = document.getElementById('menu-button');
const sideMenu = document.getElementById('side-menu');
const menuOverlay = document.getElementById('menu-overlay');
const closeMenuButton = document.getElementById('close-menu-button');
const sideMenuItems = document.querySelectorAll('.side-menu-item');
const navItems = document.querySelectorAll('.nav-item');
const navIndicator = document.querySelector('.nav-indicator');
const contentSections = document.querySelectorAll('.content-section');
const sharesRemaining = document.getElementById('shares-remaining');
const maxShares = document.getElementById('max-shares');
const userPremiumBadge = document.getElementById('user-premium-badge');
const sideMenuUsername = document.getElementById('side-menu-username');
const sideMenuUseremail = document.getElementById('side-menu-useremail');
const postForm = document.getElementById('post-form');
const postsContainer = document.getElementById('posts-container');
const adminSection = document.getElementById('admin-section');
const userSearch = document.getElementById('user-search');
const searchUserButton = document.getElementById('search-user');
const usersList = document.getElementById('users-list');
const userActions = document.getElementById('user-actions');
const selectedUserEmail = document.getElementById('selected-user-email');
const makePremiumButton = document.getElementById('make-premium');
const removePremiumButton = document.getElementById('remove-premium');

// App State
let currentUser = null;
let intervalCheck;
let currentSelectedServer = null;
let sharesSentCount = 0;
let users = []; // This would normally come from a database
let posts = []; // This would normally come from a database

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    setupEventListeners();
    checkLocalStorage();
});

function setupEventListeners() {
    // Auth Forms
    loginForm.addEventListener('submit', handleLogin);
    signupForm.addEventListener('submit', handleSignup);
    showSignup.addEventListener('click', () => toggleAuthForms('signup'));
    showLogin.addEventListener('click', () => toggleAuthForms('login'));
    signupProfile.addEventListener('change', handleProfileTypeChange);
    
    // Main App
    serverSelectButton.addEventListener('click', () => {
        serverModal.style.display = 'flex';
        renderServerList();
        checkServerStatus();
        lucide.createIcons();
    });
    
    form.addEventListener('submit', handleFormSubmit);
    form.addEventListener('input', validateForm);
    
    // Navigation
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            setActiveSection(this.dataset.section);
        });
    });
    
    sideMenuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            setActiveSection(this.dataset.section);
        });
    });
    
    // Modals
    [responseModal, serverModal, developerModal].forEach(modalInstance => {
        if (modalInstance) {
            modalInstance.addEventListener('click', (event) => {
                if (event.target === modalInstance) {
                    modalInstance.style.display = 'none';
                }
            });
        }
    });
    
    // Side Menu
    menuButton.addEventListener('click', openSideMenu);
    closeMenuButton.addEventListener('click', closeSideMenu);
    menuOverlay.addEventListener('click', closeSideMenu);
    
    // Developer Button
    developerButton.addEventListener('click', () => {
        developerModal.style.display = 'flex';
        lucide.createIcons();
        addTerminalLog('Opened developer information', 'info');
    });
    
    sideDeveloperButton.addEventListener('click', (e) => {
        e.preventDefault();
        developerModal.style.display = 'flex';
        lucide.createIcons();
        closeSideMenu();
        addTerminalLog('Opened developer information', 'info');
    });
    
    // Admin Button
    adminButton.addEventListener('click', () => {
        setActiveSection('admin');
    });
    
    sideAdminButton.addEventListener('click', (e) => {
        e.preventDefault();
        setActiveSection('admin');
        closeSideMenu();
    });
    
    // Terminal
    terminalToggle.addEventListener('click', toggleTerminal);
    terminalClose.addEventListener('click', toggleTerminal);
    sideTerminalButton.addEventListener('click', (e) => {
        e.preventDefault();
        toggleTerminal();
        closeSideMenu();
    });
    
    // Logout
    logoutButton.addEventListener('click', handleLogout);
    
    // Posts
    postForm.addEventListener('submit', handlePostSubmit);
    
    // Admin Panel
    searchUserButton.addEventListener('click', searchUsers);
    userSearch.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') searchUsers();
    });
    makePremiumButton.addEventListener('click', () => updateUserPremiumStatus(true));
    removePremiumButton.addEventListener('click', () => updateUserPremiumStatus(false));
}

function checkLocalStorage() {
    const user = localStorage.getItem('currentUser');
    if (user) {
        currentUser = JSON.parse(user);
        initializeApp();
    }
}

function toggleAuthForms(show) {
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    
    if (show === 'signup') {
        loginForm.classList.add('hidden');
        signupForm.classList.remove('hidden');
    } else {
        signupForm.classList.add('hidden');
        loginForm.classList.remove('hidden');
    }
}

function handleProfileTypeChange() {
    const profileType = signupProfile.value;
    adminCodeContainer.classList.toggle('hidden', profileType !== 'admin');
}

async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    // In a real app, you would verify credentials with a server
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        initializeApp();
        addTerminalLog(`User logged in: ${user.email}`, 'success');
    } else {
        showModal('Invalid email or password', 'error');
        addTerminalLog('Login failed: Invalid credentials', 'error');
    }
}

async function handleSignup(e) {
    e.preventDefault();
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const profileType = document.getElementById('signup-profile').value;
    const adminCode = document.getElementById('admin-code').value;
    
    // Validate admin code if signing up as admin
    if (profileType === 'admin' && adminCode !== ADMIN_CODE) {
        showModal('Invalid admin code', 'error');
        addTerminalLog('Signup failed: Invalid admin code', 'error');
        return;
    }
    
    // Check if user already exists
    if (users.some(u => u.email === email)) {
        showModal('Email already in use', 'error');
        addTerminalLog('Signup failed: Email already in use', 'error');
        return;
    }
    
    const newUser = {
        id: Date.now().toString(),
        name,
        email,
        password,
        profileType,
        isPremium: false,
        sharesUsed: 0,
        maxShares: 300,
        lastShareDate: new Date().toISOString().split('T')[0]
    };
    
    users.push(newUser);
    currentUser = newUser;
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    localStorage.setItem('users', JSON.stringify(users));
    
    initializeApp();
    toggleAuthForms('login');
    showModal('Account created successfully!', 'success');
    addTerminalLog(`New user registered: ${email}`, 'success');
}

function initializeApp() {
    authSection.classList.add('hidden');
    appSection.classList.remove('hidden');
    
    // Update UI with user info
    sideMenuUsername.textContent = currentUser.name;
    sideMenuUseremail.textContent = currentUser.email;
    
    // Show admin button if user is admin
    if (currentUser.profileType === 'admin') {
        adminButton.classList.remove('hidden');
        sideAdminButton.classList.remove('hidden');
        adminSection.classList.remove('hidden');
    }
    
    // Update premium status
    updatePremiumUI();
    
    // Initialize other components
    renderServerList();
    checkServerStatus();
    validateForm();
    loadPosts();
    loadUsers();
    
    addTerminalLog('Application initialized', 'success');
    addTerminalLog(`Welcome back, ${currentUser.name}!`, 'info');
}

function updatePremiumUI() {
    if (currentUser.isPremium) {
        userPremiumBadge.classList.remove('hidden');
        sharesRemaining.textContent = 'Unlimited';
        maxShares.textContent = 'Unlimited';
    } else {
        userPremiumBadge.classList.add('hidden');
        const remaining = currentUser.maxShares - currentUser.sharesUsed;
        sharesRemaining.textContent = remaining > 0 ? remaining : 0;
        maxShares.textContent = currentUser.maxShares;
    }
}

function handleLogout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    authSection.classList.remove('hidden');
    appSection.classList.add('hidden');
    document.getElementById('login-email').value = '';
    document.getElementById('login-password').value = '';
    toggleAuthForms('login');
    addTerminalLog('User logged out', 'info');
}

function renderServerList() {
    serverListContainer.innerHTML = '';
    Object.keys(serverDefinitions).forEach(key => {
        const server = serverDefinitions[key];
        const item = document.createElement('div');
        item.classList.add('server-item', 'p-3', 'rounded-lg', 'border', 'flex', 'justify-between', 'items-center', 'disabled', 'bg-input-bg');
        item.dataset.serverKey = key;
        item.innerHTML = `
            <span class="server-name font-medium text-sm">${server.name}</span>
            <span class="server-status text-xs flex items-center gap-1.5">
                <span class="status-dot bg-gray-500"></span>
                <span class="status-text text-text-muted">Checking...</span>
            </span>
        `;
        item.addEventListener('click', () => handleServerSelection(key));
        serverListContainer.appendChild(item);
    });
    lucide.createIcons();
}

function handleServerSelection(key) {
    const serverItem = serverListContainer.querySelector(`.server-item[data-server-key="${key}"]`);
    if (serverItem && !serverItem.classList.contains('disabled')) {
        const currentlySelected = serverListContainer.querySelector('.border-primary');
        if (currentlySelected) {
           currentlySelected.classList.remove('border-primary', 'bg-primary/10');
           currentlySelected.classList.add('border-input-border', 'bg-input-bg');
        }

        serverItem.classList.remove('border-input-border', 'bg-input-bg');
        serverItem.classList.add('border-primary', 'bg-primary/10');

        currentSelectedServer = key;
        selectedServerInput.value = key;
        serverSelectButtonText.textContent = `${serverDefinitions[key].name} (Active)`;
        serverModal.style.display = 'none';
        validateForm();
        addTerminalLog(`Selected server: ${serverDefinitions[key].name}`, 'success');
    }
}

async function checkServerStatus() {
    let oneServerActive = false;
    addTerminalLog('Checking server statuses...', 'info');

    const statusPromises = Object.keys(serverDefinitions).map(async (key) => {
        const server = serverDefinitions[key];
        const serverItem = serverListContainer.querySelector(`.server-item[data-server-key="${key}"]`);
        const statusDot = serverItem?.querySelector('.status-dot');
        const statusTextElement = serverItem?.querySelector('.status-text');

        if (!serverItem || !statusDot || !statusTextElement) return false;

        let statusText = 'Checking...';
        let statusColorClass = 'bg-gray-500';
        let isActive = false;

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 6000);
            await fetch(server.url, { signal: controller.signal, mode: 'no-cors' });
            clearTimeout(timeoutId);
            statusText = 'Active';
            statusColorClass = 'bg-status-active';
            isActive = true;
            oneServerActive = true;
            addTerminalLog(`${server.name}: Online`, 'success');
        } catch (error) {
            if (error.name === 'AbortError') {
                statusText = 'Timeout';
                statusColorClass = 'bg-status-timeout';
                addTerminalLog(`${server.name}: Timeout`, 'warning');
            } else {
                statusText = 'Offline';
                statusColorClass = 'bg-status-offline';
                addTerminalLog(`${server.name}: Offline`, 'error');
            }
        }

        statusDot.className = `status-dot ${statusColorClass}`;
        statusTextElement.textContent = statusText;
        statusTextElement.classList.toggle('text-text-muted', !isActive);
        statusTextElement.classList.toggle('text-status-active', isActive);

        serverItem.classList.toggle('disabled', !isActive);
         if(currentSelectedServer === key) {
             serverItem.classList.toggle('border-primary', isActive);
             serverItem.classList.toggle('border-input-border', !isActive);
         } else {
             serverItem.classList.remove('border-primary');
             serverItem.classList.add('border-input-border');
         }

        if (!isActive && currentSelectedServer === key) {
            currentSelectedServer = null;
            selectedServerInput.value = '';
            serverSelectButtonText.textContent = 'Select a Server...';
            serverItem.classList.remove('border-primary', 'bg-primary/10');
            serverItem.classList.add('border-input-border', 'bg-input-bg');
            validateForm();
            addTerminalLog(`Server ${server.name} went offline`, 'error');
        } else if (isActive && currentSelectedServer === key) {
            serverSelectButtonText.textContent = `${server.name} (Active)`;
            serverItem.classList.remove('border-input-border', 'bg-input-bg');
            serverItem.classList.add('border-primary', 'bg-primary/10');
        }
        return isActive;
    });

    await Promise.all(statusPromises);

    if (buttonText.textContent !== 'Submitting...') {
        if (!oneServerActive) {
            updateButtonState('All Servers Offline', 'alert-triangle', false, true);
            if (currentSelectedServer) {
                 currentSelectedServer = null;
                 selectedServerInput.value = '';
                 serverSelectButtonText.textContent = 'Select a Server...';
            }
        } else {
             validateForm();
        }
    }

    clearInterval(intervalCheck);
    intervalCheck = setInterval(checkServerStatus, 60000);
    addTerminalLog('Server status check completed', 'info');
}

function updateButtonState(text, iconName, enabled, isError = false) {
    buttonText.textContent = text;
    buttonIcon.innerHTML = `<i data-lucide="${iconName}" class="w-5 h-5 ${iconName === 'loader-circle' ? 'animate-spin' : ''}"></i>`;
    lucide.createIcons();

    const shouldBeEnabled = enabled && selectedServerInput.value !== '';
    submitButton.disabled = !shouldBeEnabled;

    if (isError) {
         submitButton.style.backgroundColor = '#991b1b';
    } else if (shouldBeEnabled) {
        submitButton.classList.add('bg-primary', 'hover:bg-primary-darker');
    } else {
         submitButton.classList.add('bg-primary');
    }
}

function validateForm() {
    const serverSelected = selectedServerInput.value !== '';
     const anyServerActive = Array.from(serverListContainer?.querySelectorAll('.server-item:not(.disabled)') || []).length > 0;

     const allInputsFilled = Array.from(form.elements).every(el => {
         if (el.required) {
             return el.value && el.value.trim() !== '';
         }
         return true;
     });

     // Check share limits for non-premium users
     if (!currentUser.isPremium) {
         const amountInput = document.getElementById('amounts');
         const requestedShares = parseInt(amountInput.value) || 0;
         const remainingShares = currentUser.maxShares - currentUser.sharesUsed;
         const today = new Date().toISOString().split('T')[0];
         
         // Reset shares if it's a new day
         if (currentUser.lastShareDate !== today) {
             currentUser.sharesUsed = 0;
             currentUser.lastShareDate = today;
             localStorage.setItem('currentUser', JSON.stringify(currentUser));
         }
         
         if (requestedShares > remainingShares) {
             showModal(`You only have ${remainingShares} shares remaining today. Upgrade to premium for unlimited shares.`, 'error');
             updateButtonState(`Limit: ${remainingShares} left`, 'alert-circle', false, false);
             return;
         }
     }

     if (!anyServerActive) {
         updateButtonState('All Servers Offline', 'alert-triangle', false, true);
     } else if (!serverSelected) {
         updateButtonState('Select Server First', 'alert-circle', false, false);
     } else if (!allInputsFilled) {
         updateButtonState('Fill All Fields', 'edit-3', false, false);
     } else {
         updateButtonState('Start Boosting', 'rocket', true, false);
     }
 }

async function handleFormSubmit(event) {
    event.preventDefault();

     validateForm();
     if (submitButton.disabled) {
         if (!selectedServerInput.value) {
             showModal('Please select an active server first.', 'error');
         } else {
             showModal('Please fill in all required fields.', 'error');
         }
         return;
     }

    const serverValue = selectedServerInput.value;
    const url = document.getElementById('urls').value;
    const amount = document.getElementById('amounts').value;
    const cookie = document.getElementById('cookies').value;
    const interval = document.getElementById('intervals').value;
     if (!url || !amount || !cookie || !interval || !serverValue) {
         showModal('Please fill in all required fields and select a server.', 'error');
         validateForm();
         return;
     }

    updateButtonState('Submitting...', 'loader-circle', false);
    showModal('Submitting request...', 'loading');
    addTerminalLog(`Submitting share request for ${amount} shares...`, 'info');

    try {
        const serverUrl = serverDefinitions[serverValue]?.url;
        if (!serverUrl) throw new Error("Selected server definition not found.");

        const response = await fetch(`${serverUrl}/api/submit`, {
            method: 'POST',
            body: JSON.stringify({
                cookie: cookie,
                url: url,
                amount: parseInt(amount),
                interval: parseInt(interval)
            }),
            headers: { 'Content-Type': 'application/json' },
            signal: AbortSignal.timeout(20000)
        });

        let data;
        try {
             const contentType = response.headers.get("content-type");
             if (contentType && contentType.indexOf("application/json") !== -1) {
                 data = await response.json();
             } else {
                 const textResponse = await response.text();
                 throw new Error(textResponse || `Server returned status ${response.status}`);
             }
        } catch (parseError) {
             throw new Error(`Failed to process server response. Status: ${response.status}. ${parseError.message}`);
        }

        if (!response.ok) {
            throw new Error(data?.message || response.statusText || `Server error: ${response.status}`);
        }

        const successMessage = data.message || 'Submitted successfully! Processing started.';
        showModal(successMessage, 'success');
        
        // Update share count for non-premium users
        if (!currentUser.isPremium) {
            currentUser.sharesUsed += parseInt(amount);
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            updatePremiumUI();
        }
        
        sharesSentCount += parseInt(amount);
        addTerminalLog(successMessage, 'success');
        addTerminalLog(`Total shares sent: ${sharesSentCount}`, 'info');
        
        form.reset();
        selectedServerInput.value = '';
        serverSelectButtonText.textContent = 'Select a Server...';
        currentSelectedServer = null;
         const selectedItem = serverListContainer.querySelector('.border-primary');
         if (selectedItem) {
             selectedItem.classList.remove('border-primary', 'bg-primary/10');
             selectedItem.classList.add('border-input-border', 'bg-input-bg');
         }

    } catch (error) {
        console.error("Submission Error:", error);
        const errorMessage = error.name === 'TimeoutError'
            ? 'Request timed out. Server might be busy or unresponsive.'
            : `Error: ${error.message}`;
        showModal(errorMessage, 'error');
        addTerminalLog(errorMessage, 'error');
    } finally {
         if (responseModalIconElement.querySelector('[data-lucide="loader-circle"]')) {
             responseModal.style.display = 'none';
         }
         validateForm();
    }
}

function showModal(message, type = 'info') {
     responseMessageElement.textContent = message;
     responseModal.style.display = 'flex';
     const modalContent = responseModal.querySelector('.modal-content');
     modalContent.className = 'modal-content flex flex-col items-center gap-3';

     let iconName = 'info';
     let iconColorClass = 'text-primary';

     if (type === 'success') {
         modalContent.classList.add('success');
         iconName = 'check-circle-2';
         iconColorClass = 'text-status-active';
         addTerminalLog(message, 'success');
     } else if (type === 'error') {
         modalContent.classList.add('error');
         iconName = 'alert-circle';
         iconColorClass = 'text-status-offline';
         addTerminalLog(message, 'error');
     } else if (type === 'loading') {
         iconName = 'loader-circle';
         iconColorClass = 'text-primary';
         responseModalIconElement.innerHTML = `<i data-lucide="${iconName}" class="w-8 h-8 ${iconColorClass} animate-spin"></i>`;
         lucide.createIcons();
         return;
     }

     responseModalIconElement.innerHTML = `<i data-lucide="${iconName}" class="w-8 h-8 ${iconColorClass}"></i>`;
     lucide.createIcons();

     setTimeout(() => {
         if (responseModal.style.display === 'flex') {
             responseModal.style.display = 'none';
         }
     }, 4000);
 }

function setActiveSection(sectionName) {
    const targetSectionId = `${sectionName}-section`;
    const targetSection = document.getElementById(targetSectionId);

    contentSections.forEach(section => {
        section.classList.remove('active');
        if (section.id === 'admin-section' && currentUser.profileType !== 'admin') {
            section.classList.add('hidden');
        }
    });
    
    if (targetSection) {
        targetSection.classList.add('active');
        if (sectionName === 'admin') {
            loadUsers();
        }
    }

    navItems.forEach((navItem, index) => {
        if (navItem.dataset.section === sectionName) {
            navItem.classList.remove('text-text-muted');
            navItem.classList.add('text-primary');
            if (navIndicator) {
                 navIndicator.style.transform = `translateX(${index * 100}%)`;
            }
        } else {
            navItem.classList.remove('text-primary');
            navItem.classList.add('text-text-muted');
        }
    });

    sideMenuItems.forEach((sideItem) => {
         const iconElement = sideItem.querySelector('i[data-lucide]') || sideItem.querySelector('svg');

         if (sideItem.dataset.section === sectionName) {
             sideItem.classList.add('text-text-main', 'bg-primary/10', 'font-medium');
             sideItem.classList.remove('text-text-muted');
             if (iconElement) {
                iconElement.classList.add('text-primary');
             }
         } else {
             sideItem.classList.remove('text-text-main', 'bg-primary/10', 'font-medium');
             sideItem.classList.add('text-text-muted');
             if (iconElement) {
                iconElement.classList.remove('text-primary');
             }
         }
     });

     closeSideMenu();
}

function openSideMenu() {
    menuOverlay.classList.remove('hidden');
    requestAnimationFrame(() => {
        sideMenu.classList.add('open');
        menuOverlay.classList.remove('opacity-0');
    });
}

function closeSideMenu() {
    sideMenu.classList.remove('open');
    menuOverlay.classList.add('opacity-0');
    setTimeout(() => {
         menuOverlay.classList.add('hidden');
     }, 300);
}

function toggleTerminal() {
    if (terminal.style.display === 'block') {
        terminal.style.display = 'none';
        terminalToggle.classList.remove('active');
    } else {
        terminal.style.display = 'block';
        terminalToggle.classList.add('active');
    }
}

function addTerminalLog(message, type = 'info') {
    const now = new Date();
    const timeString = now.toLocaleTimeString();
    const logElement = document.createElement('div');
    logElement.className = `terminal-line ${type}`;
    logElement.innerHTML = `
        <span class="terminal-timestamp">[${timeString}]</span>
        <span class="terminal-message">${message}</span>
    `;
    terminalContent.appendChild(logElement);
    terminalContent.scrollTop = terminalContent.scrollHeight;
}

// Post Functions
function loadPosts() {
    // In a real app, you would fetch posts from a server
    posts = [
        {
            id: '1',
            userId: 'admin1',
            userName: 'Admin User',
            content: 'Welcome to Share Boost! Post your thoughts and interact with others here.',
            image: null,
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            likes: 15,
            comments: 3,
            isLiked: false
        }
    ];
    
    renderPosts();
}

function renderPosts() {
    postsContainer.innerHTML = '';
    
    posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'post-card';
        postElement.innerHTML = `
            <div class="post-header">
                <div class="post-avatar">
                    <i data-lucide="user" class="w-5 h-5"></i>
                </div>
                <div>
                    <div class="post-user">${post.userName}</div>
                    <div class="post-time">${formatPostTime(post.timestamp)}</div>
                </div>
            </div>
            <div class="post-content">${post.content}</div>
            ${post.image ? `<img src="${post.image}" class="post-image" alt="Post image">` : ''}
            <div class="post-actions">
                <div class="post-action ${post.isLiked ? 'active' : ''}" data-post-id="${post.id}" data-action="like">
                    <i data-lucide="heart" class="w-4 h-4 ${post.isLiked ? 'fill-current' : ''}"></i>
                    <span>${post.likes}</span>
                </div>
                <div class="post-action" data-post-id="${post.id}" data-action="comment">
                    <i data-lucide="message-circle" class="w-4 h-4"></i>
                    <span>${post.comments}</span>
                </div>
            </div>
        `;
        postsContainer.appendChild(postElement);
    });
    
    lucide.createIcons();
    
    // Add event listeners for post actions
    document.querySelectorAll('.post-action[data-action="like"]').forEach(button => {
        button.addEventListener('click', handleLikePost);
    });
    
    document.querySelectorAll('.post-action[data-action="comment"]').forEach(button => {
        button.addEventListener('click', handleCommentPost);
    });
}

function formatPostTime(timestamp) {
    const now = new Date();
    const postTime = new Date(timestamp);
    const diff = now - postTime;
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
}

async function handlePostSubmit(e) {
    e.preventDefault();
    const content = document.getElementById('post-content').value;
    const imageInput = document.getElementById('post-image');
    
    if (!content.trim()) {
        showModal('Post content cannot be empty', 'error');
        return;
    }
    
    // In a real app, you would upload the image to a server
    let imageUrl = null;
    if (imageInput.files.length > 0) {
        const file = imageInput.files[0];
        imageUrl = URL.createObjectURL(file);
    }
    
    const newPost = {
        id: Date.now().toString(),
        userId: currentUser.id,
        userName: currentUser.name,
        content,
        image: imageUrl,
        timestamp: new Date().toISOString(),
        likes: 0,
        comments: 0,
        isLiked: false
    };
    
    posts.unshift(newPost);
    renderPosts();
    postForm.reset();
    showModal('Post created successfully!', 'success');
    addTerminalLog('New post created', 'success');
}

function handleLikePost(e) {
    const postId = this.getAttribute('data-post-id');
    const post = posts.find(p => p.id === postId);
    
    if (post) {
        post.isLiked = !post.isLiked;
        post.likes += post.isLiked ? 1 : -1;
        renderPosts();
    }
}

function handleCommentPost() {
    const postId = this.getAttribute('data-post-id');
    showModal('Comment functionality coming soon!', 'info');
    addTerminalLog(`User attempted to comment on post ${postId}`, 'info');
}

// Admin Functions
function loadUsers() {
    // In a real app, you would fetch users from a server
    if (users.length === 0) {
        users = [
            {
                id: 'admin1',
                name: 'Admin User',
                email: 'admin@shareboost.com',
                password: 'admin123',
                profileType: 'admin',
                isPremium: true,
                sharesUsed: 0,
                maxShares: 0,
                lastShareDate: new Date().toISOString().split('T')[0]
            },
            {
                id: 'user1',
                name: 'Regular User',
                email: 'user@example.com',
                password: 'password123',
                profileType: 'regular',
                isPremium: false,
                sharesUsed: 150,
                maxShares: 300,
                lastShareDate: new Date().toISOString().split('T')[0]
            }
        ];
    }
    
    if (currentUser && currentUser.profileType === 'admin') {
        renderUsers(users);
    }
}

function renderUsers(usersToRender) {
    usersList.innerHTML = '';
    
    usersToRender.forEach(user => {
        if (user.id === currentUser.id) return; // Don't show current admin in the list
        
        const userElement = document.createElement('div');
        userElement.className = `user-card ${user.isPremium ? 'selected' : ''}`;
        userElement.dataset.userId = user.id;
        userElement.innerHTML = `
            <div class="user-info">
                <div class="user-avatar">
                    <i data-lucide="user" class="w-4 h-4"></i>
                </div>
                <div class="user-details">
                    <div class="user-name">${user.name}</div>
                    <div class="user-email">${user.email}</div>
                </div>
            </div>
            <div class="user-status ${user.isPremium ? 'premium' : 'regular'}">
                ${user.isPremium ? 'Premium' : 'Regular'}
            </div>
        `;
        
        userElement.addEventListener('click', () => selectUser(user));
        usersList.appendChild(userElement);
    });
    
    lucide.createIcons();
}

function selectUser(user) {
    selectedUserEmail.textContent = user.email;
    userActions.classList.remove('hidden');
    
    // Update buttons based on user status
    makePremiumButton.classList.toggle('hidden', user.isPremium);
    removePremiumButton.classList.toggle('hidden', !user.isPremium);
    
    // Highlight selected user
    document.querySelectorAll('.user-card').forEach(card => {
        card.classList.remove('selected');
    });
    document.querySelector(`.user-card[data-user-id="${user.id}"]`).classList.add('selected');
}

function searchUsers() {
    const searchTerm = userSearch.value.toLowerCase();
    if (!searchTerm) {
        renderUsers(users);
        return;
    }
    
    const filteredUsers = users.filter(user => 
        user.name.toLowerCase().includes(searchTerm) || 
        user.email.toLowerCase().includes(searchTerm)
    );
    
    renderUsers(filteredUsers);
}

function updateUserPremiumStatus(makePremium) {
    const userEmail = selectedUserEmail.textContent;
    const user = users.find(u => u.email === userEmail);
    
    if (user) {
        user.isPremium = makePremium;
        if (makePremium) {
            user.maxShares = 0; // Unlimited
        } else {
            user.maxShares = 300; // Regular limit
        }
        
        // Save to "database"
        localStorage.setItem('users', JSON.stringify(users));
        
        // Update UI
        renderUsers(users);
        showModal(`User ${makePremium ? 'upgraded to Premium' : 'downgraded to Regular'}`, 'success');
        addTerminalLog(`User ${user.email} ${makePremium ? 'made Premium' : 'made Regular'}`, 'success');
        
        // If updating current user, refresh their UI
        if (currentUser.email === user.email) {
            currentUser.isPremium = makePremium;
            currentUser.maxShares = makePremium ? 0 : 300;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            updatePremiumUI();
        }
    }
}
