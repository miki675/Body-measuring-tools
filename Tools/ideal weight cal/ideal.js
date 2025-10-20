// Ideal Weight Calculator JavaScript
// Get elements
const unitBtns = document.querySelectorAll('.unit-btn');
const imperialHeight = document.getElementById('imperial-height');
const metricHeight = document.getElementById('metric-height');
const calculatorForm = document.getElementById('calculatorForm');
const clearBtn = document.getElementById('clearBtn');
const errorContainer = document.getElementById('error-messages');
const radioInputs = document.querySelectorAll('.radio-input');
const calculatorHeader = document.querySelector('.calculator-header'); // Assumed selector for the header
const unitToggle = document.querySelector('.unit-toggle'); // Assumed a class for the unit toggle div

let currentUnit = 'metric';
let selectedGender = 'female'; // Default from your HTML

// Initial state setup
document.addEventListener('DOMContentLoaded', () => {
    // Set default active button
    const metricBtn = document.querySelector('.unit-btn[data-unit="metric"]');
    if (metricBtn) metricBtn.classList.add('active');

    const femaleRadio = document.querySelector('.radio-input[data-value="female"]');
    if (femaleRadio) femaleRadio.classList.add('checked');
    
    toggleUnits('metric');
});

// Unit toggle functionality
unitBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        const unit = this.getAttribute('data-unit');
        currentUnit = unit;

        // Update active button
        unitBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');

        // Show/hide height inputs
        toggleUnits(unit);
    });
});

function toggleUnits(unit) {
    if (unit === 'imperial') {
        imperialHeight.style.display = 'flex';
        metricHeight.style.display = 'none';
    } else {
        imperialHeight.style.display = 'none';
        metricHeight.style.display = 'block';
    }
    hideError();
}

// Radio button functionality
radioInputs.forEach(radio => {
    radio.addEventListener('click', function() {
        radioInputs.forEach(r => r.classList.remove('checked'));
        this.classList.add('checked');
        selectedGender = this.getAttribute('data-value');
    });
});

// Clear form functionality
clearBtn.addEventListener('click', function() {
    // Clear all inputs
    document.getElementById('feet').value = '';
    document.getElementById('inches').value = '';
    document.getElementById('cm').value = '';
    document.getElementById('age').value = '';

    // Reset gender to female (default)
    radioInputs.forEach(r => r.classList.remove('checked'));
    document.querySelector('[data-value="female"]').classList.add('checked');
    selectedGender = 'female';

    // Hide error messages
    hideError();

    // Show form and hide results if visible
    showForm();
});

// Form submission
calculatorForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const validation = validateInputs();
    if (!validation.isValid) {
        showError(validation.errors);
        return;
    }

    // Calculate and show results
    const results = calculateIdealWeight(validation.heightCm, validation.age, selectedGender);
    showResults(results);
});

function validateInputs() {
    const errors = [];
    let heightCm = 0;
    let age = 0;

    // Validate height
    if (currentUnit === 'metric') {
        const cm = parseFloat(document.getElementById('cm').value);
        if (isNaN(cm) || cm < 121 || cm > 250) {
            errors.push('Height must be between 121-250 cm');
        } else {
            heightCm = cm;
        }
    } else { // Imperial Validation (feet & inches)
        const feet = parseFloat(document.getElementById('feet').value);
        const inches = parseFloat(document.getElementById('inches').value);
        
        if (isNaN(feet) || feet < 1 || feet > 8 || isNaN(inches) || inches < 0 || inches > 11) {
             errors.push('Height must be between 1-8 feet and 0-11 inches.');
        }

        // Only proceed if no errors from above checks
        if (errors.length === 0) {
            heightCm = (feet * 12 + inches) * 2.54;
        }
    }

    // Validate age
    const ageInput = parseFloat(document.getElementById('age').value);
    if (isNaN(ageInput) || ageInput < 18 || ageInput > 100) {
        errors.push('Age must be between 18-100 years');
    } else {
        age = ageInput;
    }

    return {
        isValid: errors.length === 0,
        errors: errors,
        heightCm: heightCm,
        age: age
    };
}

