const {
  createMessageService,
  findMessageByIdService,
  getMyMessagesService,
  markMessageAsReadService,
} = require("./messages.service");

async function createMessageController(req, res) {
  try {
    const payload = {
      sender_user_id: req.user.user_id,
      receiver_user_id: req.body.receiver_user_id,
      ride_offer_id: req.body.ride_offer_id,
      ride_request_id: req.body.ride_request_id,
      message_text: req.body.message_text,
    };
    const result = await createMessageService(payload);

    if (!result.success) {
      const statusMap = {
        MISSING_USER_ID: 400,
        INVALID_USER_ID: 400,
        MISSING_RECEIVER_USER_ID: 400,
        INVALID_RECEIVER_USER_ID: 400,
        CANNOT_MESSAGE_SELF: 400,
        EMPTY_MESSAGE_TEXT: 400,
        INVALID_MESSAGE_TEXT: 400,
        INVALID_CONTEXT: 400,
        USER_NOT_FOUND: 404,
        RIDE_OFFER_NOT_FOUND: 404,
        INVALID_RELATION_PAIR: 409,
        PASSENGER_NOT_ASSOCIATED_WITH_RIDE_OFFER: 404,
        RIDE_REQUEST_NOT_FOUND: 404,
        DRIVER_NOT_FOUND: 404,
      };

      const status = statusMap[result.code] || 500;
      return res.status(status).json(result);
    }

    return res.status(201).json(result);
  } catch (error) {
    console.error("Error creating message:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error during creating message",
    });
  }
}

async function findMessageByIdController(req, res) {
  try {
    const message_id = req.params.message_id;
    const user_id = req.user.user_id;
    const { role } = req.user;
    const result = await findMessageByIdService(message_id, user_id, role);

    if (!result.success) {
      const statusMap = {
        MISSING_MESSAGE_ID: 400,
        INVALID_MESSAGE_ID: 400,
        MISSING_USER_ID: 400,
        INVALID_USER_ID: 400,
        MESSAGE_NOT_FOUND: 404,
        FORBIDDEN_ACCESS: 403,
      };

      const status = statusMap[result.code] || 500;
      return res.status(status).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching message:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error during fetching message",
    });
  }
}

async function getMyMessagesController(req, res) {
  try {
    const user_id = req.user.user_id;
    const role = req.user;
    const result = await getMyMessagesService(user_id, role);

    if (!result.success) {
      const statusMap = {
        MISSING_USER_ID: 400,
        INVALID_USER_ID: 400,
        FORBIDDEN_ACCESS: 403,
      };

      const status = statusMap[result.code] || 500;
      return res.status(status).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching message:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error during fetching message",
    });
  }
}

async function markMessageAsReadController(req, res) {
  try {
    const message_id = req.params.message_id;
    const user_id = req.user.user_id;
    const role = req.user;
    const result = await markMessageAsReadService(message_id, user_id, role);

    if (!result.success) {
      const statusMap = {
        MISSING_MESSAGE_ID: 400,
        INVALID_MESSAGE_ID: 400,
        MESSAGE_NOT_FOUND: 404,
        MISSING_USER_ID: 400,
        INVALID_USER_ID: 400,
        MESSAGE_NOT_FOUND: 404,
        FORBIDDEN_ACCESS: 403,
        MESSAGE_ALREADY_READ: 409,
      };

      const status = statusMap[result.code] || 500;
      return res.status(status).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching message:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error during fetching message",
    });
  }
}

module.exports = {
  createMessageController,
  findMessageByIdController,
  getMyMessagesController,
  markMessageAsReadController,
};
