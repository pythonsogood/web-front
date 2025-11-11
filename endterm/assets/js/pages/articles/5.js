let gallery = [];

async function OnDOMContentLoaded() {
	const response = await fetch("/assets/json/gallery.json");
	gallery = await response.json();

	const galleryElement = document.querySelector("#gallery");

	if (galleryElement != null) {
		for (const element of gallery) {
			const col = document.createElement("div");
			col.classList.add("col");

			const card = document.createElement("div");
			card.classList.add("card");

			const img = document.createElement("img");
			img.classList.add("img-fluid", "rounded-3");
			img.src = element["image"];
			img.loading = "lazy";

			card.appendChild(img);
			col.appendChild(card);

			galleryElement.appendChild(col);
		}

		const filterElement = document.querySelector("#filter");

		if (filterElement != null) {
			for (const input of filterElement.querySelectorAll("input[name=\"gallery-filter\"]")) {
				input.addEventListener("change", () => {
					console.log(input.checked);
				});
			}
		}
	}
}

document.addEventListener("DOMContentLoaded", OnDOMContentLoaded);