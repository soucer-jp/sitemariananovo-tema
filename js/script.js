document.addEventListener('DOMContentLoaded', function() {
    
    // --- 1. CONSERTO DE IMAGENS ---
    const allImages = document.querySelectorAll('img');
    allImages.forEach(img => {
      img.style.color = 'inherit'; 
      if (img.getAttribute('data-nimg')) {
        img.removeAttribute('data-nimg');
      }
    });

    // --- 2. FORMULÁRIO DE WHATSAPP (COMPORTAMENTO ORIGINAL) ---
    const form = document.querySelector('section#contato form');
    
    if (form) {
      const nameInput = document.getElementById('name');
      const submitBtn = form.querySelector('button[type="submit"]');
      const modalidadeContainer = form.querySelector('.flex.gap-3');
      const modalidadeBtns = modalidadeContainer.querySelectorAll('button');
      let modalidadeSelecionada = "";

      // Descrição (escondida inicialmente)
      const descricaoDiv = document.createElement('div');
      descricaoDiv.className = "text-xs text-gray-600 bg-white/40 rounded-xl p-3 mt-3 hidden";
      modalidadeContainer.insertAdjacentElement('afterend', descricaoDiv);

      // Função para verificar se libera o botão
      function verificarFormulario() {
        const temNome = nameInput.value.trim() !== "";
        const temModalidade = modalidadeSelecionada !== "";

        if (temNome && temModalidade) {
          submitBtn.removeAttribute('disabled');
          submitBtn.style.cursor = 'pointer';
          submitBtn.style.opacity = '1';
        } else {
          submitBtn.setAttribute('disabled', 'true');
          submitBtn.style.cursor = 'not-allowed';
          submitBtn.style.opacity = '0.5';
        }
      }

      // Função para resetar (limpar tudo)
      function resetarFormulario() {
        nameInput.value = "";
        modalidadeSelecionada = "";
        
        // Botões voltam a ficar cinza
        modalidadeBtns.forEach(b => {
            b.className = "flex-1 px-4 py-3 rounded-2xl border-2 transition-all duration-200 border-white/30 bg-white/30 text-gray-700 hover:border-brand-300";
        });

        // Esconde descrição
        descricaoDiv.classList.add('hidden');
        descricaoDiv.innerHTML = "";
        
        // Trava botão novamente
        verificarFormulario();
      }

      // Monitora digitação
      if (nameInput) {
        nameInput.addEventListener('input', verificarFormulario);
      }

      // Monitora botões de modalidade
      modalidadeBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
          e.preventDefault();
          
          modalidadeBtns.forEach(b => {
            b.className = "flex-1 px-4 py-3 rounded-2xl border-2 transition-all duration-200 border-white/30 bg-white/30 text-gray-700 hover:border-brand-300";
          });
          
          this.className = "flex-1 px-4 py-3 rounded-2xl border-2 transition-all duration-200 border-brand-600 bg-brand-600/10 text-brand-700";
          
          const isOnline = this.innerText.includes("Online");
          modalidadeSelecionada = isOnline ? "online" : "presencial";
          
          descricaoDiv.classList.remove('hidden');
          if (isOnline) {
            descricaoDiv.innerHTML = "💻 Atendimento via videochamada no conforto da sua casa";
          } else {
            descricaoDiv.innerHTML = "🏢 Atendimento no consultório com todo acolhimento presencial";
          }
          
          verificarFormulario();
        });
      });

      // ENVIO IMEDIATO (COM DATA-ATTRIBUTE)
      form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!nameInput.value || !modalidadeSelecionada) return;

        // 1. Pega o número direto do HTML (do placeholder {{WHATSAPP}})
        const numeroDestino = form.getAttribute('data-whatsapp');

        // Segurança: Se esquecerem de por o número, avisa
        if (!numeroDestino || numeroDestino.includes("{{")) {
            alert("Por favor, configure o número do WhatsApp no arquivo index.html");
            return;
        }

        const tipoAtendimento = modalidadeSelecionada === "online" ? "consultas *online*" : "consultas *presenciais*";
        
        // Dica: Tirei o "Maria Eduarda" fixo da mensagem também para ficar 100% genérico
        const mensagem = `Olá! 👋\n\nMeu nome é *${nameInput.value}* e gostaria de agendar uma sessão de psicoterapia.\n\nTenho interesse em ${tipoAtendimento}.\n\nPoderia me informar sobre:\n• Valores das sessões\n• Disponibilidade de horários\n• Como funciona o processo\n\nFico no aguardo do seu retorno! 😊`;
        
        // Usa o número dinâmico
        const linkWhatsapp = `https://wa.me/${numeroDestino}?text=${encodeURIComponent(mensagem)}`;
        
        window.open(linkWhatsapp, '_blank');
        resetarFormulario();
      });
    }

    // --- 3. LÓGICA DO FAQ ---
    const sectionDuvidas = document.getElementById('duvidas');
    if (sectionDuvidas) {
        const faqButtons = sectionDuvidas.querySelectorAll('button');
        
        faqButtons.forEach(btn => {
          btn.addEventListener('click', function() {
            const resposta = this.nextElementSibling;
            const iconeContainer = this.querySelector('.flex-shrink-0');
            const iconeSvg = iconeContainer ? iconeContainer.querySelector('svg') : null;
            const estaAberto = resposta.classList.contains('max-h-96');

            faqButtons.forEach(otherBtn => {
                const otherResposta = otherBtn.nextElementSibling;
                const otherIcone = otherBtn.querySelector('.flex-shrink-0');
                const otherSvg = otherBtn.querySelector('svg');
                
                if(otherResposta) {
                    otherResposta.classList.remove('max-h-96', 'opacity-100');
                    otherResposta.classList.add('max-h-0', 'opacity-0');
                }
                if(otherIcone) otherIcone.classList.remove('rotate-45', 'bg-brand-200');
                if(otherSvg) otherSvg.classList.remove('text-brand-700');
            });

            if (!estaAberto) {
              resposta.classList.remove('max-h-0', 'opacity-0');
              resposta.classList.add('max-h-96', 'opacity-100');
              if(iconeContainer) iconeContainer.classList.add('rotate-45', 'bg-brand-200');
              if(iconeSvg) iconeSvg.classList.add('text-brand-700');
            }
          });
        });
    }

    // --- 4. MENU MOBILE ---
    const menuBtn = document.querySelector('header button[aria-label="Menu"]');
    const headerContainer = document.querySelector('header .container');
    
    if (menuBtn && headerContainer) {
        const mobileMenuDiv = document.createElement('div');
        mobileMenuDiv.className = "lg:hidden border-t border-neutral-200/50 bg-white/95 backdrop-blur hidden";
        mobileMenuDiv.innerHTML = `
            <nav class="py-4 space-y-1">
                <a href="#inicio" class="block px-4 py-3 text-neutral-700 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors font-medium">Início</a>
                <a href="#sobre" class="block px-4 py-3 text-neutral-700 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors font-medium">Sobre mim</a>
                <a href="#servicos" class="block px-4 py-3 text-neutral-700 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors font-medium">Serviços</a>
                <a href="#duvidas" class="block px-4 py-3 text-neutral-700 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors font-medium">Dúvidas</a>
                <a href="#contato" class="flex items-center gap-2 mx-4 mt-4 px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-full font-medium transition-colors justify-center">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path></svg>
                    Agendar Consulta
                </a>
            </nav>
        `;
        headerContainer.appendChild(mobileMenuDiv);

        menuBtn.addEventListener('click', function() {
            const isHidden = mobileMenuDiv.classList.contains('hidden');
            const icon = this.querySelector('svg');
            if (isHidden) {
                mobileMenuDiv.classList.remove('hidden');
                if(icon) icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>';
            } else {
                mobileMenuDiv.classList.add('hidden');
                if(icon) icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>';
            }
        });

        mobileMenuDiv.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuDiv.classList.add('hidden');
                const icon = menuBtn.querySelector('svg');
                if(icon) icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>';
            });
        });
    }

     

});