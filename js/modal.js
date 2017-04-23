;(function(){

    let modalContent, modalContainer, modalWindow, hider, loader, modals;

    //обработчики событий для ссылок на модальные окна
    modals = document.querySelectorAll("[data-modal]");
    for (let i=0; i<modals.length; i++){
        modals[i].addEventListener('click', function(event) { openModal.call(this, event); } );
    }

    function openModal(e) {
        modalWindow = getModal();
        modalWindow.classList.add("modal-window_visible");
        document.body.classList.add('modal-enabled');
        loader = modalWindow.querySelector("[data-type=modal-loader]");
        loader.classList.add("modal-window__load-indicator_visible");
        setTimeout(function(){
            modalWindow.classList.add("modal-window__overlay");
        },1);

        modalContainer = modalWindow.querySelector("[data-type=modal-container]");

        let contentHref = this.getAttribute('href');
        let contentType = this.getAttribute('data-modal');
        hider = modalWindow.querySelector("[data-type=modal-hider]");

        switch(contentType) {
            case "inline":
                let inlineContent;
                let inlineBlock = document.querySelector(contentHref);
                if(inlineBlock){
                    inlineContent = inlineBlock.innerHTML;
                } else {
                    inlineContent = "Error";
                    console.error("Can't find inline-block");
                }
                showModalContent(inlineContent);
                break;

            case "image":
                let imageHider = document.createElement('div');
                imageHider.style.display = "none";
                let image = document.createElement("img");
                image.setAttribute('src', contentHref);
                image.classList.add("modal-window__image");
                document.body.appendChild(imageHider);
                imageHider.appendChild(image);
                image.onload = function() {
                    showModalContent(image.outerHTML);
                    document.body.removeChild(imageHider);
                };
                break;

            case "ajax":
                let xhr = new XMLHttpRequest();
                xhr.open('GET', contentHref, true);
                xhr.send();
                xhr.onreadystatechange = function() {
                    if (xhr.readyState !== 4) return;
                    // button.innerHTML = 'Готово!';
                    if (xhr.status !== 200) {
                        console.error('[Modal] Content loading error' + xhr.status + ': ' + xhr.statusText);
                    } else {
                        let temp = document.getElementById('forXHR');
                        temp.innerHTML = xhr.responseText;
                        showModalContent(xhr.responseText);
                    }
                };
                break;

            default:
                let err =  document.createElement('div');
                err.innerHTML = "Error";
                err.className = "modal-window__error";
                content = err;
                console.log("Wrong content type in data-modal-type");
                break;

        }
        addEventListener("keydown", event => closeByEsc(event) );
        modalWindow.addEventListener("click", event => closeByOutsideClick(event));
        e.preventDefault();
    }

    function getModal() {
        let modal;
        if (document.querySelector("[data-type=modal-window]")){
            modal = document.querySelector("[data-type=modal-window]");
        }
        else {
            let nModalWindow = document.createElement('div');
            nModalWindow.classList.add("modal-window");
            nModalWindow.setAttribute("data-type", "modal-window");

            let nHider = document.createElement('div');
            nHider.setAttribute("data-type", "modal-hider");
            nHider.style.display = 'none';

            let nModalLoader = document.createElement('div');
            nModalLoader.classList.add("modal-window__load-indicator");
            nModalLoader.setAttribute("data-type", "modal-loader");

            let nModalContainer = document.createElement('div');
            nModalContainer.classList.add('modal-window__container');
            nModalContainer.setAttribute("data-type", "modal-container");

            let nModalCloseButton = document.createElement('div');
            nModalCloseButton.classList.add('modal-window__close');
            nModalCloseButton.setAttribute("data-type", "modal-close-button");
            nModalCloseButton.innerHTML = '&#10761;';

            let nModalContant = document.createElement('div');
            nModalContant.classList.add('modal-window__content');
            nModalContant.setAttribute("data-type", "modal-content");

            nModalContainer.appendChild(nModalCloseButton);
            nModalContainer.appendChild(nModalContant);
            nModalContainer.appendChild(nModalContant);

            nModalWindow.appendChild(nModalLoader);
            nModalWindow.appendChild(nModalContainer);
            nModalWindow.appendChild(nHider);
            document.body.appendChild(nModalWindow);

            modal = nModalWindow;
        }
        return modal;
    }

    function showModalContent(content) {
        modalContainer = modalWindow.querySelector("[data-type=modal-container]");
        modalContent = modalContainer.querySelector("[data-type=modal-content]");
        modalContent.innerHTML = content;
        loader.classList.remove("modal-window__load-indicator_visible");
        modalContainer.classList.add("modal-window__container_visible");
        if (modalContent.offsetHeight+25 > window.innerHeight){
           modalWindow.classList.add("modal-window_scroll");
        }
        setTimeout(function(){
            modalContainer.classList.add("modal-window__container_scale");
        },1);
        modalContainer.querySelector("[data-type=modal-close-button]").addEventListener("click", closeModal);
    }

    function closeModal() {
        modalContainer.classList.remove("modal-window__container_scale");
        modalWindow.classList.remove("modal-window__overlay");
        hider.innerHTML = '';
        setTimeout(function(){
            modalWindow.classList.remove("modal-window_visible");
            modalWindow.classList.remove("modal-window_scroll");
            modalContainer.classList.remove("modal-window__container_visible");
        },100);
        document.body.classList.remove('modal-enabled');
    }
    
    function closeByEsc(e) {
        if (e.keyCode == '27'){
            closeModal();
        }
    }
    
    function closeByOutsideClick(e) {
        let target = e.target;
        let clickOutside = true;
        while (target !== modalWindow) {
            if (target === modalContainer) {
                clickOutside = false;
                return;
            }
            target = target.parentNode;
        }
        if (clickOutside){
            closeModal();
        }
    }

})();