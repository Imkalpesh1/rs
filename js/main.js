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
});
