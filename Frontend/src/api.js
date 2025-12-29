const API_URL =
    import.meta.env.MODE === "development"
        ? "http://localhost:3000"
        : "";

export default API_URL;
