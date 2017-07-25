using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.IO;
using Web.Frooty.Admin.Models;
using Web.Frooty.Admin.Util;

namespace Web.Frooty.Admin.Controllers
{
    public class PartnersController : WebPageBase
    {
        //
        // GET: /Partners/

        public ActionResult Overview()
        {
            frootyacai_siteEntities db = new frootyacai_siteEntities();
            var result = (from a in db.tb_business select a).ToList();

            var statusPartners = (from c in db.tb_statusPartners  select c).ToList();
            ViewData["id_statusPartners"] = new SelectList(statusPartners, "id_statusPartners", "statusPartners");

            var result_ = (from a in db.tb_status_shop select new { a.id_status, a.description }).ToList();
            ViewData["id_status"] = new SelectList(result_, "id_status", "description");

            var Country = (from a in db.tb_country where a.fl_active == "1" select new { a.id_country, a.ds_name }).ToArray();
            ViewData["id_country"] = new SelectList(Country, "id_country", "ds_name");

            return View(result);
        }

        public ActionResult Pendent()
        {
            return View();
        }

        public ActionResult Edit()
        {
            return View();
        }


        [HttpPost]
        [ValidateInput(false)]
        public JsonResult CadPartners(tb_partners dados)
        {
            try
            {
                frootyacai_siteEntities db = new frootyacai_siteEntities();
                var email = dados.email.ToUpper();

                var Result = (from a in db.tb_partners where a.email.ToUpper() == email select a).ToList();

                if (Result == null)
                {
                    dados.password = Security.Encrypt(dados.password);

                    dados.id_user_cadm = Convert.ToInt32(SessaoUtil.Recuperar("id_login"));
                    dados.ts_user_cadm = DateTime.Now;
                    dados.id_user_manu = Convert.ToInt32(SessaoUtil.Recuperar("id_login"));
                    dados.ts_user_manu = DateTime.Now;

                    db.tb_partners.Add(dados);
                    db.SaveChanges();

                }
                else
                {
                    return Json(new { success = false, msg = "Existing Partners" }, JsonRequestBehavior.AllowGet);
                
                }
                
                

                return Json(new { success = true }, JsonRequestBehavior.AllowGet);
            }
            catch
            {
                return Json(new { success = false }, JsonRequestBehavior.AllowGet);
            }

        }

        [HttpPost]
        public JsonResult SelectPartners()
        {
            try
            {
                frootyacai_siteEntities db = new frootyacai_siteEntities();
                var result = (from a in db.tb_partners
                              join b in db.tb_business on a.id_business equals b.id_business
                              join c in db.tb_statusPartners on a.id_statusPartners equals c.id_statusPartners
                              select new
                              {
                                  a.id_partners,
                                  a.company,
                                  a.name,
                                  a.phone,
                                  c.statusPartners,
                                  b.business
                              }).OrderByDescending(a => a.id_partners).ToList();

                return Json(new { result }, JsonRequestBehavior.AllowGet);
            }
            catch
            {
                return Json(new { result = false }, JsonRequestBehavior.AllowGet);
            }
        }


        [HttpPost]
        public JsonResult SelectPartnersPendent()
        {
            try
            {
                frootyacai_siteEntities db = new frootyacai_siteEntities();
                var result = (from a in db.tb_partners
                              join b in db.tb_business on a.id_business equals b.id_business
                              join c in db.tb_statusPartners on a.id_statusPartners equals c.id_statusPartners
                              where c.id_statusPartners == 1
                              select new
                              {
                                  a.id_partners,
                                  a.company,
                                  a.name,
                                  a.phone,
                                  c.statusPartners,
                                  b.business
                              }).OrderByDescending(a => a.id_partners).ToList();

                return Json(new { result }, JsonRequestBehavior.AllowGet);
            }
            catch
            {
                return Json(new { result = false }, JsonRequestBehavior.AllowGet);
            }
        }


