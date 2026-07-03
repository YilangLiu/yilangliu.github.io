// Start fetching publications immediately (the script is deferred, so this
// runs during parsing, well before DOMContentLoaded)
const publicationsPromise = fetch('publications.json').then(response => {
  if (!response.ok) {
    throw new Error(`Network response was not ok: ${response.status}`);
  }
  return response.json();
});

let showingSelected = true;

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Play publication demo videos only while they are on screen
const videoObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.play().catch(() => {});
    } else {
      entry.target.pause();
    }
  });
}, { rootMargin: '100px' });

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
  // Stagger the section entrance animations
  const sections = document.querySelectorAll('section');
  sections.forEach((section, index) => {
    section.style.animationDelay = `${index * 0.1}s`;
  });

  const toggleButton = document.getElementById('toggle-publications');
  if (toggleButton) {
    toggleButton.addEventListener('click', togglePublications);
  }

  const modal = document.getElementById('imageModal');
  modal.querySelector('.modal-close').addEventListener('click', closeModal);
  modal.addEventListener('click', event => {
    if (event.target === modal) {
      closeModal();
    }
  });

  publicationsPromise
    .then(data => {
      renderPublications(data.publications);
    })
    .catch(error => {
      console.error('Error loading publications:', error);
      displayFallbackPublications();
    });
});

// Fallback if JSON loading fails
function displayFallbackPublications() {
  const container = document.getElementById('publications-container');
  container.textContent = 'Publications could not be loaded. Please see my ';
  const link = document.createElement('a');
  link.href = 'https://scholar.google.com/citations?user=yirVCdwAAAAJ';
  link.textContent = 'Google Scholar profile';
  container.appendChild(link);
  container.appendChild(document.createTextNode('.'));
}

// Render every publication once; the show-selected class controls visibility
function renderPublications(publications) {
  const container = document.getElementById('publications-container');
  const fragment = document.createDocumentFragment();
  publications.forEach(publication => {
    fragment.appendChild(createPublicationElement(publication));
  });
  container.appendChild(fragment);
  container.classList.add('show-selected');

  // With no unselected entries the toggle would be a no-op — hide it
  if (publications.every(pub => pub.selected === 1)) {
    document.getElementById('toggle-publications').style.display = 'none';
    document.getElementById('toggle-header').textContent = 'Publications';
  }
}

// Toggle between showing all or selected publications
function togglePublications() {
  showingSelected = !showingSelected;
  const container = document.getElementById('publications-container');
  container.classList.toggle('show-selected', showingSelected);

  const toggleButton = document.getElementById('toggle-publications');
  toggleButton.textContent = showingSelected ? 'Show All' : 'Show Selected';
  toggleButton.setAttribute('aria-expanded', String(!showingSelected));
  const toggleHeader = document.getElementById('toggle-header');
  toggleHeader.textContent = showingSelected ? 'Selected Publications' : 'All Publications';
}

