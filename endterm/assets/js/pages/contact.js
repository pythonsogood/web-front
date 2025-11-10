let FEEDBACK_TERMS_ACCEPTED = false;

function OnDOMContentLoaded() {
	const collapseElement = document.querySelector("#feedback");
	const collapse = new bootstrap.Collapse(collapseElement);

	if (collapse != null) {
		const button = document.querySelector("#share-toggle");

		if (button != null) {
			const modal = new bootstrap.Modal(document.querySelector("#share-terms-modal"), {});
			const modalAccept = document.querySelector("#share-terms-accept");

			button.addEventListener("click", () => {
				if (!FEEDBACK_TERMS_ACCEPTED) {
					if (modal == null || modalAccept == null) {
						FEEDBACK_TERMS_ACCEPTED = true;
						button.click();
						return;
					}

					modal.show();
				} else {
					collapse.toggle();
				}
			});

			modalAccept.addEventListener("click", () => {
				modal.hide();
				FEEDBACK_TERMS_ACCEPTED = true;
				button.click();
			})
		}
	}
}

document.addEventListener("DOMContentLoaded", OnDOMContentLoaded);