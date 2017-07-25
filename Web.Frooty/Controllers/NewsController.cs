using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Configuration;
using Web.Frooty.Models;

namespace Web.Frooty.Controllers
{
    public class NewsController : Controller
    {
        //
        // GET: /News/

        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Page(string id)
        {
            ViewBag.Nome = id;

            return View();
        }

        public JsonResult News(int page)
        {
            frootyacai_siteEntities db = new frootyacai_siteEntities();

            var result = (from a in db.tb_newPost select new { a.id_newPost, a.image, a.title, a.ts_user_cadm, a.url }).OrderByDescending(a => a.id_newPost).ToList();

            if (result != null)
            {
                result = result.Skip((page - 1) * 9).Take(9).ToList();
            }

            return Json(new { result, path = WebConfigurationManager.AppSettings["News"] }, JsonRequestBehavior.AllowGet);
        }

    }
}
