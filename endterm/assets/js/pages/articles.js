function OnDOMContentLoaded() {
	const searchbar = document.querySelector("#articles-search-bar");

	if (searchbar != null) {
		const articles = document.querySelector("#articles");

		if (articles != null) {
			searchbar.addEventListener("input", () => {
				if (searchbar.value.length < 3) {
					if (articles.classList.contains("searching")) {
						articles.classList.remove("searching");
					}

					for (const card of articles.querySelectorAll(".card")) {
						if (card.classList.contains("search-match")) {
							card.classList.remove("search-match");
						}

						if (card.classList.contains("search-match-best")) {
							card.classList.remove("search-match-best");
						}
					}
				} else {
					const searchText = searchbar.value.toLowerCase();

					if (!articles.classList.contains("searching")) {
						articles.classList.add("searching");
					}

					for (const card of articles.querySelectorAll(".card")) {
						const cardTitle = card.querySelector(".card-title");
						const cardBody = card.querySelector(".card-text");
						const titleSimilarity = cardTitle != null ? partial_ratio_similarity(searchText, cardTitle.textContent.toLowerCase()) : 0;
						const bodySimilarity = cardBody != null ? partial_ratio_similarity(searchText, cardBody.textContent.toLowerCase()) : 0;

						const matching = titleSimilarity > 0.5 || bodySimilarity > 0.5;
						const bestMatching = matching && (titleSimilarity >= 0.8 || bodySimilarity >= 0.8);

						if (matching) {
							if (!card.classList.contains("search-match")) {
								card.classList.add("search-match");
							}

							if (bestMatching) {
								if (!card.classList.contains("search-match-best")) {
									card.classList.add("search-match-best");
								}
							} else if (card.classList.contains("search-match-best")) {
								card.classList.remove("search-match-best");
							}
						} else {
							if (card.classList.contains("search-match")) {
								card.classList.remove("search-match");
							}

							if (card.classList.contains("search-match-best")) {
								card.classList.remove("search-match-best");
							}
						}
					}
				}
			});
		}
	}
}

document.addEventListener("DOMContentLoaded", OnDOMContentLoaded);