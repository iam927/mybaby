/* ==========================================================================
   PREMIUM PORTFOLIO INTERACTION & LOGIC
   Owner: Sreelakshmi A. | Expert Performance Marketer
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initGrowthCalculator();
    initCampaignTabs();
    initScrollReveals();
    initStatsCounter();
    initMobileNav();
    initFaqs();
});

/* ==========================================================================
   1. THEME CONTROLLER (DARK / LIGHT DUAL THEME)
   ========================================================================== */
function initTheme() {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;

    // Check saved theme preference or system preference
    const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('portfolio-theme', newTheme);
        
        // Minor visual feedback on click
        themeToggle.style.transform = 'scale(0.9) rotate(30deg)';
        setTimeout(() => {
            themeToggle.style.transform = '';
        }, 150);
    });
}

/* ==========================================================================
   2. INTERACTIVE ROI & GROWTH CALCULATOR
   ========================================================================== */
function initGrowthCalculator() {
    // Inputs
    const spendSlider = document.getElementById('spendSlider');
    const cpcSlider = document.getElementById('cpcSlider');
    const crSlider = document.getElementById('crSlider');
    const aovSlider = document.getElementById('aovSlider');

    // Display values
    const spendVal = document.getElementById('spendVal');
    const cpcVal = document.getElementById('cpcVal');
    const crVal = document.getElementById('crVal');
    const aovVal = document.getElementById('aovVal');

    // Outputs
    const resRevenue = document.getElementById('resRevenue');
    const resClicks = document.getElementById('resClicks');
    const resConvs = document.getElementById('resConvs');
    const resCac = document.getElementById('resCac');
    const resRoas = document.getElementById('resRoas');

    if (!spendSlider || !cpcSlider || !crSlider || !aovSlider) return;

    function calculateResults() {
        const spend = parseFloat(spendSlider.value);
        const cpc = parseFloat(cpcSlider.value);
        const cr = parseFloat(crSlider.value) / 100;
        const aov = parseFloat(aovSlider.value);

        // Standard Calculations
        const clicks = Math.round(spend / cpc);
        const conversions = Math.round(clicks * cr);
        
        // Premium Scaling Formula
        // Assume under Sreelakshmi's management, conversion rate increases by 25% due to CRO, 
        // and average CPC decreases by 10% due to better bid targeting.
        const managedCr = cr * 1.25;
        const managedCpc = cpc * 0.9;
        
        const managedClicks = Math.round(spend / managedCpc);
        const managedConversions = Math.round(managedClicks * managedCr);
        const managedRevenue = Math.round(managedConversions * aov);
        const managedCac = managedConversions > 0 ? (spend / managedConversions) : 0;
        const managedRoas = spend > 0 ? (managedRevenue / spend) : 0;

        // Render Values with local currency/number formatters
        spendVal.textContent = `$${spend.toLocaleString()}`;
        cpcVal.textContent = `$${cpc.toFixed(2)}`;
        crVal.textContent = `${(cr * 100).toFixed(1)}%`;
        aovVal.textContent = `$${aov}`;

        // Render calculated results
        resClicks.textContent = clicks.toLocaleString();
        resConvs.textContent = conversions.toLocaleString();
        
        resRevenue.textContent = `$${managedRevenue.toLocaleString()}`;
        resCac.textContent = `$${managedCac.toFixed(2)}`;
        resRoas.textContent = `${managedRoas.toFixed(2)}x`;

        // Style Est CAC red/green based on values
        if (managedCac < 25) {
            resCac.style.color = 'var(--accent-growth)';
        } else if (managedCac > 80) {
            resCac.style.color = 'var(--accent-orange)';
        } else {
            resCac.style.color = 'var(--accent-cyan)';
        }
    }

    // Bind listeners
    [spendSlider, cpcSlider, crSlider, aovSlider].forEach(slider => {
        slider.addEventListener('input', calculateResults);
    });

    // Run first calculation on load
    calculateResults();
}

/* ==========================================================================
   3. DYNAMIC CAMPAIGN CASE STUDIES TAB ROUTING
   ========================================================================== */
function initCampaignTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const panels = document.querySelectorAll('.campaign-panel');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const campaignId = btn.getAttribute('data-campaign');
            
            // Remove active states
            tabBtns.forEach(b => b.classList.remove('active'));
            panels.forEach(p => p.classList.remove('active'));
            
            // Add active state to current
            btn.classList.add('active');
            
            const targetPanel = document.getElementById(`camp-${campaignId}`);
            if (targetPanel) {
                targetPanel.classList.add('active');
                
                // Redraw SVG path to animate chart drawing on selection
                const svgChart = targetPanel.querySelector('.chart-line');
                if (svgChart) {
                    svgChart.style.animation = 'none';
                    svgChart.offsetHeight; /* Trigger reflow to restart CSS animation */
                    svgChart.style.animation = null;
                }
            }
        });
    });
}

/* ==========================================================================
   4. SCROLL INTERSECTION OBSERVER REVEALS
   ========================================================================== */
function initScrollReveals() {
    const reveals = document.querySelectorAll('.reveal-el');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    reveals.forEach(el => observer.observe(el));
}

/* ==========================================================================
   5. RUNNING DYNAMIC STAT COUNTERS
   ========================================================================== */
