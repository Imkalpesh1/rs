document.addEventListener("DOMContentLoaded", function () {
    // 0. Page Preloader Progress Handler
    const preloader = document.getElementById("pagePreloader");
    const preloaderBar = document.getElementById("preloaderBar");
    const preloaderPercent = document.getElementById("preloaderPercent");

    if (preloader) {
        let progress = 0;
        const progressInterval = setInterval(() => {
            if (progress < 90) {
                progress += Math.floor(Math.random() * 8) + 5;
                if (progress > 90) progress = 90;
                if (preloaderBar) preloaderBar.style.width = progress + "%";
                if (preloaderPercent) preloaderPercent.innerText = progress + "%";
            }
        }, 80);

        function finishPreloader() {
            clearInterval(progressInterval);
            if (preloaderBar) preloaderBar.style.width = "100%";
            if (preloaderPercent) preloaderPercent.innerText = "100%";
            setTimeout(() => {
                preloader.classList.add("loaded");
            }, 350);
        }

        if (document.readyState === "complete") {
            finishPreloader();
        } else {
            window.addEventListener("load", finishPreloader);
            setTimeout(finishPreloader, 2500);
        }
    }

    // Floating Glass Header Scroll Dynamics
    const header = document.querySelector(".header");
    if (header) {
        window.addEventListener("scroll", function () {
            if (window.scrollY > 40) {
                header.classList.add("scrolled");
            } else {
                header.classList.remove("scrolled");
            }
        });
    }

    // Mobile Navigation Drawer Toggle
    const mobileMenuBtn = document.getElementById("mobileMenuBtn");
    const mobileNavDrawer = document.getElementById("mobileNavDrawer");
    const mobileDrawerOverlay = document.getElementById("mobileDrawerOverlay");
    const mobileDrawerClose = document.getElementById("mobileDrawerClose");

    function openMobileDrawer() {
        if (mobileNavDrawer) mobileNavDrawer.classList.add("active");
        if (mobileDrawerOverlay) mobileDrawerOverlay.classList.add("active");
        document.body.style.overflow = "hidden";
    }

    function closeMobileDrawer() {
        if (mobileNavDrawer) mobileNavDrawer.classList.remove("active");
        if (mobileDrawerOverlay) mobileDrawerOverlay.classList.remove("active");
        document.body.style.overflow = "";
    }

    if (mobileMenuBtn) mobileMenuBtn.addEventListener("click", openMobileDrawer);
    if (mobileDrawerClose) mobileDrawerClose.addEventListener("click", closeMobileDrawer);
    if (mobileDrawerOverlay) mobileDrawerOverlay.addEventListener("click", closeMobileDrawer);

    document.querySelectorAll(".mobile-nav-drawer a").forEach(link => {
        link.addEventListener("click", closeMobileDrawer);
    });

    // 1. Hero Section Video Initialization
    const video = document.getElementById("heroVideo");
    const canvas = document.getElementById("heroCanvas");

    if (video) {
        video.muted = true;
        video.style.display = 'block';
        const playPromise = video.play();
        if (playPromise !== undefined) {
            playPromise.catch(function (error) {
                console.log("Autoplay check:", error);
                initHeroCanvas();
            });
        }
    } else {
        initHeroCanvas();
    }

    function initHeroCanvas() {
        if (!canvas) return;
        canvas.style.display = 'block';
        const ctx = canvas.getContext('2d');
        let width, height;

        function resize() {
            width = canvas.width = canvas.offsetWidth || window.innerWidth;
            height = canvas.height = canvas.offsetHeight || 580;
        }
        window.addEventListener('resize', resize);
        resize();

        const particles = [];
        for (let i = 0; i < 50; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.7,
                vy: (Math.random() - 0.5) * 0.7,
                radius: Math.random() * 2 + 1,
                alpha: Math.random() * 0.5 + 0.3
            });
        }

        function animate() {
            ctx.clearRect(0, 0, width, height);
            ctx.fillStyle = '#030207';
            ctx.fillRect(0, 0, width, height);

            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];
                p.x += p.vx;
                p.y += p.vy;

                if (p.x < 0 || p.x > width) p.vx *= -1;
                if (p.y < 0 || p.y > height) p.vy *= -1;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(155, 81, 224, ${p.alpha})`;
                ctx.fill();

                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dx = p.x - p2.x;
                    const dy = p.y - p2.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 130) {
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.strokeStyle = `rgba(155, 81, 224, ${0.15 * (1 - dist / 130)})`;
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(animate);
        }
        animate();
    }

    // 2. Service Offerings Apple Accordion & Stage Showcase System
    const serviceData = [
        {
            title: "Innovation Consulting & Digital Advisory",
            desc: "We enable global enterprises to evaluate their <strong>technology architecture</strong>, identify strategic <strong>AI opportunities</strong>, and define clear <strong>digital roadmaps</strong> from idea validation to production execution.",
            tags: ["R&D & Prototyping", "Product Portfolio Assessments", "Strategy Workshops", "Business Transformation", "Design Thinking Workshops", "AI Adoption Blueprints", "Cloud & Data Strategy"],
            image: "image/image-1.avif"
        },
        {
            title: "Product & Platform Engineering",
            desc: "End-to-end <strong>product development lifecycle</strong> services from concept and <strong>MVP build</strong> to full-scale <strong>platform modernization</strong>, microservices, and <strong>SaaS architecture</strong>.",
            tags: ["Full-Stack SaaS Development", "Microservices Architecture", "API Engineering", "Legacy System Modernization", "Cloud-Native Apps"],
            image: "image/image-2.avif"
        },
        {
            title: "Product Modernization",
            desc: "Re-architecting <strong>legacy monoliths</strong> into <strong>cloud-native microservices</strong>, optimizing <strong>database performance</strong>, and updating user experience toolchains.",
            tags: ["Cloud Migration", "Monolith Refactoring", "API Gateway Setup", "Performance Optimization", "Tech Stack Upgrade"],
            image: "image/image-3.avif"
        },
        {
            title: "Sustenance & Support",
            desc: "Providing <strong>24/7/365 operational maintenance</strong>, proactive monitoring, <strong>security patching</strong>, <strong>SLA-backed bug fixes</strong>, and continuous product enhancements.",
            tags: ["24/7 Managed Ops", "SLA Assurance", "Security Patching", "Bug Fixing & Support", "Continuous Optimization"],
            image: "image/image-4.avif"
        },
        {
            title: "Electronic Data Automation [EDA]",
            desc: "Automating complex <strong>document extraction</strong>, semiconductor & hardware <strong>workflow automation</strong>, and automated data pipelines using <strong>AI and vision models</strong>.",
            tags: ["EDA Workflow Automation", "Document Processing AI", "Semiconductor Design Tech", "Pipeline Automation", "Data Parsing"],
            image: "image/image-5.avif"
        },
        {
            title: "Quality Assurance & Testing",
            desc: "Ensuring <strong>zero-defect software releases</strong> through <strong>automated regression suites</strong>, continuous performance testing, and <strong>cybersecurity audit integration</strong>.",
            tags: ["Automated Regression", "Performance Testing", "Cybersecurity Audits", "API & Integration Testing", "CI/CD Test Pipelines"],
            image: "image/image-6.avif"
        },
        {
            title: "Rapid Application Development [RAD]",
            desc: "Accelerating <strong>time-to-market</strong> using <strong>low-code/no-code platforms</strong>, modular component libraries, and <strong>agile sprint delivery frameworks</strong>.",
            tags: ["Low-Code Platforms", "Rapid MVP Delivery", "Agile Sprints", "Modular Architecture", "Cross-Platform Apps"],
            image: "image/image-7.avif"
        },
        {
            title: "Digital Adoption Platform [DAP]",
            desc: "Maximizing <strong>software adoption</strong> and user onboarding efficiency with <strong>in-app guidance</strong>, interactive walkthroughs, and <strong>real-time usage analytics</strong>.",
            tags: ["Interactive Walkthroughs", "User Analytics", "In-App Onboarding", "Change Management", "Workflow Automation"],
            image: "image/image-8.avif"
        },
        {
            title: "CTO-as-a-Service",
            desc: "Providing high-level <strong>strategic technology leadership</strong>, AI architecture guidance, <strong>vendor selection</strong>, and engineering team scaling on demand.",
            tags: ["Fractional CTO Leadership", "Tech Architecture Audits", "Team Scaling & Mentorship", "Vendor & Tool Evaluation", "IP Protection"],
            image: "image/image-9.avif"
        }
    ];

    function initAppleShowcase() {
        const accordionList = document.getElementById("appleAccordionList");
        const stageBadge = document.getElementById("appleStageBadge");
        const stageImg = document.getElementById("appleStageImg");
        const stageTitle = document.getElementById("appleStageTitle");
        const stageTags = document.getElementById("appleStageTags");

        if (!accordionList) return;

        let activeIndex = 0;

        function updateStage(data) {
            if (stageBadge) stageBadge.innerText = "Featured Capability";
            if (stageTitle) stageTitle.innerText = data.title;
            if (stageTags) {
                stageTags.innerHTML = data.tags.map(t => `<span class="glass-pill">${t}</span>`).join("");
            }
            if (stageImg) {
                stageImg.style.opacity = "0.3";
                stageImg.style.transform = "scale(0.97)";
                setTimeout(() => {
                    stageImg.src = data.image;
                    stageImg.style.opacity = "1";
                    stageImg.style.transform = "scale(1)";
                }, 150);
            }
        }

        function renderAccordion() {
            accordionList.innerHTML = serviceData.map((item, idx) => {
                const isActive = idx === activeIndex;
                if (isActive) {
                    return `
                        <div class="apple-accordion-item active" data-index="${idx}">
                            <div class="apple-accordion-header">
                                <span class="apple-accordion-icon">−</span>
                                <span class="apple-accordion-title-text">${item.title}</span>
                            </div>
                            <div class="apple-accordion-body">
                                <p class="apple-accordion-desc">${item.desc}</p>
                                <div class="mobile-accordion-media">
                                    <div class="mobile-img-wrapper">
                                        <img src="${item.image}" alt="${item.title}" class="mobile-accordion-img">
                                    </div>
                                    <div class="mobile-accordion-tags">
                                        ${item.tags.map(t => `<span class="glass-pill">${t}</span>`).join("")}
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                } else {
                    return `
                        <div class="apple-accordion-item" data-index="${idx}">
                            <div class="apple-accordion-header">
                                <span class="apple-accordion-icon">+</span>
                                <span class="apple-accordion-title-text">${item.title}</span>
                            </div>
                        </div>
                    `;
                }
            }).join('');

            accordionList.querySelectorAll(".apple-accordion-item").forEach(el => {
                el.addEventListener("click", function () {
                    const idx = parseInt(this.getAttribute("data-index"));
                    if (activeIndex === idx) return;
                    activeIndex = idx;
                    renderAccordion();
                    updateStage(serviceData[idx]);

                    // Smoothly scroll active item into clear view below fixed header ONLY on mobile
                    if (window.innerWidth <= 640) {
                        setTimeout(() => {
                            const activeEl = accordionList.querySelector(`.apple-accordion-item[data-index="${idx}"]`);
                            if (activeEl) {
                                const headerOffset = 90;
                                const elementPosition = activeEl.getBoundingClientRect().top;
                                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                                window.scrollTo({
                                    top: offsetPosition,
                                    behavior: "smooth"
                                });
                            }
                        }, 50);
                    }
                });
            });
        }

        renderAccordion();
        updateStage(serviceData[0]);
    }

    initAppleShowcase();

    // 3. Tech Ecosystem Tab Switching & Dynamic Icon Rendering
    function initTechEcosystem() {
        const techData = [
            {
                category: "GenAI & Cloud",
                items: [
                    { name: "AWS", logo: "https://api.iconify.design/logos/aws.svg" },
                    { name: "Azure Machine Learning", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azure/azure-original.svg" },
                    { name: "Google Cloud Platform", logo: "https://api.iconify.design/logos/google-cloud.svg" },
                    { name: "Amazon SageMaker", logo: "https://api.iconify.design/simple-icons/amazonaws.svg" },
                    { name: "Vertex AI", logo: "assets/vertex-ai.png" }
                ]
            },
            {
                category: "Languages & Frameworks",
                items: [
                    { name: "C#", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg" },
                    { name: "Go", logo: "https://api.iconify.design/logos/go.svg" },
                    { name: "GraphQL", logo: "https://api.iconify.design/logos/graphql.svg" },
                    { name: "Node.js", logo: "https://api.iconify.design/logos/nodejs-icon.svg" },
                    { name: "Python", logo: "https://api.iconify.design/logos/python.svg" }
                ]
            },
            {
                category: "SQL Databases",
                items: [
                    { name: "Amazon Aurora", logo: "https://api.iconify.design/logos/aws-aurora.svg" },
                    { name: "Azure Cosmos DB", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azure/azure-original.svg" },
                    { name: "MariaDB", logo: "https://api.iconify.design/logos/mariadb-icon.svg" },
                    { name: "PostgreSQL", logo: "https://api.iconify.design/logos/postgresql.svg" },
                    { name: "Microsoft SQL Server", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/microsoftsqlserver/microsoftsqlserver-plain.svg" }
                ]
            },
            {
                category: "NoSQL Databases",
                items: [
                    { name: "Amazon Redshift", logo: "https://api.iconify.design/logos/aws-redshift.svg" },
                    { name: "Cassandra", logo: "https://api.iconify.design/logos/cassandra.svg" },
                    { name: "Elasticsearch", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/elasticsearch/elasticsearch-original.svg" },
                    { name: "MongoDB", logo: "https://api.iconify.design/logos/mongodb-icon.svg" },
                    { name: "Neo4j", logo: "https://api.iconify.design/logos/neo4j.svg" }
                ]
            },
            {
                category: "Integrations",
                items: [
                    { name: "Google Maps", logo: "https://api.iconify.design/logos/google-maps.svg" },
                    { name: "Heap", logo: "https://api.iconify.design/logos/heap.svg" },
                    { name: "Optimizely", logo: "https://api.iconify.design/logos/optimizely-icon.svg" },
                    { name: "Stripe", logo: "https://api.iconify.design/logos/stripe.svg" },
                    { name: "Twilio", logo: "https://api.iconify.design/logos/twilio-icon.svg" }
                ]
            },
            {
                category: "Cloud Native & Microservices",
                items: [
                    { name: "Amazon EKS", logo: "https://api.iconify.design/logos/aws-eks.svg" },
                    { name: "Docker", logo: "https://api.iconify.design/logos/docker-icon.svg" },
                    { name: "Envoy", logo: "https://api.iconify.design/logos/envoy-icon.svg" },
                    { name: "Istio", logo: "https://api.iconify.design/simple-icons/istio.svg" },
                    { name: "Kubernetes", logo: "https://api.iconify.design/logos/kubernetes.svg" }
                ]
            },
            {
                category: "Serverless",
                items: [
                    { name: "Amazon Athena", logo: "https://api.iconify.design/logos/aws-athena.svg" },
                    { name: "Auth0", logo: "https://api.iconify.design/logos/auth0-icon.svg" },
                    { name: "AWS Lambda", logo: "https://api.iconify.design/logos/aws-lambda.svg" },
                    { name: "Azure Functions", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azure/azure-original.svg" },
                    { name: "Google Cloud Functions", logo: "https://api.iconify.design/logos/google-cloud-functions.svg" }
                ]
            },
            {
                category: "Automation Testing",
                items: [
                    { name: "Cucumber", logo: "https://api.iconify.design/logos/cucumber.svg" },
                    { name: "Jest", logo: "https://api.iconify.design/logos/jest.svg" },
                    { name: "Protractor", logo: "https://api.iconify.design/logos/protractor.svg" },
                    { name: "Selenium", logo: "https://api.iconify.design/logos/selenium.svg" },
                    { name: "Swagger", logo: "https://api.iconify.design/logos/swagger.svg" }
                ]
            }
        ];

        const tabs = document.querySelectorAll(".tech-tab-btn");
        const container = document.getElementById("orbitalNodesContainer");
        const arena = document.getElementById("orbitalArena");
        const hubTitle = document.getElementById("centerHubTitle");
        if (!container || !tabs.length || !arena) return;

        // Base Arc Positions for 5 Tech items along SVG concentric semi-circles (3-Tier Height Rhythm)
        const nodeConfigs = [
            { baseAngle: 142, radiusRatio: 0.3571 }, // Upper-Left Mid Arc (R = 300px)
            { baseAngle: 152, radiusRatio: 0.2143 }, // Lower-Left Inner Arc (R = 180px)
            { baseAngle: 90,  radiusRatio: 0.3571 }, // Top Apex Mid Arc (R = 300px)
            { baseAngle: 28,  radiusRatio: 0.2143 }, // Lower-Right Inner Arc (R = 180px)
            { baseAngle: 38,  radiusRatio: 0.3571 }  // Upper-Right Mid Arc (R = 300px)
        ];

        let currentCategoryIndex = 0;
        let animationFrameId = null;

        function updatePositions(timestamp) {
            if (!timestamp) timestamp = performance.now();
            const time = timestamp * 0.0015;

            const width = arena.clientWidth || 840;
            const height = arena.clientHeight || 440;
            const centerX = width / 2;
            const centerY = height; // Exact baseline anchor

            const nodes = container.querySelectorAll(".orbital-node");
            nodes.forEach((node, i) => {
                if (node.classList.contains("transitioning") || node.matches(':hover')) return;

                const cfg = nodeConfigs[i % nodeConfigs.length];
                const radius = width * cfg.radiusRatio;

                // Visible revolving orbit oscillation along semi-circle arc + organic vertical float
                const angleDelta = Math.sin(time + i * 1.4) * 6.5; // 6.5 degree arc sweep
                const floatY = Math.cos(time * 1.2 + i * 1.7) * 5; // 5px vertical float

                const angleRad = (cfg.baseAngle + angleDelta) * (Math.PI / 180);

                const x = centerX + radius * Math.cos(angleRad);
                const y = (centerY - radius * Math.sin(angleRad)) + floatY;

                node.style.left = `${x}px`;
                node.style.top = `${y}px`;
            });

            animationFrameId = requestAnimationFrame(updatePositions);
        }

        function renderCategory(index) {
            currentCategoryIndex = index;
            const data = techData[index] || techData[0];

            // 1. Trigger Pulse Wave on SVG Semi-Circles
            const svgEl = arena.querySelector(".orbital-svg");
            if (svgEl) {
                svgEl.classList.add("pulse-wave");
                setTimeout(() => svgEl.classList.remove("pulse-wave"), 450);
            }

            // Render Mobile Tech Pyramid (3 in Line 1, 2 in Line 2, tap for name display)
            const row1 = document.getElementById("mobileTechRow1");
            const row2 = document.getElementById("mobileTechRow2");
            const labelText = document.getElementById("mobileTechLabelText");

            if (row1 && row2 && data.items) {
                const items1 = data.items.slice(0, 3);
                const items2 = data.items.slice(3, 5);

                row1.innerHTML = items1.map((item, i) => `
                    <button class="mobile-tech-sq-btn ${i === 0 ? 'active' : ''}" data-name="${item.name}" aria-label="${item.name}">
                        <img src="${item.logo}" alt="${item.name} Logo" class="mobile-tech-sq-logo" loading="lazy">
                    </button>
                `).join('');

                row2.innerHTML = items2.map((item, i) => `
                    <button class="mobile-tech-sq-btn" data-name="${item.name}" aria-label="${item.name}">
                        <img src="${item.logo}" alt="${item.name} Logo" class="mobile-tech-sq-logo" loading="lazy">
                    </button>
                `).join('');

                if (labelText && data.items[0]) {
                    labelText.innerText = data.items[0].name;
                }

                const container = document.getElementById("mobileTechContainer");
                if (container) {
                    container.querySelectorAll(".mobile-tech-sq-btn").forEach(btn => {
                        btn.addEventListener("click", () => {
                            container.querySelectorAll(".mobile-tech-sq-btn").forEach(b => b.classList.remove("active"));
                            btn.classList.add("active");
                            if (labelText) {
                                labelText.style.opacity = '0';
                                labelText.style.transform = 'translateY(4px)';
                                setTimeout(() => {
                                    labelText.innerText = btn.getAttribute("data-name");
                                    labelText.style.opacity = '1';
                                    labelText.style.transform = 'translateY(0)';
                                }, 120);
                            }
                        });
                    });
                }
            }

            // 2. Animate Central Category Title (Smooth blur & slide-up morph)
            if (hubTitle) {
                hubTitle.style.transition = 'opacity 0.18s ease, transform 0.18s cubic-bezier(0.16, 1, 0.3, 1), filter 0.18s ease';
                hubTitle.style.opacity = '0';
                hubTitle.style.filter = 'blur(4px)';
                hubTitle.style.transform = 'translateY(-6px)';

                setTimeout(() => {
                    hubTitle.innerText = data.category;
                    hubTitle.style.transform = 'translateY(6px)';
                    setTimeout(() => {
                        hubTitle.style.transition = 'opacity 0.32s ease, transform 0.32s cubic-bezier(0.16, 1, 0.3, 1), filter 0.32s ease';
                        hubTitle.style.opacity = '1';
                        hubTitle.style.filter = 'blur(0px)';
                        hubTitle.style.transform = 'translateY(0)';
                    }, 30);
                }, 160);
            }

            // 3. Animate Out Existing Circular Badges (Smooth dissolve float)
            const existingNodes = container.querySelectorAll(".orbital-node");
            existingNodes.forEach((node, i) => {
                node.classList.add("transitioning");
                node.style.transition = `opacity 0.2s ease ${i * 25}ms, transform 0.2s cubic-bezier(0.16, 1, 0.3, 1) ${i * 25}ms, filter 0.2s ease`;
                node.style.opacity = '0';
                node.style.filter = 'blur(4px)';
                node.style.transform = 'translate(-50%, -62%) scale(0.85)';
            });

            // 4. Render New Badges with Apple Spring Float-In
            setTimeout(() => {
                container.innerHTML = data.items.map((item, i) => `
                    <div class="orbital-node" data-index="${i}">
                        <img src="${item.logo}" alt="${item.name} Logo" class="orbital-node-icon" loading="lazy">
                        <span class="orbital-tooltip">${item.name}</span>
                    </div>
                `).join('');

                const width = arena.clientWidth || 840;
                const height = arena.clientHeight || 440;
                const centerX = width / 2;
                const centerY = height;

                const newNodes = container.querySelectorAll(".orbital-node");
                newNodes.forEach((node, i) => {
                    const cfg = nodeConfigs[i % nodeConfigs.length];
                    const radius = width * cfg.radiusRatio;
                    const angleRad = cfg.baseAngle * (Math.PI / 180);
                    const x = centerX + radius * Math.cos(angleRad);
                    const y = centerY - radius * Math.sin(angleRad);

                    node.style.left = `${x}px`;
                    node.style.top = `${y}px`;
                    node.style.opacity = '0';
                    node.style.filter = 'blur(3px)';
                    node.style.transform = 'translate(-50%, -38%) scale(0.82)';

                    setTimeout(() => {
                        node.style.transition = 'opacity 0.38s ease, transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.25), filter 0.38s ease';
                        node.style.opacity = '1';
                        node.style.filter = 'blur(0px)';
                        node.style.transform = 'translate(-50%, -50%) scale(1)';
                    }, i * 35 + 30);
                });
            }, 190);
        }

        // Container-only horizontal auto-scroll (NEVER causes main window vertical scroll jump)
        function scrollTabHorizontalContainer(tabElement) {
            const wrapper = document.querySelector(".tech-tabs-wrapper");
            if (!wrapper || !tabElement) return;

            const tabOffsetLeft = tabElement.offsetLeft;
            const tabWidth = tabElement.offsetWidth;
            const wrapperWidth = wrapper.clientWidth;

            const targetScroll = tabOffsetLeft - (wrapperWidth / 2) + (tabWidth / 2);

            wrapper.scrollTo({
                left: Math.max(0, targetScroll),
                behavior: 'smooth'
            });
        }

        function selectCategoryTab(index, isUserAction = false) {
            tabs.forEach(t => t.classList.remove("active"));
            if (tabs[index]) {
                tabs[index].classList.add("active");
                // Scroll container horizontally only; NEVER trigger main window vertical scroll
                scrollTabHorizontalContainer(tabs[index]);
            }
            renderCategory(index);

            if (isUserAction) {
                restartAutoPlayTimer(8000); // Pause for 8s on manual click
            }
        }

        function startAutoPlayTimer() {
            stopAutoPlayTimer();
            autoPlayTimer = setInterval(() => {
                const nextIdx = (currentCategoryIndex + 1) % techData.length;
                selectCategoryTab(nextIdx, false);
            }, AUTO_PLAY_DELAY);
        }

        function stopAutoPlayTimer() {
            if (autoPlayTimer) {
                clearInterval(autoPlayTimer);
                autoPlayTimer = null;
            }
        }

        function restartAutoPlayTimer(delay = 8000) {
            stopAutoPlayTimer();
            autoPlayTimer = setTimeout(() => {
                startAutoPlayTimer();
            }, delay);
        }

        // Viewport Intersection Observer: Auto-play ONLY when section is visible on screen
        const sectionEl = document.getElementById("expertiseSection");
        if (sectionEl && 'IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        startAutoPlayTimer();
                    } else {
                        stopAutoPlayTimer();
                    }
                });
            }, { threshold: 0.2 });
            observer.observe(sectionEl);
        }

        tabs.forEach((tab, idx) => {
            tab.addEventListener("click", function () {
                selectCategoryTab(idx, true);
            });
        });

        // Mouse Drag-to-Scroll Support for .tech-tabs-wrapper
        const tabsWrapper = document.querySelector(".tech-tabs-wrapper");
        if (tabsWrapper) {
            let isDragging = false;
            let startX, scrollLeft;

            tabsWrapper.addEventListener('mousedown', (e) => {
                isDragging = true;
                tabsWrapper.classList.add('active-drag');
                startX = e.pageX - tabsWrapper.offsetLeft;
                scrollLeft = tabsWrapper.scrollLeft;
                stopAutoPlayTimer();
            });

            tabsWrapper.addEventListener('mouseleave', () => {
                if (isDragging) {
                    isDragging = false;
                    tabsWrapper.classList.remove('active-drag');
                    restartAutoPlayTimer(6000);
                }
            });

            tabsWrapper.addEventListener('mouseup', () => {
                if (isDragging) {
                    isDragging = false;
                    tabsWrapper.classList.remove('active-drag');
                    restartAutoPlayTimer(6000);
                }
            });

            tabsWrapper.addEventListener('mousemove', (e) => {
                if (!isDragging) return;
                e.preventDefault();
                const x = e.pageX - tabsWrapper.offsetLeft;
                const walk = (x - startX) * 1.8;
                tabsWrapper.scrollLeft = scrollLeft - walk;
            });
        }

        // Initial Render, auto-play timer and continuous orbit physics
        selectCategoryTab(0, false);
        startAutoPlayTimer();
        requestAnimationFrame(updatePositions);
    }
    initTechEcosystem();

    // 3. Thinking Section Video Card Hover & Click Play Logic
    const thinkingVideoCard = document.getElementById("thinkingVideoCard");
    const thinkingCardVideo = document.getElementById("thinkingCardVideo");
    const thinkingPlayBtn = document.getElementById("thinkingPlayBtn");
    const videoActionText = document.getElementById("videoActionText");

    if (thinkingVideoCard && thinkingCardVideo) {
        thinkingVideoCard.addEventListener("mouseenter", function () {
            thinkingCardVideo.play().then(() => {
                thinkingVideoCard.classList.add("is-playing");
            }).catch(err => {
                console.log("Autoplay blocked on video hover:", err);
            });
        });

        thinkingVideoCard.addEventListener("mouseleave", function () {
            thinkingCardVideo.pause();
            thinkingVideoCard.classList.remove("is-playing");
        });

        if (thinkingPlayBtn) {
            thinkingPlayBtn.addEventListener("click", function (e) {
                e.stopPropagation();
                if (thinkingCardVideo.paused) {
                    thinkingCardVideo.play();
                    thinkingVideoCard.classList.add("is-playing");
                    if (videoActionText) videoActionText.innerText = "Pause Video";
                } else {
                    thinkingCardVideo.pause();
                    thinkingVideoCard.classList.remove("is-playing");
                    if (videoActionText) videoActionText.innerText = "Watch Video";
                }
            });
        }
    }

    // 4. Other Services Carousel Navigation Controls
    const servicesCarousel = document.getElementById("servicesCarousel");
    const carouselPrevBtn = document.getElementById("carouselPrevBtn");
    const carouselNextBtn = document.getElementById("carouselNextBtn");

    if (servicesCarousel && carouselPrevBtn && carouselNextBtn) {
        carouselNextBtn.addEventListener("click", function () {
            servicesCarousel.scrollBy({ left: 320, behavior: "smooth" });
        });
        carouselPrevBtn.addEventListener("click", function () {
            servicesCarousel.scrollBy({ left: -320, behavior: "smooth" });
        });
    }

    // 5. Auto-Scroll & 1-by-1 Snap Controller for Card Carousels
    function initAutoScrollCarousel(containerSelector, itemSelector, intervalMs) {
        const container = document.querySelector(containerSelector);
        if (!container) return;

        let autoScrollTimer = null;
        let isUserInteracting = false;

        function getCardWidth() {
            const item = container.querySelector(itemSelector);
            if (!item) return 300;
            const gap = parseInt(window.getComputedStyle(container).gap) || 16;
            return item.offsetWidth + gap;
        }

        function scrollNext() {
            if (isUserInteracting) return;
            const cardWidth = getCardWidth();
            const maxScrollLeft = container.scrollWidth - container.clientWidth;
            
            if (container.scrollLeft >= maxScrollLeft - 10) {
                container.scrollTo({ left: 0, behavior: "smooth" });
            } else {
                container.scrollBy({ left: cardWidth, behavior: "smooth" });
            }
        }

        function startAutoScroll() {
            stopAutoScroll();
            autoScrollTimer = setInterval(scrollNext, intervalMs || 3500);
        }

        function stopAutoScroll() {
            if (autoScrollTimer) clearInterval(autoScrollTimer);
        }

        container.addEventListener("touchstart", () => {
            isUserInteracting = true;
            stopAutoScroll();
        }, { passive: true });

        container.addEventListener("touchend", () => {
            setTimeout(() => {
                isUserInteracting = false;
                startAutoScroll();
            }, 3500);
        });

        container.addEventListener("mouseenter", () => {
            isUserInteracting = true;
            stopAutoScroll();
        });

        container.addEventListener("mouseleave", () => {
            isUserInteracting = false;
            startAutoScroll();
        });

        startAutoScroll();
    }

    initAutoScrollCarousel(".services-carousel", ".carousel-card", 3800);
    initAutoScrollCarousel(".case-grid", ".case-card", 4200);
    initAutoScrollCarousel(".exiqo-grid", ".exiqo-card", 4000);

    // Specular Light WebGL Shader Controller (from React Bits SpecularButton)
    function initSpecularEffects() {
        if (typeof window.OGL === 'undefined') {
            setTimeout(initSpecularEffects, 100);
            return;
        }

        const { Renderer, Program, Mesh, Triangle, Color } = window.OGL;
        const PAD = 20;

        const VERT = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

        const FRAG = `#version 300 es
precision highp float;

uniform vec2 uCenter;
uniform vec2 uHalfSize;
uniform float uRadius;
uniform float uAngle;
uniform float uPx;
uniform vec3 uLineColor;
uniform vec3 uBaseColor;
uniform float uIntensity;
uniform float uShineSize;
uniform float uShineFade;
uniform float uThickness;
uniform float uBaseWidth;

out vec4 fragColor;

float sdRoundedRect(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + r;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}

float shapeSDF(vec2 p) { return sdRoundedRect(p, uHalfSize, uRadius); }

float gaussianLine(float d, float sigma) {
  float x = d / (sigma + 1e-6);
  float k = mix(1.0, 1.6, smoothstep(0.0, 1.5, x));
  return exp(-k * x * x);
}

void main() {
  vec2 p = gl_FragCoord.xy - uCenter;
  float d = shapeSDF(p);
  vec2 L = vec2(cos(uAngle), sin(uAngle));

  float base = (1.0 - smoothstep(0.0, uBaseWidth, abs(d))) * 0.45;

  vec2 nEll = normalize(p / (uHalfSize * uHalfSize) + 1e-6);
  float phi = acos(clamp(abs(dot(nEll, L)), 0.0, 1.0));
  float rim = 1.0 - smoothstep(uShineSize - uShineFade, uShineSize + uShineFade + 1e-4, phi);
  float line = gaussianLine(d, uThickness);
  float edgeClamp = 1.0 - smoothstep(0.5 * uPx, 3.0 * uPx, abs(d));
  float hi = line * rim * edgeClamp * uIntensity;

  vec3 col = uBaseColor * base + uLineColor * hi;
  float a = clamp(base + hi, 0.0, 1.0);
  fragColor = vec4(col, a);
}
`;

        function createSpecular(el, options = {}) {
            const config = Object.assign({
                radius: 16,
                lineColor: '#ffffff',
                baseColor: '#9b51e0',
                intensity: 1.3,
                shineSize: 15,
                shineFade: 35,
                thickness: 1.5,
                speed: 0.35,
                followMouse: true,
                proximity: 300,
                autoAnimate: false
            }, options);

            const fx = document.createElement('div');
            fx.className = 'specular-fx-layer';
            fx.style.position = 'absolute';
            fx.style.inset = '-20px';
            fx.style.pointerEvents = 'none';
            fx.style.zIndex = '3';
            el.style.position = 'relative';
            el.appendChild(fx);

            const dpr = window.devicePixelRatio || 1;
            const renderer = new Renderer({ alpha: true, premultipliedAlpha: true, antialias: true, dpr });
            const gl = renderer.gl;
            gl.clearColor(0, 0, 0, 0);
            gl.enable(gl.BLEND);
            gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

            const geometry = new Triangle(gl);
            if (geometry.attributes.uv) delete geometry.attributes.uv;

            const program = new Program(gl, {
                vertex: VERT,
                fragment: FRAG,
                uniforms: {
                    uCenter: { value: [0, 0] },
                    uHalfSize: { value: [1, 1] },
                    uRadius: { value: 0 },
                    uAngle: { value: 2.4 },
                    uPx: { value: dpr },
                    uLineColor: { value: [1, 1, 1] },
                    uBaseColor: { value: [0.32, 0.32, 0.32] },
                    uIntensity: { value: 1 },
                    uShineSize: { value: 0.17 },
                    uShineFade: { value: 0.7 },
                    uThickness: { value: 1.5 },
                    uBaseWidth: { value: dpr }
                }
            });

            const mesh = new Mesh(gl, { geometry, program });
            fx.appendChild(gl.canvas);
            gl.canvas.style.display = 'block';
            gl.canvas.style.width = '100%';
            gl.canvas.style.height = '100%';

            const sizeRef = { w: 1, h: 1 };
            const resize = () => {
                const rect = el.getBoundingClientRect();
                const w = rect.width;
                const h = rect.height;
                sizeRef.w = w;
                sizeRef.h = h;
                renderer.setSize(w + PAD * 2, h + PAD * 2);
                program.uniforms.uCenter.value = [(PAD + w / 2) * dpr, (PAD + h / 2) * dpr];
                program.uniforms.uHalfSize.value = [(w / 2) * dpr, (h / 2) * dpr];
            };
            const ro = new ResizeObserver(resize);
            ro.observe(el);
            resize();

            let pointerAngle = null;
            let proximityT = 0;
            const onPointerMove = e => {
                const rect = el.getBoundingClientRect();
                const cx = rect.left + rect.width / 2;
                const cy = rect.top + rect.height / 2;
                const dx = Math.max(rect.left - e.clientX, 0, e.clientX - rect.right);
                const dy = Math.max(rect.top - e.clientY, 0, e.clientY - rect.bottom);
                const dist = Math.hypot(dx, dy);

                if (dist === 0) {
                    const nx = (e.clientX - cx) / (rect.width / 2);
                    const ny = (cy - e.clientY) / (rect.height / 2);
                    pointerAngle = Math.atan2(2 / rect.height, -2 / rect.width) + nx * 0.3 + ny * 0.15;
                } else {
                    pointerAngle = Math.atan2(cy - e.clientY, e.clientX - cx);
                }
                const t = Math.max(0, 1 - dist / Math.max(config.proximity, 1));
                proximityT = t * t * (3 - 2 * t);
            };
            const hoverTarget = config.parentHoverEl || el;
            window.addEventListener('pointermove', onPointerMove);

            hoverTarget.addEventListener('mouseenter', () => {
                proximityT = 1;
            });
            hoverTarget.addEventListener('mouseleave', () => {
                proximityT = 0;
            });

            let angle = 2.4;
            let idleAngle = 2.4;
            let bright = 0;
            let last = performance.now();
            let raf = 0;

            const lineC = new Color();
            const baseC = new Color();

            const update = now => {
                raf = requestAnimationFrame(update);
                const dt = Math.min((now - last) / 1000, 0.05);
                last = now;

                idleAngle += config.speed * dt;
                const steer = config.followMouse && pointerAngle != null && (!config.autoAnimate || proximityT > 0);
                const target = steer ? pointerAngle : idleAngle;
                const diff = ((target - angle + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
                angle += diff * (1 - Math.exp(-dt * 7));

                const brightTarget = config.autoAnimate ? 1 : proximityT;
                bright += (brightTarget - bright) * (1 - Math.exp(-dt * 8));

                lineC.set(config.lineColor);
                baseC.set(config.baseColor);
                program.uniforms.uAngle.value = angle;
                program.uniforms.uRadius.value = Math.min(config.radius, Math.min(sizeRef.w, sizeRef.h) / 2) * dpr;
                program.uniforms.uLineColor.value = [lineC.r, lineC.g, lineC.b];
                program.uniforms.uBaseColor.value = [baseC.r, baseC.g, baseC.b];
                program.uniforms.uIntensity.value = config.intensity * bright;
                program.uniforms.uShineSize.value = (config.shineSize * Math.PI) / 180;
                program.uniforms.uShineFade.value = (config.shineFade * Math.PI) / 180;
                program.uniforms.uThickness.value = config.thickness * dpr;
                renderer.render({ scene: mesh });
            };
            raf = requestAnimationFrame(update);
        }

        // Attach Specular Light Effect EXCLUSIVELY to Case Study Tags (Pill Radius)
        document.querySelectorAll('.case-card').forEach(card => {
            const tag = card.querySelector('.tag');
            if (tag) {
                createSpecular(tag, {
                    radius: 15,
                    lineColor: '#ffffff',
                    baseColor: '#ffffff',
                    intensity: 1.6,
                    shineSize: 22,
                    shineFade: 40,
                    thickness: 1.6,
                    parentHoverEl: card,
                    proximity: 400
                });
            }
        });
    }

    initSpecularEffects();
});
