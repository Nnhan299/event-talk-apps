// Global Application State
let allUpdates = [];
let selectedUpdateId = null;
let currentFilter = 'all';
let searchQuery = '';

// DOM Elements
const btnRefresh = document.getElementById('btn-refresh');
const refreshIcon = document.getElementById('refresh-icon');
const lastUpdatedTime = document.getElementById('last-updated-time');

const searchInput = document.getElementById('search-input');
const filterChips = document.getElementById('filter-chips');

const feedLoading = document.getElementById('feed-loading');
const feedError = document.getElementById('feed-error');
const errorMessage = document.getElementById('error-message');
const feedEmpty = document.getElementById('feed-empty');
const updatesGrid = document.getElementById('updates-grid');
const btnRetry = document.getElementById('btn-retry');

const composerEmptyState = document.getElementById('composer-empty-state');
const composerActiveState = document.getElementById('composer-active-state');
const selectedDateSpan = document.getElementById('selected-card-date');
const selectedTypeSpan = document.getElementById('selected-card-type');
const tweetTextarea = document.getElementById('tweet-textarea');
const btnTweet = document.getElementById('btn-tweet');
const progressCircle = document.getElementById('progress-circle');
const charCountText = document.getElementById('char-count-text');
const previewText = document.getElementById('tweet-preview-text');

// Circle indicator parameters
const circleRadius = progressCircle.r.baseVal.value;
const circleCircumference = circleRadius * 2 * Math.PI;

// Initialize circle stroke-dash
progressCircle.style.strokeDasharray = `${circleCircumference} ${circleCircumference}`;
progressCircle.style.strokeDashoffset = circleCircumference;

/**
 * Set SVG progress ring level
 * @param {number} percent 
 */
function setProgress(percent) {
    const offset = circleCircumference - (percent / 100) * circleCircumference;
    progressCircle.style.strokeDashoffset = offset;
}

/**
 * Format date/time to local display
 */
