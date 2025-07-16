// Load CSV and initialize DataTable
    fetch('books_data.csv')
      .then(response => response.text())
      .then(csvText => {
        const parsed = Papa.parse(csvText, { header: true }).data;

        // Build table rows
        const tbody = document.querySelector("#books-table tbody");
        parsed.forEach(row => {
          if (!row.Title || !row.Price || !row.Availability) return;

          const tr = document.createElement("tr");
          tr.innerHTML = `
            <td>${row.Title}</td>
            <td>${row.Price}</td>
            <td>${row.Availability}</td>
          `;
          tbody.appendChild(tr);
        });

        // Initialize DataTable
        const table = new DataTable('#books-table');

        // Hook up filter dropdown
        document.getElementById('availabilityFilter').addEventListener('change', function () {
          const selected = this.value;
          table.column(2).search(selected).draw();
        });
      });