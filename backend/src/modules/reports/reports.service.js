const {
  createReport,
  findUserById,
  findRideOfferById,
  findRideRequestById,
  findMessageById,
  findReportById,
  getMyReports,
  getAllReportsForAdmin,
} = require("./reports.repository");

const { isValidUUID } = require("../../utils/security");
const { cleanString } = require("../../utils/helper");

async function createReportService(reportData) {
  const {
    reported_by_user_id,
    reported_user_id,
    ride_offer_id,
    ride_request_id,
    message_id,
    reason,
    details,
  } = reportData;

  if (!reported_by_user_id) {
    return {
      success: false,
      code: "MISSING_USER_ID",
      message: "Sender user ID is required.",
    };
  }

  if (!isValidUUID(reported_by_user_id)) {
    return {
      success: false,
      code: "INVALID_USER_ID",
      message: "Sender user ID must be a valid UUID.",
    };
  }

  const cleanReason = cleanString(reason);
  if (!cleanReason || cleanReason.length === 0) {
    return {
      success: false,
      code: "MISSING_REASON",
      message: "A reason must be provided to complete this request.",
    };
  }

  if (cleanReason.length > 1000) {
    return {
      success: false,
      code: "INVALID_REASON",
      message: "Reason is too long (max 1000 characters).",
    };
  }

  const cleanDetails = details ? cleanString(details) : null;
  if (cleanDetails && cleanDetails.length > 1000) {
    return {
      success: false,
      code: "INVALID_DETAILS",
      message: "Details is too long (max 1000 characters).",
    };
  }

  const provided = [
    reported_user_id,
    ride_offer_id,
    ride_request_id,
    message_id,
  ].filter(Boolean);

  if (provided.length === 0) {
    return {
      success: false,
      code: "MISSING_REPORT_TARGET",
      message: "A report target must be provided.",
    };
  }

  if (provided.length > 1) {
    return {
      success: false,
      code: "MULTIPLE_REPORT_TARGETS",
      message: "Exactly one report target must be provided.",
    };
  }

  const reporter = await findUserById(reported_by_user_id);
  if (!reporter) {
    return {
      success: false,
      code: "REPORTER_NOT_FOUND",
      message: "Reporting user does not exist.",
    };
  }

  if (reported_user_id) {
    if (!isValidUUID(reported_user_id)) {
      return {
        success: false,
        code: "INVALID_REPORTED_USER_ID",
        message: "Reported user ID must be a valid UUID.",
      };
    }

    const reportedUser = await findUserById(reported_user_id);
    if (!reportedUser) {
      return {
        success: false,
        code: "REPORTED_USER_NOT_FOUND",
        message: "Reported user does not exist.",
      };
    }

    if (reported_by_user_id === reported_user_id) {
      return {
        success: false,
        code: "SELF_REPORT_NOT_ALLOWED",
        message: "You cannot report yourself.",
      };
    }
  }

  if (ride_offer_id) {
    if (!isValidUUID(ride_offer_id)) {
      return {
        success: false,
        code: "INVALID_RIDE_OFFER_ID",
        message: "Ride offer ID must be a valid UUID.",
      };
    }

    const rideOffer = await findRideOfferById(ride_offer_id);
    if (!rideOffer) {
      return {
        success: false,
        code: "RIDE_OFFER_NOT_FOUND",
        message: "Ride offer does not exist.",
      };
    }
  }

  if (ride_request_id) {
    if (!isValidUUID(ride_request_id)) {
      return {
        success: false,
        code: "INVALID_RIDE_REQUEST_ID",
        message: "Ride request ID must be a valid UUID.",
      };
    }

    const rideRequest = await findRideRequestById(ride_request_id);
    if (!rideRequest) {
      return {
        success: false,
        code: "RIDE_REQUEST_NOT_FOUND",
        message: "Ride request does not exist.",
      };
    }
  }

  if (message_id) {
    if (!isValidUUID(message_id)) {
      return {
        success: false,
        code: "INVALID_MESSAGE_ID",
        message: "Message ID must be a valid UUID.",
      };
    }

    const message = await findMessageById(message_id);
    if (!message) {
      return {
        success: false,
        code: "MESSAGE_NOT_FOUND",
        message: "Message does not exist.",
      };
    }
  }

  const report = await createReport({
    reported_by_user_id,
    reported_user_id,
    ride_offer_id,
    ride_request_id,
    message_id,
    reason: cleanReason,
    details: cleanDetails,
    status: "open",
  });

  return {
    success: true,
    code: "REPORT_CREATED_SUCCESS",
    message: "Report created successfully.",
    data: report,
  };
}
async function findReportByIdService(report_id, user_id, role) {
  if (!report_id)
    return {
      success: false,
      code: "MISSING_USER_ID",
      message: "Sender user ID is required.",
    };
  if (!isValidUUID(report_id))
    return {
      success: false,
      code: "INVALID_USER_ID",
      message: "Sender user ID must be a valid UUID.",
    };

  const report = await findReportById(report_id);
  if (!report) {
    return {
      success: false,
      code: "REPORT_NOT_FOUND",
      message: "The requested report does not exist.",
    };
  }

  if (report.reported_by_user_id !== user_id && role !== "admin") {
    return {
      success: false,
      code: "FORBIDDEN_ACCESS",
      message: "You are not allowed to perform this action on this report.",
    };
  }

  return {
    success: true,
    code: "FETCH_REPORT_SUCCESS",
    message: "Report retrieved successfully.",
    data: report,
  };
}

async function getMyReportsService(reported_by_user_id) {
  if (!reported_by_user_id)
    return {
      success: false,
      code: "MISSING_USER_ID",
      message: "User ID is required.",
    };
  if (!isValidUUID(reported_by_user_id))
    return {
      success: false,
      code: "INVALID_USER_ID",
      message: "User ID must be a valid UUID.",
    };

  const reports = await getMyReports(reported_by_user_id);

  return {
    success: true,
    code: "FETCH_MY_REPORTS_SUCCESS",
    message: "Reports retrieved successfully.",
    data: reports,
  };
}

async function getAllReportsForAdminService(role) {
  if (role !== "Admin") {
    return {
      success: false,
      code: "FORBIDDEN_ACCESS",
      message: "Only admins are allowed to view all reports.",
    };
  }

  const reports = await getAllReportsForAdmin();

  return {
    success: true,
    code: "FETCH_ALL_REPORTS_SUCCESS",
    message: "All reports retrieved successfully.",
    data: reports,
  };
}

module.exports = {
  createReportService,
  findReportByIdService,
  getMyReportsService,
  getAllReportsForAdminService,
};
