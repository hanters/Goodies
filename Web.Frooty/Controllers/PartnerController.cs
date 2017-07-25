using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Configuration;
using Web.Frooty.Models;
using Web.Frooty.Util;
using Web.Frooty.Util;
using System.Text;
namespace Web.Frooty.Controllers
{
    public class PartnerController : Controller
    {
        //
        // GET: /Partner/

        public ActionResult Index()
        {
            frootyacai_siteEntities db = new frootyacai_siteEntities();
            var result = (from a in db.tb_business select a).ToList();

            var Country = (from a in db.tb_country where a.fl_active == "1" select new { a.id_country, a.ds_name }).ToArray();
            ViewData["id_country"] = new SelectList(Country, "id_country", "ds_name");

            return View(result);
        }

        [HttpPost]
        [ValidateInput(false)]
        public JsonResult CadPartners(tb_partners dados)
        {
            try
            {
                frootyacai_siteEntities db = new frootyacai_siteEntities();

                var email = dados.email.ToUpper();

                var Result = (from a in db.tb_partners where a.email.ToUpper() == email select a).FirstOrDefault();

                string pathForSaving = Server.MapPath("~/Views/Email/EmailNovoPartner.txt");

                string text = System.IO.File.ReadAllText(pathForSaving, Encoding.Default);

                if (Result == null)
                {
                    dados.password = Security.Encrypt(dados.password);
                    dados.id_statusPartners = 2;
                    dados.ts_user_cadm = DateTime.Now;
                    dados.ts_user_manu = DateTime.Now;

                    db.tb_partners.Add(dados);
                    db.SaveChanges();


                    Response.Cookies.Add(new HttpCookie("acai-user", Security.Encrypt(dados.id_partners.ToString())));

                    
                    var statusEmail = Email.Send(dados.name, dados.email, "Welcome Frooty Açai", text.Replace("%NAME%", dados.name).Replace("%LASTNAME%", dados.lastname).Replace("%ImagemHeadEmail%", WebConfigurationManager.AppSettings["ImagemHeadEmail"]).Replace("%ImagemFooterEmail%", WebConfigurationManager.AppSettings["ImagemFooterEmail"]));

                    if (statusEmail == "Y")
                    {
                        return base.Json(new { success = true, msg = "Your new password has been sent to your email" }, 0);
                    }
                    
                    return Json(new { success = true, id = dados.id_statusPartners }, JsonRequestBehavior.AllowGet);

                }
                else
                {
                    return Json(new { success = false, msg = "Existing Partners" }, JsonRequestBehavior.AllowGet);
                }

               
                
            }
            catch
            {
                return Json(new { success = false,msg = "Try later" }, JsonRequestBehavior.AllowGet);
            }

        }

        [HttpPost]
        public JsonResult listState(int id_country)
        {
            try
            {
                frootyacai_siteEntities db = new frootyacai_siteEntities();

                var result = (from a in db.tb_states where a.fl_active == "1" && a.id_country == id_country select new { a.id_state, a.ds_name }).ToArray();

                return Json(new { result }, JsonRequestBehavior.AllowGet);
            }
            catch
            {
                return Json(new { result = false }, JsonRequestBehavior.AllowGet);
            }

        }

    }
}
