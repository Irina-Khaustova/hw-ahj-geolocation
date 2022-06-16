import Validator from './validator';

export default class Messages {
  constructor(container) {
    this.storage = JSON.parse(window.localStorage.getItem('posts')) || [];
    if (this.storage.length) {
      this.posts = this.storage.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else {
      this.posts = [];
    }
    this.container = container;
    this.button = this.container.querySelector('.button');
    this.newMessage = this.button.addEventListener('click', (e) => {
      e.preventDefault();
      this.createMessage();
    });
  }

  createMessage() {
    this.inputContainer = document.createElement('div');
    this.inputContainer.classList.add('input-container');
    this.inputWrapper = document.createElement('form');
    this.inputWrapper.classList.add('input-wrapper');
    this.input = document.createElement('textarea');
    this.input.classList.add('textarea');
    this.input.placeholder = 'Напишите что-нибудь...';
    this.buttonAdd = document.createElement('button');
    this.buttonAdd.textContent = 'добавить';
    this.buttonAdd.classList.add('button-add');
    this.buttonCancel = document.createElement('button');
    this.buttonCancel.textContent = 'отменить';
    this.buttonCancel.classList.add('button-cancel');
    this.buttonContainer = document.createElement('div');
    this.buttonContainer.classList.add('button-container');
    this.buttonContainer.append(this.buttonAdd, this.buttonCancel);
    this.inputWrapper.append(this.input, this.buttonContainer);
    this.inputContainer.append(this.inputWrapper);
    document.body.append(this.inputContainer);
    this.buttonAdd.addEventListener('click', (e) => {
      e.preventDefault();
      if (!this.input.value) {
        this.inputContainer.remove();
        return;
      }
      this.data = { text: this.input.value };
      if (!navigator.geolocation) {
        this.enterCoordsByUser();
      }
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        this.data.coords = { latitude, longitude };
        this.inputContainer.remove();
        this.savePost();
        this.showPost(this.data);
      },
      () => {
        if (!this.manualCoords) {
          this.enterCoordsByUser();
        }
        if (this.manualCoords.value) {
          try {
            this.data.coords = new Validator(this.manualCoords.value).isvalid();
            this.inputContainer.remove();
            this.savePost(this.data);
            this.showPost(this.data);
          } catch (er) {
            this.warning = document.createElement('div');
            this.warning.classList.add('warning');
            this.warning.textContent = `${er.message}`;
            if (document.querySelector('.warning')) {
              return;
            }
            document.querySelector('.manual-coords').after(this.warning);
          }
        }
      });
    });
    this.buttonCancel.addEventListener('click', (e) => {
      e.preventDefault();
      this.inputContainer.remove();
    });
  }

  showPost(data) {
    this.message = document.createElement('div');
    this.message.classList.add('message');
    this.message.id = `${data.id}`;
    this.message.innerHTML = `${data.text}`;
    this.buttonClose = document.createElement('div');
    this.buttonClose.classList.add('button-close');
    this.buttonClose.textContent = 'x';
    this.geolocation = document.createElement('div');
    this.geolocation.classList.add('geolocation');
    this.geolocation.innerText = `${data.coords.latitude}, ${data.coords.longitude}`;
    this.message.append(this.buttonClose, this.geolocation);
    this.container.append(this.message);
  }

  savePost() {
    this.data.date = new Date();
    this.data.id = this.posts.length;
    this.storage.push(this.data);
    window.localStorage.setItem('posts', JSON.stringify(this.storage));
    // console.log(this.storage);
  }

  enterCoordsByUser() {
    this.manualCoords = document.createElement('input');
    this.manualCoords.classList.add('manual-coords');
    const wrapperInput = document.querySelector('.input-wrapper');
    const manualCoordsText = document.createElement('span');
    manualCoordsText.textContent = 'Что-то пошло не так, введите координаты';
    const firstInput = wrapperInput.querySelector('.textarea');
    firstInput.after(manualCoordsText);
    manualCoordsText.after(this.manualCoords);
  }

  init() {
    if (this.posts) {
      this.posts.forEach((post, index) => {
        this.posts[index].id = index;
        this.showPost(post);
      });
    }
    this.container.addEventListener('click', (e) => {
      if (e.target.classList.contains('button-close')) {
        const removeEl = this.storage.findIndex((item) => item.id.toString() === `${e.target.parentElement.id}`);
        this.storage.splice(removeEl, 1);
        window.localStorage.setItem('posts', JSON.stringify(this.storage));
        e.target.parentElement.remove();
      }
    });
  }
}
