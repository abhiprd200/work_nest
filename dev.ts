
{
  "entities": {
    "UserProfile": {
      "$schema": "http://json-schema.org/draft-07/schema#",
      "title": "UserProfile",
      "type": "object",
      "description": "Represents a user who requests services through the WorkNest application.",
      "properties": {
        "id": { "type": "string" },
        "email": { "type": "string", "format": "email" },
        "firstName": { "type": "string" },
        "lastName": { "type": "string" },
        "registrationDate": { "type": "string", "format": "date-time" }
      },
      "required": ["id", "email", "firstName", "lastName", "registrationDate"]
    },
    "ServiceProfessional": {
      "$schema": "http://json-schema.org/draft-07/schema#",
      "title": "ServiceProfessional",
      "type": "object",
      "description": "Represents a professional worker who provides services.",
      "properties": {
        "id": { "type": "string" },
        "email": { "type": "string", "format": "email" },
        "firstName": { "type": "string" },
        "lastName": { "type": "string" },
        "serviceCategoryIds": { "type": "array", "items": { "type": "string" } },
        "isAvailable": { "type": "boolean" },
        "averageRating": { "type": "number" },
        "registrationDate": { "type": "string", "format": "date-time" }
      },
      "required": ["id", "email", "firstName", "lastName", "registrationDate", "serviceCategoryIds", "isAvailable"]
    },
    "Appointment": {
      "$schema": "http://json-schema.org/draft-07/schema#",
      "title": "Appointment",
      "type": "object",
      "description": "A scheduled service appointment.",
      "properties": {
        "id": { "type": "string" },
        "userId": { "type": "string" },
        "serviceProfessionalId": { "type": "string" },
        "serviceType": { "type": "string" },
        "status": { "type": "string", "enum": ["pending", "confirmed", "completed", "cancelled"] },
        "date": { "type": "string", "format": "date-time" },
        "price": { "type": "number" }
      },
      "required": ["userId", "serviceProfessionalId", "serviceType", "status", "date"]
    },
    "Payment": {
      "$schema": "http://json-schema.org/draft-07/schema#",
      "title": "Payment",
      "type": "object",
      "description": "Payment record for an appointment.",
      "properties": {
        "id": { "type": "string" },
        "appointmentId": { "type": "string" },
        "userId": { "type": "string" },
        "serviceProfessionalId": { "type": "string" },
        "amount": { "type": "number" },
        "method": { "type": "string", "enum": ["Cash on Delivery"] },
        "status": { "type": "string", "enum": ["pending", "paid"] }
      },
      "required": ["appointmentId", "userId", "serviceProfessionalId", "amount", "method", "status"]
    },
    "Feedback": {
      "$schema": "http://json-schema.org/draft-07/schema#",
      "title": "Feedback",
      "type": "object",
      "description": "User feedback about the platform.",
      "properties": {
        "name": { "type": "string" },
        "email": { "type": "string", "format": "email" },
        "message": { "type": "string" },
        "timestamp": { "type": "string", "format": "date-time" }
      },
      "required": ["name", "email", "message", "timestamp"]
    },
    "Review": {
      "$schema": "http://json-schema.org/draft-07/schema#",
      "title": "Review",
      "type": "object",
      "description": "A review for a professional service.",
      "properties": {
        "id": { "type": "string" },
        "appointmentId": { "type": "string" },
        "userId": { "type": "string" },
        "userName": { "type": "string" },
        "serviceProfessionalId": { "type": "string" },
        "rating": { "type": "number" },
        "comment": { "type": "string" },
        "submissionDate": { "type": "string", "format": "date-time" }
      },
      "required": ["appointmentId", "userId", "serviceProfessionalId", "rating", "comment", "submissionDate"]
    }
  },
  "auth": {
    "providers": ["password"]
  },
  "firestore": {
    "/userProfiles/{userId}": {
      "schema": "UserProfile",
      "description": "User profiles for homeowners."
    },
    "/serviceProfessionals/{professionalId}": {
      "schema": "ServiceProfessional",
      "description": "Service professional profiles."
    },
    "/appointments/{appointmentId}": {
      "schema": "Appointment",
      "description": "Service appointments."
    },
    "/payments/{paymentId}": {
      "schema": "Payment",
      "description": "Payment records."
    },
    "/feedback/{feedbackId}": {
      "schema": "Feedback",
      "description": "User feedback collection."
    },
    "/platform_reviews/{reviewId}": {
      "schema": "Review",
      "description": "Public reviews for the platform."
    },
    "/serviceProfessionals/{proId}/reviews/{reviewId}": {
      "schema": "Review",
      "description": "Specific reviews for service professionals."
    }
  }
}
