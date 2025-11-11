const table = [
	{
		id: 1,
		first_name: "Mark",
		last_name: "Zukerberg",
	},
	{
		id: 2,
		first_name: "John",
		last_name: "Doe",
	},
];

let IDs = table.length;
let CURRENT_ID = null;

function sanitize(str) {
	return str.toString().replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

function renderTable(newCount) {
	newCount = newCount ?? 0;

	const tableElement = $("#table");
	if (tableElement == null) {
		return;
	}

	const tableBody = tableElement.find("tbody");
	tableBody.empty();

	for (const entry of table) {
		const row = $(`
			<tr id="entry-${sanitize(entry.id)}" class="entry">
				<th id="id" scope="row">${sanitize(entry.id)}</th>
				<td id="first_name">${sanitize(entry.first_name)}</td>
				<td id="last_name">${sanitize(entry.last_name)}</td>
				<td class="align-bottom">
					<button type="button" class="btn btn-primary px-1 py-0" data-bs-toggle="modal" data-bs-target="#editModal">
						Edit
					</button>
					<button type="button" class="btn btn-danger px-1 py-0" data-bs-toggle="modal" data-bs-target="#deleteModal">
						Delete
					</button>
				</td>
			</tr>
		`);

		if (IDs - newCount < entry.id) {
			row.hide().fadeIn();
		}

		row.find(".btn-primary").on("click", () => {
			const editForm = document.querySelector("#editEntryForm");
			const first_name = editForm.querySelector("#first_name");
			const last_name = editForm.querySelector("#last_name");

			first_name.value = entry.first_name;
			last_name.value = entry.last_name;

			CURRENT_ID = entry.id;
		});

		row.find(".btn-danger").on("click", () => {
			CURRENT_ID = entry.id;
		});

		tableBody.append(row);
	}

	const addNewRow = $(`
		<tr id="add">
			<th scope="row">
				<button type="button" class="btn btn-success px-1 py-0" data-bs-toggle="modal" data-bs-target="#addNewModal">
					Add new
				</button>
			</th>
			<td></td>
			<td></td>
			<td></td>
		</tr>
	`);

	tableBody.append(addNewRow);
}

function OnDOMContentLoaded() {
	const addNewForm = document.querySelector("#addEntryForm");

	if (addNewForm != null) {
		const modal = new bootstrap.Modal(document.querySelector("#addNewModal"), {});
		const first_name = addNewForm.querySelector("#first_name");
		const last_name = addNewForm.querySelector("#last_name");

		addNewForm.addEventListener("submit", (event) => {
			addNewForm.classList.add("was-validated");

			if (!addNewForm.checkValidity()) {
				event.preventDefault();
				event.stopPropagation();
				return;
			}

			const sortby = document.querySelector("#sort-by");

			if (sortby != null) {
				sortby.value = "id";
			}

			table.push({
				id: ++IDs,
				first_name: sanitize(first_name.value),
				last_name: sanitize(last_name.value),
			});

			modal.hide();

			renderTable(1);

			addNewForm.reset();
			addNewForm.classList.remove("was-validated");

			event.preventDefault();
			event.stopPropagation();
		});
	}

	const editForm = document.querySelector("#editEntryForm");

	if (editForm != null) {
		const modal = new bootstrap.Modal(document.querySelector("#editModal"), {});
		const first_name = editForm.querySelector("#first_name");
		const last_name = editForm.querySelector("#last_name");

		editForm.addEventListener("submit", (event) => {
			if (CURRENT_ID == null) {
				event.preventDefault();
				event.stopPropagation();
				return;
			}

			editForm.classList.add("was-validated");

			if (!editForm.checkValidity()) {
				event.preventDefault();
				event.stopPropagation();
				return;
			}

			for (const entry of table) {
				if (entry.id == CURRENT_ID) {
					entry.first_name = sanitize(first_name.value);
					entry.last_name = sanitize(last_name.value);
					break;
				}
			}

			modal.hide();

			renderTable();

			CURRENT_ID = null;

			editForm.reset();
			editForm.classList.remove("was-validated");

			event.preventDefault();
			event.stopPropagation();
		});
	}

	const deleteModal = document.querySelector("#deleteModal");

	if (deleteModal != null) {
		const modal = new bootstrap.Modal(deleteModal, {});

		deleteModal.addEventListener("click", () => {
			if (CURRENT_ID == null) {
				return;
			}

			const index = table.indexOf(table.find(entry => entry.id == CURRENT_ID));

			if (index === -1) {
				return;
			}

			table.splice(index, 1);

			modal.hide();

			const entry = $(`#table tbody #entry-${sanitize(CURRENT_ID)}`);

			CURRENT_ID = null;

			if (entry != null) {
				entry.fadeOut("fast", renderTable);
			}
		});
	}

	const searchbar = document.querySelector("#search-bar");

	if (searchbar != null) {
		const tableBody = document.querySelector("#table tbody");

		searchbar.addEventListener("input", () => {
			if (searchbar.value.length <= 0) {
				if (tableBody.classList.contains("searching")) {
					tableBody.classList.remove("searching");
				}

				for (const row of tableBody.querySelectorAll(".entry")) {
					if (row.classList.contains("search-match")) {
						row.classList.remove("search-match");
					}

					if (row.classList.contains("search-match-best")) {
						row.classList.remove("search-match-best");
					}
				}
			} else {
				const searchText = searchbar.value.toLowerCase();

				if (!tableBody.classList.contains("searching")) {
					tableBody.classList.add("searching");
				}

				for (const row of tableBody.querySelectorAll(".entry")) {
					const rowId = row.querySelector("#id");
					const rowFirstName = row.querySelector("#first_name");
					const rowLastName = row.querySelector("#last_name");
					const sameRowId = rowId != null ? rowId.textContent == searchText : false;
					const firstNameSimilarity = rowFirstName != null ? partial_ratio_similarity(searchText, rowFirstName.textContent.toLowerCase()) : 0;
					const lastNameSimilarity = rowLastName != null ? partial_ratio_similarity(searchText, rowLastName.textContent.toLowerCase()) : 0;

					const matching = sameRowId || firstNameSimilarity > 0.5 || lastNameSimilarity > 0.5;
					const bestMatching = matching && (sameRowId || firstNameSimilarity >= 0.8 || lastNameSimilarity >= 0.8);

					if (matching) {
						if (!row.classList.contains("search-match")) {
							row.classList.add("search-match");
						}

						if (bestMatching) {
							if (!row.classList.contains("search-match-best")) {
								row.classList.add("search-match-best");
							}
						} else if (row.classList.contains("search-match-best")) {
							row.classList.remove("search-match-best");
						}
					} else {
						if (row.classList.contains("search-match")) {
							row.classList.remove("search-match");
						}

						if (row.classList.contains("search-match-best")) {
							row.classList.remove("search-match-best");
						}
					}
				}
			}
		});
	}

	const sortby = document.querySelector("#sort-by");

	if (sortby != null) {
		sortby.addEventListener("change", () => {
			const key = sortby.value;

			table.sort((a, b) => {
				if (typeof a[key] == "string" || typeof b[key] == "string") {
					return a[key].localeCompare(b[key]);
				}

				return a[key] - b[key];
			});

			renderTable();
		});

		const key = sortby.value;

		table.sort((a, b) => {
			if (typeof a[key] == "string" || typeof b[key] == "string") {
				return a[key].localeCompare(b[key]);
			}

			return a[key] - b[key];
		});
	}

	renderTable();
}

document.addEventListener("DOMContentLoaded", OnDOMContentLoaded);