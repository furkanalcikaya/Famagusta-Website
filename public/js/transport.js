//transport page bus schedule animated style js codes

let currentPhotoIndex = 0; 

function changePhoto(direction) {
  const photos = document.querySelectorAll('.photo-container .photo');
  photos[currentPhotoIndex].classList.remove('active'); 

  currentPhotoIndex += direction; 


  if (currentPhotoIndex >= photos.length) {
    currentPhotoIndex = 0;
  } else if (currentPhotoIndex < 0) {
    currentPhotoIndex = photos.length - 1;
  }

  photos[currentPhotoIndex].classList.add('active'); 
}

document.addEventListener('DOMContentLoaded', () => changePhoto(0));
