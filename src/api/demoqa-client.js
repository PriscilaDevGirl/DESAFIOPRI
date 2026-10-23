class DemoQaClient {
  constructor(baseUrl = process.env.API_BASE_URL || "https://demoqa.com") {
    this.baseUrl = baseUrl.replace(/\/+$/, "");
  }

  async request(method, path, { body, token } = {}) {
    const headers = { Accept: "application/json" };
    if (body !== undefined) {
      headers["Content-Type"] = "application/json";
    }
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${this.baseUrl}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: AbortSignal.timeout(20_000)
    });
    const responseText = await response.text();
    let data = null;

    if (responseText) {
      try {
        data = JSON.parse(responseText);
      } catch {
        throw new Error(
          `${method} ${path} returned HTTP ${response.status} with a non-JSON response`
        );
      }
    }

    if (!response.ok) {
      const message =
        typeof data?.message === "string" ? data.message : "No error message returned";
      throw new Error(`${method} ${path} returned HTTP ${response.status}: ${message}`);
    }

    return { status: response.status, data };
  }

  createUser(credentials) {
    return this.request("POST", "/Account/v1/User", { body: credentials });
  }

  generateToken(credentials) {
    return this.request("POST", "/Account/v1/GenerateToken", { body: credentials });
  }

  authorize(credentials) {
    return this.request("POST", "/Account/v1/Authorized", { body: credentials });
  }

  listBooks() {
    return this.request("GET", "/BookStore/v1/Books");
  }

  addBooks(userId, isbns, token) {
    return this.request("POST", "/BookStore/v1/Books", {
      token,
      body: {
        userId,
        collectionOfIsbns: isbns.map((isbn) => ({ isbn }))
      }
    });
  }

  getUser(userId, token) {
    return this.request("GET", `/Account/v1/User/${encodeURIComponent(userId)}`, {
      token
    });
  }

  deleteUser(userId, token) {
    return this.request("DELETE", `/Account/v1/User/${encodeURIComponent(userId)}`, {
      token
    });
  }
}

module.exports = { DemoQaClient };
