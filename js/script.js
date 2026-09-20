/**
 * Application Logic for Todo Puertas Arequipa
 */

document.addEventListener('DOMContentLoaded', () => {
    /**
     * Mobile Navigation Drawer Toggle
     */
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    if (mobileLinks) {
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (mobileMenu) {
                    mobileMenu.classList.add('hidden');
                }
            });
        });
    }
});

/**
 * Dynamic Input Handler for "Otro" Service Option
 */
function toggleOtroServiceInput(selectElem) {
    const otroContainer = document.getElementById('otro_servicio_container');
    const otroInput = document.getElementById('otro_servicio');
    if (selectElem.value === 'Otro') {
        otroContainer.classList.remove('hidden');
        otroInput.setAttribute('required', 'true');
        otroInput.focus();
    } else {
        otroContainer.classList.add('hidden');
        otroInput.removeAttribute('required');
        otroInput.value = '';
    }
}

/**
 * Video Player Modal Handler
 */
function playVideoModal(videoUrl, title) {
    const modal = document.getElementById('videoModal');
    const iframe = document.getElementById('videoModalIframe');
    const titleElem = document.getElementById('videoModalTitle');
    
    titleElem.textContent = title || 'Demostración de Trabajo - Todo Puertas Arequipa';
    iframe.src = videoUrl + "?autoplay=1";
    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

function closeVideoModal() {
    const modal = document.getElementById('videoModal');
    const iframe = document.getElementById('videoModalIframe');
    iframe.src = '';
    modal.classList.add('hidden');
    modal.classList.remove('flex');
}

// Close modal on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeVideoModal();
    }
});

/**
 * Anti-XSS Sanitizer Utility
 */
function sanitizeInput(str) {
    if (!str) return '';
    return str.replace(/[&<>"']/g, function(m) {
        return {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        }[m];
    });
}

/**
 * Form Submission Logic and Mail Dispatch Simulation
 * Configured according to instructions:
 * Destination Email: msakiya14@gmail.com
 * Sender: marcos@todopuertasarequipa.com
 * Subject: ✅ Nuevo interesado en Todo Puertas Arequipa
 */
function handleFormSubmit(event) {
    event.preventDefault();

    // Check bot trap honeypot
    const trap = document.getElementById('website_trap').value;
    if (trap) {
        console.warn('Bot detected.');
        return false;
    }

    const submitBtn = document.getElementById('submitBtn');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner animate-spin"></i> Procesando solicitud...';

    // Gather & sanitize form data
    const rawNombre = document.getElementById('nombre').value;
    const rawTelefono = document.getElementById('telefono').value;
    const rawCorreo = document.getElementById('correo').value;
    let rawServicio = document.getElementById('tipo_servicio').value;

    if (rawServicio === 'Otro') {
        const otroDetalle = document.getElementById('otro_servicio').value;
        rawServicio = "Otro: " + otroDetalle;
    }

    const nombre = sanitizeInput(rawNombre);
    const telefono = sanitizeInput(rawTelefono);
    const correo = sanitizeInput(rawCorreo);
    const servicioSolicitado = sanitizeInput(rawServicio);

    const emailPayload = {
        to: "msakiya14@gmail.com",
        from: "marcos@todopuertasarequipa.com",
        subject: "✅ Nuevo interesado en Todo Puertas Arequipa",
        body: `Hola, tienes un lead nuevo en tu página:\nNombre: ${nombre}\nTeléfono: ${telefono}\nCorreo: ${correo}\nServicio solicitado: ${servicioSolicitado}\n\nEste lead viene gracias a https://todopuertasarequipa.com`
    };

    console.log("Email dispatch simulation ready:", emailPayload);

    // Simulate immediate server dispatch & redirect to Thank You page
    setTimeout(() => {
        // Populate summary inside thank you page
        const summaryBox = document.getElementById('leadSummaryBox');
        summaryBox.innerHTML = `
            <p class="font-bold text-gray-800 text-xs mb-1">Resumen del Lead Registrado:</p>
            <p><strong>Nombre:</strong> ${nombre}</p>
            <p><strong>Teléfono:</strong> ${telefono}</p>
            <p><strong>Correo:</strong> ${correo}</p>
            <p><strong>Servicio:</strong> ${servicioSolicitado}</p>
        `;

        // Update WhatsApp pre-filled link with requested text
        const waBaseText = encodeURIComponent(`Hola, vengo de tu página web, deseo más información de tus puertas.`);
        document.getElementById('whatsappThankYouLink').href = `https://wa.me/51959325030?text=${waBaseText}`;

        // Switch View to "Página de Gracias"
        document.getElementById('main-content').classList.add('hidden');
        document.getElementById('thank-you-view').classList.remove('hidden');
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Reset button state
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span>Enviar Solicitud de Cotización</span> <i class="fa-solid fa-paper-plane"></i>';
        document.getElementById('leadForm').reset();
    }, 800);
}

/**
 * Return from Thank You view to landing page
 */
function returnToLanding() {
    document.getElementById('thank-you-view').classList.add('hidden');
    document.getElementById('main-content').classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
