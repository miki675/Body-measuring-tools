// JavaScript file for Body Fat Percentage Calculator
// This code has been updated with new validation rules as per user request.

// Global state variables
let isMetric = true;
let selectedGender = 'female';
let currentSlideIndex = 0;

// Element references
let calculatorHeader;
let unitToggle;
let abcd; // New variable for the abcd section

document.addEventListener('DOMContentLoaded', function () {
    // Find the header element once the DOM is loaded
    calculatorHeader = document.querySelector('.calculator-header');
    unitToggle = document.querySelector('.unit-toggle');
    abcd = document.getElementById('abcd'); // Reference to the abcd section
    initializeCalculator();
});

// Initializes the calculator and sets up event listeners
function initializeCalculator() {
    setupEventListeners();
    toggleUnits(true); // Default to Metric
    updateActiveRadio();
    // Initially, hide the result container and the slider section
    const resultDiv = document.getElementById('result');
    const sliderSection = document.querySelector('.you-may-like-section');
    if (resultDiv) {
        resultDiv.style.display = 'none';
    }
    if (sliderSection) {
        sliderSection.style.display = 'none';
    }
}

// Updates the active radio button state and shows/hides hip measurements based on gender
function updateActiveRadio() {
    document.querySelectorAll('.radio-input').forEach(radio => {
        if (radio.getAttribute('data-value') === selectedGender) {
            radio.classList.add('checked');
        } else {
            radio.classList.remove('checked');
        }
    });

    const hipGroup = document.getElementById('hip-group');
    if (hipGroup) {
        // Hip fields hamesha show karenge, gender ke base pe formula change hoga
        hipGroup.style.display = 'block';

        // Imperial/Metric ke hisab se hip fields show/hide karna
        const hipMetric = document.getElementById('hip-metric');
        const hipImperial = document.getElementById('hip-imperial');

        if (hipMetric && hipImperial) {
            if (isMetric) {
                hipMetric.style.setProperty('display', 'flex', 'important');
                hipImperial.style.setProperty('display', 'none', 'important');
            } else {
                hipMetric.style.setProperty('display', 'none', 'important');
                hipImperial.style.setProperty('display', 'flex', 'important');
            }
        }
    }
}

// Sets up all the event listeners for the buttons and radio options
function setupEventListeners() {
    document.getElementById('imperial').addEventListener('click', () => toggleUnits(false));
    document.getElementById('metric').addEventListener('click', () => toggleUnits(true));
    document.getElementById('femaleRadio').addEventListener('click', () => {
        selectedGender = 'female';
        updateActiveRadio();
    });
    document.getElementById('maleRadio').addEventListener('click', () => {
        selectedGender = 'male';
        updateActiveRadio();
    });

    // Calculate button with form submit prevention
    const calculateBtn = document.getElementById('calculateBtn');
    const form = document.getElementById('calculatorForm');

    if (calculateBtn) {
        calculateBtn.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent form submission
            calculateResults();
        });
    }

    if (form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent form submission
            calculateResults();
        });
    }

    document.getElementById('clearBtn').addEventListener('click', function(event) {
        event.preventDefault();
        clearForm();
    });

    // Updated button listener for the result screen
    const calculateAgainBtn = document.getElementById('calculateAgainBtn');
    if (calculateAgainBtn) {
        calculateAgainBtn.addEventListener('click', function(event) {
            event.preventDefault();
            showCalculator();
        });
    }
}

function toggleUnits(metric) {
    isMetric = metric;
    document.getElementById('metric').classList.toggle('active', metric);
    document.getElementById('imperial').classList.toggle('active', !metric);

    document.getElementById('weight-unit').textContent = metric ? 'kg' : 'lbs';

    // Use setProperty with !important to override CSS
    if (metric) {
        // Show metric, hide imperial
        document.getElementById('metric-height').style.setProperty('display', 'flex', 'important');
        document.getElementById('imperial-height').style.setProperty('display', 'none', 'important');

        document.getElementById('neck-metric').style.setProperty('display', 'flex', 'important');
        document.getElementById('neck-imperial').style.setProperty('display', 'none', 'important');

        document.getElementById('waist-metric').style.setProperty('display', 'flex', 'important');
        document.getElementById('waist-imperial').style.setProperty('display', 'none', 'important');

        // Hip fields
        document.getElementById('hip-metric').style.setProperty('display', 'flex', 'important');
        document.getElementById('hip-imperial').style.setProperty('display', 'none', 'important');
    } else {
        // Show imperial, hide metric
        document.getElementById('metric-height').style.setProperty('display', 'none', 'important');
        document.getElementById('imperial-height').style.setProperty('display', 'flex', 'important');

        document.getElementById('neck-metric').style.setProperty('display', 'none', 'important');
        document.getElementById('neck-imperial').style.setProperty('display', 'flex', 'important');

        document.getElementById('waist-metric').style.setProperty('display', 'none', 'important');
        document.getElementById('waist-imperial').style.setProperty('display', 'flex', 'important');

        // Hip fields
        document.getElementById('hip-metric').style.setProperty('display', 'none', 'important');
        document.getElementById('hip-imperial').style.setProperty('display', 'flex', 'important');
    }

    updateActiveRadio();
    document.getElementById('weight').placeholder = metric ? '75' : '165';
    clearInputs();

    // Hide error message when changing units
    const errorBox = document.getElementById('errorMessage');
    if (errorBox) {
        errorBox.style.display = 'none';
    }
}

