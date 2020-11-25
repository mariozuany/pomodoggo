const btnStart = document.querySelector('#btn_start');
const btnPause = document.querySelector('#btn_pause');
const btnStop = document.querySelector('#btn_stop');

btnStart.addEventListener('click', () => {
  console.log('Button Start clicked.');
});

btnPause.addEventListener('click', () => {
  console.log('Button Pause clicked.');
});

btnStop.addEventListener('click', () => {
  console.log('Button Stop clicked.');
});