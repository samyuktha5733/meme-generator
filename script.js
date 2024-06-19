const subImageCountInput = document.querySelector("#subImageCountInput");
const textInputsContainer = document.querySelector("#textInputsContainer");
const imageFileInput = document.querySelector("#imageFileInput");
const canvas = document.querySelector("#meme");
let image;

subImageCountInput.addEventListener("input", createTextInputs);
imageFileInput.addEventListener("change", handleImageChange);

function createTextInputs() {
    textInputsContainer.innerHTML = '';
    const subImageCount = parseInt(subImageCountInput.value) || 1;

    for (let i = 0; i < subImageCount; i++) {
        const textInput = document.createElement("input");
        textInput.type = "text";
        textInput.placeholder = `Text for Sub Image ${i + 1}`;
        textInput.className = "textInput";
        textInputsContainer.appendChild(textInput);

        textInput.addEventListener("input", () => updateMemeCanvas(canvas, image, getTexts()));
    }

    // Enable the image file input only after the sub-image text inputs are created
    imageFileInput.disabled = false;
}

function handleImageChange(e) {
    const imageDataUrl = URL.createObjectURL(e.target.files[0]);

    image = new Image();
    image.src = imageDataUrl;

    image.addEventListener("load", () => {
        updateMemeCanvas(canvas, image, getTexts());
    }, { once: true });
}

function getTexts() {
    return Array.from(document.querySelectorAll(".textInput")).map(input => input.value);
}

function updateMemeCanvas(canvas, image, texts) {
    if (!image) return;

    const ctx = canvas.getContext("2d");
    const width = image.width;
    const height = image.height;
    canvas.width = width;
    canvas.height = height;

    // Determine grid dimensions based on subImageCount
    const subImageCount = texts.length;
    const isVertical = subImageCount <= 3;
    const rows = isVertical ? subImageCount : Math.ceil(Math.sqrt(subImageCount));
    const cols = isVertical ? 1 : Math.ceil(subImageCount / rows);
    const subImageWidth = width / cols;
    const subImageHeight = height / rows;

    // Adjust font size and offset
    const fontSize = isVertical ? Math.floor(subImageWidth / 15) : Math.floor(subImageWidth / 10); // Smaller font size for vertical layout
    const yOffset = subImageHeight / 20; // Smaller offset for vertical layout

    ctx.drawImage(image, 0, 0);

    ctx.strokeStyle = "black";
    ctx.lineWidth = Math.floor(fontSize / 4);
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.lineJoin = "round";
    ctx.font = `${fontSize}px sans-serif`;

    // Draw text for each sub-image
    texts.forEach((text, index) => {
        const row = Math.floor(index / cols);
        const col = index % cols;

        const x = col * subImageWidth + subImageWidth / 2;
        const y = (row + 1) * subImageHeight - yOffset;

        ctx.textBaseline = "bottom";
        ctx.strokeText(text, x, y);
        ctx.fillText(text, x, y);
    });
}

// Initialize default state
createTextInputs();
