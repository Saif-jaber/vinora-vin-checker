// Toggle light mode on checkbox change
const themeCheckbox = document.getElementById('theme-checkbox');
const logoImg = document.getElementById('logo-img');

themeCheckbox.addEventListener('change', () => {
  const isLight = themeCheckbox.checked;
  document.body.classList.toggle('light-theme', isLight);
  logoImg.src = isLight ? 'assets/logo light.png' : 'assets/logo dark.png';
});

// Scroll freeze helper
let scrollPosition = 0;
function freezeScroll() {
  scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
  document.body.style.position = 'fixed';
  document.body.style.top = `-${scrollPosition}px`;
  document.body.style.left = '0';
  document.body.style.right = '0';
  document.body.style.width = '100%';
  const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
  if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`;
  document.body.classList.add('no-scroll');
}
function unfreezeScroll() {
  document.body.classList.remove('no-scroll');
  document.body.style.position = '';
  document.body.style.top = '';
  document.body.style.left = '';
  document.body.style.right = '';
  document.body.style.width = '';
  document.body.style.paddingRight = '';
  window.scrollTo(0, scrollPosition);
}

// VIN logic
const vinForm = document.getElementById('vin-form');
const vinInput = document.getElementById('vin-input');
const resultDiv = document.getElementById('result');
const reportContainer = document.getElementById('report-container');
const overlay = document.getElementById('overlay');

vinForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  if (!vinInput.checkValidity()) {
    vinInput.reportValidity();
    return;
  }

  const vin = vinInput.value.trim().toUpperCase();
  if (!vin) return;

  // Show loader
  reportContainer.innerHTML = `
    <div class="loader-container">
      <div id="custom-loader" class="loader">
        <div class="loader-square"></div>
        <div class="loader-square"></div>
        <div class="loader-square"></div>
      </div>
      <div class="loader-text">Looking up VIN...</div>
    </div>
  `;

  //

  freezeScroll();
  resultDiv.classList.add('show');
  overlay.classList.add('show');

  try {
    const response = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/decodevinvaluesextended/${vin}?format=json`);
    const data = await response.json();
    const r = data.Results?.[0] || {};

    const resultHTML = `
      <div>
        <strong>Make:</strong> ${r.Make || 'N/A'}<br />
        <strong>Model:</strong> ${r.Model || 'N/A'}<br />
        <strong>Year:</strong> ${r.ModelYear || 'N/A'}<br />
        <strong>Manufacturer:</strong> ${r.Manufacturer || 'N/A'}<br />
        <strong>Vehicle Type:</strong> ${r.VehicleType || 'N/A'}<br />
        <strong>Body Class:</strong> ${r.BodyClass || 'N/A'}<br />
        <strong>Engine Cylinders:</strong> ${r.EngineCylinders || 'N/A'}<br />
        <strong>Engine Displacement (L):</strong> ${r.EngineDisplacementL || 'N/A'}<br />
        <strong>Fuel Type:</strong> ${r.FuelTypePrimary || 'N/A'}<br />
        <strong>Transmission:</strong> ${r.TransmissionStyle || 'N/A'}<br />
        <strong>Drive Type:</strong> ${r.DriveType || 'N/A'}<br />
        <strong>Plant Country:</strong> ${r.PlantCountry || 'N/A'}<br />
        <strong>Plant City:</strong> ${r.PlantCity || 'N/A'}
      </div>
      <button type="button" id="close-button" class="check-btn">
        <span class="button_top">Close</span>
      </button>
    `;

    reportContainer.innerHTML = resultHTML;

  } catch (err) {
    reportContainer.innerHTML = `
      <p>Error fetching VIN data.</p>
      <button type="button" id="close-button" class="check-btn">
        <span class="button_top">Close</span>
      </button>
    `;
  }
});

// Handle close button (delegated)
reportContainer.addEventListener('click', (e) => {
  if (e.target.closest('#close-button')) {
    // Start hide animation
    resultDiv.classList.remove('show');
    resultDiv.classList.add('hide');
    overlay.classList.remove('show');

    // Unfreeze scroll immediately
    unfreezeScroll();

    // Clear content and reset classes *after* animation duration (~300ms)
    setTimeout(() => {
      resultDiv.classList.remove('hide');
      reportContainer.innerHTML = '';
      vinInput.value = ''; // Clear input
    }, 300); // Adjust 300ms to match your CSS animation duration
  }
});


// Accessibility for close button
reportContainer.addEventListener('keydown', (e) => {
  if (e.target.closest('#close-button') && (e.key === 'Enter' || e.key === ' ')) {
    e.preventDefault();
    e.target.click();
  }
});

// Scanner placeholder
document.querySelector('.scanner-btn')?.addEventListener('click', () => {
  alert('Camera scanning feature coming soon!');
});

// Animate on scroll
document.addEventListener('DOMContentLoaded', () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
      else entry.target.classList.remove('visible');
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.card, .vin-subcard').forEach(el => observer.observe(el));
});
