using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Web.Frooty.Admin.Models;
using Web.Frooty.Admin.Util;

namespace Web.Frooty.Admin.Controllers
{
    public class ShopController : WebPageBase
    {
        private frootyacai_siteEntities db = new frootyacai_siteEntities();

        public ActionResult Index()
        {
            var result = (from a in db.tb_status_shop select new { a.id_status, a.description }).ToList();
           
            return View(result);
        }

        public JsonResult listShop() {

            try {

                var result = (from a in db.tb_shop 
                              join b in db.tb_status_shop on a.id_status equals b.id_status
                              join c in db.tb_partners on a.id_partners equals c.id_partners
                              select new {
                                a.id_shop,
                                c.id_partners,
                                c.email,
                                a.date,
                                b.id_status,
                                b.description,
                                a.total,
                                a.discount_total
                              }).ToList();

                return Json(new { success = true, result }, JsonRequestBehavior.AllowGet);
            }
            catch(Exception ex)
            {
                return Json(new { success = false, msg = "Try Later" }, JsonRequestBehavior.AllowGet);

            }
        
        }

        public JsonResult listShopId(int id_partners)
        {

            try
            {

                var result = (from a in db.tb_shop
                              join b in db.tb_status_shop on a.id_status equals b.id_status
                              join c in db.tb_partners on a.id_partners equals c.id_partners
                              where c.id_partners == id_partners
                              select new
                              {
                                  a.id_shop,
                                  c.id_partners,
                                  c.email,
                                  a.date,
                                  b.id_status,
                                  b.description,
                                  a.total,
                                  a.discount_total
                              }).ToList();

                return Json(new { success = true, result }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { success = false, msg = "Try Later" }, JsonRequestBehavior.AllowGet);

            }

        }

