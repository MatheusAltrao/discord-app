const { resend } = require('../lib/resend');

async function sendUserInviteMail(email, inviteUrl) {
  await resend.emails.create({
    from: 'Acme <onboarding@resend.dev>',
    to: [email],
    subject: 'Convite para o Discord',
    html: `Entre no nosso discord <a href="${inviteUrl}">clicando aqui</a>!`,
  });
}

module.exports = { sendUserInviteMail };
