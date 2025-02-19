const monthYear = document.getElementById("month-year");
const prev = document.getElementById("prev-month");
const next = document.getElementById("next-month");
const calendarDates = document.getElementById("calendar-dates");

// Set current date globally
let currentDate = new Date();

function generateCalendar(date = currentDate) {
  let year = date.getFullYear();
  let month = date.getMonth();

  // Set month and year in header
  monthYear.textContent = new Intl.DateTimeFormat("en-GB", {
    month: "long",
    year: "numeric",
  }).format(date);

  // Clear previous dates
  calendarDates.innerHTML = "";

  // Get first and last day of the month
  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();
  const prevLastDate = new Date(year, month, 0).getDate();

  // Fill in previous month's dates (greyed out)
  for (let i = firstDay - 1; i >= 0; i--) {
    let div = document.createElement("div");
    div.textContent = prevLastDate - i;
    div.classList.add("date", "inactive");
    calendarDates.appendChild(div);
  }

  // Fill in current month's dates
  for (let i = 1; i <= lastDate; i++) {
    let div = document.createElement("div");
    div.textContent = i;
    div.classList.add("date");

    // Add click event to add/remove icon
    div.addEventListener("click", function () {
      // Remove existing icon if present
      let existingIcon = div.querySelector("span");
      if (existingIcon) {
        div.removeChild(existingIcon); // Remove icon if already present
      } else {
        let icon = document.createElement("span");
        icon.innerHTML = "✔️"; // You can use "📍" instead
        icon.style.display = "block";
        icon.style.fontSize = "14px";
        div.appendChild(icon);
      }
    });

    calendarDates.appendChild(div);
  }

  // Fill in next month's dates (greyed out)
  let totalCells = firstDay + lastDate;
  let nextDays = totalCells <= 35 ? 35 - totalCells : 42 - totalCells;

  for (let i = 1; i <= nextDays; i++) {
    let div = document.createElement("div");
    div.textContent = i;
    div.classList.add("date", "inactive");
    calendarDates.appendChild(div);
  }
}

// Event listeners for navigation buttons
prev.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  generateCalendar();
});

next.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  generateCalendar();
});

// Initial calendar load
generateCalendar();
