const API_BASE = process.env.REACT_APP_API_BASE;

export async function getFinanceSummary() {
    console.log("API base:", API_BASE); // Debugging
    try {
        const response = await fetch(`${API_BASE}/finance/summary`);
        if (!response.ok) throw new Error(`API request failed: ${response.status}`);
        return response.json();
    } catch (error) {
        console.error("Error fetching finance summary:", error);
        throw error;
    }
}

