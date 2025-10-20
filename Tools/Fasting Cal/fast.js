document.addEventListener('DOMContentLoaded', function() {
    
    // Get elements
    const calculatorHeader = document.querySelector('.calculator-header');
    const unitBtns = document.querySelectorAll('.unit-btn');
    const imperialHeight = document.getElementById('imperial-height');
    const metricHeight = document.getElementById('metric-height');
    const calculatorForm = document.getElementById('calculatorForm');
    const clearBtn = document.getElementById('clearBtn');
    const radioInputs = document.querySelectorAll('.radio-input');
    const weightUnit = document.getElementById('weight-unit');
    const errorContainer = document.getElementById('error-messages');

    // Dropdown elements
    const activityDropdown = document.getElementById('activityDropdown');
    const goalDropdown = document.getElementById('daily_goal');
    
    let currentUnit = 'metric';
    let selectedGender = 'female'; // Default from your HTML
    let selectedActivity = '';
    let selectedGoal = '';
    
    // Unit toggle functionality
    unitBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const unit = this.getAttribute('data-unit');
            currentUnit = unit;
            
            // Update active button
            unitBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Show/hide height inputs and update weight unit
            if (unit === 'imperial') {
                imperialHeight.style.display = 'flex';
                metricHeight.style.display = 'none';
                weightUnit.textContent = 'lbs';
                document.getElementById('weight').placeholder = '165';
            } else {
                imperialHeight.style.display = 'none';
                metricHeight.style.display = 'block';
                weightUnit.textContent = 'kg';
                document.getElementById('weight').placeholder = '75';
            }
        });
    });
    
    // Initialize default unit
    if (currentUnit === 'metric') {
        imperialHeight.style.display = 'none';
        metricHeight.style.display = 'block';
        weightUnit.textContent = 'kg';
    }
    
    // Radio button functionality
    radioInputs.forEach(radio => {
        radio.addEventListener('click', function() {
            radioInputs.forEach(r => r.classList.remove('checked'));
            this.classList.add('checked');
            selectedGender = this.getAttribute('data-value');
        });
    });
    
    // Custom dropdown functionality
    function initializeDropdown(dropdown) {
        const trigger = dropdown.querySelector('.custom-select-trigger');
        const options = dropdown.querySelectorAll('.custom-option');
        const hiddenInput = dropdown.querySelector('input[type="hidden"]');
        
        trigger.addEventListener('click', function() {
            dropdown.classList.toggle('open');
        });
        
        options.forEach(option => {
            option.addEventListener('click', function() {
                if (!this.classList.contains('default-option')) {
                    const value = this.getAttribute('data-value');
                    const text = this.textContent;
                    
                    trigger.textContent = text;
                    hiddenInput.value = value;
                    
                    if (dropdown === activityDropdown) {
                        selectedActivity = value;
                    } else if (dropdown === goalDropdown) {
                        selectedGoal = value;
                    }
                    
                    dropdown.classList.remove('open');
                }
            });
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!dropdown.contains(e.target)) {
                dropdown.classList.remove('open');
            }
        });
    }
    
    // Initialize both dropdowns
    if (activityDropdown) initializeDropdown(activityDropdown);
    if (goalDropdown) initializeDropdown(goalDropdown);
    
    // Clear form functionality
    clearBtn.addEventListener('click', function() {
        // Clear all inputs
        document.getElementById('weight').value = '';
        document.getElementById('feet').value = '';
        document.getElementById('inches').value = '';
        document.getElementById('cm').value = '';
        document.getElementById('age').value = '';
        
        // Reset dropdowns
        if (activityDropdown) {
            activityDropdown.querySelector('.custom-select-trigger').textContent = 'Select your activity level';
            document.getElementById('activityLevel').value = '';
            selectedActivity = '';
        }
        
        if (goalDropdown) {
            goalDropdown.querySelector('.custom-select-trigger').textContent = 'Select your goal';
            document.getElementById('dailyGoal').value = '';
            selectedGoal = '';
        }
        
        // Reset gender to female (default)
        radioInputs.forEach(r => r.classList.remove('checked'));
        document.querySelector('[data-value="female"]').classList.add('checked');
        selectedGender = 'female';
        
        // Hide errors
        hideErrors();

        // Hide results if visible
        showForm();
    });
    
    function hideErrors() {
        errorContainer.style.display = 'none';
        errorContainer.innerHTML = '';
    }

    function showErrors(errors) {
        errorContainer.innerHTML = errors.map(error => `<p>${error}</p>`).join('');
        errorContainer.style.display = 'block';
    }

    // Form submission
    calculatorForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Hide previous errors
        hideErrors();

        const validation = validateInputs();
        if (!validation.isValid) {
            showErrors(validation.errors);
            return;
        }
        
        // Calculate and show results
        const results = calculateIntermittentFasting(validation.weightKg, validation.heightM, validation.age, selectedGender, selectedActivity, selectedGoal);
        showResults(results);
    });
    
    function validateInputs() {
        const errors = [];
        let weightKg = 0;
        let heightM = 0;
        let age = 0;
        
        // Validate weight
        const weight = parseFloat(document.getElementById('weight').value);
        if (currentUnit === 'imperial') {
            if (isNaN(weight) || weight < 90 || weight > 550) {
                errors.push('Weight must be between 90-550 lbs.');
            } else {
                weightKg = weight * 0.453592; // lbs to kg
            }
        } else { // metric
            if (isNaN(weight) || weight < 40 || weight > 250) {
                errors.push('Weight must be between 40-250 kg.');
            } else {
                weightKg = weight;
            }
        }
        
        // Validate height
        if (currentUnit === 'metric') {
            const cm = parseFloat(document.getElementById('cm').value);
            if (isNaN(cm) || cm < 121 || cm > 250) {
                errors.push('Height must be between 121-250 cm.');
            } else {
                heightM = cm / 100;
            }
        } else { // imperial
            const feet = parseFloat(document.getElementById('feet').value);
            const inches = parseFloat(document.getElementById('inches').value);
            
            if (isNaN(feet) || feet < 1 || feet > 8) {
                errors.push('Feet must be between 1-8.');
            }
            if (isNaN(inches) || inches < 0 || inches > 11) {
                errors.push('Inches must be between 0-11.');
            }

            // Only calculate heightM if inputs are valid for the main calculation
            if (!isNaN(feet) && !isNaN(inches) && feet >= 1 && feet <= 8 && inches >= 0 && inches <= 11) {
                 const totalInches = feet * 12 + inches;
                 heightM = totalInches * 0.0254;
            }
        }
        
        // Validate age
        const ageInput = parseFloat(document.getElementById('age').value);
        if (isNaN(ageInput) || ageInput < 18 || ageInput > 100) {
            errors.push('Age must be between 18-100 years.');
        } else {
            age = ageInput;
        }
        
        // Validate activity level
        if (!selectedActivity) {
            errors.push('Please select your daily activity level.');
        }
        
        // Validate goal
        if (!selectedGoal) {
            errors.push('Please select your main goal.');
        }
        
        return {
            isValid: errors.length === 0,
            errors: errors,
            weightKg: weightKg,
            heightM: heightM,
            age: age
        };
    }
    
    function calculateIntermittentFasting(weightKg, heightM, age, gender, activity, goal) {
        // Calculate BMI
        const bmi = weightKg / (heightM * heightM);
        
        let recommendedPlan = '';
        let planDescription = '';
        let fastingHours = 0;
        let eatingWindow = 0;
        
        // Fasting logic based on BMI and goals
        if (bmi < 18.5) {
            recommendedPlan = '12:12';
            fastingHours = 12;
            eatingWindow = 12;
            planDescription = 'You are underweight. A gentle 12:12 method is recommended. Please consult a doctor before starting fasting.';
        } else if (bmi >= 18.5 && bmi < 25) {
            if (goal === 'lose') {
                recommendedPlan = '18:6';
                fastingHours = 18;
                eatingWindow = 6;
                planDescription = 'Normal weight with weight loss goal. An 18:6 method will help you achieve gradual weight loss.';
            } else if (goal === 'maintain') {
                recommendedPlan = '16:8';
                fastingHours = 16;
                eatingWindow = 8;
                planDescription = 'Perfect for maintaining your current weight and improving metabolic health.';
            } else {
                recommendedPlan = '14:10';
                fastingHours = 14;
                eatingWindow = 10;
                planDescription = 'Great for muscle gain while maintaining metabolic benefits.';
            }
        } else if (bmi >= 25 && bmi < 30) {
            if (goal === 'lose') {
                recommendedPlan = '20:4';
                fastingHours = 20;
                eatingWindow = 4;
                planDescription = 'Overweight with weight loss goal. A more intensive 20:4 method for faster results.';
            } else if (goal === 'maintain') {
                recommendedPlan = '16:8';
                fastingHours = 16;
                eatingWindow = 8;
                planDescription = 'Helps manage weight and improve metabolic health.';
            } else {
                recommendedPlan = '14:10';
                fastingHours = 14;
                eatingWindow = 10;
                planDescription = 'Balanced approach for muscle gain while managing weight.';
            }
        } else {
            if (goal === 'lose') {
                recommendedPlan = 'EAT STOP EAT';
                fastingHours = 24;
                eatingWindow = 0;
                planDescription = 'Advanced plan for significant weight loss. 24-hour fasts 1-2 times per week. Consult your doctor before starting.';
            } else {
                recommendedPlan = '16:8';
                fastingHours = 16;
                eatingWindow = 8;
                planDescription = 'Balanced plan to improve metabolic health and support gradual weight management.';
            }
        }
        
        return {
            plan: recommendedPlan,
            description: planDescription,
            fastingHours: fastingHours,
            eatingWindow: eatingWindow,
            bmi: bmi.toFixed(1)
        };
    }
    
    function showResults(results) {
        // Hide the form
        this.abcd.style.display = 'block';
        document.querySelector('.form-content').style.display = 'none';
        calculatorHeader.style.display = 'none';
        // Show results
        const resultsHTML = `
            <div id="results-section" class="results-content">
                <h2>Your Ideal Method is...</h2>
                <div class="fasting-plan">
                    <div class="plan-number">${results.plan}</div>
                </div>
                <div class="plan-description">
                    <p>${results.description}</p>
                </div>
                <div class="disclaimer">
                    <p><em>*Please note that this is a recommendation, and you should always listen to your body and consult with a medical professional before making significant changes to your eating routine.</em></p>
                </div>
                <div class="result-actions">
                    <button type="button" class="btn btn-primary" id="unlockPlan">Unlock Your Custom Plan!</button>
                    <a href="Intermittent-fasting.html" class="btn btn-secondary" id="calculateAgain">Calculate again</a>
                </div>
            </div>
        `;
        
        // Insert results after the form
        document.querySelector('.form-content').insertAdjacentHTML('afterend', resultsHTML);
        
        // Add event listener for "Calculate again" button
        document.getElementById('calculateAgain').addEventListener('click', function() {
            showForm();
        });
        
        // Scroll to results
        document.getElementById('results-section').scrollIntoView({ behavior: 'smooth' });
    }
    
    function showForm() {
        // Show the form
         this.abcd.style.display = 'none';
        document.querySelector('.form-content').style.display = 'block';
        calculatorHeader.style.display = 'flex';
        // Remove results section if it exists
        const resultsSection = document.getElementById('results-section');
        if (resultsSection) {
            resultsSection.remove();
        }
    }
});
