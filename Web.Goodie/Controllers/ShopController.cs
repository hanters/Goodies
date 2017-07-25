using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Web.Goodie.Models;
using System.Web.Configuration;
using Web.Goodie.Models;
using Web.Goodie.Util;

namespace Web.Goodie.Controllers
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

        public ActionResult Success()
        {
            return View();
        }

        [HttpPost]
        [ValidateInput(false)]
        public JsonResult addItens(td_itens_shop dados)
        {
            try
            {
                //fazer usuario logar
                if (Request.Cookies["goodie-user"] == null)
                {
                    return Json(new { success = false, error = 1 }, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    if (Request.Cookies["goodie-user"].Value == "")
                    {
                        return Json(new { success = false, error = 1 }, JsonRequestBehavior.AllowGet);
                    }
                }

                var partners = Convert.ToInt32(Security.Decrypt(Request.Cookies["goodie-user"].Value));

                // verificar se existe pre compra
                if (Request.Cookies["shop_goodie"] == null)
                {
                    var shop = (from a in db.tb_shop where a.id_partners == partners && a.id_status == 2 select a).FirstOrDefault();

                    if (shop != null)
                    {

                        Response.Cookies.Add(new HttpCookie("shop_goodie", Security.Encrypt(shop.id_shop.ToString())));
                        dados.id_shop = shop.id_shop;

                    }
                    else
                    {

                        var td_shop = new tb_shop
                        {

                            id_status = 2,
                            id_partners = partners,
                            date = DateTime.Now,

                        };

                        db.tb_shop.Add(td_shop);
                        db.SaveChanges();

                        Response.Cookies.Add(new HttpCookie("shop_goodie", Security.Encrypt(td_shop.id_shop.ToString())));

                        dados.id_shop = td_shop.id_shop;

                    }

                }
                else
                {
                    var id_shop = Convert.ToInt32(Security.Decrypt(Request.Cookies["shop_goodie"].Value));
                    var shop = (from a in db.tb_shop where a.id_shop == id_shop select a).FirstOrDefault();

                    if (shop != null)
                    {
                        dados.id_shop = Convert.ToInt32(Security.Decrypt(Request.Cookies["shop_goodie"].Value));
                    }
                    else
                    {
                        var td_shop = new tb_shop
                        {

                            id_status = 2,
                            id_partners = partners,

                        };

                        db.tb_shop.Add(td_shop);
                        db.SaveChanges();

                        Response.Cookies.Add(new HttpCookie("shop_goodie", Security.Encrypt(td_shop.id_shop.ToString())));

                        dados.id_shop = td_shop.id_shop;
                    }
                }

                var id_product = dados.id_products;
                var idShop = dados.id_shop;

                var price = (from a in db.td_Products where a.id_products == id_product select a.price).FirstOrDefault();
                var weight = (from a in db.td_Products where a.id_products == id_product select a.weight).FirstOrDefault();

                var search = (from a in db.td_itens_shop where a.id_products == id_product && a.id_shop == idShop select a).FirstOrDefault();

                if ((price != null) && (weight != null))
                {
                    if (search != null)
                    {
                        search.total = search.total + ((price != null ? price.Value : 0) * dados.amount);
                        search.weight_total = search.weight_total + (weight != null ? weight.Value : 0) * dados.amount;
                        search.amount = search.amount + dados.amount;

                        db.SaveChanges();
                    }
                    else
                    {

                        dados.total = (price != null ? price.Value : 0) * dados.amount;
                        dados.weight_total = (weight != null ? weight.Value : 0) * dados.amount;

                        db.td_itens_shop.Add(dados);
                        db.SaveChanges();

                    }

                    var resuslt = (from a in db.td_itens_shop where a.id_shop == idShop select new { a.total }).ToList();

                    if (resuslt.Count > 0)
                    {

                        var obj = (from a in db.td_itens_shop
                                   join b in db.td_Products on a.id_products equals b.id_products
                                   where a.id_shop == idShop && b.id_status == 2
                                   select new
                                   {
                                       a.id_itens,
                                   }).ToList();

                        if (obj.Count > 0)
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
                        }


                        var total = resuslt.Sum(a => a.total).Value;
                        var result = (from a in db.tb_shop where a.id_shop == idShop select a).FirstOrDefault();

                        if (result != null)
                        {
                            result.total = total;
                            result.discount_total = null;
                            db.SaveChanges();
                        }
                    }

                    return Json(new { success = true }, JsonRequestBehavior.AllowGet);
                }
                else
                {

                    return Json(new { success = false, erro = 2, msg = "Pease, \n\n try later" }, JsonRequestBehavior.AllowGet);

                }
            }
            catch
            {
                return Json(new { success = false, erro = 2, msg = "Pease, \n\n try later" }, JsonRequestBehavior.AllowGet);
            }

        }

        [HttpPost]
        public JsonResult ListCart()
        {
            try
            {
                if ((Request.Cookies["shop_goodie"] != null) || (Request.Cookies["shop_goodie"].Value != ""))
                {
                    var id_shop = Convert.ToInt32(Security.Decrypt(Request.Cookies["shop_goodie"].Value));
                    var obj = (from a in db.td_itens_shop
                               join b in db.td_Products on a.id_products equals b.id_products
                               where a.id_shop == id_shop && b.id_status == 2
                               select new
                               {
                                   a.id_itens,
                                   a.id_products,
                                   a.amount,
                                   b.name,
                                   b.flavour,
                                   b.weight,
                                   b.price,
                                   a.total

                               }).ToList();
                    var total = obj.Count;
                    return Json(new { Result = obj, total }, JsonRequestBehavior.AllowGet);
                }
                else
                {

                    return Json(new { success = false, error = 1, total = 0 }, JsonRequestBehavior.AllowGet);
                }

            }
            catch
            {

                return Json(new { success = false, error = 1, total = 0 }, JsonRequestBehavior.AllowGet);
            }

        }

        [HttpPost]
        public JsonResult RemoveListCart(int id_iten)
        {
            try
            {
                db.Database.ExecuteSqlCommand(@"DELETE FROM td_itens_shop WHERE id_itens = " + id_iten);
                db.SaveChanges();


                var idShop = Convert.ToInt32(Security.Decrypt(Request.Cookies["shop_goodie"].Value));

                var resuslt = (from a in db.td_itens_shop where a.id_shop == idShop select new { a.total }).ToList();


                var obj = (from a in db.td_itens_shop
                           join b in db.td_Products on a.id_products equals b.id_products
                           where a.id_shop == idShop && b.id_status == 2
                           select new
                           {
                               a.id_itens,
                           }).ToList();

                if (obj.Count > 0)
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
                }


                if (resuslt.Count > 0)
                {
                    var total = resuslt.Sum(a => a.total).Value;

                    var result_ = (from a in db.tb_shop where a.id_shop == idShop select a).FirstOrDefault();

                    if (result_ != null)
                    {
                        result_.total = total;
                        result_.discount_total = 0;
                        db.SaveChanges();
                    }
                }


                return Json(new { success = true, }, JsonRequestBehavior.AllowGet);
            }
            catch
            {

                return Json(new { success = false }, JsonRequestBehavior.AllowGet);

            }

        }

        [HttpPost]
        public JsonResult Partners()
        {
            try
            {
                var id_partners = (Request.Cookies["goodie-user"] == null ? 0 : (Request.Cookies["goodie-user"].Value == "" ? 0 : Convert.ToInt32(Security.Decrypt(Request.Cookies["goodie-user"].Value))));

                var idShop = Convert.ToInt32(Security.Decrypt(Request.Cookies["shop_goodie"].Value));

                var obj = (from a in db.td_itens_shop
                           join b in db.td_Products on a.id_products equals b.id_products
                           where a.id_shop == idShop && b.id_status == 2
                           select new
                           {
                               a.id_itens,
                           }).ToList();

                if (obj.Count > 0)
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
                }

                var resuslt = (from a in db.td_itens_shop where a.id_shop == idShop select new { a.total }).ToList();

                if (resuslt.Count > 0)
                {
                    var total = resuslt.Sum(a => a.total).Value;

                    var result_ = (from a in db.tb_shop where a.id_shop == idShop select a).FirstOrDefault();

                    if (result_ != null)
                    {
                        result_.total = total;
                        result_.discount_total = null;
                        db.SaveChanges();
                    }
                }


                var result = (from a in db.tb_partners
                              join b in db.tb_states on a.id_state equals b.id_state
                              where a.id_partners == id_partners
                              select new
                              {
                                  a.id_partners,
                                  a.name,
                                  a.lastname,
                                  a.birthday,
                                  a.email,
                                  a.password,
                                  a.company,
                                  a.taxID,
                                  a.phone,
                                  a.address,
                                  a.zipCode,
                                  a.city,
                                  a.state,
                                  a.id_state,
                                  id_country = (from c in db.tb_country where c.id_country == b.id_country select c.id_country).FirstOrDefault(),
                                  a.id_business,
                                  a.id_statusPartners,
                              }).FirstOrDefault();


                if (result != null)
                {

                    var id_state = result.id_state;

                    tb_shipping shipping = (from a in db.tb_shipping
                                            join b in db.tb_grupo_shipping on a.id_shipping equals b.id_shipping
                                            where b.id_state == id_state
                                            select a).FirstOrDefault();
                    if (shipping == null)
                    {
                        return Json(new { success = false, msg = "We don't deliver in your State yet, please try again in a couple of months." }, JsonRequestBehavior.AllowGet);
                    }

                }
                else
                {
                    return Json(new { success = false, msg = "Try Later" }, JsonRequestBehavior.AllowGet);
                }

                return Json(new { result, success = true }, JsonRequestBehavior.AllowGet);
            }
            catch
            {
                return Json(new { success = false, msg = "Try Later" }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        [ValidateInput(false)]
        public JsonResult upDatePartners(tb_partners dados)
        {
            try
            {

                if (Request.Cookies["goodie-user"] == null)
                {
                    return Json(new { success = false, error = 1 }, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    if (Request.Cookies["goodie-user"].Value == "")
                    {
                        return Json(new { success = false, error = 1 }, JsonRequestBehavior.AllowGet);
                    }
                }

                frootyacai_siteEntities db = new frootyacai_siteEntities();

                var result = db.tb_partners.Where(a => a.id_partners == dados.id_partners).FirstOrDefault();

                if (result != null)
                {
                    result.name = dados.name;
                    result.lastname = dados.lastname;
                    result.email = dados.email;
                    result.company = dados.company;
                    result.taxID = dados.taxID;
                    result.phone = dados.phone;
                    result.address = dados.address;
                    result.zipCode = dados.zipCode;
                    result.city = dados.city;
                    result.id_state = dados.id_state;
                    result.id_business = dados.id_business;
                    db.SaveChanges();

                    return Json(new { success = true }, JsonRequestBehavior.AllowGet);
                }
                else
                {

                    return Json(new { success = false, error = 2, msg = "Try later" }, JsonRequestBehavior.AllowGet);
                }
            }
            catch
            {
                return Json(new { success = false, msg = "Try later" }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public JsonResult RulesListCart()
        {
            try
            {
                if ((Request.Cookies["shop_goodie"] != null) || (Request.Cookies["shop_goodie"].Value != ""))
                {
                    tb_shipping shipping = null;
                    tb_shop OBJresult = null;
                    decimal? priceShipping = null;

                    var id_shop = Convert.ToInt32(Security.Decrypt(Request.Cookies["shop_goodie"].Value));
                    var id_shop_cript = Request.Cookies["shop_goodie"].Value;
                    var obj = (from a in db.td_itens_shop
                               join b in db.td_Products on a.id_products equals b.id_products
                               where a.id_shop == id_shop && b.id_status == 2
                               select new
                               {
                                   a.id_itens,
                                   a.id_products,
                                   a.amount,
                                   b.name,
                                   b.flavour,
                                   b.weight,
                                   b.price,
                                   a.weight_total,
                                   a.total
                               }).ToList();

                    if (obj.Count > 0)
                    {
                        var totalWeight = obj.Sum(a => a.weight_total).Value;
                        var valortotal = obj.Sum(a => a.total).Value;
                        OBJresult = (from a in db.tb_shop where a.id_shop == id_shop select a).FirstOrDefault();

                        if (OBJresult != null)
                        {

                            var partners = (Request.Cookies["goodie-user"].Value == null ? 0 : (Request.Cookies["goodie-user"].Value == "" ? 0 : Convert.ToInt32(Security.Decrypt(Request.Cookies["goodie-user"].Value))));
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

                                                    if (td_itens_shop != null)
                                                    {

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

                                        return Json(new { success = false, error = 2, msg = "Try later" }, JsonRequestBehavior.AllowGet);

                                    }

                                    if (existeRegras)
                                    {

                                        var result2 = (from a in db.td_itens_shop where a.id_shop == id_shop select new { a.discount_total, a.total }).ToList();

                                        if (result2.Count > 0)
                                        {

                                            decimal? valor = 0;

                                            for (int i = 0; i < result2.Count; i++)
                                            {
                                                valor = valor + (result2[i].discount_total == null ? result2[i].total : (result2[i].discount_total > 0 ? result2[i].discount_total : result2[i].total));
                                            }

                                            var result3 = (from a in db.tb_shop where a.id_shop == id_shop select a).FirstOrDefault();

                                            if (result3 != null)
                                            {
                                                result3.discount_total = valor;
                                                db.SaveChanges();

                                            }
                                        }
                                    }

                                }
                                else
                                {
                                    //verificar o que fazer  com shipping
                                    return Json(new { success = false, error = 2, msg = "We don't deliver in your State yet, please try again in a couple of months." }, JsonRequestBehavior.AllowGet);
                                }
                            }
                            else
                            {
                                return Json(new { success = false, error = 1 }, JsonRequestBehavior.AllowGet);
                            }

                        }
                        else
                        {

                            return Json(new { success = false, error = 1 }, JsonRequestBehavior.AllowGet);
                        }
                    }
                    else
                    {

                        return Json(new { success = false, error = 1 }, JsonRequestBehavior.AllowGet);
                    }

                    var Result = (from a in db.td_itens_shop
                                  join b in db.td_Products on a.id_products equals b.id_products
                                  where a.id_shop == id_shop
                                  select new
                                  {
                                      id_shop = id_shop_cript,
                                      a.id_itens,
                                      a.id_products,
                                      a.amount,
                                      b.name,
                                      b.flavour,
                                      b.weight,
                                      b.price,
                                      a.weight_total,
                                      a.total,
                                      a.discount_total,
                                      a.unit_price_rules
                                  }).ToList();

                    return Json(new { Result, priceShipping = OBJresult.shipping_price, success = true }, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    return Json(new { success = false, error = 1 }, JsonRequestBehavior.AllowGet);
                }
            }
            catch
            {
                return Json(new { success = false, error = 0 }, JsonRequestBehavior.AllowGet);
            }

        }
    }
}