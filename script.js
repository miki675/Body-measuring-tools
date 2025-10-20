
// main navigation 
$(document).ready(function() {
    // Mobile menu toggle
    $('.mobile-menu-toggle').click(function() {
        $(this).toggleClass('active');
        $('.nav-menu').toggleClass('active');

        if ($('.nav-menu').hasClass('active')) {
            $('body').css('overflow', 'hidden');
        } else {
            $('body').css('overflow', '');
        }
    });

    // Mobile dropdown toggle
    $('.nav-item').click(function(e) {
        if ($(window).width() <= 1024) {
            e.preventDefault();
            $(this).find('.dropdown').toggleClass('active');
            $(this).siblings().find('.dropdown').removeClass('active');
        }
    });

    // Close mobile menu when clicking outside
    $(document).click(function(e) {
        if (!$(e.target).closest('.nav-container').length) {
            $('.nav-menu').removeClass('active');
            $('.mobile-menu-toggle').removeClass('active');
        }
    });

    // Close mobile menu when resizing to desktop
    $(window).resize(function() {
        if ($(window).width() > 1024) {
            $('.nav-menu').removeClass('active');
            $('.mobile-menu-toggle').removeClass('active');
            $('.dropdown').removeClass('active');
        }
    });

    // Smooth scrolling for anchor links
    $('a[href^="#"]').click(function(e) {
        e.preventDefault();
        var target = $(this.getAttribute('href'));
        if (target.length) {
            $('html, body').animate({
                scrollTop: target.offset().top - 70
            }, 500);
        }
    });

    // Add active class to current nav item
    $('.nav-link').click(function() {
        $('.nav-link').removeClass('active');
        $(this).addClass('active');
    });

    // Navbar scroll effect
    $(window).scroll(function() {
        if ($(window).scrollTop() > 50) {
            $('.navbar').addClass('scrolled');
        } else {
            $('.navbar').removeClass('scrolled');
        }
    });
    
});


// slick slider testimonial
$('.testimonial-slider').slick({
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
    // dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 3000,
    prevArrow: '<button type="button" class="custom-arrow slick-prev"><img src="images/Right Button.png" alt="Previous"></button>',
    nextArrow: '<button type="button" class="custom-arrow slick-next"><img src="images/Right Button (1).png" alt="Next"></button>',
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1
        }
      }
    ]
  });

//   FAQ accordian 
  $(document).ready(function() {
    $('.faq-question').click(function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const clickedFaqId = $(this).closest('.faq-item').data('faq');
        const $targetFaqItem = $(`[data-faq="${clickedFaqId}"]`);
        const $targetFaqAnswer = $targetFaqItem.find('.faq-answer');
        
        // Check if this specific FAQ item is already open
        const isCurrentlyOpen = $targetFaqItem.hasClass('active');
        
        // Close all FAQs first
        $('.faq-item').removeClass('active');
        $('.faq-answer').removeClass('active');
        
        // If it wasn't open, open only the item with matching data-faq attribute
        if (!isCurrentlyOpen) {
            $targetFaqItem.addClass('active');
            $targetFaqAnswer.addClass('active');
        }
    });
});

// apps section opening 
jQuery(document).ready(function($) {
    $('.single_app').on('click', function() {
        var url = $(this).data('url');
        if (url) {
            window.open(url, '_blank');
        }
    });
});


