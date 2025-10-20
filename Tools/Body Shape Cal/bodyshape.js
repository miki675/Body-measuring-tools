document.addEventListener('DOMContentLoaded', function() {
    
    let currentUnit = 'metric';
    let selectedGender = 'female';
    
    // Get elements
    const imperialBtn = document.getElementById('imperial');
    const metricBtn = document.getElementById('metric');
    const calculatorForm = document.getElementById('calculatorForm');
    const calculateBtn = document.getElementById('calculateBtn');
    const clearBtn = document.getElementById('clearBtn');
    const calculateAgainBtn = document.getElementById('calculateAgainBtn');
    const radioInputs = document.querySelectorAll('.radio-input');
    const errorMessage = document.getElementById('errorMessage');
    const calculatorHeader = document.getElementById('calculatorHeader');
    const abcd = document.getElementById('abcd');

    // Initialize default state
    initializeCalculator();
    
    function initializeCalculator() {
        toggleUnits('metric');
        setupEventListeners();
    }
    
    function setupEventListeners() {
        // Prevent form submission
        if (calculatorForm) {
            calculatorForm.addEventListener('submit', function(e) {
                e.preventDefault();
            });
        }
        
        // Unit toggle
        if (imperialBtn) {
            imperialBtn.addEventListener('click', function(e) {
                e.preventDefault();
                toggleUnits('imperial');
            });
        }
        
        if (metricBtn) {
            metricBtn.addEventListener('click', function(e) {
                e.preventDefault();
                toggleUnits('metric');
            });
        }
        
        // Gender selection - Fixed
        radioInputs.forEach(radio => {
            radio.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                // Remove checked class from all radios
                radioInputs.forEach(r => r.classList.remove('checked'));
                
                // Add checked class to clicked radio
                this.classList.add('checked');
                
                // Update selected gender
                selectedGender = this.getAttribute('data-value');
                console.log('Selected gender:', selectedGender);
            });
        });
        
        // Calculate button
        if (calculateBtn) {
            calculateBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                calculateResults();
            });
        }
        
        // Clear button
        if (clearBtn) {
            clearBtn.addEventListener('click', function(e) {
                e.preventDefault();
                clearForm();
            });
        }
        
        // Calculate again button
        if (calculateAgainBtn) {
            calculateAgainBtn.addEventListener('click', function(e) {
                e.preventDefault();
                showCalculator();
            });
        }
        
        // File upload handling
        const uploadArea = document.getElementById('uploadArea');
        const fileInput = document.getElementById('fileInput');
        
        if (uploadArea && fileInput) {
            uploadArea.addEventListener('click', function(e) {
                e.preventDefault();
                fileInput.click();
            });
            
            fileInput.addEventListener('change', function(e) {
                if (e.target.files.length > 0) {
                    const fileNames = Array.from(e.target.files).map(file => file.name).join(', ');
                    const uploadText = document.querySelector('.upload-text');
                    if (uploadText) {
                        uploadText.innerHTML = `Selected: ${fileNames}`;
                    }
                }
            });
        }
    }
    
    function toggleUnits(unit) {
        currentUnit = unit;
        
        // Update button states
        if (metricBtn && imperialBtn) {
            metricBtn.classList.toggle('active', unit === 'metric');
            imperialBtn.classList.toggle('active', unit === 'imperial');
        }
        
        // Show/hide body measurement inputs
        const elements = {
            bustImperial: document.getElementById('bust-imperial'),
            bustMetric: document.getElementById('bust-metric'),
            waistImperial: document.getElementById('waist-imperial'),
            waistMetric: document.getElementById('waist-metric'),
            highHipImperial: document.getElementById('high-hip-imperial'),
            highHipMetric: document.getElementById('high-hip-metric'),
            hipImperial: document.getElementById('hip-imperial'),
            hipMetric: document.getElementById('hip-metric')
        };
        
        if (unit === 'imperial') {
            if (elements.bustImperial) elements.bustImperial.style.display = 'flex';
            if (elements.bustMetric) elements.bustMetric.style.display = 'none';
            if (elements.waistImperial) elements.waistImperial.style.display = 'flex';
            if (elements.waistMetric) elements.waistMetric.style.display = 'none';
            if (elements.highHipImperial) elements.highHipImperial.style.display = 'flex';
            if (elements.highHipMetric) elements.highHipMetric.style.display = 'none';
            if (elements.hipImperial) elements.hipImperial.style.display = 'flex';
            if (elements.hipMetric) elements.hipMetric.style.display = 'none';
        } else {
            if (elements.bustImperial) elements.bustImperial.style.display = 'none';
            if (elements.bustMetric) elements.bustMetric.style.display = 'block';
            if (elements.waistImperial) elements.waistImperial.style.display = 'none';
            if (elements.waistMetric) elements.waistMetric.style.display = 'block';
            if (elements.highHipImperial) elements.highHipImperial.style.display = 'none';
            if (elements.highHipMetric) elements.highHipMetric.style.display = 'block';
            if (elements.hipImperial) elements.hipImperial.style.display = 'none';
            if (elements.hipMetric) elements.hipMetric.style.display = 'block';
        }
        
        // Clear any existing error messages
        hideErrorMessage();
    }
    
    function validateInputs() {
        const errors = [];
        let bustCm = 0;
        let waistCm = 0;
        let highHipCm = 0;
        let hipCm = 0;
        
        // Validate body measurements
        if (currentUnit === 'metric') {
            // Bust validation (cm)
            const bustInput = document.getElementById('bustCm');
            const bust = bustInput ? parseFloat(bustInput.value) : 0;
            if (!bust || bust < 41 || bust > 178) {
                errors.push('Bust measurement must be between 41cm to 178cm');
            } else {
                bustCm = bust;
            }
            
            // Waist validation (cm)
            const waistInput = document.getElementById('waistCm');
            const waist = waistInput ? parseFloat(waistInput.value) : 0;
            if (!waist || waist < 41 || waist > 304) {
                errors.push('Waist measurement must be between 41cm to 304cm');
            } else {
                waistCm = waist;
            }
            
            // High Hip validation (cm)
            const highHipInput = document.getElementById('highHipCm');
            const highHip = highHipInput ? parseFloat(highHipInput.value) : 0;
            if (!highHip || highHip < 41 || highHip > 307) {
                errors.push('High Hip measurement must be between 41cm to 307cm');
            } else {
                highHipCm = highHip;
            }
            
            // Hip validation (cm)
            const hipInput = document.getElementById('hipCm');
            const hip = hipInput ? parseFloat(hipInput.value) : 0;
            if (!hip || hip < 41 || hip > 307) {
                errors.push('Hip measurement must be between 41cm to 307cm');
            } else {
                hipCm = hip;
            }
        } else {
            // Imperial measurements validation
            
            // Bust validation (ft/inches)
            const bustFtInput = document.getElementById('bustFeet');
            const bustInInput = document.getElementById('bustInches');
            const bustFt = bustFtInput ? parseFloat(bustFtInput.value) || 0 : 0;
            const bustIn = bustInInput ? parseFloat(bustInInput.value) || 0 : 0;
            
            if (bustFt > 5 || (bustFt === 5 && bustIn > 7)) {
                errors.push('Bust measurement must be maximum 5ft 7inches');
            } else if (bustFt === 0 && bustIn === 0) {
                errors.push('Please enter bust measurement');
            } else {
                const totalBustInches = bustFt * 12 + bustIn;
                bustCm = totalBustInches * 2.54;
                if (bustCm < 41 || bustCm > 178) {
                    errors.push('Bust measurement must be between 41cm to 178cm equivalent');
                }
            }
            
            // Waist validation (ft/inches)
            const waistFtInput = document.getElementById('waistFeet');
            const waistInInput = document.getElementById('waistInches');
            const waistFt = waistFtInput ? parseFloat(waistFtInput.value) || 0 : 0;
            const waistIn = waistInInput ? parseFloat(waistInInput.value) || 0 : 0;
            
            if (waistFt > 9 || (waistFt === 9 && waistIn > 11)) {
                errors.push('Waist measurement must be maximum 9ft 11inches');
            } else if (waistFt === 0 && waistIn === 0) {
                errors.push('Please enter waist measurement');
            } else {
                const totalWaistInches = waistFt * 12 + waistIn;
                waistCm = totalWaistInches * 2.54;
                if (waistCm < 41 || waistCm > 304) {
                    errors.push('Waist measurement must be between 41cm to 304cm equivalent');
                }
            }
            
            // High Hip validation (ft/inches)
            const highHipFtInput = document.getElementById('highHipFeet');
            const highHipInInput = document.getElementById('highHipInches');
            const highHipFt = highHipFtInput ? parseFloat(highHipFtInput.value) || 0 : 0;
            const highHipIn = highHipInInput ? parseFloat(highHipInInput.value) || 0 : 0;
            
            if (highHipFt > 9 || (highHipFt === 9 && highHipIn > 11)) {
                errors.push('High Hip measurement must be maximum 9ft 11inches');
            } else if (highHipFt === 0 && highHipIn === 0) {
                errors.push('Please enter high hip measurement');
            } else {
                const totalHighHipInches = highHipFt * 12 + highHipIn;
                highHipCm = totalHighHipInches * 2.54;
                if (highHipCm < 41 || highHipCm > 307) {
                    errors.push('High Hip measurement must be between 41cm to 307cm equivalent');
                }
            }
            
            // Hip validation (ft/inches)
            const hipFtInput = document.getElementById('hipFeet');
            const hipInInput = document.getElementById('hipInches');
            const hipFt = hipFtInput ? parseFloat(hipFtInput.value) || 0 : 0;
            const hipIn = hipInInput ? parseFloat(hipInInput.value) || 0 : 0;
            
            if (hipFt > 9 || (hipFt === 9 && hipIn > 11)) {
                errors.push('Hip measurement must be maximum 9ft 11inches');
            } else if (hipFt === 0 && hipIn === 0) {
                errors.push('Please enter hip measurement');
            } else {
                const totalHipInches = hipFt * 12 + hipIn;
                hipCm = totalHipInches * 2.54;
                if (hipCm < 41 || hipCm > 307) {
                    errors.push('Hip measurement must be between 41cm to 307cm equivalent');
                }
            }
        }
        
        return {
            isValid: errors.length === 0,
            errors: errors,
            bustCm: bustCm,
            waistCm: waistCm,
            highHipCm: highHipCm,
            hipCm: hipCm,
            gender: selectedGender
        };
    }
    
    function calculateBodyShape(data) {
        const bust = data.bustCm;
        const waist = data.waistCm;
        const hip = data.hipCm;
        const gender = data.gender;
        
        console.log('Calculating for:', { bust, waist, hip, gender });
        
        // Body shape calculation logic - considering gender
        const bustHipDiff = Math.abs(bust - hip);
        const waistBustRatio = waist / bust;
        const waistHipRatio = waist / hip;
        
        let bodyShape = '';
        let description = '';
        
        // Gender-specific calculations
        if (gender === 'male') {
            // Male body shape logic
            if (waist >= bust && waist >= hip) {
                bodyShape = 'Apple';
                description = 'You carry weight around your midsection. Focus on cardio exercises and core strengthening to help reduce waist size.';
            } else if (bust >= waist && bust >= hip && bustHipDiff > 5) {
                bodyShape = 'Inverted Triangle';
                description = 'You have broad shoulders and chest with a narrower waist and hips. This is a strong, athletic build.';
            } else if (bustHipDiff <= 5 && waistBustRatio >= 0.8) {
                bodyShape = 'Rectangle';
                description = 'Your measurements are fairly similar throughout. You can build muscle definition through targeted exercises.';
            } else if (hip > bust && waistHipRatio <= 0.8) {
                bodyShape = 'Pear';
                description = 'You have broader hips compared to your chest and shoulders. Focus on upper body strength training.';
            } else {
                bodyShape = 'Athletic';
                description = 'You have a well-proportioned masculine physique with good muscle definition potential.';
            }
        } else {
            // Female body shape logic
            if (bustHipDiff <= 2.5 && waistBustRatio <= 0.75 && waistHipRatio <= 0.75) {
                bodyShape = 'Hourglass';
                description = 'Your bust and hips are nearly equal in size, and you have a well-defined waist. This creates the classic hourglass silhouette.';
            } else if (hip > bust * 1.05 && waistHipRatio <= 0.8) {
                bodyShape = 'Pear, spoon bell or triangle';
                description = 'Your hips are wider than your bust. This body type typically has a smaller upper body with curvy hips and thighs.';
            } else if (bust > hip * 1.05) {
                bodyShape = 'Inverted Triangle';
                description = 'Your shoulders and bust are wider than your hips. You have a broader upper body with narrower hips.';
            } else if (bustHipDiff <= 5 && waistBustRatio >= 0.75) {
                bodyShape = 'Rectangle or Straight';
                description = 'Your bust, waist, and hip measurements are fairly similar. You have minimal curves but can create them through styling.';
            } else if (waist >= bust * 0.8 && waist >= hip * 0.8) {
                bodyShape = 'Apple or Round';
                description = 'You carry weight around your midsection, with your waist being the widest part of your body.';
            } else {
                bodyShape = 'Unique Shape';
                description = 'Your measurements create a unique body shape. Every body is beautiful and unique in its own way.';
            }
        }
        
        return {
            shape: bodyShape,
            description: description
        };
    }
    
    function calculateResults() {
        const validation = validateInputs();
        
        if (!validation.isValid) {
            showErrorMessage(validation.errors);
            return;
        }
        
        console.log('Selected gender:', selectedGender);
        console.log('Calculating for:', validation);
        
        hideErrorMessage();
        const results = calculateBodyShape(validation);
        
        console.log('Displaying results:', results);
        displayResults(results);
    }
    
    function displayResults(results) {
        // Update result values
        const resultValue = document.getElementById('result-value');
        if (resultValue) {
            resultValue.textContent = results.shape;
            resultValue.style.color = '#4CAF50';
            resultValue.style.fontWeight = 'bold';
        }
        
        const resultDescription = document.getElementById('result-description');
        if (resultDescription) {
            resultDescription.innerHTML = `
                <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #4CAF50;">
                    <h4 style="color: #333; margin-bottom: 15px;">About Your Body Shape</h4>
                    <p style="color: #555; line-height: 1.6; margin: 0;">${results.description}</p>
                </div>
            `;
        }
        
        // Hide form content and show only results
        const formGroups = document.querySelectorAll('.form-group, .body_measur_neck, .unit-toggle, .file-upload, .form-actions, h4');
        formGroups.forEach(element => {
            element.style.display = 'none';
        });
        
        const resultContainer = document.getElementById('result');
        if (resultContainer) {
            resultContainer.style.display = 'block';
        }
        
        // Hide the header and show the 'abcd' element
        if (calculatorHeader) {
            calculatorHeader.style.display = 'none';
        }
        if (abcd) {
            abcd.style.display = 'block';
        }

        // Scroll to results
        if (resultContainer) {
            resultContainer.scrollIntoView({ behavior: 'smooth' });
        }
    }
    
    function showErrorMessage(errors) {
        if (errorMessage) {
            errorMessage.innerHTML = errors.join('<br>');
            errorMessage.style.display = 'block';
            errorMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
    
    function hideErrorMessage() {
        if (errorMessage) {
            errorMessage.style.display = 'none';
        }
    }
    
    function clearForm() {
        // Clear all inputs
        const inputs = [
            'bustFeet', 'bustInches', 'bustCm',
            'waistFeet', 'waistInches', 'waistCm',
            'highHipFeet', 'highHipInches', 'highHipCm',
            'hipFeet', 'hipInches', 'hipCm'
        ];
        
        inputs.forEach(inputId => {
            const input = document.getElementById(inputId);
            if (input) {
                input.value = '';
            }
        });
        
        // Reset file input
        const fileInput = document.getElementById('fileInput');
        if (fileInput) {
            fileInput.value = '';
            const uploadText = document.querySelector('.upload-text');
            if (uploadText) {
                uploadText.innerHTML = 'Drag & drop files or <strong>Browse</strong>';
            }
        }
        
        // Reset gender to female
        radioInputs.forEach(r => r.classList.remove('checked'));
        const femaleRadio = document.querySelector('[data-value="female"]');
        if (femaleRadio) {
            femaleRadio.classList.add('checked');
        }
        selectedGender = 'female';
        
        hideErrorMessage();
        showCalculator();
    }
    
    function showCalculator() {
        // Show all form elements again
        const formGroups = document.querySelectorAll('.form-group, .body_measur_neck, .unit-toggle, .file-upload, .form-actions, h4');
        formGroups.forEach(element => {
            element.style.display = '';
        });
        
        const resultContainer = document.getElementById('result');
        if (resultContainer) {
            resultContainer.style.display = 'none';
        }

        // Show the header and hide the 'abcd' element
        if (calculatorHeader) {
            calculatorHeader.style.display = 'block';
        }
        if (abcd) {
            abcd.style.display = 'none';
        }
        
        // Re-apply current unit toggle
        toggleUnits(currentUnit);
        
        // Scroll to form
        const calculatorForm = document.getElementById('calculatorForm');
        if (calculatorForm) {
            calculatorForm.scrollIntoView({ behavior: 'smooth' });
        }
    }
});
