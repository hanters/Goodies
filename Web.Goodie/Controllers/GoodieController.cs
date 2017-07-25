using System;
using System.Collections.Generic;
using System.Text;
using System.Linq;
using System.Web;
using System.IO;
using System.Web.Mvc;
using System.Web.Configuration;
using Web.Goodie.Models;
using Web.Goodie.Util;

namespace Web.Goodie.Controllers
{
    public class GoodieController : Controller
    {
        // GET: Goodie
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult Login(string email, string password)
        {
            try
            {
                frootyacai_siteEntities db = new frootyacai_siteEntities();

                password = Security.Encrypt(password);

                var result = (from a in db.tb_partners where a.email == email && a.password == password && a.id_statusPartners == 2 select a).FirstOrDefault();

                if (result != null)
                {

                    if (result.changePassWord == "1")
                    {
                        return Json(new { success = 2 }, JsonRequestBehavior.AllowGet);
                    }
                    else
                    {


                        Response.Cookies.Add(new HttpCookie("goodie-user", Security.Encrypt(result.id_partners.ToString())));

                        var shop = (from a in db.tb_shop where a.id_partners == result.id_partners && a.id_status == 2 select a).FirstOrDefault();

                        if (shop != null)
                        {
                            Response.Cookies.Add(new HttpCookie("shop_goodie", Security.Encrypt(shop.id_shop.ToString())));
                        }

                        return Json(new { success = 1 }, JsonRequestBehavior.AllowGet);
                    }

                }
                else
                {

                    return Json(new { success = 3, msg = "Email or Password are incorrect" }, JsonRequestBehavior.AllowGet);
                }
            }
            catch
            {
                return Json(new { success = false, msg = "Pease, \n\n try later" }, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult logout()
        {
            try
            {

                var c = new HttpCookie("goodie-user");
                c.Expires = DateTime.Now.AddDays(-1);
                Response.Cookies.Add(c);

                var a = new HttpCookie("shop_goodie");
                a.Expires = DateTime.Now.AddDays(-1);
                Response.Cookies.Add(a);

                return Json(new { success = true }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { success = false, msg = "Pease, \n\n try later" }, JsonRequestBehavior.AllowGet);
            }

        }

        public JsonResult ForgotPassword(string email)
        {
            try
            {
                const string SenhaCaracteresValidos = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890@#&!?";
                frootyacai_siteEntities db = new frootyacai_siteEntities();

                tb_partners partners = (from a in db.tb_partners where a.email == email select a).FirstOrDefault();


                if (partners != null)
                {

                    string pathForSaving = Server.MapPath("~/Views/Email/EmailRecoveryPass.txt");

                    string text = System.IO.File.ReadAllText(pathForSaving);

                    int valormaximo = SenhaCaracteresValidos.Length;
                    Random random = new Random(DateTime.Now.Millisecond);
                    StringBuilder senha = new StringBuilder(6);
                    for (int indice = 0; indice < 6; indice++)
                    {
                        senha.Append(SenhaCaracteresValidos[random.Next(0, valormaximo)]);
                    }

                    partners.changePassWord = "1";
                    partners.password = Security.Encrypt(senha.ToString());
                    db.SaveChanges();

                    var statusEmail = Email.Send(partners.name, partners.email, "Referring Password", text.Replace("%NAME%", partners.name).Replace("%LASTNAME%", partners.lastname).Replace("%PASSWORD%", senha.ToString()).Replace("%ImagemHeadEmail%", WebConfigurationManager.AppSettings["ImagemHeadEmail"]).Replace("%ImagemFooterEmail%", WebConfigurationManager.AppSettings["ImagemFooterEmail"]));

                    if (statusEmail == "Y")
                    {
                        return base.Json(new { success = true, msg = "Your new password has been sent to your email" }, 0);
                    }
                    else
                    {
                        return base.Json(new { success = false, msg = "Try Later" }, 0);
                    }
                }
                else
                {
                    return base.Json(new { success = false, msg = "E-mail not fond" }, 0);
                }


            }
            catch
            {

                return base.Json(new { success = false, msg = "Try Later" }, 0);

            }

        }

        public JsonResult changePassword(string email, string password, string newPassword, string confPassword)
        {
            try
            {
                frootyacai_siteEntities db = new frootyacai_siteEntities();

                var varnewPassword = Security.Encrypt(newPassword);
                var varconfPassword = Security.Encrypt(confPassword);
                var varPassword = Security.Encrypt(password);

                if (varnewPassword == varconfPassword)
                {
                    var result = (from a in db.tb_partners where a.email == email && a.password == varPassword select a).FirstOrDefault();

                    if (result != null)
                    {
                        result.password = varnewPassword;
                        result.changePassWord = "0";
                        db.SaveChanges();

                        Response.Cookies.Add(new HttpCookie("goodie-user", Security.Encrypt(result.id_partners.ToString())));

                        var shop = (from a in db.tb_shop where a.id_partners == result.id_partners && a.id_status == 2 select a).FirstOrDefault();

                        if (shop != null)
                        {
                            Response.Cookies.Add(new HttpCookie("shop_goodie", Security.Encrypt(shop.id_shop.ToString())));
                        }

                        return base.Json(new { success = 1 }, 0);
                    }
                    else
                    {
                        return base.Json(new { success = 3, msg = "Email or Password are incorrect" }, 0);
                    }
                }
                else
                {

                    return base.Json(new { success = 3, msg = "Typed passwords are different!" }, 0);
                }


            }
            catch
            {

                return base.Json(new { success = 3l, msg = "Try Later" }, 0);
            }
        }
    }
}