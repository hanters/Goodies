using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Net.Mail;
using System.Security.Cryptography;

namespace Web.Frooty.Util
{
    public sealed class Email
    {
        static public string Send(string toName, string toEmail, string subject, string content)
        {
            try
            {
                MailMessage mail = new MailMessage();
                SmtpClient SmtpServer = new SmtpClient(System.Configuration.ConfigurationManager.AppSettings["SMTP_HOST"]);
                mail.From = new MailAddress(System.Configuration.ConfigurationManager.AppSettings["SMTP_USER"], System.Configuration.ConfigurationManager.AppSettings["SMTP_USERNAME"]);

                mail.To.Add(new MailAddress(toEmail, toName));
                mail.Subject = subject;
                mail.Body = content;
                mail.IsBodyHtml = true;

                //add here the bcc
                string[] bccs = System.Configuration.ConfigurationManager.AppSettings["SMTP_BCC"].Split(',');
                for (int i = 0; i < bccs.Length; i++)
                {
                    mail.Bcc.Add(new MailAddress(bccs[i].Trim()));
                }

                SmtpServer.Port = int.Parse(System.Configuration.ConfigurationManager.AppSettings["SMTP_PORT"]);
                SmtpServer.Credentials = new System.Net.NetworkCredential(System.Configuration.ConfigurationManager.AppSettings["SMTP_USER"], System.Configuration.ConfigurationManager.AppSettings["SMTP_PASS"]);
                //SmtpServer.EnableSsl = true;

                SmtpServer.Send(mail);
 
                return "Y";
            }
            catch (Exception ex)
            {
                // Save log
             
                return "N";
            }
        }

        public static string MD5Hash(string text)
        {
            MD5 md5 = new MD5CryptoServiceProvider();

            //compute hash from the bytes of text
            md5.ComputeHash(ASCIIEncoding.ASCII.GetBytes(text));

            //get hash result after compute it
            byte[] result = md5.Hash;

            StringBuilder strBuilder = new StringBuilder();
            for (int i = 0; i < result.Length; i++)
            {
                //change it into 2 hexadecimal digits
                //for each byte
                strBuilder.Append(result[i].ToString("x2"));
            }

            return strBuilder.ToString();
        }
    }

    public class MailData
    {
        public string toName { get; set; }
        public string toEmail { get; set; }
        public string subject { get; set; }
        public string content { get; set; }
        public string error { get; set; }
    }
}
