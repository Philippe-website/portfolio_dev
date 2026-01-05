// Script JavaScript pour ajouter de l'interactivité au portfolio

// Fonction pour gérer la soumission du formulaire de contact
document.getElementById('contact-form').addEventListener('submit', function(event) {
    // Empêcher l'envoi réel du formulaire (pour éviter une redirection)
    event.preventDefault();

    // Afficher une alerte avec le message "Message envoyé !"
    alert('Message envoyé !');

    // Optionnel : réinitialiser le formulaire après l'alerte
    this.reset();
});

// Fonction pour un scroll doux vers les sections lors du clic sur la navigation
// (Amélioration optionnelle pour une meilleure UX)
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
