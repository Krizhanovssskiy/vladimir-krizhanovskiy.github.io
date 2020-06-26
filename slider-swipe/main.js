document.addEventListener('DOMContentLoaded', function () {

  class Slider {
    constructor({ slider, button_next, button_prev, slider_count, auto, dots }) {
      this.button_next = button_next;
      this.button_prev = button_prev;
      this.slider_count = slider_count;
      this.index = 0;
      this.auto = auto;
      this.dots = dots;

      this.slider = document.querySelector(slider);
      this.children = this.slider.children;
      this.posThreshold = this.children[0].offsetWidth * 0.35;
      this.moving = false;
      this.posInit = 0;
      this.posX1 = 0;
      this.posX2 = 0;
      this.posFinal = 0;
    }

    addClass = () => {
      for (let i = 0; i < this.children.length; i++) {
        if (i !== this.index) {
          this.children[i].classList.remove('react');
        }
      }
      this.children[this.index].classList.add('react');
    }

    next = () => {
      if (this.index === this.children.length - 1) return;
      if (this.moving) return;
      // this.infinityNext();

      this.moving = true;

      this.index += 1;
      this.children[this.index].style.zIndex = 999;
      this.children[this.index].style.transform = 'translateX(0)';

      this.activeDots();
      this.addClass();


      this.children[this.index].addEventListener('transitionend', (event) => {
        if (!event.target.classList.contains('react')) return;
        // if (this.children[this.index - 1]) {
        //   this.children[this.index - 1].style.transform = 'translateX(-100%)';
        // }

        [...this.children].forEach( (item, i) => {
          if ( i < this.index ) {
            item.style.transform = 'translateX(-100%)';
          }
          if ( i > this.index ) {
            item.style.transform = 'translateX(100%)';
          }
        })

        for (let i = 0; i < this.children.length; i++) {
          if (i !== this.index) {
            this.children[i].style.zIndex = i;
          } else {
            this.children[i].style.zIndex = 998;
          }
        }

        this.moving = false;

      }, true);

      this.move();
    }

    prev = () => {
      if (this.index === 0) return;
      if (this.moving) return;

      this.moving = true;
      this.index -= 1;

      this.children[this.index].style.transform = 'translateX(0)';
      this.activeDots();
      this.addClass();

      this.children[this.index].style.zIndex = 999;

      this.children[this.index].addEventListener('transitionend', (event) => {
        if (!event.target.classList.contains('react')) return;
        for (let i = 0; i < this.children.length; i++) {
          if (i !== this.index) {
            this.children[i].style.zIndex = i;

          } else {
            this.children[i].style.zIndex = 998;
          }
        }

        for (let i = this.index; i < this.children.length; i++) {
          if (this.children[i + 1]) {
            this.children[i + 1].style.transform = 'translateX(100%)';
          }
        }

        this.moving = false;

      });

      this.move();
    }

    activeDots = () => {
      for (let i = 0; i < this.dotsChildren.length; i++) {
        this.dotsChildren[i].classList.remove('active');
      }
      this.dotsChildren[this.index].classList.add('active');
    }

    // infinityNext = () => {
    //     if (this.moving) return;
    //     if (this.index === this.children.length - 1) {
    //         for (let i = 0; i < this.children.length; i++) {
    //             // if (i === 0) {
    //             //     this.children[0].style.transform = 'translateX(100%)';
    //             // }
    //             // if (i !== this.index) {
    //                 this.children[i].style.transform = 'translateX(100%)';
    //             // }
    //         }
    //         this.index = -1;
    //     }
    // }

    getEvent = () => {
      return (event.type.search('touch') !== -1) ? event.touches[0] : event;
    }

    onSwipeStart = () => {
      const evt = this.getEvent();
      this.posInit = this.posX1 = evt.clientX;

      document.addEventListener('touchmove', this.onSwipeAction);
      document.addEventListener('touchend', this.onSwipeEnd);
      document.addEventListener('mousemove', this.onSwipeAction);
      document.addEventListener('mouseup', this.onSwipeEnd);
    }

    onSwipeAction = () => {
      const evt = this.getEvent();
      this.posX2 = this.posX1 - evt.clientX;
      this.posX1 = evt.clientX;
    }

    onSwipeEnd = () => {
      this.posFinal = this.posInit - this.posX1;

      document.removeEventListener('touchmove', this.onSwipeAction);
      document.removeEventListener('mousemove', this.onSwipeAction);
      document.removeEventListener('touchend', this.onSwipeEnd);
      document.removeEventListener('mouseup', this.onSwipeEnd);

      if (Math.abs(this.posFinal) > this.posThreshold) {
        // если мы тянули вправо, то уменьшаем номер текущего слайда
        if (this.posInit < this.posX1) {
          this.prev()
          // если мы тянули влево, то увеличиваем номер текущего слайда
        } else if (this.posInit > this.posX1) {
          this.next();
        }
      }
    }

    onAutoSlider() {
      if (this.auto) {
        this.revert = false
        this.idInterval = setInterval(() => {

          if (this.index === this.children.length - 1) {
            this.revert = true;
          } else if (this.index === 0) {
            this.revert = false;
          }
          if (this.revert) {
            this.prev();
          } else {
            this.next();
          }

        }, 3000)
      }

    }

    init() {
      this.idInterval = '';

      this.button_next = document.querySelector(this.button_next);
      this.button_prev = document.querySelector(this.button_prev);
      this.slider_count = document.querySelector(this.slider_count);

      this.dots = document.querySelector(this.dots);
      this.dotsChildren = this.dots.children;

      this.children[this.index].classList.add('react');
      this.dotsChildren[this.index].classList.add('active');

      this.button_next.addEventListener('click', () => {
        this.next();
      });
      this.button_prev.addEventListener('click', () => {
        this.prev();
      });

      for (let i = 0; i < this.dotsChildren.length; i++) {
        this.dotsChildren[i].addEventListener('click', () => {
          if (this.moving) return;

          if (this.dotsChildren[i].classList.contains('active')) return;
          [...this.dotsChildren].forEach(function (element) {
            element.classList.remove('active');
          });
          this.dotsChildren[i].classList.add('active');
          const dotsIndex = this.dotsChildren[i].dataset.index;
          if (this.index < dotsIndex) {
            this.index = +dotsIndex - 1;
            this.next()
          }
          if (this.index > dotsIndex) {
            this.index = +dotsIndex + 1;
            this.prev()
          }
        })
      }

      this.slider.addEventListener('touchstart', this.onSwipeStart)
      this.slider.addEventListener('mousedown', this.onSwipeStart)

      this.onAutoSlider()

      // this.slider.addEventListener('mouseenter', () => {
      //   clearInterval(this.idInterval)
      // })

      this.slider.addEventListener('mouseover', () => {
        clearInterval(this.idInterval)
      })
      this.slider.addEventListener('mouseout', () => {
        this.auto = true;
        this.onAutoSlider();
      })
    }

    move = () => {
      this.slider_count.innerHTML = `${this.index + 1} / ${this.children.length}`;
    }

  }

  const slider_wellcome = new Slider({
    slider: '#slider',
    button_prev: '#button_prev',
    button_next: '#button_next',
    slider_count: '#slider-count',
    auto: true,
    dots: '#slider-dots'
  });

  slider_wellcome.init();


});
