function initMainApp() {
    // 1. Hero Section Video & Canvas Fallback Logic
    const video = document.getElementById("heroVideo");
    const canvas = document.getElementById("heroCanvas");

    if (video) {
        const playPromise = video.play();
        if (playPromise !== undefined) {
            playPromise.catch(function (error) {
                console.log("Autoplay blocked or file not found. Activating tech canvas animation fallback.");
                initHeroCanvas();
            });
        }

        video.addEventListener('error', function () {
            video.style.display = 'none';
            initHeroCanvas();
        });
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
            image: "image/service.png"
        },
        {
            title: "Product & Platform Engineering",
            desc: "End-to-end <strong>product development lifecycle</strong> services from concept and <strong>MVP build</strong> to full-scale <strong>platform modernization</strong>, microservices, and <strong>SaaS architecture</strong>.",
            tags: ["Full-Stack SaaS Development", "Microservices Architecture", "API Engineering", "Legacy System Modernization", "Cloud-Native Apps"],
            image: "image/case1.png"
        },
        {
            title: "Product Modernization",
            desc: "Re-architecting <strong>legacy monoliths</strong> into <strong>cloud-native microservices</strong>, optimizing <strong>database performance</strong>, and updating user experience toolchains.",
            tags: ["Cloud Migration", "Monolith Refactoring", "API Gateway Setup", "Performance Optimization", "Tech Stack Upgrade"],
            image: "image/case2.png"
        },
        {
            title: "Sustenance & Support",
            desc: "Providing <strong>24/7/365 operational maintenance</strong>, proactive monitoring, <strong>security patching</strong>, <strong>SLA-backed bug fixes</strong>, and continuous product enhancements.",
            tags: ["24/7 Managed Ops", "SLA Assurance", "Security Patching", "Bug Fixing & Support", "Continuous Optimization"],
            image: "image/case3.png"
        },
        {
            title: "Electronic Data Automation [EDA]",
            desc: "Automating complex <strong>document extraction</strong>, semiconductor & hardware <strong>workflow automation</strong>, and automated data pipelines using <strong>AI and vision models</strong>.",
            tags: ["EDA Workflow Automation", "Document Processing AI", "Semiconductor Design Tech", "Pipeline Automation", "Data Parsing"],
            image: "image/exiqo.png"
        },
        {
            title: "Quality Assurance & Testing",
            desc: "Ensuring <strong>zero-defect software releases</strong> through <strong>automated regression suites</strong>, continuous performance testing, and <strong>cybersecurity audit integration</strong>.",
            tags: ["Automated Regression", "Performance Testing", "Cybersecurity Audits", "API & Integration Testing", "CI/CD Test Pipelines"],
            image: "image/whitepaper.png"
        },
        {
            title: "Rapid Application Development [RAD]",
            desc: "Accelerating <strong>time-to-market</strong> using <strong>low-code/no-code platforms</strong>, modular component libraries, and <strong>agile sprint delivery frameworks</strong>.",
            tags: ["Low-Code Platforms", "Rapid MVP Delivery", "Agile Sprints", "Modular Architecture", "Cross-Platform Apps"],
            image: "image/hero.jpg"
        },
        {
            title: "Digital Adoption Platform [DAP]",
            desc: "Maximizing <strong>software adoption</strong> and user onboarding efficiency with <strong>in-app guidance</strong>, interactive walkthroughs, and <strong>real-time usage analytics</strong>.",
            tags: ["Interactive Walkthroughs", "User Analytics", "In-App Onboarding", "Change Management", "Workflow Automation"],
            image: "image/techtalk.png"
        },
        {
            title: "CTO-as-a-Service",
            desc: "Providing high-level <strong>strategic technology leadership</strong>, AI architecture guidance, <strong>vendor selection</strong>, and engineering team scaling on demand.",
            tags: ["Fractional CTO Leadership", "Tech Architecture Audits", "Team Scaling & Mentorship", "Vendor & Tool Evaluation", "IP Protection"],
            image: "image/video.png"
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
                            <div class="apple-accordion-body">
                                <p class="apple-accordion-desc">${item.desc}</p>
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

        const AUTO_PLAY_DELAY = 6000;
        let autoPlayTimer = null;
        let currentCategoryIndex = 0;
        let animationFrameId = null;

        const nodeConfigs = [
            { baseAngle: 142, radiusRatio: 0.3571 },
            { baseAngle: 152, radiusRatio: 0.2143 },
            { baseAngle: 90,  radiusRatio: 0.3571 },
            { baseAngle: 28,  radiusRatio: 0.2143 },
            { baseAngle: 38,  radiusRatio: 0.3571 }
        ];

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

        selectCategoryTab(0, false);
        startAutoPlayTimer();
        requestAnimationFrame(updatePositions);
    }
    
    try { initAppleShowcase(); } catch (err) { console.error("Showcase error:", err); }
    try { initTechEcosystem(); } catch (err) { console.error("TechEcosystem error:", err); }
    try { initCardStack(); } catch (err) { console.error("CardStack error:", err); }

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

    // 4. React Bits 3D Stack Component & 3-Scroll Fly-To-Back Engine
    function initCardStack() {
        const stackContainer = document.getElementById("stackContainer");
        const wrapper = document.getElementById("otherServicesWrapper");
        const section = document.getElementById("otherServicesSection");
        const prevBtn = document.getElementById("carouselPrevBtn");
        const nextBtn = document.getElementById("carouselNextBtn");

        if (!stackContainer) return;

        const cardEls = Array.from(stackContainer.querySelectorAll(".stack-card"));
        if (cardEls.length < 4) return;

        // Base deck order mapping for step S (0..3)
        // Step 0: Card 1 on top ([3, 2, 1, 0])
        // Step 1: Card 2 on top ([0, 3, 2, 1])
        // Step 2: Card 3 on top ([1, 0, 3, 2])
        // Step 3: Card 4 on top ([2, 1, 0, 3])
        function getDeckForStep(step) {
            const backCards = [];
            for (let i = 0; i < step; i++) backCards.push(i);
            const frontCards = [];
            for (let i = step; i < 4; i++) frontCards.push(i);

            // Return array from bottom (pos 0) to top (pos 3)
            return [...backCards.reverse(), ...frontCards.reverse()];
        }

        let currentStep = 0; // 0, 1, 2, or 3
        const rotations = [-6, 5, -3, 6];
        let isAnimating = false;

        function applyDeckTransforms(step, animated = true) {
            currentStep = Math.max(0, Math.min(3, step));
            const deck = getDeckForStep(currentStep); // deck[0] = bottom, deck[3] = top
            const total = deck.length;

            deck.forEach((cardIdx, pos) => {
                const cardEl = cardEls[cardIdx];
                const reversePos = total - 1 - pos; // 0 for top card, 3 for bottom card
                const rotZ = rotations[cardIdx % rotations.length] + (reversePos * 3.5);
                const scale = 1 - (reversePos * 0.05);
                const translateY = reversePos * 14;
                const zIndex = pos + 1;

                cardEl.style.transition = animated 
                    ? 'transform 0.55s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.45s ease, border-color 0.35s ease' 
                    : 'none';
                cardEl.style.zIndex = zIndex;
                cardEl.style.transform = `translateY(${translateY}px) scale(${scale}) rotate(${rotZ}deg)`;
            });
        }

        // Exact React Bits <Stack /> Slide-Left & Spring-To-Back Engine
        function animateSendTopToBack(targetStep) {
            if (isAnimating) return;
            isAnimating = true;

            const currentDeck = getDeckForStep(currentStep);
            const topCardIdx = currentDeck[currentDeck.length - 1];
            const topCardEl = cardEls[topCardIdx];

            // Phase 1: Top card slides out to the LEFT with rotation (matching React Bits)
            topCardEl.style.zIndex = "10";
            topCardEl.style.transition = "transform 0.32s cubic-bezier(0.22, 1, 0.36, 1)";
            topCardEl.style.transform = "translateX(-160px) translateY(12px) rotate(-14deg) scale(0.96)";

            setTimeout(() => {
                // Phase 2: Drop z-index to bottom (1) and slide into place behind the stack deck
                currentStep = Math.max(0, Math.min(3, targetStep));
                const newDeck = getDeckForStep(currentStep);
                const total = newDeck.length;

                newDeck.forEach((cardIdx, pos) => {
                    const cardEl = cardEls[cardIdx];
                    const reversePos = total - 1 - pos; // 0 for top card, 3 for bottom card
                    const rotZ = rotations[cardIdx % rotations.length] + (reversePos * 3.5);
                    const scale = 1 - (reversePos * 0.05);
                    const translateY = reversePos * 14;
                    const zIndex = pos + 1;

                    if (cardIdx === topCardIdx) {
                        cardEl.style.zIndex = "1";
                        cardEl.style.transition = "transform 0.45s cubic-bezier(0.175, 0.885, 0.32, 1.15)";
                        cardEl.style.transform = `translateY(${translateY}px) scale(${scale}) rotate(${rotZ}deg)`;
                    } else {
                        cardEl.style.zIndex = zIndex;
                        cardEl.style.transition = "transform 0.45s cubic-bezier(0.175, 0.885, 0.32, 1.15)";
                        cardEl.style.transform = `translateY(${translateY}px) scale(${scale}) rotate(${rotZ}deg)`;
                    }
                });

                setTimeout(() => {
                    isAnimating = false;
                }, 400);
            }, 220);
        }

        function setDeckStep(step) {
            const nextStep = Math.max(0, Math.min(3, step));
            if (nextStep === currentStep) return;

            if (nextStep > currentStep) {
                animateSendTopToBack(nextStep);
            } else {
                applyDeckTransforms(nextStep, true);
            }
        }

        // Drag & Swipe Engine for TOP Card
        let isDragging = false;
        let startX = 0, startY = 0;
        let deltaX = 0, deltaY = 0;
        let activeTopCardEl = null;

        cardEls.forEach((cardEl) => {
            cardEl.addEventListener("mousedown", handleDragStart);
            cardEl.addEventListener("touchstart", handleDragStart, { passive: true });
        });

        function handleDragStart(e) {
            if (e.target.closest("a") || isAnimating) return;

            const currentDeck = getDeckForStep(currentStep);
            const topIdx = currentDeck[currentDeck.length - 1];
            activeTopCardEl = cardEls[topIdx];
            isDragging = true;

            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            startX = clientX;
            startY = clientY;
            deltaX = 0;
            deltaY = 0;

            activeTopCardEl.classList.add("is-dragging");
            activeTopCardEl.style.transition = "none";

            window.addEventListener("mousemove", handleDragMove);
            window.addEventListener("touchmove", handleDragMove, { passive: false });
            window.addEventListener("mouseup", handleDragEnd);
            window.addEventListener("touchend", handleDragEnd);
        }

        function handleDragMove(e) {
            if (!isDragging || !activeTopCardEl) return;
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;

            deltaX = clientX - startX;
            deltaY = clientY - startY;

            if (e.cancelable && (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5)) {
                e.preventDefault();
            }

            const rotZ = -6 + (deltaX * 0.08);
            const rotX = deltaY * -0.05;

            activeTopCardEl.style.transform = `translate(${deltaX}px, ${deltaY}px) rotate(${rotZ}deg) rotateX(${rotX}deg) scale(1.03)`;
        }

        function handleDragEnd() {
            if (!isDragging || !activeTopCardEl) return;
            isDragging = false;
            activeTopCardEl.classList.remove("is-dragging");

            window.removeEventListener("mousemove", handleDragMove);
            window.removeEventListener("touchmove", handleDragMove);
            window.removeEventListener("mouseup", handleDragEnd);
            window.removeEventListener("touchend", handleDragEnd);

            const dist = Math.hypot(deltaX, deltaY);
            if (dist > 30 || Math.abs(deltaX) > 25 || Math.abs(deltaY) > 25) {
                activeTopCardEl.style.transition = "transform 0.3s ease-out";
                activeTopCardEl.style.transform = `translate(${deltaX * 1.6}px, ${deltaY * 1.6}px) rotate(${deltaX * 0.12}deg) scale(0.9)`;
                setTimeout(() => {
                    if (currentStep < 3) setDeckStep(currentStep + 1);
                    else applyDeckTransforms(3, true);
                }, 150);
            } else {
                if (currentStep < 3) setDeckStep(currentStep + 1);
                else applyDeckTransforms(3, true);
            }
        }

        // Direct Mouse Wheel Scroll (Scroll Down -> Move Next Card to Top)
        if (section) {
            let wheelCooling = false;
            section.addEventListener("wheel", (e) => {
                if (wheelCooling) return;

                if (e.deltaY > 10 && currentStep < 3) {
                    wheelCooling = true;
                    setDeckStep(currentStep + 1);
                    setTimeout(() => { wheelCooling = false; }, 380);
                } else if (e.deltaY < -10 && currentStep > 0) {
                    wheelCooling = true;
                    setDeckStep(currentStep - 1);
                    setTimeout(() => { wheelCooling = false; }, 380);
                }
            }, { passive: true });
        }

        // Window Scroll Runway Tracker: Exactly 3 Scroll Transitions (Step 0 -> 1 -> 2 -> 3)
        if (wrapper) {
            window.addEventListener("scroll", () => {
                const rect = wrapper.getBoundingClientRect();
                const totalDist = rect.height - window.innerHeight;

                if (totalDist > 0 && rect.top <= 10 && rect.bottom >= window.innerHeight - 10) {
                    const scrollDist = Math.max(0, -rect.top);
                    const progress = Math.min(1, scrollDist / totalDist);

                    // 3 Equal Scroll Transitions across 4 Cards:
                    // 0% - 28%: Card 1 (Step 0)
                    // 28% - 62%: Card 2 (Step 1 - 1st Scroll)
                    // 62% - 88%: Card 3 (Step 2 - 2nd Scroll)
                    // 88% - 100%: Card 4 (Step 3 - 3rd Scroll)
                    let targetStep = 0;
                    if (progress >= 0.88) {
                        targetStep = 3;
                    } else if (progress >= 0.62) {
                        targetStep = 2;
                    } else if (progress >= 0.28) {
                        targetStep = 1;
                    }

                    if (targetStep !== currentStep) {
                        setDeckStep(targetStep);
                    }
                }
            }, { passive: true });
        }

        // Nav Arrow Buttons
        if (nextBtn) nextBtn.addEventListener("click", () => setDeckStep(currentStep + 1));
        if (prevBtn) prevBtn.addEventListener("click", () => setDeckStep(currentStep - 1));

        applyDeckTransforms(0, false);
    }
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initMainApp);
} else {
    initMainApp();
}
