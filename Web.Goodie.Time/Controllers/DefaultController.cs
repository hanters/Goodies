using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Web.Goodie.Time.Models;

namespace Web.Goodie.Time.Controllers
{
    public class DefaultController : Controller
    {
        // GET: Default

        private frootyacai_siteEntities db = new frootyacai_siteEntities();

        public ActionResult Index()
        {
            var result = (from a in db.td_brands where a.id_brands != 1 && a.fl_active == "1"   select a).ToList();
            return View(result);
        }
    }
}