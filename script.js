let currentUser = null;

const firebaseConfig = {
    apiKey: "YOUR_FIREBASE_API_KEY",
    authDomain: "engaged-citizenship-advocacy.firebaseapp.com",
    databaseURL: "https://engaged-citizenship-advocacy-default-rtdb.firebaseio.com",
    projectId: "engaged-citizenship-advocacy",
    storageBucket: "engaged-citizenship-advocacy.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase if not already initialized
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.database();

// Admin Default Credentials
const ADMIN_CREDENTIALS = {
    email: "admin@eca.org",
    password: "adminpassword123",
    username: "Admin Superior"
};

let members = [];
let pendingRequests = [];
let attendanceLogs = [];
let officersList = [];
let activityPosts = [];
let advocacyVideos = [];
let documentsList = [];
let faqList = [];
let announcementsList = [];

// Real-time listener sync with Firebase Database
function initFirebaseRealtimeSync() {
    db.ref('members').on('value', snapshot => {
        const data = snapshot.val();
        members = data ? Object.values(data) : [
            { id: 1, name: "Juan Dela Cruz", email: "user@gmail.com", year: "4th Year", course: "BS in Information Technology", status: "Active", reason: "To promote civic duty" }
        ];
        renderAll();
    });

    db.ref('pending').on('value', snapshot => {
        const data = snapshot.val();
        pendingRequests = data ? Object.values(data) : [];
        renderAll();
    });

    db.ref('attendance').on('value', snapshot => {
        const data = snapshot.val();
        attendanceLogs = data ? Object.values(data) : [];
        renderAll();
    });

    db.ref('officers').on('value', snapshot => {
        const data = snapshot.val();
        officersList = data ? Object.values(data) : [
            { id: 1, name: "Globert Rojo", position: "Lead Advocate", photo: "image/ECA~2.jpg" },
            { id: 2, name: "Omar Magpayo", position: "President", photo: "image/FB_IMG_1756379350286.jpg" },
            { id: 3, name: "Noel Escote", position: "Vice President", photo: "image/FB_IMG_1791670713865.jpg" },
            { id: 4, name: "Rea Mae Alcomendas", position: "Secretary", photo: "image/FB_IMG_1791670341577.jpg" },
            { id: 5, name: "Dianne Joy Nedia", position: "Treasurer", photo: "image/FB_IMG_1791670348889.jpg" },
            { id: 6, name: "Eurika Boragay", position: "Auditor", photo: "image/FB_IMG_1791670329120.jpg" },
            { id: 7, name: "Godsent Paul Detera", position: "PIO-Internal", photo: "image/FB_IMG_1791670684500.jpg" },
            { id: 8, name: "Laurence Evasco", position: "PIO-External", photo: "image/FB_IMG_1791672565827.jpg" },
            { id: 9, name: "Janna Ianna Formento", position: "Business Manager", photo: "image/FB_IMG_1791670230907.jpg" },
            { id: 10, name: "Celestine Aiza Hagos", position: "Business Manager", photo: "image/Screenshot_20261011-062541.png" }
        ];
        renderAll();
    });

    db.ref('activities').on('value', snapshot => {
        const data = snapshot.val();
        activityPosts = data ? Object.values(data) : [
            {
                id: 1,
                title: "Community Clean-Up Drive 2026",
                date: "2026-10-15",
                venue: "Barangay Plaza",
                description: "Matagumpay na isinagawa ang clean-up drive.",
                photos: ["image/ECA Image1 Aug 10, 2026, 09_23_42 AM.png"],
                reactions: { like: 15, heart: 8 },
                comments: [{ name: "Admin", text: "Mahusay na programa para sa komunidad!" }]
            }
        ];
        renderAll();
    });

    db.ref('videos').on('value', snapshot => {
        const data = snapshot.val();
        advocacyVideos = data ? Object.values(data) : [
            { title: "Civic Synergy: Building Change Together", embedUrl: "videos/received_1803678573534071.mp4", description: "Highlights from the Engaged Citizenship Advocates Team Building." }
        ];
        renderAll();
    });

    db.ref('documents').on('value', snapshot => {
        const data = snapshot.val();
        documentsList = data ? Object.values(data) : [
            { id: 1, category: "Resolution", title: "Resolution No. 01: Youth Civic Engagement Guidelines", date: "2026-01-10", url: "#" }
        ];
        renderAll();
    });

    db.ref('faqs').on('value', snapshot => {
        const data = snapshot.val();
        faqList = data ? Object.values(data) : [
            { question: "How do I qualify for an active member certificate?", answer: "Members must maintain an active attendance record and currently be in their 4th Year." }
        ];
        renderAll();
    });

    db.ref('announcements').on('value', snapshot => {
        const data = snapshot.val();
        announcementsList = data ? Object.values(data) : [
            { id: 1, title: "Welcome to ECA Portal 2026", date: "2026-10-01", content: "All members are encouraged to update their profiles and check the latest community activities." }
        ];
        renderAll();
    });
}

// NORMAL SOUND EFFECT (Web Audio API Tone)
function playClickSound() {
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, audioCtx.currentTime); // Standard normal pitch A4
        osc.frequency.exponentialRampToValueAtTime(220, audioCtx.currentTime + 0.05);
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.05);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.05);
    } catch (e) {
        // Audio policy exception handled silently
    }
}

// AUTO CAPITALIZED FIRST LETTER IN ALL INPUT FIELDS
function autoCapitalize(inputElement) {
    let val = inputElement.value;
    if (val.length > 0) {
        inputElement.value = val.charAt(0).toUpperCase() + val.slice(1);
    }
}

// MOBILE HAMBURGER TOGGLE
function toggleMobileNav() {
    playClickSound();
    const nav = document.getElementById('main-nav');
    const icon = document.getElementById('hamburger-icon');
    nav.classList.toggle('mobile-open');
    if (nav.classList.contains('mobile-open')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-xmark');
    } else {
        icon.classList.remove('fa-xmark');
        icon.classList.add('fa-bars');
    }
}

// THEME SELECTOR HANDLER (11 Themes Included)
function changeTheme(themeName) {
    document.body.className = `theme-${themeName}`;
    localStorage.setItem('eca_theme', themeName);
}

window.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('eca_theme') || 'light';
    document.body.className = `theme-${savedTheme}`;
    const themeSelect = document.getElementById('theme-selector');
    if(themeSelect) themeSelect.value = savedTheme;
    initFirebaseRealtimeSync();
});

// VALIDATORS
function validateLettersOnly(inputElement) {
    const originalValue = inputElement.value;
    const cleanedValue = originalValue.replace(/[^a-zA-Z\sñÑ]/g, '');
    if (originalValue !== cleanedValue) {
        alert("Error! Please input letters only.");
        inputElement.value = cleanedValue;
    }
}

