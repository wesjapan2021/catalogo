// Ensure you include the html2canvas library in your HTML file
// <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/0.4.1/html2canvas.min.js"></script>

// Function to capture and download card as PNG
function captureCard() {
    var card = document.getElementById('card-id'); // Change 'card-id' to the actual id of the card element

    html2canvas(card).then(function(canvas) {
        // Create a link to download the image
        var link = document.createElement('a');
        link.href = canvas.toDataURL();
        link.download = 'card.png';
        link.click();
    });
}