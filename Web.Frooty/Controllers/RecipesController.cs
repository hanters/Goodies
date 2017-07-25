using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Web.Frooty.Models;
using System.Web.Configuration;

namespace Web.Frooty.Controllers
{
    public class RecipesController : Controller
    {
        //
        // GET: /Recipes/

        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Page(string id)
        {
            ViewBag.name = id;
            return View();
        }

        public JsonResult Recipes(int page)
        {
            frootyacai_siteEntities db =new frootyacai_siteEntities();

            var result = (from a in db.tb_recipes where a.id_status == 3 select new { a.id_recipes,a.image,a.title,a.url}).OrderByDescending(a => a.id_recipes).ToList();

            if (result != null)
            {
               result = result.Skip((page-1) * 8).Take(8).ToList();
            }

            return Json(new { result, path = WebConfigurationManager.AppSettings["Recipes"] }, JsonRequestBehavior.AllowGet);
        }

    }
}