function initStatsCounter() {
    const counters = document.querySelectorAll('.stat-counter');
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseFloat(counter.getAttribute('data-target'));
                const duration = 2000; // 2 seconds animation duration
                const frameRate = 1000 / 60; // 60 FPS
                const totalFrames = Math.round(duration / frameRate);
                let currentFrame = 0;

                const animate = () => {
                    currentFrame++;
                    const progress = currentFrame / totalFrames;
                    
                    // Ease out quadratic
                    const easedProgress = progress * (2 - progress);
                    const currentVal = target * easedProgress;
                    
                    if (counter.parentElement.textContent.includes('Spend') || counter.textContent.includes('₹')) {
                        counter.textContent = `₹${Math.round(currentVal)} Crore+`;
                    } else if (counter.parentElement.textContent.includes('ROAS') || counter.textContent.includes('X')) {
                        counter.textContent = `${Math.round(currentVal)}X`;
                    } else if (counter.parentElement.textContent.includes('Impressions') || counter.textContent.includes('M')) {
                        counter.textContent = `${Math.round(currentVal)}M+`;
                    } else if (counter.parentElement.textContent.includes('Leads') || counter.textContent.includes('1000')) {
                        counter.textContent = `${Math.round(currentVal)}+`;
                    } else {
                        counter.textContent = Math.round(currentVal) + "+";
                    }

                    if (currentFrame < totalFrames) {
                        requestAnimationFrame(animate);
                    } else {
                        // Ensure final values are clean and match targets
                        if (counter.parentElement.textContent.includes('Spend')) {
                            counter.textContent = `₹${target} Crore+`;
                        } else if (counter.parentElement.textContent.includes('ROAS')) {
                            counter.textContent = `3X - ${target}X`;
                        } else if (counter.parentElement.textContent.includes('Impressions')) {
                            counter.textContent = `${target}M+`;
                        } else if (counter.parentElement.textContent.includes('Leads')) {
                            counter.textContent = `${target}+`;
                        } else {
                            counter.textContent = target + "+";
                        }
                    }
                };
                
                animate();
                counterObserver.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(c => counterObserver.observe(c));
}

/* ==========================================================================
   6. MOBILE NAVIGATION COLLAPSIBLE MENU
   ========================================================================== */
function initMobileNav() {
    const burger = document.getElementById('mobileMenuToggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!burger || !navMenu) return;

    burger.addEventListener('click', () => {
        const isOpened = burger.getAttribute('aria-expanded') === 'true';
        burger.setAttribute('aria-expanded', !isOpened);
        
        // Toggle slide visual
        if (!isOpened) {
            navMenu.style.display = 'flex';
            navMenu.style.flexDirection = 'column';
            navMenu.style.position = 'absolute';
            navMenu.style.top = '80px';
            navMenu.style.left = '0';
            navMenu.style.width = '100%';
            navMenu.style.background = 'var(--bg-secondary)';
            navMenu.style.padding = '24px';
            navMenu.style.borderBottom = '1px solid var(--card-border)';
            navMenu.style.animation = 'fadeIn 0.3s ease forwards';
            
            // Transform burger to an 'X'
            burger.children[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            burger.children[1].style.opacity = '0';
            burger.children[2].style.transform = 'rotate(-45deg) translate(6px, -7px)';
        } else {
            navMenu.style.display = '';
            burger.children[0].style.transform = '';
            burger.children[1].style.opacity = '';
            burger.children[2].style.transform = '';
        }
    });

    // Close menu when clicking link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                navMenu.style.display = '';
                burger.setAttribute('aria-expanded', 'false');
                burger.children[0].style.transform = '';
                burger.children[1].style.opacity = '';
                burger.children[2].style.transform = '';
            }
            
            // Set active class
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });
}

/* ==========================================================================
   7. FAQ ACCORDION INTERACTION
   ========================================================================== */
function initFaqs() {
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        if (question) {
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                // Collapse all FAQs first for a neat accordion effect
                faqItems.forEach(i => i.classList.remove('active'));
                
                // Open current FAQ if it was closed
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        }
    });
}

/* ==========================================================================
   8. CONTACT CAPTURE FORM SUBMISSION
   ========================================================================== */
window.handleFormSubmit = function(event) {
    event.preventDefault();
    
    const form = document.getElementById('leadForm');
    const successState = document.getElementById('successState');
    
    const name = document.getElementById('formName').value;
    const email = document.getElementById('formEmail').value;
    const url = document.getElementById('formUrl').value;

    // Extrapolate business domain for success text
    let cleanUrl = url.replace(/^(https?:\/\/)?(www\.)?/, '');
    cleanUrl = cleanUrl.split('/')[0];

    // Show name and URL in success screen
    document.getElementById('successUserName').textContent = name;
    document.getElementById('successUserUrl').textContent = cleanUrl;

    // Trigger state animations
    form.style.animation = 'fadeIn 0.3s ease reverse forwards';
    setTimeout(() => {
        form.style.display = 'none';
        successState.style.display = 'block';
    }, 300);
};

window.resetFormState = function() {
    const form = document.getElementById('leadForm');
    const successState = document.getElementById('successState');
    
    form.reset();
    
    successState.style.animation = 'fadeIn 0.3s ease reverse forwards';
    setTimeout(() => {
        successState.style.display = 'none';
        form.style.display = 'block';
        form.style.animation = 'fadeIn 0.5s ease forwards';
    }, 300);
};
