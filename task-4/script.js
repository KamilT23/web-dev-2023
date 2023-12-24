const default_image = 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Keen_Bild_Taxon.svg/1200px-Keen_Bild_Taxon.svg.png'

function saveToLocalStorage(dataKey, dataArray) {
  try {
    let data = JSON.parse(localStorage.getItem(dataKey)) || [];
    data = data.concat(dataArray);
    localStorage.setItem(dataKey, JSON.stringify(data));
    console.log('Data saved to localStorage successfully.');
  } catch (error) {
    console.error('Error saving data to localStorage:', error);
  }
}

const startCards = [
{
  name: "Хризантема",
  description: "Хорошенькая, добренькая хризантема",
  image: "https://www.remontbp.com/wp-content/uploads/2015/09/1911.jpg",
  code: 548,
  supplier: "ООО ЦветСтрой"
},
{
  name: "Роза",
  description: "Интересный букет из роз",
  image:"https://t3.gstatic.com/licensed-image?q=tbn:ANd9GcRGT3pSqLzQtZLsnxqK7-FoVOgz_6EMbrCvZ8mXS5NDxu9CBylElWcmtbd5irSAVJq4",
  code: 287,
  supplier: "ЗАО ЦветНеСтрой"
},
{
  name: "Лилия обыкновенная",
  description:"Ничего примечательного",
  code: 666,
  supplier: "ЗЗО ЛоганоКомУд"
}
]

if (!localStorage.getItem('products')) {
  saveToLocalStorage('products', startCards);
}

document.addEventListener('DOMContentLoaded', () => {
  displayCards();
});

function saveProduct() {
  const form = document.getElementById('productForm');

  if (!form.name.value || !form.code.value || !form.supplier.value) {
    alert('Заполните обязательные поля: Название, Код товара, Поставщик');
    return; // Прекращаем выполнение функции, если не все обязательные поля заполнены
  }

  if (form.code.value < 0){
    alert('Код не может быть отрицательным числом')
    return;
  }

  const product = {
      name: form.name.value,
      description: form.description.value,
      image: form.image.value,
      code: form.code.value,
      supplier: form.supplier.value,
  };

  let products = JSON.parse(localStorage.getItem('products')) || [];
  products.push(product);
  localStorage.setItem('products', JSON.stringify(products));

  displayCards();
  form.reset();
}

function displayCards() {
  const cardsContainer = document.getElementById('cardsContainer');
  cardsContainer.innerHTML = '';

  const products = JSON.parse(localStorage.getItem('products')) || [];
  products.forEach((product, index) => {
      const card = document.createElement('div');
      card.classList.add('card');

      card.innerHTML = `
          <figure class="img__poster">
            <img class="img-poster__image" src="${product.image ? product.image : default_image}" alt="${product.name}">
          </figure>
            <div class="card__databox">
              <div class="card-databox__heading">
                <h3>${product.name}</h3>
              </div>
              <div class="card-databox__description">
                <p>${product.description}</p>
                <p><strong>Код товара:</strong> ${product.code}</p>
                <p><strong>Поставщик:</strong> ${product.supplier}</p>
              </div>
            
            <button class="card__button" onclick="editProduct(${index})">Редактировать</button>
            <button class="card__button" onclick="deleteProduct(${index})">Удалить</button>
            </div>
      `;

      cardsContainer.appendChild(card);
  });
}

function editProduct(index) {
  const products = JSON.parse(localStorage.getItem('products')) || [];
  const product = products[index];

  const form = document.getElementById('productForm');
  form.name.value = product.name;
  form.description.value = product.description;
  form.image.value = product.image;
  form.code.value = product.code;
  form.supplier.value = product.supplier;

  products.splice(index, 1);
  localStorage.setItem('products', JSON.stringify(products));

  displayCards();
}

function deleteProduct(index) {
  const products = JSON.parse(localStorage.getItem('products')) || [];
  products.splice(index, 1);
  localStorage.setItem('products', JSON.stringify(products));

  displayCards();
}

function resetPage() {
  localStorage.removeItem('products');
  if (!localStorage.getItem('products')) {
    saveToLocalStorage('products', startCards);
  }
  displayCards();
}