// ideal weight calculator js 
$(document).ready(function() {
    let currentUnit = 'metric';
    let selectedGender = 'female';

    // Unit toggle functionality
    $('.unit-btn').click(function() {
        const unit = $(this).data('unit');
        currentUnit = unit;
        
        $('.unit-btn').removeClass('active');
        $(this).addClass('active');
        
        if (unit === 'metric') {
            $('#weight-unit').text('kg');
            $('#imperial-height').addClass('metric-hidden');
            $('#metric-height').removeClass('imperial-hidden');
            $('#weight').attr('placeholder', '70');
            $('#cm').attr('placeholder', '170');
        } else {
            $('#weight-unit').text('lbs');
            $('#metric-height').addClass('imperial-hidden');
            $('#imperial-height').removeClass('metric-hidden');
            $('#weight').attr('placeholder', '154');
            $('#feet').attr('placeholder', '5');
            $('#inches').attr('placeholder', '7');
        }
        $('#result').hide();
    });

    // Radio button functionality
    $('.radio-option').click(function() {
        const value = $(this).find('.radio-input').data('value');
        selectedGender = value;
        
        $('.radio-input').removeClass('checked');
        $(this).find('.radio-input').addClass('checked');
    });

    // Dropdown functionality
    $('.dropdown-button').click(function() {
        $(this).find('.dropdown-arrow').toggleClass('open');
    });

    // Clear form
    $('#clearBtn').click(function() {
        $('#calculatorForm')[0].reset();
        $('#weight').attr('placeholder', currentUnit === 'metric' ? '70' : '154');
        $('#age').attr('placeholder', '24');
        if (currentUnit === 'metric') {
            $('#cm').attr('placeholder', '170');
        } else {
            $('#feet').attr('placeholder', '5');
            $('#inches').attr('placeholder', '7');
        }
        $('#result').hide();
    });

    // Form submission and calculation
    $('#calculatorForm').submit(function(e) {
        e.preventDefault();
        
        let weight = parseFloat($('#weight').val());
        let height; // in cm
        let age = parseInt($('#age').val());
        
        if (!weight || !age) {
            alert('Please fill in all required fields');
            return;
        }
        
        // Convert weight to kg if imperial
        if (currentUnit === 'imperial') {
            weight = weight * 0.453592; // lbs to kg
            
            let feet = parseFloat($('#feet').val()) || 0;
            let inches = parseFloat($('#inches').val()) || 0;
            
            if (!feet && !inches) {
                alert('Please enter your height');
                return;
            }
            
            height = (feet * 12 + inches) * 2.54; // convert to cm
        } else {
            height = parseFloat($('#cm').val());
            
            if (!height) {
                alert('Please enter your height');
                return;
            }
        }
        
        // Calculate ideal body weight using Devine formula
        let idealWeight;
        const heightInInches = height / 2.54;
        
        if (selectedGender === 'male') {
            idealWeight = 50 + 2.3 * (heightInInches - 60);
        } else {
            idealWeight = 45.5 + 2.3 * (heightInInches - 60);
        }
        
        // Ensure minimum weight
        idealWeight = Math.max(idealWeight, selectedGender === 'male' ? 50 : 45.5);
        
        // Display result
        let resultText;
        if (currentUnit === 'imperial') {
            const idealWeightLbs = idealWeight * 2.20462;
            resultText = `${idealWeightLbs.toFixed(1)} lbs (${idealWeight.toFixed(1)} kg)`;
        } else {
            const idealWeightLbs = idealWeight * 2.20462;
            resultText = `${idealWeight.toFixed(1)} kg (${idealWeightLbs.toFixed(1)} lbs)`;
        }
        
        $('#result-value').text(resultText);
        $('#result').show();
    });

    // File upload styling (visual only)
    $('.file-upload').on('dragover', function(e) {
        e.preventDefault();
        $(this).css('border-color', '#1a5f3f');
    });

    $('.file-upload').on('dragleave', function(e) {
        e.preventDefault();
        $(this).css('border-color', '#ddd');
    });
});


// loading blogs 
jQuery(document).ready(function(jquery) {
    jquery.ajax({
        url: "https://project.websterzone.com/medical-tools/blog/wp-json/custom-api/v1/latest-posts/",
        method: "GET",
        success: function(posts) {
            let html = "";
            posts.forEach(function(post) {
                html += `
                <div class="single_blog">
                    <a href="${post.link}" target="_blank"><img src="${post.image || 'images/default.png'}" alt="${post.title}"></a>
                    <a href="${post.link}" target="_blank"><h4>${post.title}</h4></a>
                    <p>${post.excerpt}</p>
                    <a href="${post.link}" target="_blank">Read more <span><i class="fas fa-arrow-right"></i></span></a>
                </div>`;
            });
            jquery("#latest-posts").html(html);
        },
        error: function(err) {
            console.error("Failed to load posts", err);
        }
    });
});


jQuery(document).ready(function () {
    function initDropdown(dropdownId, inputId) {
        const $dropdown = jQuery(`#${dropdownId}`);
        const $trigger = $dropdown.find('.custom-select-trigger');
        const $options = $dropdown.find('.custom-option');
        const $hiddenInput = jQuery(`#${inputId}`);

        // Toggle dropdown
        $trigger.on('click', function () {
            $dropdown.toggleClass('open');
        });

        // Option selection
        $options.on('click', function () {
            if (jQuery(this).hasClass('default-option')) return;

            $options.removeClass('selected');
            jQuery(this).addClass('selected');

            const selectedText = jQuery(this).text();
            const selectedValue = jQuery(this).data('value');

            $trigger.text(selectedText).addClass('active');
            $hiddenInput.val(selectedValue);
            $dropdown.removeClass('open');
        });

        // Close dropdown if clicked outside
        jQuery(document).on('click', function (e) {
            if (!jQuery(e.target).closest(`#${dropdownId}`).length) {
                $dropdown.removeClass('open');
            }
        });
    }

    // Initialize both dropdowns
    initDropdown('activityDropdown', 'activityLevel');
    initDropdown('daily_goal', 'dailyGoal');



    flatpickr("#start_date", {
        dateFormat: "m/d/Y",
        maxDate: "today"
      });
    
      flatpickr("#due_date", {
        dateFormat: "m/d/Y",
        minDate: "today"
      });
});


jQuery(document).ready(function() {
    jQuery('.search-input').on('focus', function() {
        jQuery('.search-container').addClass('active');
    });

    jQuery('.search-input').on('blur', function() {
        jQuery('.search-container').removeClass('active');
    });
    
    jQuery('.search-button').on('click', function (e) {
        e.stopPropagation(); // prevent event bubbling
        jQuery('.search_opened').addClass('active');
    });

    // Remove class when clicking anywhere else
    jQuery(document).on('click', function (e) {
        if (!jQuery(e.target).closest('.search-button, .search_opened').length) {
            jQuery('.search_opened').removeClass('active');
        }
    });
});