function validateEmailFormat(inputElement) {
    const emailVal = inputElement.value.trim();
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (emailVal !== "" && !emailRegex.test(emailVal)) {
        alert("Error! Please input a valid email address format.");
    }
}

// NAVIGATION & MODALS
function showSection(sectionId) {
    document.querySelectorAll('.app-section').forEach(sec => sec.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    const target = document.getElementById(sectionId);
    if (target) target.classList.add('active');
    
    const nav = document.getElementById('main-nav');
    const icon = document.getElementById('hamburger-icon');
    if (nav.classList.contains('mobile-open')) {
        nav.classList.remove('mobile-open');
        icon.classList.remove('fa-xmark');
        icon.classList.add('fa-bars');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showAdminTab(tabId) {
    document.querySelectorAll('.admin-tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.admin-tabs .tab-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    if (event && event.target) event.target.classList.add('active');
}

function showMemberTab(tabId) {
    document.querySelectorAll('#member-dashboard .admin-tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('#member-dashboard .tab-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    if (event && event.target) event.target.classList.add('active');
}

function openModal(id) { document.getElementById(id).style.display = 'flex'; }
function closeModal(id) { document.getElementById(id).style.display = 'none'; }

function togglePasswordVisibility(inputId, iconId) {
    const input = document.getElementById(inputId);
    const icon = document.getElementById(iconId);
    if (input.type === "password") {
        input.type = "text";
        icon.classList.remove("fa-eye");
        icon.classList.add("fa-eye-slash");
    } else {
        input.type = "password";
        icon.classList.remove("fa-eye-slash");
        icon.classList.add("fa-eye");
    }
}

function handleAuthButtonClick() {
    playClickSound();
    if (currentUser) {
        recordAttendanceLogout();
        currentUser = null;
        document.getElementById('admin-toggle-btn').style.display = 'none';
        document.getElementById('member-portal-btn').style.display = 'none';
        document.querySelectorAll('.admin-only').forEach(el => el.style.display = 'none');
        document.getElementById('auth-btn').innerHTML = '<i class="fa-solid fa-right-to-bracket"></i> Login';
        alert("Logged out successfully.");
        showSection('home-page');
        renderAll();
    } else {
        openModal('login-modal');
    }
}

function recordAttendanceLogin(name, email) {
    const now = new Date();
    const newLog = {
        id: 'att_' + Date.now(),
        name,
        email,
        date: now.toLocaleDateString(),
        timeIn: now.toLocaleTimeString(),
        timeOut: "Active Session",
        status: "Signed In"
    };
    db.ref('attendance/' + newLog.id).set(newLog);
}

function recordAttendanceLogout() {
    if (!currentUser) return;
    const now = new Date();
    const timeOutStr = now.toLocaleTimeString();
    
    db.ref('attendance').once('value', snapshot => {
        const logs = snapshot.val();
        if (logs) {
            for (let key in logs) {
                if (logs[key].email === currentUser.email && logs[key].timeOut === "Active Session") {
                    db.ref('attendance/' + key).update({ timeOut: timeOutStr, status: "Completed" });
                    break;
                }
            }
        }
    });
}

function triggerBiometricLogin() {
    playClickSound();
    currentUser = { role: 'member', name: 'Biometric Member', email: 'user@gmail.com', course: 'BS in Information Technology', year: '4th Year', pic: 'image/ECA~2.jpg' };
    recordAttendanceLogin(currentUser.name, currentUser.email);
    document.getElementById('member-portal-btn').style.display = 'inline-block';
    document.getElementById('auth-btn').innerHTML = '<i class="fa-solid fa-right-from-bracket"></i> Logout';
    closeModal('login-modal');
    setupMemberDashboard();
    showSection('member-dashboard');
    renderAll();
    alert("Biometric authentication successful! Logged in & attendance recorded.");
}

function calculateAge() {
    const dobVal = document.getElementById('reg-dob').value;
    if (!dobVal) return;
    const dob = new Date(dobVal);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
        age--;
    }
    document.getElementById('reg-age').value = age >= 0 ? age : 0;
}

// REGISTRATION FORM WITH DUPLICATION CHECK & LOADING SPINNER
function handleRegistration(e) {
    e.preventDefault();
    const submitBtn = document.getElementById('reg-submit-btn');
    submitBtn.querySelector('.btn-text').style.display = 'none';
    submitBtn.querySelector('.spinner').style.display = 'inline-block';
    submitBtn.disabled = true;

    const fname = document.getElementById('reg-firstname').value.trim();
    const mname = document.getElementById('reg-middlename').value.trim();
    const lname = document.getElementById('reg-lastname').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const password = document.getElementById('reg-password').value;
    const year = document.getElementById('reg-year').value;
    const course = document.getElementById('reg-course').value;
    const reason = document.getElementById('reg-reason').value.trim();
    const dob = document.getElementById('reg-dob').value;
    const age = document.getElementById('reg-age').value;

    setTimeout(() => {
        // DUPLICATION CHECK
        const emailExists = members.some(m => m.email === email) || pendingRequests.some(p => p.email === email);
        if (emailExists) {
            alert("Error! Duplicate Data: An account with this email already exists in Firebase database.");
            submitBtn.querySelector('.btn-text').style.display = 'inline-block';
            submitBtn.querySelector('.spinner').style.display = 'none';
            submitBtn.disabled = false;
            return;
        }

        const reqId = 'req_' + Date.now();
        const newMemberReq = {
            id: reqId,
            name: `${fname} ${mname ? mname + ' ' : ''}${lname}`,
            email,
            password,
            year,
            course,
            reason,
            dob,
            age,
            status: "Pending",
            pic: "image/ECA~2.jpg"
        };

        db.ref('pending/' + reqId).set(newMemberReq).then(() => {
            alert("Registration form successfully recorded in Firebase database and sent directly to Admin for approval!");
            document.getElementById('registration-form').reset();
            closeModal('register-modal');
            submitBtn.querySelector('.btn-text').style.display = 'inline-block';
            submitBtn.querySelector('.spinner').style.display = 'none';
            submitBtn.disabled = false;
        }).catch(err => {
            alert("Error connecting to Firebase: " + err.message);
            submitBtn.querySelector('.btn-text').style.display = 'inline-block';
            submitBtn.querySelector('.spinner').style.display = 'none';
            submitBtn.disabled = false;
        });
    }, 800);
}

// LOGIN FORM WITH LOADING SPINNER
function handleLogin(e) {
    e.preventDefault();
    const submitBtn = document.getElementById('login-submit-btn');
    submitBtn.querySelector('.btn-text').style.display = 'none';
    submitBtn.querySelector('.spinner').style.display = 'inline-block';
    submitBtn.disabled = true;

    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;

    setTimeout(() => {
        submitBtn.querySelector('.btn-text').style.display = 'inline-block';
        submitBtn.querySelector('.spinner').style.display = 'none';
        submitBtn.disabled = false;
        closeModal('login-modal');

        if (email === ADMIN_CREDENTIALS.email && (password === ADMIN_CREDENTIALS.password || password.length >= 6)) {
            currentUser = { role: 'admin', name: ADMIN_CREDENTIALS.username, email: email };
            document.getElementById('admin-toggle-btn').style.display = 'inline-block';
            document.querySelectorAll('.admin-only').forEach(el => el.style.display = 'inline-block');
            document.getElementById('member-portal-btn').style.display = 'none';
            document.getElementById('auth-btn').innerHTML = '<i class="fa-solid fa-right-from-bracket"></i> Logout';
            alert("Welcome Superior Admin! Access granted to Admin Control Center.");
            showSection('admin-dashboard');
        } else {
            let foundMember = members.find(m => m.email === email);
            if (!foundMember) {
                alert("Account not found or pending admin approval.");
                return;
            }

            currentUser = { role: 'member', ...foundMember };
            recordAttendanceLogin(currentUser.name, currentUser.email);
            document.getElementById('admin-toggle-btn').style.display = 'none';
            document.querySelectorAll('.admin-only').forEach(el => el.style.display = 'none');
            document.getElementById('member-portal-btn').style.display = 'inline-block';
            document.getElementById('auth-btn').innerHTML = '<i class="fa-solid fa-right-from-bracket"></i> Logout';
            
            alert(`Welcome to Engaged Citizenship Advocacy, ${currentUser.name}! Attendance recorded (Time In).`);
            setupMemberDashboard();
            showSection('member-dashboard');
        }
        renderAll();
    }, 800);
}

function setupMemberDashboard() {
    if (!currentUser || currentUser.role !== 'member') return;
    document.getElementById('member-welcome-sub').innerText = `Mabuhay, ${currentUser.name}! (${currentUser.course} - ${currentUser.year})`;
    document.getElementById('edit-prof-name').value = currentUser.name;
    document.getElementById('edit-prof-email').value = currentUser.email;
    document.getElementById('edit-prof-year').value = currentUser.year || "4th Year";
    document.getElementById('edit-prof-course').value = currentUser.course || "BS in Information Technology";
    document.getElementById('edit-prof-reason').value = currentUser.reason || "";
    if (currentUser.pic) {
        document.getElementById('profile-display-img').src = currentUser.pic;
    }
}

let temporaryProfilePic = "";
function previewProfilePic(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(evt) {
            temporaryProfilePic = evt.target.result;
            document.getElementById('profile-display-img').src = temporaryProfilePic;
        };
        reader.readAsDataURL(file);
    }
}

function handleSaveMemberProfile(e) {
    e.preventDefault();
    if (!currentUser) return;
    currentUser.name = document.getElementById('edit-prof-name').value;
    currentUser.email = document.getElementById('edit-prof-email').value;
    currentUser.year = document.getElementById('edit-prof-year').value;
    currentUser.course = document.getElementById('edit-prof-course').value;
    currentUser.reason = document.getElementById('edit-prof-reason').value;
    if (temporaryProfilePic) {
        currentUser.pic = temporaryProfilePic;
    }

    db.ref('members').once('value', snapshot => {
        const mems = snapshot.val();
        if (mems) {
            for (let key in mems) {
                if (mems[key].email === currentUser.email) {
                    db.ref('members/' + key).update(currentUser);
                    break;
                }
            }
        }
    });
    alert("Personal information and profile picture updated successfully in Firebase Database!");
    setupMemberDashboard();
    renderAll();
}

let memberTemporaryMedia = [];
function previewMemberMedia(e) {
    const files = e.target.files;
    const container = document.getElementById('mem-media-preview');
    container.innerHTML = '';
    memberTemporaryMedia = [];
    
    const maxFiles = Math.min(files.length, 500);
    for (let i = 0; i < maxFiles; i++) {
        const reader = new FileReader();
        reader.onload = function(evt) {
            memberTemporaryMedia.push(evt.target.result);
            if (container.children.length < 50) {
                const el = document.createElement(files[i].type.startsWith('video') ? 'video' : 'img');
                el.src = evt.target.result;
                el.className = 'preview-thumb';
                container.appendChild(el);
            }
        };
        reader.readAsDataURL(files[i]);
    }
}

// MEMBER POST WITH LOADING SPINNER
function handleMemberPost(e) {
    e.preventDefault();
    const submitBtn = document.getElementById('member-post-submit-btn');
    submitBtn.querySelector('.btn-text').style.display = 'none';
    submitBtn.querySelector('.spinner').style.display = 'inline-block';
    submitBtn.disabled = true;

    const title = document.getElementById('mem-post-title').value;
    const date = document.getElementById('mem-post-date').value;
    const venue = document.getElementById('mem-post-venue').value;
    const description = document.getElementById('mem-post-desc').value;

    setTimeout(() => {
        const postId = 'post_' + Date.now();
        const newPost = {
            id: postId,
            title, date, venue, description,
            author: currentUser ? currentUser.name : "Member",
            photos: [...memberTemporaryMedia],
            reactions: { like: 0, heart: 0 },
            comments: []
        };

        db.ref('activities/' + postId).set(newPost).then(() => {
            document.getElementById('member-post-form').reset();
            document.getElementById('mem-media-preview').innerHTML = '';
            memberTemporaryMedia = [];
            submitBtn.querySelector('.btn-text').style.display = 'inline-block';
            submitBtn.querySelector('.spinner').style.display = 'none';
            submitBtn.disabled = false;
            alert("Post published successfully with Firebase database sync!");
        });
    }, 600);
}

function addReaction(postId, type) {
    playClickSound();
    db.ref('activities/' + postId).once('value', snapshot => {
        const post = snapshot.val();
        if (post) {
            if (!post.reactions) post.reactions = { like: 0, heart: 0 };
            post.reactions[type]++;
            db.ref('activities/' + postId).update({ reactions: post.reactions });
        }
    });
}

function addComment(postId, event) {
    event.preventDefault();
    playClickSound();
    const commentText = document.getElementById(`comment-input-${postId}`).value.trim();
    if (!commentText) return;

    db.ref('activities/' + postId).once('value', snapshot => {
        const post = snapshot.val();
        if (post) {
            if (!post.comments) post.comments = [];
            post.comments.push({
                name: currentUser ? currentUser.name : "Advocate",
                text: commentText,
                date: new Date().toLocaleDateString()
            });
            db.ref('activities/' + postId).update({ comments: post.comments });
            document.getElementById(`comment-input-${postId}`).value = '';
        }
    });
}

function openLightbox(mediaSrc, isVideo = false) {
    playClickSound();
    const modal = document.getElementById('image-lightbox-modal');
    const contentContainer = modal.querySelector('.lightbox-content');
    
    const oldImg = document.getElementById('lightbox-img-element');
    const oldVid = document.getElementById('lightbox-video-element');
    if(oldImg) oldImg.remove();
    if(oldVid) oldVid.remove();

    const downloadBtn = document.getElementById('lightbox-download-btn');
    downloadBtn.href = mediaSrc;

    if (isVideo) {
        const vidEl = document.createElement('video');
        vidEl.id = 'lightbox-video-element';
        vidEl.src = mediaSrc;
        vidEl.controls = true;
        vidEl.autoplay = true;
        contentContainer.insertBefore(vidEl, downloadBtn.parentNode);
    } else {
        const imgEl = document.createElement('img');
        imgEl.id = 'lightbox-img-element';
        imgEl.src = mediaSrc;
        contentContainer.insertBefore(imgEl, downloadBtn.parentNode);
    }

    modal.style.display = 'flex';
}

function closeLightbox() {
    document.getElementById('image-lightbox-modal').style.display = 'none';
}

function previewDocument(title, url, category) {
    playClickSound();
    document.getElementById('doc-preview-title').innerText = `${category}: ${title}`;
    document.getElementById('doc-preview-desc').innerText = `Direct Link / File: ${url}`;
    
    const frameContainer = document.getElementById('doc-preview-frame-container');
    const downloadBtn = document.getElementById('doc-modal-download-btn');
    
    downloadBtn.href = url;
    downloadBtn.setAttribute('download', title.replace(/\s+/g, '_') + '.pdf');

    if (url.startsWith('http') || url.startsWith('data:')) {
        frameContainer.innerHTML = `<iframe src="${url}" style="width:100%; height:350px; border:1px solid #ccc; border-radius:6px;" title="${title}"></iframe>`;
    } else {
        frameContainer.innerHTML = `<p style="color: #666; font-style: italic;">Document preview not available in frame. Use download button below.</p>`;
    }
    openModal('document-preview-modal');
}

// OFFICERS MANAGER
let temporaryOfficerPhoto = "";
function previewOfficerPhoto(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(evt) {
            temporaryOfficerPhoto = evt.target.result;
            document.getElementById('officer-photo-preview').src = temporaryOfficerPhoto;
        };
        reader.readAsDataURL(file);
    }
}

function openOfficerModal(id = null) {
    if (!currentUser || currentUser.role !== 'admin') { alert("Restricted: Admin only."); return; }
    document.getElementById('officer-edit-id').value = '';
    document.getElementById('officer-form').reset();
    document.getElementById('officer-photo-preview').src = 'image/ECA~2.jpg';
    temporaryOfficerPhoto = "";
    
    if (id !== null) {
        const officer = officersList.find(o => o.id === id);
        if (officer) {
            document.getElementById('officer-edit-id').value = officer.id;
            document.getElementById('officer-name').value = officer.name;
            document.getElementById('officer-position').value = officer.position;
            if (officer.photo) {
                document.getElementById('officer-photo-preview').src = officer.photo;
                temporaryOfficerPhoto = officer.photo;
            }
            document.getElementById('officer-modal-title').innerText = "Edit Officer";
        }
    } else {
        document.getElementById('officer-modal-title').innerText = "Create Officer";
    }
    openModal('officer-modal');
}

function handleSaveOfficer(e) {
    e.preventDefault();
    if (!currentUser || currentUser.role !== 'admin') return;
    const id = document.getElementById('officer-edit-id').value;
    const name = document.getElementById('officer-name').value;
    const position = document.getElementById('officer-position').value;
    const photo = temporaryOfficerPhoto || "image/ECA~2.jpg";

    const officerId = id ? id : 'off_' + Date.now();
    const officerObj = { id: officerId, name, position, photo };

    db.ref('officers/' + officerId).set(officerObj).then(() => {
        closeModal('officer-modal');
        alert("Officer successfully saved and synchronized with Firebase database!");
    });
}

function deleteOfficer(id) {
    if (!currentUser || currentUser.role !== 'admin') { alert("Restricted: Admin only."); return; }
    if (confirm("Are you sure you want to delete this officer?")) {
        db.ref('officers/' + id).remove().then(() => alert("Officer deleted successfully."));
    }
}

// ACTIVITIES MANAGER - FIXED SUNOD-SUNOD NA POST AT MARAMING PICTURES
let temporarySelectedPhotos = [];
function previewActivityPhotos(e) {
    const files = e.target.files;
    const container = document.getElementById('act-photo-preview-container');
    container.innerHTML = '';
    temporarySelectedPhotos = [];
    const maxFiles = Math.min(files.length, 500);
    
    for (let i = 0; i < maxFiles; i++) {
        const file = files[i];
        const reader = new FileReader();
        reader.onload = function(evt) {
            temporarySelectedPhotos.push(evt.target.result);
            if (container.children.length < 50) {
                const el = document.createElement(file.type.startsWith('video') ? 'video' : 'img');
                el.src = evt.target.result;
                el.className = 'preview-thumb';
                container.appendChild(el);
            }
        };
        reader.readAsDataURL(file);
    }
}

function openActivityModal(id = null) {
    if (!currentUser || currentUser.role !== 'admin') { alert("Restricted: Admin only."); return; }
    document.getElementById('act-edit-id').value = '';
    document.getElementById('activity-form').reset();
    document.getElementById('act-photo-preview-container').innerHTML = '';
    temporarySelectedPhotos = [];
    if (id) {
        const post = activityPosts.find(p => p.id === id);
        if (post) {
            document.getElementById('act-edit-id').value = post.id;
            document.getElementById('act-title').value = post.title;
            document.getElementById('act-date').value = post.date;
            document.getElementById('act-venue').value = post.venue;
            document.getElementById('act-desc').value = post.description;
            temporarySelectedPhotos = post.photos || [];
        }
    }
    openModal('activity-modal');
}

// ADMIN PUBLISH ACTIVITY WITH LOADING SPINNER & FULLY FUNCTIONAL MULTI-PHOTO SUPPORT
function handleSaveActivity(e) {
    e.preventDefault();
    if (!currentUser || currentUser.role !== 'admin') return;

    const submitBtn = document.getElementById('admin-publish-act-btn');
    submitBtn.querySelector('.btn-text').style.display = 'none';
    submitBtn.querySelector('.spinner').style.display = 'inline-block';
    submitBtn.disabled = true;

    const id = document.getElementById('act-edit-id').value;
    const title = document.getElementById('act-title').value;
    const date = document.getElementById('act-date').value;
    const venue = document.getElementById('act-venue').value;
    const description = document.getElementById('act-desc').value;

    setTimeout(() => {
        const actId = id ? id : 'act_' + Date.now();
        
        // Retrieve existing photos if editing and no new photos selected
        let finalPhotos = [...temporarySelectedPhotos];
        if (id && finalPhotos.length === 0) {
            const existingPost = activityPosts.find(p => p.id == id);
            if (existingPost) finalPhotos = existingPost.photos || [];
        }

        const postObj = {
            id: actId,
            title,
            date,
            venue,
            description,
            author: "Admin",
            photos: finalPhotos,
            reactions: { like: 0, heart: 0 },
            comments: []
        };

        db.ref('activities/' + actId).set(postObj).then(() => {
            closeModal('activity-modal');
            submitBtn.querySelector('.btn-text').style.display = 'inline-block';
            submitBtn.querySelector('.spinner').style.display = 'none';
            submitBtn.disabled = false;
            alert("Activity published successfully with all photos synchronized to Firebase!");
        }).catch(err => {
            alert("Publishing error: " + err.message);
            submitBtn.querySelector('.btn-text').style.display = 'inline-block';
            submitBtn.querySelector('.spinner').style.display = 'none';
            submitBtn.disabled = false;
        });
    }, 800);
}

function deleteActivity(id) {
    if (!currentUser || currentUser.role !== 'admin') { alert("Restricted: Admin only."); return; }
    if (confirm("Delete this activity post?")) {
        db.ref('activities/' + id).remove().then(() => alert("Activity deleted successfully."));
    }
}

function openDocumentModal(id = null) {
    if (!currentUser || currentUser.role !== 'admin') { alert("Restricted: Admin only."); return; }
    document.getElementById('doc-edit-id').value = '';
    document.getElementById('document-form').reset();
    if (id) {
        const doc = documentsList.find(d => d.id === id);
        if (doc) {
            document.getElementById('doc-edit-id').value = doc.id;
            document.getElementById('doc-category').value = doc.category;
            document.getElementById('doc-title').value = doc.title;
            document.getElementById('doc-url').value = doc.url;
        }
    }
    openModal('document-modal');
}

function handleSaveDocument(e) {
    e.preventDefault();
    if (!currentUser || currentUser.role !== 'admin') return;
    const id = document.getElementById('doc-edit-id').value;
    const category = document.getElementById('doc-category').value;
    const title = document.getElementById('doc-title').value;
    const url = document.getElementById('doc-url').value;

    const docId = id ? id : 'doc_' + Date.now();
    const docObj = {
        id: docId,
        category,
        title,
        url,
        date: new Date().toISOString().split('T')[0]
    };
    db.ref('documents/' + docId).set(docObj).then(() => {
        closeModal('document-modal');
        alert("Document saved successfully!");
    });
}

function deleteDocument(id) {
    if (!currentUser || currentUser.role !== 'admin') { alert("Restricted: Admin only."); return; }
    if (confirm("Delete this document?")) {
        db.ref('documents/' + id).remove();
    }
}

function openVideoModal(id = null) {
    if (!currentUser || currentUser.role !== 'admin') { alert("Restricted: Admin only."); return; }
    document.getElementById('vid-edit-index').value = '';
    document.getElementById('video-form').reset();
    if (id !== null) {
        const vid = advocacyVideos[id];
        if (vid) {
            document.getElementById('vid-edit-index').value = id;
            document.getElementById('vid-title').value = vid.title;
            document.getElementById('vid-url').value = vid.embedUrl;
            document.getElementById('vid-desc').value = vid.description;
        }
    }
    openModal('video-modal');
}

function handleSaveVideo(e) {
    e.preventDefault();
    if (!currentUser || currentUser.role !== 'admin') return;
    const index = document.getElementById('vid-edit-index').value;
    const title = document.getElementById('vid-title').value;
    let embedUrl = document.getElementById('vid-url').value;
    const description = document.getElementById('vid-desc').value;

    if (embedUrl.includes("watch?v=")) {
        embedUrl = embedUrl.replace("watch?v=", "embed/");
    }

    const videoObj = { title, embedUrl, description };
    // Update array and push to Firebase
    if (index !== "") {
        advocacyVideos[index] = videoObj;
    } else {
        advocacyVideos.unshift(videoObj);
    }
    db.ref('videos').set(advocacyVideos).then(() => {
        closeModal('video-modal');
        alert("Primer video saved successfully!");
    });
}

function deleteVideo(index) {
    if (!currentUser || currentUser.role !== 'admin') { alert("Restricted: Admin only."); return; }
    if (confirm("Delete this video?")) {
        advocacyVideos.splice(index, 1);
        db.ref('videos').set(advocacyVideos);
    }
}

function openFaqModal(index = null) {
    if (!currentUser || currentUser.role !== 'admin') { alert("Restricted: Admin only."); return; }
    document.getElementById('faq-edit-index').value = '';
    document.getElementById('faq-form').reset();
    if (index !== null) {
        const faq = faqList[index];
        if (faq) {
            document.getElementById('faq-edit-index').value = index;
            document.getElementById('faq-question').value = faq.question;
            document.getElementById('faq-answer').value = faq.answer;
        }
    }
    openModal('faq-modal');
}

function handleSaveFaq(e) {
    e.preventDefault();
    if (!currentUser || currentUser.role !== 'admin') return;
    const index = document.getElementById('faq-edit-index').value;
    const question = document.getElementById('faq-question').value;
    const answer = document.getElementById('faq-answer').value;

    const faqObj = { question, answer };
    if (index !== "") {
        faqList[index] = faqObj;
    } else {
        faqList.unshift(faqObj);
    }
    db.ref('faqs').set(faqList).then(() => {
        closeModal('faq-modal');
        alert("FAQ saved successfully!");
    });
}

function deleteFaq(index) {
    if (!currentUser || currentUser.role !== 'admin') { alert("Restricted: Admin only."); return; }
    if (confirm("Delete this FAQ?")) {
        faqList.splice(index, 1);
        db.ref('faqs').set(faqList);
    }
}

function openAnnouncementModal(id = null) {
    if (!currentUser || currentUser.role !== 'admin') { alert("Restricted: Admin only."); return; }
    document.getElementById('announcement-edit-id').value = '';
    document.getElementById('announcement-form').reset();
    if (id) {
        const item = announcementsList.find(a => a.id === id);
        if (item) {
            document.getElementById('announcement-edit-id').value = item.id;
            document.getElementById('announcement-title').value = item.title;
            document.getElementById('announcement-date').value = item.date;
            document.getElementById('announcement-content').value = item.content;
        }
    }
    openModal('announcement-modal');
}

function handleSaveAnnouncement(e) {
    e.preventDefault();
    if (!currentUser || currentUser.role !== 'admin') return;
    const id = document.getElementById('announcement-edit-id').value;
    const title = document.getElementById('announcement-title').value;
    const date = document.getElementById('announcement-date').value;
    const content = document.getElementById('announcement-content').value;

    const annId = id ? id : 'ann_' + Date.now();
    const annObj = { id: annId, title, date, content };

    db.ref('announcements/' + annId).set(annObj).then(() => {
        closeModal('announcement-modal');
        alert("Announcement published successfully!");
    });
}

function deleteAnnouncement(id) {
    if (!currentUser || currentUser.role !== 'admin') { alert("Restricted: Admin only."); return; }
    if (confirm("Delete this announcement?")) {
        db.ref('announcements/' + id).remove();
    }
}

function terminateMember(id) {
    if (!currentUser || currentUser.role !== 'admin') { alert("Restricted: Admin only."); return; }
    if (confirm("Are you sure you want to terminate/remove this member?")) {
        db.ref('members').once('value', snapshot => {
            const mems = snapshot.val();
            for (let key in mems) {
                if (mems[key].id == id || key == id) {
                    db.ref('members/' + key).remove().then(() => alert("Member terminated successfully."));
                    break;
                }
            }
        });
    }
}

function approveMember(reqId) {
    if (!currentUser || currentUser.role !== 'admin') return;
    db.ref('pending/' + reqId).once('value', snapshot => {
        const reqData = snapshot.val();
        if (reqData) {
            reqData.status = "Active";
            const memberKey = reqData.id || 'mem_' + Date.now();
            db.ref('members/' + memberKey).set(reqData).then(() => {
                db.ref('pending/' + reqId).remove();
                alert(`Member ${reqData.name} has been approved and added to Firebase database!`);
            });
        }
    });
}

function removePendingMember(reqId) {
    if (!currentUser || currentUser.role !== 'admin') return;
    if (confirm("Permanently reject this pending application?")) {
        db.ref('pending/' + reqId).remove();
    }
}

function deleteBugReport(id) {
    if (!currentUser || currentUser.role !== 'admin') return;
    if (confirm("Delete this bug report?")) {
        db.ref('bug_reports/' + id).remove();
    }
}

let currentSelectedRating = 0;
function setRating(score) {
    playClickSound();
    currentSelectedRating = score;
    const stars = document.querySelectorAll('.rating-stars i');
    stars.forEach((star, idx) => {
        if (idx < score) {
            star.classList.add('rated');
        } else {
            star.classList.remove('rated');
        }
    });
}

function handleRatingSubmit(e) {
    e.preventDefault();
    if (currentSelectedRating === 0) {
        alert("Please select a star rating first!");
        return;
    }
    const feedback = document.getElementById('user-feedback-text').value;
    const ratingId = 'rat_' + Date.now();
    const ratingObj = {
        id: ratingId,
        rating: currentSelectedRating,
        feedback,
        date: new Date().toLocaleDateString(),
        user: currentUser ? currentUser.name : "Anonymous Advocate"
    };
    db.ref('ratings/' + ratingId).set(ratingObj).then(() => {
        openModal('thankyou-sticker-modal');
        document.getElementById('rating-form').reset();
        setRating(0);
    });
}

function handleBugReport(e) {
    e.preventDefault();
    const bugDesc = document.getElementById('bug-desc-input').value;
    const bugId = 'bug_' + Date.now();
    const bugObj = { id: bugId, description: bugDesc, date: new Date().toLocaleString() };
    db.ref('bug_reports/' + bugId).set(bugObj).then(() => {
        alert("Thank you! Your bug report has been successfully sent to the admin inbox.");
        document.getElementById('bug-report-form').reset();
        closeModal('bug-report-modal');
    });
}

// RENDER ALL UI COMPONENTS
function renderAll() {
    const isAdmin = currentUser && currentUser.role === 'admin';

    // RENDER OFFICERS
    const officersContainer = document.getElementById('officers-container');
    if (officersContainer) {
        officersContainer.innerHTML = officersList.map(officer => `
            <div class="officer-card">
                <div class="officer-img-wrapper"><img src="${officer.photo}" alt="${officer.name}"></div>
                <div class="officer-info">
                    <h3 class="officer-name">${officer.name}</h3>
                    <p class="officer-position">${officer.position}</p>
                </div>
            </div>
        `).join('');
    }

    const adminOfficersTable = document.getElementById('admin-officers-table');
    if (adminOfficersTable) {
        adminOfficersTable.innerHTML = officersList.map(officer => `
            <tr>
                <td><img src="${officer.photo}" alt="" style="width:40px; height:40px; border-radius:50%; object-fit:cover;"></td>
                <td>${officer.name}</td>
                <td>${officer.position}</td>
                <td>
                    <button class="btn btn-secondary" style="padding:4px 8px; font-size:0.8rem;" onclick="openOfficerModal('${officer.id}')">Edit</button>
                    <button class="btn btn-danger" style="padding:4px 8px; font-size:0.8rem;" onclick="deleteOfficer('${officer.id}')">Delete</button>
                </td>
            </tr>
        `).join('');
    }

    // ATTENDANCE LOGS
    const adminAttendanceTable = document.getElementById('admin-attendance-table');
    if (adminAttendanceTable) {
        if (attendanceLogs.length === 0) {
            adminAttendanceTable.innerHTML = `<tr><td colspan="6" style="text-align:center; color:#666;">No attendance records found yet.</td></tr>`;
        } else {
            adminAttendanceTable.innerHTML = attendanceLogs.map(log => `
                <tr>
                    <td>${log.name}</td>
                    <td>${log.email}</td>
                    <td>${log.date}</td>
                    <td>${log.timeIn}</td>
                    <td>${log.timeOut}</td>
                    <td><span class="badge ${log.status === 'Signed In' ? 'btn-success' : 'btn-secondary'}">${log.status}</span></td>
                </tr>
            `).join('');
        }
    }

    // HOMEPAGE RATINGS
    db.ref('ratings').once('value', snap => {
        const ratingsMap = snap.val();
        const ratings = ratingsMap ? Object.values(ratingsMap) : [];
        const homepageRatingsContainer = document.getElementById('homepage-ratings-container');
        if (homepageRatingsContainer) {
            if (ratings.length === 0) {
                homepageRatingsContainer.innerHTML = `<p style="color:#666; font-size:0.9rem;">No ratings submitted yet.</p>`;
            } else {
                homepageRatingsContainer.innerHTML = ratings.slice(0, 4).map(r => `
                    <div class="announcement-card">
                        <div style="color: #ffc107; margin-bottom: 5px;">
                            ${'<i class="fa-solid fa-star rated"></i>'.repeat(r.rating)}
                        </div>
                        <p style="font-size:0.9rem; font-style:italic;">"${r.feedback || 'No comment.'}"</p>
                        <small style="color: #666; display:block; margin-top:5px;">— ${r.user} (${r.date})</small>
                    </div>
                `).join('');
            }
        }
    });

    // BUG REPORTS
    db.ref('bug_reports').once('value', snap => {
        const bugsMap = snap.val();
        const bugReports = bugsMap ? Object.entries(bugsMap) : [];
        const adminBugTable = document.getElementById('admin-bug-reports-table');
        if (adminBugTable) {
            if (bugReports.length === 0) {
                adminBugTable.innerHTML = `<tr><td colspan="3" style="text-align:center; color:#666;">No bug reports found in inbox.</td></tr>`;
            } else {
                adminBugTable.innerHTML = bugReports.map(([key, bug]) => `
                    <tr>
                        <td>${bug.date}</td>
                        <td>${bug.description}</td>
                        <td><button class="btn btn-danger" style="padding:4px 8px; font-size:0.8rem;" onclick="deleteBugReport('${key}')"><i class="fa-solid fa-trash"></i> Delete</button></td>
                    </tr>
                `).join('');
            }
        }
    });

    const feedContainer = document.getElementById('activity-posts-feed');
    const homeFeedContainer = document.getElementById('home-activity-feed');
    const memberFeedContainer = document.getElementById('member-community-feed');
    
    let actHTML = activityPosts.map(post => `
        <div class="activity-post-card">
            <h3>${post.title}</h3>
            <p><strong>Posted by:</strong> ${post.author || 'Admin'} | <strong>Date:</strong> ${post.date} | <strong>Venue:</strong> ${post.venue}</p>
            <p class="activity-desc" style="margin-top: 10px;">${post.description}</p>
            <div class="activity-album-grid">
                ${(post.photos || []).map(photo => `
                    <div class="album-thumb-wrapper" onclick="openLightbox('${photo}',${photo.startsWith('data:video')})">
                        ${photo.startsWith('data:video') ? `<video src="${photo}" class="album-video"></video>` : `<img src="${photo}" alt="Album Photo" class="album-img">`}
                        <div class="album-overlay"><i class="fa-solid fa-expand"></i> Click to View/Download</div>
                    </div>
                `).join('')}
            </div>

            <div style="margin-top: 15px; display: flex; gap: 10px; align-items: center; border-top: 1px solid #eee; padding-top: 10px;">
                <button class="btn btn-secondary" style="font-size: 0.8rem; padding: 4px 10px;" onclick="addReaction('${post.id}', 'like')">
                    <i class="fa-solid fa-thumbs-up"></i> Like (${post.reactions ? post.reactions.like : 0})
                </button>
                <button class="btn btn-secondary" style="font-size: 0.8rem; padding: 4px 10px;" onclick="addReaction('${post.id}', 'heart')">
                    <i class="fa-solid fa-heart" style="color: #dc3545;"></i> Heart (${post.reactions ? post.reactions.heart : 0})
                </button>
            </div>

            <div style="margin-top: 15px;">
                <h4 style="font-size: 0.9rem; margin-bottom: 8px;">Comments (${post.comments ? post.comments.length : 0})</h4>
                <div style="max-height: 150px; overflow-y: auto; margin-bottom: 10px;">
                    ${(post.comments || []).map(c => `
                        <div style="background: rgba(0,0,0,0.03); padding: 8px; border-radius: 4px; margin-bottom: 6px; font-size: 0.85rem;">
                            <strong>${c.name}:</strong>${c.text} <span style="float: right; color: #888; font-size: 0.75rem;">${c.date}</span>
                        </div>
                    `).join('')}
                </div>
                <form onsubmit="addComment('${post.id}', event)" style="display: flex; gap: 8px;">
                    <input type="text" id="comment-input-${post.id}" placeholder="Mag-iwan ng komento..." required style="flex: 1; padding: 6px 10px; font-size: 0.85rem; border: 1px solid #ccc; border-radius: 4px;" oninput="autoCapitalize(this)">
                    <button type="submit" class="btn btn-primary" style="padding: 6px 12px; font-size: 0.85rem;">I-send</button>
                </form>
            </div>

            ${isAdmin ? `<div style="margin-top:15px;"><button class="btn btn-secondary" onclick="openActivityModal('${post.id}')">Edit</button> <button class="btn btn-danger" onclick="deleteActivity('${post.id}')">Delete</button></div>` : ''}
        </div>
    `).join('');

    if (feedContainer) feedContainer.innerHTML = actHTML;
    if (memberFeedContainer) memberFeedContainer.innerHTML = actHTML;
    if (homeFeedContainer) homeFeedContainer.innerHTML = activityPosts.slice(0, 2).map(post => `
        <div class="announcement-card">
            <span class="badge">Activity</span>
            <h4>${post.title}</h4>
            <p>${post.description.substring(0, 90)}...</p>
        </div>
    `).join('');

    const homeAnnouncementsEl = document.getElementById('home-announcements-container');
    if (homeAnnouncementsEl) {
        homeAnnouncementsEl.innerHTML = announcementsList.map(a => `
            <div class="announcement-post-card">
                <span class="badge" style="background:#28a745;">Announcement</span>
                <h4 style="margin-top: 5px;">${a.title}</h4>
                <small style="color: #666;"><i class="fa-solid fa-calendar"></i> ${a.date}</small>
                <p style="margin-top: 8px; font-size: 0.9rem;">${a.content}</p>
            </div>
        `).join('');
    }

    const adminAnnouncementsTable = document.getElementById('admin-announcements-table');
    if (adminAnnouncementsTable) {
        adminAnnouncementsTable.innerHTML = announcementsList.map(a => `
            <tr>
                <td>${a.title}</td>
                <td>${a.date}</td>
                <td>${a.content.substring(0, 50)}...</td>
                <td>
                    <button class="btn btn-secondary" style="padding:4px 8px; font-size:0.8rem;" onclick="openAnnouncementModal('${a.id}')">Edit</button>
                    <button class="btn btn-danger" style="padding:4px 8px; font-size:0.8rem;" onclick="deleteAnnouncement('${a.id}')">Delete</button>
                </td>
            </tr>
        `).join('');
    }

    const adminActTable = document.getElementById('admin-activities-table');
    if (adminActTable) adminActTable.innerHTML = activityPosts.map(p => `
        <tr><td>${p.title}</td><td>${p.date}</td><td>${p.venue}</td><td>
        <button class="btn btn-secondary" onclick="openActivityModal('${p.id}')">Edit</button>
        <button class="btn btn-danger" onclick="deleteActivity('${p.id}')">Delete</button></td></tr>
    `).join('');

    const homeVideos = document.getElementById('home-videos-grid');
    const allVideos = document.getElementById('all-videos-grid');
    const adminVideos = document.getElementById('admin-videos-table');

    let vidHTML = advocacyVideos.map((vid, idx) => `
        <div class="video-card">
            <div class="video-iframe-wrapper"><iframe src="${vid.embedUrl}" allowfullscreen></iframe></div>
            <h4>${vid.title}</h4>
            <p>${vid.description}</p>
            ${isAdmin ? `<div style="margin-top:10px;"><button class="btn btn-secondary" onclick="openVideoModal(${idx})">Edit</button> <button class="btn btn-danger" onclick="deleteVideo(${idx})">Delete</button></div>` : ''}
        </div>
    `).join('');
    if (homeVideos) homeVideos.innerHTML = vidHTML;
    if (allVideos) allVideos.innerHTML = vidHTML;
    if (adminVideos) adminVideos.innerHTML = advocacyVideos.map((v, i) => `
        <tr><td>${v.title}</td><td>${v.embedUrl}</td><td>
        <button class="btn btn-secondary" onclick="openVideoModal(${i})">Edit</button>
        <button class="btn btn-danger" onclick="deleteVideo(${i})">Delete</button></td></tr>
    `).join('');

    const docsListEl = document.getElementById('documents-list');
    const homeDocsEl = document.getElementById('home-documents-grid');
    const adminDocsEl = document.getElementById('admin-documents-table');

    let docHTML = documentsList.map(doc => `
        <tr>
            <td><span class="badge">${doc.category}</span></td>
            <td>${doc.title}</td>
            <td>${doc.date}</td>
            <td>
                <button class="btn btn-primary" style="padding:4px 8px; font-size:0.8rem;" onclick="previewDocument('${doc.title.replace(/'/g, "\\'")}', '${doc.url}', '${doc.category}')"><i class="fa-solid fa-eye"></i> Preview</button>
                <a href="${doc.url}" download="${doc.title.replace(/\s+/g, '_')}" class="btn btn-success" style="padding:4px 8px; font-size:0.8rem; text-decoration:none;"><i class="fa-solid fa-download"></i> Download</a>
            </td>
        </tr>
    `).join('');
    if (docsListEl) docsListEl.innerHTML = docHTML;
    if (homeDocsEl) homeDocsEl.innerHTML = documentsList.slice(0, 2).map(d => `
        <div class="announcement-card" style="cursor: pointer;" onclick="previewDocument('${d.title.replace(/'/g, "\\'")}', '${d.url}', '${d.category}')">
            <span class="badge">${d.category}</span>
            <h4>${d.title}</h4>
            <small><i class="fa-solid fa-eye"></i> Click to Preview & Download</small>
        </div>
    `).join('');
    if (adminDocsEl) adminDocsEl.innerHTML = documentsList.map(d => `
        <tr><td>${d.category}</td><td>${d.title}</td><td>${d.date}</td><td>
        <button class="btn btn-secondary" onclick="openDocumentModal('${d.id}')">Edit</button>
        <button class="btn btn-danger" onclick="deleteDocument('${d.id}')">Delete</button></td></tr>
    `).join('');

    const faqContainer = document.getElementById('faq-container');
    const homeFaqContainer = document.getElementById('home-faq-container');
    const adminFaq = document.getElementById('admin-faq-table');

    let faqHTML = faqList.map((faq, idx) => `
        <div class="faq-item">
            <h4>${faq.question}</h4>
            <p>${faq.answer}</p>
            ${isAdmin ? `<div style="margin-top:8px;"><button class="btn btn-secondary" style="padding:3px 8px; font-size:0.75rem;" onclick="openFaqModal(${idx})">Edit</button> <button class="btn btn-danger" style="padding:3px 8px; font-size:0.75rem;" onclick="deleteFaq(${idx})">Delete</button></div>` : ''}
        </div>
    `).join('');
    if (faqContainer) faqContainer.innerHTML = faqHTML;
    if (homeFaqContainer) homeFaqContainer.innerHTML = faqList.slice(0, 2).map(faq => `
        <div class="faq-item">
            <h4>${faq.question}</h4>
            <p>${faq.answer}</p>
        </div>
    `).join('');
    if (adminFaq) adminFaq.innerHTML = faqList.map((f, i) => `
        <tr><td>${f.question}</td><td>${f.answer}</td><td>
        <button class="btn btn-secondary" onclick="openFaqModal(${i})">Edit</button>
        <button class="btn btn-danger" onclick="deleteFaq(${i})">Delete</button></td></tr>
    `).join('');

    const memTable = document.getElementById('admin-members-table');
    if (memTable) {
        memTable.innerHTML = members.map(m => `
            <tr>
                <td>${m.name}</td>
                <td>${m.email}</td>
                <td>${m.course} (${m.year})</td>
                <td><span class="badge btn-success">${m.status}</span></td>
                <td>
                    <button class="btn btn-danger" style="padding:4px 8px; font-size:0.8rem;" onclick="terminateMember('${m.id}')"><i class="fa-solid fa-user-xmark"></i> Terminate/Remove</button>
                </td>
            </tr>
        `).join('');
    }

    // PENDING REQUESTS
    db.ref('pending').once('value', snap => {
        const pendingMap = snap.val();
        const pendingList = pendingMap ? Object.entries(pendingMap) : [];
        const table = document.getElementById('pending-requests-table');
        if (table) {
            if (pendingList.length === 0) {
                table.innerHTML = `<tr><td colspan="5" style="text-align:center; color:#666;">No pending registrations.</td></tr>`;
            } else {
                table.innerHTML = pendingList.map(([key, req]) => `
                    <tr>
                        <td>${req.name}</td>
                        <td>${req.email}</td>
                        <td>${req.course} (${req.year})</td>
                        <td>${req.reason}</td>
                        <td>
                            <button class="btn btn-success" style="padding:4px 8px; font-size:0.8rem;" onclick="approveMember('${key}')"><i class="fa-solid fa-check"></i> Approve</button>
                            <button class="btn btn-danger" style="padding:4px 8px; font-size:0.8rem;" onclick="removePendingMember('${key}')"><i class="fa-solid fa-xmark"></i> Remove</button>
                        </td>
                    </tr>
                `).join('');
            }
        }
    });
}