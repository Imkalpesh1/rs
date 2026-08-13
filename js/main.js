document.addEventListener("DOMContentLoaded", function () {
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

    // 2. Service Offerings Dynamic Tab Switching Logic
    const serviceData = [
        {
            title: "Generative AI & Enterprise AI Engineering",
            desc: "Designing, building, and deploying production-ready GenAI platforms, custom LLMs, RAG architectures, and autonomous AI agents tailored for your business domain.",
            tags: ["GenAI & LLM Integration", "RAG & Knowledge Graphs", "Autonomous AI Agents", "MLOps & Fine-Tuning", "AI Governance & Safety"]
        },
        {
            title: "Custom Software Product Engineering",
            desc: "End-to-end product development lifecycle services from concept and MVP build to full-scale platform modernization, microservices, and SaaS architecture.",
            tags: ["Full-Stack SaaS Development", "Microservices Architecture", "API Engineering", "Legacy System Modernization", "Cloud-Native Apps"]
        },
        {
            title: "Cloud Native & DevOps Engineering",
            desc: "Accelerating modern cloud infrastructure management, Kubernetes orchestration, zero-downtime CI/CD pipelines, and automated FinOps optimization.",
            tags: ["AWS / Azure / GCP Cloud", "Kubernetes & Containers", "CI/CD & GitOps Automation", "FinOps & Cloud Cost Optimization", "Infrastructure as Code"]
        },
        {
            title: "Data Engineering & Analytics",
            desc: "Building scalable enterprise data lakes, real-time streaming data pipelines, automated ETL/ELT workflows, and executive analytics dashboards.",
            tags: ["Enterprise Data Lakes", "Real-Time Data Streaming", "Snowflake & Databricks", "Automated ETL/ELT", "Predictive Analytics"]
        },
        {
            title: "UI/UX & Product Design Thinking",
            desc: "Crafting intuitive, accessible, high-conversion user interfaces backed by user research, design systems, and rapid interactive prototyping.",
            tags: ["Design Systems & UI Kits", "User Research & Testing", "Interactive Prototyping", "Design Thinking Workshops", "WCAG Accessibility"]
        },
        {
            title: "Quality Engineering & Test Automation",
            desc: "Ensuring zero-defect software releases through automated regression suites, continuous performance testing, and cybersecurity audit integration.",
            tags: ["Automated Regression", "Performance Testing", "Cybersecurity Audits", "API & Integration Testing", "CI/CD Test Pipelines"]
        },
        {
            title: "Rapid Application Development [RAD]",
            desc: "Accelerating time-to-market using low-code/no-code platforms, modular component libraries, and agile sprint delivery frameworks.",
            tags: ["Low-Code Platforms", "Rapid MVP Delivery", "Agile Sprints", "Modular Architecture", "Cross-Platform Apps"]
        },
        {
            title: "Digital Adoption Platform [DAP]",
            desc: "Maximizing software adoption and user onboarding efficiency with in-app guidance, interactive walkthroughs, and real-time usage analytics.",
            tags: ["Interactive Walkthroughs", "User Analytics", "In-App Onboarding", "Change Management", "Workflow Automation"]
        },
        {
            title: "CTO-as-a-Service",
            desc: "Providing high-level strategic technology leadership, AI architecture guidance, vendor selection, and engineering team scaling on demand.",
            tags: ["Fractional CTO Leadership", "Tech Architecture Audits", "Team Scaling & Mentorship", "Vendor & Tool Evaluation", "IP Protection"]
        }
    ];

    const tabItems = document.querySelectorAll(".service-tab-item");
    const titleDisplay = document.getElementById("serviceDisplayTitle");
    const descDisplay = document.getElementById("serviceDisplayDesc");
    const tagsDisplay = document.getElementById("serviceDisplayTags");

    tabItems.forEach(tab => {
        tab.addEventListener("click", function () {
            tabItems.forEach(t => t.classList.remove("active"));
            this.classList.add("active");

            const index = parseInt(this.getAttribute("data-service")) || 0;
            const data = serviceData[index];

            if (data && titleDisplay && descDisplay && tagsDisplay) {
                titleDisplay.innerText = data.title;
                descDisplay.innerText = data.desc;
                tagsDisplay.innerHTML = data.tags.map(tag => `<span class="pill">${tag}</span>`).join("");
            }
        });
    });

    // 3. Tech Ecosystem Tab Switching & Dynamic Icon Rendering
    function initTechEcosystem() {
        const techData = [
            {
                category: "GenAI and Cloud",
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
            const width = arena.clientWidth || 840;
            const height = arena.clientHeight || 440;
            const centerX = width / 2;
            const centerY = height; // Exact baseline anchor

            const nodes = container.querySelectorAll(".orbital-node");
            nodes.forEach((node, i) => {
                if (node.classList.contains("transitioning")) return;

                const cfg = nodeConfigs[i % nodeConfigs.length];
                const radius = width * cfg.radiusRatio;
                // Continuous revolving oscillation angle
                const delta = Math.sin(timestamp * 0.0012 + i * 1.3) * 2.8;
                const angleRad = (cfg.baseAngle + delta) * (Math.PI / 180);

                const x = centerX + radius * Math.cos(angleRad);
                const y = centerY - radius * Math.sin(angleRad);

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

        // Auto-Play Timer & Smooth Auto-Scroll Logic
        let autoPlayTimer = null;
        const AUTO_PLAY_DELAY = 4500; // 4.5 seconds per tab

        function selectCategoryTab(index, isUserAction = false) {
            tabs.forEach(t => t.classList.remove("active"));
            if (tabs[index]) {
                tabs[index].classList.add("active");
                // Smoothly scroll active tab into center view
                tabs[index].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
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
});
