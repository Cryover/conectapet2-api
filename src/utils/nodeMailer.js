const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.USER_EMAIL,
    pass: process.env.USER_EMAIL_PW,
  },
});

const mailOptions = {
  from: process.env.USER_EMAIL,
  to: "recipient_email@example.com",
  subject: "Redefinição de Senha",
  text: `Você solicitou a redefinição de sua senha. Clique no link a seguir para redefinir sua senha: ${resetLink}`,
};

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.error("Erro ao enviar email: " + error);
  } else {
    console.log("Email Enviado: " + info.response);
  }
});
