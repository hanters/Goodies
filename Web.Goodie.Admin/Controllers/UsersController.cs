using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Mvc;
using Web.Frooty.Admin.Models;
using Web.Frooty.Admin.Util;

namespace Web.Frooty.Admin.Controllers
{
    public class UsersController : WebPageBase
    {
        //
        // GET: /Users/

        public ActionResult Index()
        {
            frootyacai_siteEntities db = new frootyacai_siteEntities();

            var result = (from a in db.tb_typeUser select new { a.id_typeUser, a.typeUser}).ToList();
            ViewData["typeUser"] = new SelectList(result, "id_typeUser", "typeUser");

            return View();
        }

        [HttpPost]
        public JsonResult SelectUsers()
        {
            try
            {
                frootyacai_siteEntities db = new frootyacai_siteEntities();

                var result = (from a in db.tb_login
                              join b in db.tb_typeUser on a.id_typeUser equals b.id_typeUser
                              select new
                              {
                                  a.id_login,
                                  a.name,
                                  b.typeUser,
                                  a.email,
                                  a.active,
                              }).OrderByDescending(a => a.id_login).ToList();

                return Json(new { result }, JsonRequestBehavior.AllowGet);
            }
            catch
            {
                return Json(new { result = false }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public JsonResult editUsers(tb_login dados)
        {
            try
            {
                frootyacai_siteEntities db = new frootyacai_siteEntities();

                var result = (from a in db.tb_login
                              where a.id_login == dados.id_login

                              select new
                              {
                                  a.id_login,
                                  a.name,
                                  a.email,
                                  a.id_typeUser,
                                  a.active,
                              }).FirstOrDefault();

                return Json(new { result }, JsonRequestBehavior.AllowGet);
            }
            catch
            {
                return Json(new { result = false }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        [ValidateInput(false)]
        public JsonResult CadUsers(tb_login dados)
        {
            try
            {
                frootyacai_siteEntities db = new frootyacai_siteEntities();

                dados.password = SessaoUtil.Md5Hash(dados.password);
                dados.active = true;
                db.tb_login.Add(dados);
                db.SaveChanges();

                return Json(new { success = true }, JsonRequestBehavior.AllowGet);
            }
            catch
            {
                return Json(new { success = false }, JsonRequestBehavior.AllowGet);
            }

        }

        [HttpPost]
        [ValidateInput(false)]
        public JsonResult upDateUsers(tb_login dados)
        {
            try
            {
                frootyacai_siteEntities db = new frootyacai_siteEntities();

                var result = db.tb_login.Where(a => a.id_login == dados.id_login).FirstOrDefault();

                result.name = dados.name;
                result.email = dados.email;
                result.password = SessaoUtil.Md5Hash(dados.password);
                result.active = dados.active;
                result.id_typeUser = dados.id_typeUser;
                
                db.SaveChanges();

                return Json(new { success = true }, JsonRequestBehavior.AllowGet);
            }
            catch
            {
                return Json(new { success = false }, JsonRequestBehavior.AllowGet);
            }
        }

       
    }
}
