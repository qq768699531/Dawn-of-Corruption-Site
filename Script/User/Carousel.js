
/* twine-user-script #24: "Carousel.js" */
setup.setCarousel = function () {
  // const carousel = document.querySelector('.ComboFightMovesContainer');
  // console.log(carousel);
  // const cards = Array.from(document.querySelectorAll('.ComboFightMovesContainer > *'));
  // setTimeout(() => {
  //     updateCardScales(carousel, cards);
  //   }, 100);
  // carousel.addEventListener('scroll', () => {
  //   updateCardScales(carousel, cards);
  // });
}

function updateCardScales(carousel, cards) {
  console.log('Updating Carousel');
  carousel.classList.add('carousel-active');
  const center = window.innerWidth / 2;
  cards.forEach(card => {
      const distance = Math.abs(center - card.getBoundingClientRect().left - card.offsetWidth / 2);
      const scale = 1 - Math.min(distance / center, 1) * 0.6;
      card.classList.toggle('centered', scale === 1);
      card.classList.toggle('scaled', scale < 1 && scale >= 0.6);
      card.classList.toggle('scaled-more', scale < 0.5);
      card.style.transform = `scale(${scale})`;
  });
}

setup.removeCarousel = function () {
  const carousel = document.querySelector('.ComboFightMovesContainer');
  carousel.removeEventListener('scroll', updateCardScales);
}