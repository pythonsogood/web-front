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
		form.addEventListener("submit", (event) => {
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