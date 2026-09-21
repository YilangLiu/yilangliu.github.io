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

  initializeNews();

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
  publications.forEach((publication, index) => {
    fragment.appendChild(createPublicationElement(publication, index));
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

// Progressively enhance the news: all updates remain readable without JavaScript.
function initializeNews() {
  const button = document.getElementById('toggle-news');
  const older = document.getElementById('older-news');
  if (!button || !older) return;
  older.hidden = true;
  button.hidden = false;
  button.setAttribute('aria-expanded', 'false');
  button.addEventListener('click', () => {
    older.hidden = !older.hidden;
    button.setAttribute('aria-expanded', String(!older.hidden));
    button.textContent = older.hidden ? 'Show older updates' : 'Show fewer updates';
  });
}

// Keep author order intact and ensure Yilang remains visible in the short list.
function createAuthors(names, index) {
  const authors = document.createElement('div');
  authors.className = 'pub-authors';
  const visibleCount = Math.max(6, names.findIndex(name => name.includes('Yilang Liu')) + 1);
  const remainder = document.createElement('span');
  remainder.id = `publication-authors-${index}`;
  remainder.hidden = true;

  names.forEach((name, authorIndex) => {
    const target = authorIndex < visibleCount ? authors : remainder;
    if (authorIndex > 0) target.appendChild(document.createTextNode(', '));
    const author = document.createElement('span');
    author.className = name.includes('Yilang Liu') ? 'pub-author highlight-name' : 'pub-author';
    author.textContent = name;
    target.appendChild(author);
  });

  if (names.length > visibleCount) {
    authors.appendChild(remainder);
    authors.appendChild(document.createTextNode(' '));
    const button = document.createElement('button');
    const count = names.length - visibleCount;
    const label = `${count} more ${count === 1 ? 'author' : 'authors'}`;
    button.type = 'button';
    button.className = 'author-toggle';
    button.textContent = label;
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-controls', remainder.id);
    button.addEventListener('click', () => {
      remainder.hidden = !remainder.hidden;
      button.setAttribute('aria-expanded', String(!remainder.hidden));
      button.textContent = remainder.hidden ? label : 'Fewer authors';
    });
    authors.appendChild(button);
  }

  if (names.some(name => name.includes('*'))) {
    const note = document.createElement('span');
    note.className = 'equal-note';
    note.textContent = ' (* equal contribution)';
    authors.appendChild(note);
  }
  return authors;
}

// Create HTML element for a publication
function createPublicationElement(publication, index = 0) {
  const pubItem = document.createElement('div');
  pubItem.className = 'publication-item';
  pubItem.dataset.selected = publication.selected;

  const primaryUrl = publication.links?.project || publication.links?.arxiv ||
    publication.links?.pdf || publication.links?.journal;
  const isVideo = /\.(mp4|webm|ogg|mov)$/i.test(publication.thumbnail);
  const previewUrl = isVideo ? (publication.links?.video || publication.thumbnail) : primaryUrl;
  const thumbnail = document.createElement(previewUrl ? 'a' : 'div');
  thumbnail.className = 'pub-thumbnail';

  if (previewUrl) {
    thumbnail.href = previewUrl;
    thumbnail.target = '_blank';
    thumbnail.rel = 'noopener';
    thumbnail.setAttribute('aria-label', `${isVideo ? 'Watch demo' : 'View paper'}: ${publication.title}`);
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
  }

  if (isVideo) {
    thumbnail.classList.add('pub-thumbnail-video');
    const video = document.createElement('video');
    video.src = publication.thumbnail;
    video.muted = true;
    video.setAttribute('muted', '');
    video.loop = true;
    video.playsInline = true;
    video.preload = 'metadata';
    video.setAttribute('aria-hidden', 'true');
    if (publication.poster) video.poster = publication.poster;
    // Reduced-motion visitors can open the full video using the preview link.
    if (!prefersReducedMotion) videoObserver.observe(video);
    thumbnail.appendChild(video);
  } else {
    const img = document.createElement('img');
    img.src = publication.thumbnail;
    img.alt = `${publication.title} thumbnail`;
    img.loading = 'lazy';
    img.decoding = 'async';
    thumbnail.appendChild(img);
  }

  // Create content container
  const content = document.createElement('div');
  content.className = 'pub-content';

  // Add title
  const title = document.createElement('h3');
  title.className = 'pub-title';
  if (primaryUrl) {
    const titleLink = document.createElement('a');
    titleLink.href = primaryUrl;
    titleLink.target = '_blank';
    titleLink.rel = 'noopener';
    titleLink.textContent = publication.title;
    title.appendChild(titleLink);
  } else {
    title.textContent = publication.title;
  }
  content.appendChild(title);

  content.appendChild(createAuthors(publication.authors, index));

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

  if (publication.summary) {
    const takeaway = document.createElement('p');
    takeaway.className = 'pub-takeaway';
    takeaway.textContent = publication.summary;
    content.appendChild(takeaway);
  }

  // Add links if they exist
  if (publication.links) {
    const links = document.createElement('div');
    links.className = 'pub-links';

    const linkTypes = [
      ['pdf', '[PDF]', 'PDF'],
      ['arxiv', '[arXiv]', 'arXiv page'],
      ['journal', '[Journal]', 'Journal version'],
      ['code', '[Code]', 'Code'],
      ['project', '[Project Page]', 'Project page'],
      ['video', '[Video]', 'Full demo video']
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
