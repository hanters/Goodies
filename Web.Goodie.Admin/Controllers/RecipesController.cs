using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.IO;
using Web.Frooty.Admin.Models;
using Web.Frooty.Admin.Util;
using System.Drawing;
using System.Drawing.Imaging;

namespace Web.Frooty.Admin.Controllers
{
    public class RecipesController : WebPageBase
    {
        private static int W_FixedSize = 1024;
        private static int H_FixedSize = 200;
    
        public ActionResult NewPost()
        {
            return View();
        }

        public ActionResult Overview()
        {
            return View();
        }

        [HttpPost]
        [ValidateInput(false)]
        public JsonResult CadRecipes(tb_recipes dados)
        {
            try
            {
                frootyacai_siteEntities db = new frootyacai_siteEntities();

                dados.id_user_cadm = Convert.ToInt32(SessaoUtil.Recuperar("id_login"));
                dados.ts_user_cadm = DateTime.Now;
                dados.id_user_manu = Convert.ToInt32(SessaoUtil.Recuperar("id_login"));
                dados.ts_user_manu = DateTime.Now;

                db.tb_recipes.Add(dados);
                db.SaveChanges();

                return Json(new { success = true }, JsonRequestBehavior.AllowGet);
            }
            catch
            {
                return Json(new { success = false }, JsonRequestBehavior.AllowGet);
            }

        }

        [HttpPost]
        public JsonResult SelectRecipes()
        {
            try
            {
                frootyacai_siteEntities db = new frootyacai_siteEntities();

                var result = (from a in db.tb_recipes
                              join b in db.tb_login on a.id_user_cadm equals b.id_login
                              join c in db.tb_status on a.id_status equals c.id_status
                              select new
                              {
                                  a.id_recipes,
                                  a.title,
                                  b.name,
                                  a.ts_user_cadm,
                                  c.status
                              }).OrderByDescending(a => a.id_recipes).ToList();

                return Json(new { result }, JsonRequestBehavior.AllowGet);
            }
            catch
            {
                return Json(new { result = false }, JsonRequestBehavior.AllowGet);
            }
        }


        [HttpPost]
        public JsonResult EditRecipes(tb_recipes dados)
        {
            try
            {
                frootyacai_siteEntities db = new frootyacai_siteEntities();

                var result = (from a in db.tb_recipes
                              where a.id_recipes == dados.id_recipes

                              select new
                              {
                                  a.id_recipes,
                                  a.title,
                                  a.tags,
                                  a.introduction,
                                  a.image,
                                  a.content      
                              }).FirstOrDefault();

                return Json(new { result }, JsonRequestBehavior.AllowGet);
            }
            catch
            {
                return Json(new { result = false }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        [ValidateInput(false)]
        public JsonResult upDateRecipes(tb_recipes dados)
        {
            try
            {
                frootyacai_siteEntities db = new frootyacai_siteEntities();

                var result = db.tb_recipes.Where(a => a.id_recipes == dados.id_recipes).FirstOrDefault();


                result.title = dados.title;
                result.tags = dados.tags;
                result.introduction = dados.introduction;
                result.image = dados.image;
                result.content = dados.content;
                result.id_status = dados.id_status;
                result.id_user_manu = Convert.ToInt32(SessaoUtil.Recuperar("id_login"));
                result.ts_user_manu = DateTime.Now;
                result.url = dados.url;

                db.SaveChanges();

                return Json(new { success = true }, JsonRequestBehavior.AllowGet);
            }
            catch
            {
                return Json(new { success = false }, JsonRequestBehavior.AllowGet);
            }
        }

        public virtual ActionResult UploadFile()
        {
            HttpPostedFileBase myFile = Request.Files["imagepost"];

            Resize resize = new Resize();

            if (myFile != null && myFile.ContentLength != 0)
            {
                string pathForSaving = Server.MapPath("~/Content/Images/Uploads/Recipes");
                if (this.CreateFolderIfNeeded(pathForSaving))
                {
                    try
                    {
                        var name = "Recipes_" + DateTime.Now.ToString().Replace("/", "").Replace(":", "").Trim() + ".jpg";

                        Image  workingImage = new Bitmap(myFile.InputStream);
                        
                        double Height = workingImage.Size.Height;
                        double Width = workingImage.Size.Width;
                        double Height_new = Height / Width * 1024;
                        H_FixedSize = Convert.ToInt16(Height_new);

                        W_FixedSize = 1024;
                        var returnImage = ModifyImage(0, 0, W_FixedSize, H_FixedSize, resize.ImageToByteArray(workingImage));
                        returnImage.Save(Path.Combine(pathForSaving, name));

                        W_FixedSize = 400;
                        Height = returnImage.Size.Height;
                        Width = returnImage.Size.Width;
                        Height_new = Height / Width * W_FixedSize;
                        H_FixedSize = Convert.ToInt16(Height_new);

                        var returnImageThumb = ModifyImage(0, 0, W_FixedSize, H_FixedSize, resize.ImageToByteArray(returnImage));
                        returnImageThumb.Save(Path.Combine(pathForSaving + "/thumbs", name));


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

        private Image ModifyImage(int x, int y, int w, int h, byte[] WorkingImage)
        {
            Resize resize = new Resize();
            Image returnImage;

            Image img = resize.ByteArrayToImage(WorkingImage);

            using (System.Drawing.Bitmap _bitmap = new System.Drawing.Bitmap(w, h))
            {
                _bitmap.SetResolution(img.HorizontalResolution, img.VerticalResolution);
                using (Graphics _graphic = Graphics.FromImage(_bitmap))
                {
                    _graphic.InterpolationMode = System.Drawing.Drawing2D.InterpolationMode.HighQualityBicubic;
                    _graphic.SmoothingMode = System.Drawing.Drawing2D.SmoothingMode.HighQuality;
                    _graphic.PixelOffsetMode = System.Drawing.Drawing2D.PixelOffsetMode.HighQuality;
                    _graphic.CompositingQuality = System.Drawing.Drawing2D.CompositingQuality.HighQuality;

                  
                    _graphic.DrawImage(img, 0, 0, img.Width, img.Height);
                    _graphic.DrawImage(img, new Rectangle(0, 0, W_FixedSize, H_FixedSize), 0, 0, img.Width, img.Height, GraphicsUnit.Pixel);
                  
                    string extension = ".jpg";

                    // If the image is a gif file, change it into png
                    if (extension.EndsWith("gif", StringComparison.OrdinalIgnoreCase))
                    {
                        extension = ".png";
                    }

                    using (EncoderParameters encoderParameters = new EncoderParameters(1))
                    {
                        encoderParameters.Param[0] = new EncoderParameter(Encoder.Quality, 100L);

                        MemoryStream ms = new MemoryStream(resize.ImageToByteArray(_bitmap, extension, encoderParameters));
                        returnImage = Image.FromStream(ms);                       
                    }
                }
            }

            return returnImage;
        }
    }
}
