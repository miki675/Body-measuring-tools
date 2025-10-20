  class HydrationCalculator {
        constructor() {
            this.isMetric = true;
            this.selectedGender = 'female';
            this.selectedActivityLevel = '';

            this.initializeElements();
            this.bindEvents();
            this.toggleUnit('metric'); 
        }

        initializeElements() {
            this.calculatorHeader = document.querySelector('.calculator-header');
            this.unitToggle = document.querySelector('.unit-toggle');
            this.calculatorForm = document.getElementById('calculatorForm');
            this.resultsContainer = document.getElementById('resultsContainer');
            this.unitBtns = document.querySelectorAll('.unit-btn');
            this.weightMetricInput = document.getElementById('weightMetric');
            this.weightImperialInput = document.getElementById('weightImperial');
            this.metricField = document.querySelector('.metric-weight-field');
            this.imperialField = document.querySelector('.imperial-weight-field');
            this.activityDropdown = document.getElementById('activityDropdown');
            this.activityTrigger = this.activityDropdown.querySelector('.custom-select-trigger');
            this.activityOptions = this.activityDropdown.querySelectorAll('.custom-option');
            this.activityLevelInput = document.getElementById('activityLevel');
            this.genderInputs = document.querySelectorAll('.radio-input');
            
            // Corrected IDs to match your HTML
            this.errorContainer = document.getElementById('errorMessage');
            this.errorList = document.getElementById('errorList');
            this.clearBtn = document.getElementById('clearBtn');
            
            this.glassesResult = document.getElementById('glassesResult');
            this.litersAmount = document.getElementById('litersAmount');
            this.ouncesAmount = document.getElementById('ouncesAmount');
            this.calculateAgainBtn = document.getElementById('calculateAgainBtn');
        }

        bindEvents() {
            this.unitBtns.forEach(btn => {
                btn.addEventListener('click', () => this.toggleUnit(btn.dataset.unit));
            });
            
            this.activityTrigger.addEventListener('click', () => {
                this.activityDropdown.classList.toggle('open');
            });
            
            this.activityOptions.forEach(option => {
                option.addEventListener('click', (e) => this.selectActivity(e.currentTarget));
            });
            
            this.genderInputs.forEach(input => {
                input.addEventListener('click', (e) => this.selectGender(e.currentTarget.dataset.value));
            });
            
            this.calculatorForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.calculate();
            });
            
            this.clearBtn.addEventListener('click', () => this.clearForm());
            
            this.calculateAgainBtn.addEventListener('click', () => this.showCalculator());
            
            document.addEventListener('click', (e) => {
                if (!this.activityDropdown.contains(e.target)) {
                    this.activityDropdown.classList.remove('open');
                }
            });
        }

        toggleUnit(unit) {
            this.isMetric = unit === 'metric';
            this.unitBtns.forEach(btn => btn.classList.remove('active'));
            document.querySelector(`.unit-btn[data-unit="${unit}"]`).classList.add('active');

            if (this.isMetric) {
                this.metricField.style.display = 'block';
                this.imperialField.style.display = 'none';
            } else {
                this.metricField.style.display = 'none';
                this.imperialField.style.display = 'block';
            }
        }

        selectActivity(optionElement) {
            const value = optionElement.dataset.value;
            const text = optionElement.textContent;
            this.selectedActivityLevel = value;
            this.activityTrigger.textContent = text;
            this.activityLevelInput.value = value;
            this.activityDropdown.classList.remove('open');
            this.activityOptions.forEach(opt => opt.classList.remove('active'));
            optionElement.classList.add('active');
        }

        selectGender(gender) {
            this.selectedGender = gender;
            this.genderInputs.forEach(input => input.classList.remove('checked'));
            document.querySelector(`.radio-input[data-value="${gender}"]`).classList.add('checked');
        }

        validateInputs() {
            const errors = [];
            this.errorContainer.style.display = 'none';
            this.errorList.innerHTML = '';
            
            let weightInput;
            if (this.isMetric) {
                weightInput = this.weightMetricInput;
            } else {
                weightInput = this.weightImperialInput;
            }
            const weight = parseFloat(weightInput.value);
            const activityLevel = this.selectedActivityLevel;

            if (isNaN(weight) || weight <= 0) {
                errors.push('Please enter a valid weight.');
            } else {
                if (this.isMetric) {
                    if (weight < 20 || weight > 250) {
                        errors.push('Weight must be between 20 kg and 250 kg.');
                    }
                } else {
                    const weightInKg = weight * 0.453592;
                    if (weightInKg < 20 || weightInKg > 250) {
                        errors.push('Weight must be between 44 lbs and 551 lbs.');
                    }
                }
            }

            if (!activityLevel) {
                errors.push('Please select your daily activity level.');
            }

            if (errors.length > 0) {
                errors.forEach(err => {
                    const li = document.createElement('li');
                    li.textContent = err;
                    this.errorList.appendChild(li);
                });
                this.errorContainer.style.display = 'block';
                return false;
            }

            return true;
        }

        calculate() {
            if (!this.validateInputs()) {
                return;
            }

            let weight;
            if (this.isMetric) {
                weight = parseFloat(this.weightMetricInput.value);
            } else {
                weight = parseFloat(this.weightImperialInput.value) * 0.453592;
            }

            // Using the new data-value as the multiplier directly
            let multiplier = parseFloat(this.selectedActivityLevel);

            let recommendedMl = weight * multiplier;
            
            if (this.selectedGender === 'female') {
                recommendedMl *= 0.95; 
            }

            const glasses = Math.round(recommendedMl / 240);
            const liters = recommendedMl / 1000;
            const ounces = recommendedMl * 0.033814;
            
            this.displayResults(glasses, liters, ounces);
        }

        displayResults(glasses, liters, ounces) {
            this.glassesResult.textContent = `${glasses} glasses of water every day`;
            this.litersAmount.textContent = `${liters.toFixed(1)}`;
            this.ouncesAmount.textContent = `${Math.round(ounces)}`;

            this.calculatorForm.style.display = 'none';
            this.resultsContainer.style.display = 'block';

            // Hide the dropdown and unit toggle
            this.calculatorHeader.style.display = 'none';
            this.unitToggle.style.display = 'none';
        document.getElementById('abcd').style.display = 'block';
        }

        clearForm() {
            this.weightMetricInput.value = '';
            this.weightImperialInput.value = '';
            this.activityTrigger.textContent = 'Select your activity level';
            this.activityLevelInput.value = '';
            this.selectedActivityLevel = '';
            this.activityOptions.forEach(opt => opt.classList.remove('active'));
            this.errorContainer.style.display = 'none';
            
            this.toggleUnit('metric');
            this.selectGender('female');
        }

        showCalculator() {
            this.resultsContainer.style.display = 'none';
            this.calculatorForm.style.display = 'block';

            // Show the dropdown and unit toggle again
            this.calculatorHeader.style.display = 'flex';
            this.unitToggle.style.display = 'flex';
            
            this.clearForm();
        }
    }

    document.addEventListener('DOMContentLoaded', () => {
        new HydrationCalculator();
    });