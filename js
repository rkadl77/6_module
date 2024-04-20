document.addEventListener('DOMContentLoaded', () => {

    gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

    ScrollSmoother.create({
        wrapper: '.wrapper',
        content: '.content',
        smooth: 3,
        effects: true
    });
 /*текстовые блоки*/   
    gsap.fromTo('.hero-section', {opacity: 0, y: 50}, {
        opacity: 1,
        y: 0,
        duration: 1,
        scrollTrigger: {
            trigger: '.hero-section',
            start: 'top center',
            end: 'center center',
            scrub: true
        }
    });
    
    gsap.fromTo('.text-block__main', {opacity: 1}, {
        opacity: 0,
        scrollTrigger: {
            trigger: '.hero-section',
            start: '1100',
            end: '1400',
            scrub: true
        }
    })

    gsap.fromTo('.text-block__extra', {opacity: 0}, {
        opacity: 1,
        scrollTrigger: {
            trigger: '.hero-section',
            start: '1500',
            end: '1650',
            scrub: true
        }
    })
/*алгоритмы*/
    gsap.fromTo('.accordion__img', {x: -250,opacity: 0}, {
        opacity: 1, x: 50,
        scrollTrigger: {
            trigger: '.accordion__img',
            end: '0',
            scrub: true
        }
    })
    
    gsap.fromTo('.accordion__list', {x: 250,opacity: 0}, {
        opacity: 1, x: -100,
        scrollTrigger: {
            trigger: '.accordion__list',
            end: '0',
            scrub: true
        }
    })
})
$(function () {
        
    'use strict';

    function accordion() {
        $('.accordion .accordion__item').on('click', function () {
            const timeAnim = 400;
            $('.accordion .accordion__item').removeClass("active").css({ 'pointer-events' : 'auto'});
            $(this).addClass("active").css({ 'pointer-events' : 'none'});
            
            $('.accord__img').removeClass("active");
            let id = $(this).data('id');
            $('#' + id + '-img').addClass("active");
        });
        
    }
    accordion();
});
