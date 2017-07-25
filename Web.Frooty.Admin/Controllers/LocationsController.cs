using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Web.Frooty.Admin.Models;
using Web.Frooty.Admin.Util;
namespace Web.Frooty.Admin.Controllers
{
    public class LocationsController : WebPageBase
    {
        //
        // GET: /Locations/

        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public JsonResult SelectLocations()
        {
            try
            {
                frootyacai_siteEntities db = new frootyacai_siteEntities();

                var result = (from a in db.tb_location
                              where a.active == true
                              select new
                              {
                                  a.id_location,
                                  a.name,
                                  a.address,
                                  a.company,
                                  a.city,
                                  a.state,
                                  a.ts_user_cadm,
                              }).OrderByDescending(a => a.id_location).ToList();

                return Json(new { result }, JsonRequestBehavior.AllowGet);
            }
            catch
            {
                return Json(new { result = false }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public JsonResult ListLocations()
        {
            try
            {
                frootyacai_siteEntities db = new frootyacai_siteEntities();

                var result = (from a in db.tb_location
                              select new
                              {
                                  a.id_location,
                                  a.name,
                                  a.lastname,
                                  a.company,
                                  a.city,
                                  a.state,
                                  a.ts_user_cadm,
                              }).OrderByDescending(a => a.id_location).ToList();

                return Json(new { result }, JsonRequestBehavior.AllowGet);
            }
            catch
            {
                return Json(new { result = false }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        [ValidateInput(false)]
        public JsonResult CadLocations(tb_location dados)
        {
            try
            {
                frootyacai_siteEntities db = new frootyacai_siteEntities();

                dados.active = true;
                dados.id_user_cadm = Convert.ToInt32(SessaoUtil.Recuperar("id_login"));
                dados.ts_user_cadm = DateTime.Now;
                dados.id_user_manu = Convert.ToInt32(SessaoUtil.Recuperar("id_login"));
                dados.ts_user_manu = DateTime.Now;

                db.tb_location.Add(dados);
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
        public JsonResult UpdateActicve(tb_location dados)
        {
            try
            {
                frootyacai_siteEntities db = new frootyacai_siteEntities();

                var result = (from a in db.tb_location where a.id_location == dados.id_location select a).First();

                result.active = false;
                result.id_user_manu = Convert.ToInt32(SessaoUtil.Recuperar("id_login"));
                result.ts_user_manu = DateTime.Now;

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
