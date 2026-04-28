const {
  createReportService,
  findReportByIdService,
  getMyReportsService,
  getAllReportsForAdminService,
} = require("./reports.service");

async function createReportController(req, res) {
  try {
    const payload = {
      reported_by_user_id: req.user.user_id,
      reported_user_id: req.body.reported_user_id,
      ride_offer_id: req.body.ride_offer_id,
      ride_request_id: req.body.ride_request_id,
      message_id: req.body.message_id,
      reason: req.body.reason,
      details: req.body.details,
    };

    const result = await createReportService(payload);

    if (!result.success) {
      const statusMap = {
        MISSING_USER_ID: 400,
        INVALID_USER_ID: 400,
        MISSING_REASON: 400,
        INVALID_REASON: 400,
        INVALID_DETAILS: 400,
        MISSING_REPORT_TARGET: 400,
        MULTIPLE_REPORT_TARGETS: 400,
        REPORTER_NOT_FOUND: 404,
        INVALID_REPORTED_USER_ID: 400,
        REPORTED_USER_NOT_FOUND: 404,
        SELF_REPORT_NOT_ALLOWED: 409,
        INVALID_RIDE_OFFER_ID: 400,
        RIDE_OFFER_NOT_FOUND: 404,
        INVALID_RIDE_REQUEST_ID: 400,
        RIDE_REQUEST_NOT_FOUND: 404,
        INVALID_MESSAGE_ID: 400,
        MESSAGE_NOT_FOUND: 404,
      };

      const status = statusMap[result.code] || 500;
      return res.status(status).json(result);
    }

    return res.status(201).json(result);
  } catch (error) {
    console.error("Error creating report:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error during creating report",
    });
  }
}

async function findReportByIdController(req, res) {
  try {
    const { report_id } = req.params;
    const user_id = req.user.user_id;
    const { role } = req.user;

    const result = await findReportByIdService(report_id, user_id, role);

    if (!result.success) {
      const statusMap = {
        MISSING_REPORT_ID: 400,
        INVALID_REPORT_ID: 400,
        REPORT_NOT_FOUND: 404,
        FORBIDDEN_ACCESS: 403,
      };

      const status = statusMap[result.code] || 500;
      return res.status(status).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching report:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error during fetching report",
    });
  }
}

async function getMyReportsController(req, res) {
  try {
    const reported_by_user_id = req.user.user_id;
    const result = await getMyReportsService(reported_by_user_id);

    if (!result.success) {
      const statusMap = {
        MISSING_USER_ID: 400,
        INVALID_USER_ID: 400,
      };

      const status = statusMap[result.code] || 500;
      return res.status(status).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching my reports:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error during fetching my reports",
    });
  }
}

async function getAllReportsForAdminController(req, res) {
  try {
    const { role } = req.user;
    const result = await getAllReportsForAdminService(role);

    if (!result.success) {
      const statusMap = {
        FORBIDDEN_ACCESS: 403,
      };

      const status = statusMap[result.code] || 500;
      return res.status(status).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching my reports:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error during fetching my reports",
    });
  }
}
module.exports = {
  createReportController,
  findReportByIdController,
  getMyReportsController,
  getAllReportsForAdminController,
};
