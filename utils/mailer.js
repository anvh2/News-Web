var mailer = require('nodemailer')

var transporter = mailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'vngchatservice@gmail.com',
        pass: 'vng123456'
    }
});

module.exports = {
    changePass: email => {
        var template = "<div><a href=\"mailto:" + email + "\" target=\"_blank\">" + email + "</a><br>" +
            "\t\t\t\t\t\t\t\t -Tài khoản của bạn là: <a href=\"mailto:" + email + "\" target=\"_blank\"> " + email + "</a><br>\n" +
            "\t\t\t\t\t\t\t\t -Mật khẩu mới của bạn là: 123456\n" +
            "\t\t\t\t\t\t\t\t -Bạn vui lòng nhấp vào <a href=\"http://localhost:8000/confirm/" + email + "\"> link sau </a> để kích hoạt cho tài khoản <a href=\"mailto:" + email + "\" target=\"_blank\">" + email + "</a>:<br>\n" +
            "\t\t\t\t\t\t\t\t -Bạn vui lòng thay đổi lại mật khẩu sau khi đăng nhập" +
            "\t\t\t\t\t\t\t\tLưu ý: nếu bạn không yêu cầu cấp tài khoản, vui lòng bỏ qua email này và bảo mật thông tin tài khoản của bạn<br>\n" +
            "\t\t\t\t\t\t\t\t<br><br>\n" +
            "\t\t\t\t\t\t\t\t\n" +
            "\t\t\t\t\t\t\t\tVui lòng không trả lời email này.<br>\n\n" +
            "\t\t\t\t\t\t\t\tNewsWebHCMUS.<br>\n" +
            "</div>"

        var mailOptions = {
            from: 'vngchatservice@gmail.com',
            to: email,
            subject: 'Xác nhận đổi mật khẩu',
            html: template
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    }
}