document.addEventListener('DOMContentLoaded', () => {
  const countriesGrid = document.getElementById('countries-grid');
  const searchInput = document.getElementById('search');
  const regionFilter = document.getElementById('region-filter');
  const themeToggle = document.getElementById('theme-toggle');
  let allCountries = []; // Store all countries for filtering

  // Fetch and display country cards
  async function fetchCountries() {
    try {
      const response = await fetch('https://restcountries.com/v3.1/all');
      allCountries = await response.json();
      displayCountries(allCountries);
    } catch (error) {
      console.error('Error fetching countries:', error);
      countriesGrid.innerHTML = `<p>Failed to load countries. Please try again later.</p>`;
    }
  }

  // Display country cards in the grid
  function displayCountries(countries) {
    countriesGrid.innerHTML = countries.map(country => `
      <div class="country-card" data-country="${country.cca3}">
        <img src="${country.flags.png}" alt="Flag of ${country.name.common}">
        <h3>${country.name.common}</h3>
        <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
        <p><strong>Region:</strong> ${country.region}</p>
      </div>
    `).join('');
  }

  // Filter countries by search and region
  function filterCountries() {
    const searchQuery = searchInput.value.toLowerCase();
    const selectedRegion = regionFilter.value;

    const filteredCountries = allCountries.filter(country => {
      const matchesRegion = selectedRegion === 'all' || country.region === selectedRegion;
      const matchesSearch = country.name.common.toLowerCase().includes(searchQuery);
      return matchesRegion && matchesSearch;
    });

    displayCountries(filteredCountries);
  }

  // Debounce function for search input
  function debounce(func, delay) {
    let debounceTimer;
    return function() {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => func.apply(this, arguments), delay);
    };
  }

  // Event listeners for search, region filter, and theme toggle
  function setupEventListeners() {
    searchInput.addEventListener('input', debounce(filterCountries,3000));
    regionFilter.addEventListener('change', filterCountries);
    themeToggle.addEventListener('click', toggleTheme);
  }

  // Function to toggle theme and update button text
  function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    updateThemeToggleText();
    localStorage.setItem('darkMode', isDarkMode);
  }

  // Update the theme toggle button text with appropriate icon
  function updateThemeToggleText() {
    themeToggle.innerHTML = document.body.classList.contains('dark-mode') 
      ? '<i class="fa-solid fa-sun"></i> Light Mode'
      : '<i class="fa-solid fa-moon"></i> Dark Mode';
  }

  // Initialize theme from localStorage
  function loadThemePreference() {
    if (localStorage.getItem('darkMode') === 'true') {
      document.body.classList.add('dark-mode');
    }
    updateThemeToggleText();
  }

  // Initialize application
  function init() {
    loadThemePreference();
    fetchCountries();
    setupEventListeners();
  }

  // Run the initializer
  init();
});