function getFormattedTime() {
    const now = new Date();
    return now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

/**
 * Fetch updates from Flask API
 */
async function fetchUpdates() {
    // Show loading state
    feedLoading.classList.remove('hidden');
    feedError.classList.add('hidden');
    feedEmpty.classList.add('hidden');
    updatesGrid.classList.add('hidden');
    btnRefresh.classList.add('spinning');
    btnRefresh.disabled = true;
    
    try {
        const response = await fetch('/api/updates');
        if (!response.ok) {
            throw new Error(`Máy chủ báo lỗi: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (data.error) {
            throw new Error(data.error);
        }
        
        allUpdates = data;
        lastUpdatedTime.textContent = `Cập nhật lúc ${getFormattedTime()}`;
        
        // Render current data
        renderUpdates();
        
    } catch (error) {
        console.error("Error fetching release notes:", error);
        errorMessage.textContent = error.message || "Không thể kết nối tới máy chủ hoặc dữ liệu XML bị lỗi.";
        feedError.classList.remove('hidden');
        feedLoading.classList.add('hidden');
    } finally {
        btnRefresh.classList.remove('spinning');
        btnRefresh.disabled = false;
    }
}

/**
 * Generate preview and draft text for selected card
 * @param {object} update 
 */
function generateDraftTweet(update) {
    const titleEmoji = {
        'Feature': '🚀 Feature',
        'Announcement': '📢 Announcement',
        'Issue': '⚠️ Issue',
        'Deprecation': '🛑 Deprecation',
        'Update': '📝 Update'
    }[update.type] || '📢 BigQuery Update';

    // Clean html tags to get plain text, limit description length
    let cleanText = update.content_text
        .replace(/\s+/g, ' ')
        .trim();
        
    // Generate text snippet (keep characters enough to fit 280)
    // Headline: [Type] (June 18): [cleanText]...
    // Max allowable snippet is around 140 chars to accommodate links and hashtags
    const link = update.link || 'https://cloud.google.com/bigquery/docs/release-notes';
    const linkLength = 30; // standard Twitter short link length
    const footer = `\n\nRead details: ${link}\n#BigQuery #GoogleCloud`;
    
    const prefix = `${titleEmoji} (${update.date}): `;
    const baseLength = prefix.length + footer.length;
    const maxSnippetLength = 280 - baseLength - 5; // buffer of 5
    
    if (cleanText.length > maxSnippetLength) {
        cleanText = cleanText.substring(0, maxSnippetLength) + '...';
    }
    
    return `${prefix}${cleanText}${footer}`;
}

/**
 * Handle card selection
 * @param {string} updateId 
 */
function selectUpdateCard(updateId) {
    selectedUpdateId = updateId;
    
    // Refresh visual state of all cards
    document.querySelectorAll('.update-card').forEach(card => {
        if (card.dataset.id === updateId) {
            card.classList.add('selected');
        } else {
            card.classList.remove('selected');
        }
    });
    
    const update = allUpdates.find(u => u.id === updateId);
    if (!update) return;
    
    // Populate composer side panel
    selectedDateSpan.textContent = update.date;
    selectedTypeSpan.textContent = update.type;
    
    // Set badge style classes based on update type
    selectedTypeSpan.className = 'badge';
    const typeClassMap = {
        'feature': 'badge-feature',
        'announcement': 'badge-announcement',
        'issue': 'badge-issue',
        'deprecation': 'badge-deprecation',
        'update': 'badge-update'
    };
    const activeClass = typeClassMap[update.type.toLowerCase()] || 'badge-update';
    selectedTypeSpan.classList.add(activeClass);
    
    // Generate tweet draft
    const defaultTweet = generateDraftTweet(update);
    tweetTextarea.value = defaultTweet;
    
    // Show composer details panel
    composerEmptyState.classList.add('hidden');
    composerActiveState.classList.remove('hidden');
    
    // Update count & preview
    handleTweetTextChange();
}

/**
 * Handle input changes in the text editor
 */
function handleTweetTextChange() {
    const text = tweetTextarea.value;
    const len = text.length;
    const maxChars = 280;
    
    // Update preview
    previewText.textContent = text;
    
    // Update counters
    const remaining = maxChars - len;
    charCountText.textContent = remaining;
    
    // Progress Circle Calculation
    const percent = Math.min((len / maxChars) * 100, 100);
    setProgress(percent);
    
    if (len > maxChars) {
        progressCircle.style.stroke = '#ef4444'; // red
        charCountText.style.color = '#ef4444';
        btnTweet.disabled = true;
    } else if (len >= maxChars - 20) {
        progressCircle.style.stroke = '#f59e0b'; // orange
        charCountText.style.color = '#f59e0b';
        btnTweet.disabled = false;
    } else {
        progressCircle.style.stroke = '#3b82f6'; // blue
        charCountText.style.color = 'var(--text-secondary)';
        btnTweet.disabled = len === 0;
    }
}

/**
 * Filter and Render all cards
 */
function renderUpdates() {
    feedLoading.classList.add('hidden');
    
    // Filter logic
    const filtered = allUpdates.filter(update => {
        const matchesType = currentFilter === 'all' || 
                            update.type.toLowerCase() === currentFilter.toLowerCase();
        
        const matchesSearch = searchQuery === '' || 
                              update.content_text.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              update.date.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              update.type.toLowerCase().includes(searchQuery.toLowerCase());
                              
        return matchesType && matchesSearch;
    });
    
    if (filtered.length === 0) {
        feedEmpty.classList.remove('hidden');
        updatesGrid.classList.add('hidden');
        return;
    }
    
    feedEmpty.classList.add('hidden');
    updatesGrid.innerHTML = '';
    
    filtered.forEach(update => {
        const card = document.createElement('div');
        const typeClass = update.type.toLowerCase();
        card.className = `update-card type-${typeClass}`;
        if (update.id === selectedUpdateId) {
            card.classList.add('selected');
        }
        card.dataset.id = update.id;
        
        // Define badge style class
        const badgeClass = {
            'feature': 'badge-feature',
            'announcement': 'badge-announcement',
            'issue': 'badge-issue',
            'deprecation': 'badge-deprecation',
            'update': 'badge-update'
        }[typeClass] || 'badge-update';
        
        card.innerHTML = `
            <div class="card-header">
                <div class="card-meta">
                    <span class="card-date">${update.date}</span>
                    <span class="badge ${badgeClass}">${update.type}</span>
                </div>
                <div class="selection-indicator">
                    <i class="fa-solid fa-check"></i>
                </div>
            </div>
            <div class="card-body">
                ${update.content_html}
            </div>
            <div class="card-footer">
                <a href="${update.link}" target="_blank" class="card-link" onclick="event.stopPropagation();">
                    <i class="fa-solid fa-arrow-up-right-from-square"></i>
                    <span>Tài liệu gốc</span>
                </a>
                <button class="btn-select-tweet">
                    <i class="fa-brands fa-x-twitter"></i>
                    <span>Chọn & soạn Tweet</span>
                </button>
            </div>
        `;
        
        // Click card to select
        card.addEventListener('click', () => {
            selectUpdateCard(update.id);
        });
        
        updatesGrid.appendChild(card);
    });
    
    updatesGrid.classList.remove('hidden');
}

// ==========================================================================
// Event Listeners Configuration
// ==========================================================================

// Search input
searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    renderUpdates();
});

// Category Filter chips
filterChips.addEventListener('click', (e) => {
    const button = e.target.closest('button');
    if (!button) return;
    
    // Toggle active state
    document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
    button.classList.add('active');
    
    currentFilter = button.dataset.type;
    renderUpdates();
});

// Refresh button
btnRefresh.addEventListener('click', fetchUpdates);

// Retry on error button
btnRetry.addEventListener('click', fetchUpdates);

// Text area changes
tweetTextarea.addEventListener('input', handleTweetTextChange);

// Tweet submit handler (opens Twitter intent)
btnTweet.addEventListener('click', () => {
    const text = tweetTextarea.value;
    if (!text) return;
    
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(twitterUrl, '_blank');
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    fetchUpdates();
});