// Create HTML element for a publication
function createPublicationElement(publication) {
  const pubItem = document.createElement('div');
  pubItem.className = 'publication-item';
  pubItem.dataset.selected = publication.selected;

  // Create thumbnail (video or image based on extension)
  const thumbnail = document.createElement('div');
  thumbnail.className = 'pub-thumbnail';

  const isVideo = /\.(mp4|webm|ogg|mov)$/i.test(publication.thumbnail);
  if (isVideo) {
    thumbnail.classList.add('pub-thumbnail-video');
    const thumbnailVideo = document.createElement('video');
    thumbnailVideo.src = publication.thumbnail;
    thumbnailVideo.muted = true;
    // The attribute is needed in addition to the property for autoplay of
    // dynamically created videos in some browsers
    thumbnailVideo.setAttribute('muted', '');
    thumbnailVideo.loop = true;
    thumbnailVideo.playsInline = true;
    thumbnailVideo.preload = 'metadata';
    if (prefersReducedMotion) {
      thumbnailVideo.controls = true;
      thumbnailVideo.setAttribute('aria-label', `Demo video: ${publication.title}`);
    } else {
      thumbnailVideo.setAttribute('aria-hidden', 'true');
      videoObserver.observe(thumbnailVideo);
    }
    thumbnail.appendChild(thumbnailVideo);
  } else {
    thumbnail.onclick = () => openModal(publication.thumbnail, publication.title);
    thumbnail.setAttribute('role', 'button');
    thumbnail.setAttribute('tabindex', '0');
    thumbnail.setAttribute('aria-label', `View enlarged figure for ${publication.title}`);
    thumbnail.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openModal(publication.thumbnail, publication.title);
      }
    });
    const thumbnailImg = document.createElement('img');
    thumbnailImg.src = publication.thumbnail;
    thumbnailImg.alt = `${publication.title} thumbnail`;
    thumbnailImg.loading = 'lazy';
    thumbnailImg.decoding = 'async';
    thumbnail.appendChild(thumbnailImg);
  }

  // Create content container
  const content = document.createElement('div');
  content.className = 'pub-content';

  // Add title
  const title = document.createElement('h3');
  title.className = 'pub-title';
  title.textContent = publication.title;
  content.appendChild(title);

  // Add authors with highlight (textContent keeps JSON data from being parsed as HTML)
  const authors = document.createElement('div');
  authors.className = 'pub-authors';

  publication.authors.forEach((author, index) => {
    if (author.includes('Yilang Liu')) {
      const highlight = document.createElement('span');
      highlight.className = 'highlight-name';
      highlight.textContent = author;
      authors.appendChild(highlight);
    } else {
      authors.appendChild(document.createTextNode(author));
    }

    if (index < publication.authors.length - 1) {
      authors.appendChild(document.createTextNode(', '));
    }
  });

  if (publication.authors.some(author => author.includes('*'))) {
    const note = document.createElement('span');
    note.className = 'equal-note';
    note.textContent = ' (* equal contribution)';
    authors.appendChild(note);
  }
  content.appendChild(authors);

  // Add venue with award if present
  const venueContainer = document.createElement('div');
  venueContainer.className = 'pub-venue-container';

  const venue = document.createElement('div');
  venue.className = 'pub-venue';
  venue.textContent = publication.venue;
  venueContainer.appendChild(venue);

  // Add award if it exists
  if (publication.award && publication.award.length > 0) {
    const award = document.createElement('div');
    award.className = 'pub-award';
    award.textContent = publication.award;
    venueContainer.appendChild(award);
  }

  content.appendChild(venueContainer);

  // Add links if they exist
  if (publication.links) {
    const links = document.createElement('div');
    links.className = 'pub-links';

    const linkTypes = [
      ['pdf', '[PDF]', 'PDF'],
      ['arxiv', '[arXiv]', 'arXiv page'],
      ['journal', '[Journal]', 'Journal version'],
      ['code', '[Code]', 'Code'],
      ['project', '[Project Page]', 'Project page']
    ];

    linkTypes.forEach(([key, label, name]) => {
      if (publication.links[key]) {
        const link = document.createElement('a');
        link.href = publication.links[key];
        link.textContent = label;
        link.target = '_blank';
        link.rel = 'noopener';
        link.setAttribute('aria-label', `${name}: ${publication.title}`);
        links.appendChild(link);
      }
    });

    content.appendChild(links);
  }

  // Assemble the publication item
  pubItem.appendChild(thumbnail);
  pubItem.appendChild(content);

  return pubItem;
}

// Modal functionality for viewing original images
let lastFocusedElement = null;
let modalHideTimer = null;

function openModal(imageSrc, title) {
  const modal = document.getElementById('imageModal');
  const modalImg = document.getElementById('modalImage');
  clearTimeout(modalHideTimer);
  lastFocusedElement = document.activeElement;
  modal.style.display = "block";
  setTimeout(() => {
    modal.classList.add('show');
  }, 10);
  modalImg.src = imageSrc;
  modalImg.alt = title ? `Full-size figure: ${title}` : '';
  modal.querySelector('.modal-close').focus();
}

function closeModal() {
  const modal = document.getElementById('imageModal');
  modal.classList.remove('show');
  modalHideTimer = setTimeout(() => {
    modal.style.display = "none";
  }, 300);
  if (lastFocusedElement) {
    lastFocusedElement.focus();
    lastFocusedElement = null;
  }
}

// Keyboard handling while the modal is open: Escape closes it, and Tab stays
// on the close button (the dialog's only focusable control)
window.addEventListener('keydown', function(event) {
  const modal = document.getElementById('imageModal');
  if (modal.style.display !== 'block') {
    return;
  }
  if (event.key === 'Escape') {
    closeModal();
  } else if (event.key === 'Tab') {
    event.preventDefault();
    modal.querySelector('.modal-close').focus();
  }
});
