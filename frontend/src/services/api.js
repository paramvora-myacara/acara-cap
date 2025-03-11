// frontend/src/services/api.js
const API_BASE_URL = 'http://127.0.0.1:5000/api'; // Adjust if your backend is on a different port/domain

export const getPreliminaryMatches = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/preliminary_match`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const message = `HTTP error! status: ${response.status}`;
            throw new Error(message);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("API Call Error:", error);
        throw error; // Re-throw to be caught by the component
    }
};

// You will add other API service functions here as you build more features