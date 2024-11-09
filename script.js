function calculateProjectile() {
  const velocity = parseFloat(document.getElementById("velocity").value);
  const angle = parseFloat(document.getElementById("angle").value);
  const height = parseFloat(document.getElementById("height").value);
  const g = 9.81;

  if (isNaN(velocity) || velocity <= 0 || isNaN(angle) || angle < 0 || angle > 90 || isNaN(height) || height < 0) {
    alert("Please enter valid values.");
    return;
  }

  const angleRad = (angle * Math.PI) / 180;
  const timeOfFlight = (velocity * Math.sin(angleRad) + Math.sqrt(Math.pow(velocity * Math.sin(angleRad), 2) + 2 * g * height)) / g;
  const maxHeight = height + Math.pow(velocity * Math.sin(angleRad), 2) / (2 * g);
  const range = velocity * Math.cos(angleRad) * timeOfFlight;

  const finalVy = velocity * Math.sin(angleRad) - g * timeOfFlight;
  const finalVx = velocity * Math.cos(angleRad);
  const finalVelocity = Math.sqrt(Math.pow(finalVx, 2) + Math.pow(finalVy, 2));
  const impactAngle = Math.abs(Math.atan(finalVy / finalVx) * (180 / Math.PI));

  const resultDiv = document.getElementById("result");
  resultDiv.innerHTML = `
    <p>Time of Flight: ${timeOfFlight.toFixed(2)} s</p>
    <p>Maximum Height: ${maxHeight.toFixed(2)} m</p>
    <p>Range: ${range.toFixed(2)} m</p>
    <p>Final Velocity (Resultant): ${finalVelocity.toFixed(2)} m/s</p>
    <p>Angle of Impact: ${impactAngle.toFixed(2)}°</p>
  `;

  simulateProjectile(velocity, angleRad, height, timeOfFlight, maxHeight, range, finalVelocity, impactAngle);
}

function simulateProjectile(velocity, angleRad, initialHeight, totalTime, maxHeight, range, finalVelocity, impactAngle) {
  const canvas = document.getElementById("simulationCanvas");
  const ctx = canvas.getContext("2d");
  const g = 9.81;
  const scale = Math.min(canvas.width / range / 1.2, canvas.height / maxHeight / 2); // Dynamic scaling based on range and height

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "#555555";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(50, canvas.height - 50);
  ctx.lineTo(canvas.width - 20, canvas.height - 50); // x-axis
  ctx.moveTo(50, canvas.height - 50);
  ctx.lineTo(50, 20); // y-axis
  ctx.stroke();

  ctx.fillStyle = "#ffffff";
  ctx.font = "12px Arial";

  for (let i = 0; i <= maxHeight; i += Math.ceil(maxHeight / 5)) {
    const yPos = canvas.height - 50 - i * scale;
    ctx.fillText(i + " m", 20, yPos);
  }

  for (let i = 0; i <= range; i += Math.ceil(range / 5)) {
    const xPos = 50 + i * scale;
    ctx.fillText(i + " m", xPos, canvas.height - 30);
  }

  let time = 0;
  const interval = 15;

  function animate() {
    if (time > totalTime) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Axes
    ctx.strokeStyle = "#555555";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(50, canvas.height - 50);
    ctx.lineTo(canvas.width - 20, canvas.height - 50);
    ctx.moveTo(50, canvas.height - 50);
    ctx.lineTo(50, 20);
    ctx.stroke();

    // Labels for Axes
    ctx.fillStyle = "#ffffff";
    ctx.font = "12px Arial";
    for (let i = 0; i <= maxHeight; i += Math.ceil(maxHeight / 5)) {
      const yPos = canvas.height - 50 - i * scale;
      ctx.fillText(i + " m", 20, yPos);
    }
    for (let i = 0; i <= range; i += Math.ceil(range / 5)) {
      const xPos = 50 + i * scale;
      ctx.fillText(i + " m", xPos, canvas.height - 30);
    }

    // Calculate x and y positions of the projectile
    const x = velocity * Math.cos(angleRad) * time;
    const y = initialHeight + (velocity * Math.sin(angleRad) * time - 0.5 * g * Math.pow(time, 2));

    const canvasX = 50 + x * scale;
    const canvasY = canvas.height - 50 - y * scale;

    // Draw the projectile point
    ctx.beginPath();
    ctx.arc(canvasX, canvasY, 5, 0, 2 * Math.PI);
    ctx.fillStyle = "#0ea900";
    ctx.fill();

    // Display Information
    ctx.fillStyle = "#ffffff";
    ctx.font = "14px Arial";
    ctx.fillText(`Time: ${time.toFixed(2)} s`, 60, 20);
    ctx.fillText(`Height: ${y.toFixed(2)} m`, 60, 40);
    ctx.fillText(`Range: ${x.toFixed(2)} m`, 60, 60);
    ctx.fillText(`Resultant Velocity: ${finalVelocity.toFixed(2)} m/s`, 60, 80);
    ctx.fillText(`Impact Angle: ${impactAngle.toFixed(2)}°`, 60, 100);

    time += interval / 1000;
    requestAnimationFrame(animate);
  }

  animate();
}
