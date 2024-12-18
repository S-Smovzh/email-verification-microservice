import { EmailTypeEnum } from "@ssmovzh/chatterly-common-utils";

export const emailTemplate = (verificationLink: string, type: EmailTypeEnum) => {
  let mainTdBlock = "",
    linkText = "Verify change";
  switch (type) {
    case EmailTypeEnum.VERIFY_EMAIL:
      linkText = "Verify email";
      mainTdBlock = `
          Hi,<br />
          <br />
          We are very pleased that you want to try Chatterly.<br />
          <br />
          The last thing you need to do is verify your email.<br />
          <br />
          Please click below to activate your account and complete your signup process.<br />
          <br />
          <strong style="font-weight: 700">Hurry up! Your activation link expires in 6 hours!</strong>
          <br />
      `;
      break;
    case EmailTypeEnum.RESET_PASSWORD:
      linkText = "Reset password";
      mainTdBlock = `
          Hi,<br />
          <br />
          We received a request for the reset password.<br />
          <br />
          To reset your password follow the link below.<br />
          <br />
          Hurry up! Your activation link expires in 6 hours!<br />
          <br />
          <strong style="font-weight: 700">If you haven't requested reset, DO NOT follow the link!</strong
          ><br />
      `;
      break;
    case EmailTypeEnum.VERIFY_EMAIL_CHANGE:
      mainTdBlock = `
          Hi,<br />
          <br />
          We received a request for the email change.<br />
          <br />
          To verify your new email follow the link below.<br />
          <br />
          Hurry up! Your activation link expires in 6 hours!<br />
          <br />
          <strong style="font-weight: 700">If you haven't requested email change, DO NOT follow the link and <a href="https://Chatterly.herokuapp.com/en/contact-us">contact us</a>!</strong
          ><br />
      `;
      break;
    case EmailTypeEnum.VERIFY_USERNAME_CHANGE:
      mainTdBlock = `
          Hi,<br />
          <br />
          We received a request for the username change.<br />
          <br />
          To verify your new username follow the link below.<br />
          <br />y
          Hurry up! Your activation link expires in 6 hours!<br />
          <br />
          <strong style="font-weight: 700">If you haven't requested username change, DO NOT follow the link and <a href="https://Chatterly.herokuapp.com/en/contact-us">contact us</a>!</strong
          ><br />
      `;
      break;
    case EmailTypeEnum.VERIFY_TEL_CHANGE:
      mainTdBlock = `
          Hi,<br />
          <br />
          We received a request for the phone number change.<br />
          <br />
          To verify your new phone number follow the link below.<br />
          <br />
          Hurry up! Your activation link expires in 6 hours!<br />
          <br />
          <strong style="font-weight: 700">If you haven't requested phone number change, DO NOT follow the link and <a href="https://Chatterly.herokuapp.com/en/contact-us">contact us</a>!</strong
          ><br />
      `;
      break;
    case EmailTypeEnum.VERIFY_PASSWORD_CHANGE:
      mainTdBlock = `
          Hi,<br />
          <br />
          We received a request for the password change.<br />
          <br />
          To verify your new password follow the link below.<br />
          <br />
          Hurry up! Your activation link expires in 6 hours!<br />
          <br />
          <strong style="font-weight: 700">If you haven't requested password change, DO NOT follow the link and <a href="https://Chatterly.herokuapp.com/en/contact-us">contact us</a>!</strong
          ><br />
      `;
      break;
    default:
      return;
  }

  return `
  <table
        style="border-spacing: 0; color: #333533; font-family: 'Open Sans', Arial, sans-serif; width: 100%"
        cellspacing="0"
        cellpadding="0"
        border="0"
        bgcolor="#EBEBEB"
        width="100%"
      >
        <tbody>
          <tr>
            <td valign="top" align="center">
              <div style="max-width: 600px">
                <table
                  style="
                    color: #333533;
                    font-family: 'Open Sans', Arial, sans-serif;
                    border-spacing: 0;
                    margin: 0 auto;
                    max-width: 600px;
                    width: 100%;
                  "
                  align="center"
                  width="100%"
                >
                  <tbody>
                    <tr>
                      <td style="padding: 0">
                        <table
                          width="100%"
                          cellspacing="0"
                          cellpadding="0"
                          border="0"
                          style="border-spacing: 0; color: #333533; font-family: 'Open Sans', Arial, sans-serif"
                        >
                          <tbody>
                            <tr>
                              <td style="padding: 15px 0" align="center">
                                <a href="\`${verificationLink}\`" target="_blank"
                                  ><img
                                    style="display: inline-block; border: 0 !important; outline: none !important"
                                    alt="Logo"
                                    width="90"
                                    height="46"
                                    border="0"
                                    src="https://res.cloudinary.com/gachi322/image/upload/v1628539170/Chatterly/logo_tvuvuw.svg"
                                /></a>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        <table
                          width="100%"
                          cellspacing="0"
                          cellpadding="0"
                          border="0"
                          style="border-spacing: 0; color: #333533; font-family: 'Open Sans', Arial, sans-serif"
                        >
                          <tbody>
                            <tr>
                              <td valign="top">
                                <table
                                  width="100%"
                                  cellspacing="0"
                                  cellpadding="0"
                                  border="0"
                                  bgcolor="#FFFFFF"
                                  style="border-spacing: 0; color: #333533; font-family: 'Open Sans', Arial, sans-serif"
                                >
                                  <tbody>
                                    <tr>
                                      <td width="40"></td>
                                      <td valign="top">
                                        <table
                                          style="border-spacing: 0; color: #333533; font-family: 'Open Sans', Arial, sans-serif; width: 520px"
                                          cellspacing="0"
                                          cellpadding="0"
                                          border="0"
                                          width="520"
                                        >
                                          <tbody>
                                            <tr>
                                              <td height="30" style="height: 30px; font-size: 0"></td>
                                            </tr>
                                            <tr>
                                            <td
                                              style="
                                              font-family: Arial, Helvetica, sans-serif;
                                              color: #676b78;
                                              font-size: 16px;
                                              font-weight: 400;
                                              line-height: 24px;
                                              text-align: justify;
                                              ">
                                              ${mainTdBlock}
                                              </td>
                                            </tr>
                                            <tr>
                                              <td height="30" style="height: 30px; font-size: 0"></td>
                                            </tr>
                                            <tr>
                                              <td valign="top" align="center">
                                                <table
                                                  style="
                                                    border-spacing: 0;
                                                    color: #333533;
                                                    font-family: 'Open Sans', Arial, sans-serif;
                                                    width: 260px;
                                                  "
                                                  width="260"
                                                  cellspacing="0"
                                                  cellpadding="0"
                                                  border="0"
                                                  align="center"
                                                >
                                                  <tbody>
                                                    <tr>
                                                      <td
                                                        style="
                                                          font-family: Arial, Helvetica, sans-serif;
                                                          font-size: 14px;
                                                          color: #ffffff;
                                                          border-radius: 25px;
                                                          font-weight: 600;
                                                        "
                                                        valign="middle"
                                                        height="45"
                                                        bgcolor="#7400B8"
                                                        align="center"
                                                      >
                                                        <a
                                                          style="
                                                            color: #ffffff;
                                                            text-transform: uppercase;
                                                            text-decoration: none;
                                                            display: block;
                                                            line-height: 45px;
                                                          "
                                                          href="\`${verificationLink}\`"
                                                          target="_blank"
                                                          >${linkText}</a
                                                        >
                                                      </td>
                                                    </tr>
                                                  </tbody>
                                                </table>
                                              </td>
                                            </tr>
                                            <tr>
                                              <td height="40" style="height: 40px; font-size: 0"></td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </td>
                                      <td width="40"></td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        <table
                          width="100%"
                          cellspacing="0"
                          cellpadding="0"
                          border="0"
                          bgcolor="#515d6b"
                          style="border-spacing: 0; color: #333533; font-family: 'Open Sans', Arial, sans-serif"
                        >
                          <tbody>
                            <tr>
                              <td width="40"></td>
                              <td valign="top">
                                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                  <tbody>
                                    <tr>
                                      <td height="10" style="height: 10px; font-size: 0px"></td>
                                    </tr>
                                    <tr>
                                      <td
                                        align="center"
                                        style="
                                          color: #ffffff;
                                          font-size: 11px;
                                          line-height: 16px;
                                          font-weight: 400;
                                          font-family: Arial, Helvetica, sans-serif;
                                        "
                                      >
                                        This message was produced and distributed by Chatterly LLC, Bohdan Khmelnytsky street 17/52а , Kiyv 01030
                                      </td>
                                    </tr>
                                    <tr>
                                      <td height="5" style="height: 5px; font-size: 0px"></td>
                                    </tr>
                                    <tr>
                                      <td
                                        align="center"
                                        style="
                                          color: #ffffff;
                                          font-size: 11px;
                                          line-height: 16px;
                                          font-weight: 400;
                                          font-family: Arial, Helvetica, sans-serif;
                                        "
                                      >
                                        ©2021, Works Limited
                                      </td>
                                    </tr>
                                    <tr>
                                      <td height="20" style="height: 20px; font-size: 0px"></td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                              <td width="40"></td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </td>
          </tr>
        </tbody>
        <tr>
          <td height="40" style="height: 40px; font-size: 0px"></td>
        </tr>
      </table>
  `;
};
