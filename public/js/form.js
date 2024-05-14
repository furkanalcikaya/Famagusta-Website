document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('messageForm');
    const alertBox = document.getElementById('alertBox');
  
    form.onsubmit = function (e) {
        e.preventDefault();
        const formData = new FormData(form);
        const object = {};
        formData.forEach((value, key) => { object[key] = value });
        const json = JSON.stringify(object);
  
        fetch('/send-message', {
            method: 'POST',
            body: json,
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json()) // Sunucudan JSON yanıtını dönüştür
        .then(data => {
            alertBox.textContent = data.message || 'Your message sent successfully!'; // İçeriği ayarla
            alertBox.style.display = 'block'; // Görünürlüğü ayarla
            setTimeout(function() {
            alertBox.style.display = 'none'; // Bir süre sonra gizle
            }, 4000); // 5 saniye sonra alertBox'ı gizle
            form.reset(); // Formu sıfırla
        })
        .catch(error => {
            alertBox.textContent = error.message; // Hata mesajı için içeriği ayarla
            alertBox.style.display = 'block'; // Görünürlüğü ayarla
            setTimeout(function() {
                alertBox.style.display = 'none'; // Bir süre sonra gizle
            }, 5000); // 5 saniye sonra alertBox'ı gizle
        });
        
    };
});
