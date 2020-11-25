const elmLapsScore = document.querySelector('#laps_score');
const btnStart = document.querySelector('#btn_start');
const btnPause = document.querySelector('#btn_pause');
const btnStop = document.querySelector('#btn_stop');
const elmMinutes = document.querySelector('#elmMinutes');
const elmSeconds = document.querySelector('#elmSeconds');
let countDownInterval = {};
let laps = 0;

data = {
  value: 'Some value',
  foo: 'Info de Foo',
  todo: 'Todo info',
  timerSeconds: 0,
  timerMinutes: 0,
};

const renderValues = () => {
  Array.from(document.querySelectorAll('[model]')).map( item => {
    const modelAttribute = item.attributes['model'].value;

    if (typeof(item.value) !== 'undefined') {
      item.value = data[modelAttribute];
    } else if (typeof(item.innerText) !== 'undefined') {
      item.innerText = data[modelAttribute];
    }
  });
  console.log(data);
};

targetProxy = new Proxy(data, {
  set: function (target, key, value) {
    console.log(target, key, value);
    console.log(`${key} set to ${value}`);
    target[key] = value;
    renderValues();
    return true;
  }
});

Array.from(document.querySelectorAll('[model]')).map((item) => {
  const modelAttribute = item.attributes['model'].value;
  console.log(data[modelAttribute]);

  if (item.tagName === 'INPUT') {
    item.addEventListener('change', (e) => {
      targetProxy[modelAttribute] = e.target.value;
      renderValues();
    });
  }

  renderValues(item);
});

const renderTimer = () => {
  const renderSeconds = data.timerSeconds < 10 ? `0${data.timerSeconds}` : data.timerSeconds;
  const renderMinutes = data.timerMinutes < 10 ? `0${data.timerMinutes}` : data.timerMinutes;
  timer.textContent = `${renderMinutes}:${renderSeconds}`;
};

const countDown = () => {
  if (data.timerMinutes === 0 && data.timerSeconds === 0) {
    incrementLaps();
    stopCountDown();
    renderLaps();
    playSound();
    return;
  }

  if (data.timerSeconds >= 1) {
    --targetProxy.timerSeconds;
  } else {
    targetProxy.timerSeconds = 59;
    --targetProxy.timerMinutes;
  }

  renderTimer();
  console.log(data.timerMinutes, data.timerSeconds)
};

const startCountdown = () => {
  countDownInterval = setInterval(countDown, 1000);
};

const stopCountDown = () => {
  targetProxy.timerMinutes = 25;
  targetProxy.timerSeconds = 0;
  renderTimer();
  clearInterval(countDownInterval);
};

const playSound = () => {
  console.log('func playSound');

};

const getLaps = () => {
  return Number.parseInt(localStorage.getItem('laps')) || 0;
};

const incrementLaps = () => {
  saveLaps(++laps);
};

const saveLaps = (intLaps) => {
  if (!Number.isInteger(intLaps)) {
    throw new Error('intLaps not Integer');
  }

  localStorage.setItem('laps', intLaps)
};

const renderLaps = () => {

  const lapsIcon = '🐶';
  let lapsContent = new String();

  for (let i = 0; i < laps; i++) {
    lapsContent += lapsIcon;
  }

  elmLapsScore.textContent = lapsContent;


};

const init = () => {
  targetProxy.timerMinutes = Number.parseInt(elmMinutes.textContent);
  targetProxy.timerSeconds = Number.parseInt(elmSeconds.textContent);
  laps = getLaps();
  renderLaps();

  console.log(data.timerMinutes, data.timerSeconds);

  btnStart.addEventListener('click', () => {
    console.log('Button Start clicked.');
    startCountdown(data.timerMinutes, data.timerSeconds);
  });

  btnPause.addEventListener('click', () => {
    console.log('Button Pause clicked.');
    clearInterval(countDownInterval);
  });

  btnStop.addEventListener('click', () => {
    console.log('Button Stop clicked.');
    stopCountDown();
  });

};

init();


