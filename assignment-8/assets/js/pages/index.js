function OnDOMContentLoaded() {
	for (const container of document.querySelectorAll(".slogan-container")) {
		const words = container.querySelectorAll(".slogan-word");
		let index = -1;

		function showNextWord() {
			if (words[index] != undefined) {
				words[index].classList.remove("active");
			}

			index = (index + 1) % words.length;

			if (words[index] != undefined) {
				words[index].classList.add("active");
				container.style.width = `${words[index].offsetWidth + 1}px`;
			} else {
				container.style.width = "0px";
			}
		}

		showNextWord();
		setInterval(showNextWord, parseInt(container.dataset.interval));
	}
}

document.addEventListener("DOMContentLoaded", OnDOMContentLoaded);