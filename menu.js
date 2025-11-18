document.addEventListener("DOMContentLoaded", () => {
    const items = [...document.querySelectorAll("#scroll-menu .scroll-item")];

    const sections = items.map(item => {
        const btn = item.querySelector(".scroll-btn");
        if (!btn || !btn.dataset.target) return null;

        const target = document.querySelector(btn.dataset.target);
        if (!target) return null;

        return {
            item,
            btn,
            target,
            unlocked: false
        };
    }).filter(Boolean); // fjerner null entries

    function updateScroll() {
        const scrollY = window.scrollY;
        const threshold = scrollY + window.innerHeight * 0.6;

        sections.forEach((sec, i) => {
            const top = sec.target.offsetTop;

            if (!sec.unlocked && threshold >= top) {
                sec.item.classList.remove("locked");
                sec.item.classList.add("unlocked");
                sec.unlocked = true;
            }

            const next = sections[i + 1];
            const nextTop = next ? next.target.offsetTop : Infinity;

            const isActive = threshold >= top && threshold < nextTop;
            sec.btn.classList.toggle("active", isActive);
        });
    }

    sections.forEach(sec => {
        sec.btn.addEventListener("click", () =>
            sec.target.scrollIntoView({ behavior: "smooth" })
        );
    });

    updateScroll();
    window.addEventListener("scroll", updateScroll);
});
