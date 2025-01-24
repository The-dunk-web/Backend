export const passwordResetTemplate = (link) =>
  `<!DOCTYPE html>
    <html dir="ltr" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="x-apple-disable-message-reformatting">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta content="telephone=no" name="format-detection">
        <title>Password Reset</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #fafafa;
            color: #333333;
          }
          a {
            text-decoration: none;
          }
          .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #030305;
            color: #ffffff;
          }
          .header, .footer {
            text-align: center;
            padding: 20px;
            background-color: #030305;
          }
          .header img {
            max-width: 400px;
          }
          .content {
            padding: 20px;
            text-align: center;
            background-color: #030305;
          }
          .button {
            display: inline-block;
            margin: 20px 0;
            padding: 10px 30px;
            border: 2px solid #a21a1a;
            background-color: transparent;
            color: #ffffff;
            text-transform: uppercase;
            font-size: 14px;
            font-weight: bold;
            border-radius: 0;
          }
          .button:hover {
            background-color: #a21a1a;
            color: #ffffff;
          }
          .footer p {
            font-size: 14px;
            margin: 5px 0;
            color: #ffffff;
          }
          .menu {
            display: flex;
            justify-content: center; /* Ensures the menu items are centered */
            padding: 10px 0;
            width: 100%;
          }
          .menu a {
            color: #ffffff;
            margin: 0 15px; /* Spacing between the menu items */
            font-size: 14px;
            border-left: 1px solid #cccccc;
            padding-left: 10px;
          }
          .menu a:first-child {
            border-left: none;
            padding-left: 0;
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header">
            <img src="https://fnuiabv.stripocdn.email/content/guids/CABINET_7c1e39463166ce675f977d7b0a30564ad7e8a5486368dad1b0d01cea8301734c/images/depositphotos_515404718stockillustrationpasswordloginiconoutlinevector_1.png" alt="Logo">
          </div>
          <div class="content">
            <a href="${link}" target="_blank" class="button">Reset Your Password</a>
            <h3>This link is valid for one use only. Expires in 1 hour.</h3>
            <p style="color: #dc2626;">If you didn't request a password reset, then somebody else has your account.</p>
          </div>
          <div class="footer">
            <p>© 2025 The Dunk Web. All rights reserved.</p>
            <div class="menu">
              <a href="https://example.com" target="_blank">Visit Us</a>
              <a href="https://example.com/privacy" target="_blank">Privacy Policy</a>
              <a href="#" target="_blank">Contact Us</a>
            </div>
          </div>
        </div>
      </body>
    </html>`;
