using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Configuration;
using Web.Frooty.Models;

namespace Web.Frooty.Controllers
{
    public class EventsController : Controller
    {
        //
        // GET: /Events/

        public ActionResult Events()
        {
            return View();
        }


        public ActionResult Page(string id)
        {
            ViewBag.Nome = id;

            return View();
        }

        [HttpPost]
        public JsonResult Events(int page)
        {
            frootyacai_siteEntities db = new frootyacai_siteEntities();

            var result = (from a in db.tb_events select new { a.id_events, a.image, a.name, a.date, a.city, a.state, a.url }).OrderByDescending(a => a.id_events).ToList();

            if (result != null)
            {
                result = result.Skip((page - 1) * 9).Take(9).ToList();
            }

            return Json(new { result, path = WebConfigurationManager.AppSettings["Events"] }, JsonRequestBehavior.AllowGet);
        }

    }
}
