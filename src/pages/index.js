import "../pages/index.css";

import spotsSrc from "../images/logo.svg";
// import avatarSrc from "../images/avatar.jpg";
import pencilSrc from "../images/pencil.svg";
import plusSrc from "../images/plus.svg";
import avatarPencilSrc from "../images/avatar-pencil.svg";

import {
  enableValidation,
  settings,
  resetValidation,
  disableButton,
} from "../scripts/validation.js";

import Api from "../utils/Api.js";
import { data } from "autoprefixer";
import { setButtonText } from "../utils/helpers.js";

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "8067d86e-9bc6-45c7-96ec-e7f90045dfb1",
    "Content-Type": "application/json",
  },
});

api
  .getAppInfo()
  .then(([userInfo, cards]) => {
    cards.forEach((i) => {
      const cardElement = getCardElement(i);
      cardsList.append(cardElement);
    });
    profileName.textContent = userInfo.name;
    profileDescription.textContent = userInfo.about;
    avatarImage.src = userInfo.avatar;
  })
  .catch((err) => {
    console.error(err);
  });

const spotsImage = document.getElementById("spots-logo");
spotsImage.src = spotsSrc;

const avatarImage = document.getElementById("avatar-image");

const pencilImage = document.getElementById("pencil-icon");
pencilImage.src = pencilSrc;

const avatarPencilImage = document.getElementById("avatar-pencil");
avatarPencilImage.src = avatarPencilSrc;

const plusImage = document.getElementById("plus-sign");
plusImage.src = plusSrc;

//Profile Elements
const profileEditButton = document.querySelector(".profile__edit-button");
const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description");
const editAvatarButton = document.querySelector(".profile__avatar-button");

//Card Elements
const cardTitle = document.querySelector(".card__title");
const cardImage = document.querySelector(".card__image");

//Form Profile Elements
const editModal = document.querySelector("#edit-modal");
const editFormElement = document.forms["edit-profile"];
const editModalCloseButton = editModal.querySelector(".modal__close-button");
const editModalNameInput = editModal.querySelector("#profile-name-input");
const editModalDescriptionInput = editModal.querySelector(
  "#profile-description-input"
);

//Edit Avatar Form Elements
const editAvatarModal = document.querySelector("#edit-avatar-modal");
const editAvatarForm = document.forms["edit-avatar-form"];
const editAvatarCloseButton = editAvatarModal.querySelector(".modal__close");
const editAvatarInput = editAvatarModal.querySelector("#profile-avatar-input");
const editAvatarSubmitButton = editAvatarModal.querySelector(
  ".modal__submit-button"
);

//Delete Card Form Elements
const deleteCardModal = document.querySelector("#delete-card-modal");
const deleteCardForm = document.forms["delete-card-form"];
const deleteCardDeleteButton = deleteCardModal.querySelector(
  ".modal__submit-button_type-delete"
);
const deleteCardCancelButton = deleteCardModal.querySelector(
  ".modal__submit-button_type_cancel"
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

let selectedCard, selectedCardId;

//Functions and Calls
function getCardElement(data) {
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);

  const cardNameElement = cardElement.querySelector(".card__title");
  const cardImageElement = cardElement.querySelector(".card__image");
  const cardLikeButton = cardElement.querySelector(".card__like-button");
  const cardDeleteButton = cardElement.querySelector(".card__delete-button");

  if (data.isLiked) {
    cardLikeButton.classList.add("card__like-button_liked");
  }

  cardNameElement.textContent = data.name;
  cardImageElement.alt = data.name;
  cardImageElement.src = data.link;

  cardLikeButton.addEventListener("click", (evt) => handleLike(evt, data._id));

  cardDeleteButton.addEventListener("click", (evt) =>
    handleCardDelete(cardElement, data._id)
  );

  cardImageElement.addEventListener("click", () => handleImageClick(data));

  return cardElement;
}

function openModal(modal) {
  modal.classList.add("modal__opened");
  document.addEventListener("keydown", closeModalEsc);
}

function closeModal(modal) {
  modal.classList.remove("modal__opened");
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

editAvatarButton.addEventListener("click", () => {
  openModal(editAvatarModal);
});

const closeButtons = document.querySelectorAll(".modal__close-button");

closeButtons.forEach((button) => {
  const window = button.closest(".modal");
  button.addEventListener("click", () => closeModal(window));
});

function handleImageClick(data) {
  imagePreview.src = data.link;
  imagePreviewCaption.textContent = data.name;
  imagePreview.alt = data.name;
  openModal(imageViewModal);
}

function handleLike(evt, id) {
  const isLiked = evt.target.classList.contains("card__like-button_liked");
  api
    .handleLikeStatus(id, isLiked)
    .then(() => {
      evt.target.classList.toggle("card__like-button_liked");
    })
    .catch(console.error);
}

function handleEditFormSubmit(evt) {
  evt.preventDefault();

  const submitButton = evt.submitter;
  setButtonText(submitButton, true);

  api
    .editUserInfo({
      name: editModalNameInput.value,
      about: editModalDescriptionInput.value,
    })
    .then((data) => {
      profileName.textContent = data.name;
      profileDescription.textContent = data.about;
      closeModal(editModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitButton, false);
    });
}

editFormElement.addEventListener("submit", handleEditFormSubmit);

editAvatarForm.addEventListener("submit", handleAvatarSubmit);

newPostButton.addEventListener("click", () => {
  openModal(newPostModal);
});

postFormElement.addEventListener("submit", handleAddCard);

deleteCardForm.addEventListener("submit", handleDeleteSubmit);

function handleAvatarSubmit(evt) {
  evt.preventDefault();

  const submitButton = evt.submitter;
  setButtonText(submitButton, true);

  api
    .editAvatarInfo({ avatar: editAvatarInput.value })
    .then((data) => {
      avatarImage.src = data.avatar;
      closeModal(editAvatarModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitButton, false);
    });
}

function handleAddCard(evt) {
  evt.preventDefault();

  const submitButton = evt.submitter;
  setButtonText(submitButton, true);

  api
    .addCard({ name: postCaptionInput.value, link: postLinkInput.value })
    .then((cardData) => {
      const cardElement = getCardElement(cardData);
      cardsList.prepend(cardElement);
      closeModal(newPostModal);
      postFormElement.reset();
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitButton, false);
    });
}

function handleDeleteSubmit(evt) {
  evt.preventDefault();

  const loadingText = "Deleting...";
  const defaultText = "Delete";
  const submitButton = evt.submitter;
  setButtonText(submitButton, true, loadingText, defaultText);

  api
    .deleteCard(selectedCardId)
    .then(() => {
      selectedCard.remove();
      closeModal(deleteCardModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitButton, false, loadingText, defaultText);
    });
}

function handleCardDelete(cardElement, cardId) {
  selectedCard = cardElement;
  selectedCardId = cardId;
  openModal(deleteCardModal);
}

const modal = document.querySelectorAll(".modal");

function closeModalClickOutside(evt) {
  if (evt.target.classList.contains("modal")) {
    closeModal(evt.target);
  }
}

function closeModalEsc(evt) {
  if (evt.key === "Escape") {
    const openedModal = document.querySelector(".modal__opened");
    closeModal(openedModal);
  }
}

modal.forEach((modal) => {
  modal.addEventListener("mousedown", closeModalClickOutside);
});

enableValidation(settings);
