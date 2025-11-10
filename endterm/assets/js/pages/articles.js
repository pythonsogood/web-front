function similarity(s1, s2) {
	return 1.0 - normalized_levenshtein(s1, s2);
}

function normalized_levenshtein(s1, s2) {
	const levenshtein = new Levenshtein(s1, s2);

	return levenshtein.distance / Math.max(s1.length, s2.length);
}

function partial_ratio_similarity(s1, s2) {
	/*
		Algorithm taken from https://github.com/rapidfuzz/RapidFuzz/blob/main/src/rapidfuzz/fuzz_py.py#L116-L179
	*/
	const len1 = s1.length;
	const len2 = s2.length;

	if (len1 > len2) {
		return partial_ratio_similarity(s2, s1);
	}

	let score = 0.0;

	const s1_char_set = new Set();

	for (const c of s1) {
		s1_char_set.add(c);
	}

	for (let i=1; i<len1; i++) {
		const substr_last = s2.charAt(i-1);
		if (!s1_char_set.has(substr_last)) {
			continue;
		}

		const ls_ratio = similarity(s1, s2.substring(0, i));

		if (ls_ratio > score) {
			score = ls_ratio;
			if (score >= 100.0) {
				return score;
			}
		}
	}

	for (let i=0; i<len2-len1; i++) {
		const substr_last = s2.charAt(i + len1 - 1);
		if (!s1_char_set.has(substr_last)) {
			continue;
		}

		const ls_ratio = similarity(s1, s2.substring(i, i + len1));

		if (ls_ratio > score) {
			score = ls_ratio;
			if (score >= 100.0) {
				return score;
			}
		}
	}

	for (let i=len2-len1; i<len2; i++) {
		const substr_first = s2.charAt(i);
		if (!s1_char_set.has(substr_first)) {
			continue;
		}

		const ls_ratio = similarity(s1, s2.substring(i));

		if (ls_ratio > score) {
			score = ls_ratio;
			if (score >= 100.0) {
				return score;
			}
		}
	}

	return score;
}

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