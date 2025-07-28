// Toggle dark mode on checkbox change
const themeCheckbox = document.getElementById('theme-checkbox');

themeCheckbox.addEventListener('change', () => {
  document.body.classList.toggle('dark-mode', themeCheckbox.checked);
});

// VIN Form handling example (basic, replace with your API calls)
const vinForm = document.getElementById('vin-form');
const vinInput = document.getElementById('vin-input');
const resultDiv = document.getElementById('result');

vinForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const vin = vinInput.value.trim().toUpperCase();
  if (!vin || vin.length !== 17) {
    resultDiv.textContent = 'Please enter a valid 17-character VIN.';
    return;
  }
  
  resultDiv.textContent = 'Looking up VIN...';

  try {
    const response = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/decodevinvaluesextended/${vin}?format=json`);
    const data = await response.json();
    
    if (data.Results && data.Results.length > 0) {
      const info = data.Results[0];
      resultDiv.innerHTML = `
        <strong>Make:</strong> ${info.Make || 'N/A'}<br />
        <strong>Model:</strong> ${info.Model || 'N/A'}<br />
        <strong>Year:</strong> ${info.ModelYear || 'N/A'}<br />
        <strong>Manufacturer:</strong> ${info.Manufacturer || 'N/A'}
      `;
    } else {
      resultDiv.textContent = 'No data found for this VIN.';
    }
  } catch (err) {
    resultDiv.textContent = 'Error fetching VIN data.';
  }
});

// Scanner button (placeholder for now)
const scannerBtn = document.querySelector('.scanner-btn');
scannerBtn.addEventListener('click', () => {
  alert('Camera scanning feature coming soon!');
});


document.addEventListener('DOMContentLoaded', () => {
  let lastScrollY = window.pageYOffset;

  const observerOptions = { threshold: 0.1 };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const currentScrollY = window.pageYOffset;
      const scrollingDown = currentScrollY > lastScrollY;

      if (entry.isIntersecting) {
        // Element entered viewport → show it
        entry.target.classList.add('visible');
      } else {
        // Element left viewport
        if (scrollingDown) {
          // Scrolling down and element left viewport (top) → hide (slide down)
          entry.target.classList.remove('visible');
        } else {
          // Scrolling up and element left viewport (bottom) → hide (slide down)
          entry.target.classList.remove('visible');
        }
      }
      lastScrollY = currentScrollY;
    });
  }, observerOptions);

  document.querySelectorAll('.card, .vin-subcard').forEach(el => {
    observer.observe(el);
  });
});
