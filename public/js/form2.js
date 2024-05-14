document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('messageForm');
    const alertBox = document.getElementById('alertBox');

    form.onsubmit = function (e) {
        e.preventDefault();
        const formData = new FormData(form);
        const object = {};
        formData.forEach((value, key) => { object[key] = value });
        const json = JSON.stringify(object);

        fetch('/add-bill', { // Form verilerini göndereceğiniz adres
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: json
        })
        .then(response => {
            if (!response.ok) {
                // Sunucu tarafında bir hata oluştuğunda burası çalışacak
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Başarılı işlem mesajı
            alertBox.textContent = 'Bill is added successfully!';
            alertBox.style.display = 'block'; // alertBox'ı göster
            setTimeout(function() {
                alertBox.style.display = 'none'; // Bir süre sonra gizle
            }, 4000);
            form.reset(); // Formu sıfırla
        })
        .catch(error => {
            // Hata mesajı
            alertBox.textContent = 'There was an error adding the bill: ' + error.message;
            alertBox.style.display = 'block'; // alertBox'ı göster
            setTimeout(function() {
                alertBox.style.display = 'none'; // Bir süre sonra gizle
            }, 5000);
        });
    };
});
