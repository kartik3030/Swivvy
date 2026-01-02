const API_URL =
    import.meta.env.MODE === "development"
        ? "http://localhost:3000"
        : "https://swivvy-1.onrender.com";

export default API_URL;
