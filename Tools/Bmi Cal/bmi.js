// Updated BMI Calculator JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Corrected to be within the DOMContentLoaded scope
    const calculatorHeader = document.querySelector('.calculator-header');
    
    // Get elements
    const unitBtns = document.querySelectorAll('.unit-btn');
    const imperialHeight = document.getElementById('imperial-height');
    const metricHeight = document.getElementById('metric-height');
    const calculatorForm = document.getElementById('calculatorForm');
    const clearBtn = document.getElementById('clearBtn');
    const radioInputs = document.querySelectorAll('.radio-input');
    const weightUnit = document.getElementById('weight-unit');
    
    let currentUnit = 'metric';
    let selectedGender = 'female'; // Default from your HTML
    
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
                document.getElementById('weight').placeholder = '150';
            } else {
                imperialHeight.style.display = 'none';
                metricHeight.style.display = 'block';
                weightUnit.textContent = 'kg';
                document.getElementById('weight').placeholder = '70';
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
    
    // Clear form functionality
    clearBtn.addEventListener('click', function() {
        // Clear all inputs
        document.getElementById('weight').value = '';
        document.getElementById('feet').value = '';
        document.getElementById('inches').value = '';
        document.getElementById('cm').value = '';
        document.getElementById('age').value = '';
        
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
        const results = calculateBMI(validation.weightKg, validation.heightM, validation.age);
        showResults(results);
    });
    
    function validateInputs() {
        const errors = [];
        let weightKg = 0;
        let heightM = 0;
        let age = 0;
        
        // Validate weight
        const weight = parseFloat(document.getElementById('weight').value);
        if (!weight || weight <= 0) {
            errors.push('Please enter a valid weight');
        } else {
            if (currentUnit === 'imperial') {
                if (weight < 90 || weight > 550) {
                    errors.push('Weight should be between 90 lbs and 550 lbs');
                } else {
                    weightKg = weight * 0.453592; // lbs to kg for BMI formula
                }
            } else {
                if (weight < 40 || weight > 250) {
                    errors.push('Weight should be between 40 kg and 250 kg');
                } else {
                    weightKg = weight;
                }
            }
        }
        
        // Validate height
        if (currentUnit === 'metric') {
            const cm = parseFloat(document.getElementById('cm').value);
            if (!cm || cm < 121 || cm > 250) {
                errors.push('Height should be between 121 cm and 250 cm');
            } else {
                heightM = cm / 100;
            }
        } else { // Imperial Validation (feet & inches)
            const feet = parseFloat(document.getElementById('feet').value);
            const inches = parseFloat(document.getElementById('inches').value) || 0;
            
            if (!feet || feet < 1 || feet > 8 || inches < 0 || inches > 11) {
                errors.push('Please enter a valid height (1-8 feet, 0-11 inches)');
            } else {
                const totalInches = feet * 12 + inches;
                heightM = totalInches * 0.0254; // inches to meters for BMI formula
            }
        }
        
        // Validate age
        const ageInput = parseInt(document.getElementById('age').value);
        if (!ageInput || ageInput < 18 || ageInput > 100) {
            errors.push('Age should be between 18 and 100');
        } else {
            age = ageInput;
        }
        
        return {
            isValid: errors.length === 0,
            errors: errors,
            weightKg: weightKg,
            heightM: heightM,
            age: age
        };
    }
    
    function calculateBMI(weightKg, heightM, age) {
        const bmi = weightKg / (heightM * heightM);
        const roundedBmi = bmi.toFixed(1);
        
        let status = '';
        let description = '';
        let progressPosition = 0;
        let categoryClass = '';
        
        if (bmi < 18.5) {
            status = 'Underweight';
            description = 'If your BMI is below 18.5, it means you are underweight. This means that you have a lower-than-average amount of body fat. Being underweight can put you at risk for health problems such as weak bones, anemia, and problems with your immune system. If you are underweight, talk to your doctor about ways to gain weight safely.';
            progressPosition = (bmi / 18.5) * 25;
            categoryClass = 'underweight';
        } else if (bmi >= 18.5 && bmi <= 24.9) {
            status = 'Normal Weight';
            description = 'Your BMI falls within the normal weight range. This indicates a healthy balance between your height and weight. Maintain your current lifestyle with regular exercise and a balanced diet to keep your BMI in this healthy range.';
            progressPosition = 25 + ((bmi - 18.5) / (24.9 - 18.5)) * 25;
            categoryClass = 'normal';
        } else if (bmi >= 25 && bmi <= 29.9) {
            status = 'Overweight';
            description = 'Your BMI indicates that you are overweight. This means you may have more body fat than is considered healthy. Being overweight can increase your risk of various health conditions. Consider making lifestyle changes such as increasing physical activity and improving your diet.';
            progressPosition = 50 + ((bmi - 25) / (29.9 - 25)) * 25;
            categoryClass = 'overweight';
        } else {
            status = 'Obese';
            description = 'Your BMI indicates obesity. This significantly increases your risk of serious health conditions including heart disease, diabetes, and stroke. We strongly recommend consulting with a healthcare professional to develop a safe and effective weight management plan.';
            progressPosition = 75 + ((bmi - 30) / (40 - 30)) * 25;
            if (progressPosition > 95) progressPosition = 95;
            categoryClass = 'obese';
        }
        
        return {
            bmi: roundedBmi,
            status: status,
            description: description,
            progressPosition: progressPosition,
            categoryClass: categoryClass
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
        this.abcd.style.display = 'block';
        document.querySelector('.form-content').style.display = 'none';
        if(calculatorHeader) {
            calculatorHeader.style.display = 'none';
        }
        
        // Show results
        const resultsHTML = `
            <div id="results-section" class="bmi-results-content ${results.categoryClass}">
                <div class="bmi-header">
                    <h2>Your BMI is ${results.bmi}</h2>
                </div>
                
                <div class="bmi-status-container">
                    <div class="bmi-illustration">
                        <div class="person-icon"></div>
                    </div>
                    <div class="bmi-status-info">
                        <h3 class="bmi-status">${results.status}</h3>
                        <div class="bmi-scale">
                            <div class="scale-bar">
                                <div class="scale-indicator" style="left: ${results.progressPosition}%"></div>
                            </div>
                            <div class="scale-labels">
                                <span>UNDERWEIGHT</span>
                                <span>NORMAL</span>
                                <span>OVERWEIGHT</span>
                                <span>OBESE</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="bmi-description">
                    <p>${results.description}</p>
                </div>
                
                <div class="bmi-disclaimer">
                    <p><em>*By entering your height and weight into this calculator, you can determine your body mass index (BMI), which assesses body fat based on your size and weight. The BMI is a useful tool for assessing how much fat you have using your height.</em></p>
                </div>
                
                <div class="result-actions">
                    <button type="button" class="btn btn-primary" id="unlockPlan">Unlock Your Custom Plan!</button>
                    <a href="bmi.html" class="btn btn-secondary" id="calculateAgain">Calculate again</a>
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
        if(calculatorHeader) {
            calculatorHeader.style.display = 'flex';
        }
        
        // Remove results section if it exists
        const resultsSection = document.getElementById('results-section');
        if (resultsSection) {
            resultsSection.remove();
        }
    }
});