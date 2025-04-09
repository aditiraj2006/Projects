document.addEventListener("DOMContentLoaded", function () {
    const searchButton = document.getElementById("search-btn");
    const usernameInput = document.getElementById("user-input");
    const statsContainer = document.querySelector(".stats-container");
    const easyProgressCircle = document.querySelector(".easy-progress");
    const mediumProgressCircle = document.querySelector(".medium-progress");
    const hardProgressCircle = document.querySelector(".hard-progress");
    const easyLabel = document.getElementById("easy-label");
    const mediumLabel = document.getElementById("medium-label");
    const hardLabel = document.getElementById("hard-label");
    const cardStatsContainer = document.querySelector(".stats-cards");

    // Validate username format
    function validateUsername(username) {
        if (username.trim() === "") {
            alert("Username should not be empty");
            return false;
        }
        const regex = /^[a-zA-Z][a-zA-Z0-9_]{3,19}$/;
        if (!regex.test(username)) {
            alert("Invalid Username");
            return false;
        }
        return true;
    }

    // Fetch user details from the API
    async function fetchUserDetails(username) {
        const url = `https://leetcode-stats-api.herokuapp.com/${username}`;
        try {
            searchButton.textContent = "Searching...";
            searchButton.classList.add("loading");
            searchButton.disabled = true;

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("Unable to fetch user details");
            }
            const data = await response.json();

            if (!data || typeof data !== "object" || !("totalSolved" in data)) {
                throw new Error("Invalid API response");
            }

            console.log("User Data:", data);
            displayUserData(data);
        } catch (error) {
            console.error("Error:", error);
            alert("Failed to fetch user details. Please try again.");
        } finally {
            searchButton.textContent = "Search";
            searchButton.classList.remove("loading");
            searchButton.disabled = false;
        }
    }

    // Update progress circles
    function updateProgress(circle, percentage, solved, total, label) {
        const progressDegree = (percentage / 100) * 360;
        circle.style.setProperty("--progress-degree", `${progressDegree}deg`);
        label.textContent = `${solved} / ${total}`;
    }

    // Display user data
    function displayUserData(data) {
        if (data.status !== "success") {
            alert("User data not found!");
            return;
        }

        // Update labels
        easyLabel.textContent = ` ${data.easySolved} / ${data.totalEasy}`;
        mediumLabel.textContent = ` ${data.mediumSolved} / ${data.totalMedium}`;
        hardLabel.textContent = ` ${data.hardSolved} / ${data.totalHard}`;

        // Update progress circles
        updateProgress(easyProgressCircle, (data.easySolved / data.totalEasy) * 100, data.easySolved, data.totalEasy, easyLabel);
        updateProgress(mediumProgressCircle, (data.mediumSolved / data.totalMedium) * 100, data.mediumSolved, data.totalMedium, mediumLabel);
        updateProgress(hardProgressCircle, (data.hardSolved / data.totalHard) * 100, data.hardSolved, data.totalHard, hardLabel);

        // Update additional stats
        cardStatsContainer.innerHTML = `
            <div class="stat-card">Total Solved: ${data.totalSolved} / ${data.totalQuestions}</div>
            <div class="stat-card">Acceptance Rate: ${data.acceptanceRate}%</div>
            <div class="stat-card">Ranking: ${data.ranking}</div>
            <div class="stat-card">Contribution Points: ${data.contributionPoints}</div>
            <div class="stat-card">Reputation: ${data.reputation}</div>
        `;

        // Show stats container
        statsContainer.style.display = "block";
    }

   // Debounce function to prevent excessive API calls
function debounce(func, delay) {
    let timer;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => func.apply(this, args), delay);
    };
}

    // Handle search button click with debounce
    searchButton.addEventListener('click', debounce(function () {
        const username = usernameInput.value.trim();
        console.log("Searching for username:", username);

        if (validateUsername(username)) {
            fetchUserDetails(username);
        }
    }, 500)); // 500ms debounce
});
