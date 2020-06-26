class Modal {
  constructor({
                selector, // селектор div обертки над контентом попапа
                className, // вешаэтся клас на блок overlay modal
                duration = null, // setTimeout auto open
                onOpen = () => {}, // callback open popup
                onClose = () => {}, // callback close popup
                autoHide = true // скрыть блок автоматически

  }) {
    this.content = document.querySelector(selector);
    this._onOpen = onOpen;
    this._onClose = onClose;
    this.autoHide = autoHide;
    this.className = className;
    this.duration = duration;

  }

  init() { // нужно вызвать при инициализации после создания попапа
    if (this.autoHide) {
      this.content.classList.add('none')
    }
    this.createOverlayModal = document.createElement('div');
    this.createOverlayModal.classList.add('overlay-modal');
    if (this.className) {
      this.createOverlayModal.classList.add(this.className);
    }
    this.createOverlayModal.innerHTML = `<div class="modal">
                                            <span id="closeBtn"></span>
                                            ${this.content.innerHTML}
                                         </div>`

    document.body.appendChild(this.createOverlayModal)

    this.createOverlayModal.addEventListener('click', (e) => {
      const isModal = e.target.closest('.modal');
      const isCloseBtn = e.target.closest('#closeBtn');
      if (!isModal || isCloseBtn) {
        this.close()
      }
    })

    document.querySelector('#closeBtn').addEventListener('click', (e) => {
      this.close()
    })

    if (this.duration) {
      setTimeout(() => this.open(), this.duration)
    }
  }

  open() { // открить попап
    this._onOpen();
    this.createOverlayModal.classList.add('open');
  }

  close () {  // закрить попап
    this._onClose()
    this.createOverlayModal.classList.remove('open');
  }

}

const modal1 = new Modal({  // создаём новий попап
  selector: '#form', // селектор
  className: 'main-popup', // class на overlay modal
  autoHide: false, // скрить передаваемый content на html
  duration: 4000,
  onOpen: () => {  // callback open popup


  },
  onClose: () => { // callback close popup

  }
});
modal1.init()

const openBtn = document.querySelector('#openBtn');

openBtn.addEventListener('click', () => {
  modal1.open()
})


const modal2 = new Modal({ // создаём новий попап
  selector: '#modal2', // селектор
  className: 'main-overlay', // class на overlay modal
  autoHide: true, // скрить передаваемый content на html
  onOpen: () => {  // callback open popup

  },
  onClose: () => { // callback close popup

  }
})
modal2.init();

const openModal2 =  document.querySelector('#openModal2')
openModal2.addEventListener('click', () => {
  modal2.open()
})

