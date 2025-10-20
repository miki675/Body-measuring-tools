this.calculatorHeader = document.querySelector('.calculator-header');
document.addEventListener('DOMContentLoaded', function() {
    
    // Get elements
    const unitBtns = document.querySelectorAll('.unit-btn');
    const imperialHeight = document.getElementById('imperial-height');
    const metricHeight = document.getElementById('metric-height');
    const calculatorForm = document.getElementById('calculatorForm');
    const clearBtn = document.getElementById('clearBtn');
    const radioInputs = document.querySelectorAll('.radio-input');
    const weightUnits = document.querySelectorAll('#weight-unit');
    
    // Dropdown elements
    const activityDropdown = document.getElementById('activityDropdown');
    
    let currentUnit = 'metric';
    let selectedGender = 'female'; // Default from your HTML
    let selectedActivity = '';
    
    // Get weight inputs (current weight and desired weight)
    const weightInputs = document.querySelectorAll('#weight');
    const currentWeightInput = weightInputs[0]; // First weight input
    const desiredWeightInput = weightInputs[1]; // Second weight input (desired)
    
    // Unit toggle functionality
    unitBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const unit = this.getAttribute('data-unit');
            currentUnit = unit;
            
            // Update active button
            unitBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Show/hide height inputs and update weight units
            if (unit === 'imperial') {
                imperialHeight.style.display = 'flex';
                metricHeight.style.display = 'none';
                
                // Update weight unit labels
                weightUnits.forEach(unit => unit.textContent = 'lbs');
                
                // Update placeholders
                currentWeightInput.placeholder = '160';
                desiredWeightInput.placeholder = '150';
            } else {
                imperialHeight.style.display = 'none';
                metricHeight.style.display = 'block';
                
                // Update weight unit labels
                weightUnits.forEach(unit => unit.textContent = 'kg');
                
                // Update placeholders
                currentWeightInput.placeholder = '73';
                desiredWeightInput.placeholder = '68';
            }
        });
    });
    
    // Initialize default unit
    if (currentUnit === 'metric') {
        imperialHeight.style.display = 'none';
        metricHeight.style.display = 'block';
        weightUnits.forEach(unit => unit.textContent = 'kg');
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
                    selectedActivity = value;
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
    
    // Initialize activity dropdown
    if (activityDropdown) initializeDropdown(activityDropdown);
    
    // Clear form functionality
    clearBtn.addEventListener('click', function() {
        // Clear all inputs
        currentWeightInput.value = '';
        desiredWeightInput.value = '';
        document.getElementById('feet').value = '';
        document.getElementById('inches').value = '';
        document.getElementById('cm').value = '';
        document.getElementById('age').value = '';
        
        // Reset dropdown
        if (activityDropdown) {
            activityDropdown.querySelector('.custom-select-trigger').textContent = 'Select your activity level';
            document.getElementById('activityLevel').value = '';
            selectedActivity = '';
        }
        
        // Reset gender to female (default)
        radioInputs.forEach(r => r.classList.remove('checked'));
        document.querySelector('[data-value="female"]').classList.add('checked');
        selectedGender = 'female';
        
        // Hide error messages and results
        hideError();
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
        const results = calculateCalorieDeficit(validation);
        showResults(results);
    });
    
    function validateInputs() {
        const errors = [];
        let currentWeightKg = 0;
        let desiredWeightKg = 0;
        let heightCm = 0;
        let age = 0;
        
        // Validate weight
        const currentWeight = parseFloat(currentWeightInput.value);
        if (currentUnit === 'imperial') {
            if (isNaN(currentWeight) || currentWeight < 90 || currentWeight > 550) {
                errors.push('Current weight must be between 90-550 lbs.');
            } else {
                currentWeightKg = currentWeight * 0.453592; // lbs to kg
            }
        } else { // metric
            if (isNaN(currentWeight) || currentWeight < 40 || currentWeight > 250) {
                errors.push('Current weight must be between 40-250 kg.');
            } else {
                currentWeightKg = currentWeight;
            }
        }
        
        const desiredWeight = parseFloat(desiredWeightInput.value);
        if (currentUnit === 'imperial') {
            if (isNaN(desiredWeight) || desiredWeight < 90 || desiredWeight > 550) {
                errors.push('Desired weight must be between 90-550 lbs.');
            } else {
                desiredWeightKg = desiredWeight * 0.453592; // lbs to kg
            }
        } else { // metric
            if (isNaN(desiredWeight) || desiredWeight < 40 || desiredWeight > 250) {
                errors.push('Desired weight must be between 40-250 kg.');
            } else {
                desiredWeightKg = desiredWeight;
            }
        }

        // Check if desired weight is less than current weight
        if (currentWeightKg && desiredWeightKg && desiredWeightKg >= currentWeightKg) {
            errors.push('Desired weight must be less than current weight for weight loss.');
        }

        // Validate height
        if (currentUnit === 'metric') {
            const cm = parseFloat(document.getElementById('cm').value);
            if (isNaN(cm) || cm < 121 || cm > 250) {
                errors.push('Height must be between 121cm to 250cm.');
            } else {
                heightCm = cm;
            }
        } else { // imperial
            const feet = parseFloat(document.getElementById('feet').value);
            const inches = parseFloat(document.getElementById('inches').value) || 0;
            
            if (isNaN(feet) || feet < 1 || feet > 8) {
                errors.push('Feet must be between 1-8.');
            }
            if (isNaN(inches) || inches < 0 || inches > 11) {
                errors.push('Inches must be between 0-11.');
            }
            
            if (!isNaN(feet) && feet >= 1 && feet <= 8 && !isNaN(inches) && inches >= 0 && inches <= 11) {
                const totalInches = feet * 12 + inches;
                heightCm = totalInches * 2.54; // convert to cm for calculation
            }
        }
        
        // Validate age
        const ageInput = parseInt(document.getElementById('age').value);
        if (isNaN(ageInput) || ageInput < 18 || ageInput > 100) {
            errors.push('Age must be between 18 and 100 years.');
        } else {
            age = ageInput;
        }
        
        // Validate activity level
        if (!selectedActivity) {
            errors.push('Please select your daily activity level.');
        }
        
        return {
            isValid: errors.length === 0,
            errors: errors,
            currentWeightKg: currentWeightKg,
            desiredWeightKg: desiredWeightKg,
            heightCm: heightCm,
            age: age,
            activity: selectedActivity,
            gender: selectedGender
        };
    }
    
    function calculateCalorieDeficit(data) {
        // Calculate BMR using Mifflin-St Jeor equation
        let bmr;
        if (data.gender === 'male') {
            bmr = (10 * data.currentWeightKg) + (6.25 * data.heightCm) - (5 * data.age) + 5;
        } else {
            bmr = (10 * data.currentWeightKg) + (6.25 * data.heightCm) - (5 * data.age) - 161;
        }
        
        // Calculate TDEE (Total Daily Energy Expenditure)
        const tdee = Math.round(bmr * parseFloat(data.activity));
        
        // Calculate weight loss needed
        const weightLossKg = data.currentWeightKg - data.desiredWeightKg;
        
        // Calculate calorie targets for different weight loss rates
        const maintainCalories = tdee;
        const mildLossCalories = Math.max(1200, tdee - 275); // ~0.25 kg/week
        const activeLossCalories = Math.max(1200, tdee - 550); // ~0.5 kg/week
        const extremeLossCalories = Math.max(1200, tdee - 1100); // ~1 kg/week
        
        // Calculate time to reach goal for each plan
        const mildLossWeeks = Math.ceil(weightLossKg / 0.25);
        const activeLossWeeks = Math.ceil(weightLossKg / 0.5);
        const extremeLossWeeks = Math.ceil(weightLossKg / 1.0);
        
        return {
            tdee: maintainCalories,
            mildLoss: Math.round(mildLossCalories),
            activeLoss: Math.round(activeLossCalories),
            extremeLoss: Math.round(extremeLossCalories),
            weightLossKg: Math.round(weightLossKg * 10) / 10, // Round to 1 decimal
            mildLossWeeks: mildLossWeeks,
            activeLossWeeks: activeLossWeeks,
            extremeLossWeeks: extremeLossWeeks
        };
    }
    
    function showError(errors) {
        // Create or show error container
        let errorContainer = document.getElementById('error-messages');
        if (!errorContainer) {
            errorContainer = document.createElement('div');
            errorContainer.id = 'error-messages';
            errorContainer.className = 'error-container';
            
            // Insert before form actions
            const formActions = document.querySelector('.form-actions');
            formActions.parentNode.insertBefore(errorContainer, formActions);
        }
        
        errorContainer.innerHTML = errors.join('<br>');
        errorContainer.style.display = 'block';
        
        // Scroll to error
        errorContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    function hideError() {
        const errorContainer = document.getElementById('error-messages');
        if (errorContainer) {
            errorContainer.style.display = 'none';
        }
    }
    
    function showResults(results) {
        hideError();
        
        // Hide the form
        document.querySelector('.form-content').style.display = 'none';
        this.abcd.style.display = 'block';
        this.calculatorHeader.style.display = 'none';
        // Show results
        const resultsHTML = `
            <div id="results-section" class="calorie-results-content">
                <h2>Your ideal calorie deficit for long-term weight loss is...</h2>
                
                <p class="results-description">
                    The results show a number of daily calorie estimates that can be used as a guideline for how many 
                    calories to consume each day to maintain, lose or gain weight at a certain rate.
                </p>
                
                <div class="calorie-cards-grid">
                    <div class="calorie-card maintain">
                        <div class="card-badge">≈ 0 kg/week</div>
                        <div class="card-title">Maintain weight</div>
                        <div class="card-calories">${results.tdee}</div>
                        <div class="card-label">Calories/day</div>
                    </div>
                    
                    <div class="calorie-card mild-loss featured">
                        <div class="card-badge">≈ 0.25 kg/week</div>
                        <div class="card-title">Mild weight loss</div>
                        <div class="card-calories">${results.mildLoss}</div>
                        <div class="card-label">Calories/day</div>
                    </div>
                    
                    <div class="calorie-card active-loss">
                        <div class="card-badge">≈ 0.5 kg/week</div>
                        <div class="card-title">Active weight loss</div>
                        <div class="card-calories">${results.activeLoss}</div>
                        <div class="card-label">Calories/day</div>
                    </div>
                    
                    <div class="calorie-card extreme-loss">
                        <div class="card-badge">≈ 1 kg/week</div>
                        <div class="card-title">Extreme weight loss</div>
                        <div class="card-calories">${results.extremeLoss}</div>
                        <div class="card-label">Calories/day</div>
                    </div>
                </div>
                
                <div class="weight-loss-info">
                    <p><strong>Goal:</strong> Lose ${results.weightLossKg} kg</p>
                    <p><strong>Estimated time with mild weight loss:</strong> ${results.mildLossWeeks} weeks</p>
                </div>
                
                <div class="calorie-disclaimer">
                    <p>Please visit a doctor when losing 1 kg or more per week since it usually requires consuming less than the 
                    minimum daily recommended of 1500 calories.</p>
                    <p>A calorie deficit calculator is a tool that shows you how to lose weight. It is a simple way to ensure that 
                    you are on the right track with your diet. You can use this calculator to find out how many calories you 
                    need to consume to lose weight.</p>
                    <p><em>*By entering your height and weight into this calculator, you can determine your body mass index (BMI), which 
                    measures body fat based on your size and weight. The BMI is a useful tool for assessing how much fat you have using 
                    your height.</em></p>
                </div>
                
                <div class="result-actions">
                    <button type="button" class="btn btn-primary" id="unlockPlan">Unlock Your Custom Plan!</button>
                    <a href="calorie.html" class="btn btn-secondary" id="calculateAgain">Calculate again</a>
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
        document.querySelector('.form-content').style.display = 'block';
          this.abcd.style.display = 'none';
        this.calculatorHeader.style.display = 'flex';
        // Remove results section if it exists
        const resultsSection = document.getElementById('results-section');
        if (resultsSection) {
            resultsSection.remove();
        }
    }
});