        [HttpPost]
        public JsonResult EditPartners(tb_partners dados)
        {
            try
            {
                frootyacai_siteEntities db = new frootyacai_siteEntities();
                tb_partners result = new tb_partners();

                var result_ = (from a in db.tb_partners
                               join b in db.tb_states on a.id_state equals b.id_state
                              where a.id_partners == dados.id_partners
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
                                  id_country = (from c in db.tb_country where c.id_country == b.id_country select c.id_country).FirstOrDefault(),
                                  a.state,
                                  a.id_state,
                                  a.id_business,
                                  a.id_statusPartners,
                              }
                              ).ToList();

                if (result_ != null) {

                    try
                    {
                                 result.id_partners = result_[0].id_partners;
                                 result.name = result_[0].name;
                                 result.lastname = result_[0].lastname;
                                 result.birthday = result_[0].birthday;
                                 result.email = result_[0].email;
                                 result.password = Security.Decrypt(result_[0].password);
                                 result.company = result_[0].company;
                                 result.taxID = result_[0].taxID;
                                 result.phone = result_[0].phone;
                                 result.address = result_[0].address;
                                 result.zipCode = result_[0].zipCode;
                                 result.city = result_[0].city;
                                 result.id_state = result_[0].id_state;
                                 result.state = result_[0].id_country.ToString();
                                 result.id_business = result_[0].id_business;
                                 result.id_statusPartners = result_[0].id_statusPartners;
                        
                    }catch
                    {

                        result.id_partners = result_[0].id_partners;
                        result.name = result_[0].name;
                        result.lastname = result_[0].lastname;
                        result.birthday = result_[0].birthday;
                        result.email = result_[0].email;
                        result.password = result_[0].password;
                        result.company = result_[0].company;
                        result.taxID = result_[0].taxID;
                        result.phone = result_[0].phone;
                        result.address = result_[0].address;
                        result.zipCode = result_[0].zipCode;
                        result.city = result_[0].city;
                        result.id_state = result_[0].id_state;
                        result.state = result_[0].id_country.ToString();
                        result.id_business = result_[0].id_business;
                        result.id_statusPartners = result_[0].id_statusPartners;
                    
                    }      
                
                }

                return Json(new { result }, JsonRequestBehavior.AllowGet);
            }
            catch
            {
                return Json(new { result = false }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        [ValidateInput(false)]
        public JsonResult upDatePartners(tb_partners dados)
        {
            try
            {
                frootyacai_siteEntities db = new frootyacai_siteEntities();

                var result = db.tb_partners.Where(a => a.id_partners == dados.id_partners).FirstOrDefault();

                result.id_partners = dados.id_partners ;
                result.name = dados.name ;
                result.lastname = dados.lastname ;
                result.birthday = dados.birthday ;
                result.email = dados.email ;
                result.password = Security.Encrypt(dados.password) ;
                result.company = dados.company ;
                result.taxID = dados.taxID ;
                result.phone = dados.phone ;
                result.address = dados.address ;
                result.zipCode = dados.zipCode ;
                result.city = dados.city ;
                result.id_state = dados.id_state;
                result.id_business = dados.id_business ;
                result.id_statusPartners = dados.id_statusPartners;
                result.id_user_manu = Convert.ToInt32(SessaoUtil.Recuperar("id_login"));
                result.ts_user_manu = DateTime.Now;

                db.SaveChanges();

                return Json(new { success = true }, JsonRequestBehavior.AllowGet);
            }
            catch
            {
                return Json(new { success = false }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public JsonResult listState(int id_country)
        {
            try
            {
                frootyacai_siteEntities db = new frootyacai_siteEntities();

                var result = (from a in db.tb_states where a.fl_active == "1" && a.id_country == id_country select new { a.id_state, a.ds_name }).ToArray();

                return Json(new { result }, JsonRequestBehavior.AllowGet);
            }
            catch
            {
                return Json(new { result = false }, JsonRequestBehavior.AllowGet);
            }

        }
        
  
    }
}
