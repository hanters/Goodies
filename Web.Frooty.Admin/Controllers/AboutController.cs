using System;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Configuration;
using System.Web.Mvc;
using Web.Frooty.Admin.Models;
using Web.Frooty.Admin.Util;

namespace Web.Frooty.Admin.Controllers
{
    public class AboutController : WebPageBase
    {
        //
        // GET: /About/

        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public JsonResult SelectAbout()
        {
            try
            {
                frootyacai_siteEntities db = new frootyacai_siteEntities();

                var result = (from a in db.tb_about
                              select new
                              {
                                  a.id_About,
                                  a.aba,
                                  a.title,
                                  a.status
                              }).OrderByDescending(a => a.id_About).ToList();

                return Json(new { result }, JsonRequestBehavior.AllowGet);
            }
            catch
            {
                return Json(new { result = false }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        [ValidateInput(false)]
        public JsonResult CadAbout(tb_about dados)
        {
            try
            {
                frootyacai_siteEntities db = new frootyacai_siteEntities();

                db.tb_about.Add(dados);
                db.SaveChanges();

                return Json(new { success = true }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { success = false }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        [ValidateInput(false)]
        public JsonResult UpDateAbout(tb_about dados)
        {
            try
            {
                var db = new frootyacai_siteEntities();

                var idAbout = dados.id_About;

                var result = db.tb_about.FirstOrDefault(a => a.id_About == idAbout);

                result.title = dados.title;
                result.aba = dados.aba;
                result.text = dados.text;
                result.status = dados.status;

                db.SaveChanges();

                return Json(new { success = true }, JsonRequestBehavior.AllowGet);
            }
            catch
            {
                return Json(new { success = false }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public JsonResult EditAbout(tb_about dados)
        {
            try
            {
                var db = new frootyacai_siteEntities();

                var result = (from a in db.tb_about
                              where a.id_About == dados.id_About

                              select new
                              {
                                  a.id_About,
                                  a.title,
                                  a.aba,
                                  a.text,
                                  a.status

                              }).FirstOrDefault();

                return Json(new { result }, JsonRequestBehavior.AllowGet);
            }
            catch
            {
                return Json(new { result = false }, JsonRequestBehavior.AllowGet);
            }
        }

        public virtual ActionResult UploadFile()
        {
            HttpPostedFileBase myFile = Request.Files["file"];

            if (myFile != null && myFile.ContentLength != 0)
            {
                string pathForSaving = Server.MapPath("~/Content/Images/Uploads/About");

                if (this.CreateFolderIfNeeded(pathForSaving))
                {
                    try
                    {
                        var objIipo = myFile.FileName.Split('.');

                        string tipo = String.Empty;

                        for (int i = 0; i < objIipo.Length; i++)
                        {
                            tipo = objIipo[i];
                        }

                        var name = "About" + DateTime.Now.ToString().Replace("/", "").Replace(":", "").Trim() + "." + tipo;

                        name = name.Replace(" ", "");

                        myFile.SaveAs(Path.Combine(pathForSaving, name));


                        return Json(new { url = WebConfigurationManager.AppSettings["About"] + name }, JsonRequestBehavior.AllowGet);

                    }
                    catch (Exception ex)
                    {
                        return Json(new { isUploaded = false, message = ex.ToString() }, JsonRequestBehavior.AllowGet);
                    }
                }
            }

            return Json(new { isUploaded = false, message = "Error" }, "text/html");
        }

        private bool CreateFolderIfNeeded(string path)
        {
            bool result = true;
            if (!Directory.Exists(path))
            {
                try
                {
                    Directory.CreateDirectory(path);
                }
                catch (Exception)
                {
                    /*TODO: You must process this exception.*/
                    result = false;
                }
            }
            return result;
        }

    }
}
