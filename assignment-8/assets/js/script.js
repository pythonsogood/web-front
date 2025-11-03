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

async function OnDOMLoaded() {
	await loadViews();
}

document.addEventListener("DOMContentLoaded", OnDOMLoaded);