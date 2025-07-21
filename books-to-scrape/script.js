// === Theme: Restore preference on load ===
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
}

// === Theme: Toggle dark mode ===
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("darkModeToggle");
  if (toggle) {
    toggle.addEventListener("click", () => {
      document.body.classList.toggle("dark");
      const isDark = document.body.classList.contains("dark");
      localStorage.setItem("theme", isDark ? "dark" : "light");
    });
  }
});

// === Load and parse CSV ===
fetch("books_data.csv")
  .then((response) => response.text())
  .then((csvText) => {
    const parsed = Papa.parse(csvText, { header: true }).data;
    const tbody = document.querySelector("#books-table tbody");

    parsed.forEach((row) => {
      if (!row.Title || !row.Price || !row.Availability) return;
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${row.Title}</td>
        <td>${row.Price}</td>
        <td>${row.Availability}</td>
      `;
      tbody.appendChild(tr);
    });

    // === Filtering logic ===
    $.fn.dataTable.ext.search.push((settings, data) => {
      const searchInput = $(".dataTables_filter input").val().trim().toLowerCase();
      const title = data[0].toLowerCase();
      if (searchInput && !title.startsWith(searchInput)) return false;

      const priceOperator = document.getElementById("priceOperator").value;
      const priceInput = parseFloat(document.getElementById("priceValue").value);
      const rowPrice = parseFloat(data[1].replace("Â£", "").trim());

      if (!isNaN(priceInput)) {
        if (priceOperator === "gt" && rowPrice <= priceInput) return false;
        if (priceOperator === "lt" && rowPrice >= priceInput) return false;
      }

      return true;
    });

    // === Initialize DataTable ===
    const table = new DataTable("#books-table");

    // === Filter Listeners ===
    document.getElementById("availabilityFilter").addEventListener("change", (e) => {
      table.column(2).search(e.target.value).draw();
    });

    document.getElementById("priceOperator").addEventListener("change", () => table.draw());
    document.getElementById("priceValue").addEventListener("input", () => table.draw());

    const globalSearchInput = $(".dataTables_filter input");
    globalSearchInput.on("input", () => table.draw());

    // === Styling DataTables Inputs with Tailwind ===
    $(document).ready(() => {
      globalSearchInput.addClass("border rounded px-2 py-1 ml-2 focus:outline-none focus:ring focus:border-blue-300");
      $(".dataTables_length select").addClass("border rounded px-2 py-1 ml-2");
    });

    // === Clear filters ===
    document.getElementById("clearFilters").addEventListener("click", () => {
      document.getElementById("availabilityFilter").value = "";
      document.getElementById("priceOperator").value = "gt";
      document.getElementById("priceValue").value = "";
      globalSearchInput.val("");
      table.search("").draw();
    });
  });
