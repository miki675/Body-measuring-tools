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


document.addEventListener('DOMContentLoaded', () => {
    const calculatorHeader = document.querySelector('.calculator-header');
    const dropdownButton = document.getElementById('dropdownBtn');
    const dropdownMenu = document.getElementById('dropdownMenu');
    const dropdownItems = document.querySelectorAll('.dropdown-item');

    // Toggle dropdown visibility on button click
    dropdownButton.addEventListener('click', () => {
        dropdownMenu.classList.toggle('show');
        dropdownButton.classList.toggle('active');
    });

    // Handle clicks on dropdown items
    dropdownItems.forEach(item => {
        item.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent default link behavior
            const selectedText = item.textContent;
            dropdownButton.querySelector('span').textContent = selectedText;
            dropdownMenu.classList.remove('show');
            dropdownButton.classList.remove('active');

            const url = item.getAttribute('href');
            if (url) {
                window.location.href = url;
            }
        });
    });

    // Close dropdown if user clicks outside
    window.addEventListener('click', (event) => {
        if (!dropdownButton.contains(event.target) && !dropdownMenu.contains(event.target)) {
            dropdownMenu.classList.remove('show');
            dropdownButton.classList.remove('active');
        }
    });

    // Slider Script with looping functionality
    let currentImageIndex = 0;
    const totalImages = 9;
    const cardsVisible = 3; // Assuming 3 cards are visible at a time
    const imageWidth = 340; // 320px card + 20px gap
    
    const imageSliderTrack = document.getElementById('imageSliderTrack');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    function moveImageSlider(direction) {
        let newIndex = currentImageIndex + direction;
        
        // Loop from last to first
        if (direction === 1) { // Moving forward
            if (newIndex > totalImages - cardsVisible) {
                newIndex = 0;
            }
        } else { // Moving backward
            if (newIndex < 0) {
                newIndex = totalImages - cardsVisible;
            }
        }
        
        currentImageIndex = newIndex;
        
        const translateX = -(currentImageIndex * imageWidth);
        imageSliderTrack.style.transform = `translateX(${translateX}px)`;
    }
    
    // Add event listeners to buttons
    prevBtn.addEventListener('click', () => moveImageSlider(-1));
    nextBtn.addEventListener('click', () => moveImageSlider(1));

    // Initialize slider
    imageSliderTrack.style.transform = `translateX(0px)`;
});
