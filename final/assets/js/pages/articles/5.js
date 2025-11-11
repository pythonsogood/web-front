let gallery = [];

async function OnDOMContentLoaded() {
	const response = await fetch("/assets/json/gallery.json");
	gallery = await response.json();

	const galleryElement = document.querySelector("#gallery");

	if (galleryElement != null) {
		const main = document.querySelector("main");

		for (let i=0; i<gallery.length; i++) {
			const element = gallery[i];

			const col = document.createElement("div");
			col.classList.add("col");

			const card = document.createElement("div");
			card.classList.add("card");
			card.dataset.categories = element["categories"].join(",");
			card.dataset.bsToggle = "modal";
			card.dataset.bsTarget = `#modal-lightbox-${i}`;

			const img = document.createElement("img");
			img.classList.add("img-fluid", "rounded-3");
			img.src = element["image"];
			img.loading = "lazy";

			card.appendChild(img);
			col.appendChild(card);

			galleryElement.appendChild(col);

			const modalElement = document.createElement("div");
			modalElement.classList.add("modal", "fade");
			modalElement.id = `modal-lightbox-${i}`;
			modalElement.ariaHidden = "true";
			modalElement.tabIndex = "-1";

			const modalDialog = document.createElement("div");
			modalDialog.classList.add("modal-dialog", "modal-dialog-centered");

			const modalContent = document.createElement("div");
			modalContent.classList.add("modal-content");

			const modalHeader = document.createElement("div");
			modalHeader.classList.add("modal-header");

			const modalClose = document.createElement("button");
			modalClose.classList.add("btn-close");
			modalClose.dataset.bsDismiss = "modal";
			modalClose.ariaLabel = "Close";

			const modalBody = document.createElement("div");
			modalBody.classList.add("modal-body");

			const modalImage = document.createElement("img");
			modalImage.classList.add("img-fluid", "rounded-3");
			modalImage.src = element["image"];
			modalImage.loading = "lazy";

			const modalFooter = document.createElement("div");
			modalFooter.classList.add("modal-footer");

			if (i > 0) {
				const modalPrevButton = document.createElement("button");
				modalPrevButton.classList.add("btn", "btn-primary");
				modalPrevButton.dataset.bsTarget = `#modal-lightbox-${i-1}`;
				modalPrevButton.dataset.bsToggle = "modal";
				modalPrevButton.innerText = "<"

				modalFooter.classList.add("justify-content-between");
				modalFooter.appendChild(modalPrevButton);
			}

			if (i < gallery.length - 1) {
				const modalNextButton = document.createElement("button");
				modalNextButton.classList.add("btn", "btn-primary");
				modalNextButton.dataset.bsTarget = `#modal-lightbox-${i+1}`;
				modalNextButton.dataset.bsToggle = "modal";
				modalNextButton.innerText = ">";

				modalFooter.appendChild(modalNextButton);
			}

			modalBody.appendChild(modalImage);
			modalHeader.appendChild(modalClose);
			modalContent.appendChild(modalHeader);
			modalContent.appendChild(modalBody);
			modalContent.appendChild(modalFooter);
			modalDialog.appendChild(modalContent);
			modalElement.appendChild(modalDialog);
			main.appendChild(modalElement);
		}

		const filterElement = document.querySelector("#filter");

		if (filterElement != null) {
			for (const input of filterElement.querySelectorAll("input[name=\"gallery-filter\"]")) {
				input.addEventListener("change", () => {
					if (input.checked) {
						$("#gallery .card").each(function() {
							const card = $(this);
							if (input.id == "all" || card.get(0).dataset.categories.split(",").includes(input.id)) {
								card.parent().fadeIn(350);
							} else {
								card.parent().fadeOut(350);
							}
						});
					}
				});
			}
		}
	}
}

document.addEventListener("DOMContentLoaded", OnDOMContentLoaded);