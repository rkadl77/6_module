document.addEventListener('DOMContentLoaded', () => {

    gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

    ScrollSmoother.create({
        wrapper: '.wrapper',
        content: '.content',
        smooth: 3,
        effects: true
    });

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

    gsap.fromTo('.text-block__extra', {opacity: 1}, {
        opacity: 0,
        scrollTrigger: {
            trigger: '.hero-section',
            start: '1600',
            end: '1850',
            scrub: true
        }
    })

    let itemsL = gsap.utils.toArray('.algorithms__center .algorithms__left');
    itemsL.forEach((item, index) => {
        gsap.fromTo(item, {x: -100 * (index + 1), opacity: 0, scale: 0.8}, {
            opacity: 1,
            x: 0,
            scale: 1,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: item,
                start: 'top center',
                end: 'center center',
                scrub: true
            }
        });
    });

    let itemsR = gsap.utils.toArray('.algorithms__center .algorithms__right');
    itemsR.forEach((item, index) => {
        gsap.fromTo(item, {x: 100 * (index + 1), opacity: 0, scale: 0.8}, {
            opacity: 1,
            x: 0,
            scale: 1,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: item,
                start: 'top center',
                end: 'center center',
                scrub: true
            }
        });
    });
})