// Clears all input fields
function clearInputs() {
    document.getElementById('weight').value = '';
    document.getElementById('age').value = '';
    document.getElementById('cm').value = '';
    document.getElementById('feet').value = '';
    document.getElementById('inches').value = '';
    document.getElementById('neckCm').value = '';
    document.getElementById('neckFeet').value = '';
    document.getElementById('neckInches').value = '';
    document.getElementById('waistCm').value = '';
    document.getElementById('waistFeet').value = '';
    document.getElementById('waistInches').value = '';
    const hipCm = document.getElementById('hipCm');
    const hipFeet = document.getElementById('hipFeet');
    const hipInches = document.getElementById('hipInches');

    if (hipCm) hipCm.value = '';
    if (hipFeet) hipFeet.value = '';
    if (hipInches) hipInches.value = '';
}

// Validates the user's input before calculation
function validateInputs() {
    const weight = parseFloat(document.getElementById('weight').value);
    const age = parseInt(document.getElementById('age').value);
    const errors = [];
    const errorBox = document.getElementById('errorMessage');

    // Clear previous error messages
    errorBox.innerHTML = '';
    errorBox.style.display = 'none';

    // Basic validations
    if (isMetric) {
        if (isNaN(weight) || weight < 40 || weight > 250) errors.push("Please enter a valid weight in kg (40-250 kg).");
    } else {
        if (isNaN(weight) || weight < 90 || weight > 550) errors.push("Please enter a valid weight in lbs (90-550 lbs).");
    }
    if (isNaN(age) || age < 18 || age > 100) errors.push("Please enter a valid age between 18 and 100.");

    let heightCm, neckCm, waistCm, hipCm = 0;

    if (isMetric) {
        heightCm = parseFloat(document.getElementById('cm').value);
        if (isNaN(heightCm) || heightCm < 121 || heightCm > 250) errors.push("Please enter a valid height in cm (121-250 cm).");

        neckCm = parseFloat(document.getElementById('neckCm').value);
        if (isNaN(neckCm) || neckCm < 10 || neckCm > 40) errors.push("Please enter a valid neck measurement in cm (10-40 cm).");

        waistCm = parseFloat(document.getElementById('waistCm').value);
        if (isNaN(waistCm) || waistCm < 41 || waistCm > 178) errors.push("Please enter a valid waist measurement in cm (41-178 cm).");

        hipCm = parseFloat(document.getElementById('hipCm').value);
        if (isNaN(hipCm) || hipCm < 41 || hipCm > 307) errors.push("Please enter a valid hip measurement in cm (41-307 cm).");
    } else {
        const ft = parseFloat(document.getElementById('feet').value) || 0;
        const inches = parseFloat(document.getElementById('inches').value) || 0;
        if (isNaN(ft) || ft < 1 || ft > 8 || isNaN(inches) || inches < 0 || inches > 11) errors.push("Please enter a valid height in feet (1-8) and inches (0-11).");
        heightCm = (ft * 12 + inches) * 2.54;

        const neckFt = parseFloat(document.getElementById('neckFeet').value) || 0;
        const neckIn = parseFloat(document.getElementById('neckInches').value) || 0;
        const totalNeckInches = neckFt * 12 + neckIn;
        if (isNaN(totalNeckInches) || totalNeckInches <= 0 || totalNeckInches > 23) errors.push("Please enter a valid neck measurement (max 1ft 11in).");
        neckCm = totalNeckInches * 2.54;

        const waistFt = parseFloat(document.getElementById('waistFeet').value) || 0;
        const waistIn = parseFloat(document.getElementById('waistInches').value) || 0;
        const totalWaistInches = waistFt * 12 + waistIn;
        if (isNaN(totalWaistInches) || totalWaistInches <= 0 || totalWaistInches > 67) errors.push("Please enter a valid waist measurement (max 5ft 7in).");
        waistCm = totalWaistInches * 2.54;

        const hipFt = parseFloat(document.getElementById('hipFeet').value) || 0;
        const hipIn = parseFloat(document.getElementById('hipInches').value) || 0;
        const totalHipInches = hipFt * 12 + hipIn;
        if (isNaN(totalHipInches) || totalHipInches <= 0 || totalHipInches > 120) errors.push("Please enter a valid hip measurement (max 10ft)."); // Converted 307cm to approx 120 inches
        hipCm = totalHipInches * 2.54;
    }

    if (errors.length > 0) {
        const errorList = errors.map(err => `<li>${err}</li>`).join('');
        errorBox.innerHTML = `<ul>${errorList}</ul>`;
        errorBox.style.display = 'block';
        return false;
    }
    return true;
}

