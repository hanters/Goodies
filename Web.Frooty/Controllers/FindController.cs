using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Web.Frooty.Models;

namespace Web.Frooty.Controllers
{
    public class FindController : Controller
    {
        //
        // GET: /Find/

        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public JsonResult ListAddress()
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
                                  a.city,
                                  a.state,
                                  a.zipCode,
                              }).OrderByDescending(a => a.id_location).ToList();

                return Json(new { result }, JsonRequestBehavior.AllowGet);
            }
            catch
            {
                return Json(new { result = false }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public JsonResult Address(string state, string city)
        {

            city = city.Replace("County", "").Trim().ToUpper();

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
                                  a.city,
                                  a.state,
                                  a.zipCode,
                                  a.active
                              }).Where(x=> x.city.ToUpper() == city && x.state == state).OrderByDescending(a => a.id_location).ToList();

                return Json(new { result }, JsonRequestBehavior.AllowGet);
            }
             catch
            {
                return Json(new { result = false }, JsonRequestBehavior.AllowGet);
            }
        }

    }
}