        public JsonResult EditShop(int shop, int partners)
        {
            try
            {
                decimal? priceShipping = null;
                tb_shipping shipping = null;
                tb_shop OBJresult = null;

                var obj = (from a in db.td_itens_shop 
                              join b in db.td_Products on  a.id_products equals b.id_products
                              where a.id_shop == shop select new{
                                a.id_itens,
                                b.id_products,
                                b.name,
                                b.flavour,
                                a.amount,
                                b.weight,
                                b.price,
                                a.total,
                                a.discount_total,
                                a.unit_price_rules,
                                a.rules,
                                a.weight_total
                             }).ToList();

                var totalWeight = obj.Sum(a => a.weight_total).Value;
                var valortotal = obj.Sum(a => a.total).Value;
                OBJresult = (from a in db.tb_shop where a.id_shop == shop select a).FirstOrDefault();


                if (obj.Count > 0)
                {

                    if (OBJresult != null)
                    {

                        var objResult = (from a in db.tb_partners where a.id_partners == partners select a).FirstOrDefault();

                        if (objResult != null)
                        {
                            var id_state = objResult.id_state;

                            shipping = (from a in db.tb_shipping
                                        join b in db.tb_grupo_shipping on a.id_shipping equals b.id_shipping
                                        where b.id_state == id_state
                                        select a).FirstOrDefault();

                            if (shipping != null)
                            {
                                if (OBJresult.id_status == 2)
                                {

                                    var rules = db.tb_rules.Select(a => new
                                    {
                                        a.weight_bronze,
                                        a.weight_silver,
                                        a.weigth_gold,
                                        a.fl_active

                                    }).FirstOrDefault();

                                    var existeRegras = false;
                                    priceShipping = shipping.price;

                                    if (rules != null)
                                    {

                                        if (rules.fl_active == "S")
                                        {

                                            for (int i = 0; i < obj.Count; i++)
                                            {

                                                var id_products = obj[i].id_products;

                                                var rules_products = (from a in db.tb_roles_products
                                                                      join b in db.td_Products on a.id_products equals b.id_products
                                                                      where a.id_products == id_products && a.id_status == 1
                                                                      select new
                                                                      {
                                                                          a.price_bronze,
                                                                          a.price_silver,
                                                                          a.price_gold,
                                                                          b.weight
                                                                      }).FirstOrDefault();

                                                if (rules_products != null)
                                                {

                                                    var id_itens = obj[i].id_itens;
                                                    var td_itens_shop = (from a in db.td_itens_shop where a.id_itens == id_itens select a).FirstOrDefault();
                                                    var regras = false;

                                                    if (totalWeight >= rules.weight_bronze)
                                                    {
                                                        td_itens_shop.discount_total = rules_products.price_bronze * obj[i].amount;
                                                        td_itens_shop.unit_price_rules = rules_products.price_bronze;
                                                        td_itens_shop.rules = "Bronze";
                                                        priceShipping = shipping.bronze_price;
                                                        regras = true;
                                                        existeRegras = true;

                                                    }

                                                    if (totalWeight >= rules.weight_silver)
                                                    {
                                                        td_itens_shop.discount_total = rules_products.price_silver * obj[i].amount;
                                                        td_itens_shop.unit_price_rules = rules_products.price_silver;
                                                        td_itens_shop.rules = "Silver";
                                                        priceShipping = shipping.silver_price;
                                                        regras = true;
                                                        existeRegras = true;

                                                    }

                                                    if (totalWeight >= rules.weigth_gold)
                                                    {
                                                        td_itens_shop.discount_total = rules_products.price_gold * obj[i].amount;
                                                        td_itens_shop.unit_price_rules = rules_products.price_gold;
                                                        td_itens_shop.rules = "Gold";
                                                        priceShipping = shipping.gold_price;
                                                        regras = true;
                                                        existeRegras = true;

                                                    }

                                                    if (!regras)
                                                    {
                                                        td_itens_shop.discount_total = null;
                                                        td_itens_shop.unit_price_rules = null;
                                                        td_itens_shop.rules = null;

                                                    }

                                                    db.SaveChanges();
                                                }
                                            }

                                            if (shipping.fl_shipping == "Y")
                                            {
                                                OBJresult.shipping_price = priceShipping;
                                                db.SaveChanges();
                                            }
                                            else
                                            {
                                                OBJresult.shipping_price = 0;
                                                db.SaveChanges();
                                            }
                                        }
                                        else
                                        {
                                            if (totalWeight >= rules.weight_bronze)
                                            {
                                                priceShipping = shipping.bronze_price;
                                            }


                                            if (totalWeight >= rules.weight_silver)
                                            {
                                                priceShipping = shipping.silver_price;
                                            }


                                            if (totalWeight >= rules.weigth_gold)
                                            {
                                                priceShipping = shipping.gold_price;
                                            }

                                            if (shipping.fl_shipping == "Y")
                                            {
                                                OBJresult.shipping_price = priceShipping;
                                                db.SaveChanges();
                                            }
                                            else
                                            {
                                                OBJresult.shipping_price = 0;
                                                db.SaveChanges();
                                            }

                                            for (int i = 0; i < obj.Count; i++)
                                            {

                                                var id_itens = obj[i].id_itens;
                                                var td_itens_shop = (from a in db.td_itens_shop where a.id_itens == id_itens select a).FirstOrDefault();
                                                if (td_itens_shop != null)
                                                {
                                                    td_itens_shop.discount_total = null;
                                                    td_itens_shop.unit_price_rules = null;
                                                    td_itens_shop.rules = null;
                                                }
                                            }

                                            OBJresult.total = valortotal;
                                            OBJresult.discount_total = null;
                                            db.SaveChanges();

                                        }

                                    }
                                    else
                                    {

                                        for (int i = 0; i < obj.Count; i++)
                                        {

                                            var id_itens = obj[i].id_itens;
                                            var td_itens_shop = (from a in db.td_itens_shop where a.id_itens == id_itens select a).FirstOrDefault();
                                            if (td_itens_shop != null)
                                            {
                                                td_itens_shop.discount_total = null;
                                                td_itens_shop.unit_price_rules = null;
                                                td_itens_shop.rules = null;
                                            }
                                        }

                                        OBJresult.total = valortotal;
                                        OBJresult.discount_total = null;
                                        db.SaveChanges();

                                        return Json(new { success = false, error = 2, msg = "error!" }, JsonRequestBehavior.AllowGet);

                                    }

                                    if (existeRegras)
                                    {

                                        var result2 = (from a in db.td_itens_shop where a.id_shop == shop select new { a.discount_total, a.total }).ToList();

                                        if (result2.Count > 0)
                                        {

                                            decimal? valor = 0;

                                            for (int i = 0; i < result2.Count; i++)
                                            {
                                                valor = valor + (result2[i].discount_total == null ? result2[i].total : (result2[i].discount_total > 0 ? result2[i].discount_total : result2[i].total));
                                            }

                                            var result3 = (from a in db.tb_shop where a.id_shop == shop select a).FirstOrDefault();

                                            if (result3 != null)
                                            {
                                                result3.discount_total = valor;
                                                db.SaveChanges();
                                            }
                                        }
                                   }
                                }
                            }
                            else
                            {
                                return Json(new { success = false, error = 2, msg = "there is no shipping registration , to the client states. " }, JsonRequestBehavior.AllowGet);
                            }
                        }
                        else
                        {
                            return Json(new { success = false, error = 2, msg = "error!" }, JsonRequestBehavior.AllowGet);
                        }                       
                    }
                }
                else 
                {
                    return Json(new { success = false, error = 2, msg = "error!" }, JsonRequestBehavior.AllowGet);               
                }

                var result = (from a in db.td_itens_shop
                           join b in db.td_Products on a.id_products equals b.id_products
                           where a.id_shop == shop
                           select new
                           {
                               a.id_itens,
                               b.id_products,
                               b.name,
                               b.flavour,
                               a.amount,
                               b.weight,
                               b.price,
                               a.total,
                               a.discount_total,
                               a.unit_price_rules,
                               a.rules,
                               a.weight_total
                           }).ToList();

                return Json(new { success = true, result, priceShipping = OBJresult.shipping_price }, JsonRequestBehavior.AllowGet);

            }
            catch  {

                return Json(new { success = false, msg = "error!" }, JsonRequestBehavior.AllowGet);          
            }

        }

        public JsonResult UpdateStatus(int id_status, int id_shop)
        {
           try
            {
                var result = (from a in db.tb_shop where a.id_shop == id_shop select a).FirstOrDefault();
                if (result != null)
                {
                    result.id_status = id_status;
                    db.SaveChanges();
                    return Json(new { success = true}, JsonRequestBehavior.AllowGet);
                }
                else {
                    return Json(new { success = false, msg="Try later"}, JsonRequestBehavior.AllowGet);
                }              
            }
            catch {
                return Json(new { success = false, msg = "Try later" }, JsonRequestBehavior.AllowGet);
            }
        }

    }
}