// Performs the body fat percentage calculation
function calculateResults() {
    console.log('Calculate button clicked');
    console.log('Current gender:', selectedGender);
    console.log('Current unit system:', isMetric ? 'Metric' : 'Imperial');

    // Hide previous results and slider section first
    const resultDiv = document.getElementById('result');
    const sliderSection = document.querySelector('.you-may-like-section');
    if (resultDiv) {
        resultDiv.style.display = 'none';
    }
    if (sliderSection) {
        sliderSection.style.display = 'none';
    }

    // Validate inputs
    if (!validateInputs()) {
        console.log('Validation failed');
        return; // Stop execution here if validation fails
    }

    console.log('Validation passed, proceeding with calculation');

    let heightCm, neckCm, waistCm, hipCm = 0;

    if (isMetric) {
        console.log('Using metric system');
        const cmInput = document.getElementById('cm');
        const neckInput = document.getElementById('neckCm');
        const waistInput = document.getElementById('waistCm');
        const hipInput = document.getElementById('hipCm');

        heightCm = cmInput ? parseFloat(cmInput.value) : 0;
        neckCm = neckInput ? parseFloat(neckInput.value) : 0;
        waistCm = waistInput ? parseFloat(waistInput.value) : 0;
        hipCm = hipInput ? parseFloat(hipInput.value) : 0;

        console.log('Metric values:', { heightCm, neckCm, waistCm, hipCm });
    } else {
        console.log('Using imperial system');
        // Imperial calculations
        const feetInput = document.getElementById('feet');
        const inchesInput = document.getElementById('inches');
        const ft = feetInput ? parseFloat(feetInput.value) || 0 : 0;
        const inches = inchesInput ? parseFloat(inchesInput.value) || 0 : 0;
        heightCm = (ft * 12 + inches) * 2.54;
        console.log('Height conversion - Feet:', ft, 'Inches:', inches, 'Total CM:', heightCm);

        const neckFtInput = document.getElementById('neckFeet');
        const neckInInput = document.getElementById('neckInches');
        const waistFtInput = document.getElementById('waistFeet');
        const waistInInput = document.getElementById('waistInches');
        const hipFtInput = document.getElementById('hipFeet');
        const hipInInput = document.getElementById('hipInches');

        const neckFt = neckFtInput ? parseFloat(neckFtInput.value) || 0 : 0;
        const neckIn = neckInInput ? parseFloat(neckInInput.value) || 0 : 0;
        const waistFt = waistFtInput ? parseFloat(waistFtInput.value) || 0 : 0;
        const waistIn = waistInInput ? parseFloat(waistInInput.value) || 0 : 0;
        const hipFt = hipFtInput ? parseFloat(hipFtInput.value) || 0 : 0;
        const hipIn = hipInInput ? parseFloat(hipInInput.value) || 0 : 0;

        neckCm = (neckFt * 12 + neckIn) * 2.54;
        waistCm = (waistFt * 12 + waistIn) * 2.54;
        hipCm = (hipFt * 12 + hipIn) * 2.54;

        console.log('Imperial values converted to CM:', { heightCm, neckCm, waistCm, hipCm });
    }

    console.log('Final values for calculation:', { heightCm, neckCm, waistCm, hipCm, selectedGender });

    let bodyFatPercentage;
    if (selectedGender === 'male') {
        console.log('Using male formula');
        // US Navy formula for men
        bodyFatPercentage = 86.010 * Math.log10(waistCm - neckCm) - 70.041 * Math.log10(heightCm) + 36.76;
    } else {
        console.log('Using female formula');
        // US Navy formula for women
        bodyFatPercentage = 163.205 * Math.log10(waistCm + hipCm - neckCm) - 97.684 * Math.log10(heightCm) - 104.912;
    }

    console.log('Raw calculated body fat percentage:', bodyFatPercentage);

    // Clamp the result to a reasonable range
    bodyFatPercentage = Math.max(2, Math.min(55, bodyFatPercentage));

    console.log('Final body fat percentage:', bodyFatPercentage);

    displayResults(bodyFatPercentage);
}

