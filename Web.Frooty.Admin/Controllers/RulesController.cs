using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Web.Frooty.Admin.Models;
using Web.Frooty.Admin.Util;

namespace Web.Frooty.Admin.Controllers
{
    public class RulesController : WebPageBase
    {
        private frootyacai_siteEntities db = new frootyacai_siteEntities();

        public ActionResult Index()
        {
            return View();
        }


        public ActionResult Rules()
        {
            return View();
        }

        public JsonResult addRules(tb_roles_products dados) {

            try
            {
                var id_products = dados.id_products;

                var result = (from a in db.tb_roles_products where a.id_products == id_products select a).FirstOrDefault();


                if (result == null)
                {

                    dados.id_status = 1;
                    dados.id_user_cadm = Convert.ToInt32(SessaoUtil.Recuperar("id_login"));
                    dados.ts_user_cadm = DateTime.Now;
                    dados.id_user_manu = Convert.ToInt32(SessaoUtil.Recuperar("id_login"));
                    dados.ts_user_manu = DateTime.Now;

                    db.tb_roles_products.Add(dados);
                    db.SaveChanges();

                    return Json(new { success = true }, JsonRequestBehavior.AllowGet);
                }
                else {

                    return Json(new { success = false, msg = "A rule already exists for this product" }, JsonRequestBehavior.AllowGet);
                
                }

               
            }
            catch(Exception e) {
                return Json(new { success = false, msg = e.Message }, JsonRequestBehavior.AllowGet);
            }   
        }

        public JsonResult updateRules(tb_roles_products dados)
        {

            var id_role = dados.id_role;

            try
            {
                var result = (from a in db.tb_roles_products where a.id_role == id_role select a).FirstOrDefault();

                if (result != null)
                {

                    result.weight_bronze = dados.weight_bronze;
                    result.price_bronze = dados.price_bronze;
                    result.weight_silver = dados.weight_silver;
                    result.price_silver = dados.price_silver;
                    result.weigth_gold = dados.weigth_gold;
                    result.price_gold = dados.price_gold;
                    result.id_status = dados.id_status;
                    result.id_user_manu = Convert.ToInt32(SessaoUtil.Recuperar("id_login"));
                    result.ts_user_manu = DateTime.Now;

                    db.SaveChanges();

                    return Json(new { success = true }, JsonRequestBehavior.AllowGet);
                }
                else {

                    return Json(new { success = false, msg = "Not fond." }, JsonRequestBehavior.AllowGet);
                
                }

            }
            catch (Exception ex) {

                return Json(new { success = false, msg = ex.Message }, JsonRequestBehavior.AllowGet);
            }



        }

        public JsonResult update(tb_rules dados)
        {
            try
            {
                var result = (from a in db.tb_rules where a.id_rules == 1 select a).FirstOrDefault();

                if (result != null)
                {

                    result.weight_bronze = dados.weight_bronze;
                    
                    result.weight_silver = dados.weight_silver;
                   
                    result.weigth_gold = dados.weigth_gold;

                    result.fl_active = dados.fl_active;

                    result.id_user_manu = Convert.ToInt32(SessaoUtil.Recuperar("id_login"));
                    result.ts_user_manu = DateTime.Now;

                    db.SaveChanges();

                    return Json(new { success = true }, JsonRequestBehavior.AllowGet);
                }
                else
                {

                    return Json(new { success = false, msg = "Not fond." }, JsonRequestBehavior.AllowGet);

                }

            }
            catch (Exception ex)
            {

                return Json(new { success = false, msg = ex.Message }, JsonRequestBehavior.AllowGet);
            }



        }

        public JsonResult Discard(int id_role) {

            try
            {
                db.Database.ExecuteSqlCommand("Delete from tb_roles_products where id_role = "+ id_role.ToString() +" ");
                db.SaveChanges();

                return Json(new { success = true }, JsonRequestBehavior.AllowGet);
            }
            catch(Exception ex) {

                return Json(new { success = false, msg = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        
        }

        public JsonResult ListRules() {

            try
            {

                var result = (from a in db.tb_roles_products
                              join b in db.td_Products on  a.id_products equals b.id_products
                              join c in db.tb_status_roles on a.id_status equals c.id_status
                              select new
                              {
                                  a.id_role,
                                  b.name,
                                  a.price_bronze,
                                  a.price_silver,
                                  a.price_gold,
                                  a.ts_user_cadm,
                                  c.description
                              }).ToList();
                
                
                return Json(new { success = true, result}, JsonRequestBehavior.AllowGet);

            }
            catch (Exception ex) {

                return Json(new { success = false, msg = ex.Message }, JsonRequestBehavior.AllowGet);
            
            }
        
        }


        public JsonResult ListRules2()
        {

            try
            {

                var result = (from a in db.tb_rules
                              select new
                              {
                                  a.id_rules,
                                  a.weight_bronze,
                                  a.weight_silver,
                                  a.weigth_gold,
                                  a.fl_active,

                              }).ToList();


                return Json(new { success = true, result }, JsonRequestBehavior.AllowGet);

            }
            catch (Exception ex)
            {

                return Json(new { success = false, msg = ex.Message }, JsonRequestBehavior.AllowGet);

            }

        }


        public JsonResult searchRules(int id_role)
        {

            try
            {

                var result = (from a in db.tb_roles_products
                              where a.id_role == id_role
                              select new
                              {
                                  a.id_role,
                                  a.id_products,
                                  a.id_status,
                                  a.weight_bronze,
                                  a.price_bronze,
                                  a.weight_silver,
                                  a.price_silver,
                                  a.weigth_gold,
                                  a.price_gold,
                                  a.ts_user_cadm
                              }).ToList();


                return Json(new { success = true, result }, JsonRequestBehavior.AllowGet);

            }
            catch (Exception ex)
            {

                return Json(new { success = false, msg = ex.Message }, JsonRequestBehavior.AllowGet);

            }
        
        }

        public JsonResult listProduct() {

            try {

                var result = (from a in db.td_Products where a.id_status == 2  && a.fl_active == "1" select new { 
                
                    a.id_products,
                    a.name,
                    a.flavour
                    
                }).ToList();

                return Json(new { success = true, result }, JsonRequestBehavior.AllowGet);
            
            }catch{

                return Json(new { success = false}, JsonRequestBehavior.AllowGet);
            }
        
        }


        public JsonResult listStatus()
        {

            try
            {

                var result = (from a in db.tb_status_roles
                              select new
                              {

                                  a.id_status,
                                  a.description,

                              }).ToList();

                return Json(new { success = true, result }, JsonRequestBehavior.AllowGet);

            }
            catch
            {

                return Json(new { success = false }, JsonRequestBehavior.AllowGet);
            }



        }


    }
}
