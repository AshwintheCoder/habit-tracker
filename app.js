class HabitTracker {
    constructor() {
        this.habits = JSON.parse(localStorage.getItem('habits')) || [];
        this.init();
    }

    init() {
        this.cacheDOM();
        this.bindEvents();
        this.renderDate();
        this.renderHabits();
    }

    cacheDOM() {
        this.dom = {
            addBtn: document.getElementById('add-habit-btn'),
            modal: document.getElementById('add-habit-modal'),
            closeModalBtn: document.getElementById('close-modal-btn'),
            form: document.getElementById('add-habit-form'),
            habitsContainer: document.getElementById('habits-container'),
            dateDisplay: document.getElementById('current-date'),
            habitNameInput: document.getElementById('habit-name'),
            // Delete Modal
            deleteModal: document.getElementById('delete-modal'),
            cancelDeleteBtn: document.getElementById('cancel-delete-btn'),
            confirmDeleteBtn: document.getElementById('confirm-delete-btn')
        };
    }

    bindEvents() {
        this.dom.addBtn.addEventListener('click', () => this.openModal());
        this.dom.closeModalBtn.addEventListener('click', () => this.closeModal());
        this.dom.form.addEventListener('submit', (e) => this.addHabit(e));
        this.dom.modal.addEventListener('click', (e) => {
            if (e.target === this.dom.modal) this.closeModal();
        });

        // Delete Modal Events
        this.dom.cancelDeleteBtn.addEventListener('click', () => this.closeDeleteModal());
        this.dom.confirmDeleteBtn.addEventListener('click', () => this.confirmDelete());
        this.dom.deleteModal.addEventListener('click', (e) => {
            if (e.target === this.dom.deleteModal) this.closeDeleteModal();
        });
    }

    renderDate() {
        const options = { weekday: 'long', month: 'long', day: 'numeric' };
        this.dom.dateDisplay.textContent = new Date().toLocaleDateString('en-US', options);
    }

    openModal() {
        this.dom.modal.classList.remove('hidden');
        this.dom.habitNameInput.focus();
    }

    closeModal() {
        this.dom.modal.classList.add('hidden');
        this.dom.form.reset();
    }

    openDeleteModal(id) {
        this.habitToDelete = id;
        this.dom.deleteModal.classList.remove('hidden');
    }

    closeDeleteModal() {
        this.habitToDelete = null;
        this.dom.deleteModal.classList.add('hidden');
    }

    confirmDelete() {
        if (this.habitToDelete) {
            this.habits = this.habits.filter(h => h.id !== this.habitToDelete);
            this.saveHabits();
            this.renderHabits();
            this.closeDeleteModal();
        }
    }

    addHabit(e) {
        e.preventDefault();
        const name = this.dom.habitNameInput.value.trim();
        const color = document.querySelector('input[name="habit-color"]:checked').value;

        if (name) {
            const newHabit = {
                id: Date.now(),
                name,
                color,
                streak: 0,
                completedDates: []
            };

            this.habits.push(newHabit);
            this.saveHabits();
            this.renderHabits();
            this.closeModal();
        }
    }

    toggleHabit(id) {
        const habit = this.habits.find(h => h.id === id);
        if (!habit) return;

        const today = new Date().toISOString().split('T')[0];
        const index = habit.completedDates.indexOf(today);
        let isCompleted = false;

        if (index === -1) {
            habit.completedDates.push(today);
            habit.streak++;
            isCompleted = true;
        } else {
            habit.completedDates.splice(index, 1);
            habit.streak = Math.max(0, habit.streak - 1);
            isCompleted = false;
        }

        this.saveHabits();

        // Update DOM in-place to avoid re-render glitch
        const card = document.querySelector(`.habit-card[data-id="${id}"]`);
        if (card) {
            if (isCompleted) {
                card.classList.add('completed');
            } else {
                card.classList.remove('completed');
            }
            // Update streak text
            const streakEl = card.querySelector('.habit-streak');
            if (streakEl) streakEl.textContent = `${habit.streak} day streak`;
        }
    }

    saveHabits() {
        localStorage.setItem('habits', JSON.stringify(this.habits));
    }

    renderHabits() {
        this.dom.habitsContainer.innerHTML = '';
        const today = new Date().toISOString().split('T')[0];

        if (this.habits.length === 0) {
            this.dom.habitsContainer.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                            <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </svg>
                    </div>
                    <h3>No habits yet</h3>
                    <p>Tap + to start tracking your first habit.</p>
                </div>
            `;
            return;
        }

        this.habits.forEach((habit, index) => {
            const isCompleted = habit.completedDates.includes(today);
            const card = document.createElement('div');
            card.className = `habit-card ${isCompleted ? 'completed' : ''}`;
            card.dataset.id = habit.id; // Add data-id for selection
            card.style.color = `var(--accent-${habit.color})`;
            card.style.animationDelay = `${index * 0.05}s`;

            card.innerHTML = `
                <div class="check-circle"></div>
                <div>
                    <div class="habit-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                    </div>
                    <div class="habit-name" style="color: var(--text-primary)">${habit.name}</div>
                    <div class="habit-streak">${habit.streak} day streak</div>
                </div>
                <button class="delete-btn" aria-label="Delete habit">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                </button>
            `;

            card.addEventListener('click', (e) => {
                // Check if delete button was clicked
                if (e.target.closest('.delete-btn')) {
                    e.stopPropagation();
                    this.openDeleteModal(habit.id);
                    return;
                }

                // Check if we are clicking the card (and not some other interactive element if any)
                this.toggleHabit(habit.id);

                // Re-check completion status from the updated habit object
                const updatedHabit = this.habits.find(h => h.id === habit.id);
                if (updatedHabit) {
                    const updatedIsCompleted = updatedHabit.completedDates.includes(today);
                    if (updatedIsCompleted) {
                        this.triggerConfetti(e.clientX, e.clientY);
                    }
                }
            });
            this.dom.habitsContainer.appendChild(card);
        });
    }

    deleteHabit(id) {
        // Deprecated in favor of openDeleteModal
        this.openDeleteModal(id);
    }

    triggerConfetti(x, y) {
        const colors = ['#007AFF', '#FF3B30', '#34C759', '#FF9500', '#AF52DE'];
        for (let i = 0; i < 20; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = `${x}px`;
            confetti.style.top = `${y}px`;
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.transform = `rotate(${Math.random() * 360}deg)`;

            document.body.appendChild(confetti);

            const angle = Math.random() * Math.PI * 2;
            const velocity = 2 + Math.random() * 4;
            const tx = Math.cos(angle) * velocity * 50;
            const ty = Math.sin(angle) * velocity * 50;

            const animation = confetti.animate([
                { transform: `translate(0, 0) rotate(0deg)`, opacity: 1 },
                { transform: `translate(${tx}px, ${ty}px) rotate(${Math.random() * 720}deg)`, opacity: 0 }
            ], {
                duration: 800 + Math.random() * 400,
                easing: 'cubic-bezier(0.25, 1, 0.5, 1)'
            });

            animation.onfinish = () => confetti.remove();
        }
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    new HabitTracker();
});
