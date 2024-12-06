const initialCards = [
  {
    name: "Val Thorens",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
  },
  {
    name: "Restaurant terrace",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
  },
  {
    name: "An outdoor cafe",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
  },
  {
    name: "A very long bridge, over the forest and through the trees",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
  },
  {
    name: "Tunnel with morning light",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
  },
  {
    name: "Mountain house",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
  },
  {
    name: "Landscape Image",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/7-photo-by-griffin-wooldridge-from-pexels.jpg",
  },
];
//Profile Elements
const profileEditButton = document.querySelector(".profile__edit-button");
const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description");

//Card Elements
const cardTitle = document.querySelector(".card__title");
const cardImage = document.querySelector(".card__image");

//Form Profile Elements
const editModal = document.querySelector("#edit-modal");
const editFormElement = editModal.querySelector(".modal__form");
const editModalCloseButton = editModal.querySelector(".modal__close-button");
const editModalNameInput = editModal.querySelector("#profile-name-input");
const editModalDescriptionInput = editModal.querySelector(
  "#profile-description-input"
);

//Form Post Elements
const newPostModal = document.querySelector("#new-post-modal");
const newPostButton = document.querySelector(".profile__add-button");
const postCloseButton = newPostModal.querySelector(".modal__close-button");
const postLinkInput = newPostModal.querySelector("#image-link-input");
const postCaptionInput = newPostModal.querySelector("#image-caption-input");
const postFormElement = newPostModal.querySelector(".modal__form");

// Image Preview Elements
const imageViewModal = document.querySelector("#image-view-modal");
const imageViewCloseButton = imageViewModal.querySelector(
  ".modal__close-button"
);
const imagePreview = imageViewModal.querySelector(".modal__image");
const imagePreviewCaption = imageViewModal.querySelector(".modal__caption");

const cardTemplate = document.querySelector("#card-template");
const cardsList = document.querySelector(".cards__list");

function getCardElement(data) {
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);

  const cardNameElement = cardElement.querySelector(".card__title");
  const cardImageElement = cardElement.querySelector(".card__image");
  const cardLikeButton = cardElement.querySelector(".card__like-button");
  const cardDeleteButton = cardElement.querySelector(".card__delete-button");

  cardNameElement.textContent = data.name;
  cardImageElement.alt = data.name;
  cardImageElement.src = data.link;

  cardLikeButton.addEventListener("click", () => {
    cardLikeButton.classList.toggle("card__like-button_liked");
  });

  cardDeleteButton.addEventListener("click", () => {
    cardElement.remove();
  });

  cardImageElement.addEventListener("click", () => {
    openModal(imageViewModal);

    imagePreview.src = data.link;
    imagePreviewCaption.textContent = data.name;
  });

  return cardElement;
}

function openModal(modal) {
  modal.classList.add("modal_opened");
}

function closeModal(modal) {
  modal.classList.remove("modal_opened");
}

profileEditButton.addEventListener("click", () => {
  editModalNameInput.value = profileName.textContent;
  editModalDescriptionInput.value = profileDescription.textContent;
  openModal(editModal);
});

editModalCloseButton.addEventListener("click", () => {
  closeModal(editModal);
});

function handleEditFormSubmit(evt) {
  evt.preventDefault();
  profileName.textContent = editModalNameInput.value;
  profileDescription.textContent = editModalDescriptionInput.value;

  closeModal(editModal);
}

editFormElement.addEventListener("submit", handleEditFormSubmit);

newPostButton.addEventListener("click", () => {
  openModal(newPostModal);
});

postCloseButton.addEventListener("click", () => {
  closeModal(newPostModal);
});

imageViewCloseButton.addEventListener("click", () => {
  closeModal(imageViewModal);
});

postFormElement.addEventListener("submit", handleNewPostSubmit);

function handleNewPostSubmit(evt) {
  evt.preventDefault();
  console.log(postLinkInput.value);
  console.log(postCaptionInput.value);
  const inputVariables = {
    link: postLinkInput.value,
    name: postCaptionInput.value,
  };

  const cardElement = getCardElement(inputVariables);
  cardsList.prepend(cardElement);
  closeModal(newPostModal);
}

// for (let i = 0; i < initialCards.length; i++) {
//   const cardElement = getCardElement(initialCards[i]);
//   cardsList.prepend(cardElement);
// }

initialCards.forEach(function (i) {
  const cardElement = getCardElement(i);
  cardsList.append(cardElement);
});