function calculateIdealWeight(heightCm, age, gender) {
    // Convert height to inches for formulas
    const heightInches = heightCm / 2.54;

    // Devine Formula (1974)
    let devine;
    if (gender === 'male') {
        devine = 50 + 2.3 * (heightInches - 60);
    } else {
        devine = 45.5 + 2.3 * (heightInches - 60);
    }

    // Robinson Formula (1983)
    let robinson;
    if (gender === 'male') {
        robinson = 52 + 1.9 * (heightInches - 60);
    } else {
        robinson = 49 + 1.7 * (heightInches - 60);
    }

    // Miller Formula (1983)
    let miller;
    if (gender === 'male') {
        miller = 56.2 + 1.41 * (heightInches - 60);
    } else {
        miller = 53.1 + 1.36 * (heightInches - 60);
    }

    // Hamwi Formula (1964)
    let hamwi;
    if (gender === 'male') {
        hamwi = 48 + 2.7 * (heightInches - 60);
    } else {
        hamwi = 45.5 + 2.2 * (heightInches - 60);
    }

    // Healthy BMI Range (18.5-24.9)
    const heightM = heightCm / 100;
    const minHealthy = 18.5 * (heightM * heightM);
    const maxHealthy = 24.9 * (heightM * heightM);

    return {
        devine: Math.round(devine),
        robinson: Math.round(robinson),
        miller: Math.round(miller),
        hamwi: Math.round(hamwi),
        healthyRange: `${Math.round(minHealthy)}-${Math.round(maxHealthy)}`
    };
}

function showError(errors) {
    errorContainer.innerHTML = errors.join('<br>');
    errorContainer.style.display = 'block';
    // Ensure form is visible to show error
    const formContent = document.querySelector('.form-content');
    if (formContent) {
        formContent.style.display = 'block';
    }
}

function hideError() {
    errorContainer.style.display = 'none';
    errorContainer.innerHTML = '';
}

function showResults(results) {
    hideError();

    // Hide the form and show the result section
    const formContent = document.querySelector('.form-content');
    if (formContent) {
        formContent.style.display = 'none';
    }
    const sliderSection = document.getElementById('abcd');
    if (sliderSection) {
        sliderSection.style.display = 'flex';
    }
    if (calculatorHeader) {
        calculatorHeader.style.display = 'none';
    }
    
    // Now dynamically create and show the results section as before
    const resultsHTML = `
        <div id="results-section" class="results-content">
            <h3>The ideal weight based on popular formulas:</h3>
            <div class="results-grid">
                <div class="result-card">
                    <div class="weight-value">${results.robinson}<span class="unit">kg</span></div>
                    <div class="formula-name">Robinson</div>
                    <div class="formula-year">(1983)</div>
                </div>
                <div class="result-card">
                    <div class="weight-value">${results.miller}<span class="unit">kg</span></div>
                    <div class="formula-name">Miller</div>
                    <div class="formula-year">(1983)</div>
                </div>
                <div class="result-card healthy-range">
                    <div class="weight-value">${results.healthyRange}<span class="unit">kg</span></div>
                    <div class="formula-name">Healthy BMI Range</div>
                </div>
                <div class="result-card">
                    <div class="weight-value">${results.devine}<span class="unit">kg</span></div>
                    <div class="formula-name">Devine</div>
                    <div class="formula-year">(1974)</div>
                </div>
                <div class="result-card">
                    <div class="weight-value">${results.hamwi}<span class="unit">kg</span></div>
                    <div class="formula-name">Hamwi</div>
                    <div class="formula-year">(1964)</div>
                </div>
            </div>
            <p class="result-description">
                Ideal weight calculator is a simple and easy-to-use weight loss calculator. This 
                simple-to-use application will help you find the ideal weight range that is right for 
                you using your personal information.
            </p>
            <div class="result-actions">
                <button type="button" class="btn btn-primary" id="unlockPlan">Unlock Your Custom Plan!</button>
                <!-- Calculate again ko <a> tag se replace kar diya gaya hai -->
                <a href="ideal.html" class="btn btn-secondary" id="calculateAgain">Calculate again</a>
            </div>
        </div>
    `;

    // Remove old results if they exist before inserting new ones
    const oldResultsSection = document.getElementById('results-section');
    if (oldResultsSection) {
        oldResultsSection.remove();
    }
    
    // Insert results after the form
    if (formContent) {
        formContent.insertAdjacentHTML('afterend', resultsHTML);
    }
}

// showForm function ko bas clear button ke liye use kiya gaya hai.
function showForm() {
    const formContent = document.querySelector('.form-content');
    const resultsSection = document.getElementById('results-section');
    const sliderSection = document.getElementById('abcd');
    
    if (formContent) {
        formContent.style.display = 'block';
    }
    if (unitToggle) { 
        unitToggle.style.display = 'flex';
    }
    if (calculatorHeader) {
        calculatorHeader.style.display = 'flex';
    }
    if (resultsSection) {
        resultsSection.style.display = 'none';
        resultsSection.remove(); // Also remove it from the DOM
    }
    if (sliderSection) { 
        sliderSection.style.display = 'none';
    }
}
