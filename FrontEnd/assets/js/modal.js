/********** variables partie "modal" **********/
const containerModal = document.querySelector(".modal__container");
const containerFile = document.querySelector(".modal__containerFile");
const inputFile = containerFile.querySelector("#file");

/********** ouverture et fermeture de la modal au click  **********/
function displayModal() {
  if (token) {
    const btnModal = document.querySelector(".btn__modifier");
    const xmark = document.querySelector(".modal__container .fa-xmark");
    btnModal.addEventListener("click", () => {
      containerModal.style.display = "flex";
    });
    xmark.addEventListener("click", () => {
      containerModal.style.display = "none";
    });
    containerModal.addEventListener("click", (e) => {
      if (e.target.className === "modal__container") {
        containerModal.style.display = "none";
      }
    });
  }
}

/********** création et ajout des projets dans la modal **********/
async function projectsModal() {
  const projetContainer = document.querySelector(".modal__content");
  projetContainer.innerHTML = "";
  const modalProjets = await getWorks();
  modalProjets.forEach((projet) => {
    const figure = document.createElement("figure");
    const imgModal = document.createElement("img");
    const span = document.createElement("span");
    const trash = document.createElement("i");
    trash.classList.add("fa-solid", "fa-trash-can");
    trash.id = projet.id;
    imgModal.src = projet.imageUrl;
    projetContainer.appendChild(figure);
    figure.appendChild(imgModal);
    figure.appendChild(span);
    span.appendChild(trash);
  });
  deleteProject(); /********** => => => ATTENTION !!! faire jouer la fonction deleteProjet
  une fois que la fonction projectModal ai fini d'être lu !!! ATTENTION **********/
}

/********** suppréssion au click d'une image dans la modal **********/
function deleteProject() {
  /********** variables de deleteProject() ***********/
  const trashIcons = document.querySelectorAll(".fa-trash-can");
  trashIcons.forEach((trash) => {
    trash.addEventListener("click", async (e) => {
      const id = trash.id;
      const response = await fetch("http://localhost:5678/api/works/" + id, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const formMessage = document.querySelector(".message");
        formMessage.textContent = "Votre projet été supprimé avec succès !";
        console.log("félicitations, la suppression a réussi !");
        projectsModal();
        displayWorks();
      } else {
        console.error("Erreur lors de la suppression:", response.statusText);
      }
    });
  });
}

/********** création et affichage de la deuxième modal **********/
function displaySecondModal() {
  /********** variables de la deuxième modal ***********/
  const btnDisplayModal = document.querySelector(".modal__projets button");
  const modalAddProjects = document.querySelector(".modal__addProjets");
  const modalProjets = document.querySelector(".modal__projets");
  const arrowLeft = document.querySelector(".modal__addProjets .fa-arrow-left");
  const modalXmark = document.querySelector(".modal__addProjets .fa-xmark");

  btnDisplayModal.addEventListener("click", () => {
    modalAddProjects.style.display = "flex";
    modalProjets.style.display = "none";
  });
  arrowLeft.addEventListener("click", () => {
    modalAddProjects.style.display = "none";
    modalProjets.style.display = "flex";
  });
  modalXmark.addEventListener("click", () => {
    containerModal.style.display = "none";
    window.location = "index.html";
  });
}

/********** prévisualisation de l'image du projet **********/
function imageCharged() {
  /********** variables de imageCharged() ***********/
  const previewImg = containerFile.querySelector("img");
  const labelFile = containerFile.querySelector("label");
  const iconFile = containerFile.querySelector(".fa-image");
  const pFile = containerFile.querySelector("p");

  inputFile.addEventListener("change", () => {
    console.log("Input file changed!");
    const file = inputFile.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        previewImg.src = e.target.result;
        containerFile.style.display = "flex";
        [labelFile, iconFile, pFile].forEach((element) => {
          element.style.display = "none";
        });
        /******* Affichage de l'image une fois chargée *******/
        previewImg.style.display = "block";
      };
      reader.readAsDataURL(file);
    }
  });
}

/********** Faire une requéte POST pour ajouter ajouter un projet **********/
function newProject() {
  /********** variables de newProject() ***********/
  const form = document.querySelector("form");
  const title = document.querySelector("#modal__title");
  const category = document.querySelector("#modal__category");
  const formError = document.querySelector(".error");
  const formMessageOk = document.querySelector(".message__ok");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    /* Vérifier si les champs titre et catégorie sont vides */
    if (!title.value.trim() || category.value === "") {
      console.log(category.value);
      formError.textContent =
        "Veuillez renseigner un titre et choisir une catégorie.";
      form.appendChild(formError);

      /* Afficher une erreur et empêcher l'envoi du formulaire */
      console.error("Veuillez remplir tous les champs du formulaire.");
    }
    const formData = new FormData();
    formData.append("image", inputFile.files[0]);
    formData.append("title", title.value);
    formData.append("category", category.value);

    const response = await fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (response.ok) {
      formError.style.display = "none";
      formMessageOk.textContent = "Votre projet a été ajouté avec succès !";
      console.log("Félicitations, nouveau projet créé avec succés !");
      projectsModal();
      displayWorks();
    } else {
      console.error("Erreur lors de l'envoi :", response.statusText);
    }
  });
}

/********** fonction principal mainModal**********/
function mainModal() {
  displayModal();
  projectsModal();
  displaySecondModal();
  imageCharged();
  newProject();
}
mainModal();
