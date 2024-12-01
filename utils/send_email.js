const { sendMail } = require("../utils/mail_controller");

const sendEmail = async ({ user, to, status, url }) => {
  try {
    let subject = "";
    let message = "";
    let response;
    console.log(user.email)
    console.log(status)
    switch (status) {
      case "verification-code":
        subject = "Kwanza verification code";
        message =
          "Hi! " +
          user.name +
          ",<br>Your verification code is " +
          user.password +
          `, <a href="https://dashboard.kwanza.io/confirm/${user.email}">Verify</a>`;
        response = await sendMail({user, subject, message, status});
        break;
      case "new-marketer":
        subject = "New Marketer Joined the Platform";
        message = `
            Hi,<br><br>
            We’re excited to inform you that a new marketer has joined the platform! Here are their details:<br><br>
            <strong>Company:</strong> ${user.company}<br>
            <strong>Name:</strong> ${user.name}<br>
            <strong>Phone:</strong> ${user.phone}<br>
            <strong>Email:</strong> ${user.email}<br><br>
            Best regards,<br>
            The Platform Team
          `;
        response = await sendMail({ user, to, subject, message, status });
        break;

      default:
        break;
    }

    return response;
  } catch (error) {
    return error;
  }
};

module.exports = { sendEmail };
