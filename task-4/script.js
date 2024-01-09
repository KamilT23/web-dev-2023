const default_image = 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Keen_Bild_Taxon.svg/1200px-Keen_Bild_Taxon.svg.png'
const apiUrl = 'http://localhost:3300/items'

// Генерация уникального идентификатора
function generateUniqueId() {
  return Date.now() + Math.random();
}

const startCards = [
{
  id: generateUniqueId(),
  name: "Хризантема",
  description: "Хорошенькая, добренькая хризантема",
  image: "https://www.remontbp.com/wp-content/uploads/2015/09/1911.jpg",
  code: 548,
  supplier: "ООО ЦветСтрой"
},
{
  id: generateUniqueId(),
  name: "Роза",
  description: "Интересный букет из роз",
  image:"https://t3.gstatic.com/licensed-image?q=tbn:ANd9GcRGT3pSqLzQtZLsnxqK7-FoVOgz_6EMbrCvZ8mXS5NDxu9CBylElWcmtbd5irSAVJq4",
  code: 287,
  supplier: "ЗАО ЦветНеСтрой"
}
]

async function fetchApi(url, options) {
  return await fetch(url, options)
      .then(response => {
          if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
      })
      .catch(error => {
          console.error('Error:', error);
      });
}

async function saveProduct() {
  const form = document.getElementById('productForm');

  if (!form.name.value || !form.code.value || !form.supplier.value) {
    alert('Заполните обязательные поля: Название, Код товара, Поставщик');
    return;
  }

  if (form.code.value < 0) {
    alert('Код не может быть отрицательным числом');
    return;
  }

  // Создание объекта product с уникальным id
  const product = {
    id: generateUniqueId(),
    name: form.name.value,
    description: form.description.value,
    image: form.image.value,
    code: form.code.value,
    supplier: form.supplier.value,
  };

  const loader = document.getElementById('loader');
  loader.style.display = 'block';

  await fetchApi(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(product),
  }).then(() => {
    loader.style.display = 'none';
    displayCards();
  });

  form.reset();
}

function displayCards() {
  const cardsContainer = document.getElementById('cardsContainer');
  cardsContainer.innerHTML = '';

  fetchApi(apiUrl, { method: 'GET' })
      .then(products => {
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
                      <button class="card__button" onclick="editProduct(${product.id})">Редактировать</button>
                      <button class="card__button" onclick="deleteProduct(${product.id})">Удалить</button>
                  </div>
              `;

              cardsContainer.appendChild(card);
          });
      });
}

async function editProduct(id) {
  try {
    // Получаем данные о продукте по id
    const product = await fetchApi(apiUrl + `/${id}`, { method: 'GET' });

    // Заполняем форму данными о продукте
    const form = document.getElementById('productForm');
    form.name.value = product.name;
    form.description.value = product.description;
    form.image.value = product.image;
    form.code.value = product.code;
    form.supplier.value = product.supplier;

    // Обработчик события для кнопки "Сохранить"
    const saveButton = document.createElement('button');
    saveButton.innerText = 'Принять изменения';
    saveButton.addEventListener('click', async () => {
      // Обновляем данные продукта
      const updatedProduct = {
        id: product.id,
        name: form.name.value,
        description: form.description.value,
        image: form.image.value,
        code: form.code.value,
        supplier: form.supplier.value,
      };

      // Отправляем обновленные данные на сервер
      await fetchApi(apiUrl + `/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProduct),
      });

      // Обновляем отображение карточек
      displayCards();
    });

    // Спрятать существующую кнопку "Сохранить"
    const existingSaveButton = form.querySelector('#saveBut');
    if (existingSaveButton) {
      existingSaveButton.style.display = 'none';
    }

    // Вставляем кнопку "Сохранить" перед существующей кнопкой
    form.appendChild(saveButton);
  } catch (error) {
    console.error('Error editing product:', error);
  }
}

async function deleteProduct(id) {
  await fetchApi(apiUrl + `/${id}`, { method: 'DELETE' })
      .then(() => displayCards());
}

async function clearDatabase() {
  try {
    const loader = document.getElementById('loader');
    loader.style.display = 'block';

    // Получаем текущие данные из базы данных
    const products = await fetchApi(apiUrl, { method: 'GET' });

    // Удаляем каждый элемент поочередно
    for (const product of products) {
      deleteProduct(product.id);
    }

    // Отображение пустой страницы
    displayCards();
  } catch (error) {
    console.error('Error clearing database:', error);
  } finally {
    loader.style.display = 'none';
  }
}


async function resetPage() {
  try {
    const loader = document.getElementById('loader');
    loader.style.display = 'block';

    // Удаляем все записи из базы данных
    clearDatabase()

    // Записываем данные из startCards
    for (const card of startCards) {
      await fetchApi(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(card),
      });
    }

    // Загружаем и отображаем карточки
    displayCards();
  } catch (error) {
    console.error('Error resetting page:', error);
  } finally {
    loader.style.display = 'none';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  displayCards();
  displayCreatorInfo();
});

function displayCreatorInfo() {
  const creatorInfoContainer = document.getElementById('creatorInfo');

  fetchApi('http://localhost:3300/creatorInfo', { method: 'GET' })
    .then(creatorInfo => {
      // Очищаем содержимое контейнера перед добавлением новых данных
      creatorInfoContainer.innerHTML = '';

      // Создаем элементы для отображения информации о создателе
      const creatorName = document.createElement('p');
      creatorName.textContent = `Мировой Создатель: ${creatorInfo.name}`;

      const creatorGroup = document.createElement('p');
      creatorGroup.textContent = `Группа: ${creatorInfo.group}`;

      // Добавляем созданные элементы в контейнер
      creatorInfoContainer.appendChild(creatorName);
      creatorInfoContainer.appendChild(creatorGroup);
    })
    .catch(error => {
      console.error('Error fetching creator information:', error);
    });
}