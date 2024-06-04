import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

gmail_user = 'juicesshopp@gmail.com'
gmail_password = 'taspjdtkfrvghagx'

msg = MIMEMultipart()
msg['From'] = gmail_user
msg['To'] = '21110939@student.hcmute.edu.vn' 
msg['Subject'] = 'Thông báo quan trọng từ Juice Shop - Hỗ trợ dự án'

html_content = """
<html>
  <body>
    <h1>Kính gửi thành viên của cộng đồng Juice Shop!</h1>
    <h2>Chúng tôi xin gửi đến bạn một thông báo quan trọng từ dự án Juice Shop. Do tình hình tài chính hiện tại, chúng tôi đang cần sự hỗ trợ từ cộng đồng để duy trì và phát triển dự án của chúng tôi.</h2>
    <p>Để hỗ trợ chúng tôi, bạn có thể quyên góp bằng cách chuyển khoản Bitcoin bằng cách nhấn vào nút bên dưới. Mọi khoản quyên góp sẽ được sử dụng để cải thiện dự án và mang lại trải nghiệm tốt hơn cho cả cộng đồng.</p>
    <p>Các bạn vui lòng nhấn vào nút bên dưới để tiến hành quyên góp.</p>
    <a href="https://demo.owasp-juice.shop/redirect?to=https://blockchain.info/address/1AbKfgvw9psQ41NbLi8kufDQTezwG8DRZm" style="display: inline-block; background-color: #4CAF50; border: none; color: white; padding: 15px 32px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin: 4px 2px; cursor: pointer; border-radius: 8px;">Quyên góp</a>
    <h3>Trân trọng</h3>
    <h3>Ban quản trị Juice Shop</h3>
  </body>
</html>
"""

msg.attach(MIMEText(html_content, 'html'))

try:
    server = smtplib.SMTP('smtp.gmail.com', 587)
    server.starttls()
    server.login(gmail_user, gmail_password)
    server.sendmail(gmail_user, '21110939@student.hcmute.edu.vn', msg.as_string())
    server.close()

    print('Email đã được gửi thành công.')
except Exception as e:
    print('Không thể gửi email:', e)
