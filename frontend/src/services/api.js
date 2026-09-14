import axios from 'axios'

/* =========================================================
   API BASE URL
========================================================= */

const BASE_URL =
  import.meta.env.VITE_API_URL ||
  'http://localhost:5000/api'

/* =========================================================
   AXIOS INSTANCE
========================================================= */

const api = axios.create({
  baseURL: BASE_URL,

  timeout: 15000,

  headers: {
    'Content-Type': 'application/json',
  },
})

/* =========================================================
   REQUEST INTERCEPTOR
========================================================= */

api.interceptors.request.use(
  (config) => {
    console.log(
      `[API REQUEST] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`
    )

    /*
      Show booking request body in console.
      Useful for debugging MongoDB booking errors.
    */

    if (
      config.url?.includes('/bookings') &&
      config.data
    ) {
      console.log(
        '[BOOKING REQUEST DATA]',
        config.data
      )
    }

    return config
  },

  (error) => {
    console.error(
      '[REQUEST INTERCEPTOR ERROR]',
      error
    )

    return Promise.reject(error)
  }
)

/* =========================================================
   RESPONSE INTERCEPTOR
========================================================= */

api.interceptors.response.use(
  /*
    SUCCESS RESPONSE
  */

  (response) => {
    console.log(
      `[API SUCCESS] ${response.config.method?.toUpperCase()} ${response.config.url}`,
      response.data
    )

    /*
      Return only backend response data.

      Example:
      {
        success: true,
        data: {...}
      }
    */

    return response.data
  },

  /*
    ERROR RESPONSE
  */

  (error) => {
    console.error(
      '[API ERROR OBJECT]',
      error
    )

    /* =====================================================
       SERVER RESPONDED WITH ERROR
    ===================================================== */

    if (error.response) {
      const status =
        error.response.status

      const serverData =
        error.response.data

      console.error(
        '[API ERROR STATUS]',
        status
      )

      console.error(
        '[API ERROR DATA]',
        serverData
      )

      /* ===================================================
         BACKEND MESSAGE
      =================================================== */

      let message =
        serverData?.message ||
        `Server error: ${status}`

      /* ===================================================
         MONGOOSE VALIDATION ERRORS

         Example:

         errors: [
           "passengerName is required"
         ]
      =================================================== */

      if (
        Array.isArray(
          serverData?.errors
        )
      ) {
        message +=
          `: ${serverData.errors.join(', ')}`
      }

      /* ===================================================
         MISSING FIELDS
      =================================================== */

      if (
        Array.isArray(
          serverData?.missingFields
        ) &&
        serverData.missingFields.length > 0
      ) {
        message +=
          `: Missing ${serverData.missingFields.join(', ')}`
      }

      /* ===================================================
         AXIOS STATUS SPECIFIC MESSAGE
      =================================================== */

      if (status === 400) {
        console.error(
          '400 BAD REQUEST:',
          serverData
        )
      }

      if (status === 404) {
        console.error(
          '404 NOT FOUND:',
          serverData
        )
      }

      if (status === 409) {
        console.error(
          '409 CONFLICT:',
          serverData
        )
      }

      if (status === 500) {
        console.error(
          '500 SERVER ERROR:',
          serverData
        )
      }

      return Promise.reject(
        new Error(message)
      )
    }

    /* =====================================================
       REQUEST SENT BUT NO RESPONSE
    ===================================================== */

    if (error.request) {
      console.error(
        '[NETWORK ERROR]',
        error.request
      )

      return Promise.reject(
        new Error(
          'Network Error: Backend server is not reachable. Please make sure the backend is running on port 5000.'
        )
      )
    }

    /* =====================================================
       AXIOS CONFIGURATION ERROR
    ===================================================== */

    console.error(
      '[AXIOS CONFIG ERROR]',
      error.message
    )

    return Promise.reject(
      new Error(
        error.message ||
        'Something went wrong.'
      )
    )
  }
)

/* =========================================================
   BUS API
========================================================= */

export const busAPI = {

  /*
    Get all active buses
  */

  getAll: () =>
    api.get('/buses'),

  /*
    Search buses

    Example:

    busAPI.search({
      from: 'Chennai',
      to: 'Madurai',
      date: '2026-09-13'
    })
  */

  search: (params) =>
    api.get(
      '/buses/search',
      {
        params,
      }
    ),

  /*
    Get one bus using MongoDB ObjectId
  */

  getById: (id) =>
    api.get(
      `/buses/${id}`
    ),
}

/* =========================================================
   BOOKING API
========================================================= */

export const bookingAPI = {

  /*
    Create booking in MongoDB
  */

  create: (data) => {

    console.log(
      '========================================'
    )

    console.log(
      '[CREATE BOOKING]'
    )

    console.log(
      'Booking data:',
      data
    )

    console.log(
      '========================================'
    )

    return api.post(
      '/bookings',
      data
    )
  },

  /*
    Get all bookings
  */

  getAll: () =>
    api.get(
      '/bookings'
    ),

  /*
    Get one booking
    using booking ID
  */

  getById: (bookingId) =>
    api.get(
      `/bookings/${encodeURIComponent(
        bookingId
      )}`
    ),

  /*
    Get bookings by
    passenger phone
  */

  getByPhone: (phone) =>
    api.get(
      `/bookings/phone/${encodeURIComponent(
        phone
      )}`
    ),
}

/* =========================================================
   HEALTH CHECK
========================================================= */

export const healthAPI = {

  check: () =>
    api.get('/health'),
}

/* =========================================================
   DEFAULT EXPORT
========================================================= */

export default api