// Displays the calculated results and updates the UI
function displayResults(bodyFatPercentage) {
    console.log('displayResults called with:', bodyFatPercentage);

    const resultValue = bodyFatPercentage.toFixed(1);
    console.log('Formatted result value:', resultValue);

    // Update result value
    const resultValueElement = document.getElementById('result-value');
    if (resultValueElement) {
        resultValueElement.textContent = `${resultValue}%`;
        console.log('Updated result-value element');
    } else {
        console.error('result-value element not found');
    }

    let category = '';
    let position = 0;

    if (selectedGender === 'male') {
        if (bodyFatPercentage <= 5) {
            category = 'Essential';
            position = 8;
        } else if (bodyFatPercentage <= 13) {
            category = 'Athletes';
            position = 25;
        } else if (bodyFatPercentage <= 17) {
            category = 'Fitness';
            position = 40;
        } else if (bodyFatPercentage <= 24) {
            category = 'Average';
            position = 60;
        } else {
            category = 'Obese';
            position = 85;
        }
    } else { // female
        if (bodyFatPercentage <= 13) {
            category = 'Essential';
            position = 8;
        } else if (bodyFatPercentage <= 20) {
            category = 'Athletes';
            position = 25;
        } else if (bodyFatPercentage <= 24) {
            category = 'Fitness';
            position = 40;
        } else if (bodyFatPercentage <= 31) {
            category = 'Average';
            position = 60;
        } else {
            category = 'Obese';
            position = 85;
        }
    }

    console.log('Category and position:', category, position);

    // Update indicator position
    const indicatorElement = document.getElementById('result-indicator');
    if (indicatorElement) {
        indicatorElement.style.left = `${position}%`;
        console.log('Updated indicator position');
    } else {
        console.error('result-indicator element not found');
    }

    // Update description
    const descriptionElement = document.getElementById('result-description');
    if (descriptionElement) {
        descriptionElement.textContent =
            `Your body fat percentage of ${resultValue}% falls in the ${category} category. This should be used as a guide only, and if you are concerned about your body fat percentage, we suggest you speak to a doctor or nurse about this.`;
        console.log('Updated description');
    } else {
        console.error('result-description element not found');
    }

    // Hide the form and show the result
    const calculatorForm = document.getElementById('calculatorForm');
    const resultContainer = document.getElementById('result');
    const sliderSection = document.querySelector('.you-may-like-section');

    if (calculatorForm && resultContainer) {
        calculatorForm.style.display = 'none';
        if (calculatorHeader) {
            calculatorHeader.style.display = 'none';
        }
        resultContainer.style.display = 'block';
        if (unitToggle) {
            unitToggle.style.display = 'none'; // Hide the unit toggle as requested
        }
        if (abcd) {
            abcd.style.display = 'block'; // Show the abcd section as requested
        }
        console.log('Form hidden, result shown');

        // Show slider section if it exists
        if (sliderSection) {
            sliderSection.style.display = 'block';
            console.log('Slider section shown');
            updateSlider();
            startAutoSlide(); // Start auto-sliding when results are shown
        }

        // Scroll to result
        resultContainer.scrollIntoView({ behavior: 'smooth' });
    } else {
        console.error('Form or result container not found');
        console.log('calculatorForm:', calculatorForm);
        console.log('resultContainer:', resultContainer);
    }
}

// Clears the form and shows it again
function clearForm() {
    clearInputs();
    const errorBox = document.getElementById('errorMessage');
    const resultDiv = document.getElementById('result');
    const sliderSection = document.querySelector('.you-may-like-section');

    // Hide error message
    if (errorBox) {
        errorBox.style.display = 'none';
    }

    // Hide result and slider section
    if (resultDiv) {
        resultDiv.style.display = 'none';
    }
    if (sliderSection) {
        sliderSection.style.display = 'none';
    }

    // Stop auto-sliding
    stopAutoSlide();
}

// Hides the result and shows the calculator form
function showCalculator() {
    const resultDiv = document.getElementById('result');
    const calculatorForm = document.getElementById('calculatorForm');
    const sliderSection = document.querySelector('.you-may-like-section');

    if (resultDiv) {
        resultDiv.style.display = 'none';
    }
    if (calculatorForm) {
        calculatorForm.style.display = 'block';
        if (abcd) {
            abcd.style.display = 'none'; // Hide the abcd section as requested
        }
        if (calculatorHeader) {
            calculatorHeader.style.display = 'flex';
        }
    }
    if (unitToggle) {
        unitToggle.style.display = 'flex'; // Show the unit toggle again
    }
    if (sliderSection) {
        sliderSection.style.display = 'none';
    }

    // Stop auto-sliding when form is shown
    stopAutoSlide();

    // Scroll to form
    if (calculatorForm) {
        calculatorForm.scrollIntoView({ behavior: 'smooth' });
    }
}
