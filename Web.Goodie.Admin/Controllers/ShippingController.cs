using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Web.Frooty.Admin.Models;
using Web.Frooty.Admin.Util;


namespace Web.Frooty.Admin.Controllers
{
    public class ShippingController : WebPageBase
    {
        private frootyacai_siteEntities db = new frootyacai_siteEntities();

        public ActionResult Index()
        {
            var Country = (from a in db.tb_country where a.fl_active == "1" select new { a.id_country, a.ds_name }).ToArray();
            ViewData["id_country"] = new SelectList(Country, "id_country", "ds_name");

            return View();
        }

        [HttpPost]
        public JsonResult listShipping()
        {
            try
            {
                frootyacai_siteEntities db = new frootyacai_siteEntities();

                var result = (from a in db.tb_shipping
                              select new { 
                                a.id_shipping,
                                a.ds_group,
                                a.price,
                                a.bronze_price,
                                a.silver_price,
                                a.gold_price,
                                a.fl_shipping

                              }).ToArray();

                return Json(new { result }, JsonRequestBehavior.AllowGet);
            }
            catch
            {
                return Json(new { result = false }, JsonRequestBehavior.AllowGet);
            }

        }

        [HttpPost]
        public JsonResult listState()
        {
            try
            {
                frootyacai_siteEntities db = new frootyacai_siteEntities();

                var result = (from a in db.tb_states 
                              join b in db.tb_country on  a.id_country equals b.id_country
                               where !
                                   (from c in db.tb_grupo_shipping select c.id_state).Contains(a.id_state) && a.fl_active == "1"
                              select new { a.id_state, a.ds_name, b.ds_codigo}).ToList();
                              

                return Json(new { result }, JsonRequestBehavior.AllowGet);
            }
            catch
            {
                return Json(new { result = false }, JsonRequestBehavior.AllowGet);
            }

        }

        [HttpPost]
        public JsonResult ListStates(int id_shipping)
        {
            try
            {
                frootyacai_siteEntities db = new frootyacai_siteEntities();

                var shipping = db.tb_grupo_shipping.Select(a => a.id_state).ToArray();

                var result = (from a in db.tb_states 
                              join b in db.tb_country on  a.id_country equals b.id_country
                              where !
                                   (from c in db.tb_grupo_shipping select c.id_state).Contains(a.id_state) && a.fl_active == "1"
                              select new { a.id_state, a.ds_name, b.ds_codigo}).ToList();


                var result2 = (from a in db.tb_grupo_shipping
                               join b in db.tb_states on a.id_state equals b.id_state
                               join c in db.tb_country on b.id_country equals c.id_country
                               where a.id_shipping == id_shipping
                               select new
                               {
                                   a.id_state,
                                   b.ds_name,
                                   c.ds_codigo
                               }).ToList();

                return Json(new { result, result2 }, JsonRequestBehavior.AllowGet);
            }
            catch
            {
                return Json(new { result = false }, JsonRequestBehavior.AllowGet);
            }

        }

        [HttpPost]
        public JsonResult addShipping(tb_shipping dados, List<tb_grupo_shipping> dados2) {
            try
            {
                dados.id_user_cadm = Convert.ToInt32(SessaoUtil.Recuperar("id_login"));
                dados.ts_user_cadm = DateTime.Now;
                dados.id_user_manu = Convert.ToInt32(SessaoUtil.Recuperar("id_login"));
                dados.ts_user_manu = DateTime.Now;

                db.tb_shipping.Add(dados);
               

                if (dados2.Count > 0) {

                    for (int i = 0; i < dados2.Count; i++)
                    {
                        dados2[i].id_shipping = dados.id_shipping;
                        db.tb_grupo_shipping.Add(dados2[i]);
                        
                    }                        
                }

                db.SaveChanges();

                return Json(new { result = true }, JsonRequestBehavior.AllowGet);
            }
            catch(Exception ex) {

                return Json(new { result = false, msg = ex.Message }, JsonRequestBehavior.AllowGet);
            }

        }


        [HttpPost]
        public JsonResult EditShipping(int id_shipping)
        {
            try
            {
                frootyacai_siteEntities db = new frootyacai_siteEntities();

                var result = (from a in db.tb_shipping
                              where a.id_shipping == id_shipping
                              select new
                              {
                                  a.id_shipping,
                                  a.ds_group,
                                  a.price,
                                  a.bronze_price,
                                  a.silver_price,
                                  a.gold_price,
                                  a.fl_shipping

                              }).ToArray();

                return Json(new { result }, JsonRequestBehavior.AllowGet);
            }
            catch
            {
                return Json(new { result = false }, JsonRequestBehavior.AllowGet);
            }

        }

        [HttpPost]
        public JsonResult updateShipping(tb_shipping dados, List<tb_grupo_shipping> dados2)
        {
            try
            {
                var id_shipping = dados.id_shipping;
                var list = (from a in db.tb_shipping where a.id_shipping == id_shipping select a).FirstOrDefault();

                if (list != null)
                {
                    list.ds_group = dados.ds_group;
                    list.fl_shipping = dados.fl_shipping;
                    list.price = dados.price;
                    list.bronze_price = dados.bronze_price;
                    list.silver_price = dados.silver_price;
                    list.gold_price = dados.gold_price;
                    list.id_user_manu = Convert.ToInt32(SessaoUtil.Recuperar("id_login"));
                    list.ts_user_manu = DateTime.Now;
                }

            
                db.Database.ExecuteSqlCommand("Delete from tb_grupo_shipping where  id_shipping = " + id_shipping.ToString() + " ");

                if (dados2 != null) {

                    if (dados2.Count > 0)
                    {
                        for (int i = 0; i < dados2.Count; i++)
                        {
                            dados2[i].id_shipping = dados.id_shipping;
                            db.tb_grupo_shipping.Add(dados2[i]);
                        }
                    }
                
                }
                
                db.SaveChanges();

                return Json(new { result = true }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {

                return Json(new { result = false, msg = ex.Message }, JsonRequestBehavior.AllowGet);
            }

        }

        public JsonResult Discard(int id_shipping)
        {
            try
            {
                db.Database.ExecuteSqlCommand("Delete from tb_grupo_shipping where  id_shipping = " + id_shipping.ToString() + " ");
                db.SaveChanges();
                db.Database.ExecuteSqlCommand("Delete from tb_shipping where  id_shipping = " + id_shipping.ToString() + " ");
                db.SaveChanges();
                return Json(new { success = true }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {

                return Json(new { success = false, msg = ex.Message }, JsonRequestBehavior.AllowGet);
            }

        }


    }
}
