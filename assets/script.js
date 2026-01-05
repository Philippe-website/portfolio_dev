// Script JavaScript pour ajouter de l'interactivité au portfolio

// Fonction pour valider le formulaire de contact
function validateForm() {
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    // Vérifier si tous les champs sont remplis
    if (!name || !email || !message) {
        alert('Veuillez remplir tous les champs.');
        return false;
    }

    // Vérifier le format de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Veuillez entrer une adresse email valide.');
        return false;
    }

    return true;
}

// Fonction pour ajouter des effets visuels au formulaire
function addFormEffects() {
    const inputs = document.querySelectorAll('#contact-form input, #contact-form textarea');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.style.borderColor = '#4CAF50';
            input.style.boxShadow = '0 0 5px rgba(76, 175, 80, 0.5)';
        });
        input.addEventListener('blur', () => {
            input.style.borderColor = '#ccc';
            input.style.boxShadow = 'none';
        });
    });
}

// Fonction pour gérer la soumission du formulaire de contact
document.getElementById('contact-form').addEventListener('submit', function(event) {
    // Empêcher l'envoi réel du formulaire (pour éviter une redirection)
    event.preventDefault();

    // Valider le formulaire
    if (validateForm()) {
        // Afficher une alerte avec le message "Message envoyé !"
        alert('Message envoyé !');

        // Réinitialiser le formulaire après l'alerte
        this.reset();
    }
});

// Fonction pour déclencher les animations au scroll
function handleScroll() {
    const sections = document.querySelectorAll('.fade-in');
    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight - 100) {
            section.classList.add('visible');
        }
    });
}

// Écouter l'événement scroll pour déclencher les animations
window.addEventListener('scroll', handleScroll);

// Déclencher les animations au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    handleScroll();
    addFormEffects();
    addProjectPopups();
});

// Fonction pour ajouter la fonctionnalité popup aux projets
function addProjectPopups() {
    const projects = document.querySelectorAll('.project');
    const popup = document.getElementById('project-popup');
    const popupTitle = document.getElementById('popup-title');
    const popupDescription = document.getElementById('popup-description');
    const popupTech = document.getElementById('popup-tech');
    const closeBtn = document.querySelector('.close-btn');

    projects.forEach(project => {
        project.addEventListener('click', () => {
            const title = project.querySelector('h3').textContent;
            const description = project.querySelector('p').textContent;
            const tech = project.querySelector('p:last-child').textContent.replace('Technologie : ', '');

            popupTitle.textContent = title;
            popupDescription.textContent = description;
            popupTech.textContent = tech;

            popup.style.display = 'flex';
        });
    });

    closeBtn.addEventListener('click', () => {
        popup.style.display = 'none';
    });

    popup.addEventListener('click', (e) => {
        if (e.target === popup) {
            popup.style.display = 'none';
        }
    });
}

// Fonction pour un scroll doux vers les sections lors du clic sur la navigation
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth' });
        }
    });
});
