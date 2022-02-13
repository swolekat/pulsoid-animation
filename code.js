console.log('hello world');

const params = new URLSearchParams(window.location.search);

const pulsoidId = params.get("pulsoid-id");

const socket = new WebSocket(`wss://ramiel.pulsoid.net/listen/${pulsoidId}`);
const elementId = 'heart-number';
const element = document.getElementById(elementId);
const pulseElementId = 'heart-pulse';
const pulseElement = document.getElementById(pulseElementId);
let heartRate = 999;
let isPulsing = false;

const pulse = () => {
    isPulsing = true;
    pulseElement.style.transitionDuration = 0;
    pulseElement.style.transform = 'scale(0.6)';
    pulseElement.style.opacity = '1';
    const beatsPerSecond = heartRate/60;
    const secondsPerBeat = 1/beatsPerSecond;
    const msPerBeat = secondsPerBeat * 1000;
    setTimeout(() => {
        pulseElement.style.transitionDuration = `${secondsPerBeat}s`;
        pulseElement.style.transform = 'scale(1)';
        setTimeout(() => {
            pulse();
        }, msPerBeat);
    }, msPerBeat);
};

socket.onmessage = (event) => {
    heartRate = JSON.parse(event.data).data.heartRate;
    element.innerText = heartRate;
    if(!isPulsing){
        pulse();
    }
};

socket.onerror = (event) => {
    console.log(event);
};