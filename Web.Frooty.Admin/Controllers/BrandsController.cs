using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Web.Frooty.Admin.Models;
using Web.Frooty.Admin.Util;

namespace Web.Frooty.Admin.Controllers
{
    public class BrandsController : WebPageBase
    {
        private static int W_FixedSize = 1024;
        private static int H_FixedSize = 200;

        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public JsonResult SelectBrands()
        {
            try
            {
                frootyacai_siteEntities db = new frootyacai_siteEntities();

                var result = (from a in db.td_brands
                              select new
                              {
                                  a.id_brands,
                                  a.description,
                                  a.name,
                                  a.fl_active
                              }).OrderByDescending(a => a.id_brands).ToList();

                return Json(new { result }, JsonRequestBehavior.AllowGet);
            }
            catch
            {
                return Json(new { result = false }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        [ValidateInput(false)]
        public JsonResult CadBrands(td_brands dados)
        {
            try
            {
                frootyacai_siteEntities db = new frootyacai_siteEntities();

                db.td_brands.Add(dados);
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
        public JsonResult UpDateBrands(td_brands dados)
        {
            try
            {
                var db = new frootyacai_siteEntities();

                var idBrands = dados.id_brands;

                var result = db.td_brands.FirstOrDefault(a => a.id_brands == idBrands);

                result.name = dados.name;
                result.description = dados.description;
                result.LogoTipoImgUrl = dados.LogoTipoImgUrl;
                result.PosterImgUrl = dados.PosterImgUrl;
                result.fl_active = dados.fl_active;

                db.SaveChanges();

                return Json(new { success = true }, JsonRequestBehavior.AllowGet);
            }
            catch
            {
                return Json(new { success = false }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public JsonResult EditBrands(td_brands dados)
        {
            try
            {
                var db = new frootyacai_siteEntities();

                var result = (from a in db.td_brands
                              where a.id_brands == dados.id_brands

                              select new
                              {
                                  a.id_brands,
                                  a.name,
                                  a.description,
                                  a.LogoTipoImgUrl,
                                  a.PosterImgUrl,
                                  a.fl_active

                              }).FirstOrDefault();

                return Json(new { result }, JsonRequestBehavior.AllowGet);
            }
            catch
            {
                return Json(new { result = false }, JsonRequestBehavior.AllowGet);
            }
        }


        public virtual ActionResult UploadFileLogoTipo()
        {
            HttpPostedFileBase myFile = Request.Files["imagepost_logo"];

            Resize resize = new Resize();

            if (myFile != null && myFile.ContentLength != 0)
            {
                string pathForSaving = Server.MapPath("~/Content/Images/Uploads/Brands/Logo");
                if (this.CreateFolderIfNeeded(pathForSaving))
                {
                    try
                    {
                        var name = "Logo_" + DateTime.Now.ToString().Replace("/", "").Replace(":", "").Trim() + ".jpg";

                        Image workingImage = new Bitmap(myFile.InputStream);

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

        public virtual ActionResult UploadFilePoster()
        {
            HttpPostedFileBase myFile = Request.Files["imagepost_poster"];

            Resize resize = new Resize();

            if (myFile != null && myFile.ContentLength != 0)
            {
                string pathForSaving = Server.MapPath("~/Content/Images/Uploads/Brands/Poster");
                if (this.CreateFolderIfNeeded(pathForSaving))
                {
                    try
                    {
                        var name = "Poster_" + DateTime.Now.ToString().Replace("/", "").Replace(":", "").Trim() + ".jpg";

                        Image workingImage = new Bitmap(myFile.InputStream);

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
