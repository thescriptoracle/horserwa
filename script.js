// Mobile menu functionality
document.addEventListener("DOMContentLoaded", () => {
	const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
	const mobileMenu = document.querySelector(".mobile-menu");
	const mobileNavLinks = document.querySelectorAll(".mobile-nav-link");

	const closeMenuBtn = document.querySelector(".close-menu");
	if (mobileMenuBtn && mobileMenu && closeMenuBtn) {
		// Close mobile menu when clicking the close button
		closeMenuBtn.addEventListener("click", () => {
			mobileMenu.style.display = "none";
		});
		// Toggle mobile menu
		mobileMenuBtn.addEventListener("click", () => {
			mobileMenuBtn.classList.toggle("active");
			if (mobileMenu.style.display === "inline") {
				mobileMenu.style.display = "none";
			} else {
				mobileMenu.style.display = "inline";
			}
			document.body.classList.toggle("menu-open");
		});

		// Close mobile menu when clicking on a link
		for (const link of mobileNavLinks) {
			link.addEventListener("click", () => {
				mobileMenuBtn.classList.remove("active");
				mobileMenu.style.display = "none";
				document.body.classList.remove("menu-open");
			});
		}

		// Close mobile menu when clicking outside
		document.addEventListener("click", (e) => {
			if (!mobileMenuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
				mobileMenuBtn.classList.remove("active");
				mobileMenu.classList.remove("active");
				document.body.classList.remove("menu-open");
			}
		});
	}
});

// Navbar scroll effect
window.addEventListener("scroll", () => {
	const navbar = document.querySelector(".navbar");
	const logo = document.querySelector(".nav-logo img");

	if (window.scrollY > 100) {
		navbar.classList.add("scrolled");
		logo.src = "assets/logos/logo-red.png";
	} else {
		navbar.classList.remove("scrolled");
		logo.src = "assets/logos/logo-white.png";
	}
});

// Stats counter animation
function animateCounter(element, start, end, duration, suffix = "", prefix = "") {
	let startTimestamp = null;
	const step = (timestamp) => {
		if (!startTimestamp) startTimestamp = timestamp;
		const progress = Math.min((timestamp - startTimestamp) / duration, 1);
		const current = Math.floor(progress * (end - start) + start);
		element.textContent = prefix + current.toLocaleString() + suffix;
		if (progress < 1) {
			window.requestAnimationFrame(step);
		}
	};
	window.requestAnimationFrame(step);
}

// Function to parse and animate stat numbers
function animateStatNumber(element) {
	const originalText = element.getAttribute("data-target") || element.textContent;
	const text = originalText.trim();

	// Handle different formats
	if (text.includes("$") && text.includes("B")) {
		// Handle $177B - start from 100B
		const number = Number.parseFloat(text.replace(/[$B]/g, ""));
		const startValue = Math.floor(number * 0.6); // Start from 60% of target
		element.textContent = `$${startValue}B`;
		animateCounter(element, startValue, number, 1500, "B", "$");
	} else if (text.includes("k+")) {
		// Handle 250k+ - start from 150k+
		const number = Number.parseFloat(text.replace(/[k+]/g, ""));
		const startValue = Math.floor(number * 0.6); // Start from 60% of target
		element.textContent = `${startValue}k+`;
		animateCounter(element, startValue, number, 1500, "k+");
	} else if (text.includes("$") && text.includes("M")) {
		// Handle $10M-$14M - animate both numbers
		const matches = text.match(/\$(\d+)M-\$(\d+)M/);
		if (matches) {
			const startNum = Number.parseInt(matches[1]);
			const endNum = Number.parseInt(matches[2]);
			const startValue = Math.floor(startNum * 0.6);
			element.textContent = `$${startValue}M-$${startValue + 4}M`;

			// Animate both numbers in the range
			let startTimestamp = null;
			const step = (timestamp) => {
				if (!startTimestamp) startTimestamp = timestamp;
				const progress = Math.min((timestamp - startTimestamp) / 1500, 1);
				const currentStart = Math.floor(progress * (startNum - startValue) + startValue);
				const currentEnd = Math.floor(progress * (endNum - (startValue + 4)) + (startValue + 4));
				element.textContent = `$${currentStart}M-$${currentEnd}M`;
				if (progress < 1) {
					window.requestAnimationFrame(step);
				}
			};
			window.requestAnimationFrame(step);
		}
	}
}

// Set up intersection observer for stats animation
const statsObserver = new IntersectionObserver(
	(entries) => {
		for (const entry of entries) {
			if (entry.isIntersecting) {
				const statNumbers = entry.target.querySelectorAll(".stat-number");
				for (const statNumber of statNumbers) {
					// Store original text as data attribute
					if (!statNumber.getAttribute("data-target")) {
						statNumber.setAttribute("data-target", statNumber.textContent);
					}
					// Start all animations at the same time
					animateStatNumber(statNumber);
				}
				// Unobserve after animation starts to prevent re-triggering
				statsObserver.unobserve(entry.target);
			}
		}
	},
	{
		threshold: 0.5, // Trigger when 50% of the stats section is visible
	},
);

// General animation observer for all sections
const animationObserver = new IntersectionObserver(
	(entries) => {
		for (const entry of entries) {
			if (entry.isIntersecting) {
				const animatedElements = entry.target.querySelectorAll(
					".fade-in-up, .fade-in-left, .fade-in-right, .scale-in",
				);
				for (const element of animatedElements) {
					element.classList.add("animate");
				}
				// Unobserve after animation starts to prevent re-triggering
				animationObserver.unobserve(entry.target);
			}
		}
	},
	{
		threshold: 0.2, // Trigger when 20% of the section is visible
	},
);

// Start observing sections when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
	// Observe stats section for counter animation
	const statsSection = document.querySelector(".stats");
	if (statsSection) {
		statsObserver.observe(statsSection);
	}

	// Observe all sections with animations
	const sectionsToAnimate = [".digitizing", ".ecosystem", ".marketplace", ".brrs-stable", ".industry-leaders"];

	for (const sectionSelector of sectionsToAnimate) {
		const section = document.querySelector(sectionSelector);
		if (section) {
			animationObserver.observe(section);
		}
	}
});
