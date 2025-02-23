import "./index.css";
import spotsSrc from "../images/logo.svg";
import avatarSrc from "../images/avatar.jpg";
import pencilSrc from "../images/pencil.svg";
import plusSrc from "../images/plus.svg";

import {
  enableValidation,
  settings,
  resetValidation,
} from "../scripts/validation.js";

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
    name: "Golden Gate Bridge",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/7-photo-by-griffin-wooldridge-from-pexels.jpg",
  },
];

const spotsImage = document.getElementById("spots-logo");
spotsImage.src = spotsSrc;

const avatarImage = document.getElementById("avatar-image");
avatarImage.src = avatarSrc;

const pencilImage = document.getElementById("pencil-icon");
pencilImage.src = pencilSrc;

const plusImage = document.getElementById("plus-sign");
plusImage.src = plusSrc;

//Profile Elements
const profileEditButton = document.querySelector(".profile__edit-button");
const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description");

//Card Elements
const cardTitle = document.querySelector(".card__title");
const cardImage = document.querySelector(".card__image");

//Form Profile Elements
const editModal = document.querySelector("#edit-modal");
const editFormElement = document.forms["edit-profile"];
//editModal.querySelector(".modal__form");
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
const postFormElement = document.forms["new-post"];
//newPostModal.querySelector(".modal__form");
const cardSubmitButton = newPostModal.querySelector(".modal__submit-button");

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
    imagePreview.alt = data.name;
  });

  return cardElement;
}

function openModal(modal) {
  modal.classList.add("modal_opened");
  document.addEventListener("keydown", closeModalEsc);
}

function closeModal(modal) {
  modal.classList.remove("modal_opened");
  document.removeEventListener("keydown", closeModalEsc);
}

profileEditButton.addEventListener("click", () => {
  editModalNameInput.value = profileName.textContent;
  editModalDescriptionInput.value = profileDescription.textContent;
  openModal(editModal);
  resetValidation(
    editFormElement,
    [editModalNameInput, editModalDescriptionInput],
    settings
  );
});

// editModalCloseButton.addEventListener("click", () => {
//   closeModal(editModal);
// });

const closeButtons = document.querySelectorAll(".modal__close-button");

closeButtons.forEach((button) => {
  const window = button.closest(".modal");
  button.addEventListener("click", () => closeModal(window));
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

// postCloseButton.addEventListener("click", () => {
//   closeModal(newPostModal);
// });

// imageViewCloseButton.addEventListener("click", () => {
//   closeModal(imageViewModal);
// });

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
  evt.target.reset();
  disableButton(cardSubmitButton, settings);
}

initialCards.forEach(function (i) {
  const cardElement = getCardElement(i);
  cardsList.append(cardElement);
});

const modal = document.querySelectorAll(".modal");

function closeModalClickOutside(evt) {
  if (evt.target.classList.contains("modal")) {
    closeModal(evt.target);
  }
}

function closeModalEsc(evt) {
  if (evt.key === "Escape") {
    const openedModal = document.querySelector(".modal_opened");
    closeModal(openedModal);
  }
}

modal.forEach((modal) => {
  modal.addEventListener("mousedown", closeModalClickOutside);
});

enableValidation(settings);
