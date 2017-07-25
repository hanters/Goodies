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
    public class LauncherController : WebPageBase
    {
        //
        // GET: /Launcher/

        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        [ValidateInput(false)]
        public JsonResult CadLauncher(tb_launcher dados)
        {
            try
            {
                frootyacai_siteEntities db = new frootyacai_siteEntities();

                dados.active = true;
                dados.id_user_cadm = Convert.ToInt32(SessaoUtil.Recuperar("id_login"));
                dados.ts_user_cadm = DateTime.Now;
                dados.id_user_manu = Convert.ToInt32(SessaoUtil.Recuperar("id_login"));
                dados.ts_user_manu = DateTime.Now;

                db.tb_launcher.Add(dados);
                db.SaveChanges();

                return Json(new { success = true }, JsonRequestBehavior.AllowGet);
            }
            catch
            {
                return Json(new { success = false }, JsonRequestBehavior.AllowGet);
            }

        }

        [HttpPost]
        [ValidateInput(false)]
        public JsonResult UpdateActicve(tb_launcher dados)
        {
            try
            {
                frootyacai_siteEntities db = new frootyacai_siteEntities();

                var result = (from a in db.tb_launcher where a.id_launcher == dados.id_launcher select a).First();

                result.active = dados.active;
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
        public JsonResult SelectLauncher()
        {
            try
            {
                frootyacai_siteEntities db = new frootyacai_siteEntities();

                var result = (from a in db.tb_launcher
                              select new
                              {
                                  a.id_launcher,
                                  a.title,
                                  a.url,
                                  a.image,
                                  a.active,
                                  a.ts_user_cadm,
                              }).OrderByDescending(a => a.id_launcher).ToList();

                return Json(new { result }, JsonRequestBehavior.AllowGet);
            }
            catch
            {
                return Json(new { result = false }, JsonRequestBehavior.AllowGet);
            }
        }


        public virtual ActionResult UploadFile()
        {
            HttpPostedFileBase myFile = Request.Files["imagepost"];

            if (myFile != null && myFile.ContentLength != 0)
            {
                string pathForSaving = Server.MapPath("~/Content/Images/Uploads/Launcher");
                if (this.CreateFolderIfNeeded(pathForSaving))
                {
                    try
                    {

                        char[] chars = new char[1];
                        chars[0] = '.';
                        string[] array = myFile.FileName.Split(new string[] { "." }, StringSplitOptions.None);

                        var name = "Launcher" + DateTime.Now.ToString().Replace("/", "").Replace(":", "").Trim() + "." + array[1];
                        myFile.SaveAs(Path.Combine(pathForSaving, name));
                        return Json(new { isUploaded = true, message = name }, "text/html");
                    }
                    catch (Exception ex)
                    {
                        return Json(new { isUploaded = false, message = ex.ToString() }, "text/html");
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
