async function loadViews() {
	for (const element of document.querySelectorAll("[data-import]")) {
		const url = `/views/${element.dataset.import}.html`;

		const response = await fetch(url);
		const view = await response.text();

		element.innerHTML = view;

		for (const script of element.querySelectorAll("script")) {
			const newscript = document.createElement("script");

			for (const attribute of script.attributes) {
				newscript.setAttribute(attribute.name, attribute.value);
			}

			newscript.appendChild(document.createTextNode(script.innerHTML));

			script.parentNode.replaceChild(newscript, script);
		}
	}
}

function loadBootstrapForms() {
	for (const form of document.querySelectorAll("form.needs-validation")) {
		form.addEventListener("submit", event => {
			if (!form.checkValidity()) {
				event.preventDefault();
				event.stopPropagation();
			}

			form.classList.add("was-validated");
		}, false);
	}
}

async function OnDOMLoaded() {
	await loadViews();
	loadBootstrapForms();
}

document.addEventListener("DOMContentLoaded", OnDOMLoaded);