using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Configuration;
using Web.Goodie.Time.Util;
using Web.Goodie.Time.Models;

namespace Web.Goodie.Time.Controllers
{
    public class ShopController : Controller
    {
        private frootyacai_siteEntities db = new frootyacai_siteEntities();

        // GET: Shop
        public ActionResult Index(string id)
        {
            var result = (from a in db.td_brands where a.id_brands != 1 && a.fl_active == "1" && a.url == id select a).ToList();
            return View(result);      
        }
    }
}