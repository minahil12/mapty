'use strict';

// prettier-ignore

class Workout {
  date = new Date();
  id = (Date.now() + '').slice(-10);
  constructor(distance, duration, coords) {
    this.distance = distance;
    this.duration = duration;
    this.coords = coords;
  }
}

class Running extends Workout {
  type = 'running';
  constructor(distance, duration, coords, candence) {
    super(distance, duration, coords);
    this.candence = candence;
    this.calPace();
    this._setDescription();
  }

  calPace() {
    //min/km
    this.pace = this.duration / this.distance;
    return this.pace;
  }
  _setDescription() {
    //prettier ignore
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    this.description = `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${
      months[this.date.getMonth()]
    } ${this.date.getDate()}`;
  }
}

class Cycling extends Workout {
  type = 'cycling';
  constructor(distance, duration, coords, elevation) {
    super(distance, duration, coords);
    this.elevation = elevation;
    this.calcSpeed();
    this._setDescription();
  }

  calcSpeed() {
    //km/h
    this.speed = this.distance / (this.duration / 60);
    return this.speed;
  }

  _setDescription() {
    //prettier ignore
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    this.description = `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${
      months[this.date.getMonth()]
    } ${this.date.getDate()}`;
  }
}

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

class App {
  #map;
  #mapEvent;
  #workouts = [];
  constructor() {
    this._getPosition();

    form.addEventListener('submit', this._newWorkout.bind(this));

    inputType.addEventListener('change', this._toggleElevation);
  }

  _getPosition() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        this._loadMap.bind(this),
        function () {
          console.log('Couldnt get your location');
        }
      );
    }
  }

  _loadMap(position) {
    const { latitude } = position.coords;
    const { longitude } = position.coords;
    /*
          console.log(
            `https://www.google.com/maps/@${latitude},${longitude},15z?entry=ttu&g_ep=EgoyMDI1MDIwMi4wIKXMDSoASAFQAw%3D%3D`
          );
      */

    const cords = [latitude, longitude];

    this.#map = L.map('map').setView(cords, 13);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    this.#map.on('click', this._showForm.bind(this));
  }

  _showForm(mapE) {
    this.#mapEvent = mapE;
    form.classList.remove('hidden');
    inputDistance.focus();
  }

  _toggleElevation() {
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
  }

  _newWorkout(e) {
    const isValidInput = (...inputs) =>
      inputs.every(inp => Number.isFinite(inp));

    const allPositive = (...inputs) => inputs.every(inp => inp > 0);
    e.preventDefault();

    //Get Data from form

    const distance = +inputDistance.value; //adding thr + will convert it to number
    const type = inputType.value;
    const duration = +inputDuration.value;
    let workout;
    const { lat, lng } = this.#mapEvent.latlng;
    //if workout is running create running object
    if (type === 'running') {
      const cadence = +inputCadence.value;
      //check if data is valid

      if (
        !isValidInput(distance, duration, cadence) ||
        !allPositive(distance, duration, cadence)
      )
        return alert('This is not a positive number');

      workout = new Running(distance, duration, [lat, lng], cadence);
    }
    //if workout is cycling create cycling object
    if (type === 'cycling') {
      const elevation = +inputElevation.value;
      //check if data is valid

      if (
        !isValidInput(distance, duration, elevation) ||
        !allPositive(distance, duration)
      )
        return alert('This is not a positive number');

      workout = new Cycling(distance, duration, [lat, lng], elevation);
    }

    this.#workouts.push(workout);
    console.log(this.#workouts);

    this._renderWorkoutMarker(workout);
    this._renderWorkout(workout);
    inputCadence.value =
      inputDistance.value =
      inputDuration.value =
      inputElevation.value =
        '';

    form.classList.add('hidden');
  }

  _renderWorkoutMarker(workout) {
    L.marker(workout.coords)
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: `${workout.type}-popup`,
        })
      )
      .setPopupContent(workout.type)
      .openPopup();
  }

  _renderWorkout(workout) {
    const html = `
    <li class="workout workout--${workout.type} data-id="${workout.id}">
          <h2 class="workout__title">${workout.description}</h2>
          <div class="workout__details">
            <span class="workout__icon">${
              workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'
            }</span>
            <span class="workout__value">${workout.distance}</span>
            <span class="workout__unit">km</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⏱</span>
            <span class="workout__value">${workout.duration}</span>
            <span class="workout__unit">min</span>
          </div>
    </li>`;

    if (workout.type === 'running') {
      html += ``;
    }
  }
}
const app = new App();
