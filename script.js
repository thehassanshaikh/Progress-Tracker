const monthYear = document.getElementById("month-year");
const prev = document.getElementById("prev-month");
const next = document.getElementById("next-month");
const calendarDates = document.getElementById("calendar-dates");
const currentStreakElement = document.getElementById("current-streak");
const longestStreakElement = document.getElementById("longest-streak");

// Load stored data or initialise
let selectedDates = JSON.parse(localStorage.getItem("selectedDates")) || {};
let currentDate = new Date();

function generateCalendar(date = currentDate) {
  let year = date.getFullYear();
  let month = date.getMonth();
  let monthKey = `${year}-${month}`;

  let today = new Date();
  let todayDate = today.getDate();
  let todayMonth = today.getMonth();
  let todayYear = today.getFullYear();

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

    // Highlight today's date
    if (i === todayDate && month === todayMonth && year === todayYear) {
      div.classList.add("today");
    }

    // Restore checkmark if saved in Local Storage
    if (selectedDates[monthKey] && selectedDates[monthKey].includes(i)) {
      addCheckmark(div);
    }

    // Click event to add/remove checkmark
    div.addEventListener("click", function () {
      if (!selectedDates[monthKey]) selectedDates[monthKey] = []; // Ensure array exists

      if (selectedDates[monthKey].includes(i)) {
        removeCheckmark(div);
        selectedDates[monthKey] = selectedDates[monthKey].filter(
          (day) => day !== i
        );
      } else {
        addCheckmark(div);
        selectedDates[monthKey].push(i);
      }

      localStorage.setItem("selectedDates", JSON.stringify(selectedDates));
      updateStreaks();
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

  updateStreaks();
}

// Function to add a checkmark
function addCheckmark(div) {
  let icon = document.createElement("span");
  icon.innerHTML = "✅";
  icon.style.display = "block";
  icon.style.fontSize = "14px";
  div.appendChild(icon);
}

// Function to remove a checkmark
function removeCheckmark(div) {
  if(confirm("Are you sure you want to remove the checkmark")){
    let existingIcon = div.querySelector("span");
  if (existingIcon) div.removeChild(existingIcon);
  }
}

// Function to calculate streaks
function updateStreaks() {
  let dates = Object.values(selectedDates).flat().sort((a, b) => a - b);
  let currentStreak = 0;
  let longestStreak = 0;
  let previousDate = null;

  dates.forEach(date => {
    if (previousDate === null || date === previousDate + 1) {
      currentStreak++;
    } else {
      if (currentStreak > longestStreak) {
        longestStreak = currentStreak;
      }
      currentStreak = 1;
    }
    previousDate = date;
  });

  if (currentStreak > longestStreak) {
    longestStreak = currentStreak;
  }

  currentStreakElement.textContent = `${currentStreak} days`;
  longestStreakElement.textContent = `${longestStreak} days`;
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