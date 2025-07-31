let characteristic;
const canvas = document.getElementById('gauge');
const ctx = canvas.getContext('2d');
const radius = canvas.width / 2;

function drawGauge(value) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.arc(radius, radius, radius - 20, 0.75 * Math.PI, 0.25 * Math.PI);
  ctx.lineWidth = 20;
  ctx.strokeStyle = "#555";
  ctx.stroke();

  // عقربه
  let angle = 0.75 * Math.PI + (value / 60) * (1.5 * Math.PI);
  ctx.beginPath();
  ctx.moveTo(radius, radius);
  ctx.lineTo(radius + (radius - 40) * Math.cos(angle), radius + (radius - 40) * Math.sin(angle));
  ctx.strokeStyle = "#0f0";
  ctx.lineWidth = 5;
  ctx.stroke();

  ctx.font = "30px Arial";
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.fillText(value.toFixed(1), radius, radius + 60);
}

async function connectBLE() {
  try {
    const device = await navigator.bluetooth.requestDevice({
      filters: [{ namePrefix: 'ESP32' }],
      optionalServices: ['12345678-1234-5678-1234-56789abcdef0']
    });
    const server = await device.gatt.connect();
    const service = await server.getPrimaryService('12345678-1234-5678-1234-56789abcdef0');
    characteristic = await service.getCharacteristic('abcdef01-1234-5678-1234-56789abcdef0');
    await characteristic.startNotifications();
    characteristic.addEventListener('characteristicvaluechanged', handleNotification);
    console.log("✅ Connected");
  } catch (error) {
    console.error(error);
  }
}

function handleNotification(event) {
  let value = new TextDecoder().decode(event.target.value);
  let speed = parseFloat(value);
  document.getElementById('speed').innerText = speed.toFixed(1) + " km/h";
  drawGauge(speed);
}

drawGauge(0);
