// Weight Loss Calculator JavaScript
document.addEventListener('DOMContentLoaded', function() {
    
    // Get elements
    const unitBtns = document.querySelectorAll('.unit-btn');
    const imperialHeight = document.getElementById('imperial-height');
    const metricHeight = document.getElementById('metric-height');
    const calculatorForm = document.getElementById('calculatorForm');
    const clearBtn = document.getElementById('clearBtn');
    const radioInputs = document.querySelectorAll('.radio-input');
    const weightUnits = document.querySelectorAll('#weight-unit');
    const calculatorHeader = document.querySelector('.calculator-header');
    
    // Dropdown elements
    const activityDropdown = document.getElementById('activityDropdown');
    
    let currentUnit = 'metric';
    let selectedGender = 'female'; // Default from your HTML
    let selectedActivity = '';
    
    // Get inputs
    const weightInputs = document.querySelectorAll('#weight');
    const currentWeightInput = weightInputs[0]; // First weight input
    const desiredWeightInput = weightInputs[1]; // Second weight input (desired)
    const ageInputs = document.querySelectorAll('#age');
    const ageInput = ageInputs[0]; // Age input
    const bodyFatInput = ageInputs[1]; // Body fat input (second age field)
    const startDateInput = document.getElementById('start_date');
    const dueDateInput = document.getElementById('due_date');
    
    // Set today's date as default start date
    const today = new Date().toISOString().split('T')[0];
    if (startDateInput) {
        startDateInput.value = today.replace(/-/g, '/');
    }
    
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
        ageInput.value = '';
        bodyFatInput.value = '';
        startDateInput.value = '';
        dueDateInput.value = '';
        
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
        
        // Set today's date again
        const today = new Date().toISOString().split('T')[0];
        if (startDateInput) {
            startDateInput.value = today.replace(/-/g, '/');
        }
        
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
        const results = calculateWeightLoss(validation);
        showResults(results);
    });
    
    function validateInputs() {
        const errors = [];
        let currentWeightKg = 0;
        let desiredWeightKg = 0;
        let heightCm = 0;
        let age = 0;
        let bodyFatPercent = null;
        let startDate = null;
        let dueDate = null;
        
        // Validate current weight
        const currentWeight = parseFloat(currentWeightInput.value);
        if (isNaN(currentWeight)) {
            errors.push('Please enter your current weight.');
        } else {
            if (currentUnit === 'imperial') {
                if (currentWeight < 90 || currentWeight > 550) {
                    errors.push('Current weight must be between 90lbs to 550lbs');
                } else {
                    currentWeightKg = currentWeight * 0.453592; // lbs to kg
                }
            } else { // Metric
                if (currentWeight < 40 || currentWeight > 250) {
                    errors.push('Current weight must be between 40kg to 250kg');
                } else {
                    currentWeightKg = currentWeight;
                }
            }
        }
        
        // Validate desired weight
        const desiredWeight = parseFloat(desiredWeightInput.value);
        if (isNaN(desiredWeight)) {
            errors.push('Please enter your desired weight.');
        } else {
            if (currentUnit === 'imperial') {
                if (desiredWeight < 90 || desiredWeight > 550) {
                    errors.push('Desired weight must be between 90lbs to 550lbs');
                } else {
                    desiredWeightKg = desiredWeight * 0.453592; // lbs to kg
                }
            } else { // Metric
                if (desiredWeight < 40 || desiredWeight > 250) {
                    errors.push('Desired weight must be between 40kg to 250kg');
                } else {
                    desiredWeightKg = desiredWeight;
                }
            }
        }
        
        // Check if desired weight is less than current weight, only if both are valid
        if (errors.length === 0 && desiredWeight >= currentWeight) {
            errors.push('Desired weight must be less than current weight for weight loss');
        }
        
        // Validate height
        if (currentUnit === 'metric') {
            const cm = parseFloat(document.getElementById('cm').value);
            if (!cm || cm < 121 || cm > 250) {
                errors.push('Height must be between 121cm to 250cm');
            } else {
                heightCm = cm;
            }
        } else { // imperial
            const feet = parseFloat(document.getElementById('feet').value);
            const inches = parseFloat(document.getElementById('inches').value);
            
            // Validate feet and inches directly
            if (!feet || feet < 1 || feet > 8) {
                errors.push('Height must be between 1 and 8 feet.');
            }
            if (isNaN(inches) || inches < 0 || inches > 11) {
                 errors.push('Inches must be between 0 and 11.');
            }
            
            // Only perform conversion if height inputs are valid
            if (errors.length === 0) {
                const totalInches = (feet * 12) + inches;
                heightCm = totalInches * 2.54; // convert to cm for calculation
            }
        }
        
        // Validate age
        const ageValue = parseInt(ageInput.value);
        if (!ageValue || ageValue < 18 || ageValue > 100) {
            errors.push('Age must be between 18 and 100 years');
        } else {
            age = ageValue;
        }
        
        // Validate body fat (optional)
        const bodyFat = parseFloat(bodyFatInput.value);
        if (bodyFat) {
            if (bodyFat < 5 || bodyFat > 50) {
                errors.push('Body fat percentage must be between 5% to 50%');
            } else {
                bodyFatPercent = bodyFat;
            }
        }
        
        // Validate dates
        if (startDateInput.value) {
            startDate = new Date(startDateInput.value);
        }
        if (dueDateInput.value) {
            dueDate = new Date(dueDateInput.value);
        }
        
        if (!startDateInput.value || !dueDateInput.value) {
            errors.push('Please enter both start date and due date');
        } else if (dueDate <= startDate) {
            errors.push('Due date must be after start date');
        } else {
            const daysDifference = Math.ceil((dueDate - startDate) / (1000 * 60 * 60 * 24));
            if (daysDifference < 7) {
                errors.push('Please allow at least one week for your weight loss goal');
            }
            
            // Check if weight loss rate is healthy (max 2kg/week)
            const weightToLose = currentWeightKg - desiredWeightKg;
            const weeks = daysDifference / 7;
            const weightLossPerWeek = weightToLose / weeks;
            
            if (weightLossPerWeek > 2) {
                errors.push('For healthy weight loss, maximum recommended is 2 kg per week. Please adjust your goal or timeline');
            }
        }
        
        // Validate activity level
        if (!selectedActivity) {
            errors.push('Please select your daily activity level');
        }
        
        return {
            isValid: errors.length === 0,
            errors: errors,
            currentWeightKg: currentWeightKg,
            desiredWeightKg: desiredWeightKg,
            heightCm: heightCm,
            age: age,
            bodyFatPercent: bodyFatPercent,
            startDate: startDate,
            dueDate: dueDate,
            activity: selectedActivity,
            gender: selectedGender
        };
    }
    
    function calculateWeightLoss(data) {
        // Calculate BMR using Mifflin-St Jeor equation
        let bmr;
        if (data.gender === 'male') {
            bmr = (10 * data.currentWeightKg) + (6.25 * data.heightCm) - (5 * data.age) + 5;
        } else {
            bmr = (10 * data.currentWeightKg) + (6.25 * data.heightCm) - (5 * data.age) - 161;
        }
        
        // Calculate TDEE (Total Daily Energy Expenditure)
        const tdee = Math.round(bmr * parseFloat(data.activity));
        
        // Calculate weight loss details
        const weightToLoseKg = data.currentWeightKg - data.desiredWeightKg;
        const timeDifference = Math.ceil((data.dueDate - data.startDate) / (1000 * 60 * 60 * 24));
        const weeks = Math.floor(timeDifference / 7);
        const days = timeDifference % 7;
        
        // Calculate required calorie deficit
        const totalCalorieDeficit = weightToLoseKg * 7700; // 7700 calories = 1kg fat
        const dailyCalorieDeficit = totalCalorieDeficit / timeDifference;
        const dailyCalories = Math.round(tdee - dailyCalorieDeficit);
        
        // Ensure minimum calorie intake for safety
        const minimumCalories = data.gender === 'female' ? 1200 : 1500;
        const adjustedCalories = Math.max(dailyCalories, minimumCalories);
        
        const weeklyWeightLoss = weightToLoseKg / (timeDifference / 7);
        
        return {
            weightToLoseKg: Math.round(weightToLoseKg * 10) / 10,
            weeks: weeks,
            days: days,
            dailyCalories: adjustedCalories,
            weeklyWeightLoss: Math.round(weeklyWeightLoss * 10) / 10,
            totalDays: timeDifference,
            tdee: tdee
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
        calculatorHeader.style.display = 'none';
        // Prepare time display
        let timeText = '';
        if (results.weeks > 0 && results.days > 0) {
            timeText = `${results.weeks} weeks and ${results.days} days`;
        } else if (results.weeks > 0) {
            timeText = `${results.weeks} weeks`;
        } else {
            timeText = `${results.days} days`;
        }
        
        const weightUnit = currentUnit === 'metric' ? 'kg' : 'lbs';
        const displayWeight = currentUnit === 'metric' ? results.weightToLoseKg : (results.weightToLoseKg * 2.20462).toFixed(1);
        const weeklyRate = currentUnit === 'metric' ? results.weeklyWeightLoss : (results.weeklyWeightLoss * 2.20462).toFixed(1);
        
        // Show results
        const resultsHTML = `
            <div id="results-section" class="weight-loss-results-content">
                <h2>You can see the results of losing weight...</h2>
                
                <p class="weight-goal">To reduce your weight by <strong>${displayWeight} ${weightUnit}</strong> in <strong>${timeText}</strong></p>
                
                <p class="calorie-instruction">You will need to eat <strong>${results.dailyCalories} calories</strong> per day to reach your goal.</p>
                
                <div class="calorie-display">
                    <div class="calorie-icon">
                        <div class="kcal-badge">kcal</div>
                    </div>
                    <div class="calorie-number">${results.dailyCalories}</div>
                    <div class="calorie-label">Calories/day</div>
                </div>
                
                <div class="weight-loss-description">
                    <p>Following a strict weight loss program often isn't about achieving your desired results. However, 
                    understanding your daily calorie requirement and planning a weight loss diet accordingly is something 
                    what people often fail at.</p>
                    
                    <p>This weight loss calculator is a helpful tool that will come in handy when you plan to lose weight. Find 
                    your daily and weekly calorie needs and determine how long it will take to shed the kilos/pounds 
                    healthily and safely.</p>
                </div>
                
                <div class="result-actions">
                    <button type="button" class="btn btn-primary" id="unlockPlan">Unlock Your Custom Plan!</button>
                   <a href="weight_loss_calculator.html" class="btn btn-secondary" id="calculateAgain">Calculate again</a>
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
        calculatorHeader.style.display = 'flex';
        // Remove results section if it exists
        const resultsSection = document.getElementById('results-section');
        if (resultsSection) {
            resultsSection.remove();
        }
    }
});
