// Script JavaScript pour ajouter de l'interactivité au portfolio

// Fonction pour valider un formulaire générique
function validateForm(name, email, message) {
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

// Fonction pour stocker un message dans localStorage
function storeMessage(type, name, email, message) {
    const messages = JSON.parse(localStorage.getItem('portfolioMessages')) || [];
    messages.push({
        type: type,
        name: name,
        email: email,
        message: message,
        timestamp: new Date().toISOString()
    });
    localStorage.setItem('portfolioMessages', JSON.stringify(messages));
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

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    // Valider le formulaire
    if (validateForm(name, email, message)) {
        // Stocker le message
        storeMessage('contact', name, email, message);

        // Afficher une alerte avec le message "Message envoyé !"
        alert('Message envoyé !');

        // Réinitialiser le formulaire après l'alerte
        this.reset();
    }
});

// Fonction pour gérer la soumission du formulaire de demande de site similaire
document.getElementById('similar-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const name = document.getElementById('similar-name').value.trim();
    const email = document.getElementById('similar-email').value.trim();
    const message = document.getElementById('similar-message').value.trim();

    if (validateForm(name, email, message)) {
        storeMessage('similar', name, email, message);
        alert('Demande envoyée !');
        this.reset();
        // Fermer le modal
        document.getElementById('contact-modal').style.display = 'none';
    }
});

// Fonction pour gérer la soumission du formulaire de demande de modifications
document.getElementById('modify-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const name = document.getElementById('modify-name').value.trim();
    const email = document.getElementById('modify-email').value.trim();
    const message = document.getElementById('modify-message').value.trim();

    if (validateForm(name, email, message)) {
        storeMessage('modify', name, email, message);
        alert('Demande envoyée !');
        this.reset();
        // Fermer le modal
        document.getElementById('modify-modal').style.display = 'none';
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
    setupAdminPanel();
    setupChat();
});

// Fonction pour ajouter la fonctionnalité popup aux projets
function addProjectPopups() {
    const projects = document.querySelectorAll('.project');
    const popup = document.getElementById('project-modal');
    const popupTitle = document.getElementById('modal-title');
    const popupDescription = document.getElementById('modal-description');
    const popupTech = document.getElementById('modal-tech');
    const closeBtns = document.querySelectorAll('.close-btn');

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

    closeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            popup.style.display = 'none';
            document.getElementById('contact-modal').style.display = 'none';
            document.getElementById('modify-modal').style.display = 'none';
            document.getElementById('admin-modal').style.display = 'none';
            document.getElementById('chat-modal').style.display = 'none';
        });
    });

    popup.addEventListener('click', (e) => {
        if (e.target === popup) {
            popup.style.display = 'none';
        }
    });

    // Boutons dans le modal projet
    document.getElementById('similar-btn').addEventListener('click', () => {
        popup.style.display = 'none';
        document.getElementById('contact-modal').style.display = 'flex';
    });

    document.getElementById('modify-btn').addEventListener('click', () => {
        popup.style.display = 'none';
        document.getElementById('modify-modal').style.display = 'flex';
    });
}

// Fonction pour gérer le panneau admin
function setupAdminPanel() {
    document.getElementById('admin-btn').addEventListener('click', () => {
        const messages = JSON.parse(localStorage.getItem('portfolioMessages')) || [];
        const chats = JSON.parse(localStorage.getItem('portfolioChats')) || [];
        const messagesList = document.getElementById('messages-list');
        messagesList.innerHTML = '';

        // Display regular messages
        if (messages.length > 0) {
            messages.forEach(msg => {
                const msgDiv = document.createElement('div');
                msgDiv.className = 'message-item';
                msgDiv.innerHTML = `
                    <h4>${msg.type === 'contact' ? 'Contact' : msg.type === 'similar' ? 'Demande similaire' : 'Modification'}</h4>
                    <p><strong>Nom:</strong> ${msg.name}</p>
                    <p><strong>Email:</strong> ${msg.email}</p>
                    <p><strong>Message:</strong> ${msg.message}</p>
                    <p><strong>Date:</strong> ${new Date(msg.timestamp).toLocaleString()}</p>
                    <hr>
                `;
                messagesList.appendChild(msgDiv);
            });
        }

        // Display chats
        if (chats.length > 0) {
            chats.forEach(chat => {
                const chatDiv = document.createElement('div');
                chatDiv.className = 'message-item';
                chatDiv.innerHTML = `
                    <h4>Chat avec ${chat.name}</h4>
                    <p><strong>Email:</strong> ${chat.email}</p>
                    <div class="chat-history">
                        ${chat.messages.map(m => `
                            <p><strong>${m.sender === 'owner' ? 'Vous' : chat.name}:</strong> ${m.message} <small>(${new Date(m.timestamp).toLocaleString()})</small></p>
                        `).join('')}
                    </div>
                    <form class="reply-form" data-chat-id="${chat.id}">
                        <textarea placeholder="Votre réponse..." required></textarea>
                        <button type="submit" class="submit-btn">Répondre</button>
                    </form>
                    <hr>
                `;
                messagesList.appendChild(chatDiv);
            });

            // Add event listeners for reply forms
            document.querySelectorAll('.reply-form').forEach(form => {
                form.addEventListener('submit', (e) => {
                    e.preventDefault();
                    const chatId = form.getAttribute('data-chat-id');
                    const message = form.querySelector('textarea').value.trim();
                    if (message) {
                        replyToChat(chatId, message);
                        form.reset();
                        // Refresh admin panel
                        setupAdminPanel();
                        document.getElementById('admin-btn').click();
                    }
                });
            });
        }

        if (messages.length === 0 && chats.length === 0) {
            messagesList.innerHTML = '<p>Aucun message ou chat reçu.</p>';
        }

        document.getElementById('admin-modal').style.display = 'flex';
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
