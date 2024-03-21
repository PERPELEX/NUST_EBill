function getRandomSize() {
    return Math.floor(Math.random() * 20) + 10;
}

function getRandomPosition() {
    return Math.random() * 100;
}

function getRandomDelay() {
    return Math.random() * 5;
}

function getRandomSpeed() {
    return Math.random() * 10 + 5; 
}


for (let i = 0; i < 13; i++) {
    const bubble = document.createElement("div");
    bubble.classList.add("bubble");
    bubble.style.width = bubble.style.height = `${getRandomSize()}px`;
    bubble.style.left = `${getRandomPosition()}%`;
    bubble.style.animationDuration = `${getRandomSpeed()}s`;
    bubble.style.animationDelay = `${getRandomDelay()+0}s`; 
    document.body.appendChild(bubble);
}