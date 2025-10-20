document.addEventListener('DOMContentLoaded', function() {
    // Global variables
    let isMetric = true;
    let selectedGender = 'female';

    // DOM elements
    const unitBtns = document.querySelectorAll('.unit-btn');
    const weightInput = document.getElementById('weight');
    const cmInput = document.getElementById('cm');
    const feetInput = document.getElementById('feet');
    const inchesInput = document.getElementById('inches');
    const ageInput = document.getElementById('age');
    const weightUnit = document.getElementById('weight-unit');
    const metricHeight = document.getElementById('metric-height');
    const imperialHeight = document.getElementById('imperial-height');
    const radioInputs = document.querySelectorAll('.radio-input');
    const clearBtn = document.getElementById('clearBtn');
    const calculatorForm = document.getElementById('calculatorForm');
    const resultsContainer = document.getElementById('resultsContainer');
    const resultsGrid = document.getElementById('resultsGrid');
    const calculateAgainBtn = document.getElementById('calculateAgainBtn');
    const errorMessageDiv = document.getElementById('errorMessage');

    // Added elements as per user request
    const unitToggle = document.getElementById('unit-toggle'); // Assuming this ID
    const calculatorHeader = document.getElementById('calculator-header'); // Assuming this ID
    const abcd = document.getElementById('abcd'); // Assuming this ID

    // Custom Dropdown Elements
    const activityDropdown = document.getElementById('activityDropdown');
    const goalDropdown = document.getElementById('daily_goal');
    const activityLevelInput = document.getElementById('activityLevel');
    const dailyGoalInput = document.getElementById('dailyGoal');

    // Initialize
    initializeCustomDropdowns();
    
    // Unit toggle event listeners
    unitBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const unit = this.getAttribute('data-unit');
            if (unit === 'metric') {
                switchToMetric();
            } else {
                switchToImperial();
            }
        });
    });

    // Gender selection
    radioInputs.forEach(input => {
        input.addEventListener('click', () => selectGender(input));
    });

    // Button event listeners
    clearBtn.addEventListener('click', clearForm);
    if (calculateAgainBtn) {
        calculateAgainBtn.addEventListener('click', showCalculatorForm);
    }

    // Form submit
    calculatorForm.addEventListener('submit', function(e) {
        e.preventDefault();
        calculateFatIntake();
    });

    // Custom dropdown functionality
    function initializeCustomDropdowns() {
        // Activity dropdown
        if (activityDropdown) {
            const activityTrigger = activityDropdown.querySelector('.custom-select-trigger');
            const activityItems = activityDropdown.querySelectorAll('.custom-option:not(.default-option)');

            activityTrigger.addEventListener('click', function(e) {
                e.stopPropagation();
                activityDropdown.classList.toggle('open');
                goalDropdown.classList.remove('open');
            });

            activityItems.forEach(item => {
                item.addEventListener('click', function() {
                    const value = this.getAttribute('data-value');
                    const text = this.textContent;
                    activityTrigger.textContent = text;
                    activityLevelInput.value = value;
                    activityDropdown.classList.remove('open');
                });
            });
        }

        // Goal dropdown
        if (goalDropdown) {
            const goalTrigger = goalDropdown.querySelector('.custom-select-trigger');
            const goalItems = goalDropdown.querySelectorAll('.custom-option:not(.default-option)');

            goalTrigger.addEventListener('click', function(e) {
                e.stopPropagation();
                goalDropdown.classList.toggle('open');
                activityDropdown.classList.remove('open');
            });

            goalItems.forEach(item => {
                item.addEventListener('click', function() {
                    const value = this.getAttribute('data-value');
                    const text = this.textContent;
                    goalTrigger.textContent = text;
                    dailyGoalInput.value = value;
                    goalDropdown.classList.remove('open');
                });
            });
        }
        // Close dropdowns when clicking outside
        document.addEventListener('click', function(e) {
            if (activityDropdown && !activityDropdown.contains(e.target)) {
                activityDropdown.classList.remove('open');
            }
            if (goalDropdown && !goalDropdown.contains(e.target)) {
                goalDropdown.classList.remove('open');
            }
        });
    }

    // Switch to Imperial
    function switchToImperial() {
        isMetric = false;
        unitBtns.forEach(btn => btn.classList.remove('active'));
        document.querySelector('[data-unit="imperial"]').classList.add('active');
        
        weightInput.placeholder = '154';
        weightUnit.textContent = 'lbs';
        
        if (metricHeight) metricHeight.style.display = 'none';
        if (imperialHeight) {
            imperialHeight.classList.remove('metric-hidden');
            imperialHeight.style.display = 'flex';
        }
    }

    // Switch to Metric
    function switchToMetric() {
        isMetric = true;
        unitBtns.forEach(btn => btn.classList.remove('active'));
        document.querySelector('[data-unit="metric"]').classList.add('active');
        
        weightInput.placeholder = '70';
        weightUnit.textContent = 'kg';
        
        if (imperialHeight) {
            imperialHeight.classList.add('metric-hidden');
            imperialHeight.style.display = 'none';
        }
        if (metricHeight) metricHeight.style.display = 'block';
    }

    // Select gender
    function selectGender(clickedInput) {
        radioInputs.forEach(input => input.classList.remove('checked'));
        clickedInput.classList.add('checked');
        selectedGender = clickedInput.dataset.value;
    }

    // Clear form
    function clearForm() {
        weightInput.value = '';
        if (cmInput) cmInput.value = '';
        if (feetInput) feetInput.value = '';
        if (inchesInput) inchesInput.value = '';
        ageInput.value = '';
        
        // Reset dropdowns
        if (activityDropdown) {
            activityDropdown.querySelector('.custom-select-trigger').textContent = 'Select your activity level';
            activityLevelInput.value = '';
        }
        if (goalDropdown) {
            goalDropdown.querySelector('.custom-select-trigger').textContent = 'Select your goal';
            dailyGoalInput.value = '';
        }
        
        if (errorMessageDiv) errorMessageDiv.style.display = 'none';
        
        // Reset to female
        radioInputs.forEach(input => input.classList.remove('checked'));
        if (radioInputs[1]) radioInputs[1].classList.add('checked');
        selectedGender = 'female';
    }

    // Validate inputs
    function validateInputs() {
        const weight = parseFloat(weightInput.value);
        const age = parseInt(ageInput.value);
        const activity = activityLevelInput.value;
        const goal = dailyGoalInput.value;
        
        let height = null;
        let errors = [];

        // Get height and validate based on units
        if (isMetric) {
            height = parseFloat(cmInput?.value);
            if (!height || height < 121 || height > 250) {
                errors.push("Height must be between 121 and 250 cm.");
            }
        } else {
            const feet = parseFloat(feetInput?.value);
            const inches = parseFloat(inchesInput?.value);

            if (!feet || feet < 1 || feet > 8 || !inches || inches < 0 || inches > 11) {
                errors.push("Please enter a valid height between 1'0\" and 8'11\".");
            }
            height = (feet * 12) + inches; // Keep this for calculation purposes
        }

        // Validation for weight
        if (isMetric) {
            if (!weight || weight < 30 || weight > 300) {
                errors.push("Weight must be between 30 and 300 kg.");
            }
        } else {
            if (!weight || weight < 90 || weight > 550) {
                errors.push("Weight must be between 90 and 550 lbs.");
            }
        }
        
        // Validation for other fields
        if (!age || age < 15 || age > 100) {
            errors.push("Age must be between 15 and 100 years.");
        }
        if (!activity) {
            errors.push("Please select an activity level.");
        }
        if (!goal) {
            errors.push("Please select a daily goal.");
        }

        if (errors.length > 0) {
            if (errorMessageDiv) {
                errorMessageDiv.innerHTML = errors.join('<br>');
                errorMessageDiv.style.display = 'block';
            }
            return false;
        }
        
        if (errorMessageDiv) errorMessageDiv.style.display = 'none';
        return true;
    }

    // Calculate BMR
    function calculateBMR(weight, height, age, gender) {
        if (gender === 'male') {
            return (10 * weight) + (6.25 * height) - (5 * age) + 5;
        } else {
            return (10 * weight) + (6.25 * height) - (5 * age) - 161;
        }
    }

    // Convert to metric
    function convertToMetric(weight, height) {
        let convertedWeight = weight;
        let convertedHeight = height;
        
        if (!isMetric) {
            convertedWeight = weight * 0.453592;
            convertedHeight = height * 2.54;
        }
        
        return { weight: convertedWeight, height: convertedHeight };
    }

    // Calculate fat intake
    function calculateFatIntake() {
        console.log('Calculate function called');
        
        if (!validateInputs()) {
            console.log('Validation failed');
            return;
        }

        const weight = parseFloat(weightInput.value);
        const age = parseInt(ageInput.value);
        const activity = parseFloat(activityLevelInput.value);
        
        console.log('Inputs:', { weight, age, activity });
        
        let height = null;
        if (isMetric) {
            height = parseFloat(cmInput?.value);
        } else {
            const feet = parseFloat(feetInput?.value) || 0;
            const inches = parseFloat(inchesInput?.value) || 0;
            height = (feet * 12) + inches;
        }
        
        // Convert to metric
        const converted = convertToMetric(weight, height);
        console.log('Converted:', converted);
        
        // Calculate BMR and TDEE
        const bmr = calculateBMR(converted.weight, converted.height, age, selectedGender);
        const tdee = bmr * activity;
        
        console.log('BMR:', bmr, 'TDEE:', tdee);
        
        // Calculate calories
        let maintenanceCalories = Math.round(tdee);
        let mildWeightLossCalories = Math.round(tdee - 500);
        let extremeWeightLossCalories = Math.round(tdee - 1000);
        
        // Calculate fat ranges (20-35% of calories / 9)
        const calculateFatRange = (calories) => ({
            min: Math.round((calories * 0.20) / 9),
            max: Math.round((calories * 0.35) / 9)
        });

        const results = {
            maintenance: {
                calories: maintenanceCalories,
                fat: calculateFatRange(maintenanceCalories)
            },
            mildLoss: {
                calories: mildWeightLossCalories,
                fat: calculateFatRange(mildWeightLossCalories)
            },
            extremeLoss: {
                calories: extremeWeightLossCalories,
                fat: calculateFatRange(extremeWeightLossCalories)
            }
        };

        console.log('Results:', results);
        showResults(results);
    }

    // Create result card
    function createResultCard(calories, fatRange, title, subtitle, isPrimary) {
        return `
            <div class="result-card ${isPrimary ? 'primary' : ''}">
                <div class="result-title">${title}</div>
                <div class="result-subtitle">${subtitle}</div>
                <div class="result-values">
                    <div class="result-value-item">
                        <div class="result-value">${calories}</div>
                        <div class="result-unit">Calories/day</div>
                    </div>
                    <div class="result-value-item">
                        <div class="result-value">${fatRange.min}-${fatRange.max}</div>
                        <div class="result-unit">Grams/day</div>
                    </div>
                </div>
            </div>
        `;
    }

    // Show results
    function showResults(results) {
        console.log('Showing results...');
        
        if (calculatorForm) calculatorForm.style.display = 'none';
        if (resultsContainer) resultsContainer.style.display = 'block';
   document.querySelector('.calculator-header').style.display = 'none';
        document.querySelector('.unit-toggle').style.display = 'none';
        document.getElementById('abcd').style.display = 'block';

        const cardsHTML = 
            createResultCard(results.maintenance.calories, results.maintenance.fat, 'Weight Maintenance', '~ 0 kg/week', true) +
            createResultCard(results.mildLoss.calories, results.mildLoss.fat, 'Mild weight loss', '~ 0.5 kg/week', false) +
            createResultCard(results.extremeLoss.calories, results.extremeLoss.fat, 'Extreme weight loss', '~ 1 kg/week', false);

        if (resultsGrid) {
            resultsGrid.innerHTML = cardsHTML;
            console.log('Results populated');
        }
    }

    // Show calculator form
    function showCalculatorForm() {
        console.log('Showing calculator form...');
        if (resultsContainer) resultsContainer.style.display = 'none';
        if (calculatorForm) calculatorForm.style.display = 'block';
        // Make sure to show the elements again when the form is shown
        if (unitToggle) unitToggle.style.display = 'flex'; // Use flex or block depending on your CSS
        if (calculatorHeader) calculatorHeader.style.display = 'block';
        if (abcd) abcd.style.display = 'none';
    }
});
