// Fetch the index of version files
async function fetchVersionsIndex() {
    try {
        const response = await fetch('versions-index.json');
        if (!response.ok) throw new Error('Failed to load versions index');
        const data = await response.json();
        return data.versionFiles;
    } catch (error) {
        console.error('Error loading versions index:', error);
        return [];
    }
}

// Fetch a specific version file
async function fetchVersionData(filename) {
    try {
        const response = await fetch(`versions/${filename}`);
        if (!response.ok) throw new Error(`Failed to load version file: ${filename}`);
        return await response.json();
    } catch (error) {
        console.error(`Error loading version ${filename}:`, error);
        return null;
    }
}

// Fetch all version data
async function fetchAllVersions() {
    const versionFiles = await fetchVersionsIndex();
    const versionPromises = versionFiles.map(filename => fetchVersionData(filename));
    const versions = await Promise.all(versionPromises);
    return versions.filter(v => v !== null); // Remove any failed loads
}

// Render the changelog entries
function renderChangelog(versions) {
    const container = document.getElementById('changelog-container');
    if (!container) {
        console.error('Changelog container not found');
        return;
    }

    // Clear existing content
    container.innerHTML = '';

    versions.forEach(version => {
        const versionBlock = document.createElement('div');
        versionBlock.className = 'version-block';
        
        versionBlock.innerHTML = `
            <div class="version-header">
                <h2>Version ${version.version}</h2>
                <span class="version-date">${version.date}</span>
            </div>
            <ul class="update-list">
                ${version.updates.map(update => `
                    <li class="update-item">
                        ${update.text}
                        ${update.type ? `<span class="tag ${update.type}">${getTagText(update.type)}</span>` : ''}
                    </li>
                `).join('')}
            </ul>
        `;
        
        container.appendChild(versionBlock);
    });
}

function getTagText(type) {
    switch(type) {
        case 'feature': return 'Yeni';
        case 'bugfix': return 'Bugfix';
        case 'improvement': return 'Deneysel';
        default: return '';
    }
}

// Initialize when the page loads
document.addEventListener('DOMContentLoaded', async () => {
    const versions = await fetchAllVersions();
    renderChangelog(versions);
}); 