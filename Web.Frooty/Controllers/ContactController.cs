using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Net.Mail;
using System.Web.Mvc;
using Web.Frooty.Class;

namespace Web.Frooty.Controllers
{
    public class ContactController : Controller
    {
        //
        // GET: /Contact/

        public ActionResult Index()
        {
            return View();
        }

        public JsonResult Send(email dados)
        {
            try
            {
                MailMessage mail = new MailMessage();
                SmtpClient SmtpServer = new SmtpClient(System.Configuration.ConfigurationManager.AppSettings["SMTP_HOST"]);
                mail.From = new MailAddress(dados.emailcontact, System.Configuration.ConfigurationManager.AppSettings["SMTP_USERNAME"]);

                mail.To.Add(new MailAddress(System.Configuration.ConfigurationManager.AppSettings["SMTP_USER"], dados.namecontact + " " + dados.lastname));
                //mail.ReplyToList.Add(new MailAddress(replyTo));
                mail.Subject = "Contact";
                mail.Body = "Name: " + dados.namecontact + " " + dados.lastname +"<br>E-mail: " + dados.emailcontact + "<br> Phone:" + dados.Phone + "<br>" + dados.message;
                mail.IsBodyHtml = true;

                // add here the bcc
                //string[] bccs = System.Configuration.ConfigurationManager.AppSettings["SMTP_BCC"].Split(',');
                //for (int i = 0; i < bccs.Length; i++)
                //{
                //    mail.Bcc.Add(new MailAddress(bccs[i].Trim()));
                //}

                SmtpServer.Port = int.Parse(System.Configuration.ConfigurationManager.AppSettings["SMTP_PORT"]);
                //SmtpServer.Credentials = new System.Net.NetworkCredential(System.Configuration.ConfigurationManager.AppSettings["SMTP_USER"], System.Configuration.ConfigurationManager.AppSettings["SMTP_PASS"]);
                //SmtpServer.EnableSsl = true;

                SmtpServer.Send(mail);

                return Json(new { success = true }, JsonRequestBehavior.AllowGet);       
            }
            catch (Exception e)
            {
                return Json(new { success = false, msg = e.Message }, JsonRequestBehavior.AllowGet);
            }
        }

    }
}
