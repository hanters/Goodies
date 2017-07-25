using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Web.Frooty.Admin.Models;
using Web.Frooty.Admin.Util;
using System.Web.Mvc;

namespace Web.Frooty.Admin.Controllers
{
    public class LoginController : Controller
    {
        public ActionResult Index()
        {
            SessaoUtil.Limpar();
            SessaoUtil.Limpar("id_login");
            SessaoUtil.Limpar("name");
            return View();
        }

        public JsonResult Login(tb_login dados)
        {
            var senha = SessaoUtil.Md5Hash(dados.password);

            try
            {
                frootyacai_siteEntities db = new frootyacai_siteEntities();
                var result = (from a in db.tb_login where a.email == dados.email && a.password == senha && a.active == true select a).FirstOrDefault();

                if (result != null)
                {
                    SessaoUtil.SalvarUsuario(result.id_login);
                    SessaoUtil.SalvarSession("id_login", result.id_login.ToString());
                    SessaoUtil.SalvarSession("name", result.name);

                    return Json(new { success = true }, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    return Json(new { success = false }, JsonRequestBehavior.AllowGet);
                }          
            }
            catch(Exception ex) {

                return Json(new { success = false }, JsonRequestBehavior.AllowGet);
            }

           
        }

    }
}
