const BASE_URL = "/api";

// 🔥 GET TOKEN
const getToken = () =>
  localStorage.getItem("token");

// 🔥 AUTH HEADER
const getAuthHeaders = () => ({

  "Content-Type":
    "application/json",

  Authorization:
    `Bearer ${getToken()}`

});

// 🔥 SAFE FETCH
const safeFetch = async (
  url: string,
  options: any
) => {

  try {

    const res =
      await fetch(
        url,
        options
      );

    const text =
      await res.text();

    console.log(
      "RAW RESPONSE:",
      text
    );

    let data;

    try {

      data =
        JSON.parse(text);

    } catch {

      throw new Error(
        "❌ Server returned HTML instead of JSON"
      );

    }

    if (!res.ok) {

      throw new Error(

        data.message ||
        data.error ||
        "Request failed"

      );

    }

    return data;

  } catch (err: any) {

    console.error(
      "FETCH ERROR:",
      err
    );

    throw new Error(

      err.message ||
      "Network error ❌"

    );

  }

};

export const api = {

  // 🔐 AUTH ----------------------

  async login(
    email: string,
    password: string
  ) {

    return safeFetch(
      `${BASE_URL}/auth/login`,
      {

        method: "POST",

        headers: {

          "Content-Type":
            "application/json"

        },

        body: JSON.stringify({

          email,
          password

        })

      }
    );

  },

  async sendOtp(
    email: string
  ) {

    return safeFetch(
      `${BASE_URL}/auth/send-otp`,
      {

        method: "POST",

        headers: {

          "Content-Type":
            "application/json"

        },

        body: JSON.stringify({
          email
        })

      }
    );

  },

  async verifyOtp(
    email: string,
    otp: string
  ) {

    return safeFetch(
      `${BASE_URL}/auth/verify-otp`,
      {

        method: "POST",

        headers: {

          "Content-Type":
            "application/json"

        },

        body: JSON.stringify({

          email,
          otp

        })

      }
    );

  },

  async register(
    email: string,
    password: string
  ) {

    return safeFetch(
      `${BASE_URL}/auth/register`,
      {

        method: "POST",

        headers: {

          "Content-Type":
            "application/json"

        },

        body: JSON.stringify({

          email,
          password

        })

      }
    );

  },

  async forgotPassword(
    email: string
  ) {

    return safeFetch(
      `${BASE_URL}/auth/forgot-password`,
      {

        method: "POST",

        headers: {

          "Content-Type":
            "application/json"

        },

        body: JSON.stringify({
          email
        })

      }
    );

  },

  async resetPassword(

    email: string,
    otp: string,
    newPassword: string

  ) {

    return safeFetch(
      `${BASE_URL}/auth/reset-password`,
      {

        method: "POST",

        headers: {

          "Content-Type":
            "application/json"

        },

        body: JSON.stringify({

          email,
          otp,
          newPassword

        })

      }
    );

  },

  // 👤 PROFILE ----------------------

  async getProfile() {

    return safeFetch(
      `${BASE_URL}/profile`,
      {

        method: "GET",

        headers:
          getAuthHeaders()

      }
    );

  },

  async updateProfile(
    data: any
  ) {

    return safeFetch(
      `${BASE_URL}/profile`,
      {

        method: "PUT",

        headers:
          getAuthHeaders(),

        body: JSON.stringify(
          data
        )

      }
    );

  },

  // ❤️ HEALTH ----------------------

  async getHealthData() {

    return safeFetch(
      `${BASE_URL}/health`,
      {

        method: "GET",

        headers:
          getAuthHeaders()

      }
    );

  },

  // 🔥 ADD HEALTH DATA
  async addHealthData(
    data: any
  ) {

    return safeFetch(
      `${BASE_URL}/health`,
      {

        method: "POST",

        headers:
          getAuthHeaders(),

        body: JSON.stringify({

          sleepHours:
            Number(data.sleepHours) || 0,

          waterIntake:
            Number(data.waterIntake) || 0,

          stepsWalked:
            Number(data.stepsWalked) || 0,

          stressLevel:
            Number(data.stressLevel) || 0,

          dietQuality:
            Number(data.dietQuality) || 0,

          calories:
            Number(data.calories) || 0,

          protein:
            Number(data.protein) || 0,

          date:
            data.date ||
            new Date()

        })

      }
    );

  },

  async getWeeklyStats() {

    return safeFetch(
      `${BASE_URL}/health/weekly`,
      {

        method: "GET",

        headers:
          getAuthHeaders()

      }
    );

  },

  // 🍱 DIET ----------------------

  async getDietPlan(
    data: any
  ) {

    return safeFetch(
      `${BASE_URL}/diet/diet-plan`,
      {

        method: "POST",

        headers:
          getAuthHeaders(),

        body: JSON.stringify(
          data
        )

      }
    );

  },

  async getDietHistory() {

    return safeFetch(
      `${BASE_URL}/diet/history`,
      {

        method: "GET",

        headers:
          getAuthHeaders()

      }
    );

  },

  // 🌸 PERIOD TRACKER ----------------------

  async getPeriodData() {

    return safeFetch(
      `${BASE_URL}/period/history`,
      {

        method: "GET",

        headers:
          getAuthHeaders()

      }
    );

  },

  // 🤖 CHATBOT ----------------------

  async sendMessage(
    message: string
  ) {

    return safeFetch(
      `${BASE_URL}/chat`,
      {

        method: "POST",

        headers:
          getAuthHeaders(),

        body: JSON.stringify({
          message
        })

      }
    );

  },

  // 🔓 LOGOUT ----------------------

  logout() {

    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "user"
    );

  },

  isAuthenticated() {

    return !!localStorage.getItem(
      "token"
    );

  }

};
