using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Web.Frooty.Admin.Models;
using Web.Frooty.Admin.Util;

namespace Web.Frooty.Admin.Controllers
{
    public class DefaultController : WebPageBase
    {
        //
        // GET: /Default/

        public ActionResult Index()
        {
            frootyacai_siteEntities db = new frootyacai_siteEntities();
            var result = (from a in db.tb_business select a).ToList();

            var statusPartners = (from c in db.tb_statusPartners select c).ToList();
            ViewData["id_statusPartners"] = new SelectList(statusPartners, "id_statusPartners", "statusPartners");

            var result_ = (from a in db.tb_status_shop select new { a.id_status, a.description }).ToList();
            ViewData["id_status"] = new SelectList(result_, "id_status", "description");

            var Country = (from a in db.tb_country where a.fl_active == "1" select new { a.id_country, a.ds_name }).ToArray();
            ViewData["id_country"] = new SelectList(Country, "id_country", "ds_name");

            return View(result);
        }

        public JsonResult Count()
        {
            try
            {
                 frootyacai_siteEntities db = new frootyacai_siteEntities();
                 Counts count = new Counts();
                 
                 var TotalPosts = (from a in db.tb_newPost select a).ToList().Count;
                 var TotalEvents = (from a in db.tb_events select a).ToList().Count;
                 var TotalRecipes = (from a in db.tb_recipes select a).ToList().Count;

                 count.TotalPost = TotalPosts;
                 count.TotalEvents = TotalEvents;
                 count.TotalRecipes = TotalRecipes;

                 return Json(new { result = count }, JsonRequestBehavior.AllowGet);              
            }
            catch(Exception ex)
            {
                return Json(new { result = ex.ToString()}, JsonRequestBehavior.AllowGet);
            }
            
        }

    }
}
