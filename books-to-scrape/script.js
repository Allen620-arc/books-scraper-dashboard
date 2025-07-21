// Load and parse CSV
fetch("books_data.csv")
  .then((response) => response.text())
  .then((csvText) => {
    const parsed = Papa.parse(csvText, { header: true }).data;
    const tbody = document.querySelector("#books-table tbody");

    // Populate table
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

    // === Custom Filtering Function ===
    $.fn.dataTable.ext.search.push(function (settings, data, dataIndex) {
      const globalSearch = $(".dataTables_filter input")
        .val()
        .trim()
        .toLowerCase();
      const title = data[0].toLowerCase();

      if (globalSearch && !title.startsWith(globalSearch)) return false;

      const priceOperator = document.getElementById("priceOperator").value;
      const priceInput = parseFloat(
        document.getElementById("priceValue").value
      );
      const priceText = data[1].replace("Â£", "").trim();
      const rowPrice = parseFloat(priceText);

      if (!isNaN(priceInput)) {
        if (priceOperator === "gt" && !(rowPrice > priceInput)) return false;
        if (priceOperator === "lt" && !(rowPrice < priceInput)) return false;
      }

      return true;
    });

    // === Initialize Table ===
    const table = new DataTable("#books-table");

    // === Availability Filter ===
    document
      .getElementById("availabilityFilter")
      .addEventListener("change", function () {
        const selected = this.value;
        table.column(2).search(selected).draw();
      });

    // === Trigger redraw on filter changes ===
    document
      .getElementById("priceOperator")
      .addEventListener("change", () => table.draw());
    document
      .getElementById("priceValue")
      .addEventListener("input", () => table.draw());
    $(".dataTables_filter input").on("input", () => table.draw());
